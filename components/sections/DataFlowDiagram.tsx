"use client";

import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export function DataFlowDiagram() {
  return (
    <section
      aria-label="How field data flows into FieldCrew"
      className="bg-[#0a0a0a] py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <span className="mb-3 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            DATA FLOW
          </span>
          <h2 className="font-legend-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Every tech&apos;s hours, one clear picture.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-legend-body text-sm text-[#d4d4d8] sm:text-base">
            Picture every tech out on jobs sending their hours and job codes into one
            place. FieldCrew turns that stream of field activity into a single, reliable
            view the owner can actually use.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[24px]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
              FIELD INPUT → OWNER VIEW
            </p>
            <h3 className="mt-3 font-legend-display text-lg font-semibold text-white">
              Workers feed data in, FieldCrew brings it together for the owner.
            </h3>
            <ul className="mt-4 space-y-3 font-legend-body text-sm text-[#e4e4e7]">
              <li>
                Techs clock into specific jobs only — hours, overtime, and travel all land
                against real work, not generic shifts.
              </li>
              <li>
                FieldCrew&apos;s database pulls in every job, worker, and pay rule so you
                see true labour cost by job type and crew.
              </li>
              <li>
                Owners get a clear company view: recoverable labour, overtime risk, and
                underpriced work surfaced automatically.
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <DatabaseWithRestApi
              title="Every tech & job flowing into FieldCrew"
              circleText="HVAC"
              badgeTexts={{
                first: "Field time",
                second: "Overtime",
                third: "Jobs",
                fourth: "Idle",
              }}
              buttonTexts={{
                first: "Tech timesheets",
                second: "Owner KPIs",
              }}
              lightColor="#5b7cff"
              className="max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

