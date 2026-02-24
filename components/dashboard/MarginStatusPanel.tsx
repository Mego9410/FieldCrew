"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

export type RiskLevel = "SAFE" | "WATCH" | "CRITICAL";

function getRiskLevel(marginPct: number): RiskLevel {
  if (marginPct >= 45) return "SAFE";
  if (marginPct >= 30) return "WATCH";
  return "CRITICAL";
}

export interface MarginStatusPanelProps {
  labourMarginPct: number;
  revenueThisWeek: number;
  labourCostThisWeek: number;
  revenuePerLabourHour: number;
  href?: string;
}

export function MarginStatusPanel({
  labourMarginPct,
  revenueThisWeek,
  labourCostThisWeek,
  revenuePerLabourHour,
  href = routes.owner.dashboard.margin,
}: MarginStatusPanelProps) {
  const risk = getRiskLevel(labourMarginPct);
  const riskStyles = {
    SAFE: "bg-fc-success-bg text-fc-success",
    WATCH: "bg-fc-warning-bg text-fc-warning",
    CRITICAL: "bg-fc-danger-bg text-fc-danger",
  };

  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
          Margin status
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
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-semibold tabular-nums text-fc-brand md:text-3xl">
          {labourMarginPct.toFixed(1)}%
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${riskStyles[risk]}`}
        >
          {risk}
        </span>
      </div>
      <div className="mt-4 space-y-2 border-t border-fc-border-subtle pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-fc-muted">Revenue</span>
          <span className="tabular-nums text-fc-brand">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(revenueThisWeek)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fc-muted">Labour</span>
          <span className="tabular-nums text-fc-brand">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(labourCostThisWeek)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fc-muted">Rev / labour hr</span>
          <span className="tabular-nums text-fc-accent">
            ${revenuePerLabourHour.toFixed(0)}/hr
          </span>
        </div>
      </div>
    </div>
  );
}
