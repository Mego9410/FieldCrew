"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface KpiCardProps {
  title: string;
  primaryValue: string;
  secondaryValue: string;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  warning?: boolean;
  /** 2px top accent stripe for primary metrics */
  primaryMetric?: boolean;
}

export function KpiCard({
  title,
  primaryValue,
  secondaryValue,
  trend,
  href,
  warning = false,
  primaryMetric = false,
}: KpiCardProps) {
  const trendValue = trend?.value ?? 0;
  const isPositive = trendValue >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? "text-fc-success" : "text-fc-danger";

  return (
    <Link
      href={href}
      className={`block border border-fc-border bg-fc-surface transition-shadow hover:shadow-fc-sm ${
        warning ? "border-l-4 border-l-fc-warning" : ""
      } ${primaryMetric ? "border-t-2 border-t-fc-accent" : ""}`}
    >
      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-fc-muted">
            {title}
          </span>
          {warning && <Badge variant="warning">Warning</Badge>}
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-fc-brand">{primaryValue}</p>
        <div className="mt-2 border-b border-fc-border-subtle pb-2" />
        <div className="flex items-end justify-between gap-2">
          <p className="text-xs text-fc-muted">{secondaryValue}</p>
          {trend != null && (
            <span className={`flex shrink-0 items-center gap-0.5 text-[10px] font-semibold ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {isPositive ? "+" : ""}{trendValue.toFixed(1)}% vs {trend.label ?? "last week"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
