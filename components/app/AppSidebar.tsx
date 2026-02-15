"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjects } from "@/lib/hooks/useData";
import {
  Plus,
  Home,
  Bell,
  TrendingUp,
  Folder,
  Target,
} from "lucide-react";
import { routes } from "@/lib/routes";

const topNav = [
  { href: routes.owner.home, label: "Home", icon: Home },
  { href: "/#inbox", label: "Inbox", icon: Bell, badge: true },
];

const tabNav = [
  { href: routes.owner.home, label: "Overview" },
  { href: routes.owner.projects, label: "Projects" },
  { href: routes.owner.jobs, label: "Jobs" },
  { href: routes.owner.workers, label: "Workers" },
  { href: routes.owner.timesheets, label: "Timesheets" },
  { href: routes.owner.payrollExport, label: "Payroll" },
  { href: routes.owner.data, label: "Data" },
  { href: routes.owner.settings, label: "Settings" },
];

const insightsNav = [
  { href: routes.owner.reporting, label: "Reporting", icon: TrendingUp },
  { href: "/#portfolios", label: "Portfolios", icon: Folder },
  { href: "/#goals", label: "Goals", icon: Target },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { items: projects } = useProjects();

  const isTabActive = (href: string) => {
    if (href === routes.owner.home) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col min-h-0 bg-fc-nav-sidebar text-white"
      aria-label="App navigation"
    >
      <div className="border-b border-slate-800 px-3 py-2.5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 bg-fc-accent px-3 py-2 text-sm font-bold text-white hover:bg-fc-accent-dark"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Create
        </button>
      </div>

      <div className="scrollbar-dark flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="flex flex-col px-2 py-1.5">
          {topNav.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                pathname === href || (href !== routes.owner.home && pathname.startsWith(href))
                  ? "border-l-4 border-fc-accent bg-slate-800 font-bold text-white"
                  : "border-l-4 border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span className="relative shrink-0">
                <Icon className="h-4 w-4" />
                {badge && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-fc-accent" aria-hidden />
                )}
              </span>
              {label}
            </Link>
          ))}
        </div>

        <nav className="border-b border-slate-800 px-2 py-1.5" aria-label="Main sections">
          {tabNav.map(({ href, label }) => {
            const active = isTabActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border-l-4 border-fc-accent bg-slate-800 font-bold text-fc-accent -ml-0.5 pl-[11px]"
                    : "border-l-4 border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col px-2 py-1.5">
          <div className="mt-4 first:mt-0">
            <div className="mb-1 px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Insights
              </span>
            </div>
            <div className="flex flex-col">
              {insightsNav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Projects
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="flex-1" />
                <Link href={routes.owner.projects} className="text-slate-500 hover:text-white" title="Manage projects">
                  <Plus className="h-3 w-3" />
                </Link>
              </div>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={routes.owner.projectJobs(project.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm ${
                    pathname === routes.owner.projectJobs(project.id)
                      ? "font-medium text-white"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 ${project.color}`} />
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-3 py-3">
        <div className="mb-2 bg-slate-800/80 px-3 py-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Free trial · 10 days left</span>
        </div>
        <button
          type="button"
          className="mb-2 w-full bg-fc-accent py-2 text-sm font-bold text-white hover:bg-fc-accent-dark"
        >
          Add billing info
        </button>
        <button
          type="button"
          className="mb-3 w-full border border-slate-700 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Invite teammates
        </button>
        <Link
          href={routes.public.home}
          className="block text-center text-[10px] font-medium uppercase tracking-wider text-slate-500 hover:text-white"
        >
          Back to site
        </Link>
        <Link
          href={routes.public.home}
          className="mt-3 block text-center font-display text-sm font-bold text-white"
        >
          FieldCrew
        </Link>
      </div>
    </aside>
  );
}
