"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { routes } from "@/lib/routes";

export function WorkerHeader({ token }: { token: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-worker-menu-trigger]")) setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const linkClass =
    "flex min-h-[44px] min-w-[44px] items-center px-4 text-sm font-medium text-fc-muted transition-colors hover:bg-fc-surface-muted hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-inset rounded-lg";

  return (
    <header className="border-b border-fc-border bg-fc-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={routes.worker.home(token)}
          className="font-display text-lg font-semibold text-fc-brand min-h-[44px] min-w-[44px] inline-flex items-center shrink-0"
        >
          FieldCrew — Worker
        </Link>

        {/* Desktop nav: visible from md up */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Link
            href={routes.worker.dashboard(token)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand rounded"
          >
            Dashboard
          </Link>
          <Link
            href={routes.worker.jobs(token)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand rounded"
          >
            Jobs
          </Link>
          <Link
            href={routes.worker.clock(token)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand rounded"
          >
            Clock
          </Link>
          <Link
            href={routes.public.home}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 text-sm font-medium text-fc-muted transition-colors hover:text-fc-brand rounded"
          >
            Back to site
          </Link>
        </nav>

        {/* Mobile: hamburger */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            data-worker-menu-trigger
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            aria-expanded={menuOpen}
            aria-controls="worker-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-fc-brand/20 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="worker-nav-panel"
            ref={panelRef}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[280px] border-l border-fc-border bg-white shadow-fc-lg md:hidden"
            role="dialog"
            aria-label="Worker menu"
          >
            <div className="flex flex-col gap-1 p-4 pt-20">
              <Link
                href={routes.worker.dashboard(token)}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href={routes.worker.jobs(token)}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href={routes.worker.clock(token)}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Clock
              </Link>
              <Link
                href={routes.public.home}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Back to site
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
