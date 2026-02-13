/**
 * Profit-focused analytics computations for FieldCrew dashboard.
 * All functions are pure and work with mock data, ready to be replaced with API calls.
 */

import type { Job, Worker, TimeEntry, JobType } from "./entities";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface WeeklyMetrics {
  revenue: number;
  labourCost: number;
  labourMarginPct: number;
  overtimeHours: number;
  overtimeCost: number;
  overtimePctOfPayroll: number;
  overBudgetJobs: number;
  totalOverrunHours: number;
  estimatedCostOverrun: number;
}

export interface OverrunningJob {
  jobId: string;
  jobName: string;
  customerName?: string;
  estimatedHours: number;
  actualHours: number;
  overrunHours: number;
  overrunCost: number;
  status: string;
}

export interface OvertimeWorker {
  workerId: string;
  workerName: string;
  role: string;
  otHours: number;
  otCost: number;
  totalHours: number;
  jobsAssigned: number;
}

export interface JobTypeMargin {
  jobTypeId: string;
  jobTypeName: string;
  jobsCount: number;
  revenue: number;
  labourCost: number;
  marginPct: number;
}

export interface TimeAllocation {
  billable: number;
  travel: number;
  admin: number;
  idle: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface EstimateAccuracyPoint {
  date: string;
  estimatedHours: number;
  actualHours: number;
  variancePct: number;
}

/**
 * Get start and end of current week (Monday to Sunday)
 */
export function getCurrentWeekRange(): DateRange {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

/**
 * Get start and end of last week
 */
export function getLastWeekRange(): DateRange {
  const currentWeek = getCurrentWeekRange();
  const lastWeekStart = new Date(currentWeek.start);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(currentWeek.end);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
  return { start: lastWeekStart, end: lastWeekEnd };
}

/**
 * Get date range for last N days
 */
export function getLastNDaysRange(days: number): DateRange {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

/**
 * Parse a date string (YYYY-MM-DD) to a Date object at local midnight
 */
function parseDateString(dateStr: string): Date {
  // If it's already a Date object, return it
  if (dateStr instanceof Date) return dateStr;
  // Parse YYYY-MM-DD format and create date at local midnight
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Check if a date falls within a range
 */
function isDateInRange(date: Date, range: DateRange): boolean {
  // Normalize dates to start of day for comparison
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const rangeStart = new Date(range.start);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(range.end);
  rangeEnd.setHours(23, 59, 59, 999);
  return dateStart >= rangeStart && dateStart <= rangeEnd;
}

/**
 * Calculate hours from a time entry
 */
function getHoursFromEntry(entry: TimeEntry): number {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const hours = (end - start) / 3600000 - (entry.breaks ?? 0) / 60;
  return Math.max(0, hours);
}

/**
 * Calculate weekly revenue from jobs
 */
export function calculateWeeklyRevenue(jobs: Job[], range: DateRange): number {
  return jobs
    .filter((job) => {
      // For multi-day jobs, check if the startDate falls within range
      // For single-day jobs, check if the date falls within range
      const jobDate = job.date ? parseDateString(job.date) : job.startDate ? parseDateString(job.startDate) : null;
      if (!jobDate || !job.revenue) return false;
      return isDateInRange(jobDate, range);
    })
    .reduce((sum, job) => sum + (job.revenue ?? 0), 0);
}

/**
 * Calculate weekly labour cost from time entries
 */
export function calculateWeeklyLabourCost(
  timeEntries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): number {
  let totalCost = 0;
  const workerMap = new Map(workers.map((w) => [w.id, w]));

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isDateInRange(entryDate, range)) continue;

    const worker = workerMap.get(entry.workerId);
    if (!worker) continue;

    const hours = getHoursFromEntry(entry);
    const hourlyRate = worker.hourlyRate;
    const multiplier = entry.isOvertime ? 1.5 : 1.0;
    totalCost += hours * hourlyRate * multiplier;
  }

  return totalCost;
}

/**
 * Calculate overtime metrics
 */
export function calculateOvertime(
  timeEntries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): { hours: number; cost: number; pctOfPayroll: number } {
  let otHours = 0;
  let otCost = 0;
  let totalPayroll = 0;
  const workerMap = new Map(workers.map((w) => [w.id, w]));

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isDateInRange(entryDate, range)) continue;

    const worker = workerMap.get(entry.workerId);
    if (!worker) continue;

    const hours = getHoursFromEntry(entry);
    const hourlyRate = worker.hourlyRate;

    if (entry.isOvertime) {
      otHours += hours;
      otCost += hours * hourlyRate * 1.5; // Full overtime cost (1.5x rate)
    }
    totalPayroll += hours * hourlyRate * (entry.isOvertime ? 1.5 : 1.0);
  }

  const pctOfPayroll = totalPayroll > 0 ? (otCost / totalPayroll) * 100 : 0;

  return { hours: otHours, cost: otCost, pctOfPayroll };
}

/**
 * Calculate blended hourly rate from workers
 */
export function calculateBlendedHourlyRate(workers: Worker[]): number {
  if (workers.length === 0) return 0;
  const sum = workers.reduce((acc, w) => acc + w.hourlyRate, 0);
  return sum / workers.length;
}

/**
 * Calculate overrunning jobs
 */
export function calculateOverruns(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  blendedHourlyRate: number,
  range: DateRange
): {
  count: number;
  totalOverrunHours: number;
  estimatedCostOverrun: number;
  jobs: OverrunningJob[];
} {
  const overrunningJobs: OverrunningJob[] = [];
  let totalOverrunHours = 0;

  for (const job of jobs) {
    const jobDate = job.date ? parseDateString(job.date) : job.startDate ? parseDateString(job.startDate) : null;
    if (!jobDate || !isDateInRange(jobDate, range)) continue;

    const estimatedHours = job.hoursExpected ?? job.hoursPerDay ?? 0;
    if (estimatedHours === 0) continue;

    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    const actualHours = jobEntries.reduce((sum, e) => sum + getHoursFromEntry(e), 0);

    if (actualHours > estimatedHours) {
      const overrunHours = actualHours - estimatedHours;
      totalOverrunHours += overrunHours;
      const overrunCost = overrunHours * blendedHourlyRate;

      overrunningJobs.push({
        jobId: job.id,
        jobName: job.name,
        customerName: job.customerName,
        estimatedHours,
        actualHours,
        overrunHours,
        overrunCost,
        status: job.status ?? "in_progress",
      });
    }
  }

  const estimatedCostOverrun = totalOverrunHours * blendedHourlyRate;

  return {
    count: overrunningJobs.length,
    totalOverrunHours,
    estimatedCostOverrun,
    jobs: overrunningJobs.sort((a, b) => b.overrunCost - a.overrunCost),
  };
}

/**
 * Calculate average labour cost per job (rolling period)
 */
export function calculateAvgLabourCostPerJob(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): ChartDataPoint[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const dailyData = new Map<string, { jobs: number; cost: number }>();

  // Group by day
  for (const job of jobs) {
    const jobDate = job.date ? parseDateString(job.date) : job.startDate ? parseDateString(job.startDate) : null;
    if (!jobDate || !isDateInRange(jobDate, range)) continue;

    const dateKey = jobDate.toISOString().split("T")[0];
    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    const jobCost = jobEntries.reduce((sum, entry) => {
      const worker = workerMap.get(entry.workerId);
      if (!worker) return sum;
      const hours = getHoursFromEntry(entry);
      const multiplier = entry.isOvertime ? 1.5 : 1.0;
      return sum + hours * worker.hourlyRate * multiplier;
    }, 0);

    const existing = dailyData.get(dateKey) ?? { jobs: 0, cost: 0 };
    dailyData.set(dateKey, {
      jobs: existing.jobs + 1,
      cost: existing.cost + jobCost,
    });
  }

  // Convert to chart data points
  const points: ChartDataPoint[] = [];
  for (const [date, data] of dailyData.entries()) {
    points.push({
      date,
      value: data.jobs > 0 ? data.cost / data.jobs : 0,
    });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate estimate accuracy (estimated vs actual hours)
 */
export function calculateEstimateAccuracy(
  jobs: Job[],
  timeEntries: TimeEntry[],
  range: DateRange
): EstimateAccuracyPoint[] {
  const dailyData = new Map<string, { estimated: number; actual: number }>();

  for (const job of jobs) {
    const jobDate = job.date ? parseDateString(job.date) : job.startDate ? parseDateString(job.startDate) : null;
    if (!jobDate || !isDateInRange(jobDate, range)) continue;

    const dateKey = jobDate.toISOString().split("T")[0];
    const estimatedHours = job.hoursExpected ?? job.hoursPerDay ?? 0;
    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    const actualHours = jobEntries.reduce((sum, e) => sum + getHoursFromEntry(e), 0);

    const existing = dailyData.get(dateKey) ?? { estimated: 0, actual: 0 };
    dailyData.set(dateKey, {
      estimated: existing.estimated + estimatedHours,
      actual: existing.actual + actualHours,
    });
  }

  const points: EstimateAccuracyPoint[] = [];
  for (const [date, data] of dailyData.entries()) {
    const variancePct = data.estimated > 0 ? ((data.actual - data.estimated) / data.estimated) * 100 : 0;
    points.push({
      date,
      estimatedHours: data.estimated,
      actualHours: data.actual,
      variancePct,
    });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate time allocation breakdown
 */
export function calculateTimeAllocation(
  timeEntries: TimeEntry[],
  range: DateRange
): TimeAllocation {
  const allocation: TimeAllocation = {
    billable: 0,
    travel: 0,
    admin: 0,
    idle: 0,
  };

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isDateInRange(entryDate, range)) continue;

    const hours = getHoursFromEntry(entry);
    const category = entry.category ?? "billable";
    allocation[category] = (allocation[category] ?? 0) + hours;
  }

  return allocation;
}

/**
 * Get top overtime workers
 */
export function getTopOvertimeWorkers(
  timeEntries: TimeEntry[],
  workers: Worker[],
  jobs: Job[],
  range: DateRange
): OvertimeWorker[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const workerStats = new Map<
    string,
    { otHours: number; otCost: number; totalHours: number; jobIds: Set<string> }
  >();

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isDateInRange(entryDate, range)) continue;

    const worker = workerMap.get(entry.workerId);
    if (!worker) continue;

    const hours = getHoursFromEntry(entry);
    const stats = workerStats.get(entry.workerId) ?? {
      otHours: 0,
      otCost: 0,
      totalHours: 0,
      jobIds: new Set(),
    };

    stats.totalHours += hours;
    stats.jobIds.add(entry.jobId);

    if (entry.isOvertime) {
      stats.otHours += hours;
      stats.otCost += hours * worker.hourlyRate * 1.5; // Full overtime cost
    }

    workerStats.set(entry.workerId, stats);
  }

  const result: OvertimeWorker[] = [];
  for (const [workerId, stats] of workerStats.entries()) {
    if (stats.otHours === 0) continue;

    const worker = workerMap.get(workerId);
    if (!worker) continue;

    result.push({
      workerId,
      workerName: worker.name,
      role: "Technician", // TODO: Add role to Worker entity
      otHours: stats.otHours,
      otCost: stats.otCost,
      totalHours: stats.totalHours,
      jobsAssigned: stats.jobIds.size,
    });
  }

  return result.sort((a, b) => b.otCost - a.otCost);
}

/**
 * Get lowest margin job types
 */
export function getLowestMarginJobTypes(
  jobs: Job[],
  jobTypes: JobType[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): JobTypeMargin[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const typeMap = new Map(jobTypes.map((t) => [t.id, t]));
  const typeStats = new Map<string, { jobs: number; revenue: number; cost: number }>();

  for (const job of jobs) {
    if (!job.typeId) continue;
    const jobDate = job.date ? new Date(job.date + "T00:00:00") : job.startDate ? new Date(job.startDate + "T00:00:00") : null;
    if (!jobDate || !isDateInRange(jobDate, range)) continue;

    const stats = typeStats.get(job.typeId) ?? { jobs: 0, revenue: 0, cost: 0 };
    stats.jobs += 1;
    stats.revenue += job.revenue ?? 0;

    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    const jobCost = jobEntries.reduce((sum, entry) => {
      const worker = workerMap.get(entry.workerId);
      if (!worker) return sum;
      const hours = getHoursFromEntry(entry);
      const multiplier = entry.isOvertime ? 1.5 : 1.0;
      return sum + hours * worker.hourlyRate * multiplier;
    }, 0);

    stats.cost += jobCost;
    typeStats.set(job.typeId, stats);
  }

  const result: JobTypeMargin[] = [];
  for (const [typeId, stats] of typeStats.entries()) {
    const type = typeMap.get(typeId);
    if (!type) continue;

    const marginPct = stats.revenue > 0 ? ((stats.revenue - stats.cost) / stats.revenue) * 100 : 0;

    result.push({
      jobTypeId: typeId,
      jobTypeName: type.name,
      jobsCount: stats.jobs,
      revenue: stats.revenue,
      labourCost: stats.cost,
      marginPct,
    });
  }

  return result.sort((a, b) => a.marginPct - b.marginPct);
}

/**
 * Calculate recoverable profit estimate
 */
export function calculateRecoverableProfit(
  overtimeCost: number,
  overrunCost: number,
  idleHours: number,
  blendedHourlyRate: number
): number {
  const potentialOvertimeSavings = overtimeCost * 0.2; // 20% reduction potential
  const potentialOverrunSavings = overrunCost * 0.2; // 20% reduction potential
  const potentialIdleSavings = idleHours * blendedHourlyRate * 0.15; // 15% reduction potential
  return potentialOvertimeSavings + potentialOverrunSavings + potentialIdleSavings;
}

/**
 * Revenue per Labour Hour (RPLH) target constant
 */
export const RPLH_TARGET = 175; // USD per hour

export interface RplhMetrics {
  revenue: number;
  labourHours: number;
  rplh: number;
}

export interface RplhTrendPoint {
  label: string;
  rplh: number;
  weekStart: Date;
  weekEnd: Date;
}

export interface RplhDelta {
  thisWeek: number;
  lastWeek: number;
  deltaPct: number;
}

/**
 * Calculate Revenue per Labour Hour for a given date range
 */
export function calculateRevenuePerLabourHour(
  jobs: Job[],
  timeEntries: TimeEntry[],
  range: DateRange
): RplhMetrics {
  // Calculate total revenue from jobs in range
  const revenue = jobs
    .filter((job) => {
      const jobDate = job.date ? parseDateString(job.date) : job.startDate ? parseDateString(job.startDate) : null;
      return jobDate && isDateInRange(jobDate, range) && job.revenue;
    })
    .reduce((sum, job) => sum + (job.revenue ?? 0), 0);

  // Calculate total labour hours from time entries in range
  let labourHours = 0;
  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isDateInRange(entryDate, range)) continue;
    labourHours += getHoursFromEntry(entry);
  }

  const rplh = labourHours > 0 ? revenue / labourHours : 0;

  return { revenue, labourHours, rplh };
}

/**
 * Calculate RPLH trend over last N weeks
 */
export function calculateRplhTrend(
  jobs: Job[],
  timeEntries: TimeEntry[],
  weeks: number = 6
): RplhTrendPoint[] {
  const points: RplhTrendPoint[] = [];
  const currentWeek = getCurrentWeekRange();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(currentWeek.start);
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekRange: DateRange = { start: weekStart, end: weekEnd };
    const metrics = calculateRevenuePerLabourHour(jobs, timeEntries, weekRange);

    // Only include weeks with data
    if (metrics.labourHours > 0) {
      points.push({
        label: `Wk ${weeks - i}`,
        rplh: metrics.rplh,
        weekStart,
        weekEnd,
      });
    }
  }

  return points;
}

/**
 * Calculate RPLH delta vs last week
 */
export function calculateRplhDeltaVsLastWeek(
  jobs: Job[],
  timeEntries: TimeEntry[]
): RplhDelta {
  const thisWeekRange = getCurrentWeekRange();
  const lastWeekRange = getLastWeekRange();

  const thisWeekMetrics = calculateRevenuePerLabourHour(jobs, timeEntries, thisWeekRange);
  const lastWeekMetrics = calculateRevenuePerLabourHour(jobs, timeEntries, lastWeekRange);

  const thisWeek = thisWeekMetrics.rplh;
  const lastWeek = lastWeekMetrics.rplh;
  const deltaPct = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

  return { thisWeek, lastWeek, deltaPct };
}
