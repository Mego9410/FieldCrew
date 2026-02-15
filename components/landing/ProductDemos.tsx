import Link from "next/link";

/**
 * Small demos of the software in action — job picker, clock, labour cost, export.
 */
export function ProductDemos() {
  return (
    <section
      id="demos"
      className="border-b border-fc-border bg-fc-brand py-20 sm:py-24 lg:py-32"
      aria-labelledby="demos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-fc-accent">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2
            id="demos-heading"
            className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
          >
            The only payroll that works when you work
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Workers pick a job and clock in. You see labour cost per job and export
            payroll with context.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Integration showcase */}
          <div className="lg:col-span-3 rounded-lg border border-slate-700 bg-slate-900/50 p-6 shadow-fc-md">
            <h3 className="mb-4 font-display text-xl font-bold text-white">
              Seamlessly integrate with all your tools
            </h3>
            <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
              {["QuickBooks", "Slack", "Google", "Microsoft", "GitHub", "Salesforce", "Notion", "Zoom"].map((tool) => (
                <div
                  key={tool}
                  className="flex h-14 items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
                  aria-label={tool}
                >
                  <span className="text-xs font-medium">{tool}</span>
                </div>
              ))}
            </div>
            <Link
              href="#pricing"
              className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-fc-brand transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Learn More
            </Link>
          </div>
          {/* 1. Worker: Job picker */}
          <div className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-900/50 p-6 shadow-fc-md transition-all duration-200 hover:border-fc-accent/40">
            <p className="mb-4 font-body text-sm font-medium text-slate-400">
              Worker — Select job
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 text-left shadow-lg">
              <div className="border-b border-slate-700 bg-slate-900 px-3 py-2.5 font-body text-xs text-slate-300">
                Select a job
              </div>
              <div className="space-y-2 p-3">
                {["123 Main — Install", "456 Oak — Service"].map((job, i) => (
                  <div
                    key={job}
                    className={`rounded-lg border px-3 py-2 font-body text-xs transition-colors ${
                      i === 0
                        ? "border-fc-accent bg-fc-accent/20 text-white"
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {job}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-700 p-3">
                <div className="rounded-lg bg-gradient-to-r from-fc-accent to-fc-gradient-mid py-2.5 text-center font-body text-xs font-semibold text-white shadow-lg">
                  Continue
                </div>
              </div>
            </div>
          </div>

          {/* 2. Worker: Clock screen */}
          <div className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-900/50 p-6 shadow-fc-md transition-all duration-200 hover:border-fc-accent/40">
            <p className="mb-4 font-body text-sm font-medium text-slate-400">
              Worker — Clock in
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 text-left shadow-lg">
              <div className="border-b border-slate-700 bg-slate-900 px-3 py-2.5 font-body text-xs text-white font-semibold">
                123 Main — Install
              </div>
              <div className="p-4 font-body text-sm text-slate-400">
                Not clocked in
              </div>
              <div className="border-t border-slate-700 p-3">
                <div className="rounded-lg bg-gradient-to-r from-fc-accent to-fc-gradient-mid py-2.5 text-center font-body text-xs font-semibold text-white shadow-lg">
                  Clock In
                </div>
              </div>
            </div>
          </div>

          {/* 3. Owner: Labour cost per job */}
          <div className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-900/50 p-6 shadow-fc-md transition-all duration-200 hover:border-fc-accent/40">
            <p className="mb-4 font-body text-sm font-medium text-slate-400">
              Owner — Labour by job
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 text-left shadow-lg">
              <div className="border-b border-slate-700 bg-slate-900 px-3 py-2.5 font-body text-xs text-slate-300">
                Job · Hours · Labour
              </div>
              <div className="divide-y divide-slate-700 font-body text-sm p-3">
                <div className="flex justify-between py-2 text-white">
                  <span>123 Main</span>
                  <span className="font-semibold text-fc-accent">$1,680</span>
                </div>
                <div className="flex justify-between py-2 text-slate-400">
                  <span>456 Oak</span>
                  <span>$1,520</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
