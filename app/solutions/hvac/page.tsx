import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { HvacSolutionsContent } from "@/components/solutions/HvacSolutionsContent";

export const metadata: Metadata = {
  title: "HVAC Workforce Management Software",
  description:
    "Scheduling, time tracking, and payroll for HVAC crews — with live job-cost visibility so labor stops eating your margin. Start for $9.",
  alternates: { canonical: "/solutions/hvac" },
};

export default function SolutionsHvacPage() {
  return (
    <>
      <Nav />
      <HvacSolutionsContent />
      <Footer />
    </>
  );
}
