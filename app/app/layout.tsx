import { AppLayoutClient } from "@/components/app/AppLayoutClient";
import { ToastProvider } from "@/components/ui/Toast";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { ensureOwnerUserForAuthUser, getCompanyForCurrentUser } from "@/lib/data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let readOnlyMode = false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const insertClient = createServiceRoleClient() ?? supabase;
    await ensureOwnerUserForAuthUser(user ? insertClient : supabase, user ?? null);
    const company = await getCompanyForCurrentUser(supabase);
    if (company) {
      const status = company.subscriptionStatus ?? null;
      const hasActiveSub = status === "active" || status === "trialing";
      readOnlyMode = !hasActiveSub && company.onboardingStatus !== "complete";
    }
  } catch (err) {
    console.error("[app/layout] ensureOwnerUserForAuthUser failed:", err);
  }

  return (
    <ToastProvider>
      <AppLayoutClient readOnlyMode={readOnlyMode}>{children}</AppLayoutClient>
    </ToastProvider>
  );
}
