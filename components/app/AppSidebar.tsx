"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjects } from "@/lib/hooks/useData";
import { Home, Briefcase, Users, Clock, Banknote, FolderOpen, Database, BarChart3, Settings } from "lucide-react";
import { routes } from "@/lib/routes";

const primaryNav = [
  { href: routes.owner.home, label: "Home", icon: Home },
  { href: routes.owner.jobs, label: "Jobs", icon: Briefcase },
  { href: routes.owner.workers, label: "Workers", icon: Users },
  { href: routes.owner.timesheets, label: "Timesheets", icon: Clock },
  { href: routes.owner.payrollExport, label: "Payroll", icon: Banknote },
];

const secondaryNav = [
  { href: routes.owner.projects, label: "Projects", icon: FolderOpen },
  { href: routes.owner.data, label: "Data", icon: Database },
  { href: routes.owner.reporting, label: "Reporting", icon: BarChart3 },
  { href: routes.owner.settings, label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { items: projects } = useProjects();

  const isActive = (href: string) => {
    if (href === routes.owner.home) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col min-h-0 overflow-hidden rounded-xl bg-fc-surface shadow-fc-md"
      aria-label="App navigation"
    >
      <div className="flex flex-col px-3 py-4">
        <Link
          href={routes.owner.home}
          className="font-display text-lg font-semibold text-fc-brand hover:text-fc-accent"
        >
          FieldCrew
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-auto px-2 pb-4" aria-label="Main navigation">
        <div className="space-y-0.5">
          {primaryNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
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

        <div className="mt-6">
          <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-fc-muted">
            More
          </p>
          <div className="mt-0.5 space-y-0.5">
            {secondaryNav.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-fc-surface-muted font-medium text-fc-brand"
                      : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {projects.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-fc-muted">
                Projects
              </p>
              <Link
                href={routes.owner.projects}
                className="text-fc-muted hover:text-fc-brand"
                title="Manage projects"
                aria-label="Manage projects"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-0.5 space-y-0.5">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  href={routes.owner.projectJobs(project.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                    pathname === routes.owner.projectJobs(project.id)
                      ? "font-medium text-fc-brand"
                      : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${project.color}`} />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-fc-border px-3 py-4">
        <Link
          href={routes.owner.settings}
          className="block text-sm font-medium text-fc-muted hover:text-fc-brand"
        >
          Account
        </Link>
        <Link
          href={routes.public.home}
          className="mt-2 block text-xs text-fc-muted hover:text-fc-brand"
        >
          Back to site
        </Link>
        <p className="mt-3 text-[11px] font-medium text-fc-muted">FieldCrew</p>
      </div>
    </aside>
  );
}
