"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  BarChart3,
  Check,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

const VIEWS = [
  { id: "clock-in", label: "Clock-In Control", shortLabel: "Clock-In" },
  { id: "cost-per-job", label: "Cost Per Job", shortLabel: "Cost Per Job" },
  { id: "payroll-ready", label: "Payroll Ready", shortLabel: "Payroll" },
  { id: "leakage-finder", label: "Leakage Finder", shortLabel: "Leakage" },
  { id: "foreman-access", label: "Foreman Access", shortLabel: "Foreman" },
  { id: "weekly-pulse", label: "Weekly Pulse", shortLabel: "Pulse" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

function ClockInControlView() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-fc-steel-500" aria-hidden />
          <span className="text-sm font-semibold text-slate-200">Clock in</span>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-fc-steel-500">
            Job Code <span className="text-fc-orange-500">*</span>
          </label>
          <div className="rounded border-2 border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-slate-300">
            No job selected — can&apos;t clock in
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-fc-steel-500">
            Tech
          </label>
          <div className="rounded border border-fc-steel-600 bg-fc-navy-800 px-3 py-2 text-sm text-slate-200">
            Mike S.
          </div>
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded border border-fc-steel-600 bg-fc-navy-800 py-2.5 text-sm font-semibold text-fc-steel-500"
        >
          Start
        </button>
        <div className="pt-2">
          <p className="mb-1.5 text-center text-xs text-fc-steel-500">
            Uncoded time prevented:{" "}
            <CountUp value={6.4} suffix=" hrs / week" decimals={1} trigger={true} className="font-bold text-fc-orange-500" />
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-fc-navy-800">
            <motion.div
              className="h-full rounded-full bg-fc-orange-500/80"
              initial={{ width: 0 }}
              animate={{ width: "64%" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function CostPerJobView() {
  const labour = 312;
  const materials = 118;
  const revenue = 650;
  const maxVal = revenue;
  return (
    <>
      <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <h3 className="font-display text-sm font-bold text-slate-200">
          Job Profit Snapshot
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded border border-fc-steel-600/50 bg-fc-navy-800/50 p-3">
          <p className="text-sm font-semibold text-slate-200">
            Service Call — Westheimer Rd
          </p>
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-fc-steel-500">Labor</span>
                <span className="text-slate-300">$312</span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-fc-navy-900">
                <motion.div
                  className="h-full rounded-full bg-slate-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(labour / maxVal) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-fc-steel-500">Materials</span>
                <span className="text-slate-300">$118</span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-fc-navy-900">
                <motion.div
                  className="h-full rounded-full bg-slate-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(materials / maxVal) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-fc-steel-500">Revenue</span>
                <span className="text-slate-300">$650</span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-fc-navy-900">
                <motion.div
                  className="h-full rounded-full bg-fc-steel-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs">
            <span className="text-fc-steel-500">Labor Margin </span>
            <span className="font-bold text-fc-orange-500">52%</span>
          </p>
        </div>
        <div className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
          3 jobs this week ran +25% over estimate
        </div>
      </div>
    </>
  );
}

function PayrollReadyView() {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setChecked(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <h3 className="font-display text-sm font-bold text-slate-200">
          Payroll export
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded border border-fc-steel-600/50 bg-fc-navy-800/50 p-3">
          <div className="flex items-center gap-2 text-slate-200">
            <FileSpreadsheet className="h-4 w-4 text-fc-orange-500" aria-hidden />
            <span className="text-sm font-semibold">Week ending 02/28/26</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-fc-steel-500">
            <li>Regular hours: 320</li>
            <li>OT hours: 42</li>
          </ul>
          <button
            type="button"
            className="mt-3 w-full rounded bg-fc-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-fc-orange-600"
          >
            Export
          </button>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-fc-steel-500">
            <motion.span
              initial={false}
              animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            </motion.span>
            Ready for QuickBooks / Gusto / ADP
          </div>
        </div>
        <p className="text-xs text-fc-steel-500">No manual timesheet cleanup</p>
      </div>
    </>
  );
}

const leakageSources = [
  { label: "Drive time", value: 4.2, unit: "hrs" },
  { label: "Missing codes", value: 3.1, unit: "hrs" },
  { label: "Return visit", value: 420, unit: "$" },
  { label: "OT stacking", value: 980, unit: "$" },
];
function LeakageFinderView() {
  const alerts = [
    "Drive time logged to jobs — 4.2 hrs",
    "Missing job codes — 3.1 hrs",
    "Return visit not attributed — $420",
    "OT stacking on overruns — $980",
  ];
  return (
    <>
      <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <h3 className="font-display text-sm font-bold text-slate-200">
          Leakage alerts
        </h3>
      </div>
      <div className="space-y-2 px-4 py-4">
        <ul className="space-y-2">
          {alerts.map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs"
            >
              <AlertTriangle
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400"
                aria-hidden
              />
              <span className="text-slate-300">{text}</span>
            </li>
          ))}
        </ul>
        <div className="rounded border border-fc-orange-500/30 bg-fc-orange-500/10 px-3 py-2 text-center">
          <p className="text-xs font-semibold text-slate-200">
            Recovered profit opportunity:{" "}
            <CountUp
              value={1605}
              prefix="$"
              suffix=" (weekly)"
              trigger={true}
              className="text-fc-orange-500"
            />
          </p>
        </div>
        <div className="space-y-1.5 pt-1">
          {leakageSources.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-20 truncate text-[10px] text-fc-steel-500">
                {s.label}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-fc-navy-800">
                <motion.div
                  className="h-full rounded-full bg-amber-500/60"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(s.value / (s.unit === "$" ? 980 : 4.2)) * 25}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ForemanAccessView() {
  return (
    <>
      <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <h3 className="font-display text-sm font-bold text-slate-200">
          Foreman link
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded border border-fc-steel-600/50 bg-fc-navy-800/50 p-3">
          <label className="mb-1.5 block text-xs font-semibold text-fc-steel-500">
            Send foreman link
          </label>
          <input
            type="text"
            readOnly
            value="fieldcrew.com/w/foreman-abc"
            className="w-full rounded border border-fc-steel-600 bg-fc-navy-900 px-3 py-2 text-xs text-fc-steel-500"
          />
          <p className="mt-2 text-[10px] text-fc-steel-500">
            No app install needed
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded bg-fc-orange-500/20 px-2 py-1 text-[10px] font-medium text-fc-orange-500">
              Approve OT
            </span>
            <span className="rounded bg-fc-orange-500/20 px-2 py-1 text-[10px] font-medium text-fc-orange-500">
              Fix job code
            </span>
            <span className="rounded bg-fc-orange-500/20 px-2 py-1 text-[10px] font-medium text-fc-orange-500">
              See overruns
            </span>
          </div>
        </div>
        <p className="text-xs text-fc-steel-500">
          Fix issues same-day, not month-end
        </p>
      </div>
    </>
  );
}

const pulseData = [100, 85, 90, 70, 95, 88, 75];

function WeeklyPulseView() {
  return (
    <>
      <div className="border-b border-fc-navy-800 bg-fc-navy-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-fc-orange-500" aria-hidden />
          <h3 className="font-display text-sm font-bold text-slate-200">
            Weekly summary
          </h3>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded border border-fc-steel-600/50 bg-fc-navy-800/50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fc-steel-500">
            Overtime cost
          </p>
          <p className="fc-display-number mt-1 text-xl text-slate-200">
            <CountUp value={2880} prefix="$" trigger={true} />
          </p>
        </div>
        <div className="flex h-8 items-end gap-0.5">
          {pulseData.map((val, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-fc-orange-500/60"
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              style={{ minHeight: "4px" }}
            />
          ))}
        </div>
        <div className="rounded border border-fc-steel-600/50 bg-fc-navy-800/30 p-3 text-xs">
          <p className="font-semibold text-slate-200">Top 3 overruns</p>
          <ul className="mt-1 list-inside list-disc text-fc-steel-500">
            <li>Westheimer Rd — +2.5 hrs</li>
            <li>Main St Install — +1.8 hrs</li>
            <li>Oak Service — +1.2 hrs</li>
          </ul>
        </div>
        <p className="text-xs text-fc-steel-500">
          Unbilled hours: <strong className="text-slate-200">9.5</strong>
        </p>
        <div className="rounded border border-fc-orange-500/30 bg-fc-orange-500/10 px-3 py-2 text-xs font-medium text-slate-200">
          This week&apos;s action: review top 5 overruns
        </div>
      </div>
    </>
  );
}

function renderViewContent(id: ViewId) {
  switch (id) {
    case "clock-in":
      return <ClockInControlView />;
    case "cost-per-job":
      return <CostPerJobView />;
    case "payroll-ready":
      return <PayrollReadyView />;
    case "leakage-finder":
      return <LeakageFinderView />;
    case "foreman-access":
      return <ForemanAccessView />;
    case "weekly-pulse":
      return <WeeklyPulseView />;
    default:
      return <ClockInControlView />;
  }
}

export function HeroViewSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const activeId = VIEWS[activeIndex].id;

  const handleTabClick = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const count = VIEWS.length;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % count);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i + count - 1) % count);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(count - 1);
      }
    },
    []
  );

  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current.setAttribute("aria-labelledby", `hero-tab-${activeIndex}`);
  }, [activeIndex]);

  return (
    <div className="relative w-full overflow-hidden rounded-[var(--fc-radius)] bg-fc-navy-900">
      {/* Inner grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />

      {/* App window top bar — Labor Control System */}
      <div className="relative flex items-center justify-between border-b border-fc-navy-800 bg-fc-navy-800 px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-fc-steel-600" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-fc-steel-600" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-fc-steel-600" aria-hidden />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-fc-steel-500">
            LABOUR CONTROL SYSTEM v1.02
          </span>
          <span className="hidden text-[10px] text-fc-steel-500 sm:inline">
            Houston — 10 Techs
          </span>
        </div>
        <div className="rounded bg-fc-orange-500/20 px-2.5 py-1.5 text-xs font-bold text-fc-orange-500">
          Recovered this month:{" "}
          <CountUp value={6420} prefix="$" trigger={true} />
        </div>
      </div>

      {/* Tabs — sliding underline */}
      <div
        role="tablist"
        aria-label="Labor control views"
        className="relative flex flex-wrap gap-0 border-b border-fc-navy-800 bg-fc-navy-800/70 px-2 py-0 overflow-x-auto scrollbar-dark"
        onKeyDown={handleKeyDown}
      >
        {VIEWS.map((view, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={view.id}
              id={`hero-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`hero-panel-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(i)}
              className={`relative shrink-0 px-3 py-3 text-xs font-medium transition-colors -mb-px ${
                isActive
                  ? "text-fc-orange-500"
                  : "text-fc-steel-500 hover:text-slate-300"
              }`}
            >
              <span className="hidden sm:inline">{view.label}</span>
              <span className="sm:hidden">{view.shortLabel}</span>
              {isActive && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-fc-orange-500"
                  layoutId="hero-tab-underline"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 30 }
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel content — animated swap */}
      <div
        ref={panelRef}
        id={`hero-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`hero-tab-${activeIndex}`}
        className="relative min-h-[320px] rounded-b-[var(--fc-radius)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, x: 8 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{
              duration: 0.2,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {renderViewContent(activeId)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
