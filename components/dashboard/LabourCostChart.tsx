"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "@/components/charts";
import type { ChartDataPoint } from "@/lib/analytics";
import { routes } from "@/lib/routes";

export interface LabourCostChartProps {
  data: ChartDataPoint[];
  href?: string;
}

export function LabourCostChart({ data, href = routes.owner.dashboard.labourCostTrend }: LabourCostChartProps) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  const chart = (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
          Labour cost per job
        </p>
        {href && (
          <span className="text-xs font-medium text-fc-accent hover:underline">
            Detail
          </span>
        )}
      </div>
      <p className="mb-2 text-xs text-fc-muted">Rolling 30 days</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sorted}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke={chartTheme.grid.stroke}
              strokeDasharray={chartTheme.grid.strokeDasharray}
              strokeOpacity={chartTheme.grid.strokeOpacity}
              vertical
              horizontal
            />
            <XAxis
              dataKey="date"
              tick={chartTheme.axis.tick}
              tickCount={6}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tick={chartTheme.axis.tick}
              width={36}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={chartTheme.tooltip.contentStyle}
              labelFormatter={(v) => new Date(v).toLocaleDateString()}
              formatter={(value: number | undefined) =>
                value != null ? [`$${value.toFixed(0)}`, "Avg cost"] : ["", ""]
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartTheme.colors.primary}
              strokeWidth={chartTheme.line.strokeWidth}
              dot={chartTheme.line.dot}
              activeDot={chartTheme.line.activeDot}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block">{chart}</Link> : chart;
}
