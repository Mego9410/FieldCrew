import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { SmallTeamsSolutionsContent } from "@/components/solutions/SmallTeamsSolutionsContent";

export const metadata: Metadata = {
  title: "Small Team Operations — FieldCrew",
  description: "FieldCrew for small service teams that need margin visibility without complexity.",
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
