"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";

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

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backdropReady, setBackdropReady] = useState(false);
  const prevIsLgRef = useRef(isLg);

  // Only close when actually resizing up to desktop (isLg transitions false -> true), not on every isLg
  useEffect(() => {
    if (isLg && !prevIsLgRef.current) {
      setSidebarOpen(false);
    }
    prevIsLgRef.current = isLg;
  }, [isLg]);

  // Allow backdrop to close only after a short delay so the opening tap doesn't close it
  useEffect(() => {
    if (!sidebarOpen || isLg) {
      setBackdropReady(false);
      return;
    }
    const t = setTimeout(() => setBackdropReady(true), BACKDROP_READY_MS);
    return () => clearTimeout(t);
  }, [sidebarOpen, isLg]);

  const handleOpenMenu = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleBackdropClick = () => {
    if (!backdropReady) return;
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-fc-app-surface p-2 gap-0 lg:p-4 lg:gap-4">
      {/* Backdrop: only interactive after BACKDROP_READY_MS so opening tap doesn't close */}
      {sidebarOpen && !isLg && (
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-fc-brand/20 backdrop-blur-sm lg:hidden ${!backdropReady ? "pointer-events-none" : ""}`}
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, in-flow on lg. pointer-events-none when closed so menu button stays clickable. */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full w-56 shrink-0 flex-col
          transform transition-transform duration-200 ease-out
          lg:relative lg:left-auto lg:inset-auto lg:translate-x-0 lg:transition-none lg:pointer-events-auto
          ${sidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none lg:translate-x-0"}
        `}
        aria-label="App navigation"
        aria-hidden={!isLg && !sidebarOpen}
      >
        <AppSidebar
          onNavigate={handleCloseSidebar}
          showCloseButton={!isLg}
        />
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col min-w-0 lg:z-auto">
        <AppHeader
          onMenuClick={handleOpenMenu}
          showMenuButton={!isLg}
        />
        <main className="min-h-0 flex-1 overflow-auto bg-fc-page">
          {children}
        </main>
      </div>
    </div>
  );
}
