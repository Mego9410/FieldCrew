import { isPlanId, type PlanId, SUBSCRIPTION_PLANS } from "@/lib/pricing-plans";

export type BillingPlan = {
  id: PlanId;
  name: string;
  /** Stripe Price ID for the subscription product. */
  stripePriceId: string;
  /** Stripe Promotion Code ID (NOT the human-readable code). */
  stripePromotionCodeId: string;
  /** Display-only marketing price (monthly). */
  monthlyPriceUsd: number;
  /** Display-only promo copy. */
  promoBadge: string;
  promoLine: string;
  afterPromoLine: string;
};

function env(name: string): string {
  const v = process.env[name];
  return typeof v === "string" ? v : "";
}

const priceByPlanId: Record<PlanId, number> = {
  starter: SUBSCRIPTION_PLANS.find((p) => p.id === "starter")?.price ?? 0,
  growth: SUBSCRIPTION_PLANS.find((p) => p.id === "growth")?.price ?? 0,
  pro: SUBSCRIPTION_PLANS.find((p) => p.id === "pro")?.price ?? 0,
};

export const BILLING_PLANS: Record<PlanId, BillingPlan> = {
  starter: {
    id: "starter",
    name: "Starter",
    stripePriceId: env("STRIPE_PRICE_STARTER"),
    stripePromotionCodeId: env("STRIPE_PROMO_STARTER9"),
    monthlyPriceUsd: priceByPlanId.starter,
    promoBadge: "First month $9",
    promoLine: "First month for $9",
    afterPromoLine: "Then standard monthly pricing applies.",
  },
  growth: {
    id: "growth",
    name: "Growth",
    stripePriceId: env("STRIPE_PRICE_GROWTH"),
    stripePromotionCodeId: env("STRIPE_PROMO_GROWTH9"),
    monthlyPriceUsd: priceByPlanId.growth,
    promoBadge: "First month $9",
    promoLine: "First month for $9",
    afterPromoLine: "Then standard monthly pricing applies.",
  },
  pro: {
    id: "pro",
    name: "Pro",
    stripePriceId: env("STRIPE_PRICE_PRO"),
    stripePromotionCodeId: env("STRIPE_PROMO_PRO9"),
    monthlyPriceUsd: priceByPlanId.pro,
    promoBadge: "First month $9",
    promoLine: "First month for $9",
    afterPromoLine: "Then standard monthly pricing applies.",
  },
} as const;

export function getBillingPlan(plan: string | undefined | null): BillingPlan | null {
  if (!plan) return null;
  const normalized = plan.toLowerCase();
  if (!isPlanId(normalized)) return null;
  return BILLING_PLANS[normalized];
}

