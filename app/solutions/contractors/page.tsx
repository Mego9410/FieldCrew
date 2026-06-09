import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ContractorsSolutionsContent } from "@/components/solutions/ContractorsSolutionsContent";

export const metadata: Metadata = {
  title: "Contractor Labor & Margin Software",
  description:
    "Field labor visibility for US contractors: track hours by job, spot overruns, and protect margin without spreadsheet chaos. Start for $9.",
  alternates: { canonical: "/solutions/contractors" },
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
