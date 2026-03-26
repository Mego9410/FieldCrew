import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Timesheet Habits — Worker Docs",
  description: "Worker-level timesheet best practices and daily checklist.",
};

export default function WorkerTimesheetHabitsPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Worker: Timesheet Habits"
        description="Use these habits to keep your time records accurate and reduce rework."
        navGroups={docsNavGroups}
        currentPath="/docs/worker/timesheet-habits"
        toc={[
          { id: "daily", label: "Daily checklist" },
          { id: "weekly", label: "Weekly review" },
          { id: "mistakes", label: "Mistakes to avoid" },
        ]}
      >
        <section id="daily">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Daily checklist</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Confirm first clock event on correct job.</li>
            <li>Log transitions and breaks as they happen.</li>
            <li>Add notes when an entry deviates from plan.</li>
            <li>Verify final entry before ending shift.</li>
          </ul>
        </section>

        <section id="weekly" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Weekly review</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Scan entries for missing job context.</li>
            <li>Resolve conflicts before payroll close.</li>
            <li>Confirm overtime notes are complete.</li>
          </ol>
        </section>

        <section id="mistakes" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Mistakes to avoid</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Reconstructing multiple days from memory.</li>
            <li>Clocking under a default job without confirming assignment.</li>
            <li>Leaving exception reasons blank.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/worker/common-errors-and-fixes" className="text-fc-accent hover:underline">
              Common Errors and Fixes
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
