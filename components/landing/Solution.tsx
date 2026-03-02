const steps = [
  {
    label: "1",
    title: "Clock into jobs only",
    desc: "No job = no clock. Techs must select a job before starting time. No generic shifts, no uncoded hours.",
  },
  {
    label: "2",
    title: "Hours attach to revenue",
    desc: "Every hour is tied to a job code. Labour cost rolls up per job so you see true margin by install, service call, or maintenance.",
  },
  {
    label: "3",
    title: "Monthly labour profit report",
    desc: "Overtime by tech, job overruns, margin by service type, and recoverable leakage. One report. No guesswork.",
  },
];

export function Solution() {
  return (
    <section
      id="how-it-works"
      className="relative border-b border-fc-border bg-white py-14 sm:py-24 lg:py-28"
      aria-labelledby="solution-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="solution-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Control. Enforce. Recover.
          </h2>
        </div>
        {/* Horizontal process: 1 → 2 → 3 with connecting progression */}
        <div className="mt-14 flex flex-col items-center gap-12 sm:flex-row sm:justify-center sm:items-start sm:gap-2 lg:gap-6">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-2 lg:gap-4">
              {i > 0 && (
                <span className="hidden pt-8 text-2xl font-bold text-fc-accent/50 sm:inline" aria-hidden>
                  →
                </span>
              )}
              <div
                className="flex flex-col items-center rounded-[var(--fc-radius)] bg-white p-6 shadow-fc-sm sm:max-w-[260px] lg:max-w-[280px]"
                style={i === 1 ? { transform: "translateY(8px)" } : undefined}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--fc-radius)] bg-fc-accent text-xl font-extrabold text-white shadow-fc-md">
                  {step.label}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-fc-brand">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-fc-muted fc-body-air">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
