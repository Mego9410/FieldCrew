import Link from "next/link";
import { routes } from "@/lib/routes";

export default async function WorkerJobsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-fc-brand">
        My jobs
      </h1>
      <p className="mt-2 text-fc-muted">
        View your assigned jobs. Placeholder — content coming soon.
      </p>
      <Link
        href={routes.worker.home(token)}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-fc-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-fc-brand/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
