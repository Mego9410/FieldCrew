"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const painRows = [
  {
    youThink: "Payroll is the problem.",
    reality: "Hours are uncoded, overtime spikes unseen, job costs are guesswork.",
    result: "Margin leaks every month. You find out at month-end.",
  },
  {
    youThink: "We just need better time tracking.",
    reality: "Generic time apps don't tie hours to jobs or revenue.",
    result: "Payroll runs clean. Profitability stays invisible.",
  },
  {
    youThink: "Our margins are fine.",
    reality: "Without job-level labor data, you're assuming — not measuring.",
    result: "Underpriced jobs and overruns eat profit. You don't see which ones.",
  },
];

const colVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};
const transition = { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const };

export function Problem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="pain"
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="pain-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="pain-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Payroll isn&apos;t your problem. Uncontrolled labor is.
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-14 grid min-w-[280px] grid-cols-3 gap-0 overflow-x-auto bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1, once: true }}
          variants={reduceMotion ? {} : { visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            className="px-6 py-8 text-center sm:px-8"
            variants={reduceMotion ? {} : colVariants}
            transition={transition}
          >
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-muted">
              You think
            </h3>
            <ul className="mt-5 space-y-3 text-left text-sm text-fc-brand fc-body-air">
              {painRows.map((row, i) => (
                <li key={i} className="font-medium">
                  {row.youThink}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="border-x border-fc-border bg-fc-surface-muted px-6 py-8 text-center sm:px-8"
            variants={reduceMotion ? {} : colVariants}
            transition={transition}
          >
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-accent">
              Reality
            </h3>
            <span
              className="mx-auto mt-3 block h-0.5 w-12 bg-fc-accent"
              aria-hidden
            />
            <ul className="mt-5 space-y-3 text-left text-sm text-fc-muted fc-body-air">
              {painRows.map((row, i) => (
                <li key={i}>{row.reality}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="px-6 py-8 text-center sm:px-8"
            variants={reduceMotion ? {} : colVariants}
            transition={transition}
          >
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-muted">
              Result
            </h3>
            <ul className="mt-5 space-y-3 text-left text-sm text-fc-brand fc-body-air">
              {painRows.map((row, i) => (
                <li key={i} className="font-medium">
                  {row.result}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
