"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

export interface RecoverableProfitBlockProps {
  recoverableAmount: number;
  pctOfPayroll: number;
  href?: string;
}

export function RecoverableProfitBlock({
  recoverableAmount,
  pctOfPayroll,
  href = routes.owner.dashboard.recovery,
}: RecoverableProfitBlockProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(recoverableAmount);

  const content = (
    <div className="rounded-xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm transition-shadow hover:shadow-fc-md md:p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">
        Recoverable profit
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-fc-brand md:text-4xl lg:text-5xl">
        {formatted}
        <span className="ml-1 text-xl font-normal text-fc-muted md:text-2xl">/mo</span>
      </p>
      <p className="mt-2 text-sm text-fc-muted">Potential profit being lost</p>
      <p className="mt-1 text-sm tabular-nums text-fc-muted">
        ≈ {pctOfPayroll.toFixed(1)}% of payroll
      </p>
      {href && (
        <p className="mt-4">
          <span className="text-sm font-medium text-fc-accent hover:underline">See breakdown</span>
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
