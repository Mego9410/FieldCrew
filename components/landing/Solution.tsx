export function Solution() {
  const steps = [
    { label: "Centralize", desc: "Job-coded time at the point of work" },
    { label: "Collaborate", desc: "Mandatory job selection — no generic shifts" },
    { label: "Consolidate", desc: "Export with job context to QuickBooks" },
  ];

  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-20 sm:py-24 lg:py-32"
      aria-labelledby="solution-heading"
    >
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden
        style={{
          background: `
            radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            How it works
          </p>
          <h2
            id="solution-heading"
            className="mt-4 font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Incline toward converged payroll
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-fc-muted">
            We force job-coded time at the point of work and carry that context
            all the way through payroll and reporting.
          </p>
        </div>
        <div className="mt-16 flex flex-wrap items-stretch justify-center gap-8 sm:gap-12">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fc-accent to-fc-gradient-mid text-white shadow-lg">
                <span className="font-display text-2xl font-bold">{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-fc-brand">
                {step.label}
              </h3>
              <p className="mt-3 max-w-xs text-base text-fc-muted">{step.desc}</p>
              {i < steps.length - 1 && (
                <span
                  className="mt-8 hidden text-3xl text-fc-accent/40 sm:inline"
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
