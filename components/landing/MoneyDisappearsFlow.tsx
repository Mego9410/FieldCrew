"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FeatureCarousel } from "@/components/ui/feature-carousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  BentoCard,
  MockAppFrame,
  RailHeader,
  SplitBand,
} from "@/components/landing/PublicPagePrimitives";

const steps = [
  "A job runs 45-90 minutes over",
  "Labor cost goes beyond what was quoted",
  "The schedule slips and the team falls behind",
  "Overtime is used to catch up",
] as const;

const carouselItems = steps.map((title, i) => ({
  id: `money-flow-${i + 1}`,
  label: `Step ${i + 1}`,
  title,
}));

export function MoneyDisappearsFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <SplitBand
      variant="muted"
      labelledBy="money-disappears-heading"
      className="py-0"
      left={
        <div>
          <ScrollReveal>
            <RailHeader
              eyebrow="The leak"
              titleId="money-disappears-heading"
              title="You Don&apos;t Lose It On One Job"
              description="The loss compounds in a predictable chain reaction — even when business is busy."
              aside={
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {steps.map((s, i) => (
                    <BentoCard key={s} className="p-0">
                      <div className="flex items-start gap-3 px-5 py-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-fc-accent/10 text-fc-accent ring-1 ring-fc-accent/20">
                          <span className="text-xs font-extrabold tabular-nums">{i + 1}</span>
                        </div>
                        <p className="text-sm font-semibold leading-snug text-fc-brand">
                          {s}
                        </p>
                      </div>
                    </BentoCard>
                  ))}
                </div>
              }
            />
          </ScrollReveal>

          <p className="mt-10 hyphens-none break-normal text-left text-lg font-semibold text-fc-brand sm:mt-12">
            Now repeat that across 50, 100, or 200 jobs.
          </p>
          <p className="mt-2 hyphens-none break-normal text-left text-base text-fc-muted fc-body-air">
            That&apos;s where thousands of dollars disappear each month.
          </p>
        </div>
      }
      right={
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <MockAppFrame title="FieldCrew" subtitle="Leak chain (example)">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 sm:p-3">
              <FeatureCarousel
                items={carouselItems}
                autoPlayIntervalMs={5200}
                className="max-w-none"
              />
            </div>
          </MockAppFrame>
        </motion.div>
      }
    />
  );
}

