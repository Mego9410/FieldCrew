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
      className="border-b border-fc-border bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            The problem
          </p>
          <h2
            id="problem-heading"
            className="mt-2 font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Small HVAC businesses lose money silently
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-fc-muted">
            Owners often know revenue per job but not labour cost per job. That
            makes margin control impossible.
          </p>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {points.map((point, i) => (
            <li
              key={i}
              className="group cursor-pointer rounded-xl border border-fc-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-fc-accent/50 hover:shadow-lg"
            >
              <div className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-fc-accent to-fc-gradient-mid text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed text-fc-brand">{point}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
