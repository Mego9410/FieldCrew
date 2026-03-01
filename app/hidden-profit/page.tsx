import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { HiddenProfitFlow } from "@/components/HiddenProfitFlow";

export const metadata: Metadata = {
  title: "Hidden Labour Profit Calculator — FieldCrew",
  description:
    "Estimate how much labour profit you're losing to overtime, untracked time, and job overruns. See a real sample report.",
};

export default function HiddenProfitPage() {
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
        <HiddenProfitFlow auditUrl="/book" />
      </main>
      <Footer />
    </>
  );
}
