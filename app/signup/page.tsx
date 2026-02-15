"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(
    searchParams.get("error")
      ? decodeURIComponent(searchParams.get("error") ?? "")
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading("email");

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${routes.owner.home}` },
    });

    setLoading(null);
    if (signUpError) {
      setError(signUpError.message);
      setSuccessMessage(null);
      return;
    }
    // Supabase may require email confirmation; check session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push(routes.owner.home);
      router.refresh();
    } else {
      setError(null);
      setSuccessMessage("Check your email for the confirmation link to finish signing up.");
      setEmail("");
      setPassword("");
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading("google");

    const supabase = createClient();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(routes.owner.home)}`;

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fc-surface px-4">
      <div className="w-full max-w-[400px] border border-fc-border bg-fc-surface p-8">
        <h1 className="font-display text-2xl font-bold text-fc-brand">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-fc-muted">
          Sign up for FieldCrew to manage jobs, workers, and payroll.
        </p>

        {error && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div
            className="mt-4 rounded-lg border border-fc-border bg-slate-50 px-3 py-2 text-sm text-fc-brand"
            role="status"
          >
            {successMessage}
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
                className="w-full rounded-lg border border-fc-border bg-white py-2.5 pl-10 pr-3 text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-fc-border bg-white py-2.5 pl-10 pr-3 text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                disabled={loading !== null}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 disabled:opacity-70"
          >
            {loading === "email" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Signing up…
              </>
            ) : (
              "Sign up with email"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-fc-border" />
          </span>
          <span className="relative flex justify-center text-xs uppercase tracking-wide text-fc-muted">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-fc-border bg-white px-4 py-2.5 font-medium text-fc-brand transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 disabled:opacity-70"
        >
          {loading === "google" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Redirecting…
            </>
          ) : (
            <>
              <GoogleIcon className="h-5 w-5" aria-hidden />
              Sign up with Google
            </>
          )}
        </button>

        <p className="mt-6 text-center">
          <Link
            href={routes.owner.home}
            className="text-sm font-medium text-fc-muted underline underline-offset-2 hover:text-fc-brand"
          >
            Bypass → Dashboard
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-fc-muted">
          Already have an account?{" "}
          <Link
            href={routes.public.login}
            className="font-medium text-fc-accent underline underline-offset-2 hover:text-fc-accent-dark"
          >
            Sign in
          </Link>
          {" · "}
          <Link
            href={routes.public.home}
            className="text-fc-accent underline underline-offset-2 hover:text-fc-accent-dark"
          >
            Back to home
          </Link>
        </p>
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
