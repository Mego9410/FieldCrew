import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/loaders";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";
const baseUrl = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export const metadata: Metadata = {
  title: "Field Notes — FieldCrew Blog | Profit Recovery & Operational Control",
  description:
    "HVAC field notes on payroll leakage, job costing, time tracking, and recovering 8–15% hidden labour profit. Practical insights for contractors.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: "Field Notes — FieldCrew Blog",
    description:
      "HVAC field notes on profit recovery, job costing, and operational control.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes — FieldCrew Blog",
    description:
      "HVAC field notes on profit recovery, job costing, and operational control.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="border-b border-fc-border bg-white">
      {/* Hero */}
      <section
        className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20"
        aria-labelledby="blog-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
              FieldCrew Field Notes
            </p>
            <h1
              id="blog-heading"
              className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl"
            >
              Profit recovery & operational control
            </h1>
            <p className="mt-4 text-lg text-fc-muted">
              Practical insights for HVAC owners: payroll leakage, job costing,
              time tracking, and how to see labour spend per job in real time.
            </p>
          </div>
        </div>
      </section>

      <BlogIndexClient posts={posts} />
    </div>
  );
}
