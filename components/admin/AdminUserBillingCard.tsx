"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";

type PlanId = "starter" | "growth" | "pro";

const PLAN_BY_LIMIT: Record<number, PlanId> = {
  5: "starter",
  15: "growth",
  30: "pro",
};

function planFromWorkerLimit(workerLimit: number | null | undefined): PlanId {
  return PLAN_BY_LIMIT[workerLimit ?? 5] ?? "starter";
}

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(json.error ?? res.statusText);
  return json as Record<string, unknown>;
}

export function AdminUserBillingCard({
  companyId,
  stripeSubscriptionId,
  workerLimit,
  subscriptionStatus,
  comped,
}: {
  companyId: string;
  stripeSubscriptionId: string | null;
  workerLimit: number | null;
  subscriptionStatus: string | null;
  comped: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [planId, setPlanId] = useState<PlanId>(() => planFromWorkerLimit(workerLimit));
  const [isComped, setIsComped] = useState<boolean>(comped);

  const hasStripe = Boolean(stripeSubscriptionId);
  const statusPill = useMemo(() => {
    const label = subscriptionStatus ?? "unknown";
    return (
      <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
        {label}
      </span>
    );
  }, [subscriptionStatus]);

  return (
    <Card className="rounded-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-fc-brand">Billing</div>
          <div className="mt-0.5 text-sm text-fc-muted">
            Change plan and control charging for testing.
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {statusPill}
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
              {hasStripe ? "Stripe subscription" : "DB-only"}
            </span>
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
              comped: {isComped ? "yes" : "no"}
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold text-fc-muted">Plan</div>
          <div className="mt-1 flex items-center gap-2">
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value as PlanId)}
              className="w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
              disabled={busy !== null}
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="pro">Pro</option>
            </select>
            <button
              type="button"
              disabled={busy !== null}
              onClick={async () => {
                setError(null);
                setBusy("plan");
                try {
                  if (hasStripe) {
                    await post(`/api/admin/billing/${encodeURIComponent(companyId)}/change-plan`, {
                      planId,
                    });
                  } else {
                    await post(`/api/admin/companies/${encodeURIComponent(companyId)}/plan`, {
                      planId,
                    });
                  }
                  router.refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed");
                } finally {
                  setBusy(null);
                }
              }}
              className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-50"
            >
              {busy === "plan" ? "Saving…" : "Apply"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-fc-border bg-fc-surface-muted px-3 py-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-fc-brand">
                Don’t charge (testing)
              </div>
              <div className="text-xs text-fc-muted">
                If the account has Stripe billing, this pauses/unpauses the subscription.
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-fc-brand">
              <input
                type="checkbox"
                checked={isComped}
                disabled={busy !== null}
                onChange={(e) => setIsComped(e.target.checked)}
                className="h-4 w-4 accent-fc-accent"
              />
              Comped
            </label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={async () => {
                setError(null);
                setBusy("comped");
                try {
                  // Persist "comped" flag in DB either way.
                  await post(`/api/admin/companies/${encodeURIComponent(companyId)}/comped`, {
                    comped: isComped,
                  });
                  // If Stripe exists, pause/unpause as the real "stop charging" control.
                  if (hasStripe) {
                    await post(`/api/admin/billing/${encodeURIComponent(companyId)}/pause`, {
                      pause: isComped,
                    });
                  }
                  router.refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed");
                } finally {
                  setBusy(null);
                }
              }}
              className="rounded-lg bg-fc-brand px-3 py-2 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50"
            >
              {busy === "comped" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

