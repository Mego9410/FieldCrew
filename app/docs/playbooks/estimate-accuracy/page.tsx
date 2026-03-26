import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Estimate Accuracy Playbook — FieldCrew Docs",
  description: "Improve estimate precision using actual labor outcomes.",
};

export default function EstimateAccuracyPlaybookPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Playbook: Estimate Accuracy Improvement"
        description="Use job-level feedback loops to reduce estimate drift and improve margin predictability."
        navGroups={docsNavGroups}
        currentPath="/docs/playbooks/estimate-accuracy"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "loop", label: "Improvement loop" },
          { id: "signals", label: "Signals to watch" },
          { id: "cadence", label: "Review cadence" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Reduce gap between estimated and actual labor by applying structured post-job feedback.
          </p>
        </section>
        <section id="loop" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Improvement loop</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Tag high-variance jobs by type and scope characteristics.</li>
            <li>Compare estimate assumptions to actual execution realities.</li>
            <li>Update quoting assumptions for next cycle.</li>
            <li>Track variance trend over at least three cycles.</li>
          </ol>
        </section>
        <section id="signals" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Signals to watch</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Overrun concentration by job type.</li>
            <li>Repeat mismatch in labor-hour assumptions.</li>
            <li>Estimate variance impact on overtime usage.</li>
          </ul>
        </section>
        <section id="cadence" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Review cadence</h2>
          <p className="mt-3 text-fc-muted">
            Run a bi-weekly estimate calibration session with owner + operations lead and keep a running assumptions log.
          </p>
          <p className="mt-5 text-sm text-fc-muted">
            Related:{" "}
            <Link href="/docs/owner/jobs-and-projects" className="text-fc-accent hover:underline">
              Jobs and Projects Guide
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
