import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "First Login and Dashboard — Worker Docs",
  description: "Worker onboarding for first login and dashboard orientation.",
};

export default function WorkerFirstLoginDashboardPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Worker: First Login and Dashboard"
        description="Get workers confidently into the app and aligned on daily workflow expectations."
        navGroups={docsNavGroups}
        currentPath="/docs/worker/first-login-and-dashboard"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "first-login", label: "First login checklist" },
          { id: "dashboard", label: "Dashboard orientation" },
          { id: "mistakes", label: "Common mistakes" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Ensure each worker can access their dashboard and understand the day’s assigned work context.
          </p>
        </section>

        <section id="first-login" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">First login checklist</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-fc-muted">
            <li>Open worker link and confirm identity/token context.</li>
            <li>Review assigned jobs and expected shift priorities.</li>
            <li>Confirm clock workflow and required notes standards.</li>
          </ol>
        </section>

        <section id="dashboard" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Dashboard orientation</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Current active job and status.</li>
            <li>Clock state and next required action.</li>
            <li>Recent entries and correction path if needed.</li>
          </ul>
        </section>

        <section id="mistakes" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Common mistakes and fixes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Wrong job context: switch job before clocking.</li>
            <li>Missed first clock event: add corrective entry immediately.</li>
            <li>No notes on exceptions: require short reason with each variance.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Next guide:{" "}
            <Link href="/docs/worker/clock-and-job-workflow" className="text-fc-accent hover:underline">
              Clock and Job Workflow
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
