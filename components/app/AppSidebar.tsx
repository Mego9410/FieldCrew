"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useProjects } from "@/lib/hooks/useData";
import { Home, Briefcase, Users, Clock, Banknote, FolderOpen, BarChart3, Settings, X, ChevronRight, CreditCard } from "lucide-react";
import { routes } from "@/lib/routes";

const createOptions = [
  { tab: "project", label: "Project" },
  { tab: "worker", label: "Worker" },
  { tab: "job", label: "Job" },
  { tab: "timeentry", label: "Time Entry" },
] as const;

const primaryNav = [
  { href: routes.owner.home, label: "Home", icon: Home },
  { href: routes.owner.jobs, label: "Jobs", icon: Briefcase },
  { href: routes.owner.workers, label: "Workers", icon: Users },
  { href: routes.owner.timesheets, label: "Timesheets", icon: Clock },
  { href: routes.owner.payrollExport, label: "Payroll", icon: Banknote },
];

const secondaryNav = [
  { href: routes.owner.projects, label: "Projects", icon: FolderOpen },
  { href: routes.owner.reporting, label: "Reporting", icon: BarChart3 },
  { href: routes.owner.settings, label: "Settings", icon: Settings },
];

export function AppSidebar({
  onNavigate,
  showCloseButton = false,
  readOnlyMode = false,
}: {
  onNavigate?: () => void;
  showCloseButton?: boolean;
  readOnlyMode?: boolean;
}) {
  const pathname = usePathname();
  const { items: projects } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const createRef = useRef<HTMLDivElement>(null);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [subscription, setSubscription] = useState<{ planName: string; workerLimit: number; workersUsed: number } | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSubscription({ planName: d.planName, workerLimit: d.workerLimit, workersUsed: d.workersUsed }))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    onNavigate?.();
  }, [pathname, onNavigate]);

  useEffect(() => {
    if (!createOpen || !createRef.current) return;
    const el = createRef.current;
    const rect = el.getBoundingClientRect();
    setDropdownRect({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [createOpen]);

  useEffect(() => {
    if (!createOpen) {
      setDropdownRect(null);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (createRef.current?.contains(target)) return;
      const menu = document.getElementById("create-dropdown-menu");
      if (menu?.contains(target)) return;
      setCreateOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createOpen]);

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
        <div className="flex items-center justify-between gap-2">
          <Link
            href={routes.owner.home}
            className="font-display text-lg font-semibold text-fc-brand hover:text-fc-accent min-h-[44px] min-w-[44px] inline-flex items-center"
          >
            FieldCrew
          </Link>
          {showCloseButton && (
            <button
              type="button"
              onClick={onNavigate}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-auto px-2 pb-4" aria-label="Main navigation">
        <div className="relative mb-2 pt-2" ref={createRef}>
          <button
            type="button"
            onClick={() => setCreateOpen((o) => !o)}
            disabled={readOnlyMode}
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#152d47] focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-surface"
            aria-expanded={createOpen}
            aria-haspopup="true"
            aria-label="Create new"
          >
            Create +
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform ${createOpen ? "rotate-90" : ""}`}
              aria-hidden
            />
          </button>
        </div>

        {createOpen && dropdownRect && typeof document !== "undefined" &&
          createPortal(
            <div
              id="create-dropdown-menu"
              role="menu"
              className="fixed z-[100] min-w-[160px] rounded-lg border border-fc-border bg-fc-surface py-1 shadow-fc-md"
              style={{
                top: dropdownRect.top,
                left: dropdownRect.left,
                width: dropdownRect.width,
              }}
            >
              {createOptions.map(({ tab, label }) => (
                <Link
                  key={tab}
                  href={`${routes.owner.data}?tab=${tab}`}
                  role="menuitem"
                  onClick={() => setCreateOpen(false)}
                  className="block px-3 py-2 text-sm text-fc-brand hover:bg-fc-surface-muted"
                >
                  {label}
                </Link>
              ))}
            </div>,
            document.body
          )}

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
        {subscription && (
          <>
            <p className="text-[11px] font-medium text-fc-muted">
              {subscription.planName} • {subscription.workersUsed}/{subscription.workerLimit} workers
            </p>
            <Link
              href={routes.owner.settingsBilling}
              className="mt-1.5 flex items-center gap-1.5 text-xs text-fc-muted hover:text-fc-brand"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Billing
            </Link>
          </>
        )}
        <Link
          href={routes.owner.settings}
          className={`block text-sm font-medium text-fc-muted hover:text-fc-brand ${subscription ? "mt-3" : ""}`}
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
