import Stripe from "stripe";

export function createStripeServerClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Don't hardcode apiVersion; use account default to avoid runtime mismatch.
  return new Stripe(key);
}

