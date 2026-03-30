/**
 * First insight onboarding: trade, workload bands, and generated estimate shapes.
 */

export type TradeType = "hvac" | "plumbing" | "electrical" | "general_contractor" | "other";

export type AverageJobDurationBand = "under_2h" | "hours_2_4" | "hours_4_8" | "full_day_plus";

export type OverrunFrequency = "rarely" | "sometimes" | "often";

export type OvertimeFrequency = "rarely" | "sometimes" | "most_weeks";

export interface OnboardingInsightInputs {
  companyName: string;
  tradeType: TradeType;
  fieldTechCount: number;
  officeStaffCount?: number | null;
  jobsPerWeek: number;
  avgJobDurationBand: AverageJobDurationBand;
  overrunFrequency: OverrunFrequency;
  overtimeFrequency?: OvertimeFrequency | null;
}

/** Persisted + returned to UI; numbers are display-rounded where noted. */
export interface EstimatedSnapshot {
  inputs: OnboardingInsightInputs;
  estimatedJobsPerWeek: number;
  estimatedBaseLabourHours: number;
  estimatedOverrunHours: number;
  estimatedOvertimeHours: number;
  /** Sum of overrun + OT hours — “pressure” metric. */
  estimatedOverrunOvertimePressureHours: number;
  estimatedTotalLabourHours: number;
  estimatedLeakageDollars: number;
  estimatedJobsPerTech: number;
  loadedHourlyCost: number;
}

/** Row from `company_onboarding_profile` (app layer). */
export interface CompanyOnboardingProfile {
  companyId: string;
  companyName: string;
  tradeType: TradeType;
  fieldTechCount: number;
  officeStaffCount: number | null;
  jobsPerWeek: number;
  avgJobDurationBand: AverageJobDurationBand;
  overrunFrequency: OverrunFrequency;
  overtimeFrequency: OvertimeFrequency | null;
  estimatedSnapshot: EstimatedSnapshot;
  onboardingCompletedAt: string | null;
  onboardingStepCompleted: number | null;
  onboardingSeedWorkersCompleted: boolean;
  onboardingSeedJobsCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Threshold: distinct jobs with at least one time entry — then show live dashboard. */
export const REAL_LABOUR_DATA_JOB_THRESHOLD = 3;
