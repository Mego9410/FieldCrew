const badges = [
  "Job-Based Time Tracking",
  "Labour Cost Per Job",
  "Payroll Export",
  "Leak Detection",
  "Magic Link Access",
  "Weekly Reports",
];

export function TrustBadges() {
  return (
    <section className="border-b border-fc-border bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
            STOP PAYROLL LEAKAGE • SEE WHICH JOBS MAKE MONEY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-fc-border bg-white px-4 py-2 text-sm font-medium text-fc-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
