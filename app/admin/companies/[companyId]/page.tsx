import Link from "next/link";
import { ImpersonateCard } from "./ImpersonateCard";
import { CompanyActionsCard } from "./CompanyActionsCard";
import { BillingCard } from "./BillingCard";
import { UsageCard } from "./UsageCard";
import { UsersCard } from "./UsersCard";
import { SupportToolsCard } from "./SupportToolsCard";
import { Card } from "@/components/ui/Card";

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
      <div className="px-4 py-6 sm:px-6 space-y-4">
        <Link
          href="/admin/companies"
          className="text-sm text-fc-muted hover:text-fc-accent"
        >
          ← Back
        </Link>
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Company detail</div>
          <div className="mt-2 text-sm text-red-700">
            Failed to load: {body?.error ?? res.statusText}
          </div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as CompanyDetailResponse;
  const company = json.company ?? {};
  const ownerUserId = (company.owner_user_id as string | null | undefined) ?? null;
  const companyName = (company.name as string | null | undefined) ?? "";
  const accountStatus = (company.account_status as string | null | undefined) ?? null;

  return (
    <div className="px-4 py-6 sm:px-6 space-y-6">
      <div className="space-y-2">
        <Link
          href="/admin/companies"
          className="text-sm text-fc-muted hover:text-fc-accent"
        >
          ← Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-fc-brand">
              {(company.name as string) ?? "Company"}
            </h1>
            <div className="mt-0.5 text-sm text-fc-muted">{companyId}</div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
              {(company.subscription_status as string | null) ?? "unknown"}
            </span>
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
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
          <Card key={k.label} className="rounded-xl">
            <div className="text-xs font-semibold text-fc-muted">{k.label}</div>
            <div className="mt-2 text-2xl font-semibold text-fc-brand">
              {k.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Owner</div>
          {json.owner ? (
            <div className="mt-2 space-y-1 text-sm text-fc-muted">
              <div className="text-fc-brand font-semibold">{json.owner.name}</div>
              <div className="text-fc-muted">{json.owner.email}</div>
              <div className="text-xs text-fc-muted">{json.owner.id}</div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-fc-muted">—</div>
          )}
        </Card>

        <ImpersonateCard companyId={companyId} ownerUserId={ownerUserId} />
      </div>

      <CompanyActionsCard
        companyId={companyId}
        companyName={companyName}
        accountStatus={accountStatus}
      />

      <BillingCard companyId={companyId} />

      <UsageCard companyId={companyId} />

      <UsersCard companyId={companyId} />

      <SupportToolsCard companyId={companyId} />
    </div>
  );
}

