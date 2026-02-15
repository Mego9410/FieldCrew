/**
 * Worker performance analytics for the Worker Performance Profile page.
 * Pure functions: compute KPIs, trend series, flags, and job-level profit view.
 * TODO: Wire to real API; filter entries/jobs by date range server-side when available.
 */

import type { Worker, Job, TimeEntry } from "./entities";

const OT_MULTIPLIER = 1.5;
export const TARGET_RPLH = 175;
export const OT_RISK_HOURS_WEEK = 10;
export const OT_RISK_HOURS_TOTAL = 40;
export const FREQUENT_OVERRUNS_THRESHOLD = 3;

export type PeriodKey = "this_week" | "last_week" | "last_30_days";

export interface DateRange {
  start: Date;
  end: Date;
}

/** Get start/end dates for period (inclusive of full days in local time). */
export function getDateRangeForPeriod(period: PeriodKey): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start: Date;
  let end: Date = new Date(today);
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(end.getMilliseconds() - 1);

  switch (period) {
    case "this_week": {
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start = new Date(today);
      start.setDate(today.getDate() + mondayOffset);
      break;
    }
    case "last_week": {
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      end = new Date(today);
      end.setDate(today.getDate() + mondayOffset - 1);
      end.setHours(23, 59, 59, 999);
      start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "last_30_days":
    default: {
      start = new Date(today);
      start.setDate(today.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      break;
    }
  }
  if (period === "this_week" || period === "last_30_days") {
    start.setHours(0, 0, 0, 0);
  }
  return { start, end };
}

function hoursFromEntry(entry: TimeEntry): number {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const hours = (end - start) / 3600000 - (entry.breaks ?? 0) / 60;
  return Math.max(0, hours);
}

function getJobEstimatedHours(job: Job): number {
  const isMultiDay =
    job.startDate != null && job.endDate != null && job.hoursPerDay != null;
  if (isMultiDay) {
    const start = new Date(job.startDate!).getTime();
    const end = new Date(job.endDate!).getTime();
    const days = Math.max(
      1,
      Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1
    );
    return (job.hoursPerDay ?? 0) * days;
  }
  return job.hoursExpected ?? 0;
}

export function filterEntriesInRange(
  entries: TimeEntry[],
  range: DateRange
): TimeEntry[] {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime() + 1;
  return entries.filter((e) => {
    const t = new Date(e.start).getTime();
    return t >= startMs && t < endMs;
  });
}

// ─── Snapshot (KPIs) ───────────────────────────────────────────────────────

export interface WorkerPerformanceSnapshot {
  totalHours: number;
  overtimeHours: number;
  regularHours: number;
  labourCost: number;
  /** Full job revenue for jobs this worker logged time on. TODO: allocate proportionally by share of labour hours per job. */
  revenueGenerated: number;
  revenuePerLabourHour: number;
  blendedRate: number;
  avgVarianceHoursPerJob: number;
  avgVariancePctPerJob: number | null;
  jobsWithVarianceCount: number;
}

export function getWorkerPerformanceSnapshot(
  worker: Worker,
  entries: TimeEntry[],
  jobs: Job[],
  range: DateRange
): WorkerPerformanceSnapshot {
  const filtered = filterEntriesInRange(entries, range);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  const rate = worker.hourlyRate ?? 0;

  let totalHours = 0;
  let overtimeHours = 0;
  let labourCost = 0;
  const jobIdsWithTime = new Set<string>();
  const jobActualHours = new Map<string, number>();

  for (const e of filtered) {
    const hrs = hoursFromEntry(e);
    if (hrs <= 0) continue;
    totalHours += hrs;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    labourCost += hrs * rate * mult;
    if (e.isOvertime) overtimeHours += hrs;
    jobIdsWithTime.add(e.jobId);
    jobActualHours.set(e.jobId, (jobActualHours.get(e.jobId) ?? 0) + hrs);
  }

  const regularHours = totalHours - overtimeHours;
  const blendedRate = totalHours > 0 ? labourCost / totalHours : rate;

  // Revenue: for now attribute full job revenue for each job worker logged time on.
  // TODO: allocate revenue proportionally by share of labour hours per job.
  let revenueGenerated = 0;
  for (const jid of jobIdsWithTime) {
    const job = jobMap.get(jid);
    if (job?.revenue != null) revenueGenerated += job.revenue;
  }
  const revenuePerLabourHour =
    totalHours > 0 ? revenueGenerated / totalHours : 0;

  // Variance: per-job (estimated vs actual for this worker only).
  let sumVarianceHours = 0;
  let sumVariancePct = 0;
  let variancePctCount = 0;
  for (const [jid, actualHrs] of jobActualHours) {
    const job = jobMap.get(jid);
    if (!job) continue;
    const estimated = getJobEstimatedHours(job);
    const varianceHrs = actualHrs - estimated;
    sumVarianceHours += varianceHrs;
    if (estimated > 0) {
      sumVariancePct += (varianceHrs / estimated) * 100;
      variancePctCount++;
    }
  }
  const jobCount = jobActualHours.size;
  const avgVarianceHoursPerJob =
    jobCount > 0 ? sumVarianceHours / jobCount : 0;
  const avgVariancePctPerJob =
    variancePctCount > 0 ? sumVariancePct / variancePctCount : null;
  const jobsWithVarianceCount = [...jobActualHours.entries()].filter(
    ([jid, actual]) => {
      const job = jobMap.get(jid);
      if (!job) return false;
      return actual > getJobEstimatedHours(job);
    }
  ).length;

  return {
    totalHours,
    overtimeHours,
    regularHours,
    labourCost,
    revenueGenerated,
    revenuePerLabourHour,
    blendedRate,
    avgVarianceHoursPerJob,
    avgVariancePctPerJob,
    jobsWithVarianceCount,
  };
}

// ─── Trend series (charts) ─────────────────────────────────────────────────

export interface RplhTrendPoint {
  bucket: string;
  label: string;
  revenuePerLabourHour: number;
  revenue: number;
  hours: number;
}

export interface HoursBreakdownPoint {
  bucket: string;
  label: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  labourCost: number;
}

/** Total worker hours per job (for proportional revenue attribution). */
function getWorkerHoursPerJob(entries: TimeEntry[], workerId: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) {
    if (e.workerId !== workerId) continue;
    const hrs = hoursFromEntry(e);
    m.set(e.jobId, (m.get(e.jobId) ?? 0) + hrs);
  }
  return m;
}

/** Build weekly buckets for last 30 days, daily for this week. Revenue attributed proportionally by share of worker hours in bucket. */
export function getWorkerRplhTrend(
  entries: TimeEntry[],
  jobs: Job[],
  workerId: string,
  range: DateRange,
  period: PeriodKey
): RplhTrendPoint[] {
  const filtered = filterEntriesInRange(entries, range);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  const workerHoursPerJob = getWorkerHoursPerJob(filtered, workerId);

  const bucketSizeMs =
    period === "this_week"
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;
  const startMs = range.start.getTime();
  const points: RplhTrendPoint[] = [];
  let t = startMs;
  while (t <= range.end.getTime()) {
    const bucketEnd = t + bucketSizeMs;
    let hours = 0;
    let revenue = 0;
    const jobHoursInBucket = new Map<string, number>();
    for (const e of filtered) {
      if (e.workerId !== workerId) continue;
      const entryStart = new Date(e.start).getTime();
      if (entryStart >= bucketEnd || entryStart < t) continue;
      const hrs = hoursFromEntry(e);
      hours += hrs;
      jobHoursInBucket.set(e.jobId, (jobHoursInBucket.get(e.jobId) ?? 0) + hrs);
    }
    for (const [jid, bucketHrs] of jobHoursInBucket) {
      const job = jobMap.get(jid);
      const totalJobHrs = workerHoursPerJob.get(jid) ?? 1;
      if (job?.revenue != null && totalJobHrs > 0)
        revenue += (job.revenue * bucketHrs) / totalJobHrs;
    }
    const rplh = hours > 0 ? revenue / hours : 0;
    const bucketLabel =
      period === "this_week"
        ? new Date(t).toLocaleDateString("en-US", { weekday: "short" })
        : `Week of ${new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    points.push({
      bucket: new Date(t).toISOString().slice(0, 10),
      label: bucketLabel,
      revenuePerLabourHour: rplh,
      revenue,
      hours,
    });
    t = bucketEnd;
  }
  return points;
}

export function getWorkerHoursBreakdown(
  entries: TimeEntry[],
  worker: Worker,
  range: DateRange,
  period: PeriodKey
): HoursBreakdownPoint[] {
  const filtered = filterEntriesInRange(entries, range);
  const rate = worker.hourlyRate ?? 0;

  const bucketSizeMs =
    period === "this_week"
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;
  const startMs = range.start.getTime();
  const points: HoursBreakdownPoint[] = [];
  let t = startMs;
  while (t <= range.end.getTime()) {
    const bucketEnd = t + bucketSizeMs;
    let regular = 0;
    let overtime = 0;
    for (const e of filtered) {
      if (e.workerId !== worker.id) continue;
      const entryStart = new Date(e.start).getTime();
      if (entryStart >= bucketEnd || entryStart < t) continue;
      const hrs = hoursFromEntry(e);
      if (e.isOvertime) overtime += hrs;
      else regular += hrs;
    }
    const totalHours = regular + overtime;
    const labourCost = regular * rate + overtime * rate * OT_MULTIPLIER;
    const bucketLabel =
      period === "this_week"
        ? new Date(t).toLocaleDateString("en-US", { weekday: "short" })
        : `Week of ${new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    points.push({
      bucket: new Date(t).toISOString().slice(0, 10),
      label: bucketLabel,
      regularHours: regular,
      overtimeHours: overtime,
      totalHours,
      labourCost,
    });
    t = bucketEnd;
  }
  return points;
}

// ─── Flags ─────────────────────────────────────────────────────────────────

export interface WorkerFlag {
  id: string;
  message: string;
  severity: "warning" | "info";
  viewAnchor?: string;
}

export function getWorkerFlags(
  snapshot: WorkerPerformanceSnapshot,
  options?: {
    overtimeHoursWeek?: number;
    overtimeWeeksInRow?: number;
    rplhBelowTargetWeeks?: number;
  }
): WorkerFlag[] {
  const flags: WorkerFlag[] = [];

  if (snapshot.overtimeHours > OT_RISK_HOURS_TOTAL) {
    flags.push({
      id: "overtime_risk",
      message: `Overtime risk: ${snapshot.overtimeHours.toFixed(1)} hrs in period`,
      severity: "warning",
      viewAnchor: "#kpi-hours",
    });
  } else if (options?.overtimeHoursWeek != null && options.overtimeHoursWeek > OT_RISK_HOURS_WEEK) {
    flags.push({
      id: "overtime_risk_week",
      message: `Overtime risk: ${options.overtimeHoursWeek.toFixed(1)} hrs this week`,
      severity: "warning",
      viewAnchor: "#kpi-hours",
    });
  }

  if (snapshot.revenuePerLabourHour > 0 && snapshot.revenuePerLabourHour < TARGET_RPLH) {
    flags.push({
      id: "below_target",
      message: `Revenue per labour hour below target ($${snapshot.revenuePerLabourHour.toFixed(0)}/hr < $${TARGET_RPLH}/hr)`,
      severity: "warning",
      viewAnchor: "#kpi-revenue",
    });
  }

  if (options?.overtimeWeeksInRow != null && options.overtimeWeeksInRow >= 3) {
    flags.push({
      id: "overtime_weeks",
      message: `Overtime 3 weeks in a row`,
      severity: "warning",
      viewAnchor: "#chart-hours",
    });
  }

  if (snapshot.jobsWithVarianceCount > 0) {
    flags.push({
      id: "jobs_over_estimate",
      message: `${snapshot.jobsWithVarianceCount} job(s) over estimate this period`,
      severity: "info",
      viewAnchor: "#jobs-worked",
    });
  }

  if (options?.rplhBelowTargetWeeks != null && options.rplhBelowTargetWeeks >= 2) {
    flags.push({
      id: "rplh_below_weeks",
      message: `RPLH below target for ${options.rplhBelowTargetWeeks} weeks`,
      severity: "warning",
      viewAnchor: "#chart-rplh",
    });
  }

  return flags;
}

// ─── Jobs worked (profit view) ──────────────────────────────────────────────

export type JobWorkedStatusFilter = "all" | "scheduled" | "in_progress" | "completed";
export type JobWorkedSortKey = "lowest_margin" | "highest_overrun" | "most_recent";

export interface JobWorkedRow {
  job: Job;
  address: string;
  dateLabel: string;
  status: string;
  estimatedHrs: number;
  actualHrs: number;
  varianceHrs: number;
  variancePct: number | null;
  revenue: number;
  labourCost: number;
  rplh: number | null;
}

export function getJobsWorkedWithProfit(
  worker: Worker,
  entries: TimeEntry[],
  jobs: Job[]
): JobWorkedRow[] {
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  const rate = worker.hourlyRate ?? 0;
  const rows: JobWorkedRow[] = [];

  const jobIdsWithTime = new Set(entries.filter((e) => e.workerId === worker.id).map((e) => e.jobId));
  const actualHoursByJob = new Map<string, number>();
  const labourCostByJob = new Map<string, number>();

  for (const e of entries) {
    if (e.workerId !== worker.id) continue;
    const hrs = hoursFromEntry(e);
    if (hrs <= 0) continue;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    const cost = hrs * rate * mult;
    actualHoursByJob.set(e.jobId, (actualHoursByJob.get(e.jobId) ?? 0) + hrs);
    labourCostByJob.set(e.jobId, (labourCostByJob.get(e.jobId) ?? 0) + cost);
  }

  for (const jobId of jobIdsWithTime) {
    const job = jobMap.get(jobId);
    if (!job) continue;
    const actualHrs = actualHoursByJob.get(jobId) ?? 0;
    const labourCost = labourCostByJob.get(jobId) ?? 0;
    const estimatedHrs = getJobEstimatedHours(job);
    const varianceHrs = actualHrs - estimatedHrs;
    const variancePct =
      estimatedHrs > 0 ? (varianceHrs / estimatedHrs) * 100 : null;
    const revenue = job.revenue ?? 0;
    const rplh = actualHrs > 0 && revenue > 0 ? revenue / actualHrs : null;

    let dateLabel = "—";
    if (job.startDate) {
      if (job.endDate && job.startDate !== job.endDate) {
        dateLabel = `${new Date(job.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(job.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      } else {
        dateLabel = new Date(job.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } else if (job.date) {
      dateLabel = new Date(job.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    rows.push({
      job,
      address: job.address ?? "—",
      dateLabel,
      status: job.status ?? "scheduled",
      estimatedHrs,
      actualHrs,
      varianceHrs,
      variancePct,
      revenue,
      labourCost,
      rplh,
    });
  }

  return rows;
}

export function filterAndSortJobRows(
  rows: JobWorkedRow[],
  statusFilter: JobWorkedStatusFilter,
  sortKey: JobWorkedSortKey
): JobWorkedRow[] {
  let out = rows.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const margin = (r: JobWorkedRow) =>
    r.revenue > 0 ? ((r.revenue - r.labourCost) / r.revenue) * 100 : 0;
  const overrun = (r: JobWorkedRow) => r.varianceHrs;

  switch (sortKey) {
    case "lowest_margin":
      out = [...out].sort((a, b) => margin(a) - margin(b));
      break;
    case "highest_overrun":
      out = [...out].sort((a, b) => overrun(b) - overrun(a));
      break;
    case "most_recent":
      out = [...out].sort((a, b) => {
        const da = a.job.startDate ?? a.job.date ?? "";
        const db = b.job.startDate ?? b.job.date ?? "";
        return db.localeCompare(da);
      });
      break;
    default:
      break;
  }
  return out;
}
