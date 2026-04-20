import Link from "next/link";
import { headers } from "next/headers";
import { Card } from "@/components/ui/Card";

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

function riskLabel(r: string) {
  if (r === "payment_issue") return "Payment issue";
  if (r === "usage_down") return "Usage down";
  if (r === "no_usage_14d") return "No usage (14d)";
  return r;
}

function pct(p: number | null) {
  if (p == null) return "—";
  return `${Math.round(p * 100)}%`;
}

export default async function AdminFinancesPage() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/admin/finances/summary`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
      "x-forwarded-proto": proto,
      "x-forwarded-host": host,
    },
  });

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
  const k = json.kpis;
  const atRisk = json.atRisk ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Finances</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Subscription health and revenue risk across all companies.
          </p>
        </div>
        <div className="text-xs text-fc-muted">
          Stripe:{" "}
          <span className="font-semibold text-fc-brand">
            {json.meta?.stripeConfigured ? "configured" : "not configured"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Total MRR", value: k.totalMrrUsd ? `$${k.totalMrrUsd}` : "$0" },
          { label: "Paid companies", value: String(k.paidCompanies ?? 0) },
          { label: "Past due MRR", value: k.pastDueMrrUsd ? `$${k.pastDueMrrUsd}` : "$0" },
          { label: "At-risk MRR", value: k.atRiskMrrUsd ? `$${k.atRiskMrrUsd}` : "$0" },
        ].map((x) => (
          <Card key={x.label} className="rounded-xl">
            <div className="text-xs font-semibold text-fc-muted">{x.label}</div>
            <div className="mt-2 text-2xl font-semibold text-fc-brand">{x.value}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-fc-brand">At-risk MRR</div>
            <div className="mt-1 text-sm text-fc-muted">
              Highest-value accounts with payment or usage signals. (V1 uses jobs created rollups.)
            </div>
          </div>
          <Link
            href="/admin/companies"
            className="text-sm font-medium text-fc-brand hover:text-fc-accent"
          >
            View all companies →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">MRR</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Usage (7d)</th>
                <th className="px-4 py-3">Drop</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {atRisk.map((c) => (
                <tr key={c.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-fc-brand">{c.name}</div>
                    <div className="mt-0.5 text-xs text-fc-muted">{c.id}</div>
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{c.mrrUsd ? `$${c.mrrUsd}` : "—"}</td>
                  <td className="px-4 py-3 text-fc-brand">{c.planName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                      {c.subscriptionStatus ?? "unknown"}
                    </span>
                    {!c.stripeLinked ? (
                      <div className="mt-1 text-[11px] text-fc-muted">Stripe not linked</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{c.usage7Jobs}</td>
                  <td className="px-4 py-3 text-fc-muted">{pct(c.usageDropPct)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(c.riskReasons ?? []).slice(0, 3).map((r) => (
                        <span
                          key={r}
                          className="rounded-lg border border-fc-border bg-white px-2 py-1 text-[11px] text-fc-brand"
                        >
                          {riskLabel(r)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/finances/${encodeURIComponent(c.id)}`}
                        className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand hover:bg-fc-surface-muted"
                      >
                        Finance
                      </Link>
                      <Link
                        href={`/admin/companies/${encodeURIComponent(c.id)}`}
                        className="rounded-lg bg-fc-brand px-2 py-1 text-xs font-medium text-white hover:bg-fc-brand/90"
                      >
                        Admin
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {atRisk.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-fc-muted">
                    No at-risk accounts detected yet. (Run “Recompute usage (30d)” on a few companies
                    to populate usage rollups.)
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

