export function Statistics() {
  const stats = [
    { value: "2M+", label: "Teams" },
    { value: "5000+", label: "Enterprises" },
    { value: "10M+", label: "Users" },
    { value: "4.8/5", label: "Stars" },
  ];

  return (
    <section
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="statistics-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="statistics-heading"
            className="font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl"
          >
            Payroll solutions for every team
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl">
                {stat.value}
              </div>
              <div className="mt-2 text-base font-medium text-fc-muted sm:text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
          {["Google", "Forbes", "WSJ", "TechCrunch"].map((company) => (
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
    </section>
  );
}
