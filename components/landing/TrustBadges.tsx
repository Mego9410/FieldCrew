export function TrustBadges() {
  const losses = [
    "$25K+ Lost Per Year",
    "120+ Hours Wasted",
    "$15K Lost to Overtime",
    "40+ Hours Lost to Conflicts",
    "8% Payroll Leakage",
    "200+ Hours Untracked",
  ];

  return (
    <section className="border-b border-fc-border bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
            AVERAGE HVAC LOSSES PER YEAR
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {losses.map((loss) => (
              <div
                key={loss}
                className="text-lg font-semibold text-fc-muted"
                aria-label={loss}
              >
                {loss}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
