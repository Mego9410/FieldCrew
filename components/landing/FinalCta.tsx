import Link from "next/link";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden border-b border-fc-border bg-gradient-cta py-20 sm:py-28 lg:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-red-500/20"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg
            className="h-10 w-10 text-white"
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
        <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90 sm:text-2xl">
          Built for US HVAC crews with 3–15 field techs. Start your 14-day free
          trial — no credit card required.
        </p>
        <Link
          href="#pricing"
          className="mt-10 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-white px-10 py-4 text-lg font-semibold text-fc-brand shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
