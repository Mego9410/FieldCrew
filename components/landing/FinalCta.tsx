import Link from "next/link";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden border-b border-fc-border bg-fc-brand py-24 sm:py-32 lg:py-36 bg-gradient-cta-navy"
      aria-labelledby="final-cta-heading"
    >
      {/* Subtle radial gradient for depth */}
      <div
        className="absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(249, 115, 22, 0.08) 0%, transparent 60%)",
        }}
      />
      <div className="hero-noise absolute inset-0 opacity-[0.03]" aria-hidden />
      <div className="absolute left-0 right-0 top-0 h-1 bg-fc-accent" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="final-cta-heading"
          className="font-display font-bold text-white fc-section-h2 text-4xl sm:text-5xl lg:text-[3.25rem]"
        >
          Stop guessing payroll. Start controlling it.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-xl text-slate-300 fc-body-air sm:text-2xl">
          See exactly where labour profit is leaking — then fix it.
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Link
            href="/sample-report"
            className="inline-flex min-h-[52px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] bg-fc-accent px-12 py-4 text-lg font-bold text-white shadow-fc-lg transition-all duration-200 hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
          >
            See Where Your Profit Is Leaking
          </Link>
          <Link
            href="/book"
            className="inline-flex min-h-[52px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] border-2 border-slate-500 bg-transparent px-12 py-4 text-lg font-semibold text-slate-200 transition-all duration-200 hover:border-white hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
          >
            Book 15-Min Walkthrough
          </Link>
        </div>
      </div>
    </section>
  );
}
