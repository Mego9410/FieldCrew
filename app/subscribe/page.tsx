"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import { FEATURES_LIST } from "@/components/landing/Features";
import { PricingSection4 } from "@/components/landing/PricingSection4";
import { isPlanId, type PlanId } from "@/lib/pricing-plans";

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoStarted = useRef(false);

  const handleSelectPlan = useCallback(async (planId: PlanId) => {
    setError(null);
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const next = `/subscribe?plan=${planId}`;
        window.location.href = `${routes.public.signup}?plan=${planId}&next=${encodeURIComponent(next)}`;
        return;
      }
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          res.status === 401
            ? "Please sign in to continue to checkout."
            : (data.error ?? "Something went wrong");
        setError(message);
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
    if (autoStarted.current || !plan || !isPlanId(plan)) return;

    let cancelled = false;
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (cancelled || !session) return;
        autoStarted.current = true;
        handleSelectPlan(plan);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams, handleSelectPlan]);

  return (
    <>
      <PricingSection4
        variant="subscribe"
        loadingPlanId={loadingPlan}
        onSelectPlan={handleSelectPlan}
        error={error}
      />

      <section
        id="features"
        className="border-t border-fc-border bg-white py-14 sm:py-20"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
              What&apos;s included
            </p>
            <h2
              id="features-heading"
              className="mt-4 font-display text-2xl font-bold text-fc-brand sm:text-4xl"
            >
              All plans include every feature
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-fc-muted">
              No feature gating. You get full visibility into labour cost from day one.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES_LIST.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="rounded-xl border border-fc-border bg-fc-surface-muted/50 p-6 shadow-fc-sm transition-colors hover:border-fc-accent/30"
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-fc-accent text-white"
                  aria-hidden
                >
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-fc-brand">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fc-muted">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
