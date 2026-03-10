"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FloatingHeroCards } from "./FloatingHeroCards";

const HeroGradientMesh = dynamic(() => import("./HeroGradientMesh").then((m) => m.HeroGradientMesh), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(91,124,255,0.15) 0%, transparent 50%), #0a0a0a",
      }}
    />
  ),
});

const stagger = { staggerChildren: 0.08, delayChildren: 0.2 };
const item = { opacity: 0, y: 32 };
const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#0a0a0a] pt-24 md:pt-32"
      aria-label="Hero"
    >
      <HeroGradientMesh />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-8 px-6 py-20 md:gap-12 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="col-span-12 lg:col-span-6">
          <motion.div
            variants={reduceMotion ? undefined : stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <motion.span
              className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]"
              variants={reduceMotion ? undefined : item}
              transition={transition}
            >
              01
            </motion.span>
            <motion.h1
              className="font-legend-display text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
              variants={reduceMotion ? undefined : item}
              transition={transition}
            >
              <span className="block text-[#a1a1aa]">Where is your</span>
              <span className="block">payroll</span>
              <span className="block bg-gradient-to-r from-[#5b7cff] to-[#9d6cff] bg-clip-text text-transparent">
                leaking?
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 max-w-md font-legend-body text-lg leading-relaxed text-[#a1a1aa] opacity-80 md:text-xl"
              variants={reduceMotion ? undefined : item}
              transition={transition}
            >
              Most 10-tech HVAC companies lose{" "}
              <span className="font-semibold text-white">$5,000–$15,000</span>
              /month in hidden labour inefficiency. FieldCrew shows you exactly where.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              variants={reduceMotion ? undefined : item}
              transition={transition}
            >
              <Link
                href="/sample-report"
                className="group relative inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-legend-body text-sm font-semibold text-[#0a0a0a] transition-all duration-300 ease-[var(--legend-ease)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(91,124,255,0.35)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
              >
                See a Real Labour Profit Report
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-8 py-4 font-legend-body text-sm font-semibold text-white backdrop-blur-[20px] transition-all duration-300 ease-[var(--legend-ease)] hover:scale-[1.02] hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Watch 2-Minute Demo
              </Link>
            </motion.div>
            <motion.p
              className="mt-6 font-legend-body text-sm text-[#a1a1aa]"
              variants={reduceMotion ? undefined : item}
              transition={transition}
            >
              Built for HVAC teams under 25 techs. No enterprise complexity.
            </motion.p>
          </motion.div>
        </div>
        <div className="col-span-12 flex justify-center lg:col-span-6 lg:justify-end">
          <FloatingHeroCards />
        </div>
      </div>
    </section>
  );
}
