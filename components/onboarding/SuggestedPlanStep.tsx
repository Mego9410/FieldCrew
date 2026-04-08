"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  SUBSCRIPTION_PLANS,
  type PlanId,
} from "@/lib/pricing-plans";

export function SuggestedPlanStep({
  workerCount,
  suggestedPlanId,
  onSelectPlan,
  onBack,
  isLoading = false,
}: {
  workerCount: number;
  suggestedPlanId: PlanId;
  onSelectPlan: (planId: PlanId) => void;
  onBack: () => void;
  isLoading?: boolean;
}) {
  const suggested = SUBSCRIPTION_PLANS.find((p) => p.id === suggestedPlanId) ?? SUBSCRIPTION_PLANS[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
          Suggested plan for {workerCount} workers
        </h2>
        <p className="mt-2 text-fc-muted">
          Based on your team size, here’s the plan that fits best right now. You can change this later.
        </p>
      </div>

      <div className="rounded-2xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">Recommended</p>
            <p className="mt-1 font-display text-2xl font-bold text-fc-brand">{suggested.name}</p>
            <p className="mt-1 text-sm text-fc-muted">{suggested.workers}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-extrabold tracking-tight text-fc-brand">
              ${suggested.price}
              <span className="ml-1 text-sm font-medium text-fc-muted">/mo</span>
            </p>
            <p className="mt-1 text-xs text-fc-muted">First month promo available at checkout</p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={() => onSelectPlan(suggestedPlanId)}
            disabled={isLoading}
            className="w-full bg-fc-accent text-white hover:bg-fc-accent-dark"
          >
            {isLoading ? "Redirecting…" : `Continue with ${suggested.name}`}
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
          Or pick a different plan
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              disabled={isLoading}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left shadow-fc-sm transition",
                plan.id === suggestedPlanId
                  ? "border-fc-accent/50 bg-fc-surface ring-2 ring-fc-accent/20"
                  : "border-fc-border bg-fc-surface hover:border-fc-accent/30"
              )}
            >
              <p className="font-display text-lg font-bold text-fc-brand">{plan.name}</p>
              <p className="mt-1 text-sm text-fc-muted">{plan.workers}</p>
              <p className="mt-3 font-display text-2xl font-extrabold text-fc-brand">
                ${plan.price}
                <span className="ml-1 text-xs font-medium text-fc-muted">/mo</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-fc-border pt-8">
        <Button type="button" onClick={onBack} variant="outline" disabled={isLoading}>
          Back
        </Button>
      </div>
    </div>
  );
}

