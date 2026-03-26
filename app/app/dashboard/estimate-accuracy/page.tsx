import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function EstimateAccuracyPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Estimate Accuracy</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Compare estimated vs actual hours to improve your job estimation accuracy.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Track variance by job type to improve estimating templates.",
          "Identify repeat misses by technician mix or schedule pressure.",
          "Feed actual hour trends back into future quotes.",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm">
            <p className="text-sm text-fc-muted">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm">
        <p className="text-sm text-fc-muted">
          Practical workflow: use job-level overruns to find estimate misses, then tighten assumptions for labor hours and overtime.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.owner.dashboard.overruns}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Open overrun details
          </Link>
          <Link
            href={routes.owner.jobs}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Review jobs list
          </Link>
        </div>
      </div>
    </div>
  );
}
