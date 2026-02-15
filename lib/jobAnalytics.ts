/**
 * Job-level profit & labour analytics for the job detail page.
 * Computes revenue vs labour cost, estimate variance, and per-entry costs.
 */

import type { Job, TimeEntry, Worker } from "./entities";

const OT_MULTIPLIER = 1.5;

function hoursFromEntry(entry: TimeEntry): number {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const hours = (end - start) / 3600000 - (entry.breaks ?? 0) / 60;
  return Math.max(0, hours);
}

export interface JobProfitSnapshot {
  revenue: number;
  labourCost: number;
  grossProfit: number;
  marginPct: number | null;
  actualHours: number;
  blendedRate: number;
  estimatedHours: number;
  estimatedCost: number | null;
  varianceHours: number;
  variancePct: number | null;
  overrunCost: number;
  rplh: number | null;
  overtimeHours: number;
  overtimeCost: number;
}

export interface TimeEntryRow {
  entry: TimeEntry;
  workerName: string;
  hours: number;
  cost: number;
  isOvertime: boolean;
  dateKey: string;
}

export interface JobAnalyticsResult {
  snapshot: JobProfitSnapshot;
  entryRows: TimeEntryRow[];
  totalHours: number;
  totalBreaks: number;
  totalLabourCost: number;
}

function getEstimatedHours(job: Job): number {
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

/**
 * Compute job-level profit snapshot and time entry rows for the job detail page.
 */
export function getJobAnalytics(
  job: Job,
  entries: TimeEntry[],
  workers: Worker[]
): JobAnalyticsResult {
  const workerMap = new Map(workers.map((w) => [w.id, w]));

  const entryRows: TimeEntryRow[] = entries.map((e) => {
    const worker = workerMap.get(e.workerId);
    const hrs = hoursFromEntry(e);
    const rate = worker?.hourlyRate ?? 0;
    const mult = e.isOvertime ? OT_MULTIPLIER : 1;
    const cost = hrs * rate * mult;
    return {
      entry: e,
      workerName: worker?.name ?? "—",
      hours: hrs,
      cost,
      isOvertime: e.isOvertime ?? false,
      dateKey: e.start.slice(0, 10),
    };
  });

  const totalHours = entryRows.reduce((s, r) => s + r.hours, 0);
  const totalBreaks = entries.reduce((s, e) => s + (e.breaks ?? 0), 0);
  const totalLabourCost = entryRows.reduce((s, r) => s + r.cost, 0);

  const blendedRate =
    totalHours > 0 ? totalLabourCost / totalHours : 0;

  const estimatedHours = getEstimatedHours(job);
  const assigneeIds = job.workerIds?.length
    ? job.workerIds
    : [...new Set(entries.map((e) => e.workerId))];
  const assignedWorkers = assigneeIds
    .map((id) => workerMap.get(id))
    .filter((w): w is Worker => w != null);
  const sumAssignedRates = assignedWorkers.reduce((s, w) => s + w.hourlyRate, 0);
  const estimatedCost =
    estimatedHours > 0 && assignedWorkers.length > 0
      ? Math.round(estimatedHours * sumAssignedRates)
      : null;

  const revenue = job.revenue ?? 0;
  const grossProfit = revenue - totalLabourCost;
  const marginPct =
    revenue > 0 ? (grossProfit / revenue) * 100 : null;

  const varianceHours = totalHours - estimatedHours;
  const variancePct =
    estimatedHours > 0 ? (varianceHours / estimatedHours) * 100 : null;
  const overrunCost = Math.max(varianceHours, 0) * blendedRate;

  const rplh =
    totalHours > 0 && revenue > 0 ? revenue / totalHours : null;

  const overtimeHours = entryRows
    .filter((r) => r.isOvertime)
    .reduce((s, r) => s + r.hours, 0);
  const overtimeCost = entryRows
    .filter((r) => r.isOvertime)
    .reduce((s, r) => s + r.cost, 0);

  const snapshot: JobProfitSnapshot = {
    revenue,
    labourCost: totalLabourCost,
    grossProfit,
    marginPct,
    actualHours: totalHours,
    blendedRate,
    estimatedHours,
    estimatedCost,
    varianceHours,
    variancePct,
    overrunCost,
    rplh,
    overtimeHours,
    overtimeCost,
  };

  return {
    snapshot,
    entryRows: entryRows.sort(
      (a, b) =>
        new Date(b.entry.start).getTime() - new Date(a.entry.start).getTime()
    ),
    totalHours,
    totalBreaks,
    totalLabourCost,
  };
}
