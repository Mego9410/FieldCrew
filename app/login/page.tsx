import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-fc-border bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-fc-brand">
          Owner login
        </h1>
        <p className="mt-2 text-fc-muted">
          Sign in to your FieldCrew account. This page will be wired to
          authentication when the app is built.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-brand px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
