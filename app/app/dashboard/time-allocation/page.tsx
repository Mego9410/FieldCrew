import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function TimeAllocationPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Time Allocation Breakdown</h1>
      <p className="mt-1 text-sm text-fc-muted">
        See how your team&apos;s time is allocated across billable, travel, admin, and idle categories.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Track where non-billable time is absorbing capacity.",
          "Identify recurring travel/admin patterns by team workflow.",
          "Use allocation trends to improve scheduling and dispatch plans.",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm">
            <p className="text-sm text-fc-muted">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm">
        <p className="text-sm text-fc-muted">
          Start with jobs that routinely spike non-billable hours, then align crew planning to reduce avoidable idle and travel time.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.owner.dashboard.recovery}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            View recovery opportunities
          </Link>
          <Link
            href={routes.owner.timesheets}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Open timesheets
          </Link>
        </div>
      </div>
    </div>
  );
}
