import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ContractorsSolutionsContent } from "@/components/solutions/ContractorsSolutionsContent";

export const metadata: Metadata = {
  title: "Contractor Operations — FieldCrew",
  description: "Operational visibility tools for contractor teams managing field labour and margin.",
};

export default function SolutionsContractorsPage() {
  return (
    <>
      <Nav />
      <ContractorsSolutionsContent />
      <Footer />
    </>
  );
}
