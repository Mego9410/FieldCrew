"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, ShieldAlert, DollarSign } from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/finances", label: "Finances", icon: DollarSign },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col min-h-0 overflow-hidden rounded-xl bg-fc-surface shadow-fc-md"
      aria-label="Admin navigation"
    >
      <div className="flex flex-col px-3 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold text-fc-brand hover:text-fc-accent min-h-[44px] min-w-[44px] inline-flex items-center"
          >
            FieldCrew
          </Link>
          <div className="inline-flex items-center gap-1 rounded-lg border border-fc-border bg-fc-surface-muted px-2 py-1 text-[11px] font-semibold text-fc-brand">
            <ShieldAlert className="h-3.5 w-3.5 text-fc-muted" />
            Admin
          </div>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-auto px-2 pb-4">
        <div className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-fc-surface-muted text-fc-brand"
                    : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

