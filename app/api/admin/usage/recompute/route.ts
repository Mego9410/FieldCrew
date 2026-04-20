import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { adminUpsertCompanyUsageDaily } from "@/lib/admin/db";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  let body: { companyId?: string; days?: number } = {};
  try {
    body = await request.json();
  } catch {
    // ok
  }

  const companyId = body.companyId?.trim();
  if (!companyId) {
    return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
  }

  const days = Math.min(Math.max(body.days ?? 30, 1), 90);
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  start.setUTCHours(0, 0, 0, 0);

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id,date,start_date")
    .eq("company_id", companyId);
  const jobIds = (jobs ?? []).map((j) => (j as { id: string }).id);

  const { data: timeEntries } =
    jobIds.length > 0
      ? await supabase
          .from("time_entries")
          .select("worker_id,start,job_id")
          .in("job_id", jobIds)
          .gte("start", start.toISOString())
      : { data: [] as unknown[] };

  const byDay = new Map<
    string,
    { jobs: number; timeEntries: number; workers: Set<string> }
  >();

  // Jobs proxy: count by scheduled day
  for (const j of jobs ?? []) {
    const r = j as { date?: string | null; start_date?: string | null };
    const s = (r.start_date ?? r.date ?? "").trim();
    if (!s) continue;
    const d = new Date(`${s}T00:00:00Z`);
    if (isNaN(d.getTime()) || d < start) continue;
    const day = isoDay(d);
    const cur = byDay.get(day) ?? { jobs: 0, timeEntries: 0, workers: new Set<string>() };
    cur.jobs++;
    byDay.set(day, cur);
  }

  for (const te of (timeEntries ?? []) as { worker_id: string; start: string }[]) {
    const d = new Date(te.start);
    if (isNaN(d.getTime()) || d < start) continue;
    const day = isoDay(d);
    const cur = byDay.get(day) ?? { jobs: 0, timeEntries: 0, workers: new Set<string>() };
    cur.timeEntries++;
    cur.workers.add(te.worker_id);
    byDay.set(day, cur);
  }

  const rows = Array.from(byDay.entries()).map(([day, v]) => ({
    company_id: companyId,
    day,
    jobs_created: v.jobs,
    time_entries_created: v.timeEntries,
    active_workers: v.workers.size,
    reports_viewed: 0,
    insights_generated: 0,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    const { error } = await adminUpsertCompanyUsageDaily(
      supabase,
      rows as unknown as Record<string, unknown>[]
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "usage.recompute_daily",
    targetCompanyId: companyId,
    metadata: { days, rows: rows.length },
  });

  return NextResponse.json({ ok: true, days, upserted: rows.length });
}

