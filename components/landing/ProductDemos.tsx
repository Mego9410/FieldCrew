/**
 * Small demos of the software in action — job picker, clock, labour cost, export.
 */
export function ProductDemos() {
  return (
    <section
      id="demos"
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="demos-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          See it in action
        </p>
        <h2
          id="demos-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          From field to payroll
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">
          Workers pick a job and clock in. You see labour cost per job and export
          payroll with context.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Worker: Job picker */}
          <div className="rounded-xl border border-fc-border bg-fc-surface/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="mb-3 font-body text-xs font-medium text-fc-muted">
              Worker — Select job
            </p>
            <div className="overflow-hidden rounded-lg border border-fc-border bg-white text-left shadow-sm">
              <div className="border-b border-fc-border bg-zinc-50 px-3 py-2 font-body text-[10px] text-fc-muted">
                Select a job
              </div>
              <div className="space-y-1 p-2">
                {["123 Main — Install", "456 Oak — Service"].map((job, i) => (
                  <div
                    key={job}
                    className={`rounded border px-2 py-1.5 font-body text-[9px] ${
                      i === 0
                        ? "border-fc-accent bg-fc-accent/10 text-fc-brand"
                        : "border-fc-border text-fc-muted"
                    }`}
                  >
                    {job}
                  </div>
                ))}
              </div>
              <div className="border-t border-fc-border p-2">
                <div className="rounded bg-fc-accent py-1.5 text-center font-body text-[9px] font-medium text-white">
                  Continue
                </div>
              </div>
            </div>
          </div>

          {/* 2. Worker: Clock screen */}
          <div className="rounded-xl border border-fc-border bg-fc-surface/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="mb-3 font-body text-xs font-medium text-fc-muted">
              Worker — Clock in
            </p>
            <div className="overflow-hidden rounded-lg border border-fc-border bg-white text-left shadow-sm">
              <div className="border-b border-fc-border bg-white px-3 py-2 font-body text-[10px] text-fc-brand">
                123 Main — Install
              </div>
              <div className="p-3 font-body text-[9px] text-fc-muted">
                Not clocked in
              </div>
              <div className="border-t border-fc-border p-2">
                <div className="rounded bg-fc-accent py-2 text-center font-body text-[9px] font-semibold text-white">
                  Clock In
                </div>
              </div>
            </div>
          </div>

          {/* 3. Owner: Labour cost per job */}
          <div className="rounded-xl border border-fc-border bg-fc-surface/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="mb-3 font-body text-xs font-medium text-fc-muted">
              Owner — Labour by job
            </p>
            <div className="overflow-hidden rounded-lg border border-fc-border bg-white text-left shadow-sm">
              <div className="border-b border-fc-border bg-zinc-50 px-2 py-1.5 font-body text-[9px] text-fc-muted">
                Job · Hours · Labour
              </div>
              <div className="divide-y divide-fc-border/80 font-body text-[9px]">
                <div className="flex justify-between px-2 py-1 text-fc-brand">
                  <span>123 Main</span>
                  <span className="font-medium text-fc-accent">$1,680</span>
                </div>
                <div className="flex justify-between px-2 py-1 text-fc-muted">
                  <span>456 Oak</span>
                  <span>$1,520</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Owner: Payroll export */}
          <div className="rounded-xl border border-fc-border bg-fc-surface/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="mb-3 font-body text-xs font-medium text-fc-muted">
              Owner — Export payroll
            </p>
            <div className="overflow-hidden rounded-lg border border-fc-border bg-white text-left shadow-sm">
              <div className="border-b border-fc-border bg-zinc-50 px-2 py-1.5 font-body text-[9px] text-fc-muted">
                QuickBooks CSV
              </div>
              <div className="space-y-1 p-2 font-body text-[9px] text-fc-muted">
                <p>Worker, hours, job, labour $</p>
              </div>
              <div className="border-t border-fc-border p-2">
                <div className="rounded border border-fc-accent bg-fc-accent/10 py-1.5 text-center font-body text-[9px] font-medium text-fc-accent">
                  Download CSV
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
