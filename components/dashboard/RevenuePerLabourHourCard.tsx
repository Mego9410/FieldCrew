"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { RPLH_TARGET, type RplhTrendPoint, type RplhDelta } from "@/lib/analytics";
import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { chartTheme } from "@/components/charts";

export interface RevenuePerLabourHourCardProps {
  rplh: number;
  delta: RplhDelta;
  trend: RplhTrendPoint[];
  href: string;
}

export function RevenuePerLabourHourCard({
  rplh,
  delta,
  trend,
  href,
}: RevenuePerLabourHourCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isBelowTarget = rplh < RPLH_TARGET;
  const isPositive = delta.deltaPct >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? "text-fc-success" : "text-fc-danger";

  return (
    <CardLink
      href={href}
      variant={isBelowTarget ? "warning" : "default"}
      className="hover:shadow-fc-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-fc-brand">Revenue per labour hour</h2>
            {isBelowTarget && <Badge variant="warning">Below target</Badge>}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTooltip(!showTooltip);
                }}
                className="text-fc-muted transition-colors duration-fc hover:text-fc-brand"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-6 z-10 w-48 rounded-fc border border-fc-border bg-fc-surface p-2 text-xs shadow-fc-md">
                  <p className="font-medium text-fc-brand">How this is calculated:</p>
                  <p className="mt-1 text-fc-muted">
                    RPLH = Total Job Revenue ÷ Total Labour Hours
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-fc-brand">${rplh.toFixed(0)} / hr</p>
          <p className="mt-1 text-sm text-fc-muted">Target: ${RPLH_TARGET}/hr</p>
          {delta.deltaPct !== 0 && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {isPositive ? "↑" : "↓"} {Math.abs(delta.deltaPct).toFixed(1)}% vs last week
              </span>
            </div>
          )}
        </div>
      </div>

      {trend.length > 0 && (
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="label"
                tick={chartTheme.axis.tick}
                axisLine={chartTheme.axis.axisLine}
                tickLine={chartTheme.axis.tickLine}
              />
              <YAxis
                tick={chartTheme.axis.tick}
                axisLine={chartTheme.axis.axisLine}
                tickLine={chartTheme.axis.tickLine}
                width={35}
                domain={["dataMin - 10", "dataMax + 10"]}
              />
              <Tooltip
                contentStyle={chartTheme.tooltip.contentStyle}
                formatter={(value: number | undefined) => [value != null ? `$${value.toFixed(0)}/hr` : "", "RPLH"]}
              />
              <Line
                type="monotone"
                dataKey="rplh"
                stroke={isBelowTarget ? chartTheme.colors.warning : chartTheme.colors.primary}
                strokeWidth={chartTheme.line.strokeWidth}
                dot={{ r: 2, fill: isBelowTarget ? chartTheme.colors.warning : chartTheme.colors.primary }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardLink>
  );
}
