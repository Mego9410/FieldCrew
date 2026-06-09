import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { SampleReportTutorial } from "@/components/sample-report/SampleReportTutorial";

export const metadata: Metadata = {
  title: "Sample HVAC Labor Profit Report",
  description:
    "See a sample Monthly Labor Profit Report for a 10-tech HVAC company: overtime breakdown, job overruns, leakage sources, and recoverable profit.",
  alternates: { canonical: "/sample-report" },
};

export default function SampleReportPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen bg-fc-page">
        <SampleReportTutorial />
      </main>
      <Footer />
    </>
  );
}
