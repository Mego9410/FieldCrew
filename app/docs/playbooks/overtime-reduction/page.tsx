import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Overtime Reduction Playbook — FieldCrew Docs",
  description: "SOP to reduce avoidable overtime while preserving delivery quality.",
};

export default function OvertimeReductionPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Playbook: Overtime Reduction"
        description="Reduce overtime premium through scheduling discipline, workload balancing, and exception management."
        navGroups={docsNavGroups}
        currentPath="/docs/playbooks/overtime-reduction"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "diagnose", label: "Diagnose overtime" },
          { id: "interventions", label: "Interventions" },
          { id: "monitor", label: "Monitor outcomes" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Lower avoidable overtime costs while maintaining service quality and schedule reliability.
          </p>
        </section>
        <section id="diagnose" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Diagnose overtime sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Recurring overrun jobs.</li>
            <li>Uneven worker allocation by day/time window.</li>
            <li>Late changes and reactive dispatching patterns.</li>
          </ul>
        </section>
        <section id="interventions" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Interventions</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Adjust schedule buffers for high-variance job categories.</li>
            <li>Redistribute work based on recent overtime concentration.</li>
            <li>Require exception note on overtime above threshold.</li>
          </ol>
        </section>
        <section id="monitor" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Monitor outcomes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Overtime hours by worker and by week.</li>
            <li>Overtime premium trend vs baseline.</li>
            <li>Service quality and completion impact after changes.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Related:{" "}
            <Link href="/docs/playbooks/estimate-accuracy" className="text-fc-accent hover:underline">
              Estimate Accuracy Playbook
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
