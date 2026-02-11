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
      "Workers must select a job to clock in. No generic shifts — every hour is tied to a job.",
  },
  {
    icon: Link2,
    title: "Magic link worker access",
    description:
      "SMS-based magic link. Web app only, no passwords. Workers get in with one tap.",
  },
  {
    icon: BarChart3,
    title: "Job labour summary",
    description:
      "See labour hours and cost per job. The core retention screen — money, not just time.",
  },
  {
    icon: FileSpreadsheet,
    title: "Payroll export",
    description:
      "CSV with job attribution and labour cost. QuickBooks-friendly format.",
  },
  {
    icon: Mail,
    title: "Weekly labour email",
    description:
      "Automatic weekly summary so labour insight becomes a habit.",
  },
  {
    icon: ShieldAlert,
    title: "Payroll leak detection",
    description:
      "Flags overlapping shifts, excessively long shifts, and missing clock-outs.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-fc-border bg-white py-20 sm:py-24 lg:py-32"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
            Everything you need
          </p>
          <h2
            id="features-heading"
            className="mt-4 font-display text-4xl font-bold text-fc-brand sm:text-5xl lg:text-6xl"
          >
            Built for owners who care about margin
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-fc-muted">
            Job-coded time, payroll with context, and labour cost per job — so you
            see which jobs actually make money.
          </p>
        </div>
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group cursor-pointer rounded-xl border border-fc-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-fc-accent/50 hover:shadow-lg"
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fc-accent to-fc-gradient-mid text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <Icon
                  className="h-7 w-7"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-fc-brand">
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
