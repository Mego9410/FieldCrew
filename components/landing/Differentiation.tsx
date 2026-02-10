export function Differentiation() {
  return (
    <section
      className="relative border-b border-fc-border bg-fc-brand py-16 sm:py-20 lg:py-24"
      aria-labelledby="differentiation-heading"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          The difference
        </p>
        <h2
          id="differentiation-heading"
          className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl"
        >
          Not another time tracker
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-zinc-300">
          Competitors answer: &ldquo;How many hours did my staff work?&rdquo;
          FieldCrew answers: &ldquo;Which jobs are destroying my margins?&rdquo;
          That reframes the buying decision from admin to profitability.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-600 bg-zinc-800/50 p-5">
            <h3 className="font-display font-semibold text-zinc-200">
              Others
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-400">
              <li>Job selection optional</li>
              <li>Payroll exports worker-centric</li>
              <li>No labour cost per job</li>
            </ul>
          </div>
          <div className="rounded-lg border border-fc-accent/50 bg-fc-accent/10 p-5">
            <h3 className="font-display font-semibold text-white">
              FieldCrew
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-300">
              <li>Job-coded time enforced</li>
              <li>Payroll job-aware</li>
              <li>Labour cost per job surfaced</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
