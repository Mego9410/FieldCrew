import Link from "next/link";
import { headers } from "next/headers";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

type FinanceCompanyResponse = {
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
    subscription:
      | {
          id: string;
          status: string;
          paused: boolean;
          cancelAtPeriodEnd: boolean;
          currentPeriodEnd: number;
          latestInvoiceId: string | null;
          paymentMethodLast4: string | null;
        }
      | null;
    invoices: {
      id: string;
      status: string | null;
      created: number;
      amountDue: number | null;
      amountPaid: number | null;
      hostedInvoiceUrl: string | null;
      attemptCount: number | null;
      nextPaymentAttempt: number | null;
    }[];
    refundedCharges: {
      id: string;
      created: number;
      amount: number;
      amountRefunded: number;
      currency: string | null;
      receiptUrl: string | null;
    }[];
  };
};

function money(amount: number | null | undefined, currency = "usd") {
  if (amount == null) return "—";
  const sign = currency.toLowerCase() === "usd" ? "$" : "";
  return `${sign}${(amount / 100).toFixed(2)}`;
}

export default async function AdminFinanceCompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/admin/finances/${encodeURIComponent(companyId)}`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
      "x-forwarded-proto": proto,
      "x-forwarded-host": host,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return (
      <div className="px-4 py-6 sm:px-6 space-y-4">
        <Link href="/admin/finances" className="text-sm text-fc-muted hover:text-fc-accent">
          ← Back
        </Link>
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Finance detail</div>
          <div className="mt-2 text-sm text-red-700">Failed to load: {body?.error ?? res.statusText}</div>
        </Card>
      </div>
    );
  }

  const json = (await res.json()) as FinanceCompanyResponse;
  const c = json.company;
  const s = json.stripe;

  return (
    <div className="px-4 py-6 sm:px-6 space-y-6">
      <div className="space-y-2">
        <Link href="/admin/finances" className="text-sm text-fc-muted hover:text-fc-accent">
          ← Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-fc-brand">{c.name}</h1>
            <div className="mt-0.5 text-sm text-fc-muted">{c.id}</div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-fc-border bg-white px-2 py-1 text-xs text-fc-brand">
              {c.subscriptionStatus ?? "unknown"}
            </span>
            <Link
              href={`/admin/companies/${encodeURIComponent(c.id)}`}
              className="rounded-lg bg-fc-brand px-3 py-2 text-xs font-medium text-white hover:bg-fc-brand/90"
            >
              Open admin →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Stripe links</div>
          <div className="mt-2 space-y-1 text-sm text-fc-muted">
            <div>
              <span className="font-semibold text-fc-brand">Customer:</span>{" "}
              {c.stripeCustomerId ?? "—"}
            </div>
            <div>
              <span className="font-semibold text-fc-brand">Subscription:</span>{" "}
              {c.stripeSubscriptionId ?? "—"}
            </div>
            {s.customer ? (
              <div className="pt-2 text-xs text-fc-muted">
                {s.customer.email ?? "—"} {s.customer.name ? `• ${s.customer.name}` : ""}
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="rounded-xl">
          <div className="text-sm font-semibold text-fc-brand">Subscription</div>
          {s.subscription ? (
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-fc-muted">
              <div>
                <div className="text-xs font-semibold text-fc-muted">Status</div>
                <div className="mt-1 text-fc-brand font-semibold">{s.subscription.status}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-fc-muted">Payment method</div>
                <div className="mt-1 text-fc-brand font-semibold">
                  {s.subscription.paymentMethodLast4 ? `•••• ${s.subscription.paymentMethodLast4}` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-fc-muted">Paused</div>
                <div className="mt-1 text-fc-brand font-semibold">{s.subscription.paused ? "Yes" : "No"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-fc-muted">Cancel at period end</div>
                <div className="mt-1 text-fc-brand font-semibold">
                  {s.subscription.cancelAtPeriodEnd ? "Yes" : "No"}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs font-semibold text-fc-muted">Current period end</div>
                <div className="mt-1 text-fc-brand font-semibold">
                  {new Date(s.subscription.currentPeriodEnd * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-fc-muted">—</div>
          )}
        </Card>
      </div>

      <Card className="rounded-xl">
        <div className="text-sm font-semibold text-fc-brand">Recent invoices</div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Attempts</th>
                <th className="px-4 py-3">Next attempt</th>
                <th className="px-4 py-3">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {(s.invoices ?? []).map((i) => (
                <tr key={i.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3 text-fc-brand font-semibold">{i.id}</td>
                  <td className="px-4 py-3 text-fc-muted">{i.status ?? "—"}</td>
                  <td className="px-4 py-3 text-fc-muted">
                    {new Date(i.created * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{money(i.amountDue)}</td>
                  <td className="px-4 py-3 text-fc-brand">{money(i.amountPaid)}</td>
                  <td className="px-4 py-3 text-fc-muted">{i.attemptCount ?? "—"}</td>
                  <td className="px-4 py-3 text-fc-muted">
                    {i.nextPaymentAttempt ? new Date(i.nextPaymentAttempt * 1000).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {i.hostedInvoiceUrl ? (
                      <a
                        href={i.hostedInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(s.invoices ?? []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-fc-muted">
                    No invoices found (or Stripe is not linked for this company).
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="rounded-xl">
        <div className="text-sm font-semibold text-fc-brand">Refunded charges (V1)</div>
        <div className="mt-1 text-sm text-fc-muted">
          Stripe refunds aren’t listable by customer directly; this shows refunded charges for the customer.
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-fc-border bg-fc-surface-muted text-xs text-fc-muted">
              <tr>
                <th className="px-4 py-3">Charge</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Refunded</th>
                <th className="px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fc-border">
              {(s.refundedCharges ?? []).map((r) => (
                <tr key={r.id} className="hover:bg-fc-surface-muted/60">
                  <td className="px-4 py-3 text-fc-brand font-semibold">{r.id}</td>
                  <td className="px-4 py-3 text-fc-muted">
                    {new Date(r.created * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-fc-brand">{money(r.amount, r.currency ?? "usd")}</td>
                  <td className="px-4 py-3 text-fc-brand">{money(r.amountRefunded, r.currency ?? "usd")}</td>
                  <td className="px-4 py-3">
                    {r.receiptUrl ? (
                      <a
                        href={r.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-fc-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(s.refundedCharges ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-fc-muted">
                    No refunded charges found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

