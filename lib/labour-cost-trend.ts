/**
 * Labour Cost per Job Trend analytics: trend points, KPIs, breakdowns, anomalies.
 * Pure functions over jobs, workers, timeEntries, jobTypes. Used by API route and page.
 */

import { getLastNDaysRange } from "./analytics";
import type { DateRange } from "./analytics";
import type { Job, Worker, TimeEntry, JobType } from "./entities";
import type {
  TrendPoint,
  KPIBlock,
  BreakdownRowJobType,
  BreakdownRowTechnician,
  BreakdownRowEstimateVsActual,
  Anomaly,
  LabourCostTrendPayload,
} from "./labour-cost-trend-types";

const OT_MULTIPLIER = 1.5;

function parseDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

function isInRange(date: Date, range: DateRange): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(range.start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(range.end);
  e.setHours(23, 59, 59, 999);
  return d >= s && d <= e;
}

function hoursFromEntry(entry: TimeEntry): number {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const h = (end - start) / 3600000 - (entry.breaks ?? 0) / 60;
  return Math.max(0, h);
}

function labourCostForEntry(entry: TimeEntry, worker: Worker): number {
  const h = hoursFromEntry(entry);
  const mult = entry.isOvertime ? OT_MULTIPLIER : 1;
  return h * worker.hourlyRate * mult;
}

/** Week start (Monday) for a date */
function weekStart(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Month start for a date */
function monthStart(d: Date): Date {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Build week or month buckets for the last rangeDays */
function buildPeriods(
  rangeDays: number,
  granularity: "week" | "month"
): { periodStart: Date; periodEnd: Date }[] {
  const range = getLastNDaysRange(rangeDays);
  const periods: { periodStart: Date; periodEnd: Date }[] = [];
  const bucketStart = granularity === "week" ? weekStart : monthStart;

  const cursor = new Date(range.start);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= range.end) {
    const start = bucketStart(new Date(cursor));
    const end = new Date(start);
    if (granularity === "week") {
      end.setDate(end.getDate() + 6);
    } else {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    end.setHours(23, 59, 59, 999);

    if (start >= range.start && end <= range.end) {
      periods.push({ periodStart: start, periodEnd: end });
    }
    if (granularity === "week") {
      cursor.setDate(cursor.getDate() + 7);
    } else {
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    }
  }

  return periods;
}

/** Aggregate jobs + time entries for a date range into one TrendPoint */
function aggregatePeriod(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): TrendPoint {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  let totalLabourCost = 0;
  let totalOvertimeCost = 0;
  let totalOvertimeHours = 0;
  let totalActualHours = 0;
  const jobIds = new Set<string>();

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isInRange(entryDate, range)) continue;

    const worker = workerMap.get(entry.workerId);
    if (!worker) continue;

    const h = hoursFromEntry(entry);
    const cost = labourCostForEntry(entry, worker);
    totalLabourCost += cost;
    totalActualHours += h;
    if (entry.isOvertime) {
      totalOvertimeHours += h;
      totalOvertimeCost += h * worker.hourlyRate * OT_MULTIPLIER;
    }
    jobIds.add(entry.jobId);
  }

  const jobsInRange = jobs.filter((j) => {
    const jobDate = j.date ? parseDate(j.date) : j.startDate ? parseDate(j.startDate) : null;
    return jobDate && isInRange(jobDate, range);
  });
  const jobsCount = jobsInRange.length || jobIds.size || 1;
  const avgLabourCostPerJob = jobsCount > 0 ? totalLabourCost / jobsCount : 0;
  const avgActualHoursPerJob = jobsCount > 0 ? totalActualHours / jobsCount : 0;

  return {
    periodStart: toISODate(range.start),
    periodEnd: toISODate(range.end),
    totalLabourCost,
    jobsCount,
    avgLabourCostPerJob,
    overtimeCost: totalOvertimeCost,
    overtimeHours: totalOvertimeHours,
    avgActualHoursPerJob,
  };
}

function deltaPct(prev: number, curr: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

/** Build trend array and current/previous period for KPIs */
function buildTrendAndPeriods(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  rangeDays: number,
  granularity: "week" | "month"
): {
  trend: TrendPoint[];
  current: TrendPoint | null;
  previous: TrendPoint | null;
} {
  const periods = buildPeriods(rangeDays, granularity);
  const trend: TrendPoint[] = [];

  for (const { periodStart, periodEnd } of periods) {
    const range: DateRange = { start: periodStart, end: periodEnd };
    trend.push(aggregatePeriod(jobs, timeEntries, workers, range));
  }

  const current = trend.length > 0 ? trend[trend.length - 1]! : null;
  const previous = trend.length > 1 ? trend[trend.length - 2]! : null;

  return { trend, current, previous };
}

/** KPI block for current period with deltas vs previous */
function buildKpis(
  current: TrendPoint | null,
  previous: TrendPoint | null
): KPIBlock {
  const c = current ?? {
    avgLabourCostPerJob: 0,
    jobsCount: 0,
    overtimeCost: 0,
    overtimeHours: 0,
    totalLabourCost: 0,
    periodStart: "",
    periodEnd: "",
  };
  const p = previous ?? {
    avgLabourCostPerJob: 0,
    jobsCount: 0,
    overtimeCost: 0,
    overtimeHours: 0,
    totalLabourCost: 0,
    periodStart: "",
    periodEnd: "",
  };

  const totalLabour = c.totalLabourCost ?? 0;
  const otCost = c.overtimeCost ?? 0;
  const otPct = totalLabour > 0 ? (otCost / totalLabour) * 100 : 0;
  const prevOtPct =
    (p.totalLabourCost ?? 0) > 0
      ? ((p.overtimeCost ?? 0) / p.totalLabourCost!) * 100
      : 0;

  return {
    avgLabourCostPerJob: {
      value: c.avgLabourCostPerJob,
      deltaPct: deltaPct(p.avgLabourCostPerJob, c.avgLabourCostPerJob),
      deltaAbs: c.avgLabourCostPerJob - p.avgLabourCostPerJob,
    },
    jobsCount: {
      value: c.jobsCount,
      deltaPct: deltaPct(p.jobsCount, c.jobsCount),
    },
    overtimeCost: {
      value: otCost,
      deltaPct: deltaPct(p.overtimeCost ?? 0, otCost),
    },
    overtimePctOfLabour: {
      value: otPct,
      deltaPct: deltaPct(prevOtPct, otPct),
    },
    avgActualHoursPerJob: {
      value: c.avgActualHoursPerJob ?? 0,
      deltaPct: deltaPct(p.avgActualHoursPerJob ?? 0, c.avgActualHoursPerJob ?? 0),
    },
  };
}

/** Breakdown by job type (typeId -> name from jobTypes; "Unspecified" if no typeId) */
function buildByJobType(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  jobTypes: JobType[],
  currentRange: DateRange,
  previousRange: DateRange
): BreakdownRowJobType[] {
  const typeMap = new Map(jobTypes.map((t) => [t.id, t.name]));
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const blendedRate =
    workers.length > 0
      ? workers.reduce((s, w) => s + w.hourlyRate, 0) / workers.length
      : 0;

  const byType = new Map<
    string,
    {
      cost: number;
      jobs: number;
      otHours: number;
      estHours: number;
      actualHours: number;
    }
  >();

  for (const job of jobs) {
    const jobDate = job.date ? parseDate(job.date) : job.startDate ? parseDate(job.startDate) : null;
    if (!jobDate || !isInRange(jobDate, currentRange)) continue;

    const typeKey = job.typeId ?? "__unspecified__";

    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    let cost = 0;
    let actualHours = 0;
    let otHours = 0;
    for (const e of jobEntries) {
      const w = workerMap.get(e.workerId);
      if (!w) continue;
      const h = hoursFromEntry(e);
      cost += labourCostForEntry(e, w);
      actualHours += h;
      if (e.isOvertime) otHours += h;
    }
    const estHours = job.hoursExpected ?? job.hoursPerDay ?? 0;

    const row = byType.get(typeKey) ?? {
      cost: 0,
      jobs: 0,
      otHours: 0,
      estHours: 0,
      actualHours: 0,
    };
    row.cost += cost;
    row.jobs += 1;
    row.otHours += otHours;
    row.estHours += estHours;
    row.actualHours += actualHours;
    byType.set(typeKey, row);
  }

  const prevByType = new Map<string, { cost: number; jobs: number }>();
  for (const job of jobs) {
    const jobDate = job.date ? parseDate(job.date) : job.startDate ? parseDate(job.startDate) : null;
    if (!jobDate || !isInRange(jobDate, previousRange)) continue;
    const typeKey = job.typeId ?? "__unspecified__";
    const jobEntries = timeEntries.filter((e) => e.jobId === job.id);
    const cost = jobEntries.reduce((s, e) => {
      const w = workerMap.get(e.workerId);
      return w ? s + labourCostForEntry(e, w) : s;
    }, 0);
    const row = prevByType.get(typeKey) ?? { cost: 0, jobs: 0 };
    row.cost += cost;
    row.jobs += 1;
    prevByType.set(typeKey, row);
  }

  const result: BreakdownRowJobType[] = [];
  for (const [typeKey, row] of byType.entries()) {
    const jobTypeName = typeKey === "__unspecified__" ? "Unspecified" : typeMap.get(typeKey) ?? "Unknown";
    const avg = row.jobs > 0 ? row.cost / row.jobs : 0;
    const prev = prevByType.get(typeKey);
    const prevAvg = prev && prev.jobs > 0 ? prev.cost / prev.jobs : avg;
    const varianceHours = row.actualHours - row.estHours;
    const impactCost = varianceHours > 0 ? varianceHours * blendedRate : 0;

    result.push({
      jobType: jobTypeName,
      avgLabourCostPerJob: avg,
      deltaPct: deltaPct(prevAvg, avg),
      jobsCount: row.jobs,
      overtimeHours: row.otHours,
      estVsActualHoursVariance: varianceHours,
      impactCost,
    });
  }
  return result.sort((a, b) => b.impactCost - a.impactCost);
}

/** Breakdown by technician */
function buildByTechnician(
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  currentRange: DateRange
): BreakdownRowTechnician[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const blendedRate =
    workers.length > 0
      ? workers.reduce((s, w) => s + w.hourlyRate, 0) / workers.length
      : 0;

  const byTech = new Map<
    string,
    {
      cost: number;
      jobIds: Set<string>;
      otHours: number;
      otCost: number;
      actualHours: number;
    }
  >();

  for (const entry of timeEntries) {
    const entryDate = new Date(entry.start);
    if (!isInRange(entryDate, currentRange)) continue;

    const w = workerMap.get(entry.workerId);
    if (!w) continue;

    const h = hoursFromEntry(entry);
    const cost = labourCostForEntry(entry, w);

    const row = byTech.get(entry.workerId) ?? {
      cost: 0,
      jobIds: new Set<string>(),
      otHours: 0,
      otCost: 0,
      actualHours: 0,
    };
    row.cost += cost;
    row.actualHours += h;
    row.jobIds.add(entry.jobId);
    if (entry.isOvertime) {
      row.otHours += h;
      row.otCost += h * w.hourlyRate * OT_MULTIPLIER;
    }
    byTech.set(entry.workerId, row);
  }

  const result: BreakdownRowTechnician[] = [];
  for (const [workerId, row] of byTech.entries()) {
    const w = workerMap.get(workerId);
    if (!w) continue;
    const jobsCount = row.jobIds.size;
    const avg = jobsCount > 0 ? row.cost / jobsCount : 0;
    const estHours = [...row.jobIds].reduce((s, jid) => {
      const job = jobs.find((j) => j.id === jid);
      return s + (job ? (job.hoursExpected ?? job.hoursPerDay ?? 0) : 0);
    }, 0);
    const varianceHours = row.actualHours - estHours;
    const impactCost = varianceHours > 0 ? varianceHours * blendedRate : 0;

    result.push({
      technicianId: workerId,
      technicianName: w.name,
      avgLabourCostPerJob: avg,
      deltaPct: 0,
      jobsCount,
      overtimeHours: row.otHours,
      overtimeCost: row.otCost,
      estVsActualHoursVariance: varianceHours,
      impactCost,
    });
  }
  return result.sort((a, b) => b.overtimeCost - a.overtimeCost);
}

/** Estimate vs actual by period (reuse trend points for current range) */
function buildEstVsActual(
  trend: TrendPoint[],
  jobs: Job[],
  timeEntries: TimeEntry[],
  workers: Worker[],
  rangeDays: number,
  granularity: "week" | "month"
): BreakdownRowEstimateVsActual[] {
  const periods = buildPeriods(rangeDays, granularity);
  const blendedRate =
    workers.length > 0
      ? workers.reduce((s, w) => s + w.hourlyRate, 0) / workers.length
      : 0;
  const result: BreakdownRowEstimateVsActual[] = [];

  for (let i = 0; i < periods.length; i++) {
    const { periodStart, periodEnd } = periods[i]!;
    const range: DateRange = { start: periodStart, end: periodEnd };
    let estHours = 0;
    let actualHours = 0;
    const periodJobs = jobs.filter((j) => {
      const d = j.date ? parseDate(j.date) : j.startDate ? parseDate(j.startDate) : null;
      return d && isInRange(d, range);
    });
    for (const job of periodJobs) {
      estHours += job.hoursExpected ?? job.hoursPerDay ?? 0;
      const entries = timeEntries.filter((e) => e.jobId === job.id);
      actualHours += entries.reduce((s, e) => s + hoursFromEntry(e), 0);
    }
    const varianceHours = actualHours - estHours;
    const variancePct = estHours > 0 ? (varianceHours / estHours) * 100 : 0;
    const impactCost = varianceHours > 0 ? varianceHours * blendedRate : 0;
    const label =
      granularity === "week"
        ? `Week of ${toISODate(periodStart)}`
        : `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, "0")}`;
    result.push({
      periodLabel: label,
      estHours,
      actualHours,
      varianceHours,
      variancePct,
      impactCost,
    });
  }
  return result;
}

/** Anomalies: baseline = avg of previous 6 periods; flag if |deltaPct| >= 15 or overtime jump >= 10% */
function buildAnomalies(
  trend: TrendPoint[],
  maxCount: number = 5
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const baselinePeriods = 6;

  for (let i = baselinePeriods; i < trend.length; i++) {
    const curr = trend[i]!;
    const prevPeriods = trend.slice(i - baselinePeriods, i);
    const avgCost =
      prevPeriods.reduce((s, p) => s + p.avgLabourCostPerJob, 0) /
      prevPeriods.length;
    const avgOtPct =
      prevPeriods.reduce((s, p) => {
        const tot = p.totalLabourCost ?? 0;
        const ot = p.overtimeCost ?? 0;
        return s + (tot > 0 ? (ot / tot) * 100 : 0);
      }, 0) / prevPeriods.length;
    const currOtPct =
      (curr.totalLabourCost ?? 0) > 0
        ? ((curr.overtimeCost ?? 0) / curr.totalLabourCost!) * 100
        : 0;

    const costDeltaPct = deltaPct(avgCost, curr.avgLabourCostPerJob);
    const otDeltaPct = currOtPct - avgOtPct;

    if (Math.abs(costDeltaPct) >= 15) {
      anomalies.push({
        id: `cost-${curr.periodStart}`,
        label: `${curr.periodStart}: ${costDeltaPct >= 0 ? "+" : ""}${costDeltaPct.toFixed(0)}% vs 6-period avg`,
        periodStart: curr.periodStart,
        periodEnd: curr.periodEnd,
        severity: costDeltaPct > 0 ? "warn" : "info",
        metric: "avgLabourCostPerJob",
        deltaPct: costDeltaPct,
        baseline: avgCost,
        current: curr.avgLabourCostPerJob,
      });
    }
    if (otDeltaPct >= 10) {
      anomalies.push({
        id: `ot-${curr.periodStart}`,
        label: `Overtime ${curr.periodStart}: +${otDeltaPct.toFixed(0)}% of labour vs 6-period avg`,
        periodStart: curr.periodStart,
        periodEnd: curr.periodEnd,
        severity: "warn",
        metric: "overtimePct",
        deltaPct: otDeltaPct,
        baseline: avgOtPct,
        current: currOtPct,
      });
    }
  }

  return anomalies
    .sort((a, b) => b.periodStart.localeCompare(a.periodStart))
    .slice(0, maxCount);
}

/** Profit leakage this period: (avg - target) * jobsCount; if no target, use 90d baseline */
function buildProfitLeakage(
  current: TrendPoint | null,
  trend: TrendPoint[],
  targetLabourCostPerJob: number | undefined,
  byJobType: BreakdownRowJobType[],
  byTech: BreakdownRowTechnician[]
): { value: number; primaryDriver: string; techImpact: string } {
  if (!current || current.jobsCount === 0) {
    return { value: 0, primaryDriver: "No jobs in period.", techImpact: "—" };
  }

  const baseline90 =
    trend.length > 0
      ? trend.reduce((s, p) => s + p.avgLabourCostPerJob, 0) / trend.length
      : current.avgLabourCostPerJob;
  const target = targetLabourCostPerJob ?? baseline90;
  const value = Math.max(
    0,
    (current.avgLabourCostPerJob - target) * current.jobsCount
  );

  const topJobType = byJobType[0];
  const primaryDriver = topJobType
    ? `${topJobType.jobType} driving £${Math.round(topJobType.impactCost).toLocaleString()} variance vs estimate.`
    : "Labour cost in line with baseline.";

  const topTechs = byTech.slice(0, 2);
  const techImpact =
    topTechs.length > 0
      ? topTechs.map((t) => `${t.technicianName} (OT: £${Math.round(t.overtimeCost).toLocaleString()})`).join("; ")
      : "No significant tech impact.";

  return { value, primaryDriver, techImpact };
}

export function buildLabourCostTrendPayload(
  jobs: Job[],
  workers: Worker[],
  timeEntries: TimeEntry[],
  jobTypes: JobType[],
  options: {
    rangeDays: number;
    currency?: string;
    targetLabourCostPerJob?: number;
  }
): LabourCostTrendPayload {
  const rangeDays = options.rangeDays;
  const granularity = rangeDays <= 90 ? "week" : "month";
  const currency = options.currency ?? "GBP";

  const { trend, current, previous } = buildTrendAndPeriods(
    jobs,
    timeEntries,
    workers,
    rangeDays,
    granularity
  );

  const kpis = buildKpis(current, previous);

  const currentRange: DateRange = current
    ? { start: parseDate(current.periodStart), end: parseDate(current.periodEnd) }
    : getLastNDaysRange(Math.min(rangeDays, 7));
  const previousRange: DateRange = previous
    ? { start: parseDate(previous.periodStart), end: parseDate(previous.periodEnd) }
    : getLastNDaysRange(Math.min(rangeDays, 7));

  const byJobType = buildByJobType(
    jobs,
    timeEntries,
    workers,
    jobTypes,
    currentRange,
    previousRange
  );
  const byTechnician = buildByTechnician(
    jobs,
    timeEntries,
    workers,
    currentRange
  );
  const estVsActual = buildEstVsActual(
    trend,
    jobs,
    timeEntries,
    workers,
    rangeDays,
    granularity
  );

  const anomalies = buildAnomalies(trend, 5);
  const profitLeakage = buildProfitLeakage(
    current,
    trend,
    options.targetLabourCostPerJob,
    byJobType,
    byTechnician
  );

  return {
    rangeDays,
    granularity,
    currency,
    targetLabourCostPerJob: options.targetLabourCostPerJob,
    profitLeakage,
    kpis,
    trend,
    breakdown: {
      byJobType,
      byTechnician,
      estVsActual,
    },
    anomalies,
  };
}
