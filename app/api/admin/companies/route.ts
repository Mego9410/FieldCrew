import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type AdminCompanyRow = {
  id: string;
  name: string;
  account_status: string | null;
  owner_user_id: string | null;
  onboarding_status: string | null;
  subscription_status: string | null;
  worker_limit: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  signup_at: string | null;
  last_active_at: string | null;
};

type OwnerUserRow = {
  id: string;
  email: string;
  name: string;
  company_id: string;
};

const PLAN_BY_LIMIT: Record<number, { name: string; mrrUsd: number }> = {
  5: { name: "Starter", mrrUsd: 49 },
  15: { name: "Growth", mrrUsd: 89 },
  30: { name: "Pro", mrrUsd: 149 },
};

async function countByCompany(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  table: "workers" | "jobs",
  companyId: string
) {
  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);
  return count ?? 0;
}

export async function GET(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const status = (url.searchParams.get("status") ?? "").trim();
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 1),
    200
  );

  let query = supabase
    .from("companies")
    .select(
      "id,name,account_status,owner_user_id,onboarding_status,subscription_status,worker_limit,stripe_customer_id,stripe_subscription_id,signup_at,last_active_at"
    )
    .order("name", { ascending: true })
    .limit(limit);

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (status) {
    query = query.eq("subscription_status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const companies = (data ?? []) as AdminCompanyRow[];
  const ownerIds = companies.map((c) => c.owner_user_id).filter(Boolean) as string[];

  const ownersById = new Map<string, OwnerUserRow>();
  if (ownerIds.length > 0) {
    const { data: owners } = await supabase
      .from("owner_users")
      .select("id,email,name,company_id")
      .in("id", ownerIds);
    ((owners ?? []) as unknown as OwnerUserRow[]).forEach((o) =>
      ownersById.set(o.id, o)
    );
  }

  const enriched = await Promise.all(
    companies.map(async (c) => {
      const owner = c.owner_user_id ? ownersById.get(c.owner_user_id) ?? null : null;
      const [workersCount, jobsCount] = await Promise.all([
        countByCompany(supabase, "workers", c.id),
        countByCompany(supabase, "jobs", c.id),
      ]);
      return {
        id: c.id,
        name: c.name,
        owner: owner
          ? { id: owner.id, name: owner.name, email: owner.email }
          : null,
        accountStatus: c.account_status,
        onboardingStatus: c.onboarding_status,
        subscriptionStatus: c.subscription_status,
        workerLimit: c.worker_limit,
        stripeCustomerId: c.stripe_customer_id,
        stripeSubscriptionId: c.stripe_subscription_id,
        mrrUsd:
          (c.subscription_status ?? "") === "active"
            ? (PLAN_BY_LIMIT[c.worker_limit ?? 5]?.mrrUsd ?? 0)
            : 0,
        signupAt: c.signup_at,
        lastActiveAt: c.last_active_at,
        workersCount,
        jobsCount,
      };
    })
  );

  return NextResponse.json({
    items: enriched,
    meta: { limit },
  });
}

