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
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ShareLinks } from "@/components/landing/ShareLinks";

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
        <Hero regionName={visitorRegionName} />
        <CalculatorCoreValue />
        <IndustryProblem />
        <RelatableBusinessImpact />
        <MoneyDisappearsFlow />
        <Solution />
        <ObjectionHandling />
        <SimpleStart />
        <section
          aria-labelledby="homepage-seo-copy"
          className="border-b border-fc-border bg-white py-14 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fc-muted">
                  Background
                </p>
                <h2
                  id="homepage-seo-copy"
                  className="mt-3 font-display text-2xl font-bold text-fc-brand sm:text-3xl"
                >
                  Find where labor profit disappears (and recover it)
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-7 text-fc-muted sm:text-base">
                  <p>
                    FieldCrew is built for owner-operators running small HVAC teams who feel busy but
                    can’t see why margins don’t match the schedule. The leak usually isn’t demand.
                    It’s the quiet gap between what was quoted and what actually happened in the field:
                    jobs that run long, untracked time, and overtime used to catch up after the plan slips.
                  </p>
                  <p>
                    If you manage 5–20 technicians, those small overruns repeat across dozens of jobs
                    per month. One callback, one install that goes 60–90 minutes over, one day where the
                    crew loses an hour to parts or paperwork — it adds up. The result is labor cost
                    drifting past what you billed, and payroll eating the margin you expected to keep.
                  </p>
                  <details className="group rounded-xl border border-fc-border bg-fc-surface px-4 py-3 shadow-fc-sm open:bg-white">
                    <summary className="cursor-pointer list-none font-semibold text-fc-brand outline-none [&::-webkit-details-marker]:hidden">
                      Read the quick breakdown
                      <span className="ml-2 text-fc-muted group-open:hidden">+</span>
                      <span className="ml-2 text-fc-muted hidden group-open:inline">–</span>
                    </summary>
                    <div className="mt-3 space-y-3 text-[15px] leading-7 text-fc-muted sm:text-base">
                      <p>
                        FieldCrew helps you measure the problem in a way you can act on. Instead of guessing,
                        you can review quoted vs actual time, identify patterns (which job types, which days,
                        which crews), and prioritize the fixes that recover profit fastest.
                      </p>
                      <p>
                        This isn’t time tracking for the sake of tracking. It’s a simple, owner-friendly way
                        to connect field reality to the numbers that matter: labor efficiency, overtime exposure,
                        and the true cost of each job type.
                      </p>
                      <p>
                        Start with a quick calculator to estimate the monthly impact, then use the same workflow
                        to build a practical recovery cadence. The goal isn’t more spreadsheets — it’s clarity:
                        where the money is going, what to change next, and how to protect your margins as you grow.
                      </p>
                    </div>
                  </details>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-fc-border bg-fc-surface p-5 shadow-fc-sm">
                  <h3 className="font-display text-lg font-bold text-fc-brand">
                    Popular resources
                  </h3>
                  <p className="mt-2 text-sm text-fc-muted">
                    Jump straight to the calculators, examples, and next steps.
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-1">
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.profitLeak}>
                        Profit leak calculator
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.hiddenProfit}>
                        Hidden labor profit calculator
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href="#how-it-works">
                        How it works
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.sampleReport}>
                        Sample report
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.owner.subscribe}>
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.blog}>
                        Blog for HVAC owners
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.about}>
                        About FieldCrew
                      </Link>
                    </li>
                    <li>
                      <Link className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline" href={routes.public.support}>
                        Support
                      </Link>
                    </li>
                  </ul>

                  <p className="mt-4 text-xs text-fc-muted">
                    External reference:{" "}
                    <a
                      href="https://www.dol.gov/agencies/whd/overtime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-fc-accent underline underline-offset-4 hover:no-underline"
                    >
                      U.S. Department of Labor — Overtime pay
                    </a>
                  </p>
                </div>

                <div className="rounded-2xl border border-fc-border bg-slate-50 p-5">
                  <h3 className="font-display text-lg font-bold text-fc-brand">
                    Share FieldCrew
                  </h3>
                  <p className="mt-2 text-sm text-fc-muted">
                    Send this page to another owner who’s feeling the margin squeeze.
                  </p>
                  <div className="mt-4">
                    <ShareLinks
                      url="https://fieldcrew.com/"
                      title="FieldCrew — Recover hidden labor profit"
                      ariaLabel="Share FieldCrew homepage"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <PricingSection4 variant="marketing" />
        <FinalCta />
        <CtaSupportMicrocopy />
      </main>
      <Footer />
    </>
  );
}
