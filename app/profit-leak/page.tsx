import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProfitLeakCalculator } from "@/components/landing/ProfitLeakCalculator";
import {
  CTAButtons,
  PublicPageHero,
  PublicPageShell,
  PublicSection,
} from "@/components/landing/PublicPagePrimitives";
import { routes } from "@/lib/routes";

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
      <PublicPageShell>
        <PublicPageHero
          className="py-8 sm:py-10 lg:py-12"
          eyebrow="Calculator"
          title="Profit leak calculator"
          description="Estimate monthly recoverable labor profit from under-quoted work and overtime pressure in under a minute."
        />
        <ProfitLeakCalculator />
        <PublicSection
          title="This is what’s happening in your business right now — ready to fix it?"
          description="Move from estimate to action and set up your account today."
        >
          <CTAButtons
            primary={{ label: "Start tracking my jobs properly", href: `${routes.owner.subscribe}?plan=pro` }}
            secondary={{ label: "See plan options", href: routes.owner.subscribe }}
          />
          <p className="mt-4 text-sm font-medium text-fc-muted">Takes less than 10 minutes to set up</p>
        </PublicSection>
      </PublicPageShell>
      <Footer />
    </>
  );
}

