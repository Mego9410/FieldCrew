"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { routes } from "@/lib/routes";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  getLowestMarginJobTypes,
} from "@/lib/analytics";
import type { DateRange } from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/data";
import type { Worker, TimeEntry } from "@/lib/entities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

type Timeframe = "this_week" | "last_week" | "last_30_days";

function formatCurrency(value: number): string {
  return `£${Math.round(value).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function parseDate(dateStr: string): Date {
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

function labourCostForJob(
  jobId: string,
  timeEntries: TimeEntry[],
  workers: Worker[]
): number {
  const workerMap = new Map(workers.map((w) => [w.id, w]));
  let cost = 0;
  for (const entry of timeEntries) {
    if (entry.jobId !== jobId) continue;
    const w = workerMap.get(entry.workerId);
    if (!w) continue;
    const h = hoursFromEntry(entry);
    const mult = entry.isOvertime ? 1.5 : 1;
    cost += h * w.hourlyRate * mult;
  }
  return cost;
}

interface JobRow {
  jobId: string;
  jobName: string;
  revenue: number;
  labourCost: number;
  marginPct: number;
}

export default function JobTypeDetailPage() {
  const params = useParams();
  const jobTypeId = params.jobTypeId as string;
  const [timeframe, setTimeframe] = useState<Timeframe>("last_30_days");
  const [typeName, setTypeName] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    jobsCount: number;
    revenue: number;
    labourCost: number;
    marginPct: number;
  } | null>(null);
  const [jobRows, setJobRows] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!jobTypeId) return;
    let cancelled = false;
    setLoadError(null);
    setNotFound(false);
    setLoading(true);
    Promise.all([
      getJobs(),
      getWorkers(),
      getTimeEntries(),
      getJobTypes(),
    ])
      .then(([jobs, workers, timeEntries, jobTypes]) => {
        if (cancelled) return;
        const type = jobTypes.find((t) => t.id === jobTypeId);
        if (!type) {
          setNotFound(true);
          setTypeName(null);
          setSummary(null);
          setJobRows([]);
          return;
        }
        setTypeName(type.name);

        const currentWeek = getCurrentWeekRange();
        const lastWeek = getLastWeekRange();
        const last30Days = getLastNDaysRange(30);
        const range =
          timeframe === "this_week" ? currentWeek : timeframe === "last_week" ? lastWeek : last30Days;

        const typeMargins = getLowestMarginJobTypes(jobs, jobTypes, timeEntries, workers, range);
        const typeRow = typeMargins.find((r) => r.jobTypeId === jobTypeId);
        if (typeRow) {
          setSummary({
            jobsCount: typeRow.jobsCount,
            revenue: typeRow.revenue,
            labourCost: typeRow.labourCost,
            marginPct: typeRow.marginPct,
          });
        } else {
          setSummary({
            jobsCount: 0,
            revenue: 0,
            labourCost: 0,
            marginPct: 0,
          });
        }

        const jobsInRange = jobs.filter((j) => {
          if (j.typeId !== jobTypeId) return false;
          const jobDate = j.date ? parseDate(j.date) : j.startDate ? parseDate(j.startDate) : null;
          return jobDate && isInRange(jobDate, range);
        });
        const rows: JobRow[] = jobsInRange.map((job) => {
          const revenue = job.revenue ?? 0;
          const labourCost = labourCostForJob(job.id, timeEntries, workers);
          const marginPct = revenue > 0 ? ((revenue - labourCost) / revenue) * 100 : 0;
          return {
            jobId: job.id,
            jobName: job.name,
            revenue,
            labourCost,
            marginPct,
          };
        });
        setJobRows(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load");
          setTypeName(null);
          setSummary(null);
          setJobRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [jobTypeId, timeframe]);

  if (notFound) {
    return (
      <div className="min-h-full bg-fc-page px-4 py-6 sm:px-6">
        <Link
          href={routes.owner.jobTypes}
          className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to job types
        </Link>
        <h1 className="font-display text-xl font-bold text-fc-brand">Job type not found</h1>
        <p className="mt-2 text-sm text-fc-muted">
          This job type does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-fc-page px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.jobTypes}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to job types
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
        {typeName ?? "…"}
      </h1>
      <p className="mt-1.5 text-sm text-fc-muted">
        Revenue, labour cost, and margin for this job type in the selected period.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-fc-border bg-fc-surface shadow-fc-sm">
          {(["this_week", "last_week", "last_30_days"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
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

      {loadError ? (
        <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface p-6">
          <p className="text-sm text-fc-muted">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-fc-accent px-4 py-2 text-sm font-medium text-white hover:bg-fc-accent-dark"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm">
          <p className="text-sm text-fc-muted">Loading…</p>
        </div>
      ) : (
        <>
          {summary && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">Jobs</p>
                <p className="mt-1 font-display text-xl font-bold text-fc-brand">{summary.jobsCount}</p>
              </div>
              <div className="rounded-lg border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">Revenue</p>
                <p className="mt-1 font-display text-xl font-bold text-fc-brand">{formatCurrency(summary.revenue)}</p>
              </div>
              <div className="rounded-lg border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">Labour cost</p>
                <p className="mt-1 font-display text-xl font-bold text-fc-brand">{formatCurrency(summary.labourCost)}</p>
              </div>
              <div className="rounded-lg border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">Margin %</p>
                <p
                  className={`mt-1 font-display text-xl font-bold ${summary.marginPct < 30 ? "text-fc-danger" : "text-fc-brand"}`}
                >
                  {summary.marginPct.toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface shadow-fc-sm overflow-hidden">
            <p className="border-b border-fc-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-fc-muted">
              Jobs in this period
            </p>
            {jobRows.length === 0 ? (
              <p className="p-6 text-center text-sm text-fc-muted">No jobs in this period for this type.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead align="right">Revenue</TableHead>
                    <TableHead align="right">Labour cost</TableHead>
                    <TableHead align="right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobRows.map((row) => (
                    <TableRow key={row.jobId}>
                      <TableCell>
                        <Link
                          href={routes.owner.job(row.jobId)}
                          className="font-medium text-fc-brand hover:text-fc-accent hover:underline"
                        >
                          {row.jobName}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(row.revenue)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.labourCost)}</TableCell>
                      <TableCell
                        align="right"
                        className={row.marginPct < 30 ? "text-fc-danger" : "text-fc-brand"}
                      >
                        {row.marginPct.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
