import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Common Errors and Fixes — Worker Docs",
  description: "Quick fixes for common worker-side usage errors.",
};

export default function WorkerCommonErrorsPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Worker: Common Errors and Fixes"
        description="Use this quick guide to resolve common worker workflow issues without delay."
        navGroups={docsNavGroups}
        currentPath="/docs/worker/common-errors-and-fixes"
        toc={[
          { id: "clock-errors", label: "Clock errors" },
          { id: "job-errors", label: "Job assignment issues" },
          { id: "access-errors", label: "Access problems" },
        ]}
      >
        <section id="clock-errors">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Clock errors</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Missing clock-in: add correction entry and note the reason.</li>
            <li>Wrong clock-out time: edit entry before period close.</li>
            <li>Duplicate entry: delete duplicate and retain accurate event.</li>
          </ul>
        </section>

        <section id="job-errors" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Job assignment issues</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Wrong job selected: move time to correct job immediately.</li>
            <li>Job unavailable: notify supervisor before creating workaround entries.</li>
            <li>Unexpected reassignment: add context note with timestamp.</li>
          </ul>
        </section>

        <section id="access-errors" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Access problems</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Token/session issues: reopen your worker link and retry.</li>
            <li>Permission mismatch: escalate to Owner/Admin for role verification.</li>
            <li>Persistent errors: report exact screen and timestamp to support.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Need help?{" "}
            <Link href="/docs/help/troubleshooting-matrix" className="text-fc-accent hover:underline">
              Open troubleshooting matrix
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
