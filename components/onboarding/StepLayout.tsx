"use client";

import { Button } from "@/components/ui/Button";

interface StepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function StepLayout({
  step,
  totalSteps,
  title,
  description,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  isLoading = false,
  children,
}: StepLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
          Step {step} of {totalSteps}
        </p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-fc-surface-muted">
          <div
            className="h-full rounded-full bg-fc-accent transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-fc-muted">
            {description}
          </p>
        )}
      </div>

      <div className="min-h-[320px]">{children}</div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-fc-border pt-8">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            {backLabel}
          </Button>
        )}
        {onNext && (
          <Button
            type="button"
            onClick={onNext}
            disabled={isLoading}
          >
            {isLoading ? "Saving…" : nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
