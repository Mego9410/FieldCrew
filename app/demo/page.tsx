import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Watch Demo — FieldCrew",
  description: "Watch a 2-minute demo of FieldCrew. See how owner views and labour profit reports work for HVAC teams.",
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen bg-fc-page">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-fc-brand sm:text-4xl">
            Watch 2-Minute Demo
          </h1>
          <p className="mt-4 text-lg text-fc-muted">
            See how FieldCrew helps you control payroll and recover hidden labour profit.
          </p>
          <div className="mt-10 rounded-md border border-fc-border bg-white p-8 shadow-fc-sm">
            <p className="text-fc-muted">
              Demo video coming soon. In the meantime, see a real sample report.
            </p>
            <Link
              href="/sample-report"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 font-semibold text-white hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            >
              See a Real Labour Profit Report
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
