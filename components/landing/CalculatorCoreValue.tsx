"use client";

import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calculator } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ProfitLeakField,
  useProfitLeakEstimate,
} from "@/components/landing/profit-leak-estimate";
import { cn } from "@/lib/utils";
import { RailHeader } from "@/components/landing/PublicPagePrimitives";

function LossResultCard({
  formatTotal,
  formatUnderQuoted,
  formatOvertime,
  reduceMotion,
}: {
  formatTotal: string;
  formatUnderQuoted: string;
  formatOvertime: string;
  reduceMotion: boolean | null;
}) {
  return (
    <div
      id="profit-leak-result"
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/[0.04]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-fc-accent/[0.07] blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-12 h-40 w-40 rounded-full bg-slate-400/[0.08] blur-3xl" aria-hidden />

      <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-100/95 via-slate-50/90 to-slate-100/80 px-6 py-3.5 sm:px-7 sm:py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Estimated monthly loss
        </p>
      </div>

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <motion.p
          key={formatTotal}
          initial={reduceMotion ? false : { opacity: 0.65, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
          }
          className="font-display text-[1.75rem] font-black tabular-nums tracking-tight text-fc-brand sm:text-[2.125rem] lg:text-[2.25rem] hyphens-none break-normal leading-[1.15]"
        >
          {formatTotal}
        </motion.p>

        <div className="mt-6 space-y-2.5 sm:mt-7">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
            <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-600">
              Loss from under-quoting
            </p>
            <p className="shrink-0 font-display text-base font-bold tabular-nums text-fc-orange-500 sm:text-lg">
              {formatUnderQuoted}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
            <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-600">
              Loss from overtime spillover
            </p>
            <p className="shrink-0 font-display text-base font-bold tabular-nums text-fc-orange-500 sm:text-lg">
              {formatOvertime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalculatorCoreValue() {
  const reduceMotion = useReducedMotion();
  const {
    inputs,
    setInputs,
    formatTotal,
    formatUnderQuoted,
    formatOvertime,
  } = useProfitLeakEstimate();

  const scrollToResult = useCallback(() => {
    document
      .getElementById("profit-leak-result")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
  }, [reduceMotion]);

  const inputShell =
    "[&_input]:rounded-xl [&_input]:border-slate-200/90 [&_input]:bg-white [&_input]:py-3 [&_input]:shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] [&_input]:transition-all [&_input]:focus:border-fc-accent/50 [&_input]:focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]";

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-transparent py-14 sm:py-20 lg:py-24"
      aria-labelledby="calculator-core-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,7,18,0.0) 0%, rgba(248,250,252,0.85) 26%, rgba(248,250,252,1) 60%)",
          backgroundSize: "100% 500%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <RailHeader
            eyebrow="Quick estimate"
            titleId="calculator-core-heading"
            title="In 60 Seconds, See Your Number"
            description="Answer a few simple questions and FieldCrew will estimate how much profit may be leaking from under-quoted labor and overtime."
            tone="dark"
            className="mx-auto max-w-6xl"
          />
        </ScrollReveal>

        <motion.div
          className="mt-12 lg:mt-16"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15, once: true }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.05] backdrop-blur-sm">
            <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
              {/* Inputs */}
              <div className="relative border-b border-slate-100 bg-gradient-to-br from-white via-slate-50/40 to-white p-7 sm:p-9 lg:border-b-0 lg:border-r lg:border-slate-100 lg:p-10 xl:p-12">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fc-accent/10 text-fc-accent shadow-inner ring-1 ring-fc-accent/15">
                    <Calculator className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      Quick estimate inputs
                    </p>
                    <p className="mt-1 text-sm leading-snug text-slate-600">
                      Adjust the fields — totals update live.
                    </p>
                  </div>
                </div>

                <div className={cn("grid gap-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-5", inputShell)}>
                  <ProfitLeakField
                    inputId="landing-techs"
                    label="Number of techs"
                    value={inputs.techs}
                    min={1}
                    max={200}
                    onChange={(v) => setInputs((p) => ({ ...p, techs: v }))}
                  />
                  <ProfitLeakField
                    inputId="landing-hourly"
                    label="Avg hourly labor cost"
                    value={inputs.hourlyLaborCost}
                    min={10}
                    max={150}
                    stepValue={1}
                    unit="$/hr"
                    onChange={(v) =>
                      setInputs((p) => ({ ...p, hourlyLaborCost: v }))
                    }
                  />
                  <ProfitLeakField
                    inputId="landing-jobs"
                    label="Jobs per week"
                    value={inputs.jobsPerWeek}
                    min={1}
                    max={20000}
                    stepValue={1}
                    onChange={(v) =>
                      setInputs((p) => ({ ...p, jobsPerWeek: v }))
                    }
                  />
                  <ProfitLeakField
                    inputId="landing-ot"
                    label="Overtime hours"
                    value={inputs.overtimeHoursPerWeek}
                    min={0}
                    max={50000}
                    stepValue={0.5}
                    unit="hrs"
                    onChange={(v) =>
                      setInputs((p) => ({ ...p, overtimeHoursPerWeek: v }))
                    }
                  />
                </div>

                <p className="mt-6 text-xs leading-relaxed text-slate-500">
                  Estimates update as you type. Uses the same model as our full
                  calculator (typical HVAC assumptions for overruns and untracked
                  time).
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <button
                    type="button"
                    onClick={scrollToResult}
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[var(--fc-radius-lg)] bg-fc-accent px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_-2px_rgba(249,115,22,0.45)] transition-all duration-200 hover:bg-fc-accent-dark hover:shadow-[0_6px_20px_-2px_rgba(249,115,22,0.5)] focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 sm:w-auto"
                  >
                    Calculate My Profit Leak
                  </button>
                  <p className="text-sm text-slate-500">
                    No demo required. No complicated setup.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="relative bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 p-7 sm:p-9 lg:sticky lg:top-24 lg:self-start lg:p-10 xl:p-12">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.06),transparent_55%)]" />
                <div className="relative">
                  <div className="absolute -inset-1 -z-10 rounded-[1.35rem] bg-gradient-to-br from-fc-accent/20 via-transparent to-slate-300/20 opacity-60 blur-xl" />
                  <LossResultCard
                    formatTotal={formatTotal}
                    formatUnderQuoted={formatUnderQuoted}
                    formatOvertime={formatOvertime}
                    reduceMotion={reduceMotion}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
