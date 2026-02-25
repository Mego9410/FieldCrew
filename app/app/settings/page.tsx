import Link from "next/link";
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Shield,
  ChevronRight,
} from "lucide-react";
import { routes } from "@/lib/routes";

const sections = [
  {
    title: "Profile",
    description: "Name, email, and profile photo",
    href: routes.owner.settingsProfile,
    icon: User,
  },
  {
    title: "Company",
    description: "Business name, address, and tax ID",
    href: routes.owner.settingsCompany,
    icon: Building2,
  },
  {
    title: "Notifications",
    description: "Email and in-app notification preferences",
    href: routes.owner.settingsNotifications,
    icon: Bell,
  },
  {
    title: "Billing",
    description: "Plan, payment method, and invoices",
    href: routes.owner.settingsBilling,
    icon: CreditCard,
  },
  {
    title: "Security",
    description: "Password and two-factor authentication",
    href: routes.owner.settingsSecurity,
    icon: Shield,
  },
];

export default function SettingsPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Settings</h1>
        <p className="mt-0.5 text-sm text-fc-muted">
          Account and app settings.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Account & app
        </h2>
        <div className="max-w-2xl space-y-0 border border-fc-border bg-fc-surface">
          {sections.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 border-b border-fc-border p-4 last:border-b-0 transition-colors hover:bg-fc-surface-muted"
            >
              <Icon className="h-5 w-5 shrink-0 text-fc-muted" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-fc-brand">{title}</p>
                <p className="text-sm text-fc-muted">{description}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-fc-muted" />
            </Link>
          ))}
        </div>
      </section>

      <p className="text-sm text-fc-muted">
        <Link href={routes.owner.home} className="font-medium text-fc-accent hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
