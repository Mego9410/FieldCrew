import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CEO View</h1>
          <p className="mt-1 text-sm text-slate-300">
            Revenue, users, and data integrity. If something breaks in FieldCrew,
            you fix it here.
          </p>
        </div>
        <Link
          href="/admin/companies"
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
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
          <div
            key={kpi.label}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div className="text-xs font-medium text-slate-400">{kpi.label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {kpi.value}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Hooked up in the next step (billing + usage rollups).
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="text-sm font-medium text-slate-200">
          What’s live in V1
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Companies master list (search + drill-in)</li>
          <li>Impersonation (new tab owner session)</li>
          <li>Stripe billing controls (server-only)</li>
          <li>Usage visibility + churn risk flags</li>
          <li>Audit logging for admin actions</li>
        </ul>
      </div>
    </div>
  );
}

