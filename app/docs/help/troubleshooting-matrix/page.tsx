import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Troubleshooting Matrix — FieldCrew Docs",
  description: "Symptom-to-fix troubleshooting matrix for common operational issues.",
};

export default function TroubleshootingMatrixPage() {
  const rows = [
    {
      symptom: "Overrun numbers look too high",
      likely: "Missing/incorrect estimates or job mapping errors",
      fix: "Verify estimate fields and ensure time entries map to correct jobs",
      next: "/docs/owner/jobs-and-projects",
    },
    {
      symptom: "Overtime spikes unexpectedly",
      likely: "Late schedule changes or repeated high-variance jobs",
      fix: "Review overtime-by-worker and apply reduction playbook",
      next: "/docs/playbooks/overtime-reduction",
    },
    {
      symptom: "Payroll export totals do not reconcile",
      likely: "Unapproved or incomplete timesheet entries",
      fix: "Complete approval checkpoint before export run",
      next: "/docs/owner/payroll-and-export",
    },
  ];

  return (
    <>
      <Nav />
      <DocsLayout
        title="Help: Troubleshooting Matrix"
        description="Use this matrix to move quickly from symptom to likely cause and corrective action."
        navGroups={docsNavGroups}
        currentPath="/docs/help/troubleshooting-matrix"
        toc={[
          { id: "matrix", label: "Troubleshooting matrix" },
          { id: "escalate", label: "Escalation path" },
        ]}
      >
        <section id="matrix">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Troubleshooting matrix</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-fc-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-fc-surface-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Symptom</th>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Likely cause</th>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Fix</th>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Guide</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.symptom} className="border-t border-fc-border">
                    <td className="px-4 py-3 text-fc-brand">{row.symptom}</td>
                    <td className="px-4 py-3 text-fc-muted">{row.likely}</td>
                    <td className="px-4 py-3 text-fc-muted">{row.fix}</td>
                    <td className="px-4 py-3">
                      <Link href={row.next} className="text-fc-accent hover:underline">
                        Open guide
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="escalate" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Escalation path</h2>
          <p className="mt-3 text-fc-muted">
            If a problem persists after documented fixes, capture exact route, timestamp, and screenshot, then escalate through support.
          </p>
          <p className="mt-4 text-sm text-fc-muted">
            Related: <Link href="/docs/help/faq" className="text-fc-accent hover:underline">FAQ</Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
