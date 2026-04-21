"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export default function AuthFinishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const supabase = createClient();
        // Handles magiclink/invite/recovery flows that return tokens in the URL hash.
        // If this URL is hit without auth params, this is a no-op.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyAuth = (supabase.auth as any) ?? null;
        if (anyAuth?.getSessionFromUrl) {
          await anyAuth.getSessionFromUrl({ storeSession: true });
        }

        // Clean up hash so refresh doesn't re-run the flow.
        if (typeof window !== "undefined" && window.location.hash) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }

        const nextParam = searchParams.get("next");
        const nextPath = isSafeInternalPath(nextParam) ? nextParam : routes.auth.postLogin;
        if (!cancelled) {
          router.replace(nextPath);
          router.refresh();
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to finish sign-in");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fc-bg-page)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-fc-border bg-white p-6 shadow-fc-md">
        <div className="font-display text-lg font-bold text-fc-brand">
          Signing you in…
        </div>
        <div className="mt-2 text-sm text-fc-muted">
          Finishing secure sign-in and redirecting to your dashboard.
        </div>
        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

