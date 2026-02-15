/**
 * Reporting analytics — pure functions for labour cost, overtime, overruns, RPLH.
 * TODO: Replace with API calls when backend is ready.
 */

import type { Job, JobType, TimeEntry, Worker } from "./entities";

const OT_MULTIPLIER = 1.5;
const RPLH_TARGET = 175;
const MARGIN_WARNING_THRESHOLD = 40;
const OT_WARNING_THRESHOLD = 15;

export type DateRangePreset = "this_week" | "last_week" | "last_30_days" | "custom";

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;
}

export interface DateBucket {
  key: string; // YYYY-MM-DD or YYYY-Www
  label: string;
  start: string;
  end: string;
}

export interface ReportingFilters {
  dateRange: DateRange;
  jobTypeId?: string;
  workerId?: string;
  status?: string;
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

function jobDateOverlapsRange(job: Job, range: DateRange): boolean {
  const rangeStart = new Date(range.start).getTime();
  const rangeEnd = new Date(range.end).getTime();
  if (job.date) {
    const d = new Date(job.date).getTime();
    return d >= rangeStart && d <= rangeEnd;
  }
  if (job.startDate && job.endDate) {
    const js = new Date(job.startDate).getTime();
    const je = new Date(job.endDate).getTime();
    return js <= rangeEnd && je >= rangeStart;
  }
  return false;
}

function entryInRange(entry: TimeEntry, range: DateRange): boolean {
  const d = entry.start.slice(0, 10);
  return d >= range.start && d <= range.end;
}

export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  const start = new Date(today);

  if (preset === "this_week") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  }
  if (preset === "last_week") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) - 7;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const endLast = new Date(start);
    endLast.setDate(start.getDate() + 6);
    endLast.setHours(23, 59, 59, 999);
    return {
      start: start.toISOString().slice(0, 10),
      end: endLast.toISOString().slice(0, 10),
    };
  }
  if (preset === "last_30_days") {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  }
  return {
    start: today.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10),
  };
}

export function getDateBuckets(
  range: DateRange,
  granularity: "day" | "week"
): DateBucket[] {
  const buckets: DateBucket[] = [];
  const start = new Date(range.start);
  const end = new Date(range.end);
  const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  if (granularity === "day" || days <= 31) {
    for (let i = 0; i <= days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if (key <= range.end) {
        buckets.push({
          key,
          label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          start: key,
          end: key,
        });
      }
    }
  } else {
    const weekStart = new Date(start);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    for (let cursor = new Date(weekStart); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
      const wEnd = new Date(cursor);
      wEnd.setDate(cursor.getDate() + 6);
      const key = `W${getWeekNumber(cursor)}-${cursor.getFullYear()}`;
      buckets.push({
        key,
        label: `${cursor.toLocaleDateString("en-US", { month: "short" })} W${getWeekNumber(cursor)}`,
        start: cursor.toISOString().slice(0, 10),
        end: wEnd.toISOString().slice(0, 10),
      });
    }
  }
  return buckets;
}

function getWeekNumber(d: Date): number {
  const first = new Date(d.getFullYear(), 0, 1);
  const diff = (d.getTime() - first.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil((diff + first.getDay() + 1) / 7);
}

export function filterJobsByRange(
  jobs: Job[],
  range: DateRange,
  filters?: { jobTypeId?: string; workerId?: string; status?: string }
): Job[] {
  let out = jobs.filter((j) => jobDateOverlapsRange(j, range));
  if (filters?.jobTypeId) out = out.filter((j) => j.typeId === filters.jobTypeId);
  if (filters?.workerId) out = out.filter((j) => j.workerIds?.includes(filters.workerId!));
  if (filters?.status) out = out.filter((j) => j.status === filters.status);
  return out;
}

export function filterEntriesByRange(
  entries: TimeEntry[],
  range: DateRange,
  filters?: { workerId?: string }
): TimeEntry[] {
  let out = entries.filter((e) => entryInRange(e, range));
  if (filters?.workerId) out = out.filter((e) => e.workerId === filters.workerId);
  return out;
}

export function sumRevenue(jobs: Job[]): number {
  return jobs.reduce((s, j) => s + (j.revenue ?? 0), 0);
}

export function sumLabourCost(
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): number {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filtered = entries.filter((e) => entryInRange(e, range));
  return filtered.reduce((s, e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    return s + hrs * rate * mult;
  }, 0);
}

export function sumLabourHours(entries: TimeEntry[], range: DateRange): number {
  const filtered = entries.filter((e) => entryInRange(e, range));
  return filtered.reduce((s, e) => s + hoursFromEntry(e), 0);
}

export function calculateMargin(revenue: number, labourCost: number): number | null {
  if (revenue <= 0) return null;
  return (1 - labourCost / revenue) * 100;
}

export function calculateOvertime(
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): { otHours: number; otCost: number; otPctPayroll: number; totalPayroll: number } {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filtered = entries.filter((e) => entryInRange(e, range));
  let totalPayroll = 0;
  let otCost = 0;
  let otHours = 0;
  filtered.forEach((e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    totalPayroll += hrs * rate * mult;
    if (e.isOvertime) {
      otHours += hrs;
      otCost += hrs * rate * (OT_MULTIPLIER - 1) + hrs * rate;
    }
  });
  const otPctPayroll = totalPayroll > 0 ? (otCost / totalPayroll) * 100 : 0;
  return { otHours, otCost, otPctPayroll, totalPayroll };
}

export function calculateRplh(revenue: number, labourHours: number): number | null {
  if (labourHours <= 0) return null;
  return revenue / labourHours;
}

export interface OverrunSummary {
  count: number;
  hours: number;
  cost: number;
}

export function calculateOverruns(
  jobs: Job[],
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): OverrunSummary {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filteredJobs = filterJobsByRange(jobs, range);
  const filteredEntries = filterEntriesByRange(entries, range);

  let totalLabourCost = 0;
  let totalLabourHours = 0;
  filteredEntries.forEach((e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    totalLabourCost += hrs * rate * mult;
    totalLabourHours += hrs;
  });
  const blendedRate = totalLabourHours > 0 ? totalLabourCost / totalLabourHours : 0;

  let count = 0;
  let hours = 0;
  let cost = 0;

  filteredJobs.forEach((job) => {
    const estHours = getJobEstimatedHours(job);
    const jobEntries = filteredEntries.filter((e) => e.jobId === job.id);
    const actualHours = jobEntries.reduce((s, e) => s + hoursFromEntry(e), 0);
    const overrunHrs = Math.max(0, actualHours - estHours);
    if (overrunHrs > 0 && estHours > 0) {
      count++;
      hours += overrunHrs;
      cost += overrunHrs * blendedRate;
    }
  });

  return { count, hours, cost };
}

export interface RevenueLabourPoint {
  bucketKey: string;
  label: string;
  revenue: number;
  labourCost: number;
}

export function buildRevenueVsLabourSeries(
  jobs: Job[],
  entries: TimeEntry[],
  workers: Worker[],
  buckets: DateBucket[]
): RevenueLabourPoint[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));

  return buckets.map((b) => {
    const bucketJobs = jobs.filter((j) => jobDateOverlapsRange(j, { start: b.start, end: b.end }));
    const bucketEntries = entries.filter((e) => entryInRange(e, { start: b.start, end: b.end }));
    const revenue = bucketJobs.reduce((s, j) => s + (j.revenue ?? 0), 0);
    const labourCost = bucketEntries.reduce((s, e) => {
      const worker = workerMap.get(e.workerId);
      const hrs = hoursFromEntry(e);
      const rate = worker?.hourlyRate ?? 0;
      const mult = e.isOvertime ? OT_MULTIPLIER : 1;
      return s + hrs * rate * mult;
    }, 0);
    return { bucketKey: b.key, label: b.label, revenue, labourCost };
  });
}

export interface OvertimePoint {
  bucketKey: string;
  label: string;
  otHours: number;
  otCost: number;
}

export function buildOvertimeSeries(
  entries: TimeEntry[],
  workers: Worker[],
  buckets: DateBucket[]
): OvertimePoint[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));

  return buckets.map((b) => {
    const bucketEntries = entries.filter(
      (e) => entryInRange(e, { start: b.start, end: b.end }) && e.isOvertime
    );
    let otHours = 0;
    let otCost = 0;
    bucketEntries.forEach((e) => {
      const worker = workerMap.get(e.workerId);
      const hrs = hoursFromEntry(e);
      const rate = worker?.hourlyRate ?? 0;
      otHours += hrs;
      otCost += hrs * rate * OT_MULTIPLIER;
    });
    return { bucketKey: b.key, label: b.label, otHours, otCost };
  });
}

export interface OverrunningJobRow {
  jobId: string;
  jobName: string;
  customerName?: string;
  estimatedHours: number;
  actualHours: number;
  overrunHours: number;
  overrunCost: number;
  status?: string;
}

export function topOverrunningJobs(
  jobs: Job[],
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange,
  limit = 10
): OverrunningJobRow[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filteredJobs = filterJobsByRange(jobs, range);
  const filteredEntries = filterEntriesByRange(entries, range);

  let totalLabourCost = 0;
  let totalLabourHours = 0;
  filteredEntries.forEach((e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    totalLabourCost += hrs * rate * mult;
    totalLabourHours += hrs;
  });
  const blendedRate = totalLabourHours > 0 ? totalLabourCost / totalLabourHours : 0;

  const rows: OverrunningJobRow[] = [];

  filteredJobs.forEach((job) => {
    const estHours = getJobEstimatedHours(job);
    const jobEntries = filteredEntries.filter((e) => e.jobId === job.id);
    const actualHours = jobEntries.reduce((s, e) => s + hoursFromEntry(e), 0);
    const overrunHrs = Math.max(0, actualHours - estHours);
    if (overrunHrs > 0 && estHours > 0) {
      rows.push({
        jobId: job.id,
        jobName: job.name,
        customerName: job.customerName,
        estimatedHours: estHours,
        actualHours,
        overrunHours: overrunHrs,
        overrunCost: overrunHrs * blendedRate,
        status: job.status,
      });
    }
  });

  return rows
    .sort((a, b) => b.overrunHours - a.overrunHours)
    .slice(0, limit);
}

export interface JobTypeMarginRow {
  jobTypeId: string;
  jobTypeName: string;
  jobsCount: number;
  revenue: number;
  labourCost: number;
  marginPct: number | null;
}

export function jobTypeMarginTable(
  jobs: Job[],
  entries: TimeEntry[],
  workers: Worker[],
  jobTypes: JobType[],
  range: DateRange
): JobTypeMarginRow[] {
  const typeMap = new Map(jobTypes.map((jt) => [jt.id, jt]));
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filteredJobs = filterJobsByRange(jobs, range);
  const filteredEntries = filterEntriesByRange(entries, range);

  const byType = new Map<string, { jobs: Job[]; entries: TimeEntry[] }>();

  filteredJobs.forEach((job) => {
    const typeId = job.typeId ?? "unknown";
    if (!byType.has(typeId)) byType.set(typeId, { jobs: [], entries: [] });
    byType.get(typeId)!.jobs.push(job);
  });

  filteredEntries.forEach((e) => {
    const job = filteredJobs.find((j) => j.id === e.jobId);
    if (!job) return;
    const typeId = job.typeId ?? "unknown";
    if (!byType.has(typeId)) byType.set(typeId, { jobs: [], entries: [] });
    byType.get(typeId)!.entries.push(e);
  });

  const rows: JobTypeMarginRow[] = [];

  byType.forEach((data, typeId) => {
    const revenue = data.jobs.reduce((s, j) => s + (j.revenue ?? 0), 0);
    let labourCost = 0;
    data.entries.forEach((e) => {
      const worker = workerMap.get(e.workerId);
      const hrs = hoursFromEntry(e);
      const rate = worker?.hourlyRate ?? 0;
      const mult = e.isOvertime ? OT_MULTIPLIER : 1;
      labourCost += hrs * rate * mult;
    });
    const marginPct = calculateMargin(revenue, labourCost);
    const name = typeMap.get(typeId)?.name ?? typeId;
    rows.push({
      jobTypeId: typeId,
      jobTypeName: name,
      jobsCount: data.jobs.length,
      revenue,
      labourCost,
      marginPct,
    });
  });

  return rows.sort((a, b) => (a.marginPct ?? 999) - (b.marginPct ?? 999));
}

export interface OvertimeWorkerRow {
  workerId: string;
  workerName: string;
  totalHours: number;
  otHours: number;
  otCost: number;
  jobsWorked: number;
}

export function workerOvertimeTable(
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): OvertimeWorkerRow[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filtered = filterEntriesByRange(entries, range);

  const byWorker = new Map<
    string,
    { totalHours: number; otHours: number; otCost: number; jobIds: Set<string> }
  >();

  filtered.forEach((e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const otCost = e.isOvertime ? hrs * rate * OT_MULTIPLIER : 0;

    if (!byWorker.has(e.workerId)) {
      byWorker.set(e.workerId, {
        totalHours: 0,
        otHours: 0,
        otCost: 0,
        jobIds: new Set(),
      });
    }
    const row = byWorker.get(e.workerId)!;
    row.totalHours += hrs;
    row.jobIds.add(e.jobId);
    if (e.isOvertime) {
      row.otHours += hrs;
      row.otCost += otCost;
    }
  });

  const rows: OvertimeWorkerRow[] = [];
  byWorker.forEach((data, workerId) => {
    if (data.otHours <= 0) return;
    const worker = workerMap.get(workerId);
    rows.push({
      workerId,
      workerName: worker?.name ?? "Unknown",
      totalHours: data.totalHours,
      otHours: data.otHours,
      otCost: data.otCost,
      jobsWorked: data.jobIds.size,
    });
  });

  return rows.sort((a, b) => b.otHours - a.otHours);
}

export interface AllJobsProfitRow {
  jobId: string;
  jobName: string;
  revenue: number;
  labourCost: number;
  grossProfit: number;
  marginPct: number | null;
  rplh: number | null;
}

export function allJobsProfitTable(
  jobs: Job[],
  entries: TimeEntry[],
  workers: Worker[],
  range: DateRange
): AllJobsProfitRow[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const filteredJobs = filterJobsByRange(jobs, range);
  const filteredEntries = filterEntriesByRange(entries, range);

  const rows: AllJobsProfitRow[] = filteredJobs.map((job) => {
    const jobEntries = filteredEntries.filter((e) => e.jobId === job.id);
    let labourCost = 0;
    let labourHours = 0;
    jobEntries.forEach((e) => {
      const worker = workerMap.get(e.workerId);
      const hrs = hoursFromEntry(e);
      const rate = worker?.hourlyRate ?? 0;
      const mult = e.isOvertime ? OT_MULTIPLIER : 1;
      labourCost += hrs * rate * mult;
      labourHours += hrs;
    });
    const revenue = job.revenue ?? 0;
    const grossProfit = revenue - labourCost;
    const marginPct = calculateMargin(revenue, labourCost);
    const rplh = calculateRplh(revenue, labourHours);
    return {
      jobId: job.id,
      jobName: job.name,
      revenue,
      labourCost,
      grossProfit,
      marginPct,
      rplh,
    };
  });

  return rows.sort((a, b) => (a.marginPct ?? 999) - (b.marginPct ?? 999));
}

export function isMarginWarning(marginPct: number | null): boolean {
  if (marginPct == null) return false;
  return marginPct < MARGIN_WARNING_THRESHOLD;
}

export function isOvertimeWarning(otPctPayroll: number): boolean {
  return otPctPayroll > OT_WARNING_THRESHOLD;
}

export function isRplhWarning(rplh: number | null): boolean {
  if (rplh == null) return false;
  return rplh < RPLH_TARGET;
}

export { RPLH_TARGET };
