"use client";

import Link from "next/link";
import { track } from "@/lib/tracking";

const DEFAULT_LABELS = [
  "Show Me The Hidden Profit",
  "See a Real Labour Profit Report",
  "See Where $6,420 Was Recovered",
] as const;

interface HiddenProfitCtaProps {
  /** CTA button label. Default: "Show Me The Hidden Profit" */
  label?: string;
  className?: string;
  /** URL for "Book a 15-Minute Labour Audit". Default: "/book" */
  auditUrl?: string;
  /** Variant for styling: link-style or button-style */
  variant?: "button" | "link";
}

const buttonBaseStyles =
  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-6 py-3 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

export function HiddenProfitCta({
  label = DEFAULT_LABELS[0],
  className = "",
  variant = "button",
}: HiddenProfitCtaProps) {
  const isLink = variant === "link";
  const buttonClass = isLink
    ? "inline-flex items-center font-semibold text-fc-accent underline hover:text-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
    : `${buttonBaseStyles} focus:ring-fc-accent focus:ring-offset-2`;

  const buttonStyle =
    !isLink
      ? { backgroundColor: "var(--fc-accent)", color: "#fff" }
      : undefined;

  return (
    <Link
      href="/hidden-profit"
      className={`${buttonClass} ${className}`}
      style={buttonStyle}
      data-cta="hidden-profit"
      onClick={() => track("hidden_profit_opened")}
    >
      {label}
    </Link>
  );
}

export { DEFAULT_LABELS as HIDDEN_PROFIT_CTA_LABELS };
