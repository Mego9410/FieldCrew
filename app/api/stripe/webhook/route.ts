import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { updateCompany } from "@/lib/data";

const secret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeKey = process.env.STRIPE_SECRET_KEY;

type UntypedFrom = {
  from: (table: string) => {
    upsert: (values: unknown, opts?: unknown) => Promise<{ error: { message: string } | null }>;
    insert: (values: unknown) => Promise<{ error: { message: string } | null }>;
    update: (values: unknown) => { eq: (col: string, v: unknown) => Promise<{ error: { message: string } | null }> };
    select: (cols?: string, opts?: unknown) => unknown;
  };
};

async function resolveCompanyIdByStripe(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  input: { stripeCustomerId?: string | null; stripeSubscriptionId?: string | null }
): Promise<string | null> {
  const stripeSubscriptionId = input.stripeSubscriptionId ?? null;
  const stripeCustomerId = input.stripeCustomerId ?? null;

  if (stripeSubscriptionId) {
    const { data } = await supabase
      .from("companies")
      .select("id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();
    const id = (data as { id?: string } | null)?.id ?? null;
    if (id) return id;
  }

  if (stripeCustomerId) {
    const { data } = await supabase
      .from("companies")
      .select("id")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();
    return (data as { id?: string } | null)?.id ?? null;
  }

  return null;
}

export async function POST(request: Request) {
  if (!secret || !stripeKey) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    // Don't hardcode apiVersion; use account default to avoid runtime mismatch.
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe/webhook] constructEvent failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    console.error("[stripe/webhook] No service role client");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const untyped = supabase as unknown as UntypedFrom;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.client_reference_id ?? (session as { metadata?: { company_id?: string } }).metadata?.company_id;
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        if (!companyId) {
          console.warn("[stripe/webhook] checkout.session.completed missing company_id");
          break;
        }
        let workerLimit = 5;
        if (subId && stripeKey) {
          try {
            const stripe = new Stripe(stripeKey);
            const sub = await stripe.subscriptions.retrieve(subId);
            const wl = sub.metadata?.worker_limit;
            if (wl != null) workerLimit = parseInt(String(wl), 10) || 5;
          } catch {
            // keep default 5
          }
        }
        await updateCompany(
          companyId,
          {
            stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
            stripeSubscriptionId: subId ?? undefined,
            subscriptionStatus: "active",
            workerLimit,
          },
          supabase
        );
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const companyId = sub.metadata?.company_id;
        if (!companyId) break;
        const workerLimit = sub.metadata?.worker_limit != null ? parseInt(String(sub.metadata.worker_limit), 10) : undefined;
        const { data: subUpdatedRow } = await supabase.from("companies").select("id").eq("stripe_subscription_id", sub.id).single();
        const companyIdUpdated = (subUpdatedRow as { id?: string } | null)?.id;
        if (companyIdUpdated) {
          await updateCompany(
            companyIdUpdated,
            { subscriptionStatus: sub.status, ...(workerLimit != null && { workerLimit }) },
            supabase
          );
        }

        // Snapshot subscription state for finance dashboard
        await untyped.from("stripe_subscription_snapshots").insert({
          stripe_subscription_id: sub.id,
          company_id: companyIdUpdated ?? companyId ?? null,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          effective_at: new Date(event.created * 1000).toISOString(),
          status: sub.status,
          worker_limit: workerLimit ?? null,
          cancel_at_period_end: Boolean(sub.cancel_at_period_end),
          paused: sub.pause_collection != null,
        });
        break;
      }
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const workerLimit =
          sub.metadata?.worker_limit != null ? parseInt(String(sub.metadata.worker_limit), 10) : undefined;

        const { data: row } = await supabase
          .from("companies")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .maybeSingle();
        const companyIdCreated = (row as { id?: string } | null)?.id ?? null;

        if (companyIdCreated) {
          await updateCompany(
            companyIdCreated,
            {
              subscriptionStatus: sub.status,
              ...(workerLimit != null && { workerLimit }),
              stripeCustomerId:
                typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? undefined,
            },
            supabase
          );
        }

        await untyped.from("stripe_subscription_snapshots").insert({
          stripe_subscription_id: sub.id,
          company_id: companyIdCreated,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          effective_at: new Date(event.created * 1000).toISOString(),
          status: sub.status,
          worker_limit: workerLimit ?? null,
          cancel_at_period_end: Boolean(sub.cancel_at_period_end),
          paused: sub.pause_collection != null,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const { data: subDeletedRow } = await supabase.from("companies").select("id").eq("stripe_subscription_id", sub.id).single();
        const companyIdDeleted = (subDeletedRow as { id?: string } | null)?.id;
        if (companyIdDeleted) {
          await updateCompany(companyIdDeleted, { subscriptionStatus: "canceled", stripeSubscriptionId: null }, supabase);
        }

        await untyped.from("stripe_subscription_snapshots").insert({
          stripe_subscription_id: sub.id,
          company_id: companyIdDeleted ?? null,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          effective_at: new Date(event.created * 1000).toISOString(),
          status: sub.status,
          worker_limit:
            sub.metadata?.worker_limit != null ? parseInt(String(sub.metadata.worker_limit), 10) : null,
          cancel_at_period_end: Boolean(sub.cancel_at_period_end),
          paused: sub.pause_collection != null,
        });
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.finalized":
      case "invoice.updated": {
        // Stripe's TS types vary by SDK version/account defaults; keep this tolerant.
        type StripeInvoiceLike = Stripe.Invoice & {
          subscription?: string | { id?: string } | null;
          status_transitions?: { paid_at?: number | null } | null;
        };
        const inv = event.data.object as unknown as StripeInvoiceLike;
        const stripeCustomerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id ?? null;
        const stripeSubscriptionId =
          typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id ?? null;
        const companyId = await resolveCompanyIdByStripe(supabase, {
          stripeCustomerId,
          stripeSubscriptionId,
        });

        await untyped.from("stripe_invoice_facts").upsert(
          {
            stripe_invoice_id: inv.id,
            company_id: companyId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            status: inv.status ?? null,
            created_at: new Date(inv.created * 1000).toISOString(),
            due_at: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
            paid_at: inv.status_transitions?.paid_at
              ? new Date(inv.status_transitions.paid_at * 1000).toISOString()
              : null,
            amount_due: inv.amount_due ?? null,
            amount_paid: inv.amount_paid ?? null,
            currency: inv.currency ?? null,
            attempt_count: inv.attempt_count ?? null,
            next_payment_attempt: inv.next_payment_attempt
              ? new Date(inv.next_payment_attempt * 1000).toISOString()
              : null,
            hosted_invoice_url: inv.hosted_invoice_url ?? null,
            updated_at: new Date(event.created * 1000).toISOString(),
          },
          { onConflict: "stripe_invoice_id" }
        );
        break;
      }
      case "charge.refunded":
      case "charge.updated": {
        type StripeChargeLike = Stripe.Charge & {
          invoice?: string | { id?: string } | null;
        };
        const ch = event.data.object as unknown as StripeChargeLike;
        const stripeCustomerId = typeof ch.customer === "string" ? ch.customer : ch.customer?.id ?? null;
        const stripeInvoiceId = typeof ch.invoice === "string" ? ch.invoice : ch.invoice?.id ?? null;
        const companyId = await resolveCompanyIdByStripe(supabase, { stripeCustomerId });

        await untyped.from("stripe_charge_facts").upsert(
          {
            stripe_charge_id: ch.id,
            company_id: companyId,
            stripe_customer_id: stripeCustomerId,
            stripe_invoice_id: stripeInvoiceId,
            created_at: new Date(ch.created * 1000).toISOString(),
            amount: ch.amount,
            amount_refunded: ch.amount_refunded ?? 0,
            refunded_at:
              (ch.amount_refunded ?? 0) > 0 ? new Date(event.created * 1000).toISOString() : null,
            currency: ch.currency ?? null,
            receipt_url: ch.receipt_url ?? null,
            updated_at: new Date(event.created * 1000).toISOString(),
          },
          { onConflict: "stripe_charge_id" }
        );
        break;
      }
      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
