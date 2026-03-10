"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
const STEPS = [
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

export function Features() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="solution-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            03
          </span>
          <h2
            id="solution-heading"
            className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Control. Enforce. Recover.
          </h2>
        </motion.div>

        <div className="relative mt-20 flex flex-col items-center gap-12 sm:flex-row sm:justify-center sm:items-stretch sm:gap-6 lg:gap-8">
          <div
            className="absolute left-1/2 top-24 hidden h-0.5 w-[min(100%,32rem)] -translate-x-1/2 sm:block"
            aria-hidden
          >
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-[#5b7cff] to-[#9d6cff]"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: "100%" }}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="relative z-10 flex w-full max-w-[320px] flex-col rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-[30px] transition-transform duration-300 hover:-translate-y-1 sm:max-w-[280px]"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#5b7cff] to-[#9d6cff] text-xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: 0.2 + i * 0.1,
                }}
              >
                {step.label}
              </motion.div>
              <h3 className="mt-6 font-legend-display text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 font-legend-body text-base text-[#a1a1aa] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
