import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createStripeServerClient } from "@/lib/stripe/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const stripe = createStripeServerClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { companyId } = await params;
  const { data: company, error } = await supabase
    .from("companies")
    .select(
      "id,name,stripe_customer_id,stripe_subscription_id,subscription_status,worker_limit"
    )
    .eq("id", companyId)
    .single();

  if (error || !company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const stripeCustomerId = (company as { stripe_customer_id?: string | null }).stripe_customer_id ?? null;
  const stripeSubscriptionId = (company as { stripe_subscription_id?: string | null }).stripe_subscription_id ?? null;

  type StripeCustomerLike = { id: string; email?: string | null; name?: string | null };
  type StripeSubscriptionLike = {
    id: string;
    status: string;
    pause_collection: unknown | null;
    cancel_at_period_end: boolean;
    current_period_end: number;
    latest_invoice: unknown;
    default_payment_method: unknown;
  };
  type StripeInvoiceLike = {
    id: string;
    status: string | null;
    created: number;
    amount_due: number | null;
    amount_paid: number | null;
    hosted_invoice_url: string | null;
    attempt_count?: number;
    next_payment_attempt?: number | null;
  };

  const customer: StripeCustomerLike | null =
    stripeCustomerId ? ((await stripe.customers.retrieve(stripeCustomerId)) as unknown as StripeCustomerLike) : null;

  const subscription: StripeSubscriptionLike | null =
    stripeSubscriptionId
      ? ((await stripe.subscriptions.retrieve(stripeSubscriptionId, {
          expand: ["latest_invoice", "default_payment_method"],
        })) as unknown as StripeSubscriptionLike)
      : null;

  let invoices: StripeInvoiceLike[] = [];
  if (stripeCustomerId && stripeSubscriptionId) {
    try {
      const list = await stripe.invoices.list({
        customer: stripeCustomerId,
        subscription: stripeSubscriptionId,
        limit: 10,
      });
      invoices = (list.data ?? []) as unknown as StripeInvoiceLike[];
    } catch {
      invoices = [];
    }
  }

  return NextResponse.json({
    company: {
      id: (company as { id: string }).id,
      name: (company as { name: string }).name,
      subscriptionStatus: (company as { subscription_status?: string | null }).subscription_status ?? null,
      workerLimit: (company as { worker_limit?: number | null }).worker_limit ?? null,
      stripeCustomerId,
      stripeSubscriptionId,
    },
    stripe: {
      customer: customer
        ? {
            id: customer.id,
            email: (customer as { email?: string | null }).email ?? null,
            name: (customer as { name?: string | null }).name ?? null,
          }
        : null,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            paused: subscription.pause_collection != null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: subscription.current_period_end,
            latestInvoiceId:
              typeof subscription.latest_invoice === "string"
                ? subscription.latest_invoice
                : (subscription.latest_invoice as { id?: string } | null | undefined)?.id ??
                  null,
            paymentMethodLast4:
              typeof subscription.default_payment_method === "string"
                ? null
                : (
                    subscription.default_payment_method as
                      | { card?: { last4?: string } }
                      | null
                      | undefined
                  )?.card?.last4 ?? null,
          }
        : null,
      invoices: invoices.map((i) => ({
        id: i.id,
        status: i.status ?? null,
        created: i.created,
        amountDue: i.amount_due ?? null,
        amountPaid: i.amount_paid ?? null,
        hostedInvoiceUrl: i.hosted_invoice_url ?? null,
        attemptCount: i.attempt_count ?? null,
        nextPaymentAttempt: i.next_payment_attempt ?? null,
      })),
    },
  });
}

