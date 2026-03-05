import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getOwnerUserById } from "@/lib/data";

const PLAN_CONFIG: Record<"starter" | "growth" | "pro", { priceId: string; workerLimit: number; planName: string }> = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER ?? "",
    workerLimit: 5,
    planName: "Starter",
  },
  growth: {
    priceId: process.env.STRIPE_PRICE_GROWTH ?? "",
    workerLimit: 15,
    planName: "Growth",
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO ?? "",
    workerLimit: 30,
    planName: "Pro",
  },
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
  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const planId = body.planId?.toLowerCase() as keyof typeof PLAN_CONFIG | undefined;
  const config = planId && PLAN_CONFIG[planId] ? PLAN_CONFIG[planId] : undefined;
  if (!config || !config.priceId) {
    return NextResponse.json(
      { error: "Invalid plan or Stripe price not configured" },
      { status: 400 }
    );
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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: config.priceId, quantity: 1 }],
    success_url: `${baseUrl}/onboarding`,
    cancel_url: `${baseUrl}/subscribe`,
    client_reference_id: company.id,
    subscription_data: {
      metadata: {
        company_id: company.id,
        worker_limit: String(config.workerLimit),
        plan_name: config.planName,
      },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
