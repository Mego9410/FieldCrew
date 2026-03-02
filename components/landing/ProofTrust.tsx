import Link from "next/link";

const trustBullets = [
  "Designed for US HVAC ops",
  "Built for companies under 25 techs",
  "Set up in a day",
];

export function ProofTrust() {
  return (
    <section
      id="proof"
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="proof-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            We found <span className="fc-money-accent">$4,800</span> in the first month.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-fc-muted fc-body-air">
            Based on patterns we see in real 5–20 tech HVAC companies.
          </p>
        </div>
        <ul className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          {trustBullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-[var(--fc-radius)] bg-fc-surface-muted px-5 py-3"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-fc-accent" aria-hidden />
              <span className="text-sm font-medium text-fc-brand">{bullet}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 text-center">
          <Link
            href="/sample-report"
            className="text-sm font-semibold text-fc-accent underline decoration-fc-accent underline-offset-2 hover:no-underline"
          >
            See a sample labour profit report
          </Link>
        </p>
      </div>
    </section>
  );
}
