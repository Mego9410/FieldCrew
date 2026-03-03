"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeroViewSwitcher } from "./HeroViewSwitcher";
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

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Left — Headline + CTAs (controlled asymmetry) */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <motion.h1
                className="font-display font-extrabold tracking-tight text-white fc-hero-h1"
                initial={reduceMotion ? "visible" : "hidden"}
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
                  WHERE IS YOUR
                </motion.span>
                <motion.span
                  className="block text-white"
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={transition}
                >
                  PAYROLL
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-fc-orange-500 to-fc-orange-600 bg-clip-text text-transparent"
                  variants={reduceMotion ? undefined : fadeUp}
                  transition={transition}
                >
                  LEAKING?
                </motion.span>
              </motion.h1>

              <motion.p
                className="mt-6 max-w-lg text-lg text-slate-300 fc-body-air sm:text-xl"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.25 }}
              >
                Most 10-tech HVAC companies lose{" "}
                <span className="font-semibold text-white">$5,000–$15,000</span>
                /month in hidden labour inefficiency. FieldCrew shows you
                exactly where.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: reduceMotion ? 0 : 0.35 }}
              >
                <MagneticButton href="/sample-report" variant="primary">
                  See a Real Labour Profit Report
                </MagneticButton>
                <MagneticButton href="/demo" variant="secondary">
                  Watch 2-Minute Demo
                </MagneticButton>
              </motion.div>
              <motion.p
                className="mt-5 text-sm text-fc-steel-500"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                Built for HVAC teams under 25 techs. No enterprise complexity.
              </motion.p>
            </div>
          </div>

          {/* Right — Command panel (floats, overlaps boundary) */}
          <motion.div
            className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto lg:-mb-12"
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.98, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
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
              <HeroViewSwitcher />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
