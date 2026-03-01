import { HiddenProfitCta } from "@/components/HiddenProfitCta";

export function HiddenProfitSection() {
  return (
    <section
      id="hidden-profit"
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="hidden-profit-heading"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
          Free calculator
        </p>
        <h2
          id="hidden-profit-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl"
        >
          How much labour profit are you losing?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-fc-muted">
          Overtime premium, untracked time, and job overruns add up fast. Most shops never see the number — they just feel the squeeze on margin.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-medium text-fc-brand">
          Get an estimate in under a minute. Then see a real sample report from a 10-tech HVAC company in Houston where we identified $6,420 in recoverable labour profit in a single month.
        </p>
        <ul className="mx-auto mt-8 max-w-xl list-inside list-disc space-y-2 text-left text-fc-muted sm:list-outside sm:text-center">
          <li>Overtime premium waste</li>
          <li>Untracked time (hours that never hit a job)</li>
          <li>Job overruns (estimated vs actual)</li>
        </ul>
        <div className="mt-10">
          <HiddenProfitCta
            label="Show Me The Hidden Profit"
            variant="button"
            className="inline-flex min-h-[52px] items-center justify-center rounded-md px-8 py-4 text-base font-semibold"
          />
        </div>
        <p className="mt-4 text-sm text-fc-muted">
          No sign-up required. Your numbers stay private.
        </p>
      </div>
    </section>
  );
}
