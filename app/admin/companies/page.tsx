import Link from "next/link";

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
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="text-sm font-medium text-slate-200">Companies</div>
        <div className="mt-2 text-sm text-red-300">
          Failed to load: {body?.error ?? res.statusText}
        </div>
      </div>
    );
  }

  const json = (await res.json()) as { items: AdminCompany[] };
  const items = json.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-1 text-sm text-slate-300">
            Master list of all accounts. This is the home screen.
          </p>
        </div>
        <form className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search company…"
            className="w-64 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-xs text-slate-300">
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
            <tbody className="divide-y divide-slate-800">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-slate-950/40">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">{c.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {c.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.owner ? (
                      <div>
                        <div className="text-slate-100">{c.owner.name}</div>
                        <div className="text-xs text-slate-400">
                          {c.owner.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {planNameFromWorkerLimit(c.workerLimit)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">
                      {c.subscriptionStatus ?? "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200">
                      {c.accountStatus ?? "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {c.mrrUsd ? `$${c.mrrUsd}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.signupAt ? new Date(c.signupAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.lastActiveAt
                      ? new Date(c.lastActiveAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{c.workersCount}</td>
                  <td className="px-4 py-3 text-slate-200">{c.jobsCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/companies/${encodeURIComponent(c.id)}`}
                        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/companies/${encodeURIComponent(c.id)}?tab=impersonate`}
                        className="rounded-md bg-indigo-500 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-400"
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
                    className="px-4 py-10 text-center text-slate-400"
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

