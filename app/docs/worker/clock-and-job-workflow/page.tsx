import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Clock and Job Workflow — Worker Docs",
  description: "Step-by-step worker clock and job workflow instructions.",
};

export default function WorkerClockWorkflowPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Worker: Clock and Job Workflow"
        description="Follow a consistent clock pattern so labor attribution is accurate and exceptions are minimized."
        navGroups={docsNavGroups}
        currentPath="/docs/worker/clock-and-job-workflow"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "workflow", label: "Daily workflow" },
          { id: "exceptions", label: "Handling exceptions" },
          { id: "quality", label: "Quality expectations" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Capture accurate start, stop, and job transitions so payroll and job cost records stay reliable.
          </p>
        </section>

        <section id="workflow" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Daily workflow</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Select the correct assigned job before clocking in.</li>
            <li>Log breaks and job transitions in real time.</li>
            <li>Clock out only after confirming final job context.</li>
          </ol>
        </section>

        <section id="exceptions" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Handling exceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>If you miss a clock event, correct it as soon as possible.</li>
            <li>When switching jobs unexpectedly, log notes with reason.</li>
            <li>Flag unusual overtime events for supervisor review.</li>
          </ul>
        </section>

        <section id="quality" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Quality expectations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>No end-of-day bulk entry when real-time logging is possible.</li>
            <li>Entries map to the actual job worked.</li>
            <li>Exception notes are clear and concise.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/worker/timesheet-habits" className="text-fc-accent hover:underline">
              Timesheet Habits
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
