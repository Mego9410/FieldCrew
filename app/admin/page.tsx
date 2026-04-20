import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
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
        {[
          { label: "Total MRR", value: "—" },
          { label: "Active accounts", value: "—" },
          { label: "Trial → paid", value: "—" },
          { label: "Churn rate", value: "—" },
        ].map((kpi) => (
          <Card key={kpi.label} className="rounded-xl">
            <div className="text-xs font-medium text-fc-muted">{kpi.label}</div>
            <div className="mt-2 text-2xl font-semibold text-fc-brand">
              {kpi.value}
            </div>
            <div className="mt-1 text-xs text-fc-muted">
              Hooked up in the next step (billing + usage rollups).
            </div>
          </Card>
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

