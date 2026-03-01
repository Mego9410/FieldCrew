/**
 * Labour leakage calculator: overtime premium, untracked time, job overruns.
 * Uses 4.33 weeks per month. All currency rounded to whole dollars.
 */

const WEEKS_PER_MONTH = 4.33;

export interface LeakageInputs {
  techs: number;
  hourlyWage: number;
  billableRate: number;
  otHoursPerTechPerWeek: number;
  untrackedHoursPerTechPerWeek: number;
  jobOverrunRate: number;
  avgOverrunHours: number;
  jobsPerTechPerWeek: number;
}

export interface LeakageOutputs {
  overtimePremiumWaste: number;
  untrackedTimeRevenue: number;
  jobOverrunWaste: number;
  totalRecoverableProfit: number;
  monthlyHoursLoggedEstimate: number;
  overrunJobsEstimate: number;
  /** Formatted USD strings for display */
  formatted: {
    overtimePremiumWaste: string;
    untrackedTimeRevenue: string;
    jobOverrunWaste: string;
    totalRecoverableProfit: string;
  };
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(n: number): string {
  return usd.format(Math.round(n));
}

function clampInputs(inputs: LeakageInputs): LeakageInputs {
  return {
    techs: Math.max(1, Math.min(200, Math.floor(inputs.techs))),
    hourlyWage: Math.max(10, Math.min(150, inputs.hourlyWage)),
    billableRate: Math.max(50, Math.min(400, inputs.billableRate)),
    otHoursPerTechPerWeek: Math.max(0, Math.min(30, inputs.otHoursPerTechPerWeek)),
    untrackedHoursPerTechPerWeek: Math.max(0, Math.min(10, inputs.untrackedHoursPerTechPerWeek)),
    jobOverrunRate: Math.max(0, Math.min(100, inputs.jobOverrunRate)),
    avgOverrunHours: Math.max(0, Math.min(10, inputs.avgOverrunHours)),
    jobsPerTechPerWeek: Math.max(1, Math.min(100, Math.floor(inputs.jobsPerTechPerWeek))),
  };
}

/**
 * OT premium = 0.5 × wage (time-and-a-half).
 * OvertimePremiumWaste = techs * otHoursPerTechPerWeek * hourlyWage * 0.5 * weeksPerMonth
 */
export function calculateLeakage(inputs: LeakageInputs): LeakageOutputs {
  const i = clampInputs(inputs);

  const overtimePremiumWaste = Math.round(
    i.techs * i.otHoursPerTechPerWeek * i.hourlyWage * 0.5 * WEEKS_PER_MONTH
  );

  const untrackedTimeRevenue = Math.round(
    i.techs * i.untrackedHoursPerTechPerWeek * i.billableRate * WEEKS_PER_MONTH
  );

  const totalJobsPerMonth = i.techs * i.jobsPerTechPerWeek * WEEKS_PER_MONTH;
  const overrunJobsEstimate = Math.round(totalJobsPerMonth * (i.jobOverrunRate / 100));
  const jobOverrunWaste = Math.round(
    overrunJobsEstimate * i.avgOverrunHours * i.billableRate
  );

  const totalRecoverableProfit = overtimePremiumWaste + untrackedTimeRevenue + jobOverrunWaste;
  const monthlyHoursLoggedEstimate = Math.round(i.techs * 40 * WEEKS_PER_MONTH);

  return {
    overtimePremiumWaste,
    untrackedTimeRevenue,
    jobOverrunWaste,
    totalRecoverableProfit,
    monthlyHoursLoggedEstimate,
    overrunJobsEstimate,
    formatted: {
      overtimePremiumWaste: usd.format(overtimePremiumWaste),
      untrackedTimeRevenue: usd.format(untrackedTimeRevenue),
      jobOverrunWaste: usd.format(jobOverrunWaste),
      totalRecoverableProfit: usd.format(totalRecoverableProfit),
    },
  };
}

/** Fixed Houston 10-tech example for the sample report narrative. Total = $6,420. */
export interface SampleReportData {
  companyLabel: string;
  location: string;
  month: string;
  techs: number;
  wage: number;
  billableRate: number;
  /** Monthly OT hours (actual) for narrative */
  otActualHours: number;
  otPlannedHours: number;
  otExcessHours: number;
  otPremiumCost: number;
  overrunJobs: number;
  avgOverrunHours: number;
  jobOverrunWaste: number;
  untrackedHoursPerTechPerWeek: number;
  untrackedTimeRevenue: number;
  totalRecoverableProfit: number;
  /** 12-month impact */
  twelveMonthImpact: number;
}

export function getHoustonSampleReport(): SampleReportData {
  const otExcessHours = 92;
  const otPremiumCost = Math.round(otExcessHours * 28 * 0.5); // 1288
  const overrunJobs = 17;
  const avgOverrunHours = 1.8;
  const jobOverrunWaste = 17 * 1.8 * 115; // 3519
  const untrackedTimeRevenue = 1613; // so total = 6420 (1288 + 3519 + 1613)
  const totalRecoverableProfit = 6420;

  return {
    companyLabel: "10-Tech HVAC Company",
    location: "Houston, TX",
    month: "September",
    techs: 10,
    wage: 28,
    billableRate: 115,
    otActualHours: 182,
    otPlannedHours: 90,
    otExcessHours: 92,
    otPremiumCost,
    overrunJobs,
    avgOverrunHours,
    jobOverrunWaste,
    untrackedHoursPerTechPerWeek: 0.75,
    untrackedTimeRevenue,
    totalRecoverableProfit,
    twelveMonthImpact: totalRecoverableProfit * 12,
  };
}

export const DEFAULT_LEAKAGE_INPUTS: LeakageInputs = {
  techs: 10,
  hourlyWage: 28,
  billableRate: 115,
  otHoursPerTechPerWeek: 2.0,
  untrackedHoursPerTechPerWeek: 0.75,
  jobOverrunRate: 18,
  avgOverrunHours: 1.8,
  jobsPerTechPerWeek: 10,
};
