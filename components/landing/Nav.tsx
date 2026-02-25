"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const mobileNavLinks = [
  { href: "#features", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "/login", label: "Log in" },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
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

  const linkClass =
    "block min-h-[44px] min-w-[44px] cursor-pointer items-center rounded-md px-4 py-3 text-base font-medium text-fc-brand transition-colors hover:bg-fc-surface-muted hover:text-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 flex";

  return (
    <header className="sticky top-0 z-50 border-b border-fc-border bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/95">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-xl font-bold text-fc-brand transition-colors duration-200 hover:text-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center"
        >
          FieldCrew
        </Link>

        {/* Desktop nav: visible from sm up */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            Product
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-fc-muted transition-colors duration-200 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            Log in
          </Link>
          <Link
            href="#pricing"
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md bg-fc-brand px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 shadow-fc-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile: hamburger only */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            data-mobile-nav-trigger
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-fc-brand/20 backdrop-blur-sm sm:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            ref={panelRef}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[280px] border-l border-fc-border bg-white shadow-fc-lg sm:hidden"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col gap-1 p-4 pt-16">
              {mobileNavLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md bg-fc-brand px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-fc-brand/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
