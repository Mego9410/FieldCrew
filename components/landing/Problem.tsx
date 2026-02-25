const problems = [
  {
    title: "Untracked or mis-attributed hours",
    body: [
      "Techs forget to clock in. Managers enter generic shifts. Paper notes get cleaned up at payroll.",
      "Those small gaps add up to thousands in hidden leakage every year.",
      "If a tech works 20 minutes extra on three jobs per week and it isn't attributed properly — you never see the true cost of those jobs.",
    ],
  },
  {
    title: "Overtime that only shows up on payday",
    body: [
      "Emergency calls. Callbacks. Late finishes.",
      "Overtime changes daily in HVAC. If your system doesn't flag it in real time, you only discover it when payroll spikes.",
      "By then, the margin is already gone.",
    ],
  },
  {
    title: "Revenue per job… but no labour cost per job",
    body: [
      "You know what you invoiced. But did that install actually make money?",
      "Without job-level labour data, you can't answer:",
      null, // bullet list placeholder
    ],
    bullets: [
      "Which installs are underpriced?",
      "Which service calls are bleeding margin?",
      "Which techs are consistently overrunning jobs?",
      "Whether your 45% gross margin is real — or just assumed",
    ],
    closing: "Every unassigned hour is a blind spot.",
  },
  {
    title: "Payroll run without job context",
    body: [
      "Most small HVAC shops still:",
      null,
    ],
    bullets: [
      "Copy times into spreadsheets",
      "Export generic payroll reports",
      "Manually reconcile QuickBooks",
    ],
    closing: "Time data lives in one place. Payroll in another. Profitability nowhere. Manual workflows are slow, error-prone, and impossible to scale.",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="border-b border-fc-border bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            The problem
          </p>
          <h2
            id="problem-heading"
            className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Small HVAC businesses lose money silently
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-fc-muted">
            You know what you charged.
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-xl text-fc-muted">
            You don&apos;t know what you actually spent on labour.
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-xl text-fc-muted">
            And that makes margin control impossible.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-fc-brand">
            Most HVAC businesses with 3–15 techs are flying blind on their biggest cost: labour.
          </p>
        </div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2">
          {problems.map((item, i) => (
            <li
              key={i}
              className="group relative overflow-hidden rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm transition-all duration-200 hover:border-fc-accent/40"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-fc-accent" aria-hidden />
              <h3 className="font-display text-lg font-bold text-fc-brand">
                {i + 1}. {item.title}
              </h3>
              <div className="mt-4 space-y-2 text-base leading-relaxed text-fc-muted">
                {item.body.filter(Boolean).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {item.bullets && (
                  <ul className="list-inside list-disc space-y-1 pt-1">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
                {item.closing && (
                  <p className="pt-2 font-medium text-fc-brand">{item.closing}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
