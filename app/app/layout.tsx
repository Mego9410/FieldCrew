import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
    <div className="flex h-screen overflow-hidden bg-fc-app-surface p-4 gap-4">
      <AppSidebar />
      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <AppHeader />
        <main className="min-h-0 flex-1 overflow-auto bg-fc-page">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
