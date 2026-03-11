"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";

const trustBullets = [
  "Designed for US HVAC ops",
  "Built for companies under 25 techs",
  "Set up in a day",
];

export function ProofTrust() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="proof"
      ref={ref}
      className="bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            06
          </span>
          <h2
            id="proof-heading"
            className="font-legend-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            We found{" "}
            <span className="font-legend-display tabular-nums text-[#5b7cff]">
              <CountUp value={4800} prefix="$" />
            </span>{" "}
            in the first month.
          </h2>
          <motion.span
            className="mx-auto mt-4 block h-0.5 w-24 bg-[#5b7cff]"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ originX: 0.5 }}
          />
          <p className="mx-auto mt-6 max-w-2xl font-legend-body text-lg text-[#a1a1aa] leading-relaxed">
            Based on patterns we see in real 5–20 tech HVAC companies.
          </p>
        </motion.div>

        <motion.ul
          className="mx-auto mt-14 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {trustBullets.map((bullet, i) => (
            <motion.li
              key={i}
              className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-3 backdrop-blur-[30px] transition-transform duration-300 hover:-translate-y-0.5"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#5b7cff]"
                aria-hidden
              />
              <span className="text-sm font-medium text-white">{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mx-auto mt-12 text-center">
          <Link
            href="/sample-report"
            className="font-legend-body text-sm font-semibold text-[#5b7cff] underline decoration-[#5b7cff] underline-offset-2 transition-colors hover:no-underline hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#5b7cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded"
          >
            See a sample labour profit report
          </Link>
        </p>
      </div>
    </section>
  );
}
