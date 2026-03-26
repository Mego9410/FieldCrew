import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Documentation — FieldCrew",
  description: "Guides and documentation for using FieldCrew.",
};

export default function DocsPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="FieldCrew Documentation"
        description="Tutorials and operational playbooks for Owner/Admin and Worker roles."
        navGroups={docsNavGroups}
        currentPath="/docs"
        toc={[
          { id: "quick-start", label: "Quick start" },
          { id: "popular-guides", label: "Popular guides" },
          { id: "advanced", label: "Advanced playbooks" },
          { id: "help", label: "Troubleshooting and help" },
        ]}
      >
        <section id="quick-start">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Quick start checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-fc-muted">
            <li>Complete owner setup and first-week onboarding tasks.</li>
            <li>Create or verify workers, jobs, and time workflows.</li>
            <li>Review reporting pages and identify first recovery opportunities.</li>
          </ol>
        </section>

        <section id="popular-guides" className="mt-10">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Popular guides</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Owner Getting Started",
                href: "/docs/owner/getting-started",
                body: "Set up your account, team, and first operating cadence.",
              },
              {
                title: "Jobs and Projects",
                href: "/docs/owner/jobs-and-projects",
                body: "Run jobs cleanly from estimate through completion.",
              },
              {
                title: "Worker Clock Workflow",
                href: "/docs/worker/clock-and-job-workflow",
                body: "Consistent in-field clocking and job assignment habits.",
              },
              {
                title: "Reporting and Insights",
                href: "/docs/owner/reporting-and-insights",
                body: "Turn dashboards into weekly decisions and actions.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-fc-border bg-white p-5 shadow-fc-sm transition-colors hover:bg-fc-surface-muted"
              >
                <h3 className="font-display text-lg font-semibold text-fc-brand">{item.title}</h3>
                <p className="mt-2 text-sm text-fc-muted">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="advanced" className="mt-10">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Advanced playbooks</h2>
          <p className="mt-3 text-fc-muted">
            SOP-style guides for margin recovery, overtime reduction, estimate accuracy, and weekly role-based reviews.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/docs/playbooks/margin-recovery-cadence" className="text-fc-accent hover:underline">
              Margin recovery cadence
            </Link>
            <Link href="/docs/playbooks/overtime-reduction" className="text-fc-accent hover:underline">
              Overtime reduction
            </Link>
            <Link href="/docs/playbooks/estimate-accuracy" className="text-fc-accent hover:underline">
              Estimate accuracy
            </Link>
            <Link href="/docs/playbooks/weekly-review-template" className="text-fc-accent hover:underline">
              Weekly review template
            </Link>
          </div>
        </section>

        <section id="help" className="mt-10 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Troubleshooting and help</h2>
          <p className="mt-3 text-fc-muted">
            Start with symptom-based troubleshooting, then use FAQ and glossary references for faster resolution.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/docs/help/troubleshooting-matrix" className="text-fc-accent hover:underline">
              Troubleshooting matrix
            </Link>
            <Link href="/docs/help/faq" className="text-fc-accent hover:underline">
              FAQ
            </Link>
            <Link href="/docs/help/glossary" className="text-fc-accent hover:underline">
              Glossary
            </Link>
          </div>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
