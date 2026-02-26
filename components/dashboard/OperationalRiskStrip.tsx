"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import type { OverrunningJob, JobTypeMargin, OvertimeWorker } from "@/lib/analytics";

export interface OperationalRiskStripProps {
  topOverrunningJobs: OverrunningJob[];
  lowestMarginJobTypes: JobTypeMargin[];
  workersDrivingSpikes: OvertimeWorker[];
}

export function OperationalRiskStrip({
  topOverrunningJobs,
  lowestMarginJobTypes,
  workersDrivingSpikes,
}: OperationalRiskStripProps) {
  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
        Operational risk
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-fc-muted">
              Top overrunning jobs
            </span>
            <Link
              href="/app/jobs?filter=overrun"
              className="text-xs font-medium text-fc-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-1.5">
            {topOverrunningJobs.length === 0 ? (
              <li className="text-sm text-fc-muted">None</li>
            ) : (
              topOverrunningJobs.slice(0, 4).map((job) => (
                <li key={job.jobId} className="flex items-center justify-between gap-2 text-sm">
                  <Link
                    href={`/app/jobs/${job.jobId}`}
                    className="truncate text-fc-brand hover:text-fc-accent hover:underline"
                  >
                    {job.jobName}
                  </Link>
                  <span className="shrink-0 tabular-nums text-fc-danger">
                    +{job.overrunHours.toFixed(1)}h
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-fc-muted">
              Lowest margin types
            </span>
            <Link
              href={`${routes.owner.jobTypes}?sort=margin_asc`}
              className="text-xs font-medium text-fc-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-1.5">
            {lowestMarginJobTypes.length === 0 ? (
              <li className="text-sm text-fc-muted">No data</li>
            ) : (
              lowestMarginJobTypes.slice(0, 4).map((type) => (
                <li key={type.jobTypeId} className="flex items-center justify-between gap-2 text-sm">
                  <Link
                    href={routes.owner.jobType(type.jobTypeId)}
                    className="truncate text-fc-brand hover:text-fc-accent hover:underline"
                  >
                    {type.jobTypeName}
                  </Link>
                  <span
                    className={`shrink-0 tabular-nums ${
                      type.marginPct < 30 ? "text-fc-danger" : "text-fc-brand"
                    }`}
                  >
                    {type.marginPct.toFixed(1)}%
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-fc-muted">
              Workers driving spikes
            </span>
            <Link
              href="/app/workers?filter=overtime"
              className="text-xs font-medium text-fc-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-1.5">
            {workersDrivingSpikes.length === 0 ? (
              <li className="text-sm text-fc-muted">None</li>
            ) : (
              workersDrivingSpikes.slice(0, 4).map((w) => (
                <li key={w.workerId} className="flex items-center justify-between gap-2 text-sm">
                  <Link
                    href={`/app/workers/${w.workerId}`}
                    className="truncate text-fc-brand hover:text-fc-accent hover:underline"
                  >
                    {w.workerName}
                  </Link>
                  <span className="shrink-0 tabular-nums text-fc-warning">
                    ${w.otCost.toFixed(0)} OT
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
