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
  title: "Getting Started Guide — FieldCrew",
  description: "Follow a self-guided path to estimate hidden labour leakage and review practical next steps.",
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <PublicPageShell>
        <PublicPageHero
          eyebrow="Conversion"
          title="Self-guided getting started path"
          description="Use this route to run your estimate, review a sample report, and move forward without scheduling a call."
        />
        <PublicSection title="What to do first">
          <FeatureGrid
            items={[
              "Run the profit leak estimate with your current team numbers",
              "Review the sample labour profit report format",
              "Identify the first workflow improvements to make internally",
            ]}
          />
        </PublicSection>
        <PublicSection
          title="What to prepare"
          description="Gather rough team size, jobs-per-week, and the top bottlenecks you are seeing today."
        >
          <FeatureGrid
            items={[
              "Current team structure and dispatch model",
              "How hours and overtime are tracked today",
              "Where estimate-to-actual drift appears most often",
            ]}
          />
        </PublicSection>
        <PublicSection title="Next step resources">
          <CTAButtons
            primary={{ label: "Run profit leak estimate", href: routes.public.profitLeak }}
            secondary={{ label: "View sample report", href: routes.public.sampleReport }}
          />
        </PublicSection>
      </PublicPageShell>
      <Footer />
    </>
  );
}
