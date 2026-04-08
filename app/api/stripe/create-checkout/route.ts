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

function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message || "Error";
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

function getStatusCode(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;
  const anyErr = err as { statusCode?: unknown; status?: unknown };
  const code = typeof anyErr.statusCode === "number" ? anyErr.statusCode : typeof anyErr.status === "number" ? anyErr.status : undefined;
  if (typeof code === "number" && Number.isFinite(code) && code >= 400 && code <= 599) return code;
  return undefined;
}

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!plan.stripePriceId) {
      return NextResponse.json({ error: "Stripe price not configured for plan" }, { status: 503 });
    }
    const promotionCodeId = plan.stripePromotionCodeId || null;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    // Don't hardcode apiVersion; use account default to avoid runtime mismatch.
    const stripe = new Stripe(secret);
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
      ...(promotionCodeId
        ? { discounts: [{ promotion_code: promotionCodeId }] }
        : { allow_promotion_codes: true }),
      subscription_data: {
        metadata: {
          company_id: company.id,
          worker_limit: String(workerLimit),
          plan_name: plan.name,
          ...(promotionCodeId
            ? { promo: "first_month_9_usd", promo_plan: plan.id }
            : { promo: "none" }),
        },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Ensure the client always receives JSON, not an HTML 500 page.
    const message = getErrorMessage(err);
    const status = getStatusCode(err) ?? 500;
    console.error("[stripe/create-checkout] failed", { status, message });
    return NextResponse.json({ error: message }, { status });
  }
}
