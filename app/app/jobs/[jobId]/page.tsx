"use client";

import { use } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ClipboardList,
  MapPin,
  Calendar,
  Clock,
  User,
  DollarSign,
  Building2,
  Tag,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { useJob, useWorkers, useTimeEntries, useProjects, useJobTypes } from "@/lib/hooks/useData";
import { getJobAnalytics } from "@/lib/jobAnalytics";

const statusStyles: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShift(start: string, end: string): string {
  return `${formatTime(start)}–${formatTime(end)}`;
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const { item: job, loading } = useJob(jobId);
  const { items: workers } = useWorkers();
  const { items: entries } = useTimeEntries(undefined, jobId);
  const { items: projects } = useProjects();
  const { items: jobTypes } = useJobTypes();

  if (loading && !job) {
    return (
      <div className="px-6 py-6">
        <Link
          href={routes.owner.jobs}
          className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="mt-8 border border-fc-border bg-fc-surface p-12 text-center">
          <p className="text-sm text-fc-muted">Loading job…</p>
        </div>
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="px-6 py-6">
        <Link
          href={routes.owner.jobs}
          className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="mt-8 border border-fc-border bg-fc-surface p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-fc-muted" />
          <h2 className="mt-4 text-lg font-semibold text-fc-brand">Job not found</h2>
          <p className="mt-2 text-sm text-fc-muted">
            This job may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const project = job.projectId
    ? projects.find((p) => p.id === job.projectId)
    : null;
  const jobType = job.typeId
    ? jobTypes.find((t) => t.id === job.typeId)
    : null;
  const assigneeIds = job.workerIds?.length
    ? job.workerIds
    : [...new Set(entries.map((e) => e.workerId))];
  const assigneeNames = assigneeIds
    .map((id) => workers.find((w) => w.id === id)?.name)
    .filter(Boolean);

  const analytics = getJobAnalytics(job, entries, workers);
  const { snapshot, entryRows, totalHours, totalBreaks, totalLabourCost } = analytics;

  const dueDate = job.startDate
    ? job.endDate && job.startDate !== job.endDate
      ? `${formatDate(job.startDate)} – ${formatDate(job.endDate)}`
      : formatDate(job.startDate)
    : job.date
      ? formatDate(job.date)
      : "—";

  const status = job.status ?? "scheduled";
  const hasRevenue = (job.revenue ?? 0) > 0;
  const varianceWarning = snapshot.varianceHours > 0;

  return (
    <div className="px-6 py-6">
      <Link
        href={routes.owner.jobs}
        className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="mt-6 border border-fc-border bg-fc-surface overflow-hidden">
        {/* Header */}
        <div className="border-b border-fc-border bg-fc-surface-muted px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div>
                <h1 className="font-display text-xl font-bold text-fc-brand">{job.name}</h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-fc-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.address}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold capitalize ${statusStyles[status] ?? "bg-fc-neutral-bg text-fc-neutral"}`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Profit snapshot – 4-metric grid */}
        <div className="grid grid-cols-2 gap-4 border-b border-fc-border bg-fc-surface-muted px-6 py-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Revenue
            </p>
            <p className="mt-0.5 text-lg font-bold text-fc-brand">
              {hasRevenue ? `$${snapshot.revenue.toLocaleString()}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Labour cost
            </p>
            <p className="mt-0.5 text-lg font-bold text-fc-brand">
              {entries.length > 0
                ? `$${Math.round(snapshot.labourCost)}`
                : "—"}
            </p>
            {entries.length > 0 && (
              <p className="mt-0.5 text-xs text-fc-muted">
                {snapshot.actualHours.toFixed(1)} hrs • Blended ${Math.round(snapshot.blendedRate)}/hr
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Gross profit
            </p>
            <p className="mt-0.5 text-lg font-bold text-fc-brand">
              {hasRevenue
                ? `$${Math.round(snapshot.grossProfit)}`
                : "—"}
            </p>
            {hasRevenue && snapshot.marginPct != null && (
              <p className="mt-0.5 text-xs text-fc-muted">
                Margin {snapshot.marginPct.toFixed(1)}%
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
              Estimate variance
            </p>
            {snapshot.estimatedHours > 0 || entries.length > 0 ? (
              <>
                <p
                  className={`mt-0.5 text-lg font-bold ${varianceWarning ? "text-fc-warning" : "text-fc-brand"}`}
                >
                  {snapshot.varianceHours >= 0 ? "+" : ""}
                  {snapshot.varianceHours.toFixed(1)} hrs
                </p>
                {snapshot.estimatedHours > 0 && (
                  <p className="mt-0.5 text-xs text-fc-muted">
                    {snapshot.variancePct != null
                      ? `${snapshot.variancePct >= 0 ? "+" : ""}${snapshot.variancePct.toFixed(0)}%`
                      : ""}
                    {varianceWarning &&
                      ` • +$${Math.round(snapshot.overrunCost)} overrun cost`}
                  </p>
                )}
                {varianceWarning && (
                  <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                    Over estimate
                  </span>
                )}
              </>
            ) : (
              <p className="mt-0.5 text-fc-muted">—</p>
            )}
          </div>
        </div>

        {/* Job details + Labour – compact two columns */}
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-fc-brand">Job details</h2>
            <dl className="space-y-2 text-sm">
              {job.customerName && (
                <div className="flex justify-between gap-2">
                  <dt className="text-fc-muted">Customer</dt>
                  <dd className="font-medium text-fc-brand text-right">{job.customerName}</dd>
                </div>
              )}
              {project && (
                <div className="flex justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <Building2 className="h-3.5 w-3.5" /> Project
                  </dt>
                  <dd className="font-medium text-right">
                    <Link
                      href={routes.owner.projectJobs(project.id)}
                      className="text-fc-accent hover:underline"
                    >
                      {project.name}
                    </Link>
                  </dd>
                </div>
              )}
              {jobType && (
                <div className="flex justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <Tag className="h-3.5 w-3.5" /> Type
                  </dt>
                  <dd className="font-medium text-fc-brand text-right">{jobType.name}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-fc-muted">
                  <Calendar className="h-3.5 w-3.5" /> Due
                </dt>
                <dd className="font-medium text-fc-brand text-right">{dueDate}</dd>
              </div>
              {job.time && (
                <div className="flex justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <Clock className="h-3.5 w-3.5" /> Time
                  </dt>
                  <dd className="font-medium text-fc-brand text-right">{job.time}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-fc-muted">
                  <DollarSign className="h-3.5 w-3.5" /> Revenue
                </dt>
                <dd className="font-medium text-fc-brand text-right">
                  {hasRevenue ? `$${snapshot.revenue.toLocaleString()}` : "—"}
                </dd>
              </div>
              {job.instructions?.trim() && (
                <div>
                  <dt className="text-fc-muted mb-1">Instructions</dt>
                  <dd className="font-medium text-fc-brand whitespace-pre-wrap text-sm">{job.instructions}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-fc-brand">Labour</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-fc-muted">
                  <User className="h-3.5 w-3.5" /> Assigned
                </dt>
                <dd className="font-medium text-fc-brand text-right max-w-[60%]">
                  {assigneeNames.length ? assigneeNames.join(", ") : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-fc-muted">Estimated</dt>
                <dd className="font-medium text-fc-brand text-right">
                  {snapshot.estimatedHours > 0
                    ? `${snapshot.estimatedHours} hrs${snapshot.estimatedCost != null ? ` / $${snapshot.estimatedCost}` : ""}`
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-fc-muted">Actual</dt>
                <dd className="font-medium text-fc-brand text-right">
                  {entries.length > 0
                    ? `${snapshot.actualHours.toFixed(1)} hrs / $${Math.round(snapshot.labourCost)}`
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-fc-muted">Overtime</dt>
                <dd className="font-medium text-fc-brand text-right">
                  {snapshot.overtimeHours > 0
                    ? `${snapshot.overtimeHours.toFixed(1)} hrs / $${Math.round(snapshot.overtimeCost)}`
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-fc-muted">Revenue per labour hour</dt>
                <dd className="font-medium text-fc-brand text-right">
                  {snapshot.rplh != null && snapshot.rplh > 0
                    ? `$${Math.round(snapshot.rplh)}`
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Time entries table */}
        {entries.length > 0 && (
          <div className="border-t border-fc-border px-6 py-4">
            <h2 className="mb-3 text-sm font-semibold text-fc-brand">Time entries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-fc-border text-fc-muted">
                    <th className="pb-2 font-medium">Worker</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Shift</th>
                    <th className="pb-2 font-medium text-right">Breaks</th>
                    <th className="pb-2 font-medium text-right">Hours</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium text-right">Cost</th>
                    <th className="pb-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {entryRows.map((row) => (
                    <tr key={row.entry.id} className="border-b border-fc-border last:border-0">
                      <td className="py-2 font-medium text-fc-brand">{row.workerName}</td>
                      <td className="py-2 text-fc-muted">
                        {formatShortDate(row.entry.start)}
                      </td>
                      <td className="py-2 text-fc-muted">
                        {formatShift(row.entry.start, row.entry.end)}
                      </td>
                      <td className="py-2 text-fc-muted text-right">
                        {row.entry.breaks ?? 0} min
                      </td>
                      <td className="py-2 text-right font-bold text-fc-brand">
                        {row.hours.toFixed(1)}
                      </td>
                      <td className="py-2 text-fc-muted">
                        {row.isOvertime ? "OT" : "Regular"}
                      </td>
                      <td className="py-2 text-right font-bold text-fc-brand">
                        ${Math.round(row.cost)}
                      </td>
                      <td className="py-2 text-fc-muted max-w-[180px] truncate">
                        {row.entry.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-fc-border bg-fc-surface-muted font-semibold text-fc-brand">
                    <td className="py-2" colSpan={3}>
                      Total
                    </td>
                    <td className="py-2 text-right text-fc-muted">
                      {totalBreaks} min
                    </td>
                    <td className="py-2 text-right font-bold">
                      {totalHours.toFixed(1)}
                    </td>
                    <td className="py-2" />
                    <td className="py-2 text-right font-bold">
                      ${Math.round(totalLabourCost)}
                    </td>
                    <td className="py-2" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
