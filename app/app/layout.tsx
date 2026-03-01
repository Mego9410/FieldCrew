import { AppLayoutClient } from "@/components/app/AppLayoutClient";
import { ToastProvider } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/server";
import { ensureOwnerUserForAuthUser } from "@/lib/data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  try {
    await ensureOwnerUserForAuthUser(supabase);
  } catch (err) {
    console.error("[app/layout] ensureOwnerUserForAuthUser failed:", err);
  }

  return (
    <ToastProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </ToastProvider>
  );
}
