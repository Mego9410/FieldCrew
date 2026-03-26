import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Workers and Time — FieldCrew Docs",
  description: "Guide for worker setup, timesheet hygiene, and approval routines.",
};

export default function OwnerWorkersTimePage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Workers and Time"
        description="Build reliable timesheet and worker management habits that power accurate reporting."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/workers-and-time"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "worker-setup", label: "Worker setup" },
          { id: "timesheets", label: "Timesheet routine" },
          { id: "checks", label: "Quality checks" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Ensure every hour is attributed correctly so overrun, overtime, and recovery views are actionable.
          </p>
        </section>

        <section id="worker-setup" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Worker setup</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Keep worker roster current (active/inactive status).</li>
            <li>Set baseline labor assumptions per worker profile.</li>
            <li>Review worker-level variance signals weekly.</li>
          </ul>
        </section>

        <section id="timesheets" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Timesheet routine</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Require daily clock-in/out discipline against active jobs.</li>
            <li>Run end-of-day missing-entry check.</li>
            <li>Complete weekly owner/admin timesheet review before payroll export.</li>
          </ol>
        </section>

        <section id="checks" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Quality checks</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>No unassigned hours for active workers.</li>
            <li>Overtime entries include valid operational context.</li>
            <li>Large edits are reviewed by owner/admin before close.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/owner/payroll-and-export" className="text-fc-accent hover:underline">
              Payroll and Export
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
