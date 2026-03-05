"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";

const VALID_PLANS = ["starter", "growth", "pro"] as const;
type PlanId = (typeof VALID_PLANS)[number];

const PLANS = [
  { id: "starter" as const, name: "Starter", price: 49, workers: "Up to 5 workers", highlighted: false },
  { id: "growth" as const, name: "Growth", price: 89, workers: "Up to 15 workers", highlighted: true, badge: "MOST COMPANIES CHOOSE THIS" },
  { id: "pro" as const, name: "Pro", price: 149, workers: "Up to 30 workers", highlighted: false },
];

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoStarted = useRef(false);

  const handleSelectPlan = useCallback(async (planId: "starter" | "growth" | "pro") => {
    setError(null);
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }, []);

  useEffect(() => {
    const plan = searchParams.get("plan")?.toLowerCase();
    if (autoStarted.current || !plan || !VALID_PLANS.includes(plan as PlanId)) return;
    autoStarted.current = true;
    handleSelectPlan(plan as PlanId);
  }, [searchParams, handleSelectPlan]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
          Choose your plan
        </h1>
        <p className="mt-2 text-fc-muted">
          Monthly subscription. Cancel anytime.
        </p>
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col overflow-hidden rounded-xl border-2 bg-white ${
              plan.highlighted
                ? "border-fc-orange-500 shadow-lg ring-1 ring-fc-orange-500/20"
                : "border-fc-border shadow-sm"
            }`}
          >
            {plan.highlighted && plan.badge && (
              <div className="bg-fc-accent px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                {plan.badge}
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-xl font-bold text-fc-brand">
                {plan.name}
              </h2>
              <p className="mt-1 text-sm text-fc-muted">{plan.workers}</p>
              <p className="mt-4 font-display text-3xl font-bold text-fc-brand">
                ${plan.price}
                <span className="text-base font-normal text-fc-muted">/month</span>
              </p>
              <div className="mt-6 flex-1" />
              <button
                type="button"
                disabled={!!loadingPlan}
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full rounded-lg px-4 py-3 text-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 disabled:opacity-50 ${
                  plan.highlighted
                    ? "bg-fc-accent text-white hover:bg-fc-accent/90"
                    : "bg-fc-brand text-white hover:bg-fc-brand/90"
                }`}
              >
                {loadingPlan === plan.id ? "Redirecting…" : `Get ${plan.name}`}
              </button>
              {plan.highlighted && (
                <p className="mt-3 text-center text-xs text-fc-muted">
                  1 recovered overrun pays for this.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-fc-muted">
        <Link href={routes.public.home} className="hover:text-fc-brand underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
