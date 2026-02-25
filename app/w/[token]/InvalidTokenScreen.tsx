import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { routes } from "@/lib/routes";

export function InvalidTokenScreen() {
  return (
    <div className="min-h-screen bg-fc-page flex flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md w-full text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-fc-border bg-fc-surface">
          <AlertCircle className="h-7 w-7 text-fc-muted" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-xl font-semibold text-fc-brand sm:text-2xl">
          This link is invalid or has expired
        </h1>
        <p className="mt-2 text-sm text-fc-muted">
          The worker link you used may have expired or is no longer valid. Please
          request a new link or contact your supervisor.
        </p>
        <Link
          href={routes.public.home}
          className="mt-8 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md bg-fc-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
