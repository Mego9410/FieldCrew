import {
  Search,
  Filter,
  Calendar,
  User,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  status: "pending" | "approved";
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
      status: "pending",
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
          View and approve timesheets by period.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          By period
        </h2>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center border border-fc-border bg-fc-surface">
          <button
            type="button"
            className="p-2.5 text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex items-center gap-2 border-x border-fc-border px-4 py-2.5 text-sm font-semibold text-fc-brand">
            <Calendar className="h-4 w-4 text-fc-muted" />
            Feb 3 – 9, 2025
          </span>
          <button
            type="button"
            className="p-2.5 text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
            aria-label="Next period"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search by worker…"
            className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-fc-border bg-fc-surface px-3 py-2 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

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
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Status</th>
                <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-fc-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-fc-muted">
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
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-semibold ${
                          ts.status === "approved"
                            ? "bg-fc-success-bg text-fc-success"
                            : "bg-fc-warning-bg text-fc-warning"
                        }`}
                      >
                        {ts.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {ts.status === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 border border-fc-border bg-fc-surface px-2.5 py-1.5 text-xs font-semibold text-fc-brand hover:bg-fc-surface-muted"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 bg-fc-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-fc-accent-dark"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        </div>
                      )}
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
