import Link from "next/link";

export function FinalCta() {
  return (
    <section
      className="border-b border-fc-border bg-fc-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="final-cta-heading"
          className="font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          See labour cost per job. Stop payroll leakage.
        </h2>
        <p className="mt-4 text-lg text-fc-muted">
          Built for US HVAC crews with 3–15 field techs. Start your 14-day free
          trial — no credit card required.
        </p>
        <Link
          href="#pricing"
          className="mt-8 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-accent px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-fc-accent/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        >
          Start free trial
        </Link>
      </div>
    </section>
  );
}
