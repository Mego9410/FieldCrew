"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { routes } from "@/lib/routes";
import { chartTheme } from "@/components/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type {
  LabourCostTrendPayload,
  KPIBlock,
  BreakdownRowJobType,
  BreakdownRowTechnician,
  BreakdownRowEstimateVsActual,
  Anomaly,
} from "@/lib/labour-cost-trend-types";

const STORAGE_KEY_TARGET = "fieldcrew:labour-cost-trend:targetLabourCostPerJob";
const RANGE_OPTIONS = [30, 90, 180, 365] as const;

function formatCurrency(value: number, currency: string = "GBP"): string {
  const sym = currency === "GBP" ? "£" : "$";
  return `${sym}${Math.round(value).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function DeltaBadge({
  deltaPct,
  className = "",
}: {
  deltaPct: number;
  className?: string;
}) {
  if (deltaPct === 0)
    return (
      <span className={`inline-flex items-center gap-0.5 text-fc-muted ${className}`}>
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  const up = deltaPct > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${up ? "text-fc-warning" : "text-fc-success"} ${className}`}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {formatPct(deltaPct)}
    </span>
  );
}

function SkeletonStrip() {
  return (
    <div className="animate-pulse rounded-lg border border-fc-border bg-fc-surface-muted px-4 py-5 sm:px-6">
      <div className="h-5 w-32 rounded bg-fc-border" />
      <div className="mt-2 h-6 w-48 rounded bg-fc-border" />
      <div className="mt-1 h-4 w-64 rounded bg-fc-border" />
    </div>
  );
}

function PanelAProfitLeakage({
  payload,
  loading,
}: {
  payload: LabourCostTrendPayload | null;
  loading: boolean;
}) {
  if (loading) return <SkeletonStrip />;
  if (!payload) {
    return (
      <div className="rounded-lg border border-[var(--fc-border,#e2e8f0)] bg-[var(--fc-surface,#fff)] px-4 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fc-muted,#64748b)]">
          Profit leakage this period
        </p>
        <p className="mt-2 text-sm text-[var(--fc-muted,#64748b)]">
          Unable to load. Check connection and try again.
        </p>
      </div>
    );
  }
  const { profitLeakage, currency } = payload;
  return (
    <div className="rounded-lg border border-[var(--fc-border,#e2e8f0)] bg-[var(--fc-surface,#fff)] px-4 py-5 shadow-sm sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fc-muted,#64748b)]">
        Profit leakage this period
      </p>
      <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--fc-brand,#0f172a)] sm:text-3xl">
        {formatCurrency(profitLeakage.value, currency)}
      </p>
      <p className="mt-1.5 text-sm text-[var(--fc-muted-strong,#334155)]">{profitLeakage.primaryDriver}</p>
      <p className="mt-0.5 text-sm text-[var(--fc-muted,#64748b)]">Tech impact: {profitLeakage.techImpact}</p>
    </div>
  );
}

function PanelBTrendChart({
  payload,
  targetLabourCostPerJob,
  highlightPeriod,
}: {
  payload: LabourCostTrendPayload | null;
  targetLabourCostPerJob: number | undefined;
  highlightPeriod: { start: string; end: string } | null;
}) {
  const hasTrend = payload && Array.isArray(payload.trend) && payload.trend.length > 0;
  const hasHighlight = highlightPeriod != null && hasTrend;
  if (!hasTrend) {
    return (
      <div className="rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm">
        <p className="text-sm font-medium text-fc-muted">Average labour cost per job</p>
        <p className="mt-4 text-center text-sm text-fc-muted">No trend data for this range.</p>
      </div>
    );
  }

  const chartData = payload.trend.map((p) => ({
    ...p,
    date: p.periodStart,
    value: p.avgLabourCostPerJob,
  }));
  const current = payload.trend[payload.trend.length - 1];
  const previous = payload.trend.length > 1 ? payload.trend[payload.trend.length - 2] : null;
  const deltaPct = previous && previous.avgLabourCostPerJob
    ? ((current!.avgLabourCostPerJob - previous.avgLabourCostPerJob) / previous.avgLabourCostPerJob) * 100
    : 0;
  const deltaAbs = previous ? current!.avgLabourCostPerJob - previous.avgLabourCostPerJob : 0;

  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-fc-brand">Average labour cost per job</p>
        <div className="flex items-center gap-3 text-xs text-fc-muted">
          <span>
            vs prev: <DeltaBadge deltaPct={deltaPct} />
            {deltaAbs !== 0 && (
              <span className="ml-1">
                ({deltaAbs >= 0 ? "+" : ""}{formatCurrency(deltaAbs, payload.currency)})
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              stroke={chartTheme.grid.stroke}
              strokeDasharray={chartTheme.grid.strokeDasharray}
              strokeOpacity={chartTheme.grid.strokeOpacity}
            />
            <XAxis
              dataKey="date"
              tick={chartTheme.axis.tick}
              tickFormatter={(v) =>
                payload.granularity === "week"
                  ? new Date(v).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
                  : new Date(v).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
              }
            />
            <YAxis
              tick={chartTheme.axis.tick}
              width={40}
              tickFormatter={(v) => (payload.currency === "GBP" ? `£${v}` : `$${v}`)}
            />
            <Tooltip
              contentStyle={chartTheme.tooltip.contentStyle}
              labelFormatter={(v) => new Date(v).toLocaleDateString("en-GB")}
              formatter={(value: number | undefined) =>
                value != null
                  ? [formatCurrency(value, payload.currency), "Avg cost/job"]
                  : ["", ""]
              }
            />
            {targetLabourCostPerJob != null && targetLabourCostPerJob > 0 && (
              <ReferenceLine
                y={targetLabourCostPerJob}
                stroke={chartTheme.colors.warning}
                strokeDasharray="4 4"
                strokeWidth={2}
              />
            )}
            {hasHighlight && (
              <ReferenceArea
                x1={highlightPeriod!.start}
                x2={highlightPeriod!.end}
                fill={chartTheme.colors.primary}
                fillOpacity={0.08}
                strokeOpacity={0}
              />
            )}
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
}

function PanelCKPIs({ kpis, currency }: { kpis: KPIBlock; currency: string }) {
  const items = [
    {
      label: "Avg labour cost/job",
      value: formatCurrency(kpis.avgLabourCostPerJob.value, currency),
      deltaPct: kpis.avgLabourCostPerJob.deltaPct,
      pulse: Math.abs(kpis.avgLabourCostPerJob.deltaPct) >= 10,
    },
    {
      label: "Jobs count",
      value: kpis.jobsCount.value.toLocaleString(),
      deltaPct: kpis.jobsCount.deltaPct,
      pulse: Math.abs(kpis.jobsCount.deltaPct) >= 15,
    },
    {
      label: "Overtime cost",
      value: formatCurrency(kpis.overtimeCost.value, currency),
      deltaPct: kpis.overtimeCost.deltaPct,
      pulse: Math.abs(kpis.overtimeCost.deltaPct) >= 10,
    },
    {
      label: "Overtime % of labour",
      value: `${kpis.overtimePctOfLabour.value.toFixed(1)}%`,
      deltaPct: kpis.overtimePctOfLabour.deltaPct,
      pulse: Math.abs(kpis.overtimePctOfLabour.deltaPct) >= 5,
    },
    {
      label: "Avg hours/job",
      value: kpis.avgActualHoursPerJob.value.toFixed(1),
      deltaPct: kpis.avgActualHoursPerJob.deltaPct,
      pulse: Math.abs(kpis.avgActualHoursPerJob.deltaPct) >= 10,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-lg border border-fc-border bg-fc-surface px-4 py-3 shadow-fc-sm transition-shadow hover:shadow-fc-md ${item.pulse ? "ring-1 ring-fc-accent/30" : ""}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-fc-muted">
            {item.label}
          </p>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-fc-brand">
              {item.value}
            </span>
            <DeltaBadge deltaPct={item.deltaPct} className="text-xs" />
          </div>
        </div>
      ))}
    </div>
  );
}

type BreakdownTab = "byJobType" | "byTechnician" | "estVsActual";

function sortByKey<T>(
  rows: T[],
  key: keyof T,
  dir: "asc" | "desc"
): T[] {
  return [...rows].sort((a, b) => {
    const va = a[key] as number | string;
    const vb = b[key] as number | string;
    const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

function PanelDBreakdown({
  payload,
  activeTab,
  onTabChange,
}: {
  payload: LabourCostTrendPayload | null;
  activeTab: BreakdownTab;
  onTabChange: (t: BreakdownTab) => void;
  highlightPeriod?: { start: string; end: string } | null;
}) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const tabs: { id: BreakdownTab; label: string }[] = [
    { id: "byJobType", label: "By job type" },
    { id: "byTechnician", label: "By technician" },
    { id: "estVsActual", label: "Est. vs actual" },
  ];

  const currency = payload?.currency ?? "GBP";

  return (
    <div className="rounded-xl border border-[var(--fc-border,#e2e8f0)] bg-[var(--fc-surface,#fff)] shadow-sm">
      <div className="flex border-b border-[var(--fc-border,#e2e8f0)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors first:rounded-tl-xl ${
              activeTab === tab.id
                ? "border-b-2 border-[var(--fc-accent,#f97316)] bg-[var(--fc-surface-muted,#f1f5f9)]/50 text-[var(--fc-accent,#f97316)]"
                : "text-[var(--fc-muted,#64748b)] hover:bg-[var(--fc-surface-muted,#f1f5f9)]/30 hover:text-[var(--fc-brand,#0f172a)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        {!payload ? (
          <div className="p-6 text-center text-sm text-[var(--fc-muted,#64748b)]">
            No breakdown data for this range.
          </div>
        ) : activeTab === "byJobType" ? (
          <BreakdownTableJobType
            rows={payload.breakdown.byJobType}
            currency={currency}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={(key, dir) => {
              setSortKey(key);
              setSortDir(dir);
            }}
          />
        ) : activeTab === "byTechnician" ? (
          <BreakdownTableTechnician
            rows={payload.breakdown.byTechnician}
            currency={currency}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={(key, dir) => {
              setSortKey(key);
              setSortDir(dir);
            }}
          />
        ) : (
          <BreakdownTableEstVsActual
            rows={payload.breakdown.estVsActual}
            currency={currency}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={(key, dir) => {
              setSortKey(key);
              setSortDir(dir);
            }}
          />
        )}
      </div>
    </div>
  );
}

function BreakdownTableJobType({
  rows,
  currency,
  sortKey,
  sortDir,
  onSort,
}: {
  rows: BreakdownRowJobType[];
  currency: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (key: string, dir: "asc" | "desc") => void;
}) {
  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const k = sortKey as keyof BreakdownRowJobType;
    return sortByKey(rows, k, sortDir);
  }, [rows, sortKey, sortDir]);

  const toggle = (key: string) => {
    const nextDir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    onSort(key, nextDir);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => toggle("jobType")} className="cursor-pointer">Job type</TableHead>
          <TableHead align="right" onClick={() => toggle("avgLabourCostPerJob")} className="cursor-pointer">Avg cost/job</TableHead>
          <TableHead align="right" onClick={() => toggle("deltaPct")} className="cursor-pointer">Δ vs prev</TableHead>
          <TableHead align="right" onClick={() => toggle("jobsCount")} className="cursor-pointer">Jobs</TableHead>
          <TableHead align="right">OT hours</TableHead>
          <TableHead align="right" onClick={() => toggle("impactCost")} className="cursor-pointer">£ impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.jobType}>
            <TableCell className="font-medium">{row.jobType}</TableCell>
            <TableCell align="right">{formatCurrency(row.avgLabourCostPerJob, currency)}</TableCell>
            <TableCell align="right"><DeltaBadge deltaPct={row.deltaPct} /></TableCell>
            <TableCell align="right">{row.jobsCount}</TableCell>
            <TableCell align="right">{row.overtimeHours.toFixed(1)}</TableCell>
            <TableCell align="right">{formatCurrency(row.impactCost, currency)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BreakdownTableTechnician({
  rows,
  currency,
  sortKey,
  sortDir,
  onSort,
}: {
  rows: BreakdownRowTechnician[];
  currency: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (key: string, dir: "asc" | "desc") => void;
}) {
  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const k = sortKey as keyof BreakdownRowTechnician;
    return sortByKey(rows, k, sortDir);
  }, [rows, sortKey, sortDir]);

  const toggle = (key: string) => {
    const nextDir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    onSort(key, nextDir);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead align="right" onClick={() => toggle("avgLabourCostPerJob")} className="cursor-pointer">Avg cost/job</TableHead>
          <TableHead align="right" onClick={() => toggle("deltaPct")} className="cursor-pointer">Δ vs prev</TableHead>
          <TableHead align="right" onClick={() => toggle("jobsCount")} className="cursor-pointer">Jobs</TableHead>
          <TableHead align="right">OT hours</TableHead>
          <TableHead align="right" onClick={() => toggle("overtimeCost")} className="cursor-pointer">OT cost</TableHead>
          <TableHead align="right">£ impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.technicianId}>
            <TableCell className="font-medium">{row.technicianName}</TableCell>
            <TableCell align="right">{formatCurrency(row.avgLabourCostPerJob, currency)}</TableCell>
            <TableCell align="right"><DeltaBadge deltaPct={row.deltaPct} /></TableCell>
            <TableCell align="right">{row.jobsCount}</TableCell>
            <TableCell align="right">{row.overtimeHours.toFixed(1)}</TableCell>
            <TableCell align="right">{formatCurrency(row.overtimeCost, currency)}</TableCell>
            <TableCell align="right">{formatCurrency(row.impactCost, currency)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BreakdownTableEstVsActual({
  rows,
  currency,
  sortKey,
  sortDir,
  onSort,
}: {
  rows: BreakdownRowEstimateVsActual[];
  currency: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (key: string, dir: "asc" | "desc") => void;
}) {
  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const k = sortKey as keyof BreakdownRowEstimateVsActual;
    return sortByKey(rows, k, sortDir);
  }, [rows, sortKey, sortDir]);

  const toggle = (key: string) => {
    const nextDir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    onSort(key, nextDir);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => toggle("periodLabel")} className="cursor-pointer">Period</TableHead>
          <TableHead align="right">Est. hours</TableHead>
          <TableHead align="right">Actual hours</TableHead>
          <TableHead align="right" onClick={() => toggle("varianceHours")} className="cursor-pointer">Variance h</TableHead>
          <TableHead align="right" onClick={() => toggle("variancePct")} className="cursor-pointer">Variance %</TableHead>
          <TableHead align="right" onClick={() => toggle("impactCost")} className="cursor-pointer">£ impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.periodLabel}>
            <TableCell className="font-medium">{row.periodLabel}</TableCell>
            <TableCell align="right">{row.estHours.toFixed(1)}</TableCell>
            <TableCell align="right">{row.actualHours.toFixed(1)}</TableCell>
            <TableCell align="right">{row.varianceHours.toFixed(1)}</TableCell>
            <TableCell align="right">{formatPct(row.variancePct)}</TableCell>
            <TableCell align="right">{formatCurrency(row.impactCost, currency)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PanelEAnomalies({
  anomalies,
  selectedId,
  onSelect,
}: {
  anomalies: Anomaly[];
  selectedId: string | null;
  onSelect: (id: string | null, period: { start: string; end: string } | null) => void;
}) {
  if (!anomalies.length) {
    return (
      <div className="rounded-xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">Alerts / anomalies</p>
        <p className="mt-3 text-sm text-fc-muted">No anomalies in this range.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface shadow-fc-sm">
      <p className="border-b border-fc-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-fc-muted">
        Alerts / anomalies
      </p>
      <ul className="divide-y divide-fc-border-subtle">
        {anomalies.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() =>
                onSelect(
                  selectedId === a.id ? null : a.id,
                  selectedId === a.id ? null : { start: a.periodStart, end: a.periodEnd }
                )
              }
              className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-fc-surface-muted/50 ${
                selectedId === a.id ? "bg-fc-warning-bg/60 ring-inset ring-fc-accent/40" : ""
              } ${a.severity === "warn" ? "text-fc-warning" : "text-fc-info"}`}
            >
              {a.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LabourCostTrendClient() {
  const [rangeDays, setRangeDays] = useState<number>(90);
  const [payload, setPayload] = useState<LabourCostTrendPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [breakdownTab, setBreakdownTab] = useState<BreakdownTab>("byJobType");
  const [highlightPeriod, setHighlightPeriod] = useState<{ start: string; end: string } | null>(null);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [targetLabourCostPerJob, setTargetLabourCostPerJob] = useState<number | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const v = localStorage.getItem(STORAGE_KEY_TARGET);
    if (v == null) return undefined;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : undefined;
  });
  const [targetInput, setTargetInput] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    params.set("rangeDays", String(rangeDays));
    if (targetLabourCostPerJob != null && targetLabourCostPerJob >= 0) {
      params.set("targetLabourCostPerJob", String(targetLabourCostPerJob));
    }
    fetch(`/api/analytics/labour-cost-trend?${params}`)
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok || !Array.isArray(data?.trend) || !data?.kpis) {
          setPayload(null);
          return;
        }
        setPayload(data as LabourCostTrendPayload);
      })
      .catch(() => {
        if (!cancelled) setPayload(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rangeDays, targetLabourCostPerJob]);

  const handleSetTarget = () => {
    const v = parseFloat(targetInput);
    if (!Number.isFinite(v) || v < 0) return;
    setTargetLabourCostPerJob(v);
    try {
      localStorage.setItem(STORAGE_KEY_TARGET, String(v));
    } catch {}
    setTargetInput("");
  };

  const handleAnomalySelect = (id: string | null, period: { start: string; end: string } | null) => {
    setSelectedAnomalyId(id);
    setHighlightPeriod(period);
  };

  return (
    <div className="min-h-full bg-fc-page px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
        Labour cost per job trend
      </h1>
      <p className="mt-1.5 text-sm text-fc-muted">
        Track average labour cost per job, leakage vs target, and what’s driving it.
      </p>

      {/* Panel A: Profit leakage strip — always visible */}
      <section className="mt-6 min-h-[7rem]">
        <PanelAProfitLeakage payload={payload} loading={loading} />
      </section>

      {/* Range toggle + Set target */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-fc-border bg-fc-surface shadow-fc-sm">
          {RANGE_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setRangeDays(d)}
              className={`px-4 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                rangeDays === d
                  ? "bg-fc-accent text-white"
                  : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="target-input" className="text-sm text-fc-muted">Target £/job</label>
          <input
            id="target-input"
            type="number"
            min={0}
            step={10}
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder={targetLabourCostPerJob != null ? String(targetLabourCostPerJob) : "—"}
            className="w-24 rounded border border-fc-border bg-fc-surface px-2 py-1.5 text-sm text-fc-brand"
          />
          <button
            type="button"
            onClick={handleSetTarget}
            className="rounded bg-fc-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-fc-accent-dark"
          >
            Set target
          </button>
        </div>
      </div>

      {/* Panel B (left) + Panel C (right) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PanelBTrendChart
            payload={payload}
            targetLabourCostPerJob={targetLabourCostPerJob}
            highlightPeriod={highlightPeriod}
          />
        </div>
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-[var(--fc-border,#e2e8f0)] bg-[var(--fc-surface-muted,#f1f5f9)]" />
            ))
          ) : payload?.kpis ? (
            <PanelCKPIs kpis={payload.kpis} currency={payload.currency ?? "GBP"} />
          ) : (
            <div className="rounded-lg border border-[var(--fc-border,#e2e8f0)] bg-[var(--fc-surface,#fff)] p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fc-muted,#64748b)]">Current period KPIs</p>
              <p className="mt-3 text-sm text-[var(--fc-muted,#64748b)]">No data for this range.</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel D (left) + Panel E (right) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PanelDBreakdown
            payload={payload?.breakdown ? payload : null}
            activeTab={breakdownTab}
            onTabChange={setBreakdownTab}
          />
        </div>
        <div>
          <PanelEAnomalies
            anomalies={payload?.anomalies ?? []}
            selectedId={selectedAnomalyId}
            onSelect={handleAnomalySelect}
          />
        </div>
      </div>
    </div>
  );
}
