import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function MarginPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Labour Margin Analysis</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Detailed breakdown of revenue vs labour costs and margin trends.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Gross margin signal: compare labour cost pressure against billed work.",
          "Quote discipline: track where estimates consistently miss actual effort.",
          "Crew utilization: spot jobs where extra hours are not improving outcomes.",
        ].map((item) => (
          <article key={item} className="rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm">
            <p className="text-sm text-fc-muted">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm">
        <p className="text-sm text-fc-muted">
          Use this view as a margin playbook: start with overrun-heavy jobs, then inspect overtime drivers and compare with project-level outcomes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.owner.dashboard.overruns}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Review overruns
          </Link>
          <Link
            href={routes.owner.dashboard.revenueLabour}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Compare revenue vs labour
          </Link>
        </div>
      </div>
    </div>
  );
}
