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
    href: "#profile",
    icon: User,
  },
  {
    title: "Company",
    description: "Business name, address, and tax ID",
    href: "#company",
    icon: Building2,
  },
  {
    title: "Notifications",
    description: "Email and in-app notification preferences",
    href: "#notifications",
    icon: Bell,
  },
  {
    title: "Billing",
    description: "Plan, payment method, and invoices",
    href: "#billing",
    icon: CreditCard,
  },
  {
    title: "Security",
    description: "Password and two-factor authentication",
    href: "#security",
    icon: Shield,
  },
];

export default function SettingsPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Settings</h1>
        <p className="mt-1 text-sm text-fc-muted">
          Account and app settings.
        </p>
      </div>

      <div className="max-w-2xl space-y-1">
        {sections.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-fc-border bg-white p-4 shadow-sm transition-colors hover:border-fc-accent/30 hover:bg-slate-50/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fc-accent/10 text-fc-accent">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-fc-brand">{title}</p>
              <p className="text-sm text-fc-muted">{description}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-fc-muted" />
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-fc-muted">
        <Link href={routes.owner.home} className="text-fc-accent hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
