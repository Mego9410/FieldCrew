/**
 * Hero visual: stylized view of the FieldCrew app (labour cost per job).
 * Browser-style frame with sidebar and main content. No animation (reduced-motion safe).
 */
export function HeroVisual() {
  return (
    <div
      className="mx-auto max-w-2xl px-4"
      aria-hidden
    >
      <div className="overflow-hidden rounded-xl border border-fc-border bg-white shadow-xl ring-1 ring-black/5 ring-fc-accent/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-fc-border bg-zinc-50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1.5 text-center">
            <span className="font-body text-[10px] text-fc-muted sm:text-xs">
              app.fieldcrew.com/jobs
            </span>
          </div>
        </div>

        <div className="flex min-h-[200px] sm:min-h-[220px]">
          {/* Sidebar */}
          <aside className="w-14 shrink-0 border-r border-fc-border bg-fc-surface/60 py-3 pl-2 sm:w-16">
            <nav className="flex flex-col gap-0.5">
              {["Overview", "Jobs", "Payroll", "Workers"].map((label, i) => (
                <div
                  key={label}
                  className={`rounded-r px-2 py-1.5 ${
                    i === 1 ? "border-l-2 border-fc-accent bg-fc-accent/10 font-medium text-fc-brand" : "text-fc-muted"
                  }`}
                >
                  <span className="font-body text-[9px] sm:text-[10px]">{label}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content: Labour cost per job */}
          <main className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-fc-brand">
                Labour cost per job
              </h3>
              <span className="rounded bg-fc-accent/15 px-2 py-0.5 font-body text-[9px] font-medium text-fc-accent sm:text-[10px]">
                This week
              </span>
            </div>

            {/* Summary strip */}
            <div className="mb-3 flex gap-2">
              <div className="flex-1 rounded-md border border-fc-border bg-white px-2 py-1.5">
                <span className="font-body text-[8px] text-fc-muted sm:text-[9px]">Hours</span>
                <p className="font-display text-xs font-semibold text-fc-brand">124</p>
              </div>
              <div className="flex-1 rounded-md border border-fc-border bg-white px-2 py-1.5">
                <span className="font-body text-[8px] text-fc-muted sm:text-[9px]">Labour $</span>
                <p className="font-display text-xs font-semibold text-fc-brand">4,960</p>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-fc-border">
              <table className="w-full border-collapse font-body text-[9px] sm:text-[10px]">
                <thead>
                  <tr className="border-b border-fc-border bg-fc-surface/80 text-left">
                    <th className="px-2 py-1.5 font-semibold text-fc-muted">Job</th>
                    <th className="px-2 py-1.5 font-semibold text-fc-muted text-right">Hours</th>
                    <th className="px-2 py-1.5 font-semibold text-fc-muted text-right">Labour</th>
                  </tr>
                </thead>
                <tbody className="text-fc-brand">
                  <tr className="border-b border-fc-border/80">
                    <td className="px-2 py-1.5">123 Main — Install</td>
                    <td className="px-2 py-1.5 text-right">42</td>
                    <td className="px-2 py-1.5 text-right font-medium text-fc-accent">$1,680</td>
                  </tr>
                  <tr className="border-b border-fc-border/80">
                    <td className="px-2 py-1.5">456 Oak — Service</td>
                    <td className="px-2 py-1.5 text-right">38</td>
                    <td className="px-2 py-1.5 text-right">$1,520</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5">789 Pine — Maintenance</td>
                    <td className="px-2 py-1.5 text-right">44</td>
                    <td className="px-2 py-1.5 text-right">$1,760</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-2 font-body text-[8px] text-fc-muted sm:text-[9px]">
              Export payroll with job context →
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
