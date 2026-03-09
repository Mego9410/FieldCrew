import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorkers } from "@/lib/data";
import { OnboardingWizard } from "./OnboardingWizard";
import type { Company } from "@/lib/entities";

const DEMO_COMPANY: Company = {
  id: "demo",
  name: "",
  workType: "mixed",
  expectedTeamSize: 5,
  currentTrackingMethod: "none",
  onboardingStatus: undefined,
  settings: {},
};

type SearchParams = { payment?: string };

type PageProps = { searchParams?: Promise<SearchParams> };

export default async function OnboardingPage(props: PageProps) {
  const searchParams: SearchParams = await (props.searchParams ?? Promise.resolve({}));
  const showPaymentSuccess = searchParams.payment === "success";

  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  const workers = company ? await getWorkers(company.id, supabase) : [];
  const initialCompany = company ?? DEMO_COMPANY;
  const isPreview = !company;
  return (
    <OnboardingWizard
      initialCompany={initialCompany}
      initialWorkers={workers}
      isPreview={isPreview}
      showPaymentSuccess={showPaymentSuccess}
    />
  );
}
