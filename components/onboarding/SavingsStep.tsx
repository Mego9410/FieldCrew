"use client";

import type { EstimatedSnapshot } from "@/types/onboarding";
import { weeklyUsdToMonthlyUsd } from "@/lib/insights/savings";
import { Button } from "@/components/ui/Button";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function SavingsStep({
  snapshot,
  onContinue,
  onEditAnswers,
  onBack,
  isLoading = false,
}: {
  snapshot: EstimatedSnapshot;
  onContinue: () => void;
  onEditAnswers: () => void;
  onBack: () => void;
  isLoading?: boolean;
}) {
  const monthly = weeklyUsdToMonthlyUsd(snapshot.estimatedLeakageDollars);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-fc-border bg-fc-surface p-6 shadow-fc-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
          Immediate value
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
          You could be saving around {currency.format(monthly)} / month
        </h2>
        <p className="mt-3 text-fc-muted">
          This is an estimate based on your answers. Once your team tracks real jobs, we’ll replace this
          with exact numbers from your operation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Jobs / week" value={String(snapshot.estimatedJobsPerWeek)} />
        <MiniStat label="Labour hours (est.)" value={String(snapshot.estimatedTotalLabourHours)} />
        <MiniStat
          label="Leakage (est.) / week"
          value={currency.format(snapshot.estimatedLeakageDollars)}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-fc-border pt-8 sm:flex-row sm:items-center">
        <Button type="button" onClick={onBack} variant="outline" disabled={isLoading}>
          Back
        </Button>
        <Button type="button" onClick={onContinue} disabled={isLoading} className="bg-fc-accent text-white hover:bg-fc-accent-dark">
          {isLoading ? "Saving…" : "See my suggested plan"}
        </Button>
        <Button type="button" onClick={onEditAnswers} variant="ghost" disabled={isLoading}>
          Edit my answers
        </Button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-fc-border bg-fc-surface px-5 py-4 shadow-fc-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-fc-brand">{value}</p>
    </div>
  );
}

