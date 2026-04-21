"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { AdminUserActionsCard } from "@/components/admin/AdminUserActionsCard";

type OwnerUser = {
  id: string;
  email: string | null;
  role: string;
  lastSignInAt: string | null;
  createdAt: string | null;
};

type Worker = {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  inviteStatus: string | null;
};

type UsersResponse = { users: OwnerUser[]; workers: Worker[] };

export function UsersCard({ companyId }: { companyId: string }) {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch(
      `/api/admin/companies/${encodeURIComponent(companyId)}/users`,
      { cache: "no-store" }
    );
    const json = (await res.json().catch(() => ({}))) as UsersResponse & {
      error?: string;
    };
    if (!res.ok) throw new Error(json.error ?? res.statusText);
    setData(json);
  };

  useEffect(() => {
    load().catch((e) =>
      setError(e instanceof Error ? e.message : "Failed to load users")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const owner = data?.users?.[0] ?? null;

  const fmt = useMemo(
    () => (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—"),
    []
  );

  return (
    <Card className="mt-6 rounded-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-fc-brand">Users</div>
          <div className="mt-0.5 text-sm text-fc-muted">
            Owner login + worker roster (workers are token-based, not auth users).
          </div>
        </div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-fc-border bg-fc-surface-muted p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
            Owner account
          </div>
          {owner ? (
            <>
              <div className="mt-2 text-sm text-fc-brand">
                <div className="font-semibold">{owner.email ?? "—"}</div>
                <div className="text-xs text-fc-muted mt-1">id: {owner.id}</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-fc-muted">Role</div>
                  <div className="mt-0.5 font-medium text-fc-brand">
                    {owner.role}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-fc-muted">Last login</div>
                  <div className="mt-0.5 font-medium text-fc-brand">
                    {fmt(owner.lastSignInAt)}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/users/${encodeURIComponent(owner.id)}`}
                    className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
                  >
                    Open user detail
                  </Link>
                </div>

                <AdminUserActionsCard
                  userId={owner.id}
                  email={owner.email}
                  currentRole={owner.role}
                  compact
                />
              </div>
            </>
          ) : (
            <div className="mt-2 text-sm text-fc-muted">No owner user found.</div>
          )}
        </div>

        <div className="rounded-lg border border-fc-border bg-fc-surface-muted p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
            Workers
          </div>
          <div className="mt-3 space-y-2">
            {(data?.workers ?? []).slice(0, 8).map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-fc-border bg-white px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-fc-brand">
                    {w.name}
                  </div>
                  <div className="text-xs text-fc-muted">
                    {w.phone ?? "—"} • {w.role} • {w.inviteStatus ?? "—"}
                  </div>
                </div>
              </div>
            ))}
            {(data?.workers?.length ?? 0) > 8 ? (
              <div className="text-xs text-fc-muted">
                +{(data?.workers?.length ?? 0) - 8} more…
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

