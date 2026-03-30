import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { HiddenProfitFlow } from "@/components/HiddenProfitFlow";
import {
  CTAButtons,
  PublicPageHero,
  PublicPageShell,
  PublicSection,
} from "@/components/landing/PublicPagePrimitives";
import { routes } from "@/lib/routes";

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
      <PublicPageShell>
        <PublicPageHero
          eyebrow="Calculator"
          title="Hidden labour profit calculator"
          description="Estimate losses from overtime, untracked time, and overruns, then turn that estimate into a practical recovery plan."
        />
        <HiddenProfitFlow />
        <PublicSection title="What to do with the result">
          <CTAButtons
            primary={{ label: "View sample report", href: routes.public.sampleReport }}
            secondary={{ label: "Explore docs", href: routes.public.docs }}
          />
        </PublicSection>
      </PublicPageShell>
      <Footer />
    </>
  );
}
