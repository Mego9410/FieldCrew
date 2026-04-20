"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { chartTheme } from "@/components/charts";

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

function moneyCents(amount: number | null | undefined) {
  if (amount == null) return "—";
  return `$${(amount / 100).toFixed(0)}`;
}

export function FinancesDashboardClient({
  summary,
  timeseries,
  collections,
  refunds,
  origin,
}: {
  summary: FinanceSummaryResponse;
  timeseries: FinanceTimeseriesResponse | null;
  collections: CollectionsResponse | null;
  refunds: RefundsResponse | null;
  origin: string;
}) {
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "365d">("30d");
  const [busy, setBusy] = useState(false);

  const chartData = useMemo(() => {
    const series = timeseries?.series ?? [];
    return series.map((r) => ({
      date: r.day,
      mrr: r.mrr_usd,
      cash: Math.round((r.cash_collected_usd_cents ?? 0) / 100),
      refunds: Math.round((r.refunds_usd_cents ?? 0) / 100),
    }));
  }, [timeseries]);

  async function loadRange(next: typeof range) {
    setRange(next);
    setBusy(true);
    try {
      const res = await fetch(`${origin}/api/admin/finances/timeseries?range=${next}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      // This page is a Server Component wrapper; easiest is a full refresh for now.
      // Keeping it simple avoids duplicating auth cookie wiring client-side.
      window.location.href = `/admin/finances?range=${next}`;
    } finally {
      setBusy(false);
    }
  }

  async function recompute(days: number) {
    setBusy(true);
    try {
      const res = await fetch(`${origin}/api/admin/finances/recompute?days=${days}`, { method: "POST" });
      if (!res.ok) return;
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  const k = summary.kpis;
  const atRisk = summary.atRisk ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Finances</h1>
          <p className="mt-0.5 text-sm text-fc-muted">Stripe-only financial dashboard.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-fc-border bg-white p-1">
            {(["7d", "30d", "90d", "365d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                disabled={busy}
                onClick={() => loadRange(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  range === r ? "bg-fc-brand text-white" : "text-fc-muted hover:text-fc-brand"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => recompute(range === "365d" ? 366 : range === "90d" ? 90 : range === "7d" ? 7 : 30)}
            className="rounded-lg border border-fc-border bg-white px-3 py-2 text-xs font-semibold text-fc-brand hover:bg-fc-surface-muted"
          >
            Recompute rollups
          </button>
          <Link
            href="/admin/companies"
            className="rounded-lg bg-fc-brand px-3 py-2 text-xs font-semibold text-white hover:bg-fc-brand/90"
          >
            Companies →
          </Link>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Normalized MRR (USD)
            </h2>
            <span className="text-xs text-fc-muted">{range.toUpperCase()}</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  stroke={chartTheme.grid.stroke}
                  strokeDasharray={chartTheme.grid.strokeDasharray}
                  strokeOpacity={chartTheme.grid.strokeOpacity}
                  vertical
                  horizontal
                />
                <XAxis
                  dataKey="date"
                  tick={chartTheme.axis.tick}
                  tickCount={6}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis tick={chartTheme.axis.tick} width={40} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={chartTheme.tooltip.contentStyle}
                  labelFormatter={(v) => new Date(String(v)).toLocaleDateString()}
                  formatter={(value: number | undefined) => (value != null ? [`$${value}`, "MRR"] : ["", ""])}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke={chartTheme.colors.primary}
                  strokeWidth={chartTheme.line.strokeWidth}
                  dot={chartTheme.line.dot}
                  activeDot={chartTheme.line.activeDot}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {chartData.every((p) => p.mrr === 0) ? (
            <div className="mt-2 text-xs text-fc-muted">
              No rollups yet. Click <span className="font-semibold text-fc-brand">Recompute rollups</span>.
            </div>
          ) : null}
        </Card>

        <Card className="rounded-xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Cash collected vs refunds (USD)
            </h2>
            <span className="text-xs text-fc-muted">{range.toUpperCase()}</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  stroke={chartTheme.grid.stroke}
                  strokeDasharray={chartTheme.grid.strokeDasharray}
                  strokeOpacity={chartTheme.grid.strokeOpacity}
                  vertical
                  horizontal
                />
                <XAxis
                  dataKey="date"
                  tick={chartTheme.axis.tick}
                  tickCount={6}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis tick={chartTheme.axis.tick} width={40} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={chartTheme.tooltip.contentStyle}
                  labelFormatter={(v) => new Date(String(v)).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="cash"
                  stroke={chartTheme.colors.success}
                  strokeWidth={chartTheme.line.strokeWidth}
                  dot={chartTheme.line.dot}
                  activeDot={chartTheme.line.activeDot}
                />
                <Line
                  type="monotone"
                  dataKey="refunds"
                  stroke={chartTheme.colors.danger}
                  strokeWidth={chartTheme.line.strokeWidth}
                  dot={chartTheme.line.dot}
                  activeDot={chartTheme.line.activeDot}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="rounded-xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-fc-brand">Collections</div>
            <div className="mt-1 text-sm text-fc-muted">Open / past due invoices and aging buckets.</div>
          </div>
          <Link href="/admin/finances" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
            Refresh
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(collections?.agingBuckets ?? {}).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-fc-border bg-white px-3 py-2">
              <div className="text-[11px] font-semibold text-fc-muted">{k} days</div>
              <div className="mt-1 text-sm font-semibold text-fc-brand">{v.count} invoices</div>
              <div className="mt-0.5 text-xs text-fc-muted">{moneyCents(v.amountDue)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Amount due</th>
                <th className="px-4 py-3">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {(collections?.invoices ?? []).slice(0, 25).map((i) => (
                <tr key={i.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3">
                    {i.companyId ? (
                      <Link
                        href={`/admin/finances/${encodeURIComponent(i.companyId)}`}
                        className="font-semibold text-fc-brand hover:text-fc-accent"
                      >
                        {i.companyName ?? i.companyId}
                      </Link>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-fc-muted">{i.id}</td>
                  <td className="px-4 py-3 text-fc-muted">{i.status ?? "—"}</td>
                  <td className="px-4 py-3 text-fc-muted">
                    {i.dueAt ? new Date(i.dueAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-fc-muted">{i.ageDays != null ? `${i.ageDays}d` : "—"}</td>
                  <td className="px-4 py-3 text-fc-brand">
                    {i.amountDue != null ? `$${(i.amountDue / 100).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {i.hostedInvoiceUrl ? (
                      <a
                        href={i.hostedInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(collections?.invoices ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-fc-muted">
                    No open/past-due invoices found (or Stripe facts aren’t populated yet).
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Refunds (latest)</div>
          <div className="mt-1 text-sm text-fc-muted">Recent refunded charges captured via webhooks.</div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Refunded</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fc-border">
                {(refunds?.refunds ?? []).slice(0, 15).map((r) => (
                  <tr key={r.id} className="hover:bg-fc-surface-muted/60">
                    <td className="px-4 py-3">
                      {r.companyId ? (
                        <Link
                          href={`/admin/finances/${encodeURIComponent(r.companyId)}`}
                          className="font-semibold text-fc-brand hover:text-fc-accent"
                        >
                          {r.companyName ?? r.companyId}
                        </Link>
                      ) : (
                        <span className="text-fc-muted">—</span>
                      )}
                      <div className="mt-0.5 text-[11px] text-fc-muted">{r.id}</div>
                    </td>
                    <td className="px-4 py-3 text-fc-muted">
                      {r.refundedAt ? new Date(r.refundedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-fc-brand">{moneyCents(r.amountRefunded)}</td>
                    <td className="px-4 py-3">
                      {r.receiptUrl ? (
                        <a
                          href={r.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                        >
                          Open
                        </a>
                      ) : (
                        <span className="text-fc-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(refunds?.refunds ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-fc-muted">
                      No refunds found yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="rounded-xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-fc-brand">At-risk MRR</div>
              <div className="mt-1 text-sm text-fc-muted">
                Highest-value accounts with payment or usage signals. (V1 uses jobs-created rollups.)
              </div>
            </div>
            <Link href="/admin/companies" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
              View all →
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
                    <td className="px-4 py-3 text-fc-muted">{c.subscriptionStatus ?? "unknown"}</td>
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
                    <td colSpan={7} className="px-4 py-10 text-center text-fc-muted">
                      No at-risk accounts detected yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

