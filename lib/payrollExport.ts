/**
 * Payroll export: date filtering and aggregation for CSV/PDF.
 * Rows are aggregated by worker + job with total hours and labour cost.
 */

import type { TimeEntry, Worker, Job } from "./entities";

export interface PayrollRow {
  workerName: string;
  totalHours: number;
  jobNameOrId: string;
  labourCost: number;
}

function getHoursFromEntry(entry: TimeEntry): number {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const hours = (end - start) / 3600000 - (entry.breaks ?? 0) / 60;
  return Math.max(0, hours);
}

/**
 * True if the time entry overlaps the [dateFrom, dateTo] range (inclusive).
 * Uses entry.start for inclusion; entries that start within the range are included.
 */
export function entryInRange(
  entry: TimeEntry,
  dateFrom: string,
  dateTo: string
): boolean {
  if (!dateFrom || !dateTo) return false;
  const start = new Date(entry.start);
  const rangeStart = new Date(dateFrom);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(dateTo);
  rangeEnd.setHours(23, 59, 59, 999);
  return start >= rangeStart && start <= rangeEnd;
}

/**
 * Aggregate time entries by worker + job for the payroll export.
 * Returns one row per (worker, job) with summed hours and labour cost.
 * Labour cost = hours * hourlyRate * (1.5 if overtime else 1).
 */
export function aggregatePayrollRows(
  entries: TimeEntry[],
  workers: Worker[],
  jobs: Job[]
): PayrollRow[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  const keyToRow = new Map<string, { workerName: string; jobNameOrId: string; hours: number; labourCost: number }>();

  for (const entry of entries) {
    const worker = workerMap.get(entry.workerId);
    const job = jobMap.get(entry.jobId);
    if (!worker || !job) continue;

    const hours = getHoursFromEntry(entry);
    const mult = entry.isOvertime ? 1.5 : 1;
    const cost = hours * worker.hourlyRate * mult;
    const key = `${entry.workerId}:${entry.jobId}`;
    const existing = keyToRow.get(key);
    const jobLabel = job.name ? `${job.name} (${job.id})` : job.id;

    if (existing) {
      existing.hours += hours;
      existing.labourCost += cost;
    } else {
      keyToRow.set(key, {
        workerName: worker.name,
        jobNameOrId: jobLabel,
        hours,
        labourCost: cost,
      });
    }
  }

  return Array.from(keyToRow.values()).map((r) => ({
    workerName: r.workerName,
    totalHours: r.hours,
    jobNameOrId: r.jobNameOrId,
    labourCost: r.labourCost,
  }));
}
