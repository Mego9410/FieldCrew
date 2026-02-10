import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-fc-border bg-fc-surface/95 backdrop-blur supports-[backdrop-filter]:bg-fc-surface/80">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-xl font-semibold text-fc-brand transition-colors duration-200 hover:text-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
        >
          FieldCrew
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="hidden text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded sm:inline-block"
          >
            Product
          </Link>
          <Link
            href="#pricing"
            className="hidden text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded sm:inline-block"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
          >
            Log in
          </Link>
          <Link
            href="#pricing"
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-brand px-5 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
          >
            Start free trial
          </Link>
        </div>
      </nav>
    </header>
  );
}
