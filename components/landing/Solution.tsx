export function Solution() {
  const steps = [
    { label: "Centralize", desc: "Job-coded time at the point of work" },
    { label: "Collaborate", desc: "Mandatory job selection — no generic shifts" },
    { label: "Consolidate", desc: "Export with job context to QuickBooks" },
  ];

  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="solution-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
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
        <div className="mt-20 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:items-start sm:gap-6 lg:gap-10">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-fc-accent text-white shadow-fc-sm">
                  <span className="font-display text-xl font-bold">{i + 1}</span>
                </div>
                {i < steps.length - 1 && (
                  <span className="mx-2 hidden text-fc-accent/70 sm:inline" aria-hidden>→</span>
                )}
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-fc-brand">
                {step.label}
              </h3>
              <p className="mt-2 max-w-xs text-base text-fc-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
