"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ComparisonTable } from "./ComparisonTable";

export function Differentiation() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-fc-navy-800 bg-fc-navy-950 py-20 sm:py-24 lg:py-32"
      aria-labelledby="differentiation-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249, 115, 22, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(15, 23, 42, 0.5) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      <ScrollReveal className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-5 h-1 w-16 bg-fc-accent" aria-hidden />
          <h2
            id="differentiation-heading"
            className="font-display font-bold text-white fc-section-h2"
          >
            Built for margin. Not admin.
          </h2>
        </div>
        <motion.div
          className="mt-14"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ComparisonTable />
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
