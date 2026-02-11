import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-fc-border bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/95">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-xl font-bold text-fc-brand transition-colors duration-200 hover:text-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
        >
          FieldCrew
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded sm:inline-block"
          >
            Product
          </Link>
          <Link
            href="#pricing"
            className="hidden text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded sm:inline-block"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
          >
            Log in
          </Link>
          <Link
            href="#pricing"
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-brand px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
