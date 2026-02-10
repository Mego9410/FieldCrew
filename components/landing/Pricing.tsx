import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: 39,
    workers: "Up to 5 workers",
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 79,
    workers: "Up to 15 workers",
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 149,
    workers: "Up to 30 workers",
    cta: "Start free trial",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          Pricing
        </p>
        <h2
          id="pricing-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          Flat, predictable plans
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">
          No feature gating. 14-day free trial. 2 months free on annual plans.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border p-6 sm:p-8 ${
                tier.highlighted
                  ? "border-fc-accent bg-fc-accent/5 shadow-lg"
                  : "border-fc-border bg-fc-surface/50"
              }`}
            >
              <h3 className="font-display text-lg font-semibold text-fc-brand">
                {tier.name}
              </h3>
              <p className="mt-2 text-fc-muted">{tier.workers}</p>
              <p className="mt-4 font-display text-3xl font-bold text-fc-brand">
                ${tier.price}
                <span className="text-base font-normal text-fc-muted">
                  /month
                </span>
              </p>
              <Link
                href="#pricing"
                className={`mt-6 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-center font-medium transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
                  tier.highlighted
                    ? "bg-fc-accent text-white hover:bg-fc-accent/90"
                    : "bg-fc-brand text-white hover:bg-fc-brand/90"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-fc-muted">
          Additional workers: $4/month each. Early founders plan available.
        </p>
      </div>
    </section>
  );
}
