import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getOnboardingProfile, getWorkers } from "@/lib/data";
import { OnboardingWizard } from "./OnboardingWizard";
import type { Company } from "@/lib/entities";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

const DEMO_COMPANY: Company = {
  id: "demo",
  name: "",
  onboardingStatus: undefined,
  settings: {},
};

type SearchParams = { payment?: string; edit?: string };

type PageProps = { searchParams?: Promise<SearchParams> };

export default async function OnboardingPage(props: PageProps) {
  const searchParams: SearchParams = await (props.searchParams ?? Promise.resolve({}));
  const showPaymentSuccess = searchParams.payment === "success";
  const wantsEdit =
    searchParams.edit === "1" || searchParams.edit === "true" || searchParams.edit === "yes";

  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  const isPreview = !company;
  const initialCompany = company ?? DEMO_COMPANY;

  if (company?.onboardingStatus === "complete" && !wantsEdit) {
    redirect(routes.owner.home);
  }

  const initialProfile = company ? await getOnboardingProfile(company.id, supabase) : null;
  const initialWorkers = company ? await getWorkers(company.id, supabase) : [];

  return (
    <OnboardingWizard
      initialCompany={initialCompany}
      initialProfile={initialProfile}
      initialWorkers={initialWorkers}
      isPreview={isPreview}
      showPaymentSuccess={showPaymentSuccess}
    />
  );
}
