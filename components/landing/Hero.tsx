"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const };

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-0 overflow-x-hidden border-b border-fc-navy-800 bg-fc-navy-950"
      aria-label="Hero"
    >
      {/* Radial gradient — dark edges */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(15,23,42,0.6) 0%, transparent 50%), radial-gradient(ellipse 100% 100% at 50% 100%, rgba(3,7,18,0.9) 0%, transparent 40%)",
        }}
      />
      {/* Blueprint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid"
        aria-hidden
        style={{ opacity: 0.05 }}
      />
      {/* Optional very subtle data pulse dots — CSS only */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, white 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-20 xl:px-12 xl:py-22">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Left — Headline + CTAs (controlled asymmetry) */}
          <div className="relative z-0 flex min-w-0 flex-col justify-center lg:justify-start text-center lg:text-left lg:pr-6">
            <div className="flex min-w-0 flex-col items-center lg:items-start">
              <motion.h1
                className="font-display font-extrabold tracking-tight text-white fc-hero-h1 text-balance max-w-[40rem] min-w-0 lg:max-w-[34rem]"
                // Render visible on first paint to avoid a "blank hero" if client JS delays.
                initial="visible"
                animate="visible"
                variants={
                  reduceMotion
                    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
                    : {
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.08,
                            staggerDirection: 1,
                          },
                        },
                      }
                }
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                <motion.span
                  className="block text-fc-steel-500"
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={transition}
                >
                  Most HVAC Businesses Are Losing
                </motion.span>
                <motion.span
                  className="fc-hero-h1-accent block max-w-full bg-gradient-to-r from-fc-orange-500 to-fc-orange-600 bg-clip-text pb-[0.1em] text-transparent [background-clip:text] [-webkit-background-clip:text]"
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={transition}
                >
                  <span className="flex flex-col items-center gap-y-0.5 sm:inline-flex sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-1 lg:items-start">
                    <span className="min-w-0 shrink">$3,000-$10,000</span>
                    <span className="text-white/95">/month</span>
                  </span>
                </motion.span>
                <motion.span
                  className="block text-white"
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={transition}
                >
                  Every month without realising
                </motion.span>
              </motion.h1>

              <motion.p
                className="mt-6 max-w-lg text-lg text-slate-300 fc-body-air sm:text-xl"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.25 }}
              >
                Not from lack of work.
                <span className="block">
                  From under-quoted jobs, labor overruns, and overtime that
                  quietly eats profit.
                </span>
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.35 }}
              >
                <MagneticButton href="/profit-leak" variant="primary">
                See What You&apos;re Losing
                </MagneticButton>
              </motion.div>

              <motion.div
                className="mt-4 flex flex-col items-center gap-2 sm:items-start"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.45 }}
              >
                <p className="text-sm text-fc-steel-500">Takes about 60 seconds</p>
                <Link
                  href="/sample-report"
                  className="text-sm font-semibold text-fc-accent underline decoration-fc-accent underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950 rounded"
                >
                  Want to see an example report first?
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right — Command panel (floats, overlaps boundary) */}
          <motion.div
            // Prevent the animated card (scale/filter) from visually bleeding into the left column.
            className="relative z-20 mx-auto w-full max-w-xl min-w-0 overflow-hidden lg:mx-0 lg:ml-auto lg:mt-8 xl:mt-0"
            initial={{ opacity: 1, filter: "blur(0px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}
          >
            <div
              className="absolute -inset-1 rounded-lg opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 50%)",
                filter: "blur(12px)",
              }}
              aria-hidden
            />
            <div className="relative shadow-fc-panel-lg rounded-[var(--fc-radius)] border border-fc-navy-800 bg-fc-navy-900/95 ring-1 ring-white/5">
              <div>
                <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-fc-steel-500">
                    Estimated monthly loss
                  </p>
                </div>
                <div className="px-5 py-6">
                  <p className="fc-display-number text-4xl font-extrabold tabular-nums text-white">
                    $4,280
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Likely profit leakage from the stuff you already feel.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-200">
                        Loss from under-quoting
                      </p>
                      <p className="font-display text-lg font-extrabold text-fc-orange-500 tabular-nums">
                        $3,100
                      </p>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-200">
                        Loss from overtime spillover
                      </p>
                      <p className="font-display text-lg font-extrabold text-fc-orange-500 tabular-nums">
                        $1,180
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-fc-navy-800 bg-fc-navy-800/20 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-200">
                      Matches how cold leads describe the leak:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-400">
                      <li>Quoted vs actual time</li>
                      <li>Labor overruns</li>
                      <li>Overtime used to catch up</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
