"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { routes } from "@/lib/routes";
import { Pricing as PricingGrid } from "@/components/pricing";

const tiers = [
  {
    id: "starter" as const,
    name: "Starter",
    price: "49",
    yearlyPrice: "470", // ~20% off
    workers: "Up to 5 workers",
    isPopular: false,
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: "89",
    yearlyPrice: "855",
    workers: "Up to 15 workers",
    isPopular: true,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "149",
    yearlyPrice: "1430",
    workers: "Up to 30 workers",
    isPopular: false,
  },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      ref={ref}
      className="border-y border-[rgba(255,255,255,0.06)] bg-[#111111] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            07
          </span>
          <h2
            id="pricing-heading"
            className="font-legend-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Recover $6,000. Pay $149.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-legend-body text-lg text-[#a1a1aa] leading-relaxed">
            One recovered job overrun pays for this.
          </p>
        </motion.div>

        <div className="mt-16 rounded-2xl bg-[#050816] px-4 py-10 sm:px-6 md:px-10">
          <PricingGrid
            title="Simple, transparent pricing for HVAC teams under 30 techs"
            description={
              "Choose the plan that fits your crew size.\nAll plans include FieldCrew's labour tracking, owner dashboards, and support."
            }
            plans={tiers.map((tier) => ({
              name: tier.name,
              price: tier.price,
              yearlyPrice: tier.yearlyPrice,
              period: "month",
              isPopular: tier.isPopular,
              href: `${routes.owner.subscribe}?plan=${tier.id}`,
              buttonText: `Start with ${tier.name}`,
              description: tier.workers,
              features: [
                "Clock into jobs only — no generic shifts",
                "Monthly labour profit report",
                "Overtime and underpriced work surfaced automatically",
              ],
            }))}
          />
        </div>
      </div>
    </section>
  );
}
