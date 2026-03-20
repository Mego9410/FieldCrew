"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const tiers = [
  { title: "5-10 techs", loss: "$2,000-$5,000/month" },
  { title: "10-25 techs", loss: "$5,000-$10,000/month" },
  { title: "25+ techs", loss: "$10,000-$20,000+/month" },
];

export function RelatableBusinessImpact() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="relatable-impact-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="relatable-impact-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            What This Looks Like In A Real Business
          </h2>
        </ScrollReveal>

        <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-fc-muted fc-body-air">
          For many HVAC companies, the leak looks something like this:
        </p>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {tiers.map((t) => (
            <div
              key={t.title}
              className="rounded-[var(--fc-radius)] border border-fc-border bg-fc-surface-muted px-6 py-7"
            >
              <p className="font-display text-sm font-bold uppercase tracking-wider text-fc-accent">
                {t.title}
              </p>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-fc-brand">
                {t.loss}
              </p>
            </div>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-lg font-semibold text-fc-muted fc-body-air">
          And most owners never see the full number because the money
          disappears across dozens of jobs.
        </p>
      </div>
    </section>
  );
}

