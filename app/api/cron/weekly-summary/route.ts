import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanies, getJobs } from "@/lib/data";
import { getCompanyOwnerRecipient } from "@/lib/email/recipients";
import { logEmailSent, wasEmailSent } from "@/lib/email/deliveryLog";
import { sendTemplateEmail } from "@/lib/email/resend";

const CRON_SECRET = process.env.CRON_SECRET;
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fieldcrew.app");

function authCron(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-cron-secret");
  return Boolean(CRON_SECRET && secret === CRON_SECRET);
}

function hoursBetween(startIso: string, endIso: string, breaksMinutes: number) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!isFinite(start) || !isFinite(end) || end <= start) return 0;
  const mins = (end - start) / 60000 - (breaksMinutes || 0);
  return Math.max(0, mins / 60);
}

export async function POST(request: Request) {
  if (!authCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceRoleClient();
  if (!supabase) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const companies = await getCompanies(supabase);
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekRange = `${weekStart.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`;

  let sent = 0;
  let skipped = 0;

  for (const company of companies) {
    if (!company.settings?.weeklyLabourSummaryEmail) {
      skipped++;
      continue;
    }

    const recipient = await getCompanyOwnerRecipient({ supabase, companyId: company.id });
    if (!recipient) {
      skipped++;
      continue;
    }

    const providerEventId = `weekly-summary:${company.id}:${weekStart.toISOString().slice(0, 10)}`;
    const templateAlias = "fieldcrew-product-weekly-summary";
    const already = await wasEmailSent({
      supabase,
      provider: "cron",
      providerEventId,
      templateAlias,
      recipientEmail: recipient.email,
    });
    if (already) {
      skipped++;
      continue;
    }

    // Jobs in last 7 days (use job.date or start_date; keep tolerant)
    const jobs = await getJobs(company.id, undefined, supabase);
    const jobsInWindow = jobs.filter((j) => {
      const d = j.startDate ?? j.date ?? null;
      if (!d) return false;
      const t = new Date(d).getTime();
      return isFinite(t) && t >= weekStart.getTime() && t <= now.getTime();
    });
    const jobsCompleted = jobsInWindow.filter((j) => j.status === "completed").length;

    // Sum hours from time_entries for those job IDs.
    const jobIds = jobs.map((j) => j.id);
    let totalHours = 0;
    let overtimeHours = 0;
    if (jobIds.length > 0) {
      type TimeEntryRow = {
        job_id: string;
        start: string;
        end: string;
        breaks: number | null;
        is_overtime: boolean | null;
      };
      const { data: entries } = await supabase
        .from("time_entries")
        .select("job_id,start,end,breaks,is_overtime")
        .in("job_id", jobIds);

      for (const r of (entries as TimeEntryRow[] | null) ?? []) {
        const start = String(r.start ?? "");
        if (new Date(start).getTime() < weekStart.getTime()) continue;
        const h = hoursBetween(String(r.start), String(r.end), Number(r.breaks ?? 0));
        totalHours += h;
        if (r.is_overtime) overtimeHours += h;
      }
    }

    const dashboardUrl = `${APP_ORIGIN.replace(/\/$/, "")}/app`;
    await sendTemplateEmail({
      to: recipient.email,
      templateId: templateAlias,
      variables: {
        COMPANY_NAME: company.name,
        WEEK_RANGE: weekRange,
        JOBS_COMPLETED: jobsCompleted,
        TOTAL_HOURS: totalHours.toFixed(1),
        OVERTIME_HOURS: overtimeHours.toFixed(1),
        HIGHLIGHTS: `Jobs created/scheduled: ${jobsInWindow.length}`,
        DASHBOARD_URL: dashboardUrl,
      },
    });

    await logEmailSent({
      supabase,
      provider: "cron",
      providerEventId,
      templateAlias,
      companyId: company.id,
      recipientEmail: recipient.email,
      metadata: { jobsCompleted, totalHours, overtimeHours },
    });

    sent++;
  }

  return NextResponse.json({ ok: true, sent, skipped, weekRange });
}

