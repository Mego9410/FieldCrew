import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, ensureOwnerUserForAuthUser } from "@/lib/data";
import { SiteChrome } from "@/components/landing/SiteChrome";

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
  // Completed owners are redirected from /onboarding in page.tsx unless ?edit=1 (see onboarding/page.tsx).
  return (
    <SiteChrome>{children}</SiteChrome>
  );
}
