import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-display text-2xl font-bold text-fc-brand">
        Page not found
      </h1>
      <p className="mt-2 text-fc-muted">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-accent px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-fc-accent/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
      >
        Go home
      </Link>
    </div>
  );
}
