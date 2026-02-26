/**
 * Types and API contract for Labour Cost per Job Trend analytics.
 * Used by GET /api/analytics/labour-cost-trend and the labour-cost-trend page.
 */

export interface TrendPoint {
  periodStart: string;
  periodEnd: string;
  totalLabourCost: number;
  jobsCount: number;
  avgLabourCostPerJob: number;
  totalRevenue?: number;
  overtimeCost?: number;
  overtimeHours?: number;
  avgActualHoursPerJob?: number;
}

export interface KpiDelta {
  value: number;
  deltaPct: number;
  deltaAbs?: number;
}

export interface KPIBlock {
  avgLabourCostPerJob: KpiDelta & { deltaAbs: number };
  jobsCount: KpiDelta;
  overtimeCost: KpiDelta;
  overtimePctOfLabour: KpiDelta;
  avgActualHoursPerJob: KpiDelta;
}

export interface BreakdownRowJobType {
  jobType: string;
  avgLabourCostPerJob: number;
  deltaPct: number;
  jobsCount: number;
  overtimeHours: number;
  estVsActualHoursVariance: number;
  impactCost: number;
}

export interface BreakdownRowTechnician {
  technicianId: string;
  technicianName: string;
  avgLabourCostPerJob: number;
  deltaPct: number;
  jobsCount: number;
  overtimeHours: number;
  overtimeCost: number;
  estVsActualHoursVariance: number;
  impactCost: number;
}

export interface BreakdownRowEstimateVsActual {
  periodLabel: string;
  estHours: number;
  actualHours: number;
  varianceHours: number;
  variancePct: number;
  impactCost: number;
}

export type AnomalySeverity = "info" | "warn";
export type AnomalyMetric =
  | "avgLabourCostPerJob"
  | "overtimePct"
  | "varianceHours";

export interface Anomaly {
  id: string;
  label: string;
  periodStart: string;
  periodEnd: string;
  severity: AnomalySeverity;
  metric: AnomalyMetric;
  deltaPct: number;
  baseline: number;
  current: number;
}

export interface LabourCostTrendPayload {
  rangeDays: number;
  granularity: "week" | "month";
  currency: string;
  targetLabourCostPerJob?: number;
  profitLeakage: {
    value: number;
    primaryDriver: string;
    techImpact: string;
  };
  kpis: KPIBlock;
  trend: TrendPoint[];
  breakdown: {
    byJobType: BreakdownRowJobType[];
    byTechnician: BreakdownRowTechnician[];
    estVsActual: BreakdownRowEstimateVsActual[];
  };
  anomalies: Anomaly[];
}
