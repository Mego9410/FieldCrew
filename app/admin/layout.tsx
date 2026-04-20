import { ToastProvider } from "@/components/ui/Toast";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ToastProvider>
  );
}

