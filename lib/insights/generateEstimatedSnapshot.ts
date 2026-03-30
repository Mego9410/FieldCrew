import type {
  AverageJobDurationBand,
  EstimatedSnapshot,
  OnboardingInsightInputs,
  OverrunFrequency,
  OvertimeFrequency,
  TradeType,
} from "@/types/onboarding";

function roundHours(n: number): number {
  return Math.round(n * 10) / 10;
}

function roundDollars(n: number): number {
  return Math.round(n);
}

function roundJobsPerTech(n: number): number {
  return Math.round(n * 10) / 10;
}

export function avgHoursForDurationBand(band: AverageJobDurationBand): number {
  switch (band) {
    case "under_2h":
      return 1.5;
    case "hours_2_4":
      return 3;
    case "hours_4_8":
      return 6;
    case "full_day_plus":
      return 8;
    default:
      return 3;
  }
}

export function overrunUplift(f: OverrunFrequency): number {
  switch (f) {
    case "rarely":
      return 0.03;
    case "sometimes":
      return 0.08;
    case "often":
      return 0.15;
    default:
      return 0.08;
  }
}

export function overtimeWeeklyFactor(f: OvertimeFrequency | null | undefined): number {
  switch (f ?? "rarely") {
    case "rarely":
      return 0.02;
    case "sometimes":
      return 0.06;
    case "most_weeks":
      return 0.12;
    default:
      return 0.02;
  }
}

export function loadedLabourCostPerHour(trade: TradeType): number {
  switch (trade) {
    case "hvac":
      return 48;
    case "plumbing":
      return 46;
    case "electrical":
      return 50;
    case "general_contractor":
      return 45;
    case "other":
      return 47;
    default:
      return 47;
  }
}

/**
 * Pure estimate from onboarding answers. Not historical data.
 */
export function generateEstimatedSnapshot(input: OnboardingInsightInputs): EstimatedSnapshot {
  const fieldTechCount = Math.max(1, Math.floor(input.fieldTechCount) || 1);
  const jobsPerWeek = Math.max(0, Math.floor(input.jobsPerWeek) || 0);
  const avgJobHours = avgHoursForDurationBand(input.avgJobDurationBand);
  const uplift = overrunUplift(input.overrunFrequency);
  const otFactor = overtimeWeeklyFactor(input.overtimeFrequency);
  const loadedCost = loadedLabourCostPerHour(input.tradeType);

  const estimatedBaseLabourHours = jobsPerWeek * avgJobHours;
  const estimatedOverrunHours = estimatedBaseLabourHours * uplift;
  const estimatedOvertimeHours = estimatedBaseLabourHours * otFactor;
  const estimatedTotalLabourHours = estimatedBaseLabourHours + estimatedOverrunHours;
  const estimatedOverrunOvertimePressureHours = estimatedOverrunHours + estimatedOvertimeHours;
  const estimatedLeakageDollars =
    estimatedOverrunHours * loadedCost + estimatedOvertimeHours * loadedCost * 0.5;

  const estimatedJobsPerTech = jobsPerWeek / fieldTechCount;

  const inputs: OnboardingInsightInputs = {
    ...input,
    fieldTechCount,
    jobsPerWeek,
    officeStaffCount: input.officeStaffCount ?? null,
    overtimeFrequency: input.overtimeFrequency ?? "rarely",
  };

  return {
    inputs,
    estimatedJobsPerWeek: jobsPerWeek,
    estimatedBaseLabourHours: roundHours(estimatedBaseLabourHours),
    estimatedOverrunHours: roundHours(estimatedOverrunHours),
    estimatedOvertimeHours: roundHours(estimatedOvertimeHours),
    estimatedOverrunOvertimePressureHours: roundHours(estimatedOverrunOvertimePressureHours),
    estimatedTotalLabourHours: roundHours(estimatedTotalLabourHours),
    estimatedLeakageDollars: roundDollars(estimatedLeakageDollars),
    estimatedJobsPerTech: roundJobsPerTech(Number.isFinite(estimatedJobsPerTech) ? estimatedJobsPerTech : 0),
    loadedHourlyCost: loadedCost,
  };
}
