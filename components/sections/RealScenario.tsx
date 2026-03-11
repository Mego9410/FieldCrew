"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";

const metrics = [
  { label: "Revenue", value: 320000, prefix: "$", sub: "/mo" },
  { label: "Payroll", value: 148000, prefix: "$", sub: "/mo" },
  { label: "Overtime", value: 12480, prefix: "$", sub: "/mo" },
  { label: "Unbilled labour", value: 42, sub: " hrs" },
  { label: "Jobs exceeding estimate", value: 37, suffix: "%", sub: "" },
];

const identified = [
  { value: "$6,420", text: "recoverable monthly" },
  { text: "18% overtime reduction opportunity" },
  { text: "9 jobs underpriced" },
];

export function RealScenario() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="scenario"
      ref={ref}
      className="bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="scenario-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            04
          </span>
          <h2
            id="scenario-heading"
            className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Example: 10-Tech HVAC Company — Houston
          </h2>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {metrics.map((m) => (
            <motion.div
              key={m.label}
              className="flex flex-col overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[30px] transition-transform duration-300 hover:-translate-y-1"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-5 py-6">
                <p className="font-legend-display text-2xl font-semibold tabular-nums tracking-tight text-white sm:text-3xl">
                  <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} duration={1} />
                  <span className="ml-0.5 text-base font-normal text-[#a1a1aa]">{m.sub}</span>
                </p>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.08)] px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
                  {m.label}
                </p>
              </div>
              <motion.span
                className="block h-0.5 w-full origin-left bg-gradient-to-r from-[#5b7cff] to-[#9d6cff]"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 rounded-[20px] border border-[rgba(255,255,255,0.08)] border-l-4 border-l-[#5b7cff] bg-[rgba(255,255,255,0.04)] py-6 pl-6 pr-6 backdrop-blur-[30px]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="font-legend-display text-sm font-bold uppercase tracking-wider text-white">
            FieldCrew identified:
          </h3>
          <ul className="mt-4 space-y-3 font-legend-body text-[#a1a1aa]">
            {identified.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b7cff]"
                  aria-hidden
                />
                {item.value && (
                  <span className="font-semibold text-white">{item.value}</span>
                )}{" "}
                {item.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
