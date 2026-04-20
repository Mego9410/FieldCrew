"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  User,
  CreditCard,
  UserPlus,
  LogOut,
  Menu,
  MoveRight,
  X,
  PanelLeft,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const navigationItems = [
  {
    title: "Home",
    href: routes.owner.home,
    description: "",
  },
  {
    title: "Operations",
    description: "Run jobs, crew, time, and payroll from one place.",
    items: [
      { title: "Jobs", href: routes.owner.jobs },
      { title: "Workers", href: routes.owner.workers },
      { title: "Timesheets", href: routes.owner.timesheets },
      { title: "Payroll", href: routes.owner.payrollExport },
    ],
  },
  {
    title: "Business",
    description: "Projects, analytics, and workspace settings.",
    items: [
      { title: "Projects", href: routes.owner.projects },
      { title: "Reporting", href: routes.owner.reporting },
      { title: "Settings", href: routes.owner.settings },
    ],
  },
] as const;

export function AppHeader({
  onMenuClick,
  showMenuButton = false,
  readOnlyMode = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  readOnlyMode?: boolean;
}) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-40 w-full shrink-0 border-b border-fc-border bg-fc-surface">
      <div className="relative mx-auto flex min-h-20 w-full max-w-[1400px] flex-row items-center gap-3 px-3 sm:px-4 lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:min-w-0">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent lg:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}
          <div className="hidden justify-start lg:flex">
            <NavigationMenu className="flex justify-start">
              <NavigationMenuList className="flex flex-row justify-start gap-1 space-x-0">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {"href" in item && item.href ? (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "text-fc-brand hover:text-fc-brand",
                          )}
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    ) : "items" in item ? (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium text-fc-brand">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!w-[min(100vw-2rem,450px)] p-4">
                          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                            <div className="flex h-full flex-col justify-between">
                              <div className="flex flex-col">
                                <p className="text-base font-medium text-fc-brand">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <Link
                                href={routes.owner.data}
                                className={cn(
                                  buttonVariants({ size: "sm" }),
                                  "mt-6 inline-flex w-fit bg-fc-brand text-white hover:bg-fc-navy-800",
                                )}
                              >
                                Create new
                              </Link>
                            </div>
                            <div className="flex h-full flex-col justify-end text-sm">
                              {item.items.map((subItem) => (
                                <NavigationMenuLink key={subItem.title} asChild>
                                  <Link
                                    href={subItem.href}
                                    className="flex flex-row items-center justify-between rounded-md px-4 py-2 hover:bg-muted"
                                  >
                                    <span className="text-fc-brand">{subItem.title}</span>
                                    <MoveRight className="h-4 w-4 text-muted-foreground" />
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : null}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex flex-1 justify-center lg:flex-none">
          <Link
            href={routes.owner.home}
            className="font-display text-base font-semibold text-fc-brand hover:text-fc-accent"
          >
            FieldCrew
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2 sm:gap-4">
          {!readOnlyMode ? (
            <Link
              href={routes.owner.data}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden text-fc-brand md:inline-flex",
              )}
            >
              Create
            </Link>
          ) : (
            <span className="hidden select-none rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 md:inline-flex">
              Read-only
            </span>
          )}
          <div className="hidden h-6 w-px bg-fc-border md:block" aria-hidden />

          <div className="relative flex items-center gap-2" ref={accountRef}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAccountOpen((o) => !o)}
              className="h-9 gap-1.5 border-fc-border text-fc-brand"
              aria-expanded={accountOpen}
              aria-haspopup="true"
              aria-label="Account menu"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fc-accent/15 text-xs font-semibold text-fc-accent">
                FC
              </span>
              <span className="hidden sm:inline">Account</span>
              <ChevronDown
                className={`h-4 w-4 text-fc-muted transition-transform ${accountOpen ? "rotate-180" : ""}`}
              />
            </Button>

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

          <div className="flex shrink-0 items-center justify-end lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-fc-brand"
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {navOpen && (
          <div className="absolute left-0 right-0 top-full z-30 flex flex-col gap-6 border-t border-fc-border bg-fc-surface px-4 py-6 shadow-fc-md lg:hidden">
            {navigationItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                {"href" in item && item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between text-lg font-medium text-fc-brand"
                    onClick={() => setNavOpen(false)}
                  >
                    <span>{item.title}</span>
                    <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                  </Link>
                ) : (
                  <p className="text-lg font-medium text-fc-brand">{item.title}</p>
                )}
                {"items" in item &&
                  item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="flex items-center justify-between pl-1"
                      onClick={() => setNavOpen(false)}
                    >
                      <span className="text-muted-foreground">{subItem.title}</span>
                      <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
