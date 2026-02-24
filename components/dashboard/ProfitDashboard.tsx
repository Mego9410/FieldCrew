"use client";

import { useState, useEffect } from "react";
import { routes } from "@/lib/routes";
import { RecoverableProfitBlock } from "./RecoverableProfitBlock";
import { MarginStatusPanel } from "./MarginStatusPanel";
import { LabourCostChart } from "./LabourCostChart";
import { OvertimePressureModule } from "./OvertimePressureModule";
import { OperationalRiskStrip } from "./OperationalRiskStrip";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  calculateWeeklyRevenue,
  calculateWeeklyLabourCost,
  calculateOvertime,
  calculateOverruns,
  calculateBlendedHourlyRate,
  calculateAvgLabourCostPerJob,
  calculateTimeAllocation,
  calculateRevenuePerLabourHour,
  calculateRecoverableProfit,
  getTopOvertimeWorkers,
  getLowestMarginJobTypes,
  type OverrunningJob,
  type OvertimeWorker,
  type JobTypeMargin,
  type ChartDataPoint,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/data";

export function ProfitDashboard() {
  const [timeframe, setTimeframe] = useState<"this_week" | "last_week" | "last_30_days">("this_week");
  const [dashboardData, setDashboardData] = useState<{
    revenueThisWeek: number;
    labourCostThisWeek: number;
    labourMarginPct: number;
    overtime: { hours: number; cost: number; pctOfPayroll: number };
    overruns: { count: number; totalOverrunHours: number; estimatedCostOverrun: number; jobs: OverrunningJob[] };
    recoverableProfit: number;
    labourCostPerJobData: ChartDataPoint[];
    rplh: number;
    topOverrunningJobs: OverrunningJob[];
    topOvertimeWorkers: OvertimeWorker[];
    lowestMarginJobTypes: JobTypeMargin[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getJobs(),
      getWorkers(),
      getTimeEntries(),
      getJobTypes(),
    ]).then(([jobs, workers, timeEntries, jobTypes]) => {
      if (cancelled) return;

      const currentWeek = getCurrentWeekRange();
      const lastWeek = getLastWeekRange();
      const last30Days = getLastNDaysRange(30);

      const range = timeframe === "this_week" ? currentWeek : timeframe === "last_week" ? lastWeek : last30Days;

      const revenueThisWeek = calculateWeeklyRevenue(jobs, range);
      const labourCostThisWeek = calculateWeeklyLabourCost(timeEntries, workers, range);
      const labourMarginPct = revenueThisWeek > 0
        ? ((revenueThisWeek - labourCostThisWeek) / revenueThisWeek) * 100
        : 0;

      const overtime = calculateOvertime(timeEntries, workers, range);
      const blendedHourlyRate = calculateBlendedHourlyRate(workers);
      const overruns = calculateOverruns(jobs, timeEntries, workers, blendedHourlyRate, range);

      const timeAllocation = calculateTimeAllocation(timeEntries, range);
      const idleHours = timeAllocation.idle;
      const recoverableProfit = calculateRecoverableProfit(
        overtime.cost,
        overruns.estimatedCostOverrun,
        idleHours,
        blendedHourlyRate
      );

      const labourCostPerJobData = calculateAvgLabourCostPerJob(jobs, timeEntries, workers, last30Days);
      const rplhMetrics = calculateRevenuePerLabourHour(jobs, timeEntries, range);

      const topOverrunningJobs = overruns.jobs.slice(0, 5);
      const topOvertimeWorkers = getTopOvertimeWorkers(timeEntries, workers, jobs, range).slice(0, 5);
      const lowestMarginJobTypes = getLowestMarginJobTypes(jobs, jobTypes, timeEntries, workers, range).slice(0, 5);

      setDashboardData({
        revenueThisWeek,
        labourCostThisWeek,
        labourMarginPct,
        overtime,
        overruns,
        recoverableProfit,
        labourCostPerJobData,
        rplh: rplhMetrics.rplh,
        topOverrunningJobs,
        topOvertimeWorkers,
        lowestMarginJobTypes,
      });
    });
    return () => { cancelled = true; };
  }, [timeframe]);

  if (!dashboardData) {
    return (
      <div className="min-h-full bg-fc-page px-4 py-8 md:px-6">
        <h1 className="font-display text-xl font-semibold text-fc-brand">Dashboard</h1>
        <p className="mt-2 text-sm text-fc-muted">Loading…</p>
      </div>
    );
  }

  const {
    revenueThisWeek,
    labourCostThisWeek,
    labourMarginPct,
    overtime,
    overruns,
    recoverableProfit,
    labourCostPerJobData,
    rplh,
    topOverrunningJobs,
    topOvertimeWorkers,
    lowestMarginJobTypes,
  } = dashboardData;

  const recoverablePctOfPayroll =
    labourCostThisWeek > 0 ? (recoverableProfit / labourCostThisWeek) * 100 : 0;
  const topOvertimeWorker = topOvertimeWorkers[0] ?? null;

  return (
    <div className="min-h-full bg-fc-page">
      <div className="px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-xl font-semibold text-fc-brand">Dashboard</h1>
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <RecoverableProfitBlock
              recoverableAmount={recoverableProfit}
              pctOfPayroll={recoverablePctOfPayroll}
              href={routes.owner.dashboard.recovery}
            />
          </div>
          <div className="lg:col-span-5">
            <MarginStatusPanel
              labourMarginPct={labourMarginPct}
              revenueThisWeek={revenueThisWeek}
              labourCostThisWeek={labourCostThisWeek}
              revenuePerLabourHour={rplh}
              href={routes.owner.dashboard.margin}
            />
          </div>
          <div className="lg:col-span-7">
            <LabourCostChart
              data={labourCostPerJobData}
              href={routes.owner.dashboard.labourCostTrend}
            />
          </div>
          <div className="lg:col-span-5">
            <OvertimePressureModule
              overtimeCost={overtime.cost}
              overtimeHours={overtime.hours}
              pctOfPayroll={overtime.pctOfPayroll}
              overrunCount={overruns.count}
              topOvertimeWorker={topOvertimeWorker}
              href={routes.owner.dashboard.overtime}
            />
          </div>
          <div className="lg:col-span-12">
            <OperationalRiskStrip
              topOverrunningJobs={topOverrunningJobs}
              lowestMarginJobTypes={lowestMarginJobTypes}
              workersDrivingSpikes={topOvertimeWorkers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
