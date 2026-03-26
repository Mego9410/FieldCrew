import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Reporting and Insights — FieldCrew Docs",
  description: "How to run weekly reporting reviews and convert insights into action.",
};

export default function OwnerReportingInsightsPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Reporting and Insights"
        description="Use dashboard and detail views to drive weekly margin recovery decisions."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/reporting-and-insights"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "weekly", label: "Weekly review loop" },
          { id: "prioritize", label: "Prioritization" },
          { id: "actions", label: "Action tracking" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Convert dashboard signals into a small number of high-impact operational actions every week.
          </p>
        </section>

        <section id="weekly" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Weekly review loop</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Review margin, overtime, overruns, and recovery trends.</li>
            <li>Identify top exception jobs/workers from the period.</li>
            <li>Assign two to three corrective actions with owners and deadlines.</li>
            <li>Validate action outcomes in next review cycle.</li>
          </ol>
        </section>

        <section id="prioritize" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Prioritization model</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Prioritize by dollar impact and repeat frequency.</li>
            <li>Focus first on recurring patterns, then one-off anomalies.</li>
            <li>Track whether fixes reduce labor leakage in the next two cycles.</li>
          </ul>
        </section>

        <section id="actions" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Action tracking expectations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Every action has an owner, due date, and measurable target.</li>
            <li>Weekly review notes are stored for trend context.</li>
            <li>Decision quality improves cycle-over-cycle with consistent review cadence.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/owner/settings-and-security" className="text-fc-accent hover:underline">
              Settings and Security
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
