"use client";

import Link from "next/link";
import { DollarSign, ArrowRight } from "lucide-react";

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
    <Link
      href={href}
      className="group block rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
          <DollarSign className="h-6 w-6 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900">Recoverable Profit (Estimate)</h3>
          <p className="mt-2 text-3xl font-bold text-amber-900">{formattedAmount}/mo recoverable</p>
          <p className="mt-2 text-sm text-amber-800">
            Potential savings from reducing overtime, overruns, and idle time. Based on industry benchmarks.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-900 group-hover:gap-2 transition-all">
            <span>See how</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
