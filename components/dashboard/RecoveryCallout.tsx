"use client";

import { ArrowRight } from "lucide-react";
import { CardLink } from "@/components/ui/Card";

export interface RecoveryCalloutProps {
  recoverableAmount: number;
  href: string;
}

export function RecoveryCallout({ recoverableAmount, href }: RecoveryCalloutProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(recoverableAmount);

  return (
    <CardLink
      href={href}
      variant="highlight"
      className="block p-6 no-underline"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Recoverable Profit (Estimate)
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white">{formattedAmount}/mo</p>
          <p className="mt-2 text-sm text-slate-400">
            Potential savings from reducing overtime, overruns, and idle time.
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold text-fc-accent group-hover:underline">
          See how <ArrowRight className="inline h-4 w-4" />
        </span>
      </div>
    </CardLink>
  );
}
