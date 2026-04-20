"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-fc-app-surface p-2 gap-0 lg:p-4 lg:gap-4">
      <aside className="hidden lg:block">
        <AdminSidebar />
      </aside>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col min-w-0 lg:z-auto">
        <AdminHeader />
        <main className="min-h-0 flex-1 overflow-auto bg-fc-page">{children}</main>
      </div>
    </div>
  );
}

