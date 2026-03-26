import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Payroll and Export — FieldCrew Docs",
  description: "Export workflow and reconciliation checks for payroll operations.",
};

export default function OwnerPayrollExportPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Payroll and Export"
        description="Use a controlled payroll export process to reduce surprises and improve reconciliation."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/payroll-and-export"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "export-flow", label: "Export workflow" },
          { id: "reconcile", label: "Reconciliation checks" },
          { id: "mistakes", label: "Common mistakes" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Generate payroll exports that reflect final approved time and preserve job-level attribution integrity.
          </p>
        </section>

        <section id="export-flow" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Export workflow</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Finalize timesheets and resolve missing or conflicting entries.</li>
            <li>Review overtime summary and exception notes.</li>
            <li>Run payroll export and store period snapshot for audit trail.</li>
            <li>Confirm totals align with expected labor distribution.</li>
          </ol>
        </section>

        <section id="reconcile" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Reconciliation checks</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Export totals match approved timesheet totals by worker.</li>
            <li>Overtime deltas are explained and documented.</li>
            <li>No closed jobs receive post-period labor without review.</li>
          </ul>
        </section>

        <section id="mistakes" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Common mistakes and fixes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Exporting before approvals complete: enforce approval checkpoint.</li>
            <li>Ignoring exceptions: maintain exception queue with owners assigned.</li>
            <li>No period snapshot: archive export and summary for every pay cycle.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/owner/reporting-and-insights" className="text-fc-accent hover:underline">
              Reporting and Insights
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
