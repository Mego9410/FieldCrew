"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  calculateLeakage,
  DEFAULT_LEAKAGE_INPUTS,
  type LeakageInputs,
  type LeakageOutputs,
} from "@/lib/leakageCalculator";
import { track } from "@/lib/tracking";
import { SampleProfitReport } from "./SampleProfitReport";

const INPUT_LABELS: Record<keyof LeakageInputs, string> = {
  techs: "Number of field techs",
  hourlyWage: "Avg hourly wage ($/hr)",
  billableRate: "Avg billable rate ($/hr)",
  otHoursPerTechPerWeek: "Avg overtime hours per tech / week",
  untrackedHoursPerTechPerWeek: "Untracked hours per tech / week",
  jobOverrunRate: "Job overrun rate (% of jobs)",
  avgOverrunHours: "Avg overrun hours per overrun job",
  jobsPerTechPerWeek: "Jobs per tech per week",
};

interface HiddenProfitFlowProps {
  auditUrl?: string;
}

export function HiddenProfitFlow({ auditUrl = "/book" }: HiddenProfitFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<LeakageInputs>(DEFAULT_LEAKAGE_INPUTS);
  const [outputs, setOutputs] = useState<LeakageOutputs | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCheckbox, setLeadCheckbox] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const runCalculation = useCallback(() => {
    const result = calculateLeakage(inputs);
    setOutputs(result);
    track("hidden_profit_calculated", {
      total: result.totalRecoverableProfit,
      techs: inputs.techs,
    });
    return result;
  }, [inputs]);

  useEffect(() => {
    runCalculation();
  }, [runCalculation]);

  const handleInputChange = (key: keyof LeakageInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = leadEmail.trim();
    if (!email) return;
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "hidden_profit",
          inputs,
          outputs: outputs ?? undefined,
          isHvacOwnerManager: leadCheckbox,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit");
      }
      track("hidden_profit_lead_submitted", { email });
      setLeadStatus("success");
    } catch {
      setLeadStatus("error");
    }
  };

  const handleSeeReport = () => {
    setOutputs((prev) => prev ?? calculateLeakage(inputs));
    setStep(2);
    track("hidden_profit_report_viewed");
  };

  const handlePrint = () => {
    track("hidden_profit_download_clicked");
    window.print();
  };

  const handleAuditClick = () => {
    track("hidden_profit_audit_clicked");
  };

  const currentOutputs = outputs ?? calculateLeakage(inputs);

  const inputGroups: { title: string; keys: (keyof LeakageInputs)[] }[] = [
    { title: "Workforce", keys: ["techs", "jobsPerTechPerWeek"] },
    { title: "Rates & hours", keys: ["hourlyWage", "billableRate", "otHoursPerTechPerWeek", "untrackedHoursPerTechPerWeek"] },
    { title: "Job performance", keys: ["jobOverrunRate", "avgOverrunHours"] },
  ];

  const inputConfig = (
    [
      ["techs", 1, 200, ""],
      ["hourlyWage", 10, 150, "$/hr"],
      ["billableRate", 50, 400, "$/hr"],
      ["otHoursPerTechPerWeek", 0, 30, "hrs"],
      ["untrackedHoursPerTechPerWeek", 0, 10, "hrs"],
      ["jobOverrunRate", 0, 100, "%"],
      ["avgOverrunHours", 0, 10, "hrs"],
      ["jobsPerTechPerWeek", 1, 100, ""],
    ] as const
  );

  return (
    <div className="min-h-screen bg-fc-bg-page">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-fc-accent">
            Labour leakage calculator
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-fc-brand sm:text-4xl">
            {step === 1 ? "How Much Labour Profit Are You Losing?" : "Sample Monthly Labour Profit Report"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-fc-muted">
            {step === 1
              ? "Adjust the levers below. Your estimate updates live."
              : "Your estimate plus a real example from a 10-tech HVAC company."}
          </p>
        </header>

        <main className="mt-12">
        {step === 1 ? (
          <>
            {/* Input panels — grouped, panel aesthetic */}
            <div className="space-y-8">
              {inputGroups.map((group) => (
                <section
                  key={group.title}
                  className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-fc-sm"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-fc-accent/80" aria-hidden />
                  <div className="pl-5 pr-5 pt-4 pb-5 sm:pl-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-fc-muted">
                      {group.title}
                    </h2>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      {group.keys.map((key) => {
                        const [, min, max, unit] = inputConfig.find(([k]) => k === key)!;
                        return (
                          <div key={key} className="flex flex-col">
                            <label
                              htmlFor={`input-${key}`}
                              className="text-xs font-medium text-slate-500"
                            >
                              {INPUT_LABELS[key]}
                            </label>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                              <input
                                id={`input-${key}`}
                                type="number"
                                min={min}
                                max={max}
                                step={key === "jobOverrunRate" ? 1 : key === "hourlyWage" || key === "billableRate" ? 1 : 0.1}
                                value={inputs[key]}
                                onChange={(e) => {
                                  const v = e.target.valueAsNumber;
                                  if (!Number.isNaN(v)) handleInputChange(key, v);
                                }}
                                className="w-full max-w-[8rem] rounded border border-slate-200 bg-slate-50/80 py-2.5 pl-3 pr-2 text-right font-semibold tabular-nums text-fc-brand placeholder:text-slate-400 focus:border-fc-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-fc-accent"
                              />
                              {unit && (
                                <span className="text-sm text-slate-400">{unit}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              OT premium = 0.5 × wage (time-and-a-half). 4.33 weeks/month.
            </p>

            {/* Result readout — hero panel */}
            <section
              className="mt-10 rounded-xl border-2 border-fc-accent/30 bg-white p-6 shadow-fc-md sm:p-8"
              aria-live="polite"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-fc-accent">
                Estimated monthly labour leakage
              </p>
              <p className="mt-2 font-display text-4xl font-bold tabular-nums text-fc-brand sm:text-5xl">
                {currentOutputs.formatted.totalRecoverableProfit}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Overtime premium", value: currentOutputs.formatted.overtimePremiumWaste },
                  { label: "Untracked time", value: currentOutputs.formatted.untrackedTimeRevenue },
                  { label: "Job overrun waste", value: currentOutputs.formatted.jobOverrunWaste },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/50 px-4 py-4"
                  >
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 font-display text-xl font-bold tabular-nums text-fc-brand">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {showLeadCapture ? (
              <section className="mt-8 rounded-lg border border-slate-200/80 bg-white p-5 shadow-fc-sm">
                <h3 className="font-display text-sm font-semibold text-fc-brand">Email me this report</h3>
                {leadStatus === "success" ? (
                  <p className="mt-2 text-sm text-fc-success">Thanks. We’ll send the report to this address.</p>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="mt-4 space-y-4">
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full max-w-sm rounded border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-fc-brand focus:border-fc-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-fc-accent"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={leadCheckbox}
                        onChange={(e) => setLeadCheckbox(e.target.checked)}
                        className="rounded border-slate-300 text-fc-accent focus:ring-fc-accent"
                      />
                      I’m an HVAC owner/manager
                    </label>
                    {leadStatus === "error" && (
                      <p className="text-sm text-fc-danger">Something went wrong. Try again.</p>
                    )}
                    <button
                      type="submit"
                      disabled={leadStatus === "loading"}
                      className="rounded-md bg-fc-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-fc-accent-dark disabled:opacity-50"
                    >
                      {leadStatus === "loading" ? "Sending…" : "Submit"}
                    </button>
                  </form>
                )}
              </section>
            ) : null}

            {/* CTAs */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200/80 pt-10">
              <button
                type="button"
                onClick={handleSeeReport}
                className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-fc-accent px-8 py-3 text-base font-semibold text-white shadow-fc-md hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                See a Real Example Report
              </button>
              <button
                type="button"
                onClick={() => setShowLeadCapture(true)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-fc-brand hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                Email me this report
              </button>
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                Back to home
              </Link>
            </div>
          </>
        ) : (
          <>
            <SampleProfitReport
              userEstimate={currentOutputs}
              auditUrl={auditUrl}
              onAuditClick={handleAuditClick}
              onDownloadClick={handlePrint}
            />
            <div className="mt-6 print:hidden">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-slate-600 underline hover:text-fc-brand"
              >
                ← Back to calculator
              </button>
            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
}
