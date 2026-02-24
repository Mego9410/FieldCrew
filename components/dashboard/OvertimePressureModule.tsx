"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import type { OvertimeWorker } from "@/lib/analytics";

export interface OvertimePressureModuleProps {
  overtimeCost: number;
  overtimeHours: number;
  pctOfPayroll: number;
  overrunCount: number;
  topOvertimeWorker: OvertimeWorker | null;
  href?: string;
}

export function OvertimePressureModule({
  overtimeCost,
  overtimeHours,
  pctOfPayroll,
  overrunCount,
  topOvertimeWorker,
  href = routes.owner.dashboard.overtime,
}: OvertimePressureModuleProps) {
  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
          Overtime
        </p>
        {href && (
          <Link
            href={href}
            className="text-xs font-medium text-fc-accent hover:underline"
          >
            Detail
          </Link>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <p className="font-display text-xl font-semibold tabular-nums text-fc-brand md:text-2xl">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(overtimeCost)}
          </p>
          <p className="text-xs text-fc-muted">
            This week · {overtimeHours.toFixed(1)} OT hrs · {pctOfPayroll.toFixed(0)}% of payroll
          </p>
        </div>
        {topOvertimeWorker && (
          <div className="border-t border-fc-border-subtle pt-3">
            <p className="text-xs text-fc-muted">Top OT worker</p>
            <p className="mt-0.5 text-sm tabular-nums text-fc-brand">
              {topOvertimeWorker.workerName} · ${topOvertimeWorker.otCost.toFixed(0)}
            </p>
          </div>
        )}
        <div className="border-t border-fc-border-subtle pt-3">
          <p className="text-xs text-fc-muted">Jobs exceeding estimate</p>
          <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-fc-brand">
            {overrunCount} jobs
          </p>
        </div>
      </div>
    </div>
  );
}
