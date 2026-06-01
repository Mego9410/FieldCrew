import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { PlansScrollPrompt } from "@/components/landing/PlansScrollPrompt";
import { headers } from "next/headers";
import { InstrumentHero } from "@/components/landing/InstrumentHero";
import { InstrumentCalculator } from "@/components/landing/InstrumentCalculator";
import {
  InstrumentCompareSection,
  InstrumentHowItWorks,
  InstrumentReassurance,
  InstrumentScaleSection,
} from "@/components/landing/InstrumentSections";
import { InstrumentPricing } from "@/components/landing/InstrumentPricing";
import { InstrumentFinalCta } from "@/components/landing/InstrumentFinalCta";

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

async function getVisitorRegionName(): Promise<string | null> {
  const requestHeaders = await headers();
  const countryCode = requestHeaders.get("x-vercel-ip-country");
  const regionCode = requestHeaders.get("x-vercel-ip-country-region");

  if (!countryCode || !regionCode) {
    return null;
  }

  // Vercel provides ISO region codes; expand US states for friendlier marketing copy.
  if (countryCode.toUpperCase() === "US") {
    return US_STATE_NAMES[regionCode.toUpperCase()] ?? null;
  }

  return null;
}

export default async function Home() {
  const visitorRegionName = await getVisitorRegionName();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://fieldcrew.com/#organization",
        name: "FieldCrew",
        url: "https://fieldcrew.com/",
      },
      {
        "@type": "WebSite",
        "@id": "https://fieldcrew.com/#website",
        url: "https://fieldcrew.com/",
        name: "FieldCrew",
        publisher: { "@id": "https://fieldcrew.com/#organization" },
      },
      {
        "@type": "WebPage",
        "@id": "https://fieldcrew.com/#webpage",
        url: "https://fieldcrew.com/",
        name: "FieldCrew — Recover hidden labor profit",
        isPartOf: { "@id": "https://fieldcrew.com/#website" },
        about: { "@id": "https://fieldcrew.com/#organization" },
      },
    ],
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PlansScrollPrompt heroId="homepage-hero" pricingId="pricing" href="/#pricing" />
        <div id="homepage-hero">
          <InstrumentHero regionName={visitorRegionName} />
        </div>
        <InstrumentCalculator />
        <InstrumentScaleSection />
        <InstrumentCompareSection />
        <InstrumentHowItWorks />
        <InstrumentReassurance />
        <InstrumentPricing />
        <InstrumentFinalCta />
      </main>
      <Footer />
    </>
  );
}
