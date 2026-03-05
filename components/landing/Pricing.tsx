"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { routes } from "@/lib/routes";

const tiers = [
  { id: "starter" as const, name: "Starter", price: 49, workers: "Up to 5 workers", highlighted: false },
  { id: "growth" as const, name: "Growth", price: 89, workers: "Up to 15 workers", highlighted: true, badge: "Most companies choose this" },
  { id: "pro" as const, name: "Pro", price: 149, workers: "Up to 30 workers", highlighted: false },
];

export function Pricing() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-24 lg:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="pricing-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Recover $6,000. Pay $149.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-fc-muted fc-body-air">
            One recovered job overrun pays for this.
          </p>
        </ScrollReveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:items-end">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-[var(--fc-radius-lg)] transition-all duration-200 ${
                tier.highlighted
                  ? "z-10 border-2 border-fc-orange-500 bg-white shadow-fc-panel-lg sm:-mt-2 sm:scale-[1.03] sm:pb-10 sm:pt-0 sm:px-7 ring-1 ring-fc-orange-500/20"
                  : "border border-fc-border bg-white p-6 shadow-fc-sm opacity-95 hover:opacity-100 hover:shadow-fc-md hover:border-fc-steel-500/50 hover:-translate-y-0.5"
              }`}
              whileHover={
                reduceMotion
                  ? undefined
                  : tier.highlighted
                    ? { boxShadow: "0 20px 40px -8px rgb(3 7 18 / 0.25), 0 0 0 1px rgba(249, 115, 22, 0.15)" }
                    : {}
              }
            >
              {tier.highlighted && (
                <>
                  <div className="h-1 w-full shrink-0 bg-fc-accent" aria-hidden />
                  <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-fc-accent">
                    {tier.badge}
                  </p>
                </>
              )}
              <div className={tier.highlighted ? "mt-4 px-2 pb-2" : ""}>
                <h3
                  className={`font-display text-2xl font-bold text-fc-brand ${
                    tier.highlighted ? "" : "opacity-90"
                  }`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`mt-1.5 text-base ${
                    tier.highlighted ? "text-fc-muted" : "text-fc-muted opacity-90"
                  }`}
                >
                  {tier.workers}
                </p>
                <p
                  className={`mt-6 font-display font-extrabold tracking-tight text-fc-brand fc-display-number ${
                    tier.highlighted ? "text-5xl sm:text-6xl" : "text-4xl"
                  }`}
                >
                  ${tier.price}
                  <span className="ml-1 text-xl font-normal text-fc-muted">
                    /month
                  </span>
                </p>
                <div className="mt-6">
                  {tier.highlighted ? (
                    <MagneticButton href={`${routes.owner.subscribe}?plan=${tier.id}`} variant="primary">
                      Get {tier.name}
                    </MagneticButton>
                  ) : (
                    <Link
                      href={`${routes.owner.subscribe}?plan=${tier.id}`}
                      className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] bg-fc-brand px-6 py-3 text-center font-bold text-white transition-all duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                    >
                      Get {tier.name}
                    </Link>
                  )}
                </div>
                {tier.highlighted && (
                  <p className="mt-4 text-center text-xs text-fc-muted">
                    1 recovered overrun pays for this.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
