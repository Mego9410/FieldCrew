import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "FAQ — FieldCrew Docs",
  description: "Frequently asked questions for owners, admins, and workers.",
};

const faqs = [
  {
    q: "How often should we review dashboards?",
    a: "Run a formal weekly review and a quick mid-week scan for high-risk signals.",
  },
  {
    q: "What if workers forget to clock in?",
    a: "Correct the entry same day and include a short reason to preserve audit quality.",
  },
  {
    q: "What is the fastest way to reduce labor leakage?",
    a: "Target recurring overrun and overtime drivers first, then track outcomes over two cycles.",
  },
];

export default function DocsFaqPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Help: Frequently Asked Questions"
        description="Quick answers to common implementation and daily usage questions."
        navGroups={docsNavGroups}
        currentPath="/docs/help/faq"
        toc={[{ id: "faq-list", label: "FAQ list" }]}
      >
        <section id="faq-list">
          <h2 className="font-display text-2xl font-bold text-fc-brand">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-lg border border-fc-border bg-white p-5">
                <h3 className="font-semibold text-fc-brand">{item.q}</h3>
                <p className="mt-2 text-fc-muted">{item.a}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-fc-muted">
            Need symptom-based diagnosis?{" "}
            <Link href="/docs/help/troubleshooting-matrix" className="text-fc-accent hover:underline">
              Open troubleshooting matrix
            </Link>
            .
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
