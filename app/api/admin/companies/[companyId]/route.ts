import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

async function countByCompany(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  table: "workers" | "jobs" | "time_entries",
  companyId: string
) {
  if (table === "time_entries") {
    // time_entries links via job_id -> jobs.company_id
    const { data, error } = await supabase
      .from("jobs")
      .select("id")
      .eq("company_id", companyId);
    if (error) return 0;
    const jobIds = (data ?? []).map((r) => (r as { id: string }).id);
    if (jobIds.length === 0) return 0;
    const { count } = await supabase
      .from("time_entries")
      .select("id", { count: "exact", head: true })
      .in("job_id", jobIds);
    return count ?? 0;
  }

  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);
  return count ?? 0;
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

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();
  if (error || !company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const ownerUserId = (company as { owner_user_id?: string | null }).owner_user_id ?? null;

  const { data: owner } = ownerUserId
    ? await supabase
        .from("owner_users")
        .select("id,email,name")
        .eq("id", ownerUserId)
        .single()
    : { data: null };

  const [workersCount, jobsCount, timeEntriesCount] = await Promise.all([
    countByCompany(supabase, "workers", companyId),
    countByCompany(supabase, "jobs", companyId),
    countByCompany(supabase, "time_entries", companyId),
  ]);

  return NextResponse.json({
    company,
    owner,
    counts: { workers: workersCount, jobs: jobsCount, timeEntries: timeEntriesCount },
  });
}

