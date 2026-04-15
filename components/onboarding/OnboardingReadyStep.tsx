"use client";

import { Button } from "@/components/ui/Button";

interface OnboardingReadyStepProps {
  workersAdded: number;
  jobsAdded: number;
  onGoToDashboard: () => void;
  onInviteWorkersNow: () => void;
  isLoading?: boolean;
}

export function OnboardingReadyStep({
  workersAdded,
  jobsAdded,
  onGoToDashboard,
  onInviteWorkersNow,
  isLoading = false,
}: OnboardingReadyStepProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-fc-border bg-fc-surface p-6 shadow-fc-md">
        <h1 className="font-display text-2xl font-bold text-fc-brand">You&apos;re ready to start tracking</h1>
        <p className="mt-2 text-fc-muted">
          Your first labor snapshot is ready, and your workspace has been set up with the basics so
          your team can get moving.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Workers added" value={String(workersAdded)} />
          <Stat label="Jobs added" value={String(jobsAdded)} />
          <Stat label="Estimated labor snapshot" value="Ready" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={onGoToDashboard}
          disabled={isLoading}
          className="bg-fc-accent text-white hover:bg-fc-accent-dark"
        >
          {isLoading ? "Opening…" : "Go to dashboard"}
        </Button>
        <Button type="button" variant="outline" onClick={onInviteWorkersNow} disabled={isLoading}>
          Invite workers now
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-fc-border bg-fc-surface-muted px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-fc-brand">{value}</p>
    </div>
  );
}
