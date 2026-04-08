export const WEEKS_PER_MONTH = 52 / 12;

export function weeklyUsdToMonthlyUsd(weeklyUsd: number): number {
  if (!Number.isFinite(weeklyUsd)) return 0;
  return weeklyUsd * WEEKS_PER_MONTH;
}

