"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FeatureCarousel } from "@/components/ui/feature-carousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  "A job runs 45-90 minutes over",
  "Labor cost goes beyond what was quoted",
  "The schedule slips and the team falls behind",
  "Overtime is used to catch up",
] as const;

const carouselItems = steps.map((title, i) => ({
  id: `money-flow-${i + 1}`,
  label: `Step ${i + 1}`,
  title,
}));

export function MoneyDisappearsFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-20 lg:py-24"
      aria-labelledby="money-disappears-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="money-disappears-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            You Don&apos;t Lose It On One Job
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-12 sm:mt-14"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <FeatureCarousel items={carouselItems} autoPlayIntervalMs={5200} />
        </motion.div>

        <p className="mt-12 hyphens-none break-normal text-center text-xl font-bold text-fc-brand">
          Now repeat that across 50, 100, or 200 jobs.
        </p>
        <p className="mt-3 hyphens-none break-normal text-center text-lg text-fc-muted fc-body-air">
          That&apos;s where thousands of dollars disappear each month.
        </p>
      </div>
    </section>
  );
}

