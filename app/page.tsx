import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { ProductDemos } from "@/components/landing/ProductDemos";
import { Features } from "@/components/landing/Features";
import { Differentiation } from "@/components/landing/Differentiation";
import { BlogSection } from "@/components/landing/BlogSection";
import { HiddenProfitSection } from "@/components/landing/HiddenProfitSection";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { getAllPosts } from "@/lib/blog/loaders";

export default function Home() {
  const blogPosts = getAllPosts();
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
        <Features />
        <Differentiation />
        <BlogSection posts={blogPosts} />
        <HiddenProfitSection />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
