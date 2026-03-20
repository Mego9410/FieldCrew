"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

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
          Find Out What Your Business Is Actually Losing
        </motion.h2>
        <motion.p
          className="mx-auto mt-7 max-w-2xl text-xl text-slate-300 fc-body-air sm:text-2xl"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.15 }}
        >
          It's probably more than you think. And it usually starts with quoted vs actual labor time.
        </motion.p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:gap-6">
          <MagneticButton
            href="/profit-leak"
            variant="primary"
            className="w-full sm:w-auto"
          >
            See My Monthly Loss
          </MagneticButton>
          <p className="text-sm text-fc-steel-500">Takes about 60 seconds</p>
        </div>
      </div>
    </section>
  );
}
