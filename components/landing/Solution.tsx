"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    label: "1",
    title: "Clock into jobs only",
    desc: "No job = no clock. Techs must select a job before starting time. No generic shifts, no uncoded hours.",
  },
  {
    label: "2",
    title: "Hours attach to revenue",
    desc: "Every hour is tied to a job code. Labour cost rolls up per job so you see true margin by install, service call, or maintenance.",
  },
  {
    label: "3",
    title: "Monthly labour profit report",
    desc: "Overtime by tech, job overruns, margin by service type, and recoverable leakage. One report. No guesswork.",
  },
];

export function Solution() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-14 sm:py-24 lg:py-28"
      aria-labelledby="solution-heading"
    >
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="solution-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Control. Enforce. Recover.
          </h2>
        </ScrollReveal>

        {/* Timeline: line + steps */}
        <div className="relative mt-14 flex flex-col items-center gap-12 sm:flex-row sm:justify-center sm:items-start sm:gap-4 lg:gap-8">
          {/* Connecting line — draws on scroll (above cards on mobile, between on desktop) */}
          <div
            className="absolute left-1/2 top-[4.5rem] hidden h-0.5 w-[min(100%,32rem)] -translate-x-1/2 sm:block"
            aria-hidden
          >
            <motion.div
              className="h-full origin-left rounded-full bg-fc-orange-500"
              initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              animate={reduceMotion ? { scaleX: 1 } : { scaleX: isInView ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ width: "100%" }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              className="relative z-10 flex flex-col items-center rounded-[var(--fc-radius)] border border-fc-border bg-white p-6 shadow-fc-sm sm:max-w-[260px] lg:max-w-[280px]"
              style={i === 1 ? { marginTop: "8px" } : undefined}
              initial={
                reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 8 }
              }
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ amount: 0.3, once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion ? 0 : 0.15 + i * 0.1,
                ease: [0.2, 0.8, 0.2, 1] as const,
              }}
            >
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--fc-radius)] bg-fc-accent text-xl font-extrabold text-white shadow-fc-md"
                initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 0.3, once: true }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: reduceMotion ? 0 : 0.2 + i * 0.1,
                }}
              >
                {step.label}
              </motion.div>
              <h3 className="mt-5 font-display text-lg font-bold text-fc-brand">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-fc-muted fc-body-air">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
