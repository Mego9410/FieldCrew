"use client";

import { Button } from "@/components/ui/Button";
import type { EstimatedSnapshot } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface InsightReviewStepProps {
  snapshot: EstimatedSnapshot;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  isLoading?: boolean;
}

export function InsightReviewStep({
  snapshot,
  onPrimary,
  onSecondary,
  primaryLabel = "Continue",
  secondaryLabel = "Edit my answers",
  isLoading = false,
}: InsightReviewStepProps) {
  const techs = snapshot.inputs.fieldTechCount;
  const jobs = snapshot.estimatedJobsPerWeek;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
          Here&apos;s what&apos;s likely happening in your business each week
        </h1>
        <p className="mt-2 text-fc-muted">
          This is an estimated snapshot based on your team size and workload. It becomes exact once your
          team starts tracking real jobs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Estimated jobs / week"
          value={String(jobs)}
          sublabel="Based on your answers"
        />
        <MetricCard
          label="Estimated labour hours"
          value={`${snapshot.estimatedTotalLabourHours}`}
          sublabel="Includes typical overrun stretch"
        />
        <MetricCard
          label="Est. overtime & overrun pressure"
          value={`${snapshot.estimatedOverrunOvertimePressureHours} hrs`}
          sublabel="Combined overrun + OT pattern"
        />
        <MetricCard
          label="Estimated labour leakage"
          value={currency.format(snapshot.estimatedLeakageDollars)}
          sublabel="Loaded cost • indicative"
          highlight
        />
      </div>

      <div className="rounded-2xl border border-fc-border bg-fc-surface-muted/60 px-5 py-4 text-sm leading-relaxed text-fc-muted-strong">
        For a team of {techs} field techs handling around {jobs} jobs a week, even small overruns can
        quietly create extra labour cost and overtime pressure. This gives you a starting point before real
        job tracking begins.
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
          Likely friction points
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <FrictionCard title="Jobs taking longer than planned" />
          <FrictionCard title="Overtime used to recover the schedule" />
          <FrictionCard title="Labour cost not clearly tied back to each job" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-fc-border pt-8 sm:flex-row sm:items-center">
        <Button
          type="button"
          onClick={onPrimary}
          disabled={isLoading}
          className="bg-fc-accent text-white hover:bg-fc-accent-dark"
        >
          {isLoading ? "Saving…" : primaryLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onSecondary} disabled={isLoading}>
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-fc-surface px-5 py-4 shadow-fc-sm",
        highlight
          ? "border-fc-accent/50 ring-2 ring-fc-accent/20 shadow-fc-md"
          : "border-fc-border"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-fc-brand sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-fc-muted">{sublabel}</p>
    </div>
  );
}

function FrictionCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-fc-border bg-fc-surface px-4 py-4 text-sm font-medium text-fc-brand shadow-fc-sm">
      {title}
    </div>
  );
}
