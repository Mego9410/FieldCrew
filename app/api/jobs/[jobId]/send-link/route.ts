import { createClient } from "@/lib/supabase/server";
import {
  getCompanyForCurrentUser,
  getJob,
  getWorker,
  getWorkerInvitesByCompany,
} from "@/lib/data";
import { createShortLink } from "@/lib/shortLink";
import { sendSms } from "@/lib/twilio";
import { routes } from "@/lib/routes";
import { NextResponse } from "next/server";

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fieldcrew.app");

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const job = await getJob(jobId, supabase);
  if (!job || job.companyId !== company.id) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const workerIds = job.workerIds ?? [];
  if (workerIds.length === 0) {
    return NextResponse.json(
      { error: "No workers assigned to this job" },
      { status: 400 }
    );
  }

  const invites = await getWorkerInvitesByCompany(company.id, supabase);
  const now = new Date();
  let sent = 0;
  let skipped = 0;

  for (const workerId of workerIds) {
    const invite = invites.find(
      (i) => i.workerId === workerId && new Date(i.expiresAt) > now
    );
    if (!invite) {
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
    const message = `FieldCrew: Job "${job.name}" at ${job.address}. Open job: ${link}`;

    const ok = await sendSms(worker.phone, message);
    if (ok) sent++;
    else skipped++;
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
