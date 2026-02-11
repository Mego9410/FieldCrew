export function Differentiation() {
  return (
    <section
      className="relative border-b border-fc-border bg-fc-brand py-20 sm:py-24 lg:py-32"
      aria-labelledby="differentiation-heading"
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            The difference
          </p>
          <h2
            id="differentiation-heading"
            className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
          >
            A new era of payroll intelligence
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Competitors answer: &ldquo;How many hours did my staff work?&rdquo;
            FieldCrew answers: &ldquo;Which jobs are destroying my margins?&rdquo;
            That reframes the buying decision from admin to profitability.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="group cursor-pointer rounded-xl border border-slate-700 bg-slate-900/50 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-600">
            <h3 className="font-display text-2xl font-bold text-slate-200">
              Others
            </h3>
            <ul className="mt-6 space-y-3 text-base text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" aria-hidden />
                <span>Job selection optional</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" aria-hidden />
                <span>Payroll exports worker-centric</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" aria-hidden />
                <span>No labour cost per job</span>
              </li>
            </ul>
          </div>
          <div className="group cursor-pointer rounded-xl border-2 border-fc-accent/50 bg-gradient-to-br from-fc-accent/20 to-fc-gradient-mid/20 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-fc-accent">
            <h3 className="font-display text-2xl font-bold text-white">
              FieldCrew
            </h3>
            <ul className="mt-6 space-y-3 text-base text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
                <span>Job-coded time enforced</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
                <span>Payroll job-aware</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" aria-hidden />
                <span>Labour cost per job surfaced</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
