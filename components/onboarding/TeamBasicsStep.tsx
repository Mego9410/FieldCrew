"use client";

import type { OnboardingInsightInputs, TradeType } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const TRADES: { value: TradeType; label: string }[] = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "general_contractor", label: "General contractor" },
  { value: "other", label: "Other" },
];

export interface TeamBasicsStepProps {
  value: Pick<
    OnboardingInsightInputs,
    "companyName" | "tradeType" | "fieldTechCount" | "officeStaffCount"
  >;
  onChange: (v: TeamBasicsStepProps["value"]) => void;
  errors?: Partial<Record<keyof TeamBasicsStepProps["value"], string>>;
}

export function TeamBasicsStep({ value, onChange, errors }: TeamBasicsStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-fc-brand">
          Company name <span className="text-red-600">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          autoComplete="organization"
          value={value.companyName}
          onChange={(e) => onChange({ ...value, companyName: e.target.value })}
          className="mt-2 w-full rounded-2xl border border-fc-border bg-fc-surface px-4 py-3 text-fc-brand shadow-fc-sm placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
          placeholder="e.g. Northside Mechanical"
        />
        {errors?.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
      </div>

      <div>
        <label htmlFor="fieldTechs" className="block text-sm font-medium text-fc-brand">
          Number of field techs <span className="text-red-600">*</span>
        </label>
        <p className="mt-0.5 text-xs text-fc-muted">You can change this later.</p>
        <div className="mt-2 flex max-w-xs items-center gap-3">
          <input
            id="fieldTechs"
            type="number"
            min={1}
            max={500}
            value={value.fieldTechCount}
            onChange={(e) =>
              onChange({ ...value, fieldTechCount: Math.max(1, Number(e.target.value) || 1) })
            }
            className="w-full rounded-2xl border border-fc-border bg-fc-surface px-4 py-3 text-fc-brand shadow-fc-sm focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
          />
        </div>
        {errors?.fieldTechCount && <p className="mt-1 text-sm text-red-600">{errors.fieldTechCount}</p>}
      </div>

      <div>
        <label htmlFor="officeStaff" className="block text-sm font-medium text-fc-brand">
          Office / admin staff
        </label>
        <p className="mt-0.5 text-xs text-fc-muted">Optional — helps us understand team shape later.</p>
        <input
          id="officeStaff"
          type="number"
          min={0}
          max={500}
          value={value.officeStaffCount ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...value,
              officeStaffCount: v === "" ? null : Math.max(0, Number(v) || 0),
            });
          }}
          placeholder="0"
          className="mt-2 max-w-xs rounded-2xl border border-fc-border bg-fc-surface px-4 py-3 text-fc-brand shadow-fc-sm focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-fc-brand">
          Main trade / service type <span className="text-red-600">*</span>
        </p>
        <p className="mt-0.5 text-xs text-fc-muted">We’ll use this for a realistic loaded labour rate estimate.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {TRADES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ ...value, tradeType: t.value })}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all sm:min-w-[140px]",
                value.tradeType === t.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand ring-2 ring-fc-accent/30"
                  : "border-fc-border bg-fc-surface text-fc-muted-strong hover:border-fc-accent/40 hover:bg-fc-surface-muted"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {errors?.tradeType && <p className="mt-1 text-sm text-red-600">{errors.tradeType}</p>}
      </div>
    </div>
  );
}
