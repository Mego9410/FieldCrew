/**
 * Static data for the standalone Sample Monthly Labour Profit Report page.
 * Bayou Air & Heat, Houston TX, February 2026, 10 techs.
 * OT total aligns to $12,480; recovered opportunity $6,420.
 */

export interface OvertimeRow {
  tech: string;
  regularHrs: number;
  otHrs: number;
  otCost: number;
  primaryDriver: string;
}

export interface JobOverrunRow {
  job: string;
  type: string;
  estimatedHrs: number;
  actualHrs: number;
  overrunHrs: number;
  labourImpact: number;
  notes: string;
}

export interface LeakageItem {
  label: string;
  impact: number;
}

export interface SampleReportData {
  company: string;
  location: string;
  period: string;
  teamSize: string;
  summary: {
    totalRevenue: number;
    totalLabourCost: number;
    grossLabourMarginPct: number;
    overtimeCost: number;
    unbilledLabourHours: number;
    recoveredProfitOpportunity: number;
  };
  overtimeBreakdown: OvertimeRow[];
  jobOverruns: JobOverrunRow[];
  leakageSources: LeakageItem[];
  recoveredExplanation: string;
  recommendations: string[];
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function getSampleReportData(): SampleReportData {
  return {
    company: "Bayou Air & Heat",
    location: "Houston, TX",
    period: "February 2026",
    teamSize: "10 Techs",
    summary: {
      totalRevenue: 320_000,
      totalLabourCost: 148_000,
      grossLabourMarginPct: 53.8,
      overtimeCost: 12_480,
      unbilledLabourHours: 42,
      recoveredProfitOpportunity: 6_420,
    },
    // OT cost at 1.5x rate; total = $12,480
    overtimeBreakdown: [
      { tech: "Mike S.", regularHrs: 152, otHrs: 43, otCost: 1806, primaryDriver: "Callbacks" },
      { tech: "James R.", regularHrs: 160, otHrs: 38, otCost: 1596, primaryDriver: "Emergency calls" },
      { tech: "Carlos M.", regularHrs: 156, otHrs: 35, otCost: 1470, primaryDriver: "Overruns" },
      { tech: "Sarah K.", regularHrs: 160, otHrs: 32, otCost: 1344, primaryDriver: "Weekend install" },
      { tech: "David L.", regularHrs: 158, otHrs: 30, otCost: 1260, primaryDriver: "Callbacks" },
      { tech: "Tony W.", regularHrs: 160, otHrs: 28, otCost: 1176, primaryDriver: "Late finish" },
      { tech: "Jose P.", regularHrs: 160, otHrs: 26, otCost: 1092, primaryDriver: "Drive time" },
      { tech: "Chris B.", regularHrs: 160, otHrs: 24, otCost: 1008, primaryDriver: "Same-day add" },
      { tech: "Marcus T.", regularHrs: 160, otHrs: 22, otCost: 924, primaryDriver: "Overspill" },
      { tech: "Lee N.", regularHrs: 160, otHrs: 20, otCost: 846, primaryDriver: "Admin" },
    ],
    jobOverruns: [
      { job: "Westheimer Rd — Install", type: "Install", estimatedHrs: 8, actualHrs: 11.5, overrunHrs: 3.5, labourImpact: 403, notes: "No parts staged" },
      { job: "Main St — Service", type: "Service", estimatedHrs: 2, actualHrs: 4.2, overrunHrs: 2.2, labourImpact: 253, notes: "Return trip" },
      { job: "Oak Ave — Install", type: "Install", estimatedHrs: 6, actualHrs: 8.5, overrunHrs: 2.5, labourImpact: 288, notes: "Scope mismatch" },
      { job: "Pine Rd — Maintenance", type: "Maintenance", estimatedHrs: 1.5, actualHrs: 3.8, overrunHrs: 2.3, labourImpact: 265, notes: "Additional repair" },
      { job: "Elm St — Service", type: "Service", estimatedHrs: 2, actualHrs: 3.5, overrunHrs: 1.5, labourImpact: 173, notes: "No job code first visit" },
      { job: "Cedar Blvd — Install", type: "Install", estimatedHrs: 10, actualHrs: 12, overrunHrs: 2, labourImpact: 230, notes: "Permit delay" },
      { job: "Maple Dr — Service", type: "Service", estimatedHrs: 1.5, actualHrs: 3, overrunHrs: 1.5, labourImpact: 173, notes: "Return visit not attributed" },
      { job: "Birch Ln — Install", type: "Install", estimatedHrs: 7, actualHrs: 8.5, overrunHrs: 1.5, labourImpact: 173, notes: "Missing equipment" },
      { job: "Willow Way — Maintenance", type: "Maintenance", estimatedHrs: 2, actualHrs: 3.2, overrunHrs: 1.2, labourImpact: 138, notes: "Drive time on job" },
      { job: "Ash St — Service", type: "Service", estimatedHrs: 1, actualHrs: 2, overrunHrs: 1, labourImpact: 115, notes: "Callback same day" },
    ],
    leakageSources: [
      { label: "Uncoded time / missing job codes", impact: 2180 },
      { label: "Drive time logged to jobs", impact: 1420 },
      { label: "Return visits not attributed", impact: 980 },
      { label: "Overtime stacking on overruns", impact: 1840 },
    ],
    recoveredExplanation:
      "The $6,420 recoverable monthly figure comes from identified leakage: uncoded or mis-attributed hours ($2,180), drive time incorrectly logged to billable jobs ($1,420), return visits not tied to original job codes ($980), and overtime that stacks on jobs that already overran estimate ($1,840). Addressing these with job-code enforcement, same-day OT visibility, and weekly overrun review captures margin that is currently leaking.",
    recommendations: [
      "Require job code to clock in — no job, no start.",
      "Flag jobs >20% over estimate same-day so foremen can correct before month-end.",
      "OT approval rule after 45 hrs to prevent stacking on overruns.",
      "Weekly review: top 5 overruns with tech and foreman.",
      "Price book adjustment for repeat overruns (e.g. scope or rate).",
    ],
  };
}

export { formatUSD };
