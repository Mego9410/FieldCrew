import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Owner Getting Started — FieldCrew Docs",
  description: "Owner/Admin onboarding checklist and first-week setup guide.",
};

export default function OwnerGettingStartedPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Getting Started"
        description="Set up your workspace, onboard your team, and establish your first weekly operating routine."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/getting-started"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "prerequisites", label: "Prerequisites" },
          { id: "steps", label: "Step-by-step" },
          { id: "good", label: "What good looks like" },
          { id: "mistakes", label: "Common mistakes" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Launch FieldCrew with accurate baseline data so dashboards and reports are trustworthy from week one.
          </p>
        </section>

        <section id="prerequisites" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Prerequisites</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Owner/Admin account access and company details.</li>
            <li>Current worker list with roles and standard hours.</li>
            <li>Existing jobs/projects and estimate assumptions.</li>
          </ul>
        </section>

        <section id="steps" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Step-by-step</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Complete company profile and notification preferences in settings.</li>
            <li>Add workers and verify pay assumptions under worker management.</li>
            <li>Create active jobs/projects with estimated labor inputs.</li>
            <li>Validate first timesheet cycle and check for missing entries.</li>
            <li>Review dashboard signals and record first recovery priorities.</li>
          </ol>
        </section>

        <section id="good" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">What good looks like</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>All active workers and jobs are represented in the system.</li>
            <li>Time entries map cleanly to jobs and reporting periods.</li>
            <li>Owner can identify top 2-3 weekly margin risks with confidence.</li>
          </ul>
        </section>

        <section id="mistakes" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Common mistakes and fixes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Missing estimates on jobs: add estimate fields before reviewing overruns.</li>
            <li>Incomplete worker profiles: verify standard hours and labor assumptions.</li>
            <li>Skipping first weekly review: schedule a recurring owner review block.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/owner/jobs-and-projects" className="text-fc-accent hover:underline">
              Jobs and Projects
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
