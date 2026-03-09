import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  getCompanies,
  getJobs,
  getWorker,
  getWorkerInvitesByCompany,
  jobReminderAlreadySent,
  insertJobReminderSent,
} from "@/lib/data";
import { createShortLink } from "@/lib/shortLink";
import { sendSms } from "@/lib/twilio";
import { routes } from "@/lib/routes";
import { NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fieldcrew.app");

function parseJobStartAt(startDate: string | undefined, time: string | undefined): Date | null {
  if (!startDate) return null;
  const t = (time ?? "00:00").trim();
  const iso = `${startDate}T${t.includes(":") ? t : t + ":00"}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function isInWindow(
  jobStart: Date,
  now: Date,
  hoursWindow: number
): boolean {
  const end = new Date(now.getTime() + hoursWindow * 60 * 60 * 1000);
  return jobStart >= now && jobStart <= end;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-cron-secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const companies = await getCompanies(supabase);
  const now = new Date();
  let sent = 0;
  let skipped = 0;

  for (const company of companies) {
    const hours = company.settings?.jobReminderHours ?? 0;
    if (hours <= 0) continue;

    const jobs = await getJobs(company.id, undefined, supabase);
    const invites = await getWorkerInvitesByCompany(company.id, supabase);

    for (const job of jobs) {
      const jobStart = parseJobStartAt(job.startDate ?? job.date, job.time);
      if (!jobStart || !isInWindow(jobStart, now, hours)) continue;

      const workerIds = job.workerIds ?? [];
      for (const workerId of workerIds) {
        const invite = invites.find(
          (i) => i.workerId === workerId && new Date(i.expiresAt) > now
        );
        if (!invite) {
          skipped++;
          continue;
        }

        const already = await jobReminderAlreadySent(job.id, workerId, supabase);
        if (already) {
          skipped++;
          continue;
        }

        const worker = await getWorker(workerId, supabase);
        if (!worker?.phone) {
          skipped++;
          continue;
        }

        const fullPath = routes.worker.job(invite.token, job.id);
        const shortCode = await createShortLink(supabase, fullPath);
        const link = `${APP_ORIGIN}/s/${shortCode}`;
        const hoursUntil = Math.round(
          (jobStart.getTime() - now.getTime()) / (60 * 60 * 1000)
        );
        const message =
          hoursUntil <= 1
            ? `FieldCrew: Job "${job.name}" at ${job.address} starts soon. Open job: ${link}`
            : `FieldCrew: Job "${job.name}" at ${job.address} starts in ${hoursUntil} hours. Open job: ${link}`;

        const ok = await sendSms(worker.phone, message);
        if (ok) {
          await insertJobReminderSent(job.id, workerId, supabase);
          sent++;
        } else {
          skipped++;
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
