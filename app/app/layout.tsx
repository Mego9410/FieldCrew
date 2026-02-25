import { AppLayoutClient } from "@/components/app/AppLayoutClient";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </ToastProvider>
  );
}
