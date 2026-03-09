import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, ensureOwnerUserForAuthUser, getSubscriptionStatusForUser } from "@/lib/data";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export default async function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guests see the subscribe page (first step of onboarding). Logged-in users
  // get company ensured and, if already subscribed, are redirected to app/onboarding.
  if (user) {
    let company = await getCompanyForCurrentUser(supabase);
    if (!company) {
      try {
        const insertClient = createServiceRoleClient() ?? supabase;
        await ensureOwnerUserForAuthUser(insertClient, user);
        company = await getCompanyForCurrentUser(supabase);
      } catch (err) {
        console.error("[subscribe/layout] ensureOwnerUserForAuthUser failed:", err);
      }
    }
    const sub = await getSubscriptionStatusForUser(user.id, supabase);
    if (sub.companyId) {
      const { data: companyRow } = await supabase
        .from("companies")
        .select("onboarding_status")
        .eq("id", sub.companyId)
        .single();
      const status = companyRow?.onboarding_status;
      // If onboarding complete, go to dashboard; if subscribed but not complete, go to onboarding
      if (status === "complete") {
        redirect(routes.owner.home);
      }
      if (sub.hasActiveSubscription) {
        redirect(routes.owner.onboarding);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--fc-bg-page)] flex flex-col">
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
