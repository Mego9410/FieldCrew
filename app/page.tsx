import { MarketingNav } from "@/components/sections/MarketingNav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { RealScenario } from "@/components/sections/RealScenario";
import { Features } from "@/components/sections/Features";
import { Differentiation } from "@/components/sections/Differentiation";
import { ProofTrust } from "@/components/sections/ProofTrust";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[#0a0a0a] focus:outline-none"
      >
        Skip to main content
      </a>
      <MarketingNav />
      <main id="main" className="overflow-x-hidden bg-[#0a0a0a]">
        <Hero />
        <Problem />
        <RealScenario />
        <Features />
        <Differentiation />
        <ProofTrust />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
