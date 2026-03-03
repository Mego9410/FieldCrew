"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function FinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-fc-navy-800 bg-fc-navy-950 py-24 sm:py-32 lg:py-36"
      aria-labelledby="final-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249, 115, 22, 0.12) 0%, transparent 55%)",
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
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          id="final-cta-heading"
          className="font-display font-bold text-white fc-section-h2 text-4xl sm:text-5xl lg:text-[3.25rem]"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Stop guessing payroll. Start controlling it.
        </motion.h2>
        <motion.p
          className="mx-auto mt-7 max-w-2xl text-xl text-slate-300 fc-body-air sm:text-2xl"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.15 }}
        >
          See exactly where labour profit is leaking — then fix it.
        </motion.p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Link
            href="/sample-report"
            className="cta-sweep group relative inline-flex min-h-[52px] min-w-[56px] cursor-pointer items-center justify-center overflow-hidden rounded-[var(--fc-radius-lg)] bg-fc-accent px-12 py-4 text-lg font-bold text-white shadow-fc-lg transition-all duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
          >
            <span className="relative z-10">See Where Your Profit Is Leaking</span>
          </Link>
          <Link
            href="/book"
            className="inline-flex min-h-[52px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] border-2 border-fc-steel-500 bg-transparent px-12 py-4 text-lg font-semibold text-slate-200 transition-all duration-200 hover:border-white hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
          >
            Book 15-Min Walkthrough
          </Link>
        </div>
      </div>
    </section>
  );
}
