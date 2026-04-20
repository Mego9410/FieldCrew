import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createStripeServerClient } from "@/lib/stripe/server";

type AdminCompanyRow = {
  id: string;
  name: string;
  subscription_status: string | null;
  worker_limit: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  last_active_at: string | null;
};

const PLAN_BY_LIMIT: Record<number, { name: string; mrrUsd: number }> = {
  5: { name: "Starter", mrrUsd: 49 },
  15: { name: "Growth", mrrUsd: 89 },
  30: { name: "Pro", mrrUsd: 149 },
};

function isoDate(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "200", 10) || 200, 1),
    500
  );

  // Stripe isn't required for V1 metrics, but if configured we can return a basic health flag.
  const stripeConfigured = createStripeServerClient() != null;

  const { data: companiesRaw, error } = await supabase
    .from("companies")
    .select(
      "id,name,subscription_status,worker_limit,stripe_customer_id,stripe_subscription_id,last_active_at"
    )
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const companies = (companiesRaw ?? []) as unknown as AdminCompanyRow[];

  const usageStart = new Date();
  usageStart.setUTCDate(usageStart.getUTCDate() - 13); // last 14 days inclusive-ish
  const usageStartIso = isoDate(usageStart);

  const companyIds = companies.map((c) => c.id);
  const usageByCompany = new Map<
    string,
    { sum7: number; prev7: number; sum14: number }
  >();

  if (companyIds.length > 0) {
    const { data: usageRows } = await supabase
      .from("company_usage_daily")
      .select("company_id,day,jobs_created")
      .gte("day", usageStartIso)
      .in("company_id", companyIds)
      .order("day", { ascending: true });

    const rows =
      (usageRows ?? []) as unknown as {
        company_id: string;
        day: string;
        jobs_created: number | null;
      }[];

    const today = new Date();
    const cutoff = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const day8 = new Date(cutoff);
    day8.setUTCDate(day8.getUTCDate() - 7); // start of "last 7"
    const day15 = new Date(cutoff);
    day15.setUTCDate(day15.getUTCDate() - 14); // start of "prev 7"

    for (const r of rows) {
      const bucket = usageByCompany.get(r.company_id) ?? { sum7: 0, prev7: 0, sum14: 0 };
      const v = r.jobs_created ?? 0;
      bucket.sum14 += v;

      const d = new Date(`${r.day}T00:00:00Z`);
      if (d >= day8) bucket.sum7 += v;
      else if (d >= day15) bucket.prev7 += v;

      usageByCompany.set(r.company_id, bucket);
    }
  }

  type Item = {
    id: string;
    name: string;
    planName: string;
    mrrUsd: number;
    subscriptionStatus: string | null;
    stripeLinked: boolean;
    lastActiveAt: string | null;
    usage7Jobs: number;
    usageDropPct: number | null;
    riskReasons: string[];
  };

  const items: Item[] = companies.map((c) => {
    const plan = PLAN_BY_LIMIT[c.worker_limit ?? 5] ?? PLAN_BY_LIMIT[5];
    const mrrUsd = (c.subscription_status ?? "") === "active" ? plan.mrrUsd : 0;

    const usage = usageByCompany.get(c.id) ?? { sum7: 0, prev7: 0, sum14: 0 };
    const usageDropPct =
      usage.prev7 > 0 ? Math.max(0, Math.min(1, 1 - usage.sum7 / usage.prev7)) : null;

    const riskReasons: string[] = [];
    const status = (c.subscription_status ?? "").toLowerCase();
    if (status === "past_due" || status === "unpaid") riskReasons.push("payment_issue");
    if (usage.prev7 >= 5 && usageDropPct != null && usageDropPct >= 0.5) riskReasons.push("usage_down");
    if (usage.sum14 === 0 && status === "active") riskReasons.push("no_usage_14d");

    return {
      id: c.id,
      name: c.name,
      planName: plan.name,
      mrrUsd,
      subscriptionStatus: c.subscription_status ?? null,
      stripeLinked: Boolean(c.stripe_customer_id && c.stripe_subscription_id),
      lastActiveAt: c.last_active_at ?? null,
      usage7Jobs: usage.sum7,
      usageDropPct,
      riskReasons,
    };
  });

  const activeItems = items.filter((i) => (i.subscriptionStatus ?? "") === "active");
  const pastDueItems = items.filter((i) => {
    const s = (i.subscriptionStatus ?? "").toLowerCase();
    return s === "past_due" || s === "unpaid";
  });

  const totalMrrUsd = activeItems.reduce((acc, i) => acc + i.mrrUsd, 0);
  const pastDueMrrUsd = pastDueItems.reduce((acc, i) => acc + i.mrrUsd, 0);
  const paidCompanies = activeItems.length;
  const atRisk = items
    .filter((i) => i.riskReasons.length > 0 && i.mrrUsd > 0)
    .sort((a, b) => {
      const ar = b.mrrUsd - a.mrrUsd;
      if (ar !== 0) return ar;
      const bd = (b.usageDropPct ?? 0) - (a.usageDropPct ?? 0);
      if (bd !== 0) return bd;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 100);
  const atRiskMrrUsd = atRisk.reduce((acc, i) => acc + i.mrrUsd, 0);

  return NextResponse.json({
    meta: { stripeConfigured, limit },
    kpis: {
      totalMrrUsd,
      paidCompanies,
      pastDueMrrUsd,
      atRiskMrrUsd,
    },
    atRisk,
    items, // full list for filtering/sorting client-side later
  });
}

