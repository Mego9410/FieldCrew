"use client";

import { useState, useEffect } from "react";
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

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLg) setSidebarOpen(false);
  }, [isLg]);

  return (
    <div className="flex h-screen overflow-hidden bg-fc-app-surface p-2 gap-0 lg:p-4 lg:gap-4">
      {/* Backdrop when drawer is open on mobile */}
      {sidebarOpen && !isLg && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-fc-brand/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
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
          onNavigate={() => setSidebarOpen(false)}
          showCloseButton={!isLg}
        />
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col min-w-0 lg:z-auto">
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={!isLg}
        />
        <main className="min-h-0 flex-1 overflow-auto bg-fc-page">
          {children}
        </main>
      </div>
    </div>
  );
}
