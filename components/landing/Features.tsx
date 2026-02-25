import {
  ClipboardCheck,
  Link2,
  BarChart3,
  FileSpreadsheet,
  Mail,
  ShieldAlert,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Mandatory job selection",
    description:
      "Workers must select a job to clock in. Every hour is tied to a revenue event.",
  },
  {
    icon: Link2,
    title: "Magic link worker access",
    description:
      "SMS-based magic link. No passwords. No apps to install. Clock-in in under 10 seconds.",
  },
  {
    icon: BarChart3,
    title: "Job labour summary",
    description:
      "See labour hours and cost per job. This is the core retention screen. Owners don't buy time tracking. They buy visibility into profit.",
  },
  {
    icon: FileSpreadsheet,
    title: "Payroll export",
    description:
      "CSV with job attribution and labour cost. QuickBooks-friendly. No more spreadsheet gymnastics.",
  },
  {
    icon: Mail,
    title: "Weekly labour email",
    description:
      "Every week you receive: \"Last week's labour cost by job.\" Margin awareness becomes habit.",
  },
  {
    icon: ShieldAlert,
    title: "Payroll leak detection",
    description:
      "Automatic flags for: Overlapping shifts, Excessively long shifts, Missing clock-outs. Catch leakage before payday.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-fc-border bg-white py-12 sm:py-24 lg:py-32"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            Core Features
          </p>
          <h2
            id="features-heading"
            className="mt-4 font-display text-3xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Built for owners who care about margin
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-fc-muted">
            FieldCrew exists for one reason: <strong className="text-fc-brand">Expose hidden labour cost.</strong>
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-fc-muted">
            Success is when you rely on FieldCrew to understand labour cost per job and run payroll through it.
          </p>
        </div>
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm transition-all duration-200 hover:border-fc-accent/40"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-fc-accent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-fc-accent text-white"
                aria-hidden
              >
                <Icon
                  className="h-7 w-7"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-fc-brand">
                {title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-fc-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
