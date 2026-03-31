import { NextResponse } from "next/server";

/**
 * Back-compat shim for the recommended endpoint shape.
 * Internally delegates to the existing Stripe checkout creation logic.
 *
 * Expected payload:
 * - plan: "starter" | "growth" | "pro"
 * - optional successUrl, cancelUrl (currently ignored to avoid open-redirect risk)
 */
export async function POST(request: Request) {
  let body: { plan?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { POST: createStripeCheckout } = await import("@/app/api/stripe/create-checkout/route");
  // Forward to the existing handler, translating `plan` -> `planId`.
  const forwarded = new Request(request.url.replace("/api/billing/create-checkout-session", "/api/stripe/create-checkout"), {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ planId: body.plan }),
  });
  return createStripeCheckout(forwarded);
}

