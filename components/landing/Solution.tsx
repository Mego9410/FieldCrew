"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FeaturedCrmDemoSection } from "@/components/landing/FeaturedCrmDemoSection";
import {
  BentoCard,
  RailHeader,
  SplitBand,
} from "@/components/landing/PublicPagePrimitives";

const steps = [
  {
    title: "Add your team",
    desc: "Set up your technicians and labor inputs in minutes.",
  },
  {
    title: "Track quoted vs actual time",
    desc: "See how job time compares to what was originally estimated.",
  },
  {
    title: "Spot where profit is leaking",
    desc: "Find the jobs, patterns, and overtime pressure hurting your margins.",
  },
];

export function Solution() {
  return (
    <SplitBand
      id="how-it-works"
      variant="muted"
      labelledBy="solution-heading"
      className="py-0"
      left={<FeaturedCrmDemoSection className="lg:pt-1" />}
      right={
        <div>
          <ScrollReveal>
            <RailHeader
              eyebrow="How it works"
              titleId="solution-heading"
              title="How FieldCrew Helps"
              description="Follow the same path in the app — from setup to seeing where labor profit disappears."
              aside={
                <ol className="grid gap-4">
                  {steps.map((step, i) => (
                    <li key={step.title}>
                      <BentoCard className="h-full">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fc-accent/10 text-fc-accent ring-1 ring-fc-accent/20">
                            <span className="font-display text-sm font-extrabold tabular-nums">
                              {i + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fc-accent">
                              Step {i + 1}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-fc-brand sm:text-xl">
                              {step.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-fc-muted">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </BentoCard>
                    </li>
                  ))}
                </ol>
              }
            />
          </ScrollReveal>
          <p className="mt-10 text-base font-semibold text-fc-muted">
            No heavy onboarding. No complicated implementation.
          </p>
        </div>
      }
    />
  );
}
