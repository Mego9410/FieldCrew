import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function RevenuePerLabourHourPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Revenue per Labor Hour</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Track revenue productivity per hour worked to identify if crews are productive or just busy.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Benchmark revenue productivity across crews and periods.",
          "Track dips in output-per-hour before they impact margin.",
          "Use with overtime data to separate healthy load from churn.",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm">
            <p className="text-sm text-fc-muted">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm">
        <p className="text-sm text-fc-muted">
          This metric is best used with context from quote accuracy and labor utilization rather than as a standalone score.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.owner.dashboard.estimateAccuracy}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Review estimate accuracy
          </Link>
          <Link
            href={routes.owner.dashboard.overtime}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Review overtime
          </Link>
        </div>
      </div>
    </div>
  );
}
