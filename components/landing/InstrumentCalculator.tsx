"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type SliderSpec = {
  label: string;
  foot: string;
  unit?: "$" | "%" | "";
  accent?: boolean;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  step?: number;
};

function formatUsd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function InstrumentSlider({ label, foot, unit = "", accent, min, max, value, step = 1, onChange }: SliderSpec) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const updateFromClientX = React.useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const p = clamp((clientX - r.left) / r.width, 0, 1);
      const raw = min + p * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(snapped, min, max));
    },
    [max, min, onChange, step],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromClientX(e.clientX);
  };

  const valueLabel = unit === "$" ? `$${value}` : unit ? `${value}${unit}` : `${value}`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-6">
        <span className="text-sm font-medium text-[var(--console-text-muted,#94a3b8)]">{label}</span>
        <span
          className={cn(
            "font-display text-xl font-extrabold tracking-[-0.02em] tabular-nums text-[var(--console-text,#e2e8f0)]",
            accent && "text-fc-orange-500",
          )}
        >
          {valueLabel}
        </span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onChange(clamp(value - step, min, max));
          if (e.key === "ArrowRight") onChange(clamp(value + step, min, max));
        }}
        className={cn(
          "relative mt-2 h-[18px] cursor-pointer select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-fc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--console-surface,#0f1620)]",
        )}
      >
        <div className="absolute left-0 right-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-[var(--console-border,#1e2936)]" />
        <div
          className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-fc-orange-500"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <div className="absolute inset-[3px] rounded-full ring-[3px] ring-fc-orange-500" aria-hidden />
        </div>
      </div>

      <p className="text-[13px] leading-5 text-[var(--console-steel,#64748b)]">{foot}</p>
    </div>
  );
}

export function InstrumentCalculator() {
  const [techs, setTechs] = React.useState(10);
  const [rate, setRate] = React.useState(38);
  const [overrun, setOverrun] = React.useState(14);

  const hrsMo = 168;
  const leak = Math.round(techs * rate * (overrun / 100) * hrsMo);
  const otShare = Math.round(leak * 0.42);
  const quoteShare = Math.round(leak * 0.58);

  return (
    <section id="calculator" className="relative overflow-hidden bg-fc-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid" aria-hidden style={{ opacity: 0.06 }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <header className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <span className="h-px w-6 bg-fc-orange-500" aria-hidden />
            THE 60‑SECOND CHECK
          </div>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-white">
            In 60 seconds, see your number
          </h2>
          <p className="mt-5 text-[19px] leading-7 text-slate-400">
            Three questions about your crew. We&apos;ll estimate the profit you&apos;re losing to under-quoted jobs and
            overtime — every month.
          </p>
        </header>

        <div
          className={cn(
            "mx-auto mt-12 grid max-w-5xl grid-cols-1 overflow-hidden rounded-[var(--fc-radius-lg)]",
            "border border-[var(--console-border,#1e2936)] bg-[var(--console-surface,#0f1620)] shadow-[var(--fc-shadow-panel-lg)]",
            "lg:grid-cols-[1.15fr_0.85fr]",
          )}
        >
          <div className="relative border-b border-[var(--console-border,#1e2936)] p-7 sm:p-9 lg:border-b-0 lg:border-r">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-orange-500">YOUR CREW</div>
            <h3 className="mt-2 font-display text-[22px] font-bold tracking-[-0.02em] text-[var(--console-text,#e2e8f0)]">
              Tell us about your shop
            </h3>

            <div className="mt-7 space-y-6">
              <InstrumentSlider
                label="Field technicians"
                value={techs}
                min={2}
                max={20}
                unit=""
                foot="Crews of 2–20 see the biggest leak"
                onChange={setTechs}
              />
              <InstrumentSlider
                label="Avg. billed labor rate"
                value={rate}
                min={20}
                max={75}
                unit="$"
                foot="Per technician hour"
                accent
                onChange={setRate}
              />
              <InstrumentSlider
                label="Avg. job time overrun"
                value={overrun}
                min={4}
                max={30}
                unit="%"
                foot="How much actual time runs over your quote"
                onChange={setOverrun}
              />
            </div>
          </div>

          <div className="relative bg-[var(--console-bg,#0a0e14)] p-7 sm:p-9">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--console-text-muted,#94a3b8)]">
              Estimated monthly leak
            </div>
            <div className="mt-2 font-display text-[clamp(3rem,4vw+1rem,4.4rem)] font-extrabold tracking-[-0.04em] leading-none text-fc-orange-500 tabular-nums">
              {formatUsd(leak)}
            </div>
            <div className="mt-2 text-sm text-[var(--console-steel,#64748b)]">≈ {formatUsd(leak * 12)} / year unrecovered</div>

            <div className="mt-6 divide-y divide-[var(--console-border,#1e2936)] border-y border-[var(--console-border,#1e2936)]">
              <div className="flex items-center justify-between gap-6 py-3.5">
                <span className="text-[13px] text-[var(--console-text-muted,#94a3b8)]">Lost to under-quoting</span>
                <span className="font-display text-base font-bold tabular-nums text-fc-orange-500">{formatUsd(quoteShare)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 py-3.5">
                <span className="text-[13px] text-[var(--console-text-muted,#94a3b8)]">Lost to overtime / overruns</span>
                <span className="font-display text-base font-bold tabular-nums text-fc-orange-500">{formatUsd(otShare)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 py-3.5">
                <span className="text-[13px] text-[var(--console-text-muted,#94a3b8)]">Recoverable with FieldCrew</span>
                <span className="font-display text-base font-bold tabular-nums text-[var(--console-text,#e2e8f0)]">~70%</span>
              </div>
            </div>

            <div className="mt-7">
              <Link
                href={routes.owner.subscribe}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-fc-orange-500 px-6 text-[15px] font-bold text-fc-navy-950 transition hover:bg-fc-orange-600 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-[var(--console-bg,#0a0e14)]"
              >
                Build my profit report <ArrowRight className="ml-2 h-[18px] w-[18px]" aria-hidden />
              </Link>
              <p className="mt-3 text-center text-[13px] text-[var(--console-steel,#64748b)]">
                Free · no card ·{" "}
                <Link
                  href={routes.public.sampleReport}
                  className="font-semibold text-fc-orange-400 underline decoration-fc-orange-400 underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-[var(--console-bg,#0a0e14)]"
                >
                  want to see an example report first?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

