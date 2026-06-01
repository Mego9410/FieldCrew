"use client";

import Link from "next/link";
import {
  Activity,
  Banknote,
  BellRing,
  CalendarCheck,
  FileSpreadsheet,
  FileWarning,
  Gauge,
  Layers,
  MoveRight,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

function Eyebrow({ children, tone }: { children: string; tone: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]",
        tone === "dark" ? "text-slate-400" : "text-fc-muted",
      )}
    >
      <span className="h-px w-[22px] bg-fc-orange-500" aria-hidden />
      {children}
    </div>
  );
}

export function InstrumentScaleSection() {
  const points = [
    {
      Icon: Layers,
      title: "It compounds across every job",
      body: "A few unbilled hours here, an overtime catch-up there — across 200+ jobs a year it adds up fast.",
    },
    {
      Icon: FileWarning,
      title: "Under-quoting hides the loss",
      body: "The job looked profitable on paper. The actual labor cost tells a different story.",
    },
    {
      Icon: Activity,
      title: "Busy shops lose the most",
      body: "More volume means more places for margin to leak unnoticed. Growth without visibility is risk.",
    },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-fc-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid" aria-hidden style={{ opacity: 0.06 }} />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow tone="dark">THE SCALE</Eyebrow>
            <h2 className="mt-4 max-w-[14ch] font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-white">
              This isn&apos;t a small problem
            </h2>
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {points.map(({ Icon, title, body }) => (
                <li key={title} className="flex gap-4 py-5">
                  <span
                    className="mt-0.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[var(--fc-radius)] bg-fc-orange-500/15 text-fc-orange-500"
                    aria-hidden
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "relative overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--console-border,#1e2936)]",
              "bg-[var(--console-surface,#0f1620)] p-10 shadow-[var(--fc-shadow-panel)]",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(100,116,139,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.16) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative text-xs font-semibold uppercase tracking-[0.14em] text-[var(--console-text-muted,#94a3b8)]">
              EST. ANNUAL LEAK · US HVAC CONTRACTORS
            </div>
            <div className="relative mt-4 font-display text-[clamp(3rem,5vw+1rem,5.4rem)] font-extrabold tracking-[-0.04em] leading-none text-fc-orange-500 tabular-nums">
              $450M–$600M
            </div>
            <p className="relative mt-4 max-w-xl text-sm leading-6 text-[var(--console-text-muted,#94a3b8)]">
              Lost across small HVAC businesses every year to labor inefficiency that never shows up on an invoice.
            </p>

            <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-[var(--console-border,#1e2936)]">
              <span
                className="block h-full w-[78%] rounded-full"
                style={{ background: "linear-gradient(90deg, var(--fc-accent), #fbbf24)" }}
                aria-hidden
              />
            </div>
            <div className="relative mt-3 flex items-center justify-between gap-6 text-[11px] font-semibold tracking-[0.08em] text-[var(--console-steel,#64748b)]">
              <span>RECOVERABLE WITH JOB‑LEVEL VISIBILITY</span>
              <span>~70%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstrumentCompareSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <header className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="light">WHAT IT LOOKS LIKE</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-fc-brand">
            What this looks like in a real business
          </h2>
          <p className="mt-5 text-[19px] leading-7 text-fc-muted">One 10-tech shop. The quote said one thing. The clock said another.</p>
        </header>

        <div className="mt-12 grid items-center gap-7 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-[var(--fc-radius-lg)] border border-fc-border bg-white p-8 shadow-fc-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-muted">QUOTED LABOR</div>
            <div className="mt-3 font-display text-[clamp(2.2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] text-fc-brand tabular-nums">
              $2,000–$5,000
            </div>
            <p className="mt-3 text-sm leading-6 text-fc-muted">
              What the job was priced to cost in technician time, per month of similar work.
            </p>
            <div className="mt-6 h-[3px] w-14 bg-fc-steel-500" aria-hidden />
          </div>

          <div className="flex flex-col items-center gap-2 text-fc-orange-500">
            <MoveRight className="h-8 w-8" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Reality</span>
          </div>

          <div className="rounded-[var(--fc-radius-lg)] border border-fc-border bg-white p-8 shadow-fc-lg">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-muted">ACTUAL LABOR</div>
            <div className="mt-3 font-display text-[clamp(2.2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] text-fc-orange-500 tabular-nums">
              $6,000–$10,000
            </div>
            <p className="mt-3 text-sm leading-6 text-fc-muted">
              What it really cost once overruns and overtime landed — the gap is your leak.
            </p>
            <div className="mt-6 h-[3px] w-14 bg-fc-orange-500" aria-hidden />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[15px] leading-7 text-fc-muted">
          That gap doesn&apos;t show up on one invoice. It shows up at the end of the quarter —{" "}
          <span className="font-semibold text-fc-brand">as the margin that never arrived.</span>
        </p>
      </div>
    </section>
  );
}

export function InstrumentHowItWorks() {
  const steps = [
    {
      num: "STEP 01",
      Icon: Users,
      title: "Add your crew",
      body: "Set up your technicians in minutes. No app installs for the field — they clock in however they already do.",
      tag: "Setup ~5 minutes",
    },
    {
      num: "STEP 02",
      Icon: Gauge,
      title: "Track quoted vs actual",
      body: "FieldCrew matches real labor time against what each job was quoted at — live, as work happens.",
      tag: "Updates in real time",
    },
    {
      num: "STEP 03",
      Icon: Banknote,
      title: "Run payroll with context",
      body: "See labor cost per job, catch overruns early, and export QuickBooks-ready payroll in a click.",
      tag: "QuickBooks-ready",
    },
  ] as const;

  return (
    <section id="how" className="bg-[var(--fc-bg-page)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <header className="max-w-2xl">
          <Eyebrow tone="light">HOW FIELDCREW HELPS</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-fc-brand">
            From clock-in to margin, in three moves
          </h2>
          <p className="mt-5 text-[19px] leading-7 text-fc-muted">
            No spreadsheets. No new habits for your crew. Just the job context payroll always missed.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map(({ num, Icon, title, body, tag }) => (
            <div
              key={num}
              className="rounded-[var(--fc-radius-lg)] border border-fc-border bg-white p-8 shadow-fc-sm transition hover:-translate-y-1 hover:shadow-fc-lg"
            >
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-fc-orange-500">{num}</div>
              <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--fc-radius)] bg-fc-navy-900 text-white">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.02em] text-fc-brand">{title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-fc-muted">{body}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fc-success">
                <span className="h-[7px] w-[7px] rounded-full bg-fc-success" aria-hidden />
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstrumentReassurance() {
  const pills = [
    { Icon: Smartphone, title: "No app installs for workers" },
    { Icon: FileSpreadsheet, title: "QuickBooks-ready exports" },
    { Icon: BellRing, title: "Overrun + OT leakage alerts" },
    { Icon: CalendarCheck, title: "Owner-friendly weekly pulse" },
    { Icon: Zap, title: "Set up in an afternoon" },
    { Icon: ShieldCheck, title: "Your data stays yours" },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-fc-navy-950 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid" aria-hidden style={{ opacity: 0.06 }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow tone="dark">BUILT FOR THE VAN, NOT THE DESK</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-white">
              For busy HVAC teams, not software experts
            </h2>
            <p className="mt-5 max-w-[34rem] text-[19px] leading-7 text-slate-400">
              No onboarding marathon. No training. Just plug in your crew and start seeing where the money goes — from
              your phone, between jobs.
            </p>

            <div className="mt-7">
              <Link
                href={routes.owner.subscribe}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-fc-orange-500 px-6 text-[15px] font-bold text-fc-navy-950 transition hover:bg-fc-orange-600 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
              >
                Start for $9
              </Link>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {pills.map(({ Icon, title }) => (
              <li
                key={title}
                className="flex items-center gap-3 rounded-[var(--fc-radius)] border border-white/15 bg-fc-navy-900/50 px-4 py-4 text-sm font-medium text-slate-200"
              >
                <Icon className="h-[18px] w-[18px] text-fc-orange-500" aria-hidden />
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

