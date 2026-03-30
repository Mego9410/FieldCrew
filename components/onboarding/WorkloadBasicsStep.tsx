"use client";

import type {
  AverageJobDurationBand,
  OnboardingInsightInputs,
  OverrunFrequency,
  OvertimeFrequency,
} from "@/types/onboarding";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS: { value: AverageJobDurationBand; label: string }[] = [
  { value: "under_2h", label: "Under 2 hours" },
  { value: "hours_2_4", label: "2–4 hours" },
  { value: "hours_4_8", label: "4–8 hours" },
  { value: "full_day_plus", label: "Full day +" },
];

const OVERRUN_OPTIONS: { value: OverrunFrequency; label: string }[] = [
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
];

const OT_OPTIONS: { value: OvertimeFrequency; label: string }[] = [
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Sometimes" },
  { value: "most_weeks", label: "Most weeks" },
];

const PRESSURE_PRESETS = [5, 15, 30];

export interface WorkloadBasicsStepProps {
  value: Pick<
    OnboardingInsightInputs,
    "jobsPerWeek" | "avgJobDurationBand" | "overrunFrequency" | "overtimeFrequency"
  >;
  onChange: (v: WorkloadBasicsStepProps["value"]) => void;
  errors?: Partial<Record<keyof WorkloadBasicsStepProps["value"], string>>;
}

export function WorkloadBasicsStep({ value, onChange, errors }: WorkloadBasicsStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-fc-brand">
          Jobs completed per week <span className="text-red-600">*</span>
        </p>
        <p className="mt-0.5 text-xs text-fc-muted">Rough average is fine.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESSURE_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...value, jobsPerWeek: n })}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                value.jobsPerWeek === n
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand"
                  : "border-fc-border bg-fc-surface text-fc-muted-strong hover:bg-fc-surface-muted"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={500}
          value={value.jobsPerWeek}
          onChange={(e) => onChange({ ...value, jobsPerWeek: Math.max(1, Number(e.target.value) || 1) })}
          className="mt-3 max-w-xs rounded-2xl border border-fc-border bg-fc-surface px-4 py-3 text-fc-brand shadow-fc-sm focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
        />
        {errors?.jobsPerWeek && <p className="mt-1 text-sm text-red-600">{errors.jobsPerWeek}</p>}
      </div>

      <div>
        <p className="text-sm font-medium text-fc-brand">
          Average job duration <span className="text-red-600">*</span>
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => onChange({ ...value, avgJobDurationBand: d.value })}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all",
                value.avgJobDurationBand === d.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand ring-2 ring-fc-accent/30"
                  : "border-fc-border bg-fc-surface text-fc-muted-strong hover:border-fc-accent/40"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-fc-brand">
          How often jobs run over estimate <span className="text-red-600">*</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {OVERRUN_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange({ ...value, overrunFrequency: o.value })}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                value.overrunFrequency === o.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand ring-2 ring-fc-accent/30"
                  : "border-fc-border bg-fc-surface text-fc-muted-strong hover:bg-fc-surface-muted"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-fc-brand">Do you regularly use overtime?</p>
        <p className="mt-0.5 text-xs text-fc-muted">Optional — default is rarely.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {OT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange({ ...value, overtimeFrequency: o.value })}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                (value.overtimeFrequency ?? "rarely") === o.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand ring-2 ring-fc-accent/30"
                  : "border-fc-border bg-fc-surface text-fc-muted-strong hover:bg-fc-surface-muted"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
