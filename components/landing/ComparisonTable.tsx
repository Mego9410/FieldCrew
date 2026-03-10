"use client";

const rows = [
  { others: "Tracks time", fieldcrew: "Tracks labour profitability" },
  { others: "Payroll export", fieldcrew: "Margin recovery report" },
  { others: "Admin tool", fieldcrew: "Owner control system" },
  { others: "Generic reporting", fieldcrew: "HVAC-specific insight" },
];

const borderClass = "border-[rgba(255,255,255,0.08)]";

export function ComparisonTable() {
  return (
    <>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr className={`border-b ${borderClass} bg-[rgba(0,0,0,0.2)]`}>
              <th className="px-6 py-5 font-legend-display text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
                Generic Field Software
              </th>
              <th className={`border-l ${borderClass} px-6 py-5 font-legend-display text-xs font-bold uppercase tracking-wider text-[#5b7cff]`}>
                FieldCrew
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b ${borderClass} transition-colors last:border-b-0 hover:bg-[rgba(255,255,255,0.03)] [&:last-child_td]:pb-6`}
              >
                <td className={`px-6 py-5 text-base text-[#a1a1aa] ${i === 0 ? "pt-5" : ""}`}>
                  {row.others}
                </td>
                <td className={`border-l ${borderClass} px-6 py-5 font-legend-body text-base font-semibold text-white ${i === 0 ? "pt-5" : ""}`}>
                  {row.fieldcrew}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 sm:hidden p-4 pt-4 pb-5">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5"
          >
            <p className="font-legend-display text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
              Generic Field Software
            </p>
            <p className="mt-1 font-legend-body text-sm text-[#a1a1aa]">{row.others}</p>
            <p className="mt-4 font-legend-display text-xs font-semibold uppercase tracking-wider text-[#5b7cff]">
              FieldCrew
            </p>
            <p className="mt-1 font-legend-body text-sm font-semibold text-white">
              {row.fieldcrew}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
