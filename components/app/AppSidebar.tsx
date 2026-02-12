"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Home,
  ClipboardList,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  FolderKanban,
  Settings,
  Bell,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Folder,
  Target,
} from "lucide-react";
import { routes } from "@/lib/routes";

const topNav = [
  { href: routes.owner.home, label: "Home", icon: Home },
  { href: routes.owner.jobs, label: "My tasks", icon: CheckCircle2 },
  { href: "/#inbox", label: "Inbox", icon: Bell, badge: true },
];

const tabNav = [
  { href: routes.owner.home, label: "Overview" },
  { href: routes.owner.jobs, label: "Jobs" },
  { href: routes.owner.workers, label: "Workers" },
  { href: routes.owner.timesheets, label: "Timesheets" },
  { href: routes.owner.payrollExport, label: "Payroll" },
  { href: routes.owner.settings, label: "Settings" },
];

const insightsNav = [
  { href: "/#reporting", label: "Reporting", icon: TrendingUp },
  { href: "/#portfolios", label: "Portfolios", icon: Folder },
  { href: "/#goals", label: "Goals", icon: Target },
];

const projectsNav = [
  { label: "ASMobbin Campaign", color: "bg-teal-400", href: routes.owner.jobs },
  { label: "Product Demo - A", color: "bg-violet-400", href: routes.owner.jobs },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === routes.owner.home) return pathname === href;
    return pathname.startsWith(href);
  };

  const isPayroll = (href: string) => href === routes.owner.payrollExport;

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col min-h-0 bg-slate-800 text-white"
      aria-label="App navigation"
    >
      {/* Top: Hamburger + Create (light grey button, red plus) */}
      <div className="flex items-center gap-2 border-b border-slate-600 px-3 py-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-200 hover:bg-slate-700 hover:text-white"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-600"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          Create
        </button>
      </div>

      {/* Home, My tasks, Inbox */}
      <div className="flex flex-col gap-0.5 px-3 py-3">
        {topNav.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === href || (href !== routes.owner.home && pathname.startsWith(href))
                ? "bg-slate-700 text-white"
                : "text-slate-100 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <span className="relative shrink-0">
              <Icon className="h-5 w-5" />
              {badge && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-800" aria-hidden />
              )}
            </span>
            {label}
          </Link>
        ))}
      </div>

      {/* Vertical tab menu: Overview, Jobs, Workers, Timesheets, Payroll, Settings (+ purple active) */}
      <nav className="border-b border-slate-600 px-3 py-2" aria-label="Main sections">
        {tabNav.map(({ href, label }) => {
          const active = isTabActive(href);
          const isPayrollItem = isPayroll(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition-colors ${
                active
                  ? "border-l-[3px] border-fc-accent bg-transparent pl-[9px] text-fc-accent"
                  : isPayrollItem
                    ? "rounded-full bg-slate-700 text-slate-100 hover:bg-slate-600"
                    : "text-slate-100 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className="flex w-full items-center px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
          aria-label="Add section"
        >
          +
        </button>
      </nav>

      {/* Insights, Projects, Team */}
      <div className="sidebar-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-3 py-3">
        <div>
          <div className="mb-1 flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Insights
            </span>
            <button type="button" className="text-slate-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {insightsNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-100 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Projects (with colored squares) */}
        <div>
          <div className="mb-1 flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Projects
            </span>
            <button type="button" className="text-slate-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {projectsNav.map(({ label, color, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-100 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <span className={`h-3 w-3 shrink-0 rounded-sm ${color}`} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="mb-1 px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Team
            </span>
          </div>
          <Link
            href={routes.owner.workers}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-100 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0" />
              My workspace
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-600 px-3 py-4">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-500/20 px-3 py-2 text-amber-100">
          <span className="text-xs font-medium">Free trial · 10 days left</span>
        </div>
        <button
          type="button"
          className="mb-2 w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Add billing info
        </button>
        <button
          type="button"
          className="mb-4 w-full rounded-lg border border-slate-500 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700 hover:text-white"
        >
          Invite teammates
        </button>
        <Link
          href={routes.public.home}
          className="block text-center text-xs font-medium text-slate-200 hover:text-white"
        >
          Back to site
        </Link>
        <div className="mt-4 flex items-center justify-center">
          <Link
            href={routes.public.home}
            className="font-display text-lg font-bold text-white"
          >
            FieldCrew
          </Link>
        </div>
      </div>
    </aside>
  );
}
