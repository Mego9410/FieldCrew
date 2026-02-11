import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { ProductDemos } from "@/components/landing/ProductDemos";
import { Features } from "@/components/landing/Features";
import { Statistics } from "@/components/landing/Statistics";
import { Differentiation } from "@/components/landing/Differentiation";
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
        <TrustBadges />
        <SectionDivider />
        <Problem />
        <Solution />
        <ProductDemos />
        <Statistics />
        <Features />
        <Differentiation />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
