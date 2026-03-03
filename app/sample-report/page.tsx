import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import {
  getSampleReportData,
  formatUSD,
} from "@/lib/sampleReportData";

export const metadata: Metadata = {
  title: "Sample Monthly Labour Profit Report — FieldCrew",
  description:
    "See a real example of FieldCrew’s Monthly Labour Profit Report for a 10-tech HVAC company. Overtime breakdown, job overruns, leakage sources, and recoverable profit.",
};

export default function SampleReportPage() {
  const data = getSampleReportData();

  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen bg-fc-page">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 print:py-6">
          {/* Report header */}
          <header className="border-b border-fc-border pb-6 print:border-fc-border">
            <h1 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
              Monthly Labour Profit Report
            </h1>
            <p className="mt-2 text-lg font-medium text-fc-brand">
              {data.company}
            </p>
            <p className="text-sm text-fc-muted">
              {data.location} · {data.period} · {data.teamSize}
            </p>
          </header>

          {/* Summary KPIs */}
          <section className="mt-8 print:mt-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
              Summary
            </h2>
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

          {/* Overtime Breakdown */}
          <section className="mt-10 print:mt-8">
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
                    <tr
                      key={i}
                      className="border-b border-fc-border-subtle last:border-0 hover:bg-fc-surface-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-fc-brand">{row.tech}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.regularHrs}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.otHrs}</td>
                      <td className="px-4 py-3 font-medium text-fc-brand">
                        {formatUSD(row.otCost)}
                      </td>
                      <td className="px-4 py-3 text-fc-muted">{row.primaryDriver}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-fc-border bg-fc-surface-muted font-semibold">
                    <td className="px-4 py-3 text-fc-brand">Total</td>
                    <td className="px-4 py-3 text-fc-muted">—</td>
                    <td className="px-4 py-3 text-fc-muted">
                      {data.overtimeBreakdown.reduce((s, r) => s + r.otHrs, 0)}
                    </td>
                    <td className="px-4 py-3 text-fc-brand">
                      {formatUSD(data.overtimeBreakdown.reduce((s, r) => s + r.otCost, 0))}
                    </td>
                    <td className="px-4 py-3 text-fc-muted">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Job Overruns (Top 10) */}
          <section className="mt-10 print:mt-8">
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
                    <tr
                      key={i}
                      className="border-b border-fc-border-subtle last:border-0 hover:bg-fc-surface-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-fc-brand">{row.job}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.type}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.estimatedHrs}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.actualHrs}</td>
                      <td className="px-4 py-3 text-fc-muted">{row.overrunHrs}</td>
                      <td className="px-4 py-3 font-medium text-fc-brand">
                        {formatUSD(row.labourImpact)}
                      </td>
                      <td className="px-4 py-3 text-fc-muted text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Leakage Sources */}
          <section className="mt-10 print:mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
              Leakage Sources
            </h2>
            <ul className="mt-4 space-y-2">
              {data.leakageSources.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border border-fc-border bg-white px-4 py-3 shadow-fc-sm"
                >
                  <span className="text-sm text-fc-brand">{item.label}</span>
                  <span className="font-semibold text-fc-brand">
                    {formatUSD(item.impact)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recovered Profit Explanation */}
          <section className="mt-10 print:mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
              Recovered Profit Explanation
            </h2>
            <p className="mt-4 rounded-md border border-fc-border bg-white p-4 text-sm leading-relaxed text-fc-muted">
              {data.recoveredExplanation}
            </p>
          </section>

          {/* Recommendations */}
          <section className="mt-10 print:mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
              Recommendations (Next 30 Days)
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-fc-muted">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="pl-2">{rec}</li>
              ))}
            </ul>
          </section>

          {/* Bottom CTA */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-fc-border pt-10 print:border-0 print:pt-6">
            <p className="w-full text-base font-medium text-fc-brand">
              Want your version of this report? Book 15 minutes.
            </p>
            <Link
              href="/book"
              className="inline-flex min-h-[44px] min-w-[56px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-base font-semibold text-white shadow-fc-sm transition-colors hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 print:no-underline"
            >
              Book 15-Min Walkthrough
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
