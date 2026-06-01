"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { InstrumentConsolePreview } from "@/components/landing/InstrumentConsolePreview";
import { LogoStrip } from "@/components/landing/PublicPagePrimitives";

type InstrumentHeroProps = {
  regionName?: string | null;
};

export function InstrumentHero({ regionName }: InstrumentHeroProps) {
  return (
    <section className="relative overflow-hidden bg-fc-navy-950 text-white" aria-label="Hero">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 text-white fc-blueprint-grid" style={{ opacity: 0.06 }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-16 xl:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-fc-navy-900/60 px-2 py-1 pl-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fc-navy-900">
                <span
                  className="h-[7px] w-[7px] rounded-full bg-fc-orange-500"
                  aria-hidden
                  style={{ boxShadow: "0 0 10px rgba(249,115,22,0.9)" }}
                />
              </span>
              PROFIT LEAK DETECTED
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,4vw+1rem,4.1rem)] font-extrabold tracking-[-0.03em] leading-[1.04] text-white">
              Most HVAC businesses
              <span className="block">
                are quietly losing{regionName ? <span className="text-slate-300"> in {regionName}</span> : null}
              </span>
              <span className="mt-1 block text-[clamp(2.4rem,3.4vw+1rem,3.7rem)] text-fc-orange-500 tabular-nums">
                $3,000–$10,000
                <span className="ml-1 text-white/95 font-bold">/mo</span>
              </span>
            </h1>

            <p className="mt-6 max-w-[33rem] text-[19px] leading-7 text-slate-300">
              Not from lack of work. From under-quoted jobs, labor overruns, and overtime that eats your margin
              before you ever see it. FieldCrew makes the leak visible.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="#calculator"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-fc-orange-500 px-6 text-[15px] font-bold text-fc-navy-950 transition hover:bg-fc-orange-600 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
              >
                See what you&apos;re losing <ArrowRight className="ml-2 h-[18px] w-[18px]" aria-hidden />
              </Link>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4" aria-hidden />
              Takes about 60 seconds · no card, no install for your crew
            </div>

            <div className="mt-10">
              <LogoStrip
                label="Fits your existing stack"
                items={[
                  { name: "QuickBooks", src: "/logos/integrations/quickbooks.svg", heightClass: "h-6" },
                  { name: "Xero", src: "/logos/integrations/xero.svg", heightClass: "h-7" },
                  { name: "Google Sheets", src: "/logos/integrations/google-sheets.svg", heightClass: "h-7" },
                  { name: "Sage", src: "/logos/integrations/sage.svg", heightClass: "h-7" },
                  { name: "ServiceTitan", src: "/logos/integrations/servicetitan.svg", heightClass: "h-5" },
                  { name: "Gusto", src: "/logos/integrations/gusto.svg", heightClass: "h-7" },
                ]}
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <InstrumentConsolePreview />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-fc-navy-950"
        aria-hidden
      />
    </section>
  );
}

