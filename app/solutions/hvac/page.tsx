import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { HvacSolutionsContent } from "@/components/solutions/HvacSolutionsContent";

export const metadata: Metadata = {
  title: "HVAC Solution — FieldCrew",
  description: "How FieldCrew helps HVAC businesses recover hidden labor profit.",
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
