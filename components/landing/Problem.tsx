const painRows = [
  {
    youThink: "Payroll is the problem.",
    reality: "Hours are uncoded, overtime spikes unseen, job costs are guesswork.",
    result: "Margin leaks every month. You find out at month-end.",
  },
  {
    youThink: "We just need better time tracking.",
    reality: "Generic time apps don't tie hours to jobs or revenue.",
    result: "Payroll runs clean. Profitability stays invisible.",
  },
  {
    youThink: "Our margins are fine.",
    reality: "Without job-level labour data, you're assuming — not measuring.",
    result: "Underpriced jobs and overruns eat profit. You don't see which ones.",
  },
];

export function Problem() {
  return (
    <section
      id="pain"
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="pain-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="pain-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            Payroll isn&apos;t your problem. Uncontrolled labour is.
          </h2>
        </div>
        {/* Three columns with vertical dividers — no card borders; middle column darker for tension */}
        <div className="mt-14 overflow-x-auto">
          <div className="grid min-w-[280px] grid-cols-3 gap-0 bg-white">
            <div className="px-6 py-8 text-center sm:px-8">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-muted">
                You think
              </h3>
              <ul className="mt-5 space-y-3 text-left text-sm text-fc-brand fc-body-air">
                {painRows.map((row, i) => (
                  <li key={i} className="font-medium">{row.youThink}</li>
                ))}
              </ul>
            </div>
            <div className="border-x border-fc-border bg-slate-100/80 px-6 py-8 text-center sm:px-8">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-accent">
                Reality
              </h3>
              <ul className="mt-5 space-y-3 text-left text-sm text-fc-muted fc-body-air">
                {painRows.map((row, i) => (
                  <li key={i}>{row.reality}</li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-8 text-center sm:px-8">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-fc-muted">
                Result
              </h3>
              <ul className="mt-5 space-y-3 text-left text-sm text-fc-brand fc-body-air">
                {painRows.map((row, i) => (
                  <li key={i} className="font-medium">{row.result}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
