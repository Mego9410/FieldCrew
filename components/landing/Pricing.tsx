import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: 49,
    workers: "Up to 5 workers",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 89,
    workers: "Up to 15 workers",
    highlighted: true,
    badge: "Most companies choose this",
  },
  {
    name: "Pro",
    price: 149,
    workers: "Up to 30 workers",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-fc-border bg-white py-14 sm:py-24 lg:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="pricing-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Recover $6,000. Pay $149.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-fc-muted fc-body-air">
            One recovered job overrun pays for this.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:items-end">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-[var(--fc-radius-lg)] transition-all duration-200 ${
                tier.highlighted
                  ? "z-10 border-2 border-fc-accent bg-fc-accent/5 shadow-fc-lg sm:-mt-1 sm:scale-[1.02] sm:pb-10 sm:pt-0 sm:px-7"
                  : "border border-fc-border bg-white p-6 shadow-fc-sm"
              }`}
            >
              {tier.highlighted && (
                <>
                  <div className="h-1 w-full shrink-0 bg-fc-accent" aria-hidden />
                  <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-fc-accent">
                    {tier.badge}
                  </p>
                </>
              )}
              <div className={tier.highlighted ? "mt-4 px-2 pb-2" : ""}>
                <h3 className={`font-display text-2xl font-bold text-fc-brand ${tier.highlighted ? "" : "opacity-90"}`}>
                  {tier.name}
                </h3>
                <p className={`mt-1.5 text-base ${tier.highlighted ? "text-fc-muted" : "text-fc-muted opacity-90"}`}>
                  {tier.workers}
                </p>
                <p className={`mt-6 font-display font-extrabold tracking-tight text-fc-brand fc-money ${tier.highlighted ? "text-5xl sm:text-6xl" : "text-4xl"}`}>
                  ${tier.price}
                  <span className="ml-1 text-xl font-normal text-fc-muted">/month</span>
                </p>
                <Link
                  href="/sample-report"
                  className={`mt-6 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] px-6 py-3 text-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
                    tier.highlighted
                      ? "bg-fc-accent text-white hover:bg-fc-accent-dark"
                      : "bg-fc-brand text-white hover:bg-fc-brand/90"
                  }`}
                >
                  See a Real Labour Profit Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
