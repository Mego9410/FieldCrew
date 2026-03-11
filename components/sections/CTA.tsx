"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-label="Call to action"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,107,53,0.08) 0%, rgba(91,124,255,0.12) 40%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')] opacity-[0.03]" />
      <div className="relative mx-auto max-w-[1280px] px-4 text-center sm:px-6 md:px-8">
        <motion.span
          className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          08
        </motion.span>
        <motion.h2
          id="final-cta-heading"
          className="font-legend-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Stop guessing payroll. Start controlling it.
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-2xl font-legend-body text-lg text-[#a1a1aa] leading-relaxed sm:mt-8 sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          See exactly where labour profit is leaking — then fix it.
        </motion.p>
        <motion.div
          className="mt-14 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/sample-report"
            className="relative inline-flex min-h-[56px] cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#5b7cff] to-[#9d6cff] px-12 py-4 font-legend-body text-lg font-semibold text-white transition-all duration-300 ease-[var(--legend-ease)] hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(91,124,255,0.35)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white"
          >
            See Where Your Profit Is Leaking
          </Link>
          <Link
            href="/book"
            className="inline-flex min-h-[56px] cursor-pointer items-center justify-center rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-transparent px-12 py-4 font-legend-body text-lg font-semibold text-white transition-all duration-300 ease-[var(--legend-ease)] hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Book 15-Min Walkthrough
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
