import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Margin Recovery Cadence — FieldCrew Docs",
  description: "Weekly SOP to recover hidden labor margin consistently.",
};

export default function MarginRecoveryCadencePage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Playbook: Margin Recovery Cadence"
        description="A repeatable weekly operating cadence to detect, prioritize, and reduce labor leakage."
        navGroups={docsNavGroups}
        currentPath="/docs/playbooks/margin-recovery-cadence"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "cadence", label: "Weekly cadence" },
          { id: "scorecard", label: "Recovery scorecard" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Recover 8-15% hidden labor margin by running a focused weekly review loop with accountable actions.
          </p>
        </section>
        <section id="cadence" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Weekly cadence</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Review margin, overtime, and overrun shifts from prior week.</li>
            <li>Select top three leakage drivers by dollar impact.</li>
            <li>Assign owner + due date for each corrective action.</li>
            <li>Recheck outcomes in the next cycle and retain what works.</li>
          </ol>
        </section>
        <section id="scorecard" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Recovery scorecard</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Total recoverable profit trend (week-over-week)</li>
            <li>Top job overrun reduction rate</li>
            <li>Overtime premium reduction amount</li>
            <li>Action completion rate by owner</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Related:{" "}
            <Link href="/docs/playbooks/weekly-review-template" className="text-fc-accent hover:underline">
              Weekly Review Template
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
