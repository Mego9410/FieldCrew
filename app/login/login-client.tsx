"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import {
  Mail,
  Lock,
  Loader2,
  Activity,
  Clock,
  Layers2,
  TrendingUp,
} from "lucide-react";

function getSiteOrigin() {
  // In the browser, always use the current origin so OAuth PKCE cookies/local state
  // are written/read on the same host (avoids "PKCE code verifier not found").
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
}

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const rawError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    rawError
      ? rawError === "oauth_exchange_failed"
        ? "Google sign-in failed (exchange error). In Google Cloud, set Authorized redirect URIs to exactly your Supabase callback URL (Supabase → Auth → Providers → Google shows it). In Supabase, re-paste the Google Client Secret. See docs/GOOGLE_AUTH_SETUP.md."
        : decodeURIComponent(rawError)
      : null
  );
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;
    const hashParams = new URLSearchParams(
      window.location.hash.slice(1).replace(/^#/, "")
    );
    const desc = hashParams.get("error_description");
    if (desc) {
      const decoded = decodeURIComponent(desc.replace(/\+/g, " "));
      setError(
        decoded.startsWith("Unable to exchange external code")
          ? "Google sign-in failed (exchange error). Check that Google and Supabase are configured for this URL — see docs/GOOGLE_AUTH_SETUP.md."
          : decoded
      );
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendStatus("idle");
    setLoading("email");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(null);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    const next = searchParams.get("next");
    router.push(next?.startsWith("/") && !next.startsWith("//") ? next : routes.owner.home);
    router.refresh();
  };

  const handleResendConfirmation = async () => {
    if (!email?.trim()) return;
    setResendStatus("sending");
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });
    if (resendError) {
      setResendStatus("error");
      setError(resendError.message);
      return;
    }
    setResendStatus("sent");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading("google");

    const supabase = createClient();
    const origin = getSiteOrigin();
    const next = searchParams.get("next");
    const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : routes.owner.home;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    setLoading(null);
    if (signInError) {
      setError(signInError.message);
      return;
    }
  };

  const featureItems = [
    { label: "Weekly labor leak snapshot", icon: Activity },
    { label: "Overrun and overtime visibility", icon: Clock },
    { label: "Worker and job-level drill-downs", icon: Layers2 },
    { label: "Recovery opportunity tracking", icon: TrendingUp },
  ] as const;

  const motionEnter =
    "opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:animate-none animate-fc-login-left";
  const motionEnterDelayed =
    "opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:animate-none animate-fc-login-right";

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[var(--fc-bg-page)] from-40% via-[var(--fc-bg-page)] to-[#e9edf2] px-4 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:items-center">
        <div className={`relative ${motionEnter}`}>
          <div
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.35rem] bg-gradient-to-br from-fc-accent/[0.085] via-fc-accent/[0.02] to-transparent blur-xl"
            aria-hidden
          />
          <section className="relative rounded-2xl border border-slate-200/90 bg-fc-surface-muted/95 p-7 shadow-fc-md backdrop-blur-[2px] sm:p-10">
            <p className="font-display text-[0.65rem] font-medium uppercase leading-relaxed tracking-[0.28em] text-fc-steel-500">
              Welcome back
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-fc-brand sm:text-4xl sm:tracking-tight">
              Owner login
            </h1>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-fc-muted-strong">
              Sign in to manage jobs, workers, and payroll visibility in one place.
            </p>
            <div className="mt-9 grid gap-3.5 sm:grid-cols-2">
              {featureItems.map(({ label, icon: Icon }) => (
                <article
                  key={label}
                  className="group flex gap-3 rounded-xl border border-slate-300/45 bg-slate-200/45 px-4 py-3.5 text-sm font-medium text-fc-brand shadow-[0_1px_2px_rgb(15_23_42_/0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-fc-accent/40 hover:shadow-md"
                >
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-fc-accent opacity-90 transition-transform duration-200 group-hover:scale-105"
                    aria-hidden
                  />
                  <span className="leading-snug">{label}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div
          className={`w-full rounded-2xl border border-slate-200/95 bg-white p-7 shadow-fc-lg sm:p-9 lg:p-10 ${motionEnterDelayed}`}
        >
          <h2 className="font-display text-2xl font-bold tracking-tight text-fc-brand">
            Sign in
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-fc-muted-strong">
            Use your account credentials or Google sign-in.
          </p>

          {error && (
            <div
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              <p>{error}</p>
              {error === "Invalid login credentials" && (
                <>
                  <p className="mt-2 text-red-700">
                    If you just signed up, confirm your email first: check your inbox for a link from FieldCrew, then try again.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendStatus === "sending" || !email?.trim()}
                    className="mt-2 font-medium underline underline-offset-2 hover:no-underline disabled:opacity-50"
                  >
                    {resendStatus === "sending"
                      ? "Sending…"
                      : resendStatus === "sent"
                        ? "Confirmation email sent — check your inbox"
                        : resendStatus === "error"
                          ? "Resend failed — try again"
                          : "Resend confirmation email"}
                  </button>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-fc-brand"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted"
                  aria-hidden
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="min-h-12 w-full rounded-lg border border-fc-border bg-white py-3 pl-10 pr-3 text-fc-brand shadow-[inset_0_1px_1px_rgb(15_23_42_/0.03)] placeholder:text-fc-muted transition-[border-color,box-shadow] duration-200 ease-out focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/25 focus:ring-offset-0 disabled:opacity-70"
                  disabled={loading !== null}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-fc-brand"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted"
                  aria-hidden
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="min-h-12 w-full rounded-lg border border-fc-border bg-white py-3 pl-10 pr-3 text-fc-brand shadow-[inset_0_1px_1px_rgb(15_23_42_/0.03)] placeholder:text-fc-muted transition-[border-color,box-shadow] duration-200 ease-out focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/25 focus:ring-offset-0 disabled:opacity-70"
                  disabled={loading !== null}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading !== null}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-fc-navy-900 to-[#0a1020] px-4 py-3 font-semibold text-white shadow-fc-md transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-fc-lg hover:brightness-[1.06] focus:outline-none focus:ring-2 focus:ring-fc-accent/50 focus:ring-offset-2 active:translate-y-0 active:scale-[1.01] disabled:pointer-events-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {loading === "email" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                "Sign in with email"
              )}
            </button>
          </form>

          <div className="relative my-9">
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-slate-200/70" />
            </span>
            <span className="relative flex justify-center px-3">
              <span className="bg-white px-3 font-display text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
                or
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300/70 bg-white px-4 py-3 font-medium text-fc-brand shadow-[0_1px_2px_rgb(15_23_42_/0.04)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-slate-400/60 hover:bg-slate-50/90 focus:outline-none focus:ring-2 focus:ring-fc-accent/30 focus:ring-offset-2 active:translate-y-0 active:scale-[1.01] disabled:pointer-events-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            {loading === "google" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Redirecting…
              </>
            ) : (
              <>
                <GoogleIcon className="h-5 w-5" aria-hidden />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-8 flex flex-col items-center gap-4 text-center sm:mt-9">
            <p className="text-sm text-fc-muted">
              Don&apos;t have an account?{" "}
              <Link
                href={routes.owner.subscribe}
                className="font-semibold text-fc-accent transition-colors hover:text-fc-accent-dark hover:underline hover:underline-offset-4"
              >
                Sign up
              </Link>
            </p>
            <Link
              href={routes.public.home}
              className="text-sm text-fc-steel-500 transition-colors hover:text-fc-muted-strong hover:underline hover:underline-offset-4"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-5 text-center">
            <Link
              href={routes.owner.onboarding}
              className="text-xs text-fc-muted underline underline-offset-2 transition-colors hover:text-fc-accent"
            >
              Go to onboarding (no sign-in)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
