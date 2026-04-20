import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  ensureOwnerUserForAuthUser,
  getCompanyForCurrentUser,
  getOnboardingProfile,
  getWorkers,
} from "@/lib/data";
import { OnboardingWizard } from "./OnboardingWizard";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { OnboardingAuthGate } from "@/components/onboarding/OnboardingAuthGate";

type SearchParams = { payment?: string; edit?: string };

type PageProps = { searchParams?: Promise<SearchParams> };

export default async function OnboardingPage(props: PageProps) {
  const searchParams: SearchParams = await (props.searchParams ?? Promise.resolve({}));
  const showPaymentSuccess = searchParams.payment === "success";
  const wantsEdit =
    searchParams.edit === "1" || searchParams.edit === "true" || searchParams.edit === "yes";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <OnboardingAuthGate />;
  }
  let company = await getCompanyForCurrentUser(supabase);
  // Ensure authenticated users always have a real company during onboarding so answers persist.
  if (!company) {
    try {
      const insertClient = createServiceRoleClient() ?? supabase;
      await ensureOwnerUserForAuthUser(insertClient, user);
      company = await getCompanyForCurrentUser(supabase);
    } catch (err) {
      console.error("[onboarding/page] ensureOwnerUserForAuthUser failed:", err);
    }
  }
  if (!company) {
    // If we still can't create a company, force a refresh rather than falling back to preview mode.
    redirect(routes.owner.onboarding);
  }

  if (company?.onboardingStatus === "complete" && !wantsEdit) {
    redirect(routes.owner.home);
  }

  const initialProfile = await getOnboardingProfile(company.id, supabase);
  const initialWorkers = await getWorkers(company.id, supabase);

  return (
    <OnboardingWizard
      initialCompany={company}
      initialProfile={initialProfile}
      initialWorkers={initialWorkers}
      isPreview={false}
      showPaymentSuccess={showPaymentSuccess}
    />
  );
}
