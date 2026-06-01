"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ConsolePreviewProps = {
  className?: string;
};

const bars = [{ q: 38, a: 62 }, { q: 45, a: 58 }, { q: 30, a: 72 }, { q: 50, a: 55 }, { q: 35, a: 80 }];

export function InstrumentConsolePreview({ className }: ConsolePreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--console-border,#1e2936)]",
        "bg-[var(--console-surface,#0f1620)] shadow-[var(--fc-shadow-panel-lg)]",
        className,
      )}
      aria-label="Live profit dashboard preview"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(100,116,139,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex items-center gap-2 border-b border-[var(--console-border,#1e2936)] bg-[var(--console-bg,#0a0e14)] px-4 py-3">
        <span className="h-[9px] w-[9px] rounded-full bg-red-500" aria-hidden />
        <span className="h-[9px] w-[9px] rounded-full bg-amber-500" aria-hidden />
        <span className="h-[9px] w-[9px] rounded-full bg-green-500" aria-hidden />

        <span className="ml-2 font-mono text-[12px] tracking-[0.08em] text-[var(--console-text-muted,#94a3b8)]">
          profit_dashboard — live
        </span>

        <span className="ml-auto inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[var(--console-safe,#4ade80)]">
          <span
            className="h-[7px] w-[7px] rounded-full bg-[var(--console-safe,#4ade80)]"
            aria-hidden
            style={{
              boxShadow: "0 0 8px rgba(74,222,128,0.8)",
              animation: "fc-console-pulse 1.8s ease-in-out infinite",
            }}
          />
          SYNCED
        </span>
      </div>

      <div className="relative p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative border border-[var(--console-border,#1e2936)] bg-[var(--console-bg,#0a0e14)] p-4">
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-fc-orange-500" aria-hidden />
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--console-text-muted,#94a3b8)]">
              Labor leak / mo
            </div>
            <div className="mt-2 font-display text-[30px] font-extrabold tracking-[-0.03em] text-fc-orange-500 tabular-nums">
              $6,420
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.04em] text-red-700">
              <TrendingDown className="h-[13px] w-[13px]" aria-hidden />
              recoverable
            </div>
          </div>

          <div className="relative border border-[var(--console-border,#1e2936)] bg-[var(--console-bg,#0a0e14)] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--console-text-muted,#94a3b8)]">
              Margin status
            </div>
            <div className="mt-2 font-display text-[30px] font-extrabold tracking-[-0.03em] text-[var(--console-text,#e2e8f0)] tabular-nums">
              68%
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--console-safe,#4ade80)]">
              <TrendingUp className="h-[13px] w-[13px]" aria-hidden />
              +4 pts vs last week
            </div>
          </div>
        </div>

        <div className="mt-3 border border-[var(--console-border,#1e2936)] bg-[var(--console-bg,#0a0e14)] p-4">
          <div className="flex items-baseline justify-between gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--console-text-muted,#94a3b8)]">
              Quoted vs actual hours
            </span>
            <span className="hidden items-center gap-4 font-mono text-[10px] tracking-[0.08em] text-[var(--console-text-muted,#94a3b8)] sm:inline-flex">
              <span className="inline-flex items-center gap-2">
                <i className="h-[9px] w-[9px]" style={{ background: "rgba(100,116,139,0.6)" }} aria-hidden />
                Quoted
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="h-[9px] w-[9px] bg-fc-orange-500" aria-hidden />
                Actual
              </span>
            </span>
          </div>

          <div className="mt-4 flex items-end gap-2 sm:gap-3">
            {bars.map((b, i) => (
              <div key={i} className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex h-24 flex-col justify-end gap-1">
                  <span className="block w-full rounded-[1px] bg-fc-orange-500" style={{ height: `${b.a}%` }} aria-hidden />
                  <span
                    className="block w-full rounded-[1px]"
                    style={{ height: `${b.q}%`, background: "rgba(100,116,139,0.45)" }}
                    aria-hidden
                  />
                </div>
                <span className="text-center font-mono text-[9px] text-[var(--console-steel,#64748b)]">JOB {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fc-console-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="fc-console-pulse"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

