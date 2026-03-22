import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { IndustryProblem } from "@/components/landing/IndustryProblem";
import { RelatableBusinessImpact } from "@/components/landing/RelatableBusinessImpact";
import { MoneyDisappearsFlow } from "@/components/landing/MoneyDisappearsFlow";
import { CalculatorCoreValue } from "@/components/landing/CalculatorCoreValue";
import { Solution } from "@/components/landing/Solution";
import { ObjectionHandling } from "@/components/landing/ObjectionHandling";
import { SimpleStart } from "@/components/landing/SimpleStart";
import { PricingSection4 } from "@/components/landing/PricingSection4";
import { FinalCta } from "@/components/landing/FinalCta";
import { CtaSupportMicrocopy } from "@/components/landing/CtaSupportMicrocopy";
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
        <IndustryProblem />
        <RelatableBusinessImpact />
        <MoneyDisappearsFlow />
        <CalculatorCoreValue />
        <Solution />
        <ObjectionHandling />
        <SimpleStart />
        <PricingSection4 variant="marketing" />
        <FinalCta />
        <CtaSupportMicrocopy />
      </main>
      <Footer />
    </>
  );
}
