"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, MoveRight, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";
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

function getMobileNavLinks(pathname: string) {
  const isHome = pathname === "/";
  const productHref = isHome ? "#how-it-works" : "/#how-it-works";
  return {
    sections: [
      {
        title: "Product",
        items: [
          { href: productHref, label: "How it works" },
          { href: "/profit-leak", label: "Profit leak estimate" },
          { href: "/sample-report", label: "Sample report" },
          { href: "/about", label: "About us" },
        ],
      },
      {
        title: "Site",
        items: [
          { href: "/blog", label: "Blog" },
          { href: routes.owner.subscribe, label: "Pricing" },
        ],
      },
    ],
    auth: [
      { href: "/login", label: "Log in" },
      { href: routes.owner.subscribe, label: "Start for $9", primary: true as const },
    ],
  };
}

/** Close after navigation starts — closing in the same tick can unmount `<Link>` before Next.js handles the click. */
function scheduleCloseMobileMenu(setOpen: (v: boolean) => void) {
  window.setTimeout(() => setOpen(false), 0);
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setHeroVisible(false);
      return;
    }
    const onScroll = () => {
      setHeroVisible(window.scrollY < 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-mobile-nav-trigger]")) setMobileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";
  const productHref = isHome ? "#how-it-works" : "/#how-it-works";
  const darkNav = isHome && heroVisible;

  const productLinks = [
    { title: "How it works", href: productHref },
    { title: "Profit leak estimate", href: "/profit-leak" },
    { title: "Sample report", href: "/sample-report" },
    { title: "About us", href: "/about" },
  ] as const;

  const learnLinks = [
    { title: "Blog", href: "/blog" },
    { title: "Pricing", href: routes.owner.subscribe },
  ] as const;

  const triggerClass = cn(
    navigationMenuTriggerStyle(),
    "text-sm font-medium",
    darkNav
      ? "!bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/15 data-[state=open]:text-white"
      : "text-fc-brand hover:text-fc-accent",
  );

  const mobile = getMobileNavLinks(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300",
        darkNav
          ? "border-fc-navy-800 bg-fc-navy-950/95 shadow-lg shadow-black/20 supports-[backdrop-filter]:bg-fc-navy-950"
          : "border-fc-border bg-white/80 supports-[backdrop-filter]:bg-white/95",
      )}
    >
      <nav
        className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex min-h-20 w-full items-center gap-3 lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">
          {/* Col 1: mobile logo OR desktop nav */}
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:min-w-0">
            <div className="lg:hidden">
              <Logo
                href="/"
                size="md"
                onDark={darkNav}
                priority
                className={cn(
                  "min-h-[44px]",
                  darkNav ? "focus:ring-offset-fc-navy-950" : "focus:ring-offset-white",
                )}
              />
            </div>

            <div className="hidden justify-start lg:flex">
              <NavigationMenu className="flex justify-start">
                <NavigationMenuList className="flex flex-row justify-start gap-1 space-x-0">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={triggerClass}>Product</NavigationMenuTrigger>
                    <NavigationMenuContent className="!w-[min(100vw-2rem,450px)] p-4">
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex flex-col">
                            <p className="text-base font-medium text-fc-brand">Product</p>
                            <p className="text-sm text-muted-foreground">
                              See where labor profit leaks and what to do about it.
                            </p>
                          </div>
                          <Link
                            href={routes.owner.subscribe}
                            className={cn(
                              buttonVariants({ size: "sm" }),
                              "mt-6 inline-flex w-fit bg-fc-brand text-white hover:bg-fc-navy-800",
                            )}
                          >
                            Start for $9
                          </Link>
                        </div>
                        <div className="flex h-full flex-col justify-end text-sm">
                          {productLinks.map((sub) => (
                            <NavigationMenuLink key={sub.title} asChild>
                              <Link
                                href={sub.href}
                                className="flex flex-row items-center justify-between rounded-md px-4 py-2 hover:bg-muted"
                              >
                                <span className="text-fc-brand">{sub.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={triggerClass}>Learn</NavigationMenuTrigger>
                    <NavigationMenuContent className="!w-[min(100vw-2rem,380px)] p-4">
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                        <div className="flex flex-col">
                          <p className="text-base font-medium text-fc-brand">Learn</p>
                          <p className="text-sm text-muted-foreground">
                            Pricing, articles, and resources for HVAC owners.
                          </p>
                        </div>
                        <div className="flex flex-col justify-end text-sm">
                          {learnLinks.map((sub) => (
                            <NavigationMenuLink key={sub.title} asChild>
                              <Link
                                href={sub.href}
                                className="flex flex-row items-center justify-between rounded-md px-4 py-2 hover:bg-muted"
                              >
                                <span className="text-fc-brand">{sub.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/blog" className={triggerClass}>
                        Blog
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Col 2: centered brand (desktop) */}
          <div className="hidden justify-center lg:flex">
            <Logo
              href="/"
              size="lg"
              onDark={darkNav}
              priority
              className={cn(darkNav ? "focus:ring-offset-fc-navy-950" : "focus:ring-offset-white")}
            />
          </div>

          {/* Col 3: CTAs + mobile menu */}
          <div className="ml-auto flex shrink-0 items-center justify-end gap-2 sm:gap-4">
            <Link
              href={routes.owner.subscribe}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden text-sm font-medium lg:inline-flex",
                darkNav
                  ? "text-white/95 hover:bg-white/10 hover:text-white"
                  : "text-fc-brand hover:text-fc-accent",
              )}
            >
              Pricing
            </Link>
            <div
              className={cn(
                "hidden h-6 w-px lg:block",
                darkNav ? "bg-white/25" : "bg-fc-border",
              )}
              aria-hidden
            />

            {userEmail ? (
              <Link
                href={routes.owner.home}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "hidden h-9 items-center justify-center gap-2 px-4 text-sm font-medium lg:inline-flex",
                  darkNav &&
                    "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    darkNav ? "bg-white/15 text-white" : "bg-fc-accent/15 text-fc-accent",
                  )}
                  aria-hidden
                >
                  {userEmail.slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[160px] truncate">Signed in</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "hidden h-9 items-center justify-center px-4 text-sm font-medium lg:inline-flex",
                  darkNav &&
                    "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Log in
              </Link>
            )}

            <Link
              href={userEmail ? routes.owner.home : routes.owner.subscribe}
              className={cn(
                buttonVariants(),
                "hidden h-9 px-5 text-sm font-semibold shadow-fc-sm lg:inline-flex",
                darkNav
                  ? "border-0 bg-fc-orange-500 text-fc-navy-950 hover:bg-fc-orange-600"
                  : "bg-fc-brand text-white hover:bg-fc-brand/90",
              )}
            >
              {userEmail ? "Go to dashboard" : "Start for $9"}
            </Link>

            <button
              type="button"
              data-mobile-nav-trigger
              onClick={() => setMobileOpen((o) => !o)}
              className={cn(
                "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 lg:hidden",
                darkNav
                  ? "text-white hover:bg-white/10 focus:ring-offset-fc-navy-950"
                  : "text-fc-brand hover:bg-fc-surface-muted",
              )}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mounted &&
        mobileOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[200] bg-fc-brand/20 backdrop-blur-sm lg:hidden"
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />
            <div
              id="mobile-nav-panel"
              ref={panelRef}
              className="fixed top-0 right-0 z-[210] h-full w-full max-w-[320px] overflow-y-auto border-l border-fc-border bg-white shadow-fc-lg lg:hidden"
              role="dialog"
              aria-label="Mobile menu"
            >
              <div className="flex flex-col gap-8 p-4 pt-20">
                {mobile.sections.map((section) => (
                  <div key={section.title} className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
                      {section.title}
                    </p>
                    <div className="flex flex-col gap-1">
                      {section.items.map(({ href, label }) => (
                        <Link
                          key={href + label}
                          href={href}
                          prefetch={false}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-fc-brand hover:bg-fc-surface-muted"
                          onClick={() => scheduleCloseMobileMenu(setMobileOpen)}
                        >
                          {label}
                          <MoveRight className="h-4 w-4 text-fc-muted" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-2 border-t border-fc-border pt-6">
                  {mobile.auth.map(({ href, label, ...rest }) =>
                    "primary" in rest && rest.primary ? (
                      <Link
                        key={href}
                        href={href}
                        prefetch={false}
                        onClick={() => scheduleCloseMobileMenu(setMobileOpen)}
                        className={cn(
                          buttonVariants(),
                          "h-11 w-full justify-center bg-fc-brand text-white hover:bg-fc-brand/90",
                        )}
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        key={href}
                        href={href}
                        prefetch={false}
                        onClick={() => scheduleCloseMobileMenu(setMobileOpen)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-11 w-full justify-center border-fc-border",
                        )}
                      >
                        {label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
