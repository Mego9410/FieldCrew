"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { routes } from "@/lib/routes";
import {
  getCurrentWeekRange,
  getLastWeekRange,
  getLastNDaysRange,
  getLowestMarginJobTypes,
  type JobTypeMargin,
} from "@/lib/analytics";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

type Timeframe = "this_week" | "last_week" | "last_30_days";
type SortKey = "margin_asc" | "margin_desc" | "revenue" | "labourCost" | "jobsCount";

function formatCurrency(value: number): string {
  return `£${Math.round(value).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function sortRows(rows: JobTypeMargin[], sort: SortKey): JobTypeMargin[] {
  const sorted = [...rows];
  switch (sort) {
    case "margin_asc":
      return sorted.sort((a, b) => a.marginPct - b.marginPct);
    case "margin_desc":
      return sorted.sort((a, b) => b.marginPct - a.marginPct);
    case "revenue":
      return sorted.sort((a, b) => b.revenue - a.revenue);
    case "labourCost":
      return sorted.sort((a, b) => b.labourCost - a.labourCost);
    case "jobsCount":
      return sorted.sort((a, b) => b.jobsCount - a.jobsCount);
    default:
      return sorted.sort((a, b) => a.marginPct - b.marginPct);
  }
}

export default function JobTypesPage() {
  const searchParams = useSearchParams();
  const sortParam = (searchParams.get("sort") as SortKey) || "margin_asc";
  const [timeframe, setTimeframe] = useState<Timeframe>("last_30_days");
  const [rows, setRows] = useState<JobTypeMargin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    setLoading(true);
    Promise.all([
      getJobs(),
      getWorkers(),
      getTimeEntries(),
      getJobTypes(),
    ])
      .then(([jobs, workers, timeEntries, jobTypes]) => {
        if (cancelled) return;
        const currentWeek = getCurrentWeekRange();
        const lastWeek = getLastWeekRange();
        const last30Days = getLastNDaysRange(30);
        const range =
          timeframe === "this_week" ? currentWeek : timeframe === "last_week" ? lastWeek : last30Days;
        const list = getLowestMarginJobTypes(jobs, jobTypes, timeEntries, workers, range);
        setRows(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load job types");
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [timeframe, retryCount]);

  const sortedRows = useMemo(() => sortRows(rows, sortParam), [rows, sortParam]);

  const sortHref = (key: SortKey) => `${routes.owner.jobTypes}?sort=${key}`;

  return (
    <div className="min-h-full bg-fc-page px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
        Margin by job type
      </h1>
      <p className="mt-1.5 text-sm text-fc-muted">
        Revenue, labour cost, and margin % by job type for the selected period.
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
            onClick={() => { setLoadError(null); setRetryCount((c) => c + 1); }}
            className="mt-4 rounded-lg bg-fc-accent px-4 py-2 text-sm font-medium text-white hover:bg-fc-accent-dark"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm">
          <p className="text-sm text-fc-muted">Loading…</p>
        </div>
      ) : sortedRows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface p-8 text-center shadow-fc-sm">
          <p className="text-sm text-fc-muted">No job types with data in this period.</p>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-fc-border bg-fc-surface shadow-fc-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job type</TableHead>
                <TableHead align="right">
                  <Link
                    href={sortHref("jobsCount")}
                    className={sortParam === "jobsCount" ? "text-fc-accent" : "hover:text-fc-accent"}
                  >
                    Jobs
                  </Link>
                </TableHead>
                <TableHead align="right">
                  <Link
                    href={sortHref("revenue")}
                    className={sortParam === "revenue" ? "text-fc-accent" : "hover:text-fc-accent"}
                  >
                    Revenue
                  </Link>
                </TableHead>
                <TableHead align="right">
                  <Link
                    href={sortHref("labourCost")}
                    className={sortParam === "labourCost" ? "text-fc-accent" : "hover:text-fc-accent"}
                  >
                    Labour cost
                  </Link>
                </TableHead>
                <TableHead align="right">
                  <Link
                    href={sortHref("margin_asc")}
                    className={sortParam === "margin_asc" ? "text-fc-accent" : "hover:text-fc-accent"}
                  >
                    Margin %
                  </Link>
                  {" · "}
                  <Link
                    href={sortHref("margin_desc")}
                    className={sortParam === "margin_desc" ? "text-fc-accent" : "hover:text-fc-accent"}
                  >
                    (high first)
                  </Link>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow key={row.jobTypeId}>
                  <TableCell>
                    <Link
                      href={routes.owner.jobType(row.jobTypeId)}
                      className="font-medium text-fc-brand hover:text-fc-accent hover:underline"
                    >
                      {row.jobTypeName}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{row.jobsCount}</TableCell>
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
        </div>
      )}
    </div>
  );
}
