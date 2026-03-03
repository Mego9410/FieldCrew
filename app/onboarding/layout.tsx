import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, ensureOwnerUserForAuthUser } from "@/lib/data";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let company = await getCompanyForCurrentUser(supabase);
  // Logged-in new user with no company yet: create owner_user + company so they see real onboarding (not preview).
  // Use service-role client when available so inserts succeed regardless of RLS/session timing.
  if (!company) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const insertClient = createServiceRoleClient() ?? supabase;
      await ensureOwnerUserForAuthUser(user ? insertClient : supabase, user ?? null);
      company = await getCompanyForCurrentUser(supabase);
    } catch (err) {
      console.error("[onboarding/layout] ensureOwnerUserForAuthUser failed:", err);
    }
  }
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
