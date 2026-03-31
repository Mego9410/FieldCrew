"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { FEATURES_LIST } from "@/components/landing/Features";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import {
  SUBSCRIPTION_PLANS,
  type PlanId,
} from "@/lib/pricing-plans";
import { BILLING_PLANS } from "@/lib/billing/plans";
import { PromoBadge } from "@/components/billing/PromoBadge";

const PLAN_FEATURE_TITLES = FEATURES_LIST.slice(0, 4).map((f) => f.title);

export type PricingSectionVariant = "marketing" | "subscribe";

export type PricingSection4Props = {
  variant?: PricingSectionVariant;
  /** Subscribe flow: id of plan currently loading checkout */
  loadingPlanId?: PlanId | null;
  onSelectPlan?: (planId: PlanId) => void;
  error?: string | null;
  className?: string;
};

export function PricingSection4({
  variant = "marketing",
  loadingPlanId = null,
  onSelectPlan,
  error,
  className,
}: PricingSection4Props) {
  const reduceMotion = useReducedMotion();
  const isSubscribe = variant === "subscribe";

  const heading = variant === "marketing" ? "Get your first month for $9" : "Choose your plan";
  const subheading =
    variant === "marketing"
      ? "Choose your plan now and your first month is just $9. Standard monthly pricing starts after that."
      : "First month for $9. Then standard monthly pricing. Cancel anytime.";

  const HeadingTag = variant === "subscribe" ? "h1" : "h2";

  return (
    <section
      id="pricing"
      className={cn(
        "relative overflow-hidden border-b border-white/10 py-16 sm:py-24 lg:py-28",
        className,
      )}
      aria-labelledby="pricing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fc-navy-950 via-slate-950 to-fc-navy-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.35), transparent),
            radial-gradient(1px 1px at 50% 20%, rgba(249,115,22,0.4), transparent),
            radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.25), transparent)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-fc-orange-500/10 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute -right-1/4 bottom-0 h-[380px] w-[60%] rounded-full bg-violet-600/10 blur-[90px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span
            className="mx-auto mb-4 block h-1 w-12 rounded-full bg-gradient-to-r from-fc-orange-500 to-amber-400"
            aria-hidden
          />
          <div className="mb-4 flex justify-center">
            <PromoBadge>Launch offer</PromoBadge>
          </div>
          <HeadingTag
            id="pricing-heading"
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {heading}
          </HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            {subheading}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            Applies to first month only.
          </p>
        </ScrollReveal>

        {error && (
          <div
            className="mx-auto mt-6 max-w-lg rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-center text-sm text-red-100"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mt-14 grid gap-6 sm:grid-cols-3 sm:items-stretch">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const href = `${routes.owner.subscribe}?plan=${plan.id}`;
            const showLoader = isSubscribe && loadingPlanId === plan.id;
            const promo = BILLING_PLANS[plan.id];

            return (
              <motion.div
                key={plan.id}
                initial={
                  reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : index * 0.08,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-2xl border bg-white/[0.04] p-6 shadow-xl backdrop-blur-md transition-all duration-200",
                  plan.highlighted
                    ? "z-10 border-fc-orange-500/80 ring-1 ring-fc-orange-500/30 sm:-translate-y-1 sm:scale-[1.02]"
                    : "border-white/10 hover:border-white/20",
                )}
              >
                {plan.highlighted && plan.badge && (
                  <>
                    <div
                      className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-fc-orange-500 to-amber-400"
                      aria-hidden
                    />
                    <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-200/60">
                      {plan.badge}
                    </p>
                  </>
                )}

                <div className={cn("flex flex-1 flex-col", plan.highlighted && "pt-1")}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <span className="inline-flex shrink-0 items-center rounded-full border border-white/25 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-100/90">
                      {promo.promoBadge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{plan.workers}</p>

                  <p className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    ${plan.price}
                    <span className="ml-1 text-lg font-medium text-slate-400">
                      /month
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-fc-orange-200">
                    {promo.promoLine}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{promo.afterPromoLine}</p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-slate-300">
                    {PLAN_FEATURE_TITLES.map((title) => (
                      <li key={title} className="flex gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-fc-orange-400"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        <span>{title}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {isSubscribe && onSelectPlan ? (
                      <button
                        type="button"
                        disabled={!!loadingPlanId}
                        onClick={() => onSelectPlan(plan.id)}
                        className={cn(
                          "flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-center text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-fc-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50",
                          plan.highlighted
                            ? "bg-gradient-to-r from-fc-orange-500 to-amber-500 text-white hover:opacity-95"
                            : "border border-white/20 bg-white/5 text-white hover:bg-white/10",
                        )}
                      >
                        {showLoader ? "Redirecting…" : `Start ${plan.name} for $9`}
                      </button>
                    ) : plan.highlighted ? (
                      <MagneticButton
                        href={href}
                        variant="primary"
                        className="w-full justify-center text-base"
                      >
                        Start {plan.name} for $9
                      </MagneticButton>
                    ) : (
                      <Link
                        href={href}
                        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        Start {plan.name} for $9
                      </Link>
                    )}
                  </div>

                  {plan.highlighted && (
                    <p className="mt-3 text-center text-xs text-slate-500">
                      Applies to the first month only.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {isSubscribe && (
          <p className="mt-10 text-center text-sm text-slate-500">
            <Link
              href={routes.public.home}
              className="text-fc-orange-400 underline-offset-4 hover:text-fc-orange-300 hover:underline"
            >
              Back to home
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
