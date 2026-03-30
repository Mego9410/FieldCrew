"use client";

import Link from "next/link";
import {
  ProfitLeakField,
  useProfitLeakEstimate,
} from "@/components/landing/profit-leak-estimate";
import { routes } from "@/lib/routes";

export function ProfitLeakCalculator() {
  const {
    inputs,
    setInputs,
    outputs,
    formatUnderQuoted,
  } = useProfitLeakEstimate();

  return (
    <div className="bg-fc-bg-page">
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
        <div>
          <header className="text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-fc-accent">
              Profit leak calculator
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-fc-brand sm:text-4xl">
              See your monthly loss
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-fc-muted">
              4 inputs. Live estimate. Built for HVAC owners who want the dollar number, fast.
            </p>
          </header>

          <section className="mt-6 rounded-xl border border-fc-border bg-white p-6 shadow-fc-sm sm:mt-8 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <ProfitLeakField
                inputId="techs"
                label="Number of techs"
                value={inputs.techs}
                min={1}
                max={200}
                onChange={(v) => setInputs((p) => ({ ...p, techs: v }))}
              />

              <ProfitLeakField
                inputId="hourly"
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
                inputId="jobs"
                label="Jobs per week (company total)"
                value={inputs.jobsPerWeek}
                min={1}
                max={20000}
                stepValue={1}
                onChange={(v) =>
                  setInputs((p) => ({ ...p, jobsPerWeek: v }))
                }
              />

              <ProfitLeakField
                inputId="ot"
                label="Overtime hours per week (team total)"
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

            <div className="mt-6 rounded-md border border-slate-200/70 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
                Result updates live
              </p>
              <p className="mt-2 text-sm text-slate-600">
                We use typical HVAC assumptions for untracked time and job
                overruns to keep this simple.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-xl border-2 border-fc-accent/30 bg-white p-6 shadow-fc-md sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-wider text-fc-accent">
                  Estimated monthly profit leak
                </p>
                <p className="mt-2 font-display text-5xl font-extrabold tabular-nums text-fc-brand">
                  {outputs.formatted.totalRecoverableProfit}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Overtime premium
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tabular-nums text-fc-brand">
                    {outputs.formatted.overtimePremiumWaste}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Under-quoted labor
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tabular-nums text-fc-brand">
                    {formatUnderQuoted}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <Link
                href={routes.public.sampleReport}
                className="relative z-10 inline-flex min-h-[56px] shrink-0 items-center justify-center rounded-[var(--fc-radius-lg)] bg-fc-accent px-8 py-4 text-lg font-bold text-white shadow-fc-md transition-all duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                See a Real Example Report
              </Link>
              <div className="text-sm text-fc-steel-500">
                Want FieldCrew to find the jobs behind the number?{" "}
                <Link
                  href={routes.owner.subscribe}
                  className="rounded font-semibold text-fc-accent underline decoration-fc-accent underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-0"
                >
                  Get started
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
