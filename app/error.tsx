"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 sm:px-6">
      <h1 className="font-display text-xl font-bold text-fc-brand sm:text-2xl">
        Something went wrong
      </h1>
      <p className="mt-2 text-fc-muted">
        We couldn’t load this page. Please try again.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-accent px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-fc-accent/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-fc-border bg-white px-4 py-2.5 font-medium text-fc-brand transition-colors duration-200 hover:bg-fc-surface focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
