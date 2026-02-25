"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, CreditCard, UserPlus, LogOut, Menu } from "lucide-react";
import { routes } from "@/lib/routes";

const PAGE_TITLES: Record<string, string> = {
  [routes.owner.home]: "Dashboard",
  [routes.owner.jobs]: "Jobs",
  [routes.owner.workers]: "Workers",
  [routes.owner.timesheets]: "Timesheets",
  [routes.owner.payrollExport]: "Payroll",
  [routes.owner.projects]: "Projects",
  [routes.owner.data]: "Data",
  [routes.owner.reporting]: "Reporting",
  [routes.owner.settings]: "Settings",
  [routes.owner.settingsProfile]: "Profile",
  [routes.owner.settingsCompany]: "Company",
  [routes.owner.settingsBilling]: "Billing",
  [routes.owner.settingsNotifications]: "Notifications",
  [routes.owner.settingsSecurity]: "Security",
  [routes.owner.dashboard.margin]: "Labour margin",
  [routes.owner.dashboard.overtime]: "Overtime",
  [routes.owner.dashboard.overruns]: "Overruns",
  [routes.owner.dashboard.recovery]: "Recoverable profit",
  [routes.owner.dashboard.revenueLabour]: "Revenue vs labour",
  [routes.owner.dashboard.labourCostTrend]: "Labour cost trend",
  [routes.owner.dashboard.estimateAccuracy]: "Estimate accuracy",
  [routes.owner.dashboard.revenuePerLabourHour]: "Revenue per labour hour",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith(routes.owner.home)) {
    const byLength = Object.entries(PAGE_TITLES)
      .filter(([path]) => path !== routes.owner.home && pathname.startsWith(path))
      .sort(([a], [b]) => b.length - a.length);
    if (byLength.length > 0) return byLength[0][1];
    if (pathname.includes("/jobs/")) return "Job";
    if (pathname.includes("/workers/")) return "Worker";
    if (pathname.includes("/projects/")) return "Project";
  }
  return "FieldCrew";
}

export function AppHeader({
  onMenuClick,
  showMenuButton = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const title = getPageTitle(pathname);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-fc-border bg-fc-surface px-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent -m-2"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="truncate font-display text-base font-semibold text-fc-brand">
          {title}
        </h1>
      </div>

      <div className="relative flex shrink-0 items-center gap-2" ref={ref}>
        <button
          type="button"
          onClick={() => setAccountOpen((o) => !o)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-fc-border bg-fc-surface px-2.5 py-1.5 text-sm font-medium text-fc-brand transition-colors hover:bg-fc-surface-muted"
          aria-expanded={accountOpen}
          aria-haspopup="true"
          aria-label="Account menu"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fc-accent/15 text-xs font-semibold text-fc-accent">
            FC
          </span>
          <ChevronDown
            className={`h-4 w-4 text-fc-muted transition-transform ${accountOpen ? "rotate-180" : ""}`}
          />
        </button>

        {accountOpen && (
          <div
            className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-fc-border bg-fc-surface py-1 shadow-fc-md"
            role="menu"
          >
            <Link
              href={routes.owner.settings}
              className="flex items-center gap-2 px-3 py-2 text-sm text-fc-brand hover:bg-fc-surface-muted"
              role="menuitem"
              onClick={() => setAccountOpen(false)}
            >
              <User className="h-4 w-4 text-fc-muted" />
              Account
            </Link>
            <Link
              href={routes.owner.settingsBilling}
              className="flex items-center gap-2 px-3 py-2 text-sm text-fc-brand hover:bg-fc-surface-muted"
              role="menuitem"
              onClick={() => setAccountOpen(false)}
            >
              <CreditCard className="h-4 w-4 text-fc-muted" />
              Billing
            </Link>
            <Link
              href={routes.owner.settings}
              className="flex items-center gap-2 px-3 py-2 text-sm text-fc-brand hover:bg-fc-surface-muted"
              role="menuitem"
              onClick={() => setAccountOpen(false)}
            >
              <UserPlus className="h-4 w-4 text-fc-muted" />
              Invite
            </Link>
            <div className="my-1 border-t border-fc-border" />
            <Link
              href={routes.public.home}
              className="flex items-center gap-2 px-3 py-2 text-sm text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
              role="menuitem"
              onClick={() => setAccountOpen(false)}
            >
              <LogOut className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
