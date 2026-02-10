export function Problem() {
  const points = [
    "Untracked or mis-attributed hours — you don't know where time went",
    "Overtime leakage that only shows up on the payroll run",
    "No visibility into labour cost per job — revenue per job, yes; cost, no",
    "Payroll run without job context, so margin control is impossible",
  ];

  return (
    <section
      id="problem"
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          The problem
        </p>
        <h2
          id="problem-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          Small HVAC businesses lose money silently
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">
          Owners often know revenue per job but not labour cost per job. That
          makes margin control impossible.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-1 sm:gap-6 lg:grid-cols-2">
          {points.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-fc-border bg-fc-surface/50 p-4"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fc-brand/10 text-sm font-medium text-fc-brand"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-fc-brand">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
