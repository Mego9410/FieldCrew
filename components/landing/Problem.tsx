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
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
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
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 [&>li:nth-child(2)]:sm:mt-2 [&>li:nth-child(4)]:sm:mt-2">
          {points.map((point, i) => (
            <li
              key={i}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-fc-border bg-white p-5 shadow-fc-sm transition-all duration-200 hover:border-fc-accent/40"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-fc-accent" aria-hidden />
              <div className="flex gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-fc-accent text-sm font-bold text-white"
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
