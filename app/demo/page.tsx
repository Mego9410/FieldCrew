import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import {
  CTAButtons,
  FeatureGrid,
  PublicPageHero,
  PublicPageShell,
  PublicSection,
} from "@/components/landing/PublicPagePrimitives";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Watch Demo — FieldCrew",
  description: "Explore FieldCrew product highlights and see how owner views and labor profit reports work for HVAC teams.",
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <PublicPageShell>
        <PublicPageHero
          eyebrow="Conversion"
          title="Product demo highlights"
          description="A focused overview of owner workflows and where labor margin risk appears first."
        />
        <PublicSection title="What you will see">
          <FeatureGrid
            items={[
              "Weekly labor leak estimate and trend signal",
              "Job and worker performance views",
              "Actionable recovery priorities by impact",
            ]}
          />
        </PublicSection>
        <PublicSection
          title="Recommended next step"
          description="Start with a sample report, then run your own estimate to map likely recovery opportunities."
        >
          <CTAButtons
            primary={{ label: "See real sample report", href: routes.public.sampleReport }}
            secondary={{ label: "Run profit leak estimate", href: routes.public.profitLeak }}
          />
        </PublicSection>
      </PublicPageShell>
      <Footer />
    </>
  );
}
