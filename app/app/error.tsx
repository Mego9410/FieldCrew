"use client";

import { useEffect } from "react";
import Link from "next/link";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error)
    return String((error as { message: unknown }).message);
  return "Something went wrong";
}

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = getErrorMessage(error);
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-fc-page px-4 py-8 sm:px-6">
      <h1 className="font-display text-xl font-bold text-fc-brand sm:text-2xl">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-fc-muted">
        {message === "[object Event]" ? "We couldn't load this page. Please try again." : message}
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-accent px-4 py-2.5 font-medium text-white hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-fc-border bg-fc-surface px-4 py-2.5 font-medium text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
