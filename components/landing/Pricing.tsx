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
      className="border-b border-fc-border bg-white py-20 sm:py-24 lg:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="mt-4 font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Flat, predictable plans
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-fc-muted">
            No feature gating. 14-day free trial. 2 months free on annual plans.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`group relative flex flex-col rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.highlighted
                  ? "border-fc-accent bg-gradient-to-br from-fc-accent/10 to-fc-gradient-mid/10 shadow-lg ring-2 ring-fc-accent/20"
                  : "border-fc-border bg-white"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-fc-accent to-fc-gradient-mid px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-bold text-fc-brand">
                {tier.name}
              </h3>
              <p className="mt-2 text-base text-fc-muted">{tier.workers}</p>
              <p className="mt-6 font-display text-5xl font-bold text-fc-brand">
                ${tier.price}
                <span className="text-xl font-normal text-fc-muted">
                  /month
                </span>
              </p>
              <Link
                href="#pricing"
                className={`mt-8 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-center font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-fc-accent to-fc-gradient-mid text-white shadow-lg hover:shadow-xl"
                    : "bg-fc-brand text-white hover:bg-fc-brand/90"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-base text-fc-muted">
          Additional workers: $4/month each. Early founders plan available.
        </p>
      </div>
    </section>
  );
}
