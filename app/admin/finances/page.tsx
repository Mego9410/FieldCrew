import { headers } from "next/headers";
import { Card } from "@/components/ui/Card";
import { FinancesDashboardClient } from "./FinancesDashboardClient";

export const dynamic = "force-dynamic";

type FinanceItem = {
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

type FinanceSummaryResponse = {
  meta: { stripeConfigured: boolean; limit: number };
  kpis: { totalMrrUsd: number; paidCompanies: number; pastDueMrrUsd: number; atRiskMrrUsd: number };
  atRisk: FinanceItem[];
};

type FinanceTimeseriesResponse = {
  rangeDays: number;
  series: {
    day: string;
    mrr_usd: number;
    cash_collected_usd_cents: number;
    refunds_usd_cents: number;
    paid_invoices_count: number;
    failed_invoices_count: number;
    open_invoices_count: number;
    past_due_invoices_count: number;
  }[];
};

type CollectionsResponse = {
  agingBuckets: Record<string, { count: number; amountDue: number }>;
  invoices: {
    id: string;
    status: string | null;
    companyId: string | null;
    companyName: string | null;
    createdAt: string;
    dueAt: string | null;
    amountDue: number | null;
    currency: string | null;
    hostedInvoiceUrl: string | null;
    attemptCount: number | null;
    nextPaymentAttempt: string | null;
    ageDays: number | null;
  }[];
};

type RefundsResponse = {
  refunds: {
    id: string;
    companyId: string | null;
    companyName: string | null;
    createdAt: string;
    refundedAt: string | null;
    amount: number;
    amountRefunded: number;
    currency: string | null;
    receiptUrl: string | null;
  }[];
};

export default async function AdminFinancesPage() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const baseHeaders = {
    cookie: h.get("cookie") ?? "",
    "x-forwarded-proto": proto,
    "x-forwarded-host": host,
  };

  const [summaryRes, tsRes, collectionsRes, refundsRes] = await Promise.all([
    fetch(`${origin}/api/admin/finances/summary`, {
      cache: "no-store",
      headers: baseHeaders,
    }),
    fetch(`${origin}/api/admin/finances/timeseries?range=30d`, {
      cache: "no-store",
      headers: baseHeaders,
    }),
    fetch(`${origin}/api/admin/finances/collections?limit=50`, {
      cache: "no-store",
      headers: baseHeaders,
    }),
    fetch(`${origin}/api/admin/finances/refunds?limit=50`, {
      cache: "no-store",
      headers: baseHeaders,
    }),
  ]);

  const res = summaryRes;
  const tsOk = tsRes.ok;
  const collectionsOk = collectionsRes.ok;
  const refundsOk = refundsRes.ok;

  if (!tsOk || !collectionsOk || !refundsOk) {
    // Keep summary visible even if secondary endpoints fail.
    // Secondary errors are surfaced in the client as empty states.
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return (
      <div className="px-4 py-6 sm:px-6">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Finances</div>
          <div className="mt-2 text-sm text-red-700">Failed to load: {body?.error ?? res.statusText}</div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as FinanceSummaryResponse;
  const timeseries = (await tsRes.json().catch(() => null)) as FinanceTimeseriesResponse | null;
  const collections = (await collectionsRes.json().catch(() => null)) as CollectionsResponse | null;
  const refunds = (await refundsRes.json().catch(() => null)) as RefundsResponse | null;

  return (
    <FinancesDashboardClient
      summary={json}
      timeseries={timeseries}
      collections={collections}
      refunds={refunds}
      origin={origin}
    />
  );
}

