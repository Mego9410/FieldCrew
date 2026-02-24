import Link from "next/link";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden border-b border-fc-border bg-fc-brand py-20 sm:py-28 lg:py-32 bg-gradient-cta-navy"
      aria-labelledby="final-cta-heading"
    >
      {/* Subtle texture */}
      <div
        className="hero-noise absolute inset-0 opacity-[0.03]"
        aria-hidden
      />
      {/* Thin burnt orange accent line above section */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-fc-accent" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-md border border-fc-accent/40 bg-fc-accent/10">
          <svg
            className="h-8 w-8 text-fc-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2
          id="final-cta-heading"
          className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
        >
          Time is priceless. FieldCrew is time.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300 sm:text-2xl">
          Built for US HVAC crews with 3–15 field techs. 3 days free, then $9 for
          the first month — no credit card required.
        </p>
        <Link
          href="#pricing"
          className="mt-10 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md bg-fc-accent px-10 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
