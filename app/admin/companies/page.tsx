import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CreateCompanyDialog } from "./CreateCompanyDialog";

export const dynamic = "force-dynamic";

type AdminCompany = {
  id: string;
  name: string;
  owner: { id: string; name: string; email: string } | null;
  accountStatus: string | null;
  onboardingStatus: string | null;
  subscriptionStatus: string | null;
  workerLimit: number | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  mrrUsd: number;
  signupAt: string | null;
  lastActiveAt: string | null;
  workersCount: number;
  jobsCount: number;
};

function planNameFromWorkerLimit(limit: number | null) {
  if (limit === 30) return "Pro";
  if (limit === 15) return "Growth";
  return "Starter";
}

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";

  const res = await fetch(
    `/api/admin/companies?q=${encodeURIComponent(q)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return (
      <div className="px-4 py-6 sm:px-6">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Companies</div>
          <div className="mt-2 text-sm text-red-700">
          Failed to load: {body?.error ?? res.statusText}
          </div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as { items: AdminCompany[] };
  const items = json.items ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">
            Companies
          </h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Master list of all accounts. This is the home screen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search company…"
              className="w-64 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
            />
            <button
              type="submit"
              className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
            >
              Search
            </button>
          </form>
          <CreateCompanyDialog onCreated={undefined} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-fc-border bg-fc-surface shadow-fc-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">MRR</th>
                <th className="px-4 py-3">Signup</th>
                <th className="px-4 py-3">Last active</th>
                <th className="px-4 py-3">Workers</th>
                <th className="px-4 py-3">Jobs</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-fc-brand">{c.name}</div>
                    <div className="mt-0.5 text-xs text-fc-muted">
                      {c.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.owner ? (
                      <div>
                        <div className="text-fc-brand">{c.owner.name}</div>
                        <div className="text-xs text-fc-muted">
                          {c.owner.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">
                    {planNameFromWorkerLimit(c.workerLimit)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                      {c.subscriptionStatus ?? "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                      {c.accountStatus ?? "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-brand">
                    {c.mrrUsd ? `$${c.mrrUsd}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    {c.signupAt ? new Date(c.signupAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    {c.lastActiveAt
                      ? new Date(c.lastActiveAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{c.workersCount}</td>
                  <td className="px-4 py-3 text-fc-brand">{c.jobsCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/companies/${encodeURIComponent(c.id)}`}
                        className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand hover:bg-fc-surface-muted"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/companies/${encodeURIComponent(c.id)}?tab=impersonate`}
                        className="rounded-lg bg-fc-brand px-2 py-1 text-xs font-medium text-white hover:bg-fc-brand/90"
                      >
                        Impersonate
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-10 text-center text-fc-muted"
                  >
                    No companies found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

