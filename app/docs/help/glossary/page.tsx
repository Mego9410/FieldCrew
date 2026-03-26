import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Glossary — FieldCrew Docs",
  description: "Definitions for key operational and reporting terms used in FieldCrew.",
};

const terms = [
  ["Labor leakage", "Recoverable margin loss caused by overruns, overtime, and untracked time."],
  ["Overrun", "Actual labor hours exceeding estimated hours for a job."],
  ["Overtime premium", "Incremental labor cost above standard rate for overtime hours."],
  ["Recoverable profit", "Estimated margin that can be recovered through operational improvements."],
  ["RPLH", "Revenue per labor hour, used to track productivity quality."],
];

export default function DocsGlossaryPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Help: Glossary"
        description="Shared definitions for core FieldCrew metrics and operating concepts."
        navGroups={docsNavGroups}
        currentPath="/docs/help/glossary"
        toc={[{ id: "terms", label: "Terms" }]}
      >
        <section id="terms">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Terms</h2>
          <div className="mt-4 space-y-3">
            {terms.map(([term, definition]) => (
              <article key={term} className="rounded-lg border border-fc-border bg-white p-4">
                <h3 className="font-semibold text-fc-brand">{term}</h3>
                <p className="mt-1 text-fc-muted">{definition}</p>
              </article>
            ))}
          </div>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
