import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorkers } from "@/lib/data";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  const workers = company ? await getWorkers(company.id, supabase) : [];
  if (!company) return null;
  return (
    <OnboardingWizard
      initialCompany={company}
      initialWorkers={workers}
    />
  );
}
