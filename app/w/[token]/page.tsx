import Link from "next/link";
import { routes } from "@/lib/routes";

export default async function WorkerDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-fc-brand">
        Worker dashboard
      </h1>
      <p className="mt-2 text-fc-muted">
        Your jobs and pay visibility. Placeholder — content coming soon.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={routes.worker.jobs(token)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-fc-border bg-white px-4 py-2.5 font-medium text-fc-brand transition-colors hover:bg-slate-50"
        >
          My jobs
        </Link>
        <Link
          href={routes.worker.clock(token)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-fc-border bg-white px-4 py-2.5 font-medium text-fc-brand transition-colors hover:bg-slate-50"
        >
          Clock in / out
        </Link>
      </div>
      <Link
        href={routes.public.login}
        className="mt-8 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-brand px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
      >
        Sign out / Login
      </Link>
    </div>
  );
}
