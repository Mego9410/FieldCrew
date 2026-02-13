import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { MockStorageInit } from "@/components/MockStorageInit";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-fc-app-surface">
      <MockStorageInit />
      <AppSidebar />
      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <AppHeader />
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
