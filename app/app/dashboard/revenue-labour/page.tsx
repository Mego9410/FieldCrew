import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function RevenueLabourPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Revenue vs Labour</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Compare revenue and labour costs side-by-side with detailed breakdowns.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Use this lens to compare workload volume against labor spend trends.",
          "Watch for weeks where revenue growth is outpaced by labor costs.",
          "Pair this with overtime and overrun pages for root-cause checks.",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm">
            <p className="text-sm text-fc-muted">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm">
        <p className="text-sm text-fc-muted">
          Use this page to prioritize where profitability is drifting: cost growth, execution delays, or quoting quality.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.owner.dashboard.margin}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Open margin view
          </Link>
          <Link
            href={routes.owner.dashboard.recovery}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Check recovery opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
