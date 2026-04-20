"use client";

import { useEffect, useMemo, useState } from "react";

type BillingSummary = {
  company: {
    id: string;
    name: string;
    subscriptionStatus: string | null;
    workerLimit: number | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
  stripe: {
    customer: { id: string; email: string | null; name: string | null } | null;
    subscription: {
      id: string;
      status: string;
      paused: boolean;
      cancelAtPeriodEnd: boolean;
      currentPeriodEnd: number;
      latestInvoiceId: string | null;
      paymentMethodLast4: string | null;
    } | null;
  };
};

const planOptions = [
  { id: "starter", label: "Starter (5 workers)" },
  { id: "growth", label: "Growth (15 workers)" },
  { id: "pro", label: "Pro (30 workers)" },
] as const;

export function BillingCard({ companyId }: { companyId: string }) {
  const [data, setData] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [planId, setPlanId] = useState<"starter" | "growth" | "pro">("starter");
  const [refundPaymentIntent, setRefundPaymentIntent] = useState("");
  const [refundChargeId, setRefundChargeId] = useState("");
  const [refundAmountCents, setRefundAmountCents] = useState("");

  const reload = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/billing/${encodeURIComponent(companyId)}/summary`,
        { cache: "no-store" }
      );
      const json = (await res.json().catch(() => ({}))) as BillingSummary & {
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setData(json);
      const wl = json.company.workerLimit ?? 5;
      setPlanId(wl === 30 ? "pro" : wl === 15 ? "growth" : "starter");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load billing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const paymentMethod = useMemo(() => {
    const last4 = data?.stripe.subscription?.paymentMethodLast4;
    return last4 ? `•••• ${last4}` : "—";
  }, [data]);

  const post = async (path: string, body?: unknown) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : "{}",
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(json.error ?? res.statusText);
  };

  const onChangePlan = async () => {
    setError(null);
    setBusy("change-plan");
    try {
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/change-plan`,
        { planId, prorationBehavior: "create_prorations" }
      );
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onApplyCoupon = async () => {
    setError(null);
    setBusy("apply-coupon");
    try {
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/apply-coupon`,
        { promoCode }
      );
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onCancel = async () => {
    setError(null);
    setBusy("cancel");
    try {
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/cancel`,
        { atPeriodEnd: true }
      );
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onPauseToggle = async () => {
    setError(null);
    setBusy("pause");
    try {
      const currentlyPaused = Boolean(data?.stripe.subscription?.paused);
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/pause`,
        { pause: !currentlyPaused }
      );
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onRetry = async () => {
    setError(null);
    setBusy("retry");
    try {
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/retry-failed-payment`
      );
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onRefund = async () => {
    setError(null);
    setBusy("refund");
    try {
      const amountCents = refundAmountCents.trim()
        ? Math.max(0, parseInt(refundAmountCents.trim(), 10) || 0)
        : undefined;
      await post(
        `/api/admin/billing/${encodeURIComponent(companyId)}/refund`,
        {
          paymentIntentId: refundPaymentIntent.trim() || undefined,
          chargeId: refundChargeId.trim() || undefined,
          amountCents,
        }
      );
      setRefundPaymentIntent("");
      setRefundChargeId("");
      setRefundAmountCents("");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-200">Billing (Stripe)</div>
          <div className="mt-1 text-sm text-slate-300">
            Server-only controls. Every action is audited.
          </div>
        </div>
        <button
          type="button"
          onClick={reload}
          disabled={loading || busy !== null}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-400">Loading…</div>
      ) : data ? (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs font-medium text-slate-400">Identifiers</div>
            <div className="mt-2 space-y-1 text-sm text-slate-200">
              <div>
                <span className="text-slate-400">Customer</span>:{" "}
                {data.company.stripeCustomerId ?? "—"}
              </div>
              <div>
                <span className="text-slate-400">Subscription</span>:{" "}
                {data.company.stripeSubscriptionId ?? "—"}
              </div>
              <div>
                <span className="text-slate-400">Status</span>:{" "}
                {data.stripe.subscription?.status ?? "—"}
              </div>
              <div>
                <span className="text-slate-400">Payment method</span>:{" "}
                {paymentMethod}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs font-medium text-slate-400">Actions</div>

            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={planId}
                  onChange={(e) =>
                    setPlanId(e.target.value as "starter" | "growth" | "pro")
                  }
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  {planOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onChangePlan}
                  disabled={busy !== null}
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
                >
                  {busy === "change-plan" ? "Updating…" : "Change plan"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (e.g. GROWTH9)"
                  className="w-64 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={busy !== null || !promoCode.trim()}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-60"
                >
                  {busy === "apply-coupon" ? "Applying…" : "Apply coupon"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={busy !== null}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-60"
                >
                  {busy === "retry" ? "Retrying…" : "Retry failed payment"}
                </button>
                <button
                  type="button"
                  onClick={onPauseToggle}
                  disabled={busy !== null}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-60"
                >
                  {busy === "pause" ? "Updating…" : "Pause/resume"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={busy !== null}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                >
                  {busy === "cancel" ? "Canceling…" : "Cancel (period end)"}
                </button>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-medium text-slate-400">Refund</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <input
                    value={refundPaymentIntent}
                    onChange={(e) => setRefundPaymentIntent(e.target.value)}
                    placeholder="payment_intent id (pi_...)"
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                  />
                  <input
                    value={refundChargeId}
                    onChange={(e) => setRefundChargeId(e.target.value)}
                    placeholder="or charge id (ch_...)"
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                  />
                  <input
                    value={refundAmountCents}
                    onChange={(e) => setRefundAmountCents(e.target.value)}
                    placeholder="amount (cents) optional"
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={onRefund}
                    disabled={
                      busy !== null ||
                      (!refundPaymentIntent.trim() && !refundChargeId.trim())
                    }
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy === "refund" ? "Refunding…" : "Issue refund"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
    </div>
  );
}

