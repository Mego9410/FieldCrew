import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { updateCompany } from "@/lib/data";

const secret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeKey = process.env.STRIPE_SECRET_KEY;

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
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const { data: subDeletedRow } = await supabase.from("companies").select("id").eq("stripe_subscription_id", sub.id).single();
        const companyIdDeleted = (subDeletedRow as { id?: string } | null)?.id;
        if (companyIdDeleted) {
          await updateCompany(companyIdDeleted, { subscriptionStatus: "canceled", stripeSubscriptionId: null }, supabase);
        }
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
