export function Differentiation() {
  return (
    <section
      className="relative border-b border-fc-border bg-fc-brand py-20 sm:py-24 lg:py-32"
      aria-labelledby="differentiation-heading"
    >
      {/* Subtle texture / faint radial on dark background */}
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(15, 23, 42, 0.4) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-[3px] w-12 bg-fc-accent mx-auto mb-4" aria-hidden />
          <h2
            id="differentiation-heading"
            className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            The difference
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Most time tracking tools answer:
          </p>
          <blockquote className="mx-auto mt-2 max-w-xl text-xl italic text-slate-400">
            &ldquo;How many hours did my staff work?&rdquo;
          </blockquote>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            FieldCrew answers:
          </p>
          <blockquote className="mx-auto mt-2 max-w-xl text-xl font-semibold text-white">
            &ldquo;Which jobs are destroying my margins?&rdquo;
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            That reframes the buying decision from admin to profitability.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-900/50 p-6 shadow-fc-md transition-all duration-200 hover:border-slate-600">
            <h3 className="font-display text-xl font-bold text-slate-300">
              Others
            </h3>
            <div className="mt-4 border-t border-slate-700 pt-4" />
            <ul className="space-y-3 text-base text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-600" aria-hidden />
                <span>Job selection optional</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-600" aria-hidden />
                <span>Worker-centric payroll exports</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-600" aria-hidden />
                <span>No surfaced labour cost per job</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-600" aria-hidden />
                <span>No financial narrative</span>
              </li>
            </ul>
          </div>
          <div className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-fc-accent/50 bg-slate-900/80 p-6 shadow-fc-md transition-all duration-200 hover:border-fc-accent">
            <span className="absolute left-0 top-0 h-full w-1 bg-fc-accent" aria-hidden />
            <h3 className="font-display text-2xl font-bold text-white">
              FieldCrew
            </h3>
            <div className="mt-4 border-t border-slate-600 pt-4" />
            <ul className="space-y-3 text-base text-slate-200 font-medium">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-fc-accent" aria-hidden />
                <span>Job-coded time enforced</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-fc-accent" aria-hidden />
                <span>Payroll job-aware</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-fc-accent" aria-hidden />
                <span>Labour cost per job surfaced automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-fc-accent" aria-hidden />
                <span>Built specifically for US HVAC crews with 3–15 techs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
