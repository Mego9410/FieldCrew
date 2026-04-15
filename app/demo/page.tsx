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
  description:
    "Explore FieldCrew product highlights and see how owner views and labor profit reports work for HVAC teams.",
};

export default function DemoPage() {
  const vimeoId = process.env.NEXT_PUBLIC_DEMO_VIMEO_ID ?? "";
  return (
    <>
      <Nav />
      <PublicPageShell>
        <PublicPageHero
          eyebrow="Conversion"
          title="Product demo highlights"
          description="A focused overview of owner workflows and where labor margin risk appears first."
        />
        <PublicSection title="Watch the demo">
          {vimeoId ? (
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-fc-lg ring-1 ring-slate-900/[0.06]">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  title="FieldCrew product demo"
                  src={`https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?title=0&byline=0&portrait=0`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">Demo video is being linked.</p>
              <p className="mt-2 text-sm text-slate-600">
                When ready, set <code className="font-mono">NEXT_PUBLIC_DEMO_VIMEO_ID</code> to show the Vimeo
                embed here.
              </p>
            </div>
          )}
        </PublicSection>
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
