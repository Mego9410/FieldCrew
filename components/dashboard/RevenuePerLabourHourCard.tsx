"use client";

import Link from "next/link";
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
  const trendColor = isPositive ? "text-emerald-600" : "text-red-600";

  return (
    <Link
      href={href}
      className={`group block rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        isBelowTarget ? "border-amber-300 border-2" : "border-fc-border"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-fc-brand">Revenue per Labour Hour</h2>
            {isBelowTarget && (
              <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Below target
              </span>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTooltip(!showTooltip);
                }}
                className="text-fc-muted hover:text-fc-brand"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-6 z-10 w-48 rounded-lg border border-fc-border bg-white p-2 text-xs shadow-lg">
                  <p className="font-medium text-fc-brand">How this is calculated:</p>
                  <p className="mt-1 text-fc-muted">
                    RPLH = Total Job Revenue ÷ Total Labour Hours
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-3xl font-bold text-fc-brand">${rplh.toFixed(0)} / hr</p>
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

      {/* Sparkline chart */}
      {trend.length > 0 && (
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={35}
                domain={["dataMin - 10", "dataMax + 10"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`$${value.toFixed(0)}/hr`, "RPLH"]}
              />
              <Line
                type="monotone"
                dataKey="rplh"
                stroke={isBelowTarget ? "#f59e0b" : "#6366f1"}
                strokeWidth={2}
                dot={{ r: 2, fill: isBelowTarget ? "#f59e0b" : "#6366f1" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Link>
  );
}
