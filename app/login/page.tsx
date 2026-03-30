import { Suspense } from "react";
import { LoginClient } from "./login-client";

function LoginFallback() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[var(--fc-bg-page)] from-40% via-[var(--fc-bg-page)] to-[#e9edf2] px-4 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="h-96 animate-pulse rounded-2xl border border-slate-200/80 bg-white/50"
          aria-hidden
        />
        <p className="sr-only">Loading sign-in…</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}
