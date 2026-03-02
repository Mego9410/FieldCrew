export function RealScenario() {
  const metrics = [
    { label: "Revenue", value: "$320,000", sub: "/mo" },
    { label: "Payroll", value: "$148,000", sub: "/mo" },
    { label: "Overtime", value: "$12,480", sub: "/mo" },
    { label: "Unbilled labour", value: "42", sub: " hrs" },
    { label: "Jobs exceeding estimate", value: "37%", sub: "" },
  ];

  return (
    <section
      id="scenario"
      className="border-b border-fc-border bg-fc-surface-muted py-14 sm:py-20 lg:py-24"
      aria-labelledby="scenario-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="scenario-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Example: 10-Tech HVAC Company — Houston
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[var(--fc-radius)] bg-white p-5 shadow-fc-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-fc-muted">
                {m.label}
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-fc-brand sm:text-3xl fc-money">
                {m.value}
                <span className="ml-0.5 text-base font-normal text-fc-muted">{m.sub}</span>
              </p>
            </div>
          ))}
        </div>
        {/* FieldCrew callout — left border accent, financial statement feel */}
        <div className="mt-10 border-l-4 border-fc-accent bg-white py-5 pl-6 pr-6 shadow-fc-sm rounded-r-[var(--fc-radius)]">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-fc-brand">
            FieldCrew identified:
          </h3>
          <ul className="mt-4 space-y-2 text-fc-muted">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
              <span className="fc-money text-fc-brand font-semibold">$6,420</span> recoverable monthly
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
              18% overtime reduction opportunity
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
              9 jobs underpriced
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
