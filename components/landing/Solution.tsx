const steps = [
  {
    label: "Centralize",
    title: "Job-coded time at the point of work",
    desc: "No job. No clock-in. Every hour is tied to a real install, service call, or maintenance job.",
  },
  {
    label: "Enforce",
    title: "Mandatory job selection — no generic shifts",
    desc: "Workers must choose a job before clocking in. No \"8-hour day\" entries. No clean-up at payroll. The data is correct from the start.",
  },
  {
    label: "Consolidate",
    title: "Export payroll with job context",
    desc: "Run payroll with: Worker, Hours, Job, Labour cost per job. Export directly to QuickBooks-ready CSV. Your payroll becomes job-aware.",
  },
];

export function Solution() {
  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="solution-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
          <h2
            id="solution-heading"
            className="font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            FieldCrew fixes the root cause
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-fc-muted">
            We don&apos;t improve time tracking.
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-xl font-medium text-fc-brand">
            We enforce job-based payroll intelligence.
          </p>
        </div>
        <div className="mt-16 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            How it works
          </p>
        </div>
        <div className="mt-12 flex flex-col items-stretch gap-12 sm:flex-row sm:justify-center sm:items-start sm:gap-6 lg:gap-10">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center sm:max-w-xs">
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
              <p className="mt-2 font-semibold text-fc-brand">{step.title}</p>
              <p className="mt-2 text-base text-fc-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
