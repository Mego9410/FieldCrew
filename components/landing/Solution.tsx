"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FeaturedCrmDemoSection } from "@/components/landing/FeaturedCrmDemoSection";

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
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-14 sm:py-24 lg:py-28"
      aria-labelledby="solution-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="solution-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            How FieldCrew Helps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-fc-muted sm:text-[1.0625rem] fc-body-air">
            Follow the same path in the app — from setup to seeing where labor
            profit disappears.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14 xl:gap-16">
          <div className="relative space-y-0">
            <div
              className="absolute left-[17px] top-8 bottom-8 w-px bg-gradient-to-b from-fc-border via-fc-accent/40 to-fc-border sm:left-[18px]"
              aria-hidden
            />
            <ol className="relative space-y-10 sm:space-y-12">
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pl-1 sm:gap-5">
                  <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fc-border bg-white font-display text-xs font-bold text-fc-accent shadow-fc-sm ring-4 ring-white sm:h-10 sm:w-10 sm:text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-fc-accent">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold leading-snug text-fc-brand sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fc-muted fc-body-air">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <FeaturedCrmDemoSection className="lg:pt-1" />
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-base font-semibold text-fc-muted fc-body-air lg:mt-16">
          No heavy onboarding. No complicated implementation.
        </p>
      </div>
    </section>
  );
}
