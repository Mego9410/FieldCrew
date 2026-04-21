import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { headers } from "next/headers";
import { AdminUserActionsCard } from "@/components/admin/AdminUserActionsCard";

export const dynamic = "force-dynamic";

type UserDetailResponse = {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
    createdAt: string | null;
    lastSignInAt: string | null;
    emailConfirmedAt: string | null;
    bannedUntil: string | null;
    metadata: { app: Record<string, unknown>; user: Record<string, unknown> };
  };
  ownerRow: { id: string; email: string | null; name: string | null; companyId: string | null } | null;
  company:
    | {
        id: string;
        name: string;
        accountStatus: string | null;
        onboardingStatus: string | null;
        subscriptionStatus: string | null;
        workerLimit: number | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
      }
    | null;
};

function planNameFromWorkerLimit(limit: number | null) {
  if (limit === 30) return "Pro";
  if (limit === 15) return "Growth";
  if (limit === 5) return "Starter";
  return limit ? `Limit ${limit}` : "—";
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const res = await fetch(
    `${origin}/api/admin/users/${encodeURIComponent(userId)}`,
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
      <div className="px-4 py-6 sm:px-6 space-y-4">
        <Link href="/admin/users" className="text-sm text-fc-muted hover:text-fc-accent">
          ← Back
        </Link>
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">User detail</div>
          <div className="mt-2 text-sm text-red-700">
            Failed to load: {body?.error ?? res.statusText}
          </div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as UserDetailResponse;
  const u = json.user;
  const c = json.company;

  return (
    <div className="px-4 py-6 sm:px-6 space-y-6">
      <div className="space-y-2">
        <Link href="/admin/users" className="text-sm text-fc-muted hover:text-fc-accent">
          ← Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-fc-brand">
              {u.email ?? "User"}
            </h1>
            <div className="mt-0.5 text-sm text-fc-muted">{u.id}</div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
              role: {u.role}
            </span>
            {c ? (
              <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                {c.subscriptionStatus ?? "unknown"}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-xl lg:col-span-2">
          <div className="text-sm font-semibold text-fc-brand">Identity</div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Name", u.name ?? "—"],
              ["Email", u.email ?? "—"],
              ["Email confirmed", u.emailConfirmedAt ? new Date(u.emailConfirmedAt).toLocaleString() : "—"],
              ["Last sign-in", u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : "—"],
              ["Created", u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"],
              ["Banned until", u.bannedUntil ? new Date(u.bannedUntil).toLocaleString() : "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-fc-border bg-white px-3 py-2">
                <div className="text-xs font-semibold text-fc-muted">{label}</div>
                <div className="mt-1 text-sm text-fc-brand break-words">{value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Company</div>
          {c ? (
            <div className="mt-3 space-y-2 text-sm">
              <div className="font-semibold text-fc-brand">{c.name}</div>
              <div className="text-xs text-fc-muted">{c.id}</div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                  {planNameFromWorkerLimit(c.workerLimit)}
                </span>
                <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                  account: {c.accountStatus ?? "—"}
                </span>
                <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
                  onboarding: {c.onboardingStatus ?? "—"}
                </span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/admin/companies/${encodeURIComponent(c.id)}`}
                  className="text-sm font-medium text-fc-accent hover:underline hover:underline-offset-4"
                >
                  View company →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-fc-muted">No company linked (admin or unassigned user).</div>
          )}
        </Card>
      </div>

      <AdminUserActionsCard
        userId={u.id}
        email={u.email}
        currentRole={u.role}
      />
    </div>
  );
}

