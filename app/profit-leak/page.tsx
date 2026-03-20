import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProfitLeakCalculator } from "@/components/landing/ProfitLeakCalculator";

export const metadata: Metadata = {
  title: "Profit Leak Calculator — FieldCrew",
  description:
    "Estimate your monthly profit leak from under-quoted labor and overtime. See the dollar number in under a minute.",
};

export default function ProfitLeakPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-fc-accent focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <ProfitLeakCalculator />
      </main>
      <Footer />
    </>
  );
}

