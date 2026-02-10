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
      className="border-b border-fc-border bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-fc-accent">
          Built for the field
        </p>
        <h2
          id="features-heading"
          className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl"
        >
          Built for owners who care about margin
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">
          Job-coded time, payroll with context, and labour cost per job — so you
          see which jobs actually make money.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-lg border border-fc-border bg-fc-surface/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-fc-accent/30 hover:bg-fc-surface"
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-fc-border bg-white text-fc-accent"
                aria-hidden
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-fc-brand">
                {title}
              </h3>
              <p className="mt-2 text-fc-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
