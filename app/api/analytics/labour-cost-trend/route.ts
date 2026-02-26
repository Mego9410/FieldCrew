import { NextRequest, NextResponse } from "next/server";
import { getJobs, getWorkers, getTimeEntries, getJobTypes } from "@/lib/data";
import { buildLabourCostTrendPayload } from "@/lib/labour-cost-trend";

const DEFAULT_RANGE_DAYS = 90;
const ALLOWED_RANGES = [30, 90, 180, 365];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeDaysParam = searchParams.get("rangeDays");
    const rangeDays = rangeDaysParam
      ? Math.min(365, Math.max(7, parseInt(rangeDaysParam, 10) || DEFAULT_RANGE_DAYS))
      : DEFAULT_RANGE_DAYS;
    const effectiveRange = ALLOWED_RANGES.includes(rangeDays)
      ? rangeDays
      : ALLOWED_RANGES.reduce((a, b) => (Math.abs(b - rangeDays) < Math.abs(a - rangeDays) ? b : a));
    const targetParam = searchParams.get("targetLabourCostPerJob");
    const targetLabourCostPerJob = targetParam
      ? parseFloat(targetParam)
      : undefined;

    const [jobs, workers, timeEntries, jobTypes] = await Promise.all([
      getJobs(),
      getWorkers(),
      getTimeEntries(),
      getJobTypes(),
    ]);

    const payload = buildLabourCostTrendPayload(
      jobs,
      workers,
      timeEntries,
      jobTypes,
      {
        rangeDays: effectiveRange,
        currency: "GBP",
        targetLabourCostPerJob:
          targetLabourCostPerJob != null && targetLabourCostPerJob >= 0
            ? targetLabourCostPerJob
            : undefined,
      }
    );

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[labour-cost-trend]", error);
    return NextResponse.json(
      { error: "Failed to load labour cost trend" },
      { status: 500 }
    );
  }
}
