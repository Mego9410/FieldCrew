import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Book a Walkthrough — FieldCrew",
  description: "Book a 15-minute walkthrough of FieldCrew. See how we help HVAC teams recover hidden labour profit.",
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen bg-fc-page">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-fc-brand sm:text-4xl">
            Book 15-Min Walkthrough
          </h1>
          <p className="mt-4 text-lg text-fc-muted">
            See how FieldCrew surfaces labour profit leakage and get a report like the sample — for your company.
          </p>
          <div className="mt-10 rounded-md border border-fc-border bg-white p-8 shadow-fc-sm">
            <p className="text-fc-muted">
              Scheduling and calendar integration coming soon. For now, reach out to schedule your walkthrough.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 font-semibold text-white hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
