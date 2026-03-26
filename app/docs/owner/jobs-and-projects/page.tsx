import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Jobs and Projects — FieldCrew Docs",
  description: "How to manage jobs and projects with estimate discipline.",
};

export default function OwnerJobsProjectsPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Jobs and Projects"
        description="Use consistent job setup and status discipline to improve estimate accuracy and execution quality."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/jobs-and-projects"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "workflow", label: "Core workflow" },
          { id: "quality", label: "Data quality checks" },
          { id: "mistakes", label: "Common mistakes" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Maintain clean job records so estimate-vs-actual analysis reflects real execution, not messy data.
          </p>
        </section>

        <section id="workflow" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Core workflow</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Create jobs with clear scope, customer, and estimated labor fields.</li>
            <li>Assign workers and confirm status transitions (scheduled to in progress to complete).</li>
            <li>Review overrun signals weekly and annotate root causes by job type.</li>
            <li>Feed findings back into quoting assumptions for similar work.</li>
          </ol>
        </section>

        <section id="quality" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Data quality checks</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Every active job has an estimate and current status.</li>
            <li>Completed jobs have final hours and closure notes.</li>
            <li>Project-level rollups match job-level labor totals.</li>
          </ul>
        </section>

        <section id="mistakes" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Common mistakes and fixes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Using broad status labels: standardize status definitions across team.</li>
            <li>No closure review on overruns: add weekly top-overrun debrief.</li>
            <li>Mixing project and service jobs in same assumptions: split by job type.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/owner/workers-and-time" className="text-fc-accent hover:underline">
              Workers and Time
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
