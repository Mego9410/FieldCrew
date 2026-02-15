import Link from "next/link";
import { routes } from "@/lib/routes";

export default async function WorkerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="min-h-screen bg-fc-page">
      <header className="border-b border-fc-border bg-fc-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href={routes.worker.home(token)}
            className="font-display text-lg font-semibold text-fc-brand"
          >
            FieldCrew — Worker
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href={routes.worker.home(token)}
              className="text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand"
            >
              Dashboard
            </Link>
            <Link
              href={routes.worker.jobs(token)}
              className="text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand"
            >
              Jobs
            </Link>
            <Link
              href={routes.worker.clock(token)}
              className="text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand"
            >
              Clock
            </Link>
            <Link
              href={routes.public.home}
              className="text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand"
            >
              Back to site
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
