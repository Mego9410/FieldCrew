"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { routes } from "@/lib/routes";
import { KpiCard } from "./KpiCard";
import { InsightCard } from "./InsightCard";
import { RecoveryCallout } from "./RecoveryCallout";
import { RevenuePerLabourHourCard } from "./RevenuePerLabourHourCard";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { chartTheme } from "@/components/charts";
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
  calculateEstimateAccuracy,
  calculateTimeAllocation,
  calculateRevenuePerLabourHour,
  calculateRplhTrend,
  calculateRplhDeltaVsLastWeek,
  getTopOvertimeWorkers,
  getLowestMarginJobTypes,
  calculateRecoverableProfit,
  type OverrunningJob,
  type OvertimeWorker,
  type JobTypeMargin,
  type RplhTrendPoint,
  type RplhDelta,
  type ChartDataPoint,
  type EstimateAccuracyPoint,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/data";

export function ProfitDashboard() {
  const [timeframe, setTimeframe] = useState<"this_week" | "last_week" | "last_30_days">("this_week");
  const [dashboardData, setDashboardData] = useState<{
    revenueThisWeek: number;
    revenueLastWeek: number;
    labourCostThisWeek: number;
    labourCostLastWeek: number;
    labourMarginPct: number;
    marginTrend: number;
    overtime: { hours: number; cost: number; pctOfPayroll: number };
    overtimeTrend: number;
    overruns: { count: number; totalOverrunHours: number; estimatedCostOverrun: number; jobs: OverrunningJob[] };
    overrunTrend: number;
    recoverableProfit: number;
    labourCostPerJobData: ChartDataPoint[];
    estimateAccuracyData: EstimateAccuracyPoint[];
    rplh: number;
    rplhDelta: RplhDelta;
    rplhTrend: RplhTrendPoint[];
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
    const compareRange = timeframe === "this_week" ? lastWeek : getLastNDaysRange(30);

    // Calculate metrics
    const revenueThisWeek = calculateWeeklyRevenue(jobs, range);
    const revenueLastWeek = calculateWeeklyRevenue(jobs, compareRange);
    const labourCostThisWeek = calculateWeeklyLabourCost(timeEntries, workers, range);
    const labourCostLastWeek = calculateWeeklyLabourCost(timeEntries, workers, compareRange);
    const labourMarginPct = revenueThisWeek > 0 ? ((revenueThisWeek - labourCostThisWeek) / revenueThisWeek) * 100 : 0;
    const labourMarginPctLastWeek =
      revenueLastWeek > 0 ? ((revenueLastWeek - labourCostLastWeek) / revenueLastWeek) * 100 : 0;
    const marginTrend = labourMarginPctLastWeek > 0 ? ((labourMarginPct - labourMarginPctLastWeek) / labourMarginPctLastWeek) * 100 : 0;

    const overtime = calculateOvertime(timeEntries, workers, range);
    const overtimeLastWeek = calculateOvertime(timeEntries, workers, compareRange);
    const overtimeTrend = overtimeLastWeek.cost > 0 ? ((overtime.cost - overtimeLastWeek.cost) / overtimeLastWeek.cost) * 100 : 0;

    const blendedHourlyRate = calculateBlendedHourlyRate(workers);
    const overruns = calculateOverruns(jobs, timeEntries, workers, blendedHourlyRate, range);
    const overrunsLastWeek = calculateOverruns(jobs, timeEntries, workers, blendedHourlyRate, compareRange);
    const overrunTrend = overrunsLastWeek.count > 0 ? ((overruns.count - overrunsLastWeek.count) / overrunsLastWeek.count) * 100 : 0;

    // Calculate idle hours for recoverable profit (still needed)
    const timeAllocation = calculateTimeAllocation(timeEntries, range);
    const idleHours = timeAllocation.idle;
    const recoverableProfit = calculateRecoverableProfit(
      overtime.cost,
      overruns.estimatedCostOverrun,
      idleHours,
      blendedHourlyRate
    );

    // Chart data
    const labourCostPerJobData = calculateAvgLabourCostPerJob(jobs, timeEntries, workers, last30Days);
    const estimateAccuracyData = calculateEstimateAccuracy(jobs, timeEntries, last30Days);

    // RPLH calculations
    const rplhMetrics = calculateRevenuePerLabourHour(jobs, timeEntries, range);
    const rplhTrend = calculateRplhTrend(jobs, timeEntries, 6);
    const rplhDelta = calculateRplhDeltaVsLastWeek(jobs, timeEntries);

    // Table data
    const topOverrunningJobs = overruns.jobs.slice(0, 5);
    const topOvertimeWorkers = getTopOvertimeWorkers(timeEntries, workers, jobs, range).slice(0, 5);
    const lowestMarginJobTypes = getLowestMarginJobTypes(jobs, jobTypes, timeEntries, workers, range).slice(0, 5);

      setDashboardData({
      revenueThisWeek,
      revenueLastWeek,
      labourCostThisWeek,
      labourCostLastWeek,
      labourMarginPct,
      marginTrend,
      overtime,
      overtimeTrend,
      overruns,
      overrunTrend,
      recoverableProfit,
      labourCostPerJobData,
      estimateAccuracyData,
      rplh: rplhMetrics.rplh,
      rplhDelta,
      rplhTrend,
      topOverrunningJobs,
      topOvertimeWorkers,
      lowestMarginJobTypes,
    });
    });
    return () => { cancelled = true; };
  }, [timeframe]);

  // Show loading state during initial fetch
  if (!dashboardData) {
    return (
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-bold text-fc-brand">Profit Control Centre</h1>
          <p className="mt-1 text-sm text-fc-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const {
    revenueThisWeek,
    labourCostThisWeek,
    labourMarginPct,
    marginTrend,
    overtime,
    overtimeTrend,
    overruns,
    overrunTrend,
    recoverableProfit,
    labourCostPerJobData,
    estimateAccuracyData,
    rplh,
    rplhDelta,
    rplhTrend,
    topOverrunningJobs,
    topOvertimeWorkers,
    lowestMarginJobTypes,
  } = dashboardData;

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Profit Control Centre</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Weekly margin overview. Overtime, overruns, revenue per labour hour.
          </p>
        </div>
        <div className="flex border border-fc-border bg-fc-surface">
          {(["this_week", "last_week", "last_30_days"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${
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

      {/* Section: Weekly Margin Overview */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Weekly Margin Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <KpiCard
              title="Weekly margin overview"
              primaryValue={`${labourMarginPct.toFixed(1)}%`}
              secondaryValue={`Revenue ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek)} • Labour ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(labourCostThisWeek)}`}
              trend={{ value: marginTrend, label: "last week" }}
              href={routes.owner.dashboard.margin}
              warning={labourMarginPct < 40}
              primaryMetric
            />
          </div>
          <KpiCard
            title="Overtime cost (current week)"
            primaryValue={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(overtime.cost)}
            secondaryValue={`${overtime.hours.toFixed(1)} OT hrs • ${overtime.pctOfPayroll.toFixed(0)}% of payroll`}
            trend={{ value: overtimeTrend, label: "last week" }}
            href={routes.owner.dashboard.overtime}
            warning={overtime.pctOfPayroll > 15}
          />
          <KpiCard
            title="Jobs exceeding estimate"
            primaryValue={`${overruns.count} jobs`}
            secondaryValue={`+${overruns.totalOverrunHours.toFixed(1)} hrs • ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(overruns.estimatedCostOverrun)} est overrun`}
            trend={{ value: overrunTrend, label: "last week" }}
            href={routes.owner.dashboard.overruns}
            warning={overruns.count > 3}
          />
          <KpiCard
            title="Revenue per labour hour"
            primaryValue={`${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek)} vs ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(labourCostThisWeek)}`}
            secondaryValue={`Gross labour profit ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek - labourCostThisWeek)}`}
            trend={{ value: marginTrend, label: "last week" }}
            href={routes.owner.dashboard.revenueLabour}
          />
        </div>
      </section>

      {/* Section: Margin Risk Signals (Recoverable Profit) */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Margin Risk Signals
        </h2>
        <RecoveryCallout recoverableAmount={recoverableProfit} href={routes.owner.dashboard.recovery} />
      </section>

      {/* Section: Performance Trends — one wide chart, then two */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Performance Trends
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <div className="lg:col-span-6">
        <InsightCard title="Labour cost per job (rolling 30 days)" href={routes.owner.dashboard.labourCostTrend}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={labourCostPerJobData}>
              <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} strokeOpacity={chartTheme.grid.strokeOpacity} />
              <XAxis
                dataKey="date"
                tick={chartTheme.axis.tick}
                tickCount={chartTheme.axis.tickCount}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={chartTheme.axis.tick} tickCount={chartTheme.axis.tickCount} />
              <Tooltip
                contentStyle={chartTheme.tooltip.contentStyle}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number | undefined) => [value != null ? `$${value.toFixed(0)}` : "", "Avg Cost"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartTheme.colors.primary}
                strokeWidth={chartTheme.line.strokeWidth}
                dot={chartTheme.line.dot}
                activeDot={chartTheme.line.activeDot}
              />
            </LineChart>
          </ResponsiveContainer>
        </InsightCard>
        </div>
        <div className="lg:col-span-3">
        <InsightCard title="Estimated vs actual hours (rolling 30 days)" href={routes.owner.dashboard.estimateAccuracy}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={estimateAccuracyData}>
              <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} strokeOpacity={chartTheme.grid.strokeOpacity} />
              <XAxis
                dataKey="date"
                tick={chartTheme.axis.tick}
                tickCount={chartTheme.axis.tickCount}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={chartTheme.axis.tick} tickCount={chartTheme.axis.tickCount} />
              <Tooltip
                contentStyle={chartTheme.tooltip.contentStyle}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number | undefined, name?: string) => {
                  if (value == null) return ["", ""];
                  if (name === "variancePct") {
                    return [`${value.toFixed(1)}%`, "Variance"];
                  }
                  return [`${value.toFixed(1)} hrs`, name === "estimatedHours" ? "Estimated" : "Actual"];
                }}
              />
              <Bar dataKey="estimatedHours" fill={chartTheme.colors.secondary} name="Estimated" radius={chartTheme.bar.radius} />
              <Bar dataKey="actualHours" fill={chartTheme.colors.primary} name="Actual" radius={chartTheme.bar.radius} />
            </BarChart>
          </ResponsiveContainer>
        </InsightCard>
        </div>
        <div className="lg:col-span-3">
        <RevenuePerLabourHourCard
          rplh={rplh}
          delta={rplhDelta}
          trend={rplhTrend}
          href={routes.owner.dashboard.revenuePerLabourHour}
        />
        </div>
      </div>
      </section>

      {/* Section: Operational Risks */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Operational Risks
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="default" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-fc-brand">Top Overrunning Jobs</h2>
            <Link href="/app/jobs?filter=overrun" className="text-xs font-medium text-fc-accent transition-opacity duration-fc hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead align="right">Overrun</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topOverrunningJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-sm text-fc-muted">
                      No overrunning jobs
                    </TableCell>
                  </TableRow>
                ) : (
                  topOverrunningJobs.map((job) => (
                    <TableRow key={job.jobId}>
                      <TableCell>
                        <Link href={`/app/jobs/${job.jobId}`} className="font-medium text-fc-brand hover:underline">
                          {job.jobName}
                        </Link>
                        {job.customerName && <p className="text-xs text-fc-muted">{job.customerName}</p>}
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-medium text-fc-danger">+{job.overrunHours.toFixed(1)}h</span>
                        <p className="text-xs text-fc-muted">${job.overrunCost.toFixed(0)}</p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-fc-brand">Top Overtime Workers</h2>
            <Link href="/app/workers?filter=overtime" className="text-xs font-medium text-fc-accent transition-opacity duration-fc hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead align="right">OT Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topOvertimeWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-sm text-fc-muted">
                      No overtime this period
                    </TableCell>
                  </TableRow>
                ) : (
                  topOvertimeWorkers.map((worker) => (
                    <TableRow key={worker.workerId}>
                      <TableCell>
                        <Link href={`/app/workers/${worker.workerId}`} className="font-medium text-fc-brand hover:underline">
                          {worker.workerName}
                        </Link>
                        <p className="text-xs text-fc-muted">{worker.otHours.toFixed(1)} OT hrs</p>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-medium text-fc-brand">${worker.otCost.toFixed(0)}</span>
                        <p className="text-xs text-fc-muted">{worker.totalHours.toFixed(1)}h total</p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-fc-brand">Lowest Margin Job Types</h2>
            <Link href="/app/job-types?sort=margin_asc" className="text-xs font-medium text-fc-accent transition-opacity duration-fc hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead align="right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowestMarginJobTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-sm text-fc-muted">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  lowestMarginJobTypes.map((type) => (
                    <TableRow key={type.jobTypeId}>
                      <TableCell>
                        <Link href={`/app/job-types/${type.jobTypeId}`} className="font-medium text-fc-brand hover:underline">
                          {type.jobTypeName}
                        </Link>
                        <p className="text-xs text-fc-muted">{type.jobsCount} jobs</p>
                      </TableCell>
                      <TableCell align="right">
                        <span className={`font-medium ${type.marginPct < 30 ? "text-fc-danger" : "text-fc-brand"}`}>
                          {type.marginPct.toFixed(1)}%
                        </span>
                        <p className="text-xs text-fc-muted">${type.revenue.toFixed(0)} rev</p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        </div>
      </section>
    </div>
  );
}
