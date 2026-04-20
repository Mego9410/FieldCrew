"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";

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
    invoices?: Array<{
      id: string;
      status: string | null;
      created: number;
      amountDue: number | null;
      amountPaid: number | null;
      hostedInvoiceUrl: string | null;
      attemptCount: number | null;
      nextPaymentAttempt: number | null;
    }>;
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

  const nextPaymentDate = useMemo(() => {
    const ts = data?.stripe.subscription?.currentPeriodEnd;
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString();
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
    <Card className="mt-6 rounded-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-fc-brand">Billing (Stripe)</div>
          <div className="mt-0.5 text-sm text-fc-muted">
            Server-only controls. Every action is audited.
          </div>
        </div>
        <button
          type="button"
          onClick={reload}
          disabled={loading || busy !== null}
          className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-fc-muted">Loading…</div>
      ) : data ? (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-fc-border bg-fc-surface-muted p-4">
            <div className="text-xs font-semibold text-fc-muted">Identifiers</div>
            <div className="mt-2 space-y-1 text-sm text-fc-brand">
              <div>
                <span className="text-fc-muted">Customer</span>:{" "}
                {data.company.stripeCustomerId ?? "—"}
              </div>
              <div>
                <span className="text-fc-muted">Subscription</span>:{" "}
                {data.company.stripeSubscriptionId ?? "—"}
              </div>
              <div>
                <span className="text-fc-muted">Status</span>:{" "}
                {data.stripe.subscription?.status ?? "—"}
              </div>
              <div>
                <span className="text-fc-muted">Next payment</span>:{" "}
                {nextPaymentDate}
              </div>
              <div>
                <span className="text-fc-muted">Payment method</span>:{" "}
                {paymentMethod}
              </div>
            </div>
            {!data.company.stripeSubscriptionId ? (
              <div className="mt-3 text-xs text-amber-800">
                No Stripe subscription is linked yet. Billing actions are disabled.
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-fc-border bg-fc-surface-muted p-4">
            <div className="text-xs font-semibold text-fc-muted">Actions</div>

            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={planId}
                  onChange={(e) =>
                    setPlanId(e.target.value as "starter" | "growth" | "pro")
                  }
                  className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
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
                  disabled={busy !== null || !data.company.stripeSubscriptionId}
                  className="rounded-lg bg-fc-brand px-3 py-2 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-60"
                >
                  {busy === "change-plan" ? "Updating…" : "Change plan"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (e.g. GROWTH9)"
                  className="w-64 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={busy !== null || !promoCode.trim() || !data.company.stripeSubscriptionId}
                  className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-60"
                >
                  {busy === "apply-coupon" ? "Applying…" : "Apply coupon"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={busy !== null || !data.company.stripeSubscriptionId}
                  className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-60"
                >
                  {busy === "retry" ? "Retrying…" : "Retry failed payment"}
                </button>
                <button
                  type="button"
                  onClick={onPauseToggle}
                  disabled={busy !== null || !data.company.stripeSubscriptionId}
                  className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-60"
                >
                  {busy === "pause"
                    ? "Updating…"
                    : data.stripe.subscription?.paused
                      ? "Resume"
                      : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={busy !== null || !data.company.stripeSubscriptionId}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                >
                  {busy === "cancel" ? "Canceling…" : "Cancel (period end)"}
                </button>
              </div>

              <div className="rounded-lg border border-fc-border bg-white p-3">
                <div className="text-xs font-semibold text-fc-muted">Refund</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <input
                    value={refundPaymentIntent}
                    onChange={(e) => setRefundPaymentIntent(e.target.value)}
                    placeholder="payment_intent id (pi_...)"
                    className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
                  />
                  <input
                    value={refundChargeId}
                    onChange={(e) => setRefundChargeId(e.target.value)}
                    placeholder="or charge id (ch_...)"
                    className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
                  />
                  <input
                    value={refundAmountCents}
                    onChange={(e) => setRefundAmountCents(e.target.value)}
                    placeholder="amount (cents) optional"
                    className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
                  />
                  <button
                    type="button"
                    onClick={onRefund}
                    disabled={
                      busy !== null ||
                      !data.company.stripeSubscriptionId ||
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

      {data?.stripe?.invoices?.length ? (
        <div className="mt-4 rounded-lg border border-fc-border bg-fc-surface-muted p-4">
          <div className="text-xs font-semibold text-fc-muted">
            Recent invoices
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {data.stripe.invoices.slice(0, 5).map((i) => (
              <div
                key={i.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm"
              >
                <div className="text-fc-brand">
                  <span className="font-semibold">{i.status ?? "—"}</span>{" "}
                  <span className="text-fc-muted">
                    • {new Date(i.created * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-fc-brand">
                    {typeof i.amountDue === "number"
                      ? `$${(i.amountDue / 100).toFixed(2)}`
                      : "—"}
                  </div>
                  {i.hostedInvoiceUrl ? (
                    <a
                      className="text-fc-accent hover:underline"
                      href={i.hostedInvoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-fc-muted">
            Tip: use “Retry failed payment” if an invoice is open/uncollectible.
          </div>
        </div>
      ) : null}

      {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}
    </Card>
  );
}

