"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { routes } from "@/lib/routes";

const tiers = [
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

        <div className="mt-20 grid gap-6 md:grid-cols-3 md:items-stretch">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-[20px] border bg-[rgba(255,255,255,0.04)] backdrop-blur-[30px] transition-all duration-300 ${
                tier.highlighted
                  ? "z-10 border-[#5b7cff] ring-1 ring-[#5b7cff]/20 md:-mt-2 md:scale-[1.02]"
                  : "border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-white/15"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {tier.highlighted && (
                <>
                  <div className="h-0.5 w-full shrink-0 bg-[#5b7cff]" aria-hidden />
                  <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-[#5b7cff]">
                    {tier.badge}
                  </p>
                </>
              )}
              <div
                className={
                  tier.highlighted
                    ? "mt-4 flex flex-1 flex-col px-6 pb-8"
                    : "flex flex-1 flex-col p-6"
                }
              >
                <h3 className="font-legend-display text-2xl font-semibold text-white">
                  {tier.name}
                </h3>
                <p className="mt-2 font-legend-body text-base text-[#a1a1aa]">
                  {tier.workers}
                </p>
                <p className="mt-6 font-legend-display text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl">
                  ${tier.price}
                  <span className="ml-1 text-xl font-normal text-[#a1a1aa]">
                    /month
                  </span>
                </p>
                <div className="mt-8">
                  <Link
                    href={`${routes.owner.subscribe}?plan=${tier.id}`}
                    className={`inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-xl text-center font-legend-body font-semibold transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#5b7cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-[#5b7cff] to-[#9d6cff] text-white hover:scale-[1.02]"
                        : "border border-[rgba(255,255,255,0.2)] text-white hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    Start with {tier.name}
                  </Link>
                </div>
                {tier.highlighted && (
                  <p className="mt-4 text-center font-legend-body text-sm text-[#a1a1aa]">
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
