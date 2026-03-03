import { AppLayoutClient } from "@/components/app/AppLayoutClient";
import { ToastProvider } from "@/components/ui/Toast";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { ensureOwnerUserForAuthUser } from "@/lib/data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const insertClient = createServiceRoleClient() ?? supabase;
    await ensureOwnerUserForAuthUser(user ? insertClient : supabase, user ?? null);
  } catch (err) {
    console.error("[app/layout] ensureOwnerUserForAuthUser failed:", err);
  }

  return (
    <ToastProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </ToastProvider>
  );
}
