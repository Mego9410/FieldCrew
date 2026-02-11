"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroVisual } from "./HeroVisual";
import { Check } from "lucide-react";

const features = [
  "Job-Based Time Tracking",
  "Labour Cost Per Job",
  "Payroll Export",
  "Leak Detection",
  "Magic Link Access",
  "Weekly Reports",
];

export function Hero() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <section className="relative overflow-x-hidden border-b border-fc-border bg-white">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-8">
          {/* Left Content - Strictly contained in first half */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {/* Feature Announcement Badge */}
            <div className="hero-reveal hero-reveal-1 mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fc-accent/10 to-fc-gradient-mid/10 px-4 py-1.5 text-sm font-medium text-fc-accent lg:inline-flex">
              <span>Introducing FieldCrew 2.0</span>
              <span className="text-fc-accent">→</span>
            </div>

            {/* Main Headline - Large and Bold */}
            <h1 className="hero-reveal hero-reveal-2 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-fc-brand sm:text-5xl lg:text-6xl xl:text-7xl">
              See labour cost
              <br />
              per job
            </h1>

            {/* Sub-headline */}
            <p className="hero-reveal hero-reveal-3 mt-6 text-lg leading-relaxed text-fc-muted sm:text-xl lg:text-xl">
              Stop payroll leakage and see which jobs actually make money. Job-based payroll intelligence for HVAC crews.
            </p>

            {/* Primary CTA */}
            <div className="hero-reveal hero-reveal-4 mt-8">
              <Link
                href="#pricing"
                className="inline-flex min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-lg bg-fc-brand px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-fc-brand/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                Get started. It&apos;s FREE!
              </Link>
              <p className="mt-3 text-sm text-fc-muted">
                Free forever. No credit card.
              </p>
            </div>

            {/* Feature Tags */}
            <div className="hero-reveal hero-reveal-5 mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-fc-muted">
                STOP PAYROLL LEAKAGE • SEE WHICH JOBS MAKE MONEY
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {features.map((feature, i) => (
                  <button
                    key={feature}
                    onClick={() => setSelectedFeature(i)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedFeature === i
                        ? "border-fc-accent bg-fc-accent/10 text-fc-accent"
                        : "border-fc-border bg-white text-fc-muted hover:border-fc-accent/50"
                    }`}
                  >
                    {selectedFeature === i && <Check className="h-4 w-4" />}
                    <span>{feature}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual - Larger, extends closer to edges with fade-out */}
          <div className="hero-reveal hero-reveal-6 relative mx-auto w-full lg:mx-0 lg:-mr-8 xl:-mr-12 lg:ml-auto">
            <div className="relative w-full overflow-hidden">
              <HeroVisual view={selectedFeature} />
              {/* Fade-out gradient on right */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent" aria-hidden />
              {/* Fade-out gradient on bottom */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-white to-transparent" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
