import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser } from "@/lib/data";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  // Allow unauthenticated / no-company access for "force onboarding" preview from login page
  if (company?.onboardingStatus === "complete") {
    redirect(routes.owner.home);
  }
  return (
    <div className="min-h-screen bg-[var(--fc-bg-page)]">
      {children}
    </div>
  );
}
