import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { SampleReportTutorial } from "@/components/sample-report/SampleReportTutorial";

export const metadata: Metadata = {
  title: "Sample Monthly Labour Profit Report — FieldCrew",
  description:
    "See a real example of FieldCrew’s Monthly Labour Profit Report for a 10-tech HVAC company. Overtime breakdown, job overruns, leakage sources, and recoverable profit.",
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
