"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, Circle, X, ArrowRight, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";
import type { CompanyTourV1 } from "@/lib/entities";
import { Button } from "@/components/ui/Button";

export type TutorialCompletion = {
  companySetup: boolean;
  profileSetup: boolean;
  workersAdded: boolean;
  jobOrProjectCreated: boolean;
  timeEntryLogged: boolean;
  reportExported: boolean;
};

export function SetupChecklist({
  open,
  tour,
  completion,
  onCloseAndDismiss,
  onResumeTour,
  onStartGuidedTour,
}: {
  open: boolean;
  tour: CompanyTourV1;
  completion: TutorialCompletion;
  onCloseAndDismiss: () => void;
  onResumeTour: () => void;
  onStartGuidedTour: () => void;
}) {
  const steps = useMemo(
    () =>
      [
        {
          key: "companySetup" as const,
          label: "Set up your company",
          href: routes.owner.settingsCompany,
        },
        {
          key: "profileSetup" as const,
          label: "Set up your profile",
          href: routes.owner.settingsProfile,
        },
        {
          key: "workersAdded" as const,
          label: "Add your workers",
          href: routes.owner.workers,
        },
        {
          key: "jobOrProjectCreated" as const,
          label: "Create a job or project",
          href: `${routes.owner.data}?tab=job`,
        },
        {
          key: "timeEntryLogged" as const,
          label: "Log your first time entry",
          href: `${routes.owner.data}?tab=timeentry`,
        },
        {
          key: "reportExported" as const,
          label: "Export a report",
          href: routes.owner.reporting,
        },
      ] as const,
    []
  );

  const completedCount = steps.filter((s) => completion[s.key]).length;
  const total = steps.length;
  const allDone = completedCount === total;

  if (!open) return null;

  return (
    <div
      className="fixed right-3 top-[88px] z-50 w-[360px] max-w-[calc(100vw-1.5rem)] rounded-xl border border-fc-border bg-fc-surface shadow-fc-md"
      role="dialog"
      aria-label="Setup checklist"
    >
      <div className="flex items-start justify-between gap-3 p-4 border-b border-fc-border">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-fc-muted">
            Setup checklist
          </p>
          <p className="mt-1 text-sm font-semibold text-fc-brand">
            {allDone ? "You’re ready to go" : "Finish the essentials"}
          </p>
          <p className="mt-1 text-xs text-fc-muted">
            {completedCount}/{total} completed
          </p>
        </div>
        <button
          type="button"
          onClick={onCloseAndDismiss}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
          aria-label="Dismiss setup checklist"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {steps.map((s) => {
            const done = completion[s.key];
            return (
              <Link
                key={s.key}
                href={s.href}
                className="flex items-center gap-2 rounded-lg border border-fc-border bg-fc-surface px-3 py-2 hover:bg-fc-surface-muted"
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-fc-success" />
                ) : (
                  <Circle className="h-4 w-4 text-fc-muted" />
                )}
                <span className={`text-sm ${done ? "text-fc-muted line-through" : "text-fc-brand"}`}>
                  {s.label}
                </span>
                <span className="ml-auto text-fc-muted">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onStartGuidedTour}>
            <Sparkles className="h-4 w-4" />
            Guided tour
          </Button>
          {tour.status === "dismissed" && (
            <Button type="button" variant="outline" onClick={onResumeTour}>
              Resume setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

