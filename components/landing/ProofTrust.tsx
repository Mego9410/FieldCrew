"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/ui/CountUp";

const trustBullets = [
  "Designed for US HVAC ops",
  "Built for companies under 25 techs",
  "Set up in a day",
];

export function ProofTrust() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="proof"
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <motion.div
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.2, once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2
              id="proof-heading"
              className="font-display font-bold text-fc-brand fc-section-h2"
            >
              We found{" "}
              <span className="fc-display-number text-fc-orange-500">
                <CountUp value={4800} prefix="$" />
              </span>{" "}
              in the first month.
            </h2>
            <motion.span
              className="mx-auto mt-3 block h-0.5 w-24 bg-fc-orange-500"
              initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.3 }}
              style={{ originX: 0.5 }}
            />
          </motion.div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-fc-muted fc-body-air">
            Based on patterns we see in real 5–20 tech HVAC companies.
          </p>
        </ScrollReveal>
        <ul className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          {trustBullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-[var(--fc-radius)] bg-fc-surface-muted px-5 py-3"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-fc-accent"
                aria-hidden
              />
              <span className="text-sm font-medium text-fc-brand">{bullet}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 text-center">
          <Link
            href="/sample-report"
            className="text-sm font-semibold text-fc-accent underline decoration-fc-accent underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
          >
            See a sample labor profit report
          </Link>
        </p>
      </div>
    </section>
  );
}
