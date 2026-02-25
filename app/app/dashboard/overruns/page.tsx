"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft, AlertTriangle, Briefcase } from "lucide-react";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  calculateOverruns,
  calculateBlendedHourlyRate,
  type OverrunningJob,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries } from "@/lib/data";

type Timeframe = "this_week" | "last_week" | "last_30_days";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function OverrunsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("this_week");
  const [overruns, setOverruns] = useState<{
    count: number;
    totalOverrunHours: number;
    estimatedCostOverrun: number;
    jobs: OverrunningJob[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getJobs(), getWorkers(), getTimeEntries()])
      .then(([jobs, workers, timeEntries]) => {
        if (cancelled) return;
        const currentWeek = getCurrentWeekRange();
        const lastWeek = getLastWeekRange();
        const last30Days = getLastNDaysRange(30);
        const range =
          timeframe === "this_week" ? currentWeek : timeframe === "last_week" ? lastWeek : last30Days;

        const blendedRate = calculateBlendedHourlyRate(workers);
        const result = calculateOverruns(jobs, timeEntries, workers, blendedRate, range);
        setOverruns(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Jobs Over Budget</h1>
      <p className="mt-1 text-sm text-fc-muted">
        View all jobs that are exceeding estimated hours and costs.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-fc-border bg-fc-surface shadow-fc-sm">
          {(["this_week", "last_week", "last_30_days"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                timeframe === key
                  ? "bg-fc-accent text-white"
                  : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
              }`}
            >
              {key === "this_week" ? "This week" : key === "last_week" ? "Last week" : "Last 30 days"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-lg border border-fc-border bg-white p-8 text-center">
          <p className="text-fc-muted">Loading…</p>
        </div>
      ) : overruns ? (
        <>
          <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm md:p-8">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-fc-muted" />
              <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
                Overruns in period
              </p>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-fc-brand md:text-4xl lg:text-5xl">
              {overruns.count} job{overruns.count !== 1 ? "s" : ""} over budget
            </p>
            <p className="mt-2 text-sm text-fc-muted">
              {overruns.totalOverrunHours.toFixed(1)} overrun hours · estimated cost impact{" "}
              {currency.format(overruns.estimatedCostOverrun)}
            </p>
            {overruns.count === 0 && (
              <p className="mt-2 text-sm text-fc-muted">No jobs over budget in this period.</p>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-fc-muted" />
              <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                Jobs exceeding estimate
              </span>
            </div>
            {overruns.jobs.length === 0 ? (
              <p className="mt-4 text-sm text-fc-muted">No overrunning jobs in this period.</p>
            ) : (
              <>
              <div className="mt-4 overflow-x-auto max-w-full">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-fc-border text-left text-xs font-medium uppercase tracking-widest text-fc-muted">
                      <th className="pb-2 pr-4">Job</th>
                      <th className="pb-2 pr-4">Customer</th>
                      <th className="pb-2 pr-4 text-right">Est. hrs</th>
                      <th className="pb-2 pr-4 text-right">Actual hrs</th>
                      <th className="pb-2 pr-4 text-right">Overrun</th>
                      <th className="pb-2 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overruns.jobs.map((job) => (
                      <tr key={job.jobId} className="border-b border-fc-border-subtle last:border-0">
                        <td className="py-3 pr-4">
                          <Link
                            href={routes.owner.job(job.jobId)}
                            className="font-medium text-fc-brand hover:underline"
                          >
                            {job.jobName}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-fc-muted">
                          {job.customerName ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-fc-muted">
                          {job.estimatedHours.toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-fc-muted">
                          {job.actualHours.toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-fc-brand">
                          +{job.overrunHours.toFixed(1)} hrs
                        </td>
                        <td className="py-3 text-right tabular-nums text-fc-brand">
                          {currency.format(job.overrunCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-1 text-xs text-fc-muted md:hidden" aria-hidden>Scroll horizontally for more columns.</p>
              </>
            )}
          </div>

          <div className="mt-8 border-t border-fc-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
              Next steps
            </p>
            <ul className="mt-2 flex flex-wrap gap-4">
              <li>
                <Link
                  href={routes.owner.dashboard.recovery}
                  className="text-sm font-medium text-fc-accent hover:underline"
                >
                  Recoverable profit
                </Link>
              </li>
              <li>
                <Link
                  href={routes.owner.dashboard.overtime}
                  className="text-sm font-medium text-fc-accent hover:underline"
                >
                  Overtime analysis
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-fc-border bg-white p-8 text-center">
          <p className="text-fc-muted">Unable to load overrun analytics.</p>
        </div>
      )}
    </div>
  );
}
