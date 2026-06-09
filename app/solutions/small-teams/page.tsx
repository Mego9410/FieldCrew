import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { SmallTeamsSolutionsContent } from "@/components/solutions/SmallTeamsSolutionsContent";

export const metadata: Metadata = {
  title: "Field Service Software for Small HVAC Teams",
  description:
    "Workforce software for 3–50 tech shops: scheduling, time tracking, and payroll with job-level labor cost. No enterprise complexity. Start for $9.",
  alternates: { canonical: "/solutions/small-teams" },
};

export default function SolutionsSmallTeamsPage() {
  return (
    <>
      <Nav />
      <SmallTeamsSolutionsContent />
      <Footer />
    </>
  );
}
