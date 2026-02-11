export function TrustBadges() {
  const companies = [
    "Wayfair",
    "Deloitte",
    "Pfizer",
    "Adobe",
    "American Airlines",
    "NBCUniversal",
  ];

  return (
    <section className="border-b border-fc-border bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
            TRUSTED BY THE BEST
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {companies.map((company) => (
              <div
                key={company}
                className="text-lg font-semibold text-fc-muted"
                aria-label={company}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
