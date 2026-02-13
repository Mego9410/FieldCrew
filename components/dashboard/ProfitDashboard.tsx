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
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  User,
  ClipboardList,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { KpiCard } from "./KpiCard";
import { InsightCard } from "./InsightCard";
import { RecoveryCallout } from "./RecoveryCallout";
import { RevenuePerLabourHourCard } from "./RevenuePerLabourHourCard";
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
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/mock-storage";

export function ProfitDashboard() {
  const [timeframe, setTimeframe] = useState<"this_week" | "last_week" | "last_30_days">("this_week");
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    revenueThisWeek: number;
    revenueLastWeek: number;
    labourCostThisWeek: number;
    labourCostLastWeek: number;
    labourMarginPct: number;
    marginTrend: number;
    overtime: { hours: number; cost: number; pctOfPayroll: number };
    overtimeTrend: number;
    overruns: { count: number; totalOverrunHours: number; estimatedCostOverrun: number; jobs: any[] };
    overrunTrend: number;
    recoverableProfit: number;
    labourCostPerJobData: any[];
    estimateAccuracyData: any[];
    rplh: number;
    rplhDelta: any;
    rplhTrend: any[];
    topOverrunningJobs: any[];
    topOvertimeWorkers: any[];
    lowestMarginJobTypes: any[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Ensure mock storage is initialized
    if (typeof window !== "undefined") {
      const { initMockStorage } = require("@/lib/mock-storage");
      initMockStorage();
    }
    
    const jobs = getJobs();
    const workers = getWorkers();
    const timeEntries = getTimeEntries();
    const jobTypes = getJobTypes();

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
  }, [timeframe]);

  // Show loading state during SSR and initial client render
  if (!mounted || !dashboardData) {
    return (
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-bold text-fc-brand">Profit Control Centre</h1>
          <p className="mt-1 text-sm text-fc-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const {
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
    rplh,
    rplhDelta,
    rplhTrend,
    topOverrunningJobs,
    topOvertimeWorkers,
    lowestMarginJobTypes,
  } = dashboardData;

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Profit Control Centre</h1>
          <p className="mt-1 text-sm text-fc-muted">
            See where you're losing money this week and what to do next.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-fc-border bg-white p-1">
          <button
            type="button"
            onClick={() => setTimeframe("this_week")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              timeframe === "this_week"
                ? "bg-fc-accent/10 text-fc-accent"
                : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            }`}
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("last_week")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              timeframe === "last_week"
                ? "bg-fc-accent/10 text-fc-accent"
                : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            }`}
          >
            Last week
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("last_30_days")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              timeframe === "last_30_days"
                ? "bg-fc-accent/10 text-fc-accent"
                : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            }`}
          >
            Last 30 days
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Labour Margin"
          primaryValue={`${labourMarginPct.toFixed(1)}%`}
          secondaryValue={`Revenue ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek)} • Labour ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(labourCostThisWeek)}`}
          trend={{ value: marginTrend, label: "last week" }}
          icon={TrendingUp}
          href={routes.owner.dashboard.margin}
          warning={labourMarginPct < 40}
        />
        <KpiCard
          title="Overtime Cost (Live)"
          primaryValue={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(overtime.cost)}
          secondaryValue={`${overtime.hours.toFixed(1)} OT hrs • ${overtime.pctOfPayroll.toFixed(0)}% of payroll`}
          trend={{ value: overtimeTrend, label: "last week" }}
          icon={Clock}
          href={routes.owner.dashboard.overtime}
          warning={overtime.pctOfPayroll > 15}
        />
        <KpiCard
          title="Jobs Over Budget (Live Alerts)"
          primaryValue={`${overruns.count} jobs`}
          secondaryValue={`+${overruns.totalOverrunHours.toFixed(1)} hrs • ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(overruns.estimatedCostOverrun)} est overrun`}
          trend={{ value: overrunTrend, label: "last week" }}
          icon={AlertTriangle}
          href={routes.owner.dashboard.overruns}
          warning={overruns.count > 3}
        />
        <KpiCard
          title="Revenue vs Labour"
          primaryValue={`${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek)} vs ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(labourCostThisWeek)}`}
          secondaryValue={`Gross labour profit ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek - labourCostThisWeek)}`}
          trend={{ value: marginTrend, label: "last week" }}
          icon={DollarSign}
          href={routes.owner.dashboard.revenueLabour}
        />
      </div>

      {/* Recovery Callout */}
      <div className="mb-6">
        <RecoveryCallout recoverableAmount={recoverableProfit} href={routes.owner.dashboard.recovery} />
      </div>

      {/* Row 2: Insight Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InsightCard title="Labour Cost per Job (Rolling 30 Days)" href={routes.owner.dashboard.labourCostTrend}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={labourCostPerJobData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "6px" }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`$${value.toFixed(0)}`, "Avg Cost"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </InsightCard>

        <InsightCard title="Estimated vs Actual Hours (Rolling 30 Days)" href={routes.owner.dashboard.estimateAccuracy}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={estimateAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "6px" }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => {
                  if (name === "variancePct") {
                    return [`${value.toFixed(1)}%`, "Variance"];
                  }
                  return [`${value.toFixed(1)} hrs`, name === "estimatedHours" ? "Estimated" : "Actual"];
                }}
              />
              <Legend />
              <Bar dataKey="estimatedHours" fill="#94a3b8" name="Estimated" />
              <Bar dataKey="actualHours" fill="#6366f1" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </InsightCard>

        <RevenuePerLabourHourCard
          rplh={rplh}
          delta={rplhDelta}
          trend={rplhTrend}
          href={routes.owner.dashboard.revenuePerLabourHour}
        />
      </div>

      {/* Row 3: Actionable Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overrunning Jobs */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fc-brand">Top Overrunning Jobs</h2>
            <Link href="/app/jobs?filter=overrun" className="text-xs font-medium text-fc-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fc-border">
                  <th className="pb-2 text-xs font-semibold text-fc-muted">Job</th>
                  <th className="pb-2 text-xs font-semibold text-fc-muted text-right">Overrun</th>
                </tr>
              </thead>
              <tbody>
                {topOverrunningJobs.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-sm text-fc-muted">
                      No overrunning jobs
                    </td>
                  </tr>
                ) : (
                  topOverrunningJobs.map((job) => (
                    <tr key={job.jobId} className="border-b border-fc-border last:border-0">
                      <td className="py-2.5">
                        <Link href={`/app/jobs/${job.jobId}`} className="font-medium text-fc-brand hover:underline">
                          {job.jobName}
                        </Link>
                        {job.customerName && <p className="text-xs text-fc-muted">{job.customerName}</p>}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="font-medium text-red-600">+{job.overrunHours.toFixed(1)}h</span>
                        <p className="text-xs text-fc-muted">${job.overrunCost.toFixed(0)}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overtime Workers */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fc-brand">Top Overtime Workers</h2>
            <Link href="/app/workers?filter=overtime" className="text-xs font-medium text-fc-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fc-border">
                  <th className="pb-2 text-xs font-semibold text-fc-muted">Worker</th>
                  <th className="pb-2 text-xs font-semibold text-fc-muted text-right">OT Cost</th>
                </tr>
              </thead>
              <tbody>
                {topOvertimeWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-sm text-fc-muted">
                      No overtime this period
                    </td>
                  </tr>
                ) : (
                  topOvertimeWorkers.map((worker) => (
                    <tr key={worker.workerId} className="border-b border-fc-border last:border-0">
                      <td className="py-2.5">
                        <Link href={`/app/workers/${worker.workerId}`} className="font-medium text-fc-brand hover:underline">
                          {worker.workerName}
                        </Link>
                        <p className="text-xs text-fc-muted">{worker.otHours.toFixed(1)} OT hrs</p>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="font-medium text-fc-brand">${worker.otCost.toFixed(0)}</span>
                        <p className="text-xs text-fc-muted">{worker.totalHours.toFixed(1)}h total</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lowest Margin Job Types */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fc-brand">Lowest Margin Job Types</h2>
            <Link href="/app/job-types?sort=margin_asc" className="text-xs font-medium text-fc-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fc-border">
                  <th className="pb-2 text-xs font-semibold text-fc-muted">Type</th>
                  <th className="pb-2 text-xs font-semibold text-fc-muted text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {lowestMarginJobTypes.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-sm text-fc-muted">
                      No data available
                    </td>
                  </tr>
                ) : (
                  lowestMarginJobTypes.map((type) => (
                    <tr key={type.jobTypeId} className="border-b border-fc-border last:border-0">
                      <td className="py-2.5">
                        <Link href={`/app/job-types/${type.jobTypeId}`} className="font-medium text-fc-brand hover:underline">
                          {type.jobTypeName}
                        </Link>
                        <p className="text-xs text-fc-muted">{type.jobsCount} jobs</p>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`font-medium ${type.marginPct < 30 ? "text-red-600" : "text-fc-brand"}`}>
                          {type.marginPct.toFixed(1)}%
                        </span>
                        <p className="text-xs text-fc-muted">${type.revenue.toFixed(0)} rev</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
