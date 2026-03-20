"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const bullets = [
  "No rip-and-replace setup",
  "No long training process",
  "No enterprise onboarding",
  "Start seeing useful numbers fast",
];

export function SimpleStart() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-20 lg:py-24"
      aria-labelledby="simple-start-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal className="text-center">
            <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
            <h2
              id="simple-start-heading"
              className="font-display font-bold text-fc-brand fc-section-h2"
            >
              Built For Busy HVAC Teams, Not Software Experts
            </h2>
          </ScrollReveal>
          <motion.div
            className="mt-10 rounded-[var(--fc-radius)] border border-fc-border bg-white px-6 py-8 shadow-fc-sm"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: true }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ul className="space-y-3 text-left text-fc-muted">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fc-accent"
                    aria-hidden
                  />
                  <span className="text-sm font-semibold">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-center text-lg font-semibold text-fc-muted">
              If you can use a phone, you can use FieldCrew.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

