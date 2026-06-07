import Link from "next/link";
import { headers } from "next/headers";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

type FinanceSummary = {
  meta: { stripeConfigured: boolean; limit: number };
  kpis: {
    totalMrrUsd: number;
    paidCompanies: number;
    pastDueMrrUsd: number;
    atRiskMrrUsd: number;
  };
};

function usd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

async function loadSummary(): Promise<FinanceSummary | null> {
  try {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const res = await fetch(`${proto}://${host}/api/admin/finances/summary`, {
      cache: "no-store",
      headers: {
        cookie: h.get("cookie") ?? "",
        "x-forwarded-proto": proto,
        "x-forwarded-host": host,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as FinanceSummary;
  } catch {
    return null;
  }
}

export default async function AdminOverviewPage() {
  const summary = await loadSummary();
  const kpis = summary
    ? [
        { label: "Total MRR", value: usd(summary.kpis.totalMrrUsd) },
        { label: "Paying accounts", value: String(summary.kpis.paidCompanies) },
        { label: "Past-due MRR", value: usd(summary.kpis.pastDueMrrUsd) },
        { label: "At-risk MRR", value: usd(summary.kpis.atRiskMrrUsd) },
      ]
    : [
        { label: "Total MRR", value: "—" },
        { label: "Paying accounts", value: "—" },
        { label: "Past-due MRR", value: "—" },
        { label: "At-risk MRR", value: "—" },
      ];

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">
            CEO View
          </h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Revenue, users, and data integrity. If something breaks in FieldCrew,
            you fix it here.
          </p>
        </div>
        <Link
          href="/admin/companies"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          View companies
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href="/admin/finances" className="block">
            <Card className="rounded-xl transition-colors hover:border-fc-accent/50">
              <div className="text-xs font-medium text-fc-muted">{kpi.label}</div>
              <div className="mt-2 text-2xl font-semibold text-fc-brand">
                {kpi.value}
              </div>
              <div className="mt-1 text-xs text-fc-muted">
                {summary ? "View finances →" : "Connect Stripe to populate."}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 rounded-xl">
        <div className="text-sm font-semibold text-fc-brand">What’s live</div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fc-muted">
          <li>Companies master list (search + drill-in)</li>
          <li>Impersonation (new tab owner session)</li>
          <li>Stripe billing controls (server-only)</li>
          <li>Usage visibility + churn risk flags</li>
          <li>Audit logging for admin actions</li>
        </ul>
      </Card>
    </div>
  );
}

