import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function parseJobDate(job: Record<string, unknown>): Date | null {
  const startDate = (job.start_date as string | undefined) ?? undefined;
  const date = (job.date as string | undefined) ?? undefined;
  const s = (startDate ?? date ?? "").trim();
  if (!s) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const { companyId } = await params;

  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  // Jobs: no created_at, so use scheduled job date/start_date as a proxy.
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id,date,start_date")
    .eq("company_id", companyId);

  const jobDates = (jobs ?? [])
    .map((j) => ({ id: (j as { id: string }).id, date: parseJobDate(j as Record<string, unknown>) }))
    .filter((x) => x.date);

  const jobs7 = jobDates.filter((j) => (j.date as Date) >= since7).length;
  const jobs30 = jobDates.filter((j) => (j.date as Date) >= since30).length;

  const jobIds = (jobs ?? []).map((j) => (j as { id: string }).id);

  // Time entries: use start time (timestamptz).
  let timeEntries7 = 0;
  let timeEntries30 = 0;
  let activeWorkers7 = 0;
  let activeWorkers30 = 0;

  if (jobIds.length > 0) {
    const { data: te30 } = await supabase
      .from("time_entries")
      .select("id,worker_id,start")
      .in("job_id", jobIds)
      .gte("start", since30.toISOString());

    const rows = (te30 ?? []) as { id: string; worker_id: string; start: string }[];
    const workers30 = new Set<string>();
    const workers7 = new Set<string>();

    for (const r of rows) {
      timeEntries30++;
      workers30.add(r.worker_id);
      const start = new Date(r.start);
      if (start >= since7) {
        timeEntries7++;
        workers7.add(r.worker_id);
      }
    }

    activeWorkers7 = workers7.size;
    activeWorkers30 = workers30.size;
  }

  // Reports/insights are not yet instrumented in DB; return 0 for now.
  const reportsViewed7 = 0;
  const reportsViewed30 = 0;
  const insightsGenerated7 = 0;
  const insightsGenerated30 = 0;

  const noActivity7 = jobs7 === 0 && timeEntries7 === 0;
  const lowUsage = jobs30 < 2 && timeEntries30 < 5;
  const highEngagement = jobs30 >= 8 || timeEntries30 >= 40;

  return NextResponse.json({
    windows: {
      last7Days: {
        jobsCreated: jobs7,
        clockIns: timeEntries7,
        activeWorkers: activeWorkers7,
        reportsViewed: reportsViewed7,
        insightsGenerated: insightsGenerated7,
      },
      last30Days: {
        jobsCreated: jobs30,
        clockIns: timeEntries30,
        activeWorkers: activeWorkers30,
        reportsViewed: reportsViewed30,
        insightsGenerated: insightsGenerated30,
      },
    },
    flags: { noActivity7, lowUsage, highEngagement },
  });
}

