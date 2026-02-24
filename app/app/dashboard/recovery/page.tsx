"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft, Clock, AlertTriangle, Zap } from "lucide-react";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  calculateOvertime,
  calculateOverruns,
  calculateTimeAllocation,
  calculateBlendedHourlyRate,
  getRecoverableProfitBreakdown,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries } from "@/lib/data";

type Timeframe = "this_week" | "last_week" | "last_30_days";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function RecoveryPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("this_week");
  const [breakdown, setBreakdown] = useState<ReturnType<typeof getRecoverableProfitBreakdown> | null>(null);
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

        const overtime = calculateOvertime(timeEntries, workers, range);
        const blendedHourlyRate = calculateBlendedHourlyRate(workers);
        const overruns = calculateOverruns(jobs, timeEntries, workers, blendedHourlyRate, range);
        const timeAllocation = calculateTimeAllocation(timeEntries, range);

        const result = getRecoverableProfitBreakdown(
          overtime.cost,
          overruns.estimatedCostOverrun,
          timeAllocation.idle,
          blendedHourlyRate
        );
        setBreakdown(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  return (
    <div className="px-6 py-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Recoverable Profit</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Discover opportunities to recover profit through better scheduling, overtime reduction, and efficiency improvements.
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
      ) : breakdown ? (
        <>
          <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm md:p-8">
            <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
              Total recoverable profit
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-fc-brand md:text-4xl lg:text-5xl">
              {currency.format(breakdown.total)}
            </p>
            <p className="mt-2 text-sm text-fc-muted">
              Potential profit from better scheduling, overtime reduction, and efficiency
            </p>
            {breakdown.total === 0 && (
              <p className="mt-2 text-sm text-fc-muted">No time entries in this period.</p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-fc-muted" />
                <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                  Overtime reduction
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-fc-brand">
                {currency.format(breakdown.fromOvertime)}
              </p>
              <p className="mt-2 text-sm text-fc-muted">
                ~20% reduction potential from managing overtime.
              </p>
            </div>
            <div className="rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-fc-muted" />
                <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                  Overrun reduction
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-fc-brand">
                {currency.format(breakdown.fromOverruns)}
              </p>
              <p className="mt-2 text-sm text-fc-muted">
                ~20% reduction potential from better estimates and execution.
              </p>
            </div>
            <div className="rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-fc-muted" />
                <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                  Idle / efficiency
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-fc-brand">
                {currency.format(breakdown.fromIdle)}
              </p>
              <p className="mt-2 text-sm text-fc-muted">
                ~15% reduction potential from reducing idle time.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-fc-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
              Next steps
            </p>
            <ul className="mt-2 flex flex-wrap gap-4">
              <li>
                <Link
                  href={routes.owner.dashboard.overtime}
                  className="text-sm font-medium text-fc-accent hover:underline"
                >
                  Overtime analysis
                </Link>
              </li>
              <li>
                <Link
                  href={routes.owner.dashboard.overruns}
                  className="text-sm font-medium text-fc-accent hover:underline"
                >
                  Overruns analysis
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-fc-border bg-white p-8 text-center">
          <p className="text-fc-muted">Unable to load recovery analytics.</p>
        </div>
      )}
    </div>
  );
}
