"use client";

import { type LeakageOutputs } from "@/lib/leakageCalculator";
import { getHoustonSampleReport, formatUSD } from "@/lib/leakageCalculator";

interface SampleProfitReportProps {
  /** User's calculator estimate (from step 1) */
  userEstimate: LeakageOutputs;
  auditUrl?: string;
  onAuditClick?: () => void;
  onDownloadClick?: () => void;
}

export function SampleProfitReport({
  userEstimate,
  auditUrl = "/book",
  onAuditClick,
  onDownloadClick,
}: SampleProfitReportProps) {
  const sample = getHoustonSampleReport();

  return (
    <div className="space-y-6 print:block">
      <header className="border-b border-slate-200/60 pb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Sample Monthly Labour Profit Report
        </h2>
        <p className="mt-1 font-display text-lg font-bold text-fc-brand">
          {sample.companyLabel} — {sample.location} — {sample.month}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Your estimate: <strong className="text-fc-brand">{userEstimate.formatted.totalRecoverableProfit}</strong>/month
        </p>
      </header>

      <section className="rounded-md border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workforce overview
        </h3>
        <ul className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <li><span className="text-slate-500">Field techs</span> {sample.techs}</li>
          <li><span className="text-slate-500">Avg wage</span> {formatUSD(sample.wage)}/hr</li>
          <li><span className="text-slate-500">Billable rate</span> {formatUSD(sample.billableRate)}/hr</li>
        </ul>
      </section>

      <section className="rounded-md border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Overtime analysis
        </h3>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Planned OT: {sample.otPlannedHours} hrs</li>
          <li>Actual OT: {sample.otActualHours} hrs</li>
          <li>Excess OT: {sample.otExcessHours} hrs</li>
          <li>OT premium cost: <strong>{formatUSD(sample.otPremiumCost)}</strong></li>
        </ul>
      </section>

      <section className="rounded-md border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Job overrun analysis
        </h3>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Overrun jobs: {sample.overrunJobs}</li>
          <li>Avg overrun: {sample.avgOverrunHours} hrs</li>
          <li>Lost billable time (waste): <strong>{formatUSD(sample.jobOverrunWaste)}</strong></li>
        </ul>
      </section>

      <section className="rounded-md border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Untracked time
        </h3>
        <p className="mt-2 text-sm">
          Est. {sample.untrackedHoursPerTechPerWeek} hrs/tech/week untracked →{" "}
          <strong>{formatUSD(sample.untrackedTimeRevenue)}</strong> revenue impact
        </p>
      </section>

      <section className="rounded-md border-2 border-fc-accent/40 bg-fc-accent/5 p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Total identified labour leakage
        </h3>
        <p className="mt-2 text-2xl font-bold text-fc-brand">
          Total Monthly Recoverable Profit: {formatUSD(sample.totalRecoverableProfit)}
        </p>
      </section>

      <section className="rounded-md border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          12‑month impact
        </h3>
        <p className="mt-2 text-lg font-semibold text-fc-brand">
          {formatUSD(sample.twelveMonthImpact)}/year
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
          <li>That’s real margin back on the table</li>
          <li>Enough to hire another tech or fund new equipment</li>
          <li>Job-level visibility prevents the same leaks next month</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-slate-200/60 pt-4 print:border-t-0 print:pt-2">
        <a
          href={auditUrl}
          target={auditUrl.startsWith("http") ? "_blank" : undefined}
          rel={auditUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          onClick={onAuditClick}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 print:no-underline"
        >
          Book a 15‑Minute Labour Audit
        </a>
        <button
          type="button"
          onClick={onDownloadClick}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-fc-brand transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 print:hidden"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
