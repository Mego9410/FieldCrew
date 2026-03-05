import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, ensureOwnerUserForAuthUser, getSubscriptionStatusForUser } from "@/lib/data";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(routes.public.login + "?next=" + encodeURIComponent("/subscribe"));
  }
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
  if (sub.hasActiveSubscription && sub.companyId) {
    const { data: companyRow } = await supabase
      .from("companies")
      .select("onboarding_status")
      .eq("id", sub.companyId)
      .single();
    const status = companyRow?.onboarding_status;
    if (status === "complete") {
      redirect(routes.owner.home);
    }
    redirect(routes.owner.onboarding);
  }
  return (
    <div className="min-h-screen bg-[var(--fc-bg-page)]">
      {children}
    </div>
  );
}
