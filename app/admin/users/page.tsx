import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type AdminUserItem = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: string | null;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  company: {
    id: string;
    name: string;
    accountStatus: string | null;
    subscriptionStatus: string | null;
    workerLimit: number | null;
  } | null;
};

function planNameFromWorkerLimit(limit: number | null) {
  if (limit === 30) return "Pro";
  if (limit === 15) return "Growth";
  if (limit === 5) return "Starter";
  return limit ? `Limit ${limit}` : "—";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const res = await fetch(
    `${origin}/api/admin/users?q=${encodeURIComponent(q)}&perPage=100`,
    {
      cache: "no-store",
      headers: {
        cookie: h.get("cookie") ?? "",
        "x-forwarded-proto": proto,
        "x-forwarded-host": host,
      },
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return (
      <div className="px-4 py-6 sm:px-6">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Users</div>
          <div className="mt-2 text-sm text-red-700">
            Failed to load: {body?.error ?? res.statusText}
          </div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as { items: AdminUserItem[] };
  const items = json.items ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Users</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            All auth users (owners + admins). Includes active and inactive accounts.
          </p>
        </div>
        <form className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search email, name, id…"
            className="w-72 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
          />
          <button
            type="submit"
            className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-fc-border bg-fc-surface shadow-fc-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Subscription</th>
                <th className="px-4 py-3">Last sign-in</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-fc-brand">
                      {u.email ?? "—"}
                    </div>
                    <div className="mt-0.5 text-xs text-fc-muted">
                      {u.name ?? "—"} · {u.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.company ? (
                      <div>
                        <div className="text-fc-brand">{u.company.name}</div>
                        <div className="text-xs text-fc-muted">{u.company.id}</div>
                      </div>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">
                    {u.company ? planNameFromWorkerLimit(u.company.workerLimit) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                      {u.company?.accountStatus ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                      {u.company?.subscriptionStatus ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${encodeURIComponent(u.id)}`}
                      className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand hover:bg-fc-surface-muted"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-fc-muted">
                    No users found.
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

