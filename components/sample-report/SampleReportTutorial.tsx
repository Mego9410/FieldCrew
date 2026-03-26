"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatUSD, getSampleReportData } from "@/lib/sampleReportData";
import { routes } from "@/lib/routes";

type Step = {
  id:
    | "summary"
    | "overtime"
    | "overruns"
    | "leakage"
    | "recovered"
    | "recommendations";
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "summary",
    title: "Start with the Summary",
    description:
      "This gives you the monthly picture fast: revenue, labour cost, margin, overtime, and the top-line recoverable profit.",
  },
  {
    id: "overtime",
    title: "Check Overtime Breakdown",
    description:
      "Identify who is generating overtime and the main driver. This tells you where schedule pressure is coming from.",
  },
  {
    id: "overruns",
    title: "Review Job Overruns",
    description:
      "This is where estimate-to-actual drift shows up. Focus on repeat job types and recurring notes patterns.",
  },
  {
    id: "leakage",
    title: "Scan Leakage Sources",
    description:
      "These are the specific buckets quietly draining margin. Use this list to prioritize what to fix first.",
  },
  {
    id: "recovered",
    title: "Understand Recovered Profit",
    description:
      "This explains how the recoverable amount is calculated so you can trust the number and act on it.",
  },
  {
    id: "recommendations",
    title: "Use the 30-Day Actions",
    description:
      "These are practical, near-term actions you can run this month to reduce overtime and overruns.",
  },
];

function sectionClass(active: boolean) {
  return active
    ? "mt-10 rounded-lg border-2 border-fc-accent/40 bg-fc-accent/5 p-3 shadow-fc-sm transition print:mt-8"
    : "mt-10 print:mt-8";
}

export function SampleReportTutorial() {
  const data = getSampleReportData();
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = steps[stepIndex];

  useEffect(() => {
    if (!started) return;
    const node = document.getElementById(activeStep.id);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeStep, started]);

  const progress = useMemo(() => `${stepIndex + 1} / ${steps.length}`, [stepIndex]);

  const tutorialCard = (
    <div className="rounded-lg border border-fc-navy-800 bg-fc-navy-900 p-4 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.7)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fc-orange-500">
            Guided walkthrough
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-white">{activeStep.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">{activeStep.description}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Step {progress}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!started ? (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-fc-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fc-orange-600"
            >
              Start tutorial
            </button>
          ) : null}
          <button
            type="button"
            disabled={!started || stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-fc-navy-700 bg-fc-navy-800 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!started || stepIndex === steps.length - 1}
            onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-fc-navy-700 bg-fc-navy-800 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 print:max-w-4xl print:py-6">
      <header className="border-b border-fc-border pb-6 print:border-fc-border">
        <h1 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
          Monthly Labour Profit Report
        </h1>
        <p className="mt-2 text-lg font-medium text-fc-brand">{data.company}</p>
        <p className="text-sm text-fc-muted">
          {data.location} · {data.period} · {data.teamSize}
        </p>
      </header>

      <div className="mt-6 print:hidden lg:hidden">{tutorialCard}</div>

      <div className="lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
        <div>

      <section id="summary" className={sectionClass(started && activeStep.id === "summary")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">Summary</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-fc-border bg-white p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-muted">Total Revenue</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {formatUSD(data.summary.totalRevenue)}
            </p>
          </div>
          <div className="rounded-md border border-fc-border bg-white p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-muted">Total Labour Cost</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {formatUSD(data.summary.totalLabourCost)}
            </p>
          </div>
          <div className="rounded-md border border-fc-border bg-white p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-muted">Gross Labour Margin</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {data.summary.grossLabourMarginPct}%
            </p>
          </div>
          <div className="rounded-md border border-fc-border bg-white p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-muted">Overtime Cost</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {formatUSD(data.summary.overtimeCost)}
            </p>
          </div>
          <div className="rounded-md border border-fc-border bg-white p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-muted">Unbilled Labour Hours</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {data.summary.unbilledLabourHours}
            </p>
          </div>
          <div className="rounded-md border-2 border-fc-accent/40 bg-fc-accent/5 p-4 shadow-fc-sm">
            <p className="text-xs font-semibold uppercase text-fc-accent">Recovered Profit Opportunity</p>
            <p className="mt-1 font-display text-xl font-bold text-fc-brand">
              {formatUSD(data.summary.recoveredProfitOpportunity)}
            </p>
          </div>
        </div>
      </section>

      <section id="overtime" className={sectionClass(started && activeStep.id === "overtime")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
          Overtime Breakdown
        </h2>
        <div className="mt-4 overflow-x-auto rounded-md border border-fc-border bg-white shadow-fc-sm print:overflow-visible">
          <table className="w-full min-w-[500px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-fc-surface-muted">
                <th className="px-4 py-3 font-semibold text-fc-brand">Tech</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Regular Hrs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">OT Hrs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">OT Cost</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Primary Driver</th>
              </tr>
            </thead>
            <tbody>
              {data.overtimeBreakdown.map((row, i) => (
                <tr key={i} className="border-b border-fc-border-subtle last:border-0 hover:bg-fc-surface-muted/40">
                  <td className="px-4 py-3 font-medium text-fc-brand">{row.tech}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.regularHrs}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.otHrs}</td>
                  <td className="px-4 py-3 font-medium text-fc-brand">{formatUSD(row.otCost)}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.primaryDriver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="overruns" className={sectionClass(started && activeStep.id === "overruns")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
          Job Overruns (Top 10)
        </h2>
        <div className="mt-4 overflow-x-auto rounded-md border border-fc-border bg-white shadow-fc-sm print:overflow-visible">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-fc-surface-muted">
                <th className="px-4 py-3 font-semibold text-fc-brand">Job</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Type</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Est. Hrs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Actual Hrs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Overrun Hrs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Labour $ Impact</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.jobOverruns.map((row, i) => (
                <tr key={i} className="border-b border-fc-border-subtle last:border-0 hover:bg-fc-surface-muted/40">
                  <td className="px-4 py-3 font-medium text-fc-brand">{row.job}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.type}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.estimatedHrs}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.actualHrs}</td>
                  <td className="px-4 py-3 text-fc-muted">{row.overrunHrs}</td>
                  <td className="px-4 py-3 font-medium text-fc-brand">{formatUSD(row.labourImpact)}</td>
                  <td className="px-4 py-3 text-xs text-fc-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="leakage" className={sectionClass(started && activeStep.id === "leakage")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">Leakage Sources</h2>
        <ul className="mt-4 space-y-2">
          {data.leakageSources.map((item, i) => (
            <li key={i} className="flex items-center justify-between rounded-md border border-fc-border bg-white px-4 py-3 shadow-fc-sm">
              <span className="text-sm text-fc-brand">{item.label}</span>
              <span className="font-semibold text-fc-brand">{formatUSD(item.impact)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="recovered" className={sectionClass(started && activeStep.id === "recovered")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
          Recovered Profit Explanation
        </h2>
        <p className="mt-4 rounded-md border border-fc-border bg-white p-4 text-sm leading-relaxed text-fc-muted">
          {data.recoveredExplanation}
        </p>
      </section>

      <section id="recommendations" className={sectionClass(started && activeStep.id === "recommendations")}>
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
          Recommendations (Next 30 Days)
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-fc-muted">
          {data.recommendations.map((rec, i) => (
            <li key={i} className="pl-2">
              {rec}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-fc-border pt-10 print:border-0 print:pt-6">
        <p className="w-full text-base font-medium text-fc-brand">
          This is what’s happening in your business right now — ready to fix it?
        </p>
        <Link
          href={`${routes.owner.subscribe}?plan=pro`}
          className="inline-flex min-h-[44px] min-w-[56px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-base font-semibold text-white shadow-fc-sm transition-colors hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 print:no-underline"
        >
          Start tracking my jobs properly
        </Link>
        <Link
          href={routes.owner.subscribe}
          className="inline-flex min-h-[44px] min-w-[56px] items-center justify-center rounded-md border border-fc-border bg-white px-6 py-3 text-base font-semibold text-fc-brand shadow-fc-sm transition-colors hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 print:no-underline"
        >
          See plan options
        </Link>
        <p className="w-full text-sm font-medium text-fc-muted">Takes less than 10 minutes to set up</p>
      </div>
        </div>

        <aside className="hidden print:hidden lg:block">
          <div className="lg:fixed lg:top-24 lg:w-[320px] lg:right-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {tutorialCard}
          </div>
        </aside>
      </div>
    </div>
  );
}
