"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

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
      <div className="flex items-center justify-between border-b border-fc-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-fc-muted" aria-hidden />
          <span className="font-body text-sm font-semibold text-fc-brand">
            Clock in
          </span>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-fc-muted">
            Job Code <span className="text-fc-accent">*</span>
          </label>
          <div className="rounded-md border-2 border-amber-300 bg-amber-50/50 px-3 py-2 text-sm text-fc-muted">
            No job selected — can&apos;t clock in
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-fc-muted">
            Tech
          </label>
          <div className="rounded-md border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand">
            Mike S.
          </div>
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-md border border-fc-border bg-slate-100 px-4 py-2.5 text-sm font-semibold text-fc-muted"
        >
          Start
        </button>
        <p className="text-center text-xs text-fc-muted">
          Uncoded time prevented: <span className="fc-money text-fc-brand">6.4 hrs / week</span>
        </p>
      </div>
    </>
  );
}

function CostPerJobView() {
  return (
    <>
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <h3 className="font-display text-sm font-bold text-fc-brand">
          Job Profit Snapshot
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded-md border border-fc-border bg-white p-3 shadow-sm">
          <p className="font-body text-sm font-semibold text-fc-brand">
            Service Call — Westheimer Rd
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <dt className="text-fc-muted">Labour</dt>
            <dd className="fc-money text-fc-brand text-sm">$312</dd>
            <dt className="text-fc-muted">Materials</dt>
            <dd className="fc-money text-fc-brand text-sm">$118</dd>
            <dt className="text-fc-muted">Revenue</dt>
            <dd className="fc-money text-fc-brand text-sm">$650</dd>
            <dt className="text-fc-muted">Labour Margin</dt>
            <dd className="fc-money fc-money-accent text-sm">52%</dd>
          </dl>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-800">
          3 jobs this week ran +25% over estimate
        </div>
      </div>
    </>
  );
}

function PayrollReadyView() {
  return (
    <>
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <h3 className="font-display text-sm font-bold text-fc-brand">
          Payroll export
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded-md border border-fc-border bg-white p-3">
          <div className="flex items-center gap-2 text-fc-brand">
            <FileSpreadsheet className="h-4 w-4 text-fc-accent" aria-hidden />
            <span className="text-sm font-semibold">Week ending 02/28/26</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-fc-muted">
            <li>Regular hours: 320</li>
            <li>OT hours: 42</li>
          </ul>
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-fc-accent px-3 py-2 text-xs font-semibold text-white"
          >
            Export
          </button>
          <p className="mt-2 text-[10px] text-fc-muted">
            Ready for QuickBooks / Gusto / ADP
          </p>
        </div>
        <p className="text-xs text-fc-muted">No manual timesheet cleanup</p>
      </div>
    </>
  );
}

function LeakageFinderView() {
  const alerts = [
    "Drive time logged to jobs — 4.2 hrs",
    "Missing job codes — 3.1 hrs",
    "Return visit not attributed — $420",
    "OT stacking on overruns — $980",
  ];
  return (
    <>
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <h3 className="font-display text-sm font-bold text-fc-brand">
          Leakage alerts
        </h3>
      </div>
      <div className="space-y-2 px-4 py-4">
        <ul className="space-y-2">
          {alerts.map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" aria-hidden />
              <span className="text-fc-neutral">{text}</span>
            </li>
          ))}
        </ul>
        <p className="rounded-[var(--fc-radius)] border border-fc-accent/30 bg-fc-accent/5 px-3 py-2 text-center text-xs font-semibold text-fc-brand">
          Recovered profit opportunity: <span className="fc-money-accent text-sm">$1,605</span> (weekly)
        </p>
      </div>
    </>
  );
}

function ForemanAccessView() {
  return (
    <>
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <h3 className="font-display text-sm font-bold text-fc-brand">
          Foreman link
        </h3>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded-md border border-fc-border bg-white p-3">
          <label className="mb-1.5 block text-xs font-semibold text-fc-muted">
            Send foreman link
          </label>
          <input
            type="text"
            readOnly
            value="fieldcrew.com/w/foreman-abc"
            className="w-full rounded-md border border-fc-border bg-slate-50 px-3 py-2 text-xs text-fc-muted"
          />
          <p className="mt-2 text-[10px] text-fc-muted">No app install needed</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded bg-fc-accent/10 px-2 py-1 text-[10px] font-medium text-fc-accent">
              Approve OT
            </span>
            <span className="rounded bg-fc-accent/10 px-2 py-1 text-[10px] font-medium text-fc-accent">
              Fix job code
            </span>
            <span className="rounded bg-fc-accent/10 px-2 py-1 text-[10px] font-medium text-fc-accent">
              See overruns
            </span>
          </div>
        </div>
        <p className="text-xs text-fc-muted">
          Fix issues same-day, not month-end
        </p>
      </div>
    </>
  );
}

function WeeklyPulseView() {
  return (
    <>
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-fc-accent" aria-hidden />
          <h3 className="font-display text-sm font-bold text-fc-brand">
            Weekly summary
          </h3>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="rounded-[var(--fc-radius)] border border-fc-border bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fc-muted">Overtime cost</p>
          <p className="fc-money mt-1 text-xl text-fc-brand">$2,880</p>
        </div>
        <div className="rounded-md border border-fc-border bg-slate-50 p-3 text-xs">
          <p className="font-semibold text-fc-brand">Top 3 overruns</p>
          <ul className="mt-1 list-inside list-disc text-fc-muted">
            <li>Westheimer Rd — +2.5 hrs</li>
            <li>Main St Install — +1.8 hrs</li>
            <li>Oak Service — +1.2 hrs</li>
          </ul>
        </div>
        <p className="text-xs text-fc-muted">Unbilled hours: <strong className="text-fc-brand">9.5</strong></p>
        <div className="rounded-md border border-fc-accent/30 bg-fc-accent/5 px-3 py-2 text-xs font-medium text-fc-brand">
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  const activeId = VIEWS[activeIndex].id;

  const handleTabClick = useCallback((index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 200);
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
    <div className="relative w-full overflow-hidden rounded-[var(--fc-radius)] bg-white">
      {/* App window top bar */}
      <div className="flex items-center gap-2 border-b border-fc-border bg-slate-100 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
        </div>
        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-fc-muted">Owner View</span>
      </div>

      {/* Module header — structured */}
      <div className="border-b border-fc-border bg-white px-4 py-3">
        <h2 className="font-display text-sm font-bold text-fc-brand">
          Click a view to see how profit is recovered.
        </h2>
      </div>

      {/* Tabs: segmented control */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Owner view options"
        className="flex flex-wrap gap-0 border-b border-fc-border bg-slate-50 px-2 py-2 overflow-x-auto snap-x snap-mandatory"
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
              className={`snap-start shrink-0 flex items-center gap-1.5 rounded-[var(--fc-radius)] px-3 py-2.5 text-xs font-medium transition-all duration-150 -mb-px ${
                isActive
                  ? "border-b-2 border-fc-accent bg-white text-fc-brand font-bold shadow-sm"
                  : "text-fc-muted hover:text-fc-brand hover:bg-white/70"
              }`}
            >
              {isActive && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent"
                  aria-hidden
                />
              )}
              <span className="hidden sm:inline">{view.label}</span>
              <span className="sm:hidden">{view.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Corner metric — prominent */}
      <div className="absolute right-3 top-14 rounded-[var(--fc-radius)] bg-fc-accent/15 px-2.5 py-1.5 text-xs font-bold text-fc-accent">
        Recovered this month: $6,420
      </div>

      {/* Panel content */}
      <div
        ref={panelRef}
        id={`hero-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`hero-tab-${activeIndex}`}
        className="min-h-[320px] bg-white transition-opacity duration-200 rounded-b-[var(--fc-radius)]"
        style={{ opacity: isTransitioning ? 0.85 : 1 }}
      >
        {renderViewContent(activeId)}
      </div>
    </div>
  );
}
