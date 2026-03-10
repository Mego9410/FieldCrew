"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ComparisonTable } from "@/components/landing/ComparisonTable";

export function Differentiation() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-x-hidden overflow-y-visible border-y border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="differentiation-heading"
    >
      {/* Gradient atmosphere — hero-style */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 30% 30%, rgba(157,108,255,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 70% 70%, rgba(91,124,255,0.06) 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            05
          </span>
          <h2
            id="differentiation-heading"
            className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Built for margin. Not admin.
          </h2>
        </motion.div>
        <motion.div
          className="mt-16 overflow-visible"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-[30px] transition-shadow duration-300 hover:shadow-[0_24px_96px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]">
            <ComparisonTable />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
