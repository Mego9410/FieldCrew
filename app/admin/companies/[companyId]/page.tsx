import Link from "next/link";
import { ImpersonateCard } from "./ImpersonateCard";
import { CompanyActionsCard } from "./CompanyActionsCard";
import { BillingCard } from "./BillingCard";
import { UsageCard } from "./UsageCard";

export const dynamic = "force-dynamic";

type CompanyDetailResponse = {
  company: Record<string, unknown>;
  owner: { id: string; email: string; name: string } | null;
  counts: { workers: number; jobs: number; timeEntries: number };
};

export default async function AdminCompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const res = await fetch(`/api/admin/companies/${encodeURIComponent(companyId)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return (
      <div className="space-y-4">
        <Link
          href="/admin/companies"
          className="text-sm text-slate-300 hover:text-white"
        >
          ← Back
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-sm font-medium text-slate-200">
            Company detail
          </div>
          <div className="mt-2 text-sm text-red-300">
            Failed to load: {body?.error ?? res.statusText}
          </div>
        </div>
      </div>
    );
  }

  const json = (await res.json()) as CompanyDetailResponse;
  const company = json.company ?? {};
  const ownerUserId = (company.owner_user_id as string | null | undefined) ?? null;
  const companyName = (company.name as string | null | undefined) ?? "";
  const accountStatus = (company.account_status as string | null | undefined) ?? null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/admin/companies"
          className="text-sm text-slate-300 hover:text-white"
        >
          ← Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              {(company.name as string) ?? "Company"}
            </h1>
            <div className="mt-1 text-sm text-slate-400">{companyId}</div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">
              {(company.subscription_status as string | null) ?? "unknown"}
            </span>
            <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">
              onboarding:{" "}
              {(company.onboarding_status as string | null) ?? "unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Workers", value: json.counts.workers },
          { label: "Jobs tracked", value: json.counts.jobs },
          { label: "Time entries", value: json.counts.timeEntries },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div className="text-xs font-medium text-slate-400">{k.label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-sm font-medium text-slate-200">Owner</div>
          {json.owner ? (
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <div className="text-slate-100">{json.owner.name}</div>
              <div className="text-slate-300">{json.owner.email}</div>
              <div className="text-xs text-slate-500">{json.owner.id}</div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-500">—</div>
          )}
        </div>

        <ImpersonateCard companyId={companyId} ownerUserId={ownerUserId} />
      </div>

      <CompanyActionsCard
        companyId={companyId}
        companyName={companyName}
        accountStatus={accountStatus}
      />

      <BillingCard companyId={companyId} />

      <UsageCard companyId={companyId} />
    </div>
  );
}

