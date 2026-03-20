"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  {
    value: "$450M-$2.1B",
    label: "lost annually",
    emphasis: true,
  },
  {
    value: "Under-quoting + overtime",
    label: "major hidden profit drains",
    emphasis: false,
  },
  {
    value: "Busy companies still lose money",
    label: "when labor isn't tracked vs quote",
    emphasis: false,
  },
];

export function IndustryProblem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-20 lg:py-24"
      aria-labelledby="industry-problem-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="industry-problem-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            This Isn't a Small Problem
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-6 max-w-3xl text-center text-lg text-fc-muted fc-body-air">
          Across the US, HVAC contractors lose between $450 million and $2.1
          billion every year from under-quoted labor, jobs running over time,
          and overtime used to recover the schedule.
        </div>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--fc-radius)] border border-fc-border bg-white px-6 py-7 shadow-fc-sm"
            >
              <p
                className={
                  s.emphasis
                    ? "font-display text-3xl font-extrabold text-fc-brand"
                    : "font-display text-xl font-extrabold text-fc-brand"
                }
              >
                {s.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-fc-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-lg text-fc-muted fc-body-air">
          The problem usually stays hidden because revenue still looks
          healthy.
        </p>
      </div>
    </section>
  );
}

