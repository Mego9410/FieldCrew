const rows = [
  { others: "Tracks time", fieldcrew: "Tracks labour profitability" },
  { others: "Payroll export", fieldcrew: "Margin recovery report" },
  { others: "Admin tool", fieldcrew: "Owner control system" },
  { others: "Generic reporting", fieldcrew: "HVAC-specific insight" },
];

export function ComparisonTable() {
  return (
    <>
      {/* Desktop: table — more row spacing, brighter FieldCrew column */}
      <div className="hidden overflow-x-auto rounded-[var(--fc-radius)] border border-slate-600 sm:block">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-900/90">
              <th className="px-6 py-4 font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                Generic Field Software
              </th>
              <th className="border-l border-slate-600 px-6 py-4 font-display text-xs font-bold uppercase tracking-wider text-fc-accent">
                FieldCrew
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-700/80 last:border-b-0 hover:bg-slate-800/40"
              >
                <td className="px-6 py-5 text-sm text-slate-400">{row.others}</td>
                <td className="border-l border-slate-600 px-6 py-5 text-sm font-semibold text-slate-100">
                  {row.fieldcrew}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile: stacked cards */}
      <div className="space-y-4 sm:hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-[var(--fc-radius)] border border-slate-600 bg-slate-900/50 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Generic Field Software
            </p>
            <p className="mt-1 text-sm text-slate-400">{row.others}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-fc-accent">
              FieldCrew
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {row.fieldcrew}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
