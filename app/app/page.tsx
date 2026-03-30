import { ProfitDashboard } from "@/components/dashboard/ProfitDashboard";
import { EstimatedFirstInsightDashboard } from "@/components/dashboard/estimated-state/EstimatedFirstInsightDashboard";
import { createClient } from "@/lib/supabase/server";
import {
  countJobsWithLabourEntries,
  getCompanyForCurrentUser,
  getJobs,
  getOnboardingProfile,
  getWorkers,
  updateCompany,
} from "@/lib/data";
import { REAL_LABOUR_DATA_JOB_THRESHOLD } from "@/types/onboarding";

export default async function OwnerDashboardPage() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return <ProfitDashboard />;
  }

  const profile = await getOnboardingProfile(company.id, supabase);
  const jobsWithLabour = await countJobsWithLabourEntries(company.id, supabase);
  const [workers, jobs] = await Promise.all([
    getWorkers(company.id, supabase),
    getJobs(company.id, undefined, supabase),
  ]);
  const hasRealLabourThreshold = jobsWithLabour >= REAL_LABOUR_DATA_JOB_THRESHOLD;

  if (hasRealLabourThreshold && company.usingEstimatedInsight) {
    await updateCompany(company.id, { usingEstimatedInsight: false }, supabase);
  }

  const refreshed = await getCompanyForCurrentUser(supabase);
  const co = refreshed ?? company;

  const showEstimated =
    Boolean(profile?.estimatedSnapshot) &&
    !hasRealLabourThreshold &&
    co.usingEstimatedInsight === true;

  const showLiveDataTransitionNote =
    hasRealLabourThreshold &&
    profile != null &&
    co.settings?.estimatedInsightDismissed !== true;

  if (showEstimated && profile) {
    return (
      <EstimatedFirstInsightDashboard
        profile={profile}
        companyName={co.name}
        workerCount={workers.length}
        jobCount={jobs.length}
      />
    );
  }

  return <ProfitDashboard showLiveDataTransitionNote={showLiveDataTransitionNote} />;
}
