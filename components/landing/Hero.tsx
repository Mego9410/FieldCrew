"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { ShapeLandingHeroBackground } from "@/components/ui/shape-landing-hero";
import { HeroViewSwitcher } from "@/components/landing/HeroViewSwitcher";
import { LogoStrip, MockAppFrame } from "@/components/landing/PublicPagePrimitives";
import { DemoVideoModal } from "@/components/landing/DemoVideoModal";
import { useState } from "react";

const transition = { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const };

const springReveal = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 1.35,
    },
  },
};

const staticReveal = {
  hidden: { opacity: 1, filter: "blur(0px)", y: 0 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

type HeroProps = {
  regionName?: string | null;
};

const poweredBadges = [
  "QuickBooks-ready exports",
  "Job-based time capture",
  "Overrun + OT leakage alerts",
  "Owner-friendly weekly pulse",
  "No app installs for workers",
  "Practical margin recovery cadence",
] as const;

export function Hero({ regionName }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const itemVariants = reduceMotion ? staticReveal : springReveal;
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const headlineBlock = (
    <h1 className="font-display font-extrabold tracking-tight text-white fc-hero-h1 text-balance max-w-[40rem] min-w-0 lg:max-w-[34rem]">
      <span className="block text-fc-steel-500">
        Most HVAC Businesses
        {regionName ? ` in ${regionName}` : ""}
        {" "}Are Losing
      </span>
      <span className="fc-hero-h1-accent mt-2 block max-w-full bg-gradient-to-r from-fc-orange-500 to-fc-orange-600 bg-clip-text pb-[0.15em] text-transparent [background-clip:text] [-webkit-background-clip:text]">
        <span className="flex flex-col items-center gap-y-1 sm:inline-flex sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-1 lg:items-start">
          <span className="min-w-0 shrink">$3,000-$10,000</span>
          <span className="text-white/95">/month</span>
        </span>
      </span>
      <span className="mt-2 block text-white">Without realizing</span>
    </h1>
  );

  const subcopy = (
    <p className="max-w-lg text-lg text-slate-300 fc-body-air sm:text-xl">
      Not from lack of work.
      <span className="block">
        From under-quoted jobs, labor overruns, and overtime that quietly eats profit.
      </span>
    </p>
  );

  const ctaBlock = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
      <MagneticButton href="/profit-leak" variant="primary">
        See What You&apos;re Losing
      </MagneticButton>
      <button
        type="button"
        onClick={() => setIsDemoOpen(true)}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
      >
        Watch 2‑minute demo
      </button>
    </div>
  );

  const microcopy = (
    <div className="flex flex-col items-center gap-2 sm:items-start">
      <p className="text-sm text-fc-steel-500">Takes about 60 seconds</p>
      <Link
        href="/sample-report"
        className="text-sm font-semibold text-fc-accent underline decoration-fc-accent underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950 rounded"
      >
        Want to see an example report first?
      </Link>
    </div>
  );

  const eyebrow = (
    <Link
      href="/profit-leak"
      className="group border-fc-navy-800 bg-fc-navy-900/90 text-slate-300 hover:border-fc-navy-800 hover:bg-fc-navy-800/90 mx-auto flex w-fit max-w-full items-center gap-3 rounded-full border px-1 py-1 pl-4 text-sm shadow-lg shadow-black/25 transition-colors duration-300 lg:mx-0"
    >
      <span className="text-nowrap text-slate-200">Free check — about 60 seconds</span>
      <span className="hidden h-4 w-px shrink-0 bg-white/15 sm:block" aria-hidden />
      <span className="bg-fc-navy-950 group-hover:bg-fc-navy-800 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-300">
        <span className="flex w-16 -translate-x-1/2 duration-500 ease-out group-hover:translate-x-0">
          <span className="flex size-8 shrink-0 items-center justify-center">
            <ArrowRight className="text-fc-orange-500 size-3.5" aria-hidden />
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center">
            <ArrowRight className="text-fc-orange-500 size-3.5" aria-hidden />
          </span>
        </span>
      </span>
    </Link>
  );

  return (
    <section
      className="relative min-h-0 overflow-x-hidden bg-transparent"
      aria-label="Hero"
    >
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <ShapeLandingHeroBackground
        reduceMotion={!!reduceMotion}
        className="z-0 opacity-[0.55] md:opacity-70"
      />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 18%, rgba(249,115,22,0.16) 0%, transparent 55%), radial-gradient(ellipse 100% 100% at 50% 100%, rgba(3,7,18,0.92) 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 text-white fc-blueprint-grid"
        aria-hidden
        style={{ opacity: 0.05 }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, white 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--fc-navy-950)_75%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-16 xl:px-12 xl:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
          <div className="relative z-0 flex min-w-0 flex-col justify-center text-center lg:justify-start lg:pr-6 lg:text-left">
            <AnimatedGroup
              variants={{ container: containerVariants, item: itemVariants }}
              className="flex w-full min-w-0 flex-col items-center gap-5 sm:gap-6 lg:items-start"
            >
              {eyebrow}
              {headlineBlock}
              {subcopy}
              {ctaBlock}
              {microcopy}
              <div className="w-full pt-2">
                <LogoStrip
                  label="Fits your existing stack"
                  items={[
                    "ServiceTitan",
                    "Housecall Pro",
                    "Jobber",
                    "QuickBooks",
                    "Google Sheets",
                    "FieldPulse",
                  ]}
                />
              </div>
            </AnimatedGroup>
          </div>

          <motion.div
            className="relative z-20 mx-auto w-full max-w-xl min-w-0 lg:mx-0 lg:ml-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.25 }}
          >
            <div
              className="absolute -inset-1 rounded-2xl opacity-30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, transparent 55%)",
                filter: "blur(14px)",
              }}
              aria-hidden
            />
            <MockAppFrame title="FieldCrew" subtitle="Preview">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <HeroViewSwitcher />
              </div>
            </MockAppFrame>
          </motion.div>
        </div>

        <div className="mt-14 sm:mt-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Built for owner‑operators who want clear labor answers
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {poweredBadges.map((b) => (
                <div
                  key={b}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 backdrop-blur-md"
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
