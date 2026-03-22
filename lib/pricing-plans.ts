export const VALID_PLAN_IDS = ["starter", "growth", "pro"] as const;

export type PlanId = (typeof VALID_PLAN_IDS)[number];

export function isPlanId(value: string): value is PlanId {
  return (VALID_PLAN_IDS as readonly string[]).includes(value);
}

/** Display + checkout plan config (matches Stripe create-checkout and marketing copy). */
export const SUBSCRIPTION_PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 49,
    workers: "Up to 5 workers",
    highlighted: false,
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: 89,
    workers: "Up to 15 workers",
    highlighted: true,
    badge: "Most companies choose this",
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 149,
    workers: "Up to 30 workers",
    highlighted: false,
  },
] as const;
