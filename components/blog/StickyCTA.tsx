"use client";

import { HiddenProfitCta } from "@/components/HiddenProfitCta";

interface StickyCTAProps {
  label?: string;
  href?: string;
  className?: string;
}

export function StickyCTA({
  label = "Show Me The Hidden Profit",
  className = "",
}: StickyCTAProps) {
  return (
    <div
      className={`hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-40 w-40 ${className}`}
      aria-label="Sticky call to action"
    >
      <HiddenProfitCta
        label={label}
        auditUrl="/book"
        className="block w-full rounded-md border border-fc-accent bg-fc-surface px-4 py-3 text-center text-sm font-semibold text-fc-accent shadow-fc-md hover:bg-fc-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
      />
    </div>
  );
}
