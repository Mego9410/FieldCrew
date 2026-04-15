"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/ui/CountUp";

const metrics = [
  { label: "Revenue", value: 320000, prefix: "$", sub: "/mo" },
  { label: "Payroll", value: 148000, prefix: "$", sub: "/mo" },
  { label: "Overtime", value: 12480, prefix: "$", sub: "/mo" },
  { label: "Unbilled labor", value: 42, sub: " hrs" },
  { label: "Jobs exceeding estimate", value: 37, suffix: "%", sub: "" },
];

const transition = { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const };

export function RealScenario() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="scenario"
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-20 lg:py-24"
      aria-labelledby="scenario-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="scenario-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Example: 10-Tech HVAC Company — Houston
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.15, once: true }}
          variants={reduceMotion ? {} : { visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {metrics.map((m) => (
            <motion.div
              key={m.label}
              className="flex flex-col overflow-hidden rounded-[var(--fc-radius)] bg-white shadow-fc-sm"
              variants={
                reduceMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }
              }
              transition={transition}
            >
              <div className="bg-fc-navy-900 px-4 py-5">
                <p className="fc-display-number text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  <CountUp
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    duration={1}
                  />
                  <span className="ml-0.5 text-base font-normal text-fc-steel-500">
                    {m.sub}
                  </span>
                </p>
              </div>
              <div className="border-t border-fc-border px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-fc-muted">
                  {m.label}
                </p>
              </div>
              <motion.span
                className="block h-0.5 w-full origin-left bg-fc-orange-500"
                initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal className="mt-10" amount={0.2}>
          <div className="border-l-4 border-fc-orange-500 bg-white py-5 pl-6 pr-6 shadow-fc-sm rounded-r-[var(--fc-radius)]">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-fc-brand">
              FieldCrew identified:
            </h3>
            <ul className="mt-4 space-y-2 text-fc-muted">
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent"
                  aria-hidden
                />
                <span className="fc-money text-fc-brand font-semibold">$6,420</span>{" "}
                recoverable monthly
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent"
                  aria-hidden
                />
                18% overtime reduction opportunity
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent"
                  aria-hidden
                />
                9 jobs underpriced
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
