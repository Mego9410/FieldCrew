"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Clock,
  LayoutDashboard,
  PieChart,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DemoViewId = "overview" | "margin" | "labour" | "overtime";

const VIEWS: {
  id: DemoViewId;
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    id: "overview",
    label: "Dashboard",
    path: "/app",
    icon: LayoutDashboard,
  },
  {
    id: "margin",
    label: "Margin",
    path: "/app/dashboard/margin",
    icon: PieChart,
  },
  {
    id: "labour",
    label: "Labour cost",
    path: "/app/dashboard/labour-cost-trend",
    icon: BarChart3,
  },
  {
    id: "overtime",
    label: "Overtime",
    path: "/app/dashboard/overtime",
    icon: Clock,
  },
];

function BrowserChrome({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/[0.06]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-3 py-2.5 sm:px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        </div>
        <div className="ml-1 min-w-0 flex-1 rounded-md border border-slate-200/80 bg-white px-3 py-1.5 font-mono text-[10px] text-slate-500 sm:text-xs">
          <span className="text-slate-400">fieldcrew.app</span>
          <span className="text-slate-600">{path}</span>
        </div>
      </div>
      <div className="bg-gradient-to-b from-slate-50/50 to-white p-3 sm:p-4 md:p-5">
        {children}
      </div>
    </div>
  );
}

function MockOverview() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Recoverable profit
          </p>
          <p className="font-display text-2xl font-bold tabular-nums text-fc-brand sm:text-3xl">
            $6,420<span className="text-base font-normal text-slate-500">/mo</span>
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200/80">
          Labour leakage
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm sm:p-3">
          <p className="text-[10px] font-medium text-slate-500">OT premium</p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums text-fc-orange-500">
            $1,180
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm sm:p-3">
          <p className="text-[10px] font-medium text-slate-500">Under-quoted</p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums text-fc-orange-500">
            $5,240
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-2 text-center">
        <p className="text-[10px] text-slate-500">
          Live totals roll up from jobs, timesheets, and quotes.
        </p>
      </div>
    </div>
  );
}

function MockMargin() {
  const rows = [
    { name: "Service", margin: 42, risk: "ok" },
    { name: "Install", margin: 28, risk: "watch" },
    { name: "Maintenance", margin: 51, risk: "ok" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-700">
        <TrendingDown className="h-4 w-4 text-fc-accent" aria-hidden />
        <p className="text-xs font-semibold">Where margin is thinnest</p>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-[10px] font-medium text-slate-600 sm:text-xs">
              {r.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full",
                  r.risk === "watch" ? "bg-amber-400" : "bg-emerald-500/90",
                )}
                style={{ width: `${Math.min(r.margin, 100)}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-[10px] tabular-nums text-slate-700 sm:text-xs">
              {r.margin}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Job-type margin shows which work is quietly eroding profit — before
        month-end.
      </p>
    </div>
  );
}

/** Sample week: labour cost index vs weekly plan (illustrative, not live data). */
const LABOUR_WEEK_DEMO: { day: string; actual: number }[] = [
  { day: "Mon", actual: 48 },
  { day: "Tue", actual: 55 },
  { day: "Wed", actual: 44 },
  { day: "Thu", actual: 72 },
  { day: "Fri", actual: 63 },
  { day: "Sat", actual: 58 },
  { day: "Sun", actual: 78 },
];
const PLAN_LEVEL = 46;

function MockLabour() {
  const maxVal = Math.max(
    ...LABOUR_WEEK_DEMO.map((d) => d.actual),
    PLAN_LEVEL,
  );
  const planFromBottomPct = (PLAN_LEVEL / maxVal) * 100;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-base font-bold tracking-tight text-fc-brand sm:text-lg">
          Labour cost vs plan
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[10px] text-slate-500 sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-gradient-to-t from-fc-accent to-fc-accent/50" />
            Actual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-7 border-t border-dashed border-slate-500/70" />
            Plan
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-100/95 to-slate-50/90 p-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] sm:p-4">
        <div className="relative mx-auto h-[11.5rem] w-full max-w-md sm:h-44">
          <div className="absolute inset-x-0 top-0 bottom-7">
            <div
              className="pointer-events-none absolute inset-0 flex justify-between"
              aria-hidden
            >
              {LABOUR_WEEK_DEMO.map((_, i) => (
                <div
                  key={i}
                  className="h-full flex-1 border-l border-slate-300/20 first:border-l-0"
                />
              ))}
            </div>

            <div
              className="pointer-events-none absolute left-0 right-0 z-[1] border-t border-dashed border-slate-500/60"
              style={{ bottom: `${planFromBottomPct}%` }}
            >
              <span className="absolute -right-0.5 -top-2 rounded bg-slate-100/95 px-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                Plan
              </span>
            </div>

            <div className="absolute inset-0 z-[2] flex items-end justify-between gap-1 sm:gap-1.5">
              {LABOUR_WEEK_DEMO.map((row) => (
                <div
                  key={row.day}
                  className="flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  <div
                    className="mx-auto w-[72%] max-w-[2.5rem] rounded-t-sm bg-gradient-to-t from-fc-accent to-fc-accent/45 shadow-sm"
                    style={{
                      height: `${(row.actual / maxVal) * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-0.5">
            {LABOUR_WEEK_DEMO.map((row) => (
              <span
                key={row.day}
                className="min-w-0 flex-1 text-center font-medium text-[10px] leading-none text-slate-600 sm:text-[11px]"
              >
                {row.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-slate-500 sm:text-xs">
        Trend view makes drift visible early — not after payroll closes.
      </p>
    </div>
  );
}

function MockOvertime() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-medium text-slate-500">OT hours (wk)</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-fc-brand">
            24
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-medium text-slate-500">Target</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-slate-400 line-through decoration-slate-300">
            12
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-red-50/80 px-3 py-2 ring-1 ring-red-100">
        <p className="text-[10px] font-semibold text-red-900">
          Premium cost ≈ $424 this week
        </p>
        <p className="mt-0.5 text-[10px] text-red-800/90">
          Tie overtime back to jobs driving the overrun.
        </p>
      </div>
    </div>
  );
}

function DemoViewport({ id }: { id: DemoViewId }) {
  switch (id) {
    case "overview":
      return <MockOverview />;
    case "margin":
      return <MockMargin />;
    case "labour":
      return <MockLabour />;
    case "overtime":
      return <MockOvertime />;
    default:
      return null;
  }
}

/**
 * Interactive browser-style preview of FieldCrew app surfaces (dashboard,
 * margin, labour, overtime). Registry install for ruixen featured-crm-demo-section
 * is often incomplete; this matches the intent with FieldCrew routes and tokens.
 */
export function FeaturedCrmDemoSection({ className }: { className?: string }) {
  const [active, setActive] = useState<DemoViewId>("overview");
  const path = VIEWS.find((v) => v.id === active)?.path ?? "/app";

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex flex-wrap gap-1.5 border-b border-slate-200/80 pb-3 sm:gap-2"
        role="tablist"
        aria-label="App preview pages"
      >
        {VIEWS.map((v) => {
          const Icon = v.icon;
          const selected = active === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(v.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:text-xs",
                selected
                  ? "bg-fc-accent text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200/90 hover:bg-slate-50",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4">
        <BrowserChrome path={path}>
          <div
            role="tabpanel"
            className="min-h-[220px] sm:min-h-[280px]"
            aria-label={VIEWS.find((v) => v.id === active)?.label}
          >
            <DemoViewport id={active} />
          </div>
        </BrowserChrome>
      </div>

      <p className="mt-3 text-center text-xs text-fc-muted">
        Illustrative UI — numbers are sample layout, not your data.
      </p>
    </div>
  );
}
