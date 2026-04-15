"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BentoCard, RailHeader, SplitBand } from "@/components/landing/PublicPagePrimitives";

const bullets = [
  "No rip-and-replace setup",
  "No long training process",
  "No enterprise onboarding",
  "Start seeing useful numbers fast",
];

export function SimpleStart() {
  const reduceMotion = useReducedMotion();

  return (
    <SplitBand
      variant="dark"
      labelledBy="simple-start-heading"
      className="py-0"
      left={
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <BentoCard className="text-left border-white/10 bg-white/[0.05] ring-1 ring-white/[0.08] shadow-[0_22px_60px_-34px_rgba(0,0,0,0.75)]">
            <ul className="grid gap-3 text-white/70 sm:grid-cols-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fc-accent"
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-white/85">{b}</span>
                </li>
              ))}
            </ul>
            <div
              className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
              aria-hidden
            />
            <p className="text-center text-lg font-semibold text-white/70">
              If you can use a phone, you can use FieldCrew.
            </p>
          </BentoCard>
        </motion.div>
      }
      right={
        <div>
          <ScrollReveal>
            <RailHeader
              eyebrow="Simple start"
              titleId="simple-start-heading"
              title="Built for busy HVAC teams, not software experts"
              description="No rip-and-replace. No long training. Just enough structure to make labor leakage visible."
              tone="dark"
            />
          </ScrollReveal>
        </div>
      }
    />
  );
}

