"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { routes } from "@/lib/routes";

function getNavLinks(isHome: boolean) {
  return [
    { href: isHome ? "#how-it-works" : "/#how-it-works", label: "Product" },
    { href: "/blog", label: "Blog" },
    { href: isHome ? "#pricing" : "/#pricing", label: "Pricing" },
    { href: "/login", label: "Log in" },
  ];
}

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const navBg = scrolled
    ? "bg-[rgba(10,10,10,0.85)] border-[rgba(255,255,255,0.06)] backdrop-blur-[20px]"
    : "bg-transparent border-transparent";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ease-[var(--legend-ease)] ${navBg}`}
    >
      <nav
        className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-4 md:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-legend-display text-xl font-semibold tracking-tight text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] min-h-[44px] min-w-[44px] inline-flex items-center"
        >
          FieldCrew
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {getNavLinks(pathname === "/").map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="min-h-[44px] min-w-[44px] cursor-pointer items-center rounded-lg px-4 py-2.5 text-sm font-medium text-[#a1a1aa] transition-colors hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] inline-flex"
            >
              {label}
            </Link>
          ))}
          <Link
            href={routes.owner.subscribe}
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 ease-[var(--legend-ease)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          data-mobile-nav-trigger
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/30 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav-panel"
              ref={panelRef}
              className="fixed top-0 right-0 z-50 flex h-full w-full max-w-[280px] flex-col gap-1 border-l border-[rgba(255,255,255,0.08)] bg-[#111111] p-6 pt-20 md:hidden"
              role="dialog"
              aria-label="Mobile menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {getNavLinks(pathname === "/").map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="min-h-[44px] cursor-pointer items-center rounded-lg px-4 py-3 text-base font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white inline-flex"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={routes.owner.subscribe}
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-[#0a0a0a]"
              >
                Get Started
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
