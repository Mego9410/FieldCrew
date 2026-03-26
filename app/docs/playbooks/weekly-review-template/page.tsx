import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Weekly Review Template — FieldCrew Docs",
  description: "Role-based weekly review template for owner, ops, and admin teams.",
};

export default function WeeklyReviewTemplatePage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Playbook: Weekly Review Template"
        description="A structured agenda for owner, operations, and admin roles to align on labor performance."
        navGroups={docsNavGroups}
        currentPath="/docs/playbooks/weekly-review-template"
        toc={[
          { id: "agenda", label: "Review agenda" },
          { id: "roles", label: "Role responsibilities" },
          { id: "outputs", label: "Expected outputs" },
        ]}
      >
        <section id="agenda">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Review agenda (30-45 mins)</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Review prior-week KPI shifts and exceptions.</li>
            <li>Identify top leakage contributors by dollar impact.</li>
            <li>Agree corrective actions and owners.</li>
            <li>Confirm deadlines and next review checkpoint.</li>
          </ol>
        </section>
        <section id="roles" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Role responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Owner: prioritization and outcome accountability.</li>
            <li>Operations Lead: root-cause analysis and execution updates.</li>
            <li>Admin: data integrity, export readiness, exception tracking.</li>
          </ul>
        </section>
        <section id="outputs" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Expected outputs</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Top three actions with owner and due date.</li>
            <li>Recorded assumptions updates (if quoting changes apply).</li>
            <li>Clear status from last week’s actions (done/in progress/blocked).</li>
          </ul>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
