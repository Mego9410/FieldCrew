"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft, Clock, User, TrendingUp } from "lucide-react";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  calculateOvertime,
  calculateWeeklyLabourCost,
  getTopOvertimeWorkers,
  type OvertimeWorker,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries } from "@/lib/data";

type Timeframe = "this_week" | "last_week" | "last_30_days";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Build date range for the week that is N weeks before current week start */
function getWeekRangeOffset(weeksBack: number): { start: Date; end: Date } {
  const currentWeek = getCurrentWeekRange();
  const start = new Date(currentWeek.start);
  start.setDate(start.getDate() - weeksBack * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default function OvertimePage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("this_week");
  const [overtime, setOvertime] = useState<{
    hours: number;
    cost: number;
    pctOfPayroll: number;
    totalPayroll: number;
  } | null>(null);
  const [topWorkers, setTopWorkers] = useState<OvertimeWorker[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<{ label: string; cost: number; hours: number }[]>([]);
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

        const ot = calculateOvertime(timeEntries, workers, range);
        const totalPayroll = calculateWeeklyLabourCost(timeEntries, workers, range);
        const top = getTopOvertimeWorkers(timeEntries, workers, jobs, range);

        setOvertime({
          hours: ot.hours,
          cost: ot.cost,
          pctOfPayroll: ot.pctOfPayroll,
          totalPayroll,
        });
        setTopWorkers(top);

        // Last 6 weeks trend (week 0 = current, 1 = last week, etc.)
        const trend: { label: string; cost: number; hours: number }[] = [];
        for (let i = 0; i < 6; i++) {
          const weekRange = getWeekRangeOffset(i);
          const weekOt = calculateOvertime(timeEntries, workers, weekRange);
          const label = i === 0 ? "This week" : i === 1 ? "Last week" : `Wk -${i}`;
          trend.push({ label, cost: weekOt.cost, hours: weekOt.hours });
        }
        setWeeklyTrend(trend);
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
      <h1 className="font-display text-xl font-bold text-fc-brand">Overtime Analysis</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Track overtime costs, trends, and identify opportunities to reduce premium labour costs.
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
      ) : overtime ? (
        <>
          <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm md:p-8">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-fc-muted" />
              <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
                Overtime in period
              </p>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-fc-brand md:text-4xl lg:text-5xl">
              {currency.format(overtime.cost)}
            </p>
            <p className="mt-2 text-sm text-fc-muted">
              {overtime.hours.toFixed(1)} OT hours · {overtime.pctOfPayroll.toFixed(0)}% of payroll
            </p>
            <p className="mt-1 text-sm text-fc-muted">
              Total payroll in period: {currency.format(overtime.totalPayroll)}
            </p>
            {overtime.cost === 0 && (
              <p className="mt-2 text-sm text-fc-muted">No overtime recorded in this period.</p>
            )}
          </div>

          {weeklyTrend.length > 0 && (
            <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-fc-muted" />
                <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                  Overtime by week
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {weeklyTrend.map((week) => (
                  <li
                    key={week.label}
                    className="flex items-center justify-between border-b border-fc-border-subtle pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-fc-muted">{week.label}</span>
                    <span className="tabular-nums text-sm font-medium text-fc-brand">
                      {currency.format(week.cost)} · {week.hours.toFixed(1)} hrs
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-fc-muted" />
              <span className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
                Top overtime workers
              </span>
            </div>
            {topWorkers.length === 0 ? (
              <p className="mt-4 text-sm text-fc-muted">No overtime by worker in this period.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[320px] text-sm">
                  <thead>
                    <tr className="border-b border-fc-border text-left text-xs font-medium uppercase tracking-widest text-fc-muted">
                      <th className="pb-2 pr-4">Worker</th>
                      <th className="pb-2 pr-4 text-right">OT hours</th>
                      <th className="pb-2 text-right">OT cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topWorkers.map((w) => (
                      <tr key={w.workerId} className="border-b border-fc-border-subtle last:border-0">
                        <td className="py-3 pr-4 font-medium text-fc-brand">{w.workerName}</td>
                        <td className="py-3 pr-4 text-right tabular-nums text-fc-muted">
                          {w.otHours.toFixed(1)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-fc-brand">
                          {currency.format(w.otCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          <p className="text-fc-muted">Unable to load overtime analytics.</p>
        </div>
      )}
    </div>
  );
}
