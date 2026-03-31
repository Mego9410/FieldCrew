import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getOwnerUserById } from "@/lib/data";
import { routes } from "@/lib/routes";
import { getBillingPlan } from "@/lib/billing/plans";

const WORKER_LIMITS: Record<"starter" | "growth" | "pro", number> = {
  starter: 5,
  growth: 15,
  pro: 30,
};

function getBaseUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const url = new URL(request.url);
  const origin = request.headers.get("origin") ?? url.origin;
  if (origin) return origin.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }
  let body: { planId?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const plan = getBillingPlan(body.planId ?? body.plan);
  if (!plan) {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }
  if (!plan.stripePriceId) {
    return NextResponse.json({ error: "Stripe price not configured for plan" }, { status: 503 });
  }
  if (!plan.stripePromotionCodeId) {
    // Safety requirement: never silently create a full-price session.
    return NextResponse.json({ error: "Launch offer is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const owner = await getOwnerUserById(user.id, supabase);
  if (!owner) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2026-02-25.clover" });
  const baseUrl = getBaseUrl(request);

  let customerId = company.stripeCustomerId ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: owner.email,
      name: owner.name,
      metadata: { company_id: company.id },
    });
    customerId = customer.id;
    const { updateCompany } = await import("@/lib/data");
    await updateCompany(
      company.id,
      { stripeCustomerId: customerId } as Parameters<typeof updateCompany>[1],
      supabase
    );
  }

  const workerLimit = WORKER_LIMITS[plan.id];
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}${routes.owner.onboarding}?payment=success`,
    cancel_url: `${baseUrl}${routes.owner.subscribe}`,
    client_reference_id: company.id,
    allow_promotion_codes: false,
    discounts: [{ promotion_code: plan.stripePromotionCodeId }],
    subscription_data: {
      metadata: {
        company_id: company.id,
        worker_limit: String(workerLimit),
        plan_name: plan.name,
        promo: "first_month_9_usd",
        promo_plan: plan.id,
      },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
