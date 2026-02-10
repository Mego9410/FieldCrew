import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-fc-brand py-12 text-zinc-400" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-display text-sm font-medium text-white">
            FieldCrew
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Footer navigation"
          >
            <Link
              href="/login"
              className="text-sm transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand rounded"
            >
              Log in
            </Link>
            <Link
              href="#pricing"
              className="text-sm transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand rounded"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} FieldCrew. Job-based payroll intelligence
          for HVAC crews.
        </p>
      </div>
    </footer>
  );
}
