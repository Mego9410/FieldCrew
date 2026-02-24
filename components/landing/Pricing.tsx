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
    name: "Growth (Most Popular)",
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
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
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
            No feature gating. 3 days free, then $9 for the first month. 2 months free on annual plans.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:items-end">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`group relative flex flex-col rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                tier.highlighted
                  ? "border-fc-accent bg-fc-accent/5 pt-0 sm:-mt-2 sm:pt-0 pb-8 px-6 sm:pb-10 sm:px-6"
                  : "border-fc-border bg-white p-6"
              }`}
            >
              {/* Popular: thin top stripe instead of floating badge */}
              {tier.highlighted && (
                <div className="h-1 w-full bg-fc-accent shrink-0" aria-hidden />
              )}
              <div className={tier.highlighted ? "pt-6" : ""}>
                <h3 className="font-display text-2xl font-bold text-fc-brand">
                  {tier.name}
                </h3>
                <p className="mt-1.5 text-base text-fc-muted">{tier.workers}</p>
                <p className="mt-5 font-display text-5xl font-bold text-fc-brand">
                  ${tier.price}
                  <span className="text-xl font-normal text-fc-muted">
                    /month
                  </span>
                </p>
                <Link
                  href="#pricing"
                  className={`mt-6 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md px-6 py-3 text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
                    tier.highlighted
                      ? "bg-fc-accent text-white hover:bg-fc-accent-dark"
                      : "bg-fc-brand text-white hover:bg-fc-brand/90"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
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
