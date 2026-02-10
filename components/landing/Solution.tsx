export function Solution() {
  const steps = [
    { label: "Field", desc: "Job-coded time at the point of work" },
    { label: "Job", desc: "Mandatory job selection — no generic shifts" },
    { label: "Payroll", desc: "Export with job context to QuickBooks" },
    { label: "Profit", desc: "Labour cost per job and weekly insight" },
  ];

  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-fc-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="solution-heading"
    >
      {/* Soft blue tint */}
      <div
        className="absolute inset-0 bg-fc-accent/[0.025]"
        aria-hidden
      />
      {/* Diagonal vector stripe */}
      <div className="pointer-events-none absolute -right-32 top-1/2 hidden w-96 -translate-y-1/2 rotate-12 opacity-[0.06] lg:block" aria-hidden>
        <svg viewBox="0 0 400 80" fill="none" className="h-24 w-full">
          <rect x="0" y="20" width="400" height="40" rx="4" fill="currentColor" className="text-fc-accent" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          How it works
        </p>
        <h2
          id="solution-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          Field → Job → Payroll → Profit
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">
          We force job-coded time at the point of work and carry that context
          all the way through payroll and reporting.
        </p>
        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="flex min-w-0 flex-1 basis-36 flex-col rounded-lg border border-fc-border bg-white p-5 shadow-sm sm:basis-40"
            >
              <span className="font-display text-lg font-semibold text-fc-accent">
                {step.label}
              </span>
              <p className="mt-2 text-sm text-fc-muted">{step.desc}</p>
              {i < steps.length - 1 && (
                <span
                  className="mt-auto hidden pt-4 text-fc-muted/60 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
