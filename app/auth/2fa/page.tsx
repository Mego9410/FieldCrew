"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const nextParam = searchParams.get("next");
    return isSafeInternalPath(nextParam) ? nextParam : routes.owner.home;
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/security/2fa/status")
      .then((r) => r.json())
      .then((d: { email?: string; enabled?: boolean }) => {
        setEmail(d.email ?? "");
        if (d.enabled === false) {
          router.replace(nextPath);
          router.refresh();
        }
      })
      .catch(() => {});
  }, [nextPath, router]);

  const submit = async (payload: { code?: string; recoveryCode?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/security/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.replace(nextPath);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fc-bg-page)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-fc-border bg-white p-6 shadow-fc-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
          Two-factor authentication
        </p>
        <h1 className="mt-2 font-display text-xl font-bold text-fc-brand">
          Enter your code
        </h1>
        <p className="mt-2 text-sm text-fc-muted">
          {email ? `Signed in as ${email}. ` : ""}Enter the 6-digit code from your authenticator app.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-fc-brand">Authenticator code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              placeholder="123456"
              className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
            />
          </label>
          <button
            type="button"
            disabled={loading || !code.trim()}
            onClick={() => submit({ code })}
            className="w-full rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-fc-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>

          <div className="pt-3 border-t border-fc-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-fc-muted">
              Recovery code
            </p>
            <label className="mt-2 block">
              <span className="sr-only">Recovery code</span>
              <input
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="abcd-1234"
                className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
              />
            </label>
            <button
              type="button"
              disabled={loading || !recoveryCode.trim()}
              onClick={() => submit({ recoveryCode })}
              className="mt-2 w-full rounded-lg border border-fc-border px-4 py-2.5 text-sm font-semibold text-fc-brand hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Use recovery code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

