export const VALID_PLAN_IDS = ["starter", "growth", "pro"] as const;

export type PlanId = (typeof VALID_PLAN_IDS)[number];

export function isPlanId(value: string): value is PlanId {
  return (VALID_PLAN_IDS as readonly string[]).includes(value);
}

export const WORKER_LIMIT_BY_PLAN_ID: Record<PlanId, number> = {
  starter: 5,
  growth: 15,
  pro: 30,
};

export function suggestPlanIdForWorkers(workerCount: number): PlanId {
  const n = Math.max(0, Math.floor(workerCount) || 0);
  if (n <= WORKER_LIMIT_BY_PLAN_ID.starter) return "starter";
  if (n <= WORKER_LIMIT_BY_PLAN_ID.growth) return "growth";
  return "pro";
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
