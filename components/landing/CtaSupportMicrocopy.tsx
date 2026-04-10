"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBand } from "@/components/landing/PublicPagePrimitives";

export function CtaSupportMicrocopy() {
  return (
    <SectionBand
      variant="white"
      className="py-10 sm:py-12 lg:py-14"
      labelledBy="cta-support-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p id="cta-support-heading" className="text-sm font-semibold text-fc-muted">
            No meetings required. No pressure sales process.
          </p>
          <p className="mt-2 text-sm text-fc-muted">
            Get your estimate first, built for HVAC owners and operations managers.
          </p>
        </ScrollReveal>
      </div>
    </SectionBand>
  );
}

