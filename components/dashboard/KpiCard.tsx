"use client";

import Link from "next/link";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface KpiCardProps {
  title: string;
  primaryValue: string;
  secondaryValue: string;
  trend?: {
    value: number; // percentage change
    label?: string;
  };
  icon: LucideIcon;
  href: string;
  warning?: boolean;
}

export function KpiCard({
  title,
  primaryValue,
  secondaryValue,
  trend,
  icon: Icon,
  href,
  warning = false,
}: KpiCardProps) {
  const trendValue = trend?.value ?? 0;
  const isPositive = trendValue >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? "text-emerald-600" : "text-red-600";

  return (
    <Link
      href={href}
      className={`group block rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        warning ? "border-amber-300 border-2" : "border-fc-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm font-medium text-fc-muted">{title}</p>
            {warning && (
              <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Warning
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-fc-brand">{primaryValue}</p>
          <p className="mt-2 text-sm text-fc-muted">{secondaryValue}</p>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {isPositive ? "↑" : "↓"} {Math.abs(trendValue).toFixed(1)}% vs {trend.label ?? "last week"}
              </span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}
