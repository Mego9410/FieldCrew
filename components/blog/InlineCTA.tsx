"use client";

import { HiddenProfitCta } from "@/components/HiddenProfitCta";

interface InlineCTAProps {
  heading?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  className?: string;
}

export function InlineCTA({
  heading = "Recover 8–15% hidden labour profit",
  description = "See where every hour goes. Get a sample report.",
  buttonLabel = "Show Me The Hidden Profit",
  className = "",
}: InlineCTAProps) {
  return (
    <section
      className={`my-10 p-6 border border-fc-border bg-fc-surface-muted/50 rounded-lg ${className}`}
      aria-labelledby="inline-cta-heading"
    >
      <h2
        id="inline-cta-heading"
        className="font-display text-lg font-bold text-fc-brand"
      >
        {heading}
      </h2>
      <p className="mt-2 text-sm text-fc-muted">{description}</p>
      <div className="mt-4 inline-block" data-cta="blog-inline">
        <HiddenProfitCta
          label={buttonLabel}
          auditUrl="/book"
          variant="button"
          className="min-h-[44px] min-w-[44px] rounded-md px-5 py-2.5"
        />
      </div>
    </section>
  );
}
