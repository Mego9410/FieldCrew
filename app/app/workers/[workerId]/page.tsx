"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  User,
  Briefcase,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useWorker, useTimeEntries, useJobs } from "@/lib/hooks/useData";
import { routes } from "@/lib/routes";
import {
  getDateRangeForPeriod,
  getWorkerPerformanceSnapshot,
  getWorkerRplhTrend,
  getWorkerHoursBreakdown,
  getWorkerFlags,
  getJobsWorkedWithProfit,
  filterAndSortJobRows,
  TARGET_RPLH,
  type PeriodKey,
  type JobWorkedStatusFilter,
  type JobWorkedSortKey,
} from "@/lib/worker.analytics";

const statusStyles: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
};

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "this_week", label: "This week" },
  { key: "last_week", label: "Last week" },
  { key: "last_30_days", label: "Last 30 days" },
];

function KpiSkeleton() {
  return (
    <div className="border border-fc-border bg-fc-surface p-4">
      <div className="h-4 w-24 animate-pulse bg-fc-surface-muted" />
      <div className="mt-2 h-8 w-20 animate-pulse bg-fc-surface-muted" />
      <div className="mt-1 h-3 w-28 animate-pulse bg-fc-surface-muted" />
    </div>
  );
}

export default function WorkerDetailPage() {
  const params = useParams() as { workerId: string };
  const workerId = params.workerId;
  const [period, setPeriod] = useState<PeriodKey>("last_30_days");
  const [statusFilter, setStatusFilter] = useState<JobWorkedStatusFilter>("all");
  const [sortKey, setSortKey] = useState<JobWorkedSortKey>("most_recent");

  const { item: worker, loading: workerLoading } = useWorker(workerId);
  const { items: entries, loading: entriesLoading } = useTimeEntries(workerId);
  const { items: jobs, loading: jobsLoading } = useJobs();

  const range = useMemo(() => getDateRangeForPeriod(period), [period]);

  const snapshot = useMemo(() => {
    if (!worker) return null;
    return getWorkerPerformanceSnapshot(worker, entries, jobs, range);
  }, [worker, entries, jobs, range]);

  const rplhTrend = useMemo(() => {
    if (!worker) return [];
    return getWorkerRplhTrend(entries, jobs, worker.id, range, period);
  }, [worker, entries, jobs, range, period]);

  const hoursBreakdown = useMemo(() => {
    if (!worker) return [];
    return getWorkerHoursBreakdown(entries, worker, range, period);
  }, [worker, entries, range, period]);

  const flags = useMemo(() => {
    if (!snapshot) return [];
    return getWorkerFlags(snapshot, {
      overtimeHoursWeek: period === "this_week" ? snapshot.overtimeHours : undefined,
      overtimeWeeksInRow: undefined,
      rplhBelowTargetWeeks: undefined,
    });
  }, [snapshot, period]);

  const jobRowsAll = useMemo(() => {
    if (!worker) return [];
    return getJobsWorkedWithProfit(worker, entries, jobs);
  }, [worker, entries, jobs]);

  const jobRows = useMemo(
    () => filterAndSortJobRows(jobRowsAll, statusFilter, sortKey),
    [jobRowsAll, statusFilter, sortKey]
  );

  const totals = useMemo(() => {
    let actualHours = 0;
    let labourCost = 0;
    let revenue = 0;
    for (const r of jobRows) {
      actualHours += r.actualHrs;
      labourCost += r.labourCost;
      revenue += r.revenue;
    }
    const rplh = actualHours > 0 && revenue > 0 ? revenue / actualHours : 0;
    return { actualHours, labourCost, revenue, rplh };
  }, [jobRows]);

  const loading = workerLoading || entriesLoading || jobsLoading;

  if (workerLoading && !worker) {
    return (
      <div className="px-6 py-6">
        <Link href={routes.owner.workers} className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand">
          <ArrowLeft className="h-4 w-4" /> Back to workers
        </Link>
        <p className="text-fc-muted">Loading…</p>
      </div>
    );
  }
  if (!worker) {
    return (
      <div className="px-6 py-6">
        <Link
          href={routes.owner.workers}
          className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to workers
        </Link>
        <p className="text-fc-muted">Worker not found.</p>
      </div>
    );
  }

  const showOvertimeBadge = snapshot && snapshot.overtimeHours > 10;
  const showBelowTargetBadge = snapshot && snapshot.revenuePerLabourHour > 0 && snapshot.revenuePerLabourHour < TARGET_RPLH;

  return (
    <div className="px-6 py-6">
      <Link
        href={routes.owner.workers}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workers
      </Link>

      {/* Header (unchanged) */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fc-accent/10 text-fc-accent font-semibold text-xl">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-fc-brand">{worker.name}</h1>
            <p className="mt-0.5 text-sm text-fc-muted">Worker performance profile.</p>
          </div>
        </div>
        <a
          href={routes.worker.home(worker.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand transition-colors hover:bg-slate-50 hover:border-fc-accent/50"
        >
          <ExternalLink className="h-4 w-4" />
          Open as worker
        </a>
      </div>

      {/* Details card (compact, keep for phone/rate) */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-fc-muted">
          <Mail className="h-4 w-4" />
          {worker.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-fc-muted">
          <User className="h-4 w-4" />
          ${worker.hourlyRate}/hr
        </div>
      </div>

      {/* Period selector */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-fc-brand">Performance snapshot</h2>
        <div className="flex rounded-lg border border-fc-border bg-white p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setPeriod(opt.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === opt.key
                  ? "bg-fc-accent/10 text-fc-accent"
                  : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div id="kpi-hours" className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && !snapshot ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : snapshot ? (
          <>
            <div id="kpi-hours" className="rounded-lg border border-fc-border bg-white p-4">
              <p className="text-sm font-medium text-fc-muted">Total hours (period)</p>
              <p className="mt-1 text-2xl font-bold text-fc-brand">{snapshot.totalHours.toFixed(1)} hrs</p>
              {snapshot.overtimeHours > 0 && (
                <p className="mt-0.5 text-xs text-fc-muted">OT: {snapshot.overtimeHours.toFixed(1)} hrs</p>
              )}
              {showOvertimeBadge && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  <AlertTriangle className="h-3 w-3" /> Overtime risk
                </span>
              )}
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <p className="text-sm font-medium text-fc-muted">Earnings (labour cost)</p>
              <p className="mt-1 text-2xl font-bold text-fc-brand">
                ${snapshot.labourCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-0.5 text-xs text-fc-muted">Blended rate: ${snapshot.blendedRate.toFixed(2)}/hr</p>
            </div>
            <div id="kpi-revenue" className="rounded-lg border border-fc-border bg-white p-4">
              <p className="text-sm font-medium text-fc-muted">Revenue generated</p>
              <p className="mt-1 text-2xl font-bold text-fc-brand">
                ${snapshot.revenueGenerated.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-0.5 text-xs text-fc-muted">
                Revenue per labour hour: ${snapshot.revenuePerLabourHour.toFixed(0)}/hr
              </p>
              {showBelowTargetBadge && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  <AlertTriangle className="h-3 w-3" /> Below target
                </span>
              )}
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <p className="text-sm font-medium text-fc-muted">Avg job variance</p>
              <p className="mt-1 text-2xl font-bold text-fc-brand">
                {snapshot.avgVarianceHoursPerJob >= 0 ? "+" : ""}
                {snapshot.avgVarianceHoursPerJob.toFixed(1)} hrs/job
              </p>
              {snapshot.avgVariancePctPerJob != null && (
                <p className="mt-0.5 text-xs text-fc-muted">
                  {snapshot.avgVariancePctPerJob >= 0 ? "+" : ""}
                  {snapshot.avgVariancePctPerJob.toFixed(0)}% vs estimate
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section id="chart-rplh" className="rounded-lg border border-fc-border bg-white p-4">
          <h3 className="mb-4 font-semibold text-fc-brand">Revenue per labour hour (trend)</h3>
          {rplhTrend.length === 0 ? (
            <p className="py-8 text-center text-sm text-fc-muted">No time entries in this period.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rplhTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-fc-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(value: number | undefined) => [value != null ? `$${Number(value).toFixed(0)}/hr` : "", "RPLH"]}
                    labelFormatter={(_, payload) => payload[0]?.payload?.label}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenuePerLabourHour"
                    name="RPLH"
                    stroke="var(--fc-accent, #0ea5e9)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
        <section id="chart-hours" className="rounded-lg border border-fc-border bg-white p-4">
          <h3 className="mb-4 font-semibold text-fc-brand">Hours breakdown (regular vs overtime)</h3>
          {hoursBreakdown.length === 0 ? (
            <p className="py-8 text-center text-sm text-fc-muted">No time entries in this period.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursBreakdown} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-fc-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number | undefined, name?: string) => {
                      const label = name === "regularHours" ? "Regular hrs" : "OT hrs";
                      return [value != null ? value.toFixed(1) : "", label];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload[0]?.payload;
                      return p ? `${p.label} — Cost: $${p.labourCost.toFixed(0)}` : "";
                    }}
                  />
                  <Bar dataKey="regularHours" name="regularHours" fill="#94a3b8" stackId="hours" />
                  <Bar dataKey="overtimeHours" name="overtimeHours" fill="#f59e0b" stackId="hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* Flags card */}
      {flags.length > 0 && (
        <section className="mb-6 rounded-lg border border-fc-border bg-white p-4">
          <h3 className="mb-3 font-semibold text-fc-brand">Flags</h3>
          <ul className="space-y-2">
            {flags.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                <span className={f.severity === "warning" ? "text-amber-700" : "text-fc-muted"}>
                  {f.message}
                </span>
                {f.viewAnchor && (
                  <a
                    href={f.viewAnchor}
                    className="text-fc-accent hover:underline"
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Jobs worked (profit view) */}
      <section id="jobs-worked" className="rounded-lg border border-fc-border bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-fc-brand">
          <Briefcase className="h-4 w-4" />
          Jobs worked
        </h2>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-fc-muted">Status:</span>
          <div className="flex gap-1">
            {(["all", "scheduled", "in_progress", "completed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-2.5 py-1 text-sm font-medium capitalize ${
                  statusFilter === s ? "bg-fc-accent/10 text-fc-accent" : "text-fc-muted hover:bg-slate-50"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          <span className="ml-2 text-sm text-fc-muted">Sort:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as JobWorkedSortKey)}
            className="rounded-lg border border-fc-border bg-white px-2.5 py-1.5 text-sm text-fc-brand"
          >
            <option value="most_recent">Most recent</option>
            <option value="lowest_margin">Lowest margin</option>
            <option value="highest_overrun">Highest overrun</option>
          </select>
        </div>

        {loading && jobRows.length === 0 ? (
          <p className="text-sm text-fc-muted">Loading jobs…</p>
        ) : jobRows.length === 0 ? (
          <p className="text-sm text-fc-muted">No jobs worked in this view.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-fc-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-fc-border bg-slate-50/80">
                    <th className="px-4 py-3 font-semibold text-fc-brand">Job</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Address</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Date</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Status</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Est. hrs</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Actual hrs</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Variance</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Revenue</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">Labour cost</th>
                    <th className="px-4 py-3 font-semibold text-fc-brand">RPLH</th>
                  </tr>
                </thead>
                <tbody>
                  {jobRows.map((row) => (
                    <tr
                      key={row.job.id}
                      className="border-b border-fc-border last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={routes.owner.job(row.job.id)}
                          className="font-medium text-fc-brand hover:underline"
                        >
                          {row.job.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-fc-muted">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {row.address}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-fc-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {row.dateLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[row.status] ?? statusStyles.scheduled}`}
                        >
                          {row.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-fc-muted">{row.estimatedHrs.toFixed(1)}</td>
                      <td className="px-4 py-3 text-fc-brand">{row.actualHrs.toFixed(1)}</td>
                      <td className="px-4 py-3 text-fc-muted">
                        {row.varianceHrs >= 0 ? "+" : ""}
                        {row.varianceHrs.toFixed(1)} hrs
                        {row.variancePct != null && (
                          <span className="block text-xs">
                            ({row.variancePct >= 0 ? "+" : ""}
                            {row.variancePct.toFixed(0)}%)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-fc-brand">
                        ${row.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-fc-brand">
                        ${row.labourCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-fc-muted">
                        {row.rplh != null ? `$${row.rplh.toFixed(0)}/hr` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-fc-border bg-slate-50/80 font-medium">
                    <td className="px-4 py-3" colSpan={4}>
                      Totals
                    </td>
                    <td className="px-4 py-3 text-fc-muted">—</td>
                    <td className="px-4 py-3 text-fc-brand">{totals.actualHours.toFixed(1)}</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3 text-fc-brand">
                      ${totals.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-fc-brand">
                      ${totals.labourCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-fc-brand">
                      ${totals.rplh.toFixed(0)}/hr
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
