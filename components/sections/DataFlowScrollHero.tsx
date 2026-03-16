"use client";

import ScrollExpandMedia from "@/components/scroll-expansion-hero";

export function DataFlowScrollHero() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/blog/labour-spend-per-job-real-time.jpg"
      bgImageSrc="/blog/hidden-payroll-leak.jpg"
      title="Every tech. Every job. One clear picture."
      date="Field data in"
      scrollToExpand="Scroll to see how FieldCrew turns it into company-wide clarity."
      textBlend
      centerLabel="FieldCrew"
      lowerLeftLabel="Overtime"
      lowerRightLabel="Payroll"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 text-left text-white">
        <h2 className="font-legend-display text-3xl font-semibold tracking-tight sm:text-4xl">
          All the chaos in the field, finally organised for the owner.
        </h2>
        <p className="font-legend-body text-base text-[#d4d4d8] sm:text-lg">
          Every clock-in, every job code, every overtime hour flows into FieldCrew&apos;s
          database. Instead of scattered timesheets and guesswork, you get a single,
          trustworthy picture of how labour is really performing.
        </p>
        <ul className="space-y-3 font-legend-body text-sm text-[#e4e4e7] sm:text-base">
          <li className="flex gap-2">
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b7cff]"
              aria-hidden
            />
            Techs clock into jobs only — no generic shifts or uncoded hours slipping
            through the cracks.
          </li>
          <li className="flex gap-2">
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9d6cff]"
              aria-hidden
            />
            FieldCrew aggregates every job into a live labour database, ready for
            true margin by job, service type, and tech.
          </li>
          <li className="flex gap-2">
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]"
              aria-hidden
            />
            Owners see clear KPIs — recoverable labour, overtime risk, underpriced
            work — instead of a pile of spreadsheets.
          </li>
        </ul>
        <p className="font-legend-body text-sm text-[#a1a1aa] sm:text-base">
          Scroll back up and down in this section to feel what it&apos;s like when every
          worker&apos;s data rolls into one source of truth — then keep going to see what
          FieldCrew does with it.
        </p>
      </div>
    </ScrollExpandMedia>
  );
}

