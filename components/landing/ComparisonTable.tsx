"use client";

const rows = [
  { others: "Tracks time", fieldcrew: "Tracks labor profitability" },
  { others: "Payroll export", fieldcrew: "Margin recovery report" },
  { others: "Admin tool", fieldcrew: "Owner control system" },
  { others: "Generic reporting", fieldcrew: "HVAC-specific insight" },
];

export function ComparisonTable() {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[var(--fc-radius)] border border-fc-navy-800 sm:block">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr className="border-b border-fc-navy-800 bg-fc-navy-900/90">
              <th className="px-6 py-4 font-display text-xs font-bold uppercase tracking-wider text-fc-steel-500">
                Generic Field Software
              </th>
              <th className="border-l border-fc-navy-800 px-6 py-4 font-display text-xs font-bold uppercase tracking-wider text-fc-orange-500">
                FieldCrew
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-fc-navy-800/80 last:border-b-0 transition-colors duration-200 hover:bg-fc-orange-500/10"
              >
                <td className="px-6 py-5 text-sm text-fc-steel-500">
                  {row.others}
                </td>
                <td className="border-l border-fc-navy-800 px-6 py-5 text-sm font-semibold text-slate-200">
                  {row.fieldcrew}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4 sm:hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-[var(--fc-radius)] border border-fc-navy-800 bg-fc-navy-900/80 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-fc-steel-500">
              Generic Field Software
            </p>
            <p className="mt-1 text-sm text-fc-steel-500">{row.others}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-fc-orange-500">
              FieldCrew
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {row.fieldcrew}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
