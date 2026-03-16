"use client";

import { FeatureSteps } from "@/components/feature-section";

export function HowItWorksSteps() {
  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20 md:py-24">
      <FeatureSteps
        title="How FieldCrew fits into your month"
        features={[
          {
            step: "1",
            title: "Techs clock into jobs only",
            content:
              "Your team uses FieldCrew to clock into specific jobs, so every hour is tied to real revenue instead of a generic shift.",
            image: "/blog/manual-vs-digital-time-tracking.jpg",
          },
          {
            step: "2",
            title: "Labour rolls up into a clean database",
            content:
              "FieldCrew aggregates time, pay rules, and job codes into a single source of truth for labour cost and performance.",
            image: "/blog/labour-spend-per-job-real-time.jpg",
          },
          {
            step: "3",
            title: "Owner sees a monthly labour profit report",
            content:
              "You get a clear report showing recoverable labour, overtime risk, and which jobs and techs are driving profit.",
            image: "/blog/hidden-payroll-leak.jpg",
          },
        ]}
        className="bg-[#111111] rounded-[24px]"
      />
    </section>
  );
}

