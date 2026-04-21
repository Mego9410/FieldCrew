"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

function parseHashTokens(hash: string): { access_token?: string; refresh_token?: string } {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const access_token = params.get("access_token") ?? undefined;
  const refresh_token = params.get("refresh_token") ?? undefined;
  return { access_token, refresh_token };
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, reject) => {
        t = setTimeout(() => reject(new Error("Timed out finishing sign-in")), ms);
      }),
    ]);
  } finally {
    if (t) clearTimeout(t);
  }
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
        // Prefer explicit hash-token handling for magic links.
        // This avoids relying on getSessionFromUrl() which may hang depending on client/runtime.
        if (typeof window !== "undefined" && window.location.hash) {
          const { access_token, refresh_token } = parseHashTokens(window.location.hash);
          if (access_token && refresh_token) {
            await withTimeout(
              supabase.auth.setSession({ access_token, refresh_token }),
              7000
            );
          }
        }

        // Fallback: some flows might use query params/code exchange.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyAuth = (supabase.auth as any) ?? null;
        if (anyAuth?.getSessionFromUrl) {
          try {
            await withTimeout(anyAuth.getSessionFromUrl({ storeSession: true }), 7000);
          } catch {
            // Continue below; we'll check whether we have a session.
          }
        }

        const { data } = await supabase.auth.getSession();
        const hasSession = Boolean(data?.session);

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
          if (!hasSession) {
            const msg = encodeURIComponent("Sign-in link expired or invalid. Please request a new link.");
            router.replace(`${routes.public.login}?error=${msg}`);
            router.refresh();
            return;
          }
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

