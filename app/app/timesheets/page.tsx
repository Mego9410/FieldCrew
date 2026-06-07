import {
  User,
  Clock,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getWorkers, getTimeEntries } from "@/lib/data";
import type { Worker, TimeEntry } from "@/lib/entities";

function hoursFromEntry(entry: TimeEntry): number {
  const startMs = new Date(entry.start).getTime();
  const endMs = new Date(entry.end).getTime();
  const breakHours = (entry.breaks ?? 0) / 60;
  return (endMs - startMs) / (1000 * 60 * 60) - breakHours;
}

function getWeekKey(isoDateStr: string): string {
  const d = new Date(isoDateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function formatPeriodLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

type TimesheetRow = {
  id: string;
  workerId: string;
  workerName: string;
  period: string;
  periodSort: string;
  hours: number;
  jobs: number;
  earnings: number;
};

function buildTimesheetRows(workers: Worker[], timeEntries: TimeEntry[]): TimesheetRow[] {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  const byWorkerAndWeek = new Map<string, { hours: number; jobIds: Set<string> }>();

  for (const entry of timeEntries) {
    const worker = workerMap.get(entry.workerId);
    if (!worker) continue;
    const weekKey = getWeekKey(entry.start);
    const key = `${entry.workerId}:${weekKey}`;
    if (!byWorkerAndWeek.has(key)) {
      byWorkerAndWeek.set(key, { hours: 0, jobIds: new Set() });
    }
    const row = byWorkerAndWeek.get(key)!;
    row.hours += hoursFromEntry(entry);
    row.jobIds.add(entry.jobId);
  }

  const rows: TimesheetRow[] = [];
  for (const [key, { hours, jobIds }] of byWorkerAndWeek) {
    const [workerId, weekStart] = key.split(":");
    const worker = workerMap.get(workerId);
    if (!worker) continue;
    const rate = worker.hourlyRate ?? 0;
    rows.push({
      id: key,
      workerId,
      workerName: worker.name,
      period: formatPeriodLabel(weekStart),
      periodSort: weekStart,
      hours,
      jobs: jobIds.size,
      earnings: Math.round(hours * rate * 100) / 100,
    });
  }

  rows.sort((a, b) => b.periodSort.localeCompare(a.periodSort) || a.workerName.localeCompare(b.workerName));
  return rows;
}

export default async function TimesheetsPage() {
  const supabase = await createClient();
  const [workers, timeEntries] = await Promise.all([
    getWorkers(undefined, supabase),
    getTimeEntries(undefined, undefined, supabase),
  ]);
  const timesheets = buildTimesheetRows(workers, timeEntries);

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Timesheets</h1>
        <p className="mt-0.5 text-sm text-fc-muted">
          Hours and earnings summarised by worker and week.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          By week
        </h2>

      <div className="border border-fc-border bg-fc-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-fc-surface-muted">
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Worker</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Period</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Hours</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Jobs</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-fc-muted">
                    No timesheets yet. Time entries from your workers will appear here.
                  </td>
                </tr>
              ) : (
                timesheets.map((ts) => (
                  <tr
                    key={ts.id}
                    className="border-b border-fc-border last:border-0 hover:bg-fc-surface-muted"
                  >
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2 font-medium text-fc-brand">
                        <User className="h-4 w-4 text-fc-muted" />
                        {ts.workerName}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-fc-muted">{ts.period}</td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5 font-medium text-fc-brand">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.round(ts.hours * 10) / 10} hrs
                      </span>
                    </td>
                    <td className="px-3 py-2 text-fc-muted">
                      {ts.jobs} {ts.jobs === 1 ? "job" : "jobs"}
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5 font-medium text-fc-brand">
                        <DollarSign className="h-3.5 w-3.5" />
                        ${ts.earnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </section>
    </div>
  );
}
