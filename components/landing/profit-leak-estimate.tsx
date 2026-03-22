"use client";

import { useMemo, useState } from "react";
import {
  calculateLeakage,
  DEFAULT_LEAKAGE_INPUTS,
  formatUSD,
  type LeakageInputs,
  type LeakageOutputs,
} from "@/lib/leakageCalculator";

export type SimpleInputs = {
  techs: number;
  hourlyLaborCost: number;
  jobsPerWeek: number;
  overtimeHoursPerWeek: number;
};

const DEFAULT_INPUTS: SimpleInputs = {
  techs: 5,
  hourlyLaborCost: 28,
  jobsPerWeek: 10,
  overtimeHoursPerWeek: 6,
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function toLeakageInputs(inputs: SimpleInputs): LeakageInputs {
  const techs = clamp(Math.floor(inputs.techs), 1, 200);
  const hourlyWage = clamp(inputs.hourlyLaborCost, 10, 150);
  const jobsPerWeek = clamp(inputs.jobsPerWeek, 1, 20000);
  const overtimeHoursPerWeek = clamp(inputs.overtimeHoursPerWeek, 0, 50000);

  const billableRate = clamp(Math.round(hourlyWage * 4.1), 50, 400);
  const jobsPerTechPerWeek = jobsPerWeek / techs;
  const otHoursPerTechPerWeek = overtimeHoursPerWeek / techs;

  return {
    techs,
    hourlyWage,
    billableRate,
    otHoursPerTechPerWeek,
    untrackedHoursPerTechPerWeek:
      DEFAULT_LEAKAGE_INPUTS.untrackedHoursPerTechPerWeek,
    jobOverrunRate: DEFAULT_LEAKAGE_INPUTS.jobOverrunRate,
    avgOverrunHours: DEFAULT_LEAKAGE_INPUTS.avgOverrunHours,
    jobsPerTechPerWeek,
  };
}

export function useProfitLeakEstimate(
  initial?: Partial<SimpleInputs>,
) {
  const [inputs, setInputs] = useState<SimpleInputs>({
    ...DEFAULT_INPUTS,
    ...initial,
  });

  const leakageInputs = useMemo(() => toLeakageInputs(inputs), [inputs]);

  const outputs: LeakageOutputs = useMemo(
    () => calculateLeakage(leakageInputs),
    [leakageInputs],
  );

  const underQuotedLoss = useMemo(
    () => outputs.untrackedTimeRevenue + outputs.jobOverrunWaste,
    [outputs.untrackedTimeRevenue, outputs.jobOverrunWaste],
  );

  return {
    inputs,
    setInputs,
    leakageInputs,
    outputs,
    underQuotedLoss,
    formatUnderQuoted: formatUSD(underQuotedLoss),
    formatOvertime: outputs.formatted.overtimePremiumWaste,
    formatTotal: outputs.formatted.totalRecoverableProfit,
  };
}

export function ProfitLeakField({
  label,
  value,
  min,
  max,
  stepValue,
  unit,
  onChange,
  inputId,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  stepValue?: number;
  unit?: string;
  inputId: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-xs font-semibold text-fc-muted">
        {label}
      </label>
      <div className="flex items-baseline gap-2">
        <input
          id={inputId}
          type="number"
          min={min}
          max={max}
          step={stepValue ?? 1}
          value={value}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (!Number.isNaN(v)) onChange(v);
          }}
          className="w-full rounded-lg border border-fc-border bg-white px-4 py-2.5 text-sm font-semibold tabular-nums text-fc-brand placeholder:text-slate-400 focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/30"
        />
        {unit ? <span className="text-sm text-fc-muted">{unit}</span> : null}
      </div>
    </div>
  );
}
