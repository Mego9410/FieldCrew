"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight } from "lucide-react";

const steps = [
  "A job runs 45-90 minutes over",
  "Labor cost goes beyond what was quoted",
  "The schedule slips and the team falls behind",
  "Overtime is used to catch up",
];

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
            You Don't Lose It On One Job
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {steps.map((title, i) => (
            <div key={title} className="flex-1">
              <div className="rounded-[var(--fc-radius)] border border-fc-border bg-white p-6 shadow-fc-sm">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-fc-accent">
                  Step {i + 1}
                </p>
                <p className="mt-3 text-lg font-semibold text-fc-brand fc-body-air">
                  {title}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden pt-4 lg:flex lg:justify-center">
                  <ArrowRight className="h-5 w-5 text-fc-orange-500" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <p className="mt-12 text-center text-xl font-bold text-fc-brand">
          Now repeat that across 50, 100, or 200 jobs.
        </p>
        <p className="mt-3 text-center text-lg text-fc-muted fc-body-air">
          That's where thousands of dollars disappear each month.
        </p>
      </div>
    </section>
  );
}

