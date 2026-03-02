"use client";

import Link from "next/link";
import { HeroViewSwitcher } from "./HeroViewSwitcher";

export function Hero() {
  return (
    <section className="relative overflow-x-hidden border-b border-fc-border bg-white">
      {/* Subtle grid texture — industrial blueprint feel, 5–8% */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--fc-brand) 1px, transparent 1px),
            linear-gradient(to bottom, var(--fc-brand) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Left Content — with vertical accent stripe */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-stretch gap-4 lg:gap-5">
                <span className="fc-accent-stripe-vertical hero-reveal hero-reveal-2 hidden shrink-0 self-center lg:block" aria-hidden />
                <h1 className="hero-reveal hero-reveal-2 font-display font-extrabold text-fc-brand fc-hero-h1">
                  Where Is Your Payroll Leaking?
                </h1>
              </div>

              <p className="hero-reveal hero-reveal-3 mt-5 text-lg text-fc-muted fc-body-air sm:text-xl">
                Most 10-tech HVAC companies lose <span className="fc-money text-fc-brand">$5,000–$15,000</span>/month in hidden labour inefficiency. FieldCrew shows you exactly where.
              </p>

              <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/sample-report"
                  className="inline-flex min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] bg-fc-accent px-8 py-4 text-lg font-bold text-white shadow-fc-md transition-all duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                >
                  See a Real Labour Profit Report
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] border-2 border-fc-border bg-white px-8 py-4 text-lg font-semibold text-fc-brand transition-all duration-200 hover:border-fc-accent hover:bg-fc-accent/5 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                >
                  Watch 2-Minute Demo
                </Link>
              </div>
              <p className="hero-reveal hero-reveal-4 mt-4 text-sm text-fc-muted">
                Built for HVAC teams under 25 techs. No enterprise complexity.
              </p>
            </div>
          </div>

          {/* Right — Owner View Switcher: radial gradient + stronger shadow + overlap */}
          <div className="hero-reveal hero-reveal-6 relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            {/* Radial gradient behind product module */}
            <div
              className="absolute -inset-8 top-2 bg-[radial-gradient(ellipse_80%_70%_at_50%_30%,rgba(15,23,42,0.06)_0%,transparent_60%)] lg:-inset-12 lg:top-4"
              aria-hidden
            />
            <div className="relative w-full overflow-visible pb-8 lg:pb-0 lg:-mb-6">
              <div className="shadow-fc-hero rounded-[var(--fc-radius)]">
                <HeroViewSwitcher />
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent" aria-hidden />
              <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-white to-transparent" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
