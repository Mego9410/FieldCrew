"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/** Delay before backdrop can close the drawer (avoids same-tap closing on touch) */
const BACKDROP_READY_MS = 350;

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backdropReady, setBackdropReady] = useState(false);
  const prevIsLgRef = useRef(isLg);

  useEffect(() => {
    if (isLg && !prevIsLgRef.current) setSidebarOpen(false);
    prevIsLgRef.current = isLg;
  }, [isLg]);

  useEffect(() => {
    if (!sidebarOpen || isLg) {
      setBackdropReady(false);
      return;
    }
    const t = setTimeout(() => setBackdropReady(true), BACKDROP_READY_MS);
    return () => clearTimeout(t);
  }, [sidebarOpen, isLg]);

  const handleOpenMenu = () => setSidebarOpen(true);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const handleBackdropClick = () => {
    if (!backdropReady) return;
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-[100dvh] overflow-hidden bg-fc-app-surface p-2 gap-0 lg:p-4 lg:gap-4">
      {sidebarOpen && !isLg && (
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-fc-brand/20 backdrop-blur-sm lg:hidden ${!backdropReady ? "pointer-events-none" : ""}`}
          onClick={handleBackdropClick}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full w-56 shrink-0 flex-col
          transform transition-transform duration-200 ease-out
          lg:relative lg:left-auto lg:inset-auto lg:translate-x-0 lg:transition-none lg:pointer-events-auto
          ${sidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none lg:translate-x-0"}
        `}
        aria-label="Admin navigation"
        aria-hidden={!isLg && !sidebarOpen}
      >
        <AdminSidebar onNavigate={handleCloseSidebar} showCloseButton={!isLg} />
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col min-w-0 lg:z-auto">
        <AdminHeader onMenuClick={handleOpenMenu} showMenuButton={!isLg} />
        <main className="min-h-0 flex-1 overflow-auto bg-fc-page">{children}</main>
      </div>
    </div>
  );
}

