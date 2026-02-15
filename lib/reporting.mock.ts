/**
 * Reporting data layer — fetches from Supabase and applies analytics.
 */

import {
  getJobs,
  getTimeEntries,
  getWorkers,
  getJobTypes,
} from "./data";
import {
  filterJobsByRange,
  filterEntriesByRange,
  getDateBuckets,
  getDateRangeFromPreset,
  sumRevenue,
  sumLabourCost,
  sumLabourHours,
  calculateMargin,
  calculateOvertime,
  calculateOverruns,
  calculateRplh,
  buildRevenueVsLabourSeries,
  buildOvertimeSeries,
  topOverrunningJobs,
  jobTypeMarginTable,
  workerOvertimeTable,
  allJobsProfitTable,
  type DateRange,
  type DateRangePreset,
} from "./reporting.analytics";

export interface ReportingFilters {
  dateRange: DateRange;
  dateRangePreset?: DateRangePreset;
  jobTypeId?: string;
  workerId?: string;
  status?: string;
}

export async function getReportingData(filters: ReportingFilters) {
  const [jobs, entries, workers, jobTypes] = await Promise.all([
    getJobs(),
    getTimeEntries(),
    getWorkers(),
    getJobTypes(),
  ]);

  const range = filters.dateRangePreset
    ? getDateRangeFromPreset(filters.dateRangePreset)
    : filters.dateRange;

  const filterOpts = {
    jobTypeId: filters.jobTypeId,
    workerId: filters.workerId,
    status: filters.status,
  };

  const filteredJobs = filterJobsByRange(jobs, range, filterOpts);
  let filteredEntries = filterEntriesByRange(entries, range, {
    workerId: filters.workerId,
  });
  // Apply job filter: only entries for jobs in filteredJobs
  const jobIds = new Set(filteredJobs.map((j) => j.id));
  filteredEntries = filteredEntries.filter((e) => jobIds.has(e.jobId));

  const granularity = range.end >= range.start
    ? (() => {
        const days =
          (new Date(range.end).getTime() - new Date(range.start).getTime()) /
          (24 * 60 * 60 * 1000) +
          1;
        return days <= 31 ? "day" : "week";
      })()
    : "day";

  const buckets = getDateBuckets(range, granularity);

  const revenue = sumRevenue(filteredJobs);
  const labourCost = sumLabourCost(filteredEntries, workers, range);
  const labourHours = sumLabourHours(filteredEntries, range);
  const marginPct = calculateMargin(revenue, labourCost);
  const ot = calculateOvertime(filteredEntries, workers, range);
  const overruns = calculateOverruns(jobs, entries, workers, range);
  const rplh = calculateRplh(revenue, labourHours);

  return {
    jobs: filteredJobs,
    entries: filteredEntries,
    workers,
    jobTypes,
    range,
    filters: filterOpts,
    kpis: {
      revenue,
      labourCost,
      labourHours,
      marginPct,
      overtime: ot,
      overruns,
      rplh,
    },
    series: {
      revenueVsLabour: buildRevenueVsLabourSeries(
        filteredJobs,
        filteredEntries,
        workers,
        buckets
      ),
      overtime: buildOvertimeSeries(filteredEntries, workers, buckets),
    },
    tables: {
      topOverrunning: topOverrunningJobs(
        filteredJobs,
        filteredEntries,
        workers,
        range
      ),
      jobTypeMargin: jobTypeMarginTable(
        filteredJobs,
        filteredEntries,
        workers,
        jobTypes,
        range
      ),
      overtimeWorkers: workerOvertimeTable(
        filteredEntries,
        workers,
        range
      ),
      allJobsProfit: allJobsProfitTable(
        filteredJobs,
        filteredEntries,
        workers,
        range
      ),
      overrunningJobs: topOverrunningJobs(
        filteredJobs,
        filteredEntries,
        workers,
        range,
        100
      ),
    },
  };
}
