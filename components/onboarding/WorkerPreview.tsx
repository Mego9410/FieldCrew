"use client";

import { Card } from "@/components/ui/Card";
import { Smartphone, Clock, Play, ClipboardList } from "lucide-react";

/**
 * Mini replica of the actual worker app (clock screen) so the onboarding
 * preview shows the real FieldCrew worker experience inside the phone.
 */
export function WorkerPreview() {
  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-12">
      <div className="relative">
        <div className="rounded-[2rem] border-4 border-fc-brand/20 bg-fc-brand p-2 shadow-xl">
          <div className="h-[460px] w-[240px] overflow-hidden rounded-[1.5rem] bg-fc-page">
            {/* Worker app header (matches WorkerHeader) */}
            <header className="border-b border-fc-border bg-fc-surface">
              <div className="flex h-12 items-center justify-between px-3">
                <span className="font-display text-sm font-semibold text-fc-brand">FieldCrew</span>
                <span className="text-xs text-fc-muted">Hi, Alex</span>
              </div>
            </header>
            {/* Worker clock screen (matches app/w/[token]/clock) */}
            <div className="flex flex-1 flex-col overflow-auto bg-fc-page px-3 py-4">
              <div className="mb-3">
                <h1 className="font-display text-base font-bold text-fc-brand">Clock in / out</h1>
                <p className="mt-0.5 text-[10px] text-fc-muted">
                  Your shift control. Clock in on a job, then clock out with notes.
                </p>
              </div>
              <div className="mb-4 rounded-lg border border-fc-border bg-fc-surface p-4">
                <div className="mb-4 flex h-14 items-center justify-center rounded border border-fc-border bg-fc-surface-muted">
                  <Clock className="h-6 w-6 text-fc-muted" />
                </div>
                <p className="mb-3 text-center text-xs font-semibold text-fc-brand">Clocked out</p>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-fc-muted">
                  Job
                </label>
                <div className="mb-3 flex items-center gap-2 rounded border border-fc-border bg-fc-surface py-2 pl-2.5 pr-2 text-[11px] text-fc-brand">
                  <ClipboardList className="h-3.5 w-3.5 shrink-0 text-fc-muted" />
                  <span className="truncate">123 Main St — HVAC install</span>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded bg-fc-accent py-2.5 text-xs font-semibold text-white"
                  aria-hidden
                >
                  <Play className="h-3.5 w-3.5" />
                  Clock in
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border border-fc-border bg-fc-surface p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-fc-muted">Today</p>
                  <p className="text-sm font-bold text-fc-brand">0.0 hrs</p>
                </div>
                <div className="rounded border border-fc-border bg-fc-surface p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-fc-muted">This week</p>
                  <p className="text-sm font-bold text-fc-brand">0.0 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 rounded-full bg-fc-surface p-2 shadow-md">
          <Smartphone className="h-5 w-5 text-fc-muted" />
        </div>
      </div>

      <Card variant="muted" className="max-w-sm p-6">
        <h3 className="font-semibold text-fc-brand">2 taps to track</h3>
        <p className="mt-2 text-sm text-fc-muted">
          Your crew clocks in, picks a job, and clocks out. Low friction — no long forms.
        </p>
      </Card>
    </div>
  );
}
