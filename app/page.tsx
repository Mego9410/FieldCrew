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
import { headers } from "next/headers";

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
        <Hero regionName={visitorRegionName} />
        <CalculatorCoreValue />
        <IndustryProblem />
        <RelatableBusinessImpact />
        <MoneyDisappearsFlow />
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
