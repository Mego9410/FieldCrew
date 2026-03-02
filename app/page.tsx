import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { RealScenario } from "@/components/landing/RealScenario";
import { Solution } from "@/components/landing/Solution";
import { Differentiation } from "@/components/landing/Differentiation";
import { ProofTrust } from "@/components/landing/ProofTrust";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-fc-accent focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <RealScenario />
        <Solution />
        <Differentiation />
        <ProofTrust />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
