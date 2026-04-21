"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { CompanyTourV1 } from "@/lib/entities";
import { SetupChecklist, type TutorialCompletion } from "@/components/tutorial/SetupChecklist";
import { GuidedTour } from "@/components/tutorial/GuidedTour";

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

export function AppLayoutClient({
  children,
  readOnlyMode = false,
  tutorial,
}: {
  children: React.ReactNode;
  readOnlyMode?: boolean;
  tutorial?:
    | {
        companyId: string;
        tour: CompanyTourV1;
        completion: TutorialCompletion;
      }
    | undefined;
}) {
  const isTabletWide = useMediaQuery("(min-width: 834px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isDocked = isLg || isTabletWide;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backdropReady, setBackdropReady] = useState(false);
  const prevDockedRef = useRef(isDocked);

  const [tour, setTour] = useState<CompanyTourV1 | null>(tutorial?.tour ?? null);
  const [completion, setCompletion] = useState<TutorialCompletion | null>(
    tutorial?.completion ?? null
  );
  const [checklistOpen, setChecklistOpen] = useState(() => {
    if (!tutorial?.tour) return false;
    const t = tutorial.tour;
    if (t.status !== "active") return false;
    const completion = tutorial.completion;
    const doneCount = Object.values(completion).filter(Boolean).length;
    return doneCount < Object.values(completion).length;
  });

  // Only close when actually resizing up to docked layout (sidebar transitions false -> true), not on every change.
  useEffect(() => {
    if (isDocked && !prevDockedRef.current) {
      setSidebarOpen(false);
    }
    prevDockedRef.current = isDocked;
  }, [isDocked]);

  // Allow backdrop to close only after a short delay so the opening tap doesn't close it
  useEffect(() => {
    if (!sidebarOpen || isDocked) {
      setBackdropReady(false);
      return;
    }
    const t = setTimeout(() => setBackdropReady(true), BACKDROP_READY_MS);
    return () => clearTimeout(t);
  }, [sidebarOpen, isDocked]);

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

  const updateProgress = useCallback(async (body: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/tutorial/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { tour?: CompanyTourV1 | null };
      if (data?.tour) setTour(data.tour);

      const status = await fetch("/api/tutorial/status").then((r) => (r.ok ? r.json() : null));
      if (status?.tour) setTour(status.tour as CompanyTourV1);
      if (status?.completion) setCompletion(status.completion as TutorialCompletion);
    } catch {
      // ignore
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await fetch("/api/tutorial/status").then((r) => (r.ok ? r.json() : null));
      if (status?.tour) setTour(status.tour as CompanyTourV1);
      if (status?.completion) setCompletion(status.completion as TutorialCompletion);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!tutorial) return;
    const handler = () => {
      void refreshStatus();
    };
    window.addEventListener("fc:tutorial:refresh", handler as EventListener);
    return () => window.removeEventListener("fc:tutorial:refresh", handler as EventListener);
  }, [tutorial, refreshStatus]);

  const allCompleted = completion ? Object.values(completion).every(Boolean) : false;

  const showResumeButton =
    tour != null && tour.status !== "completed" && !checklistOpen;

  useEffect(() => {
    if (!tutorial || !tour || tour.status === "completed") return;
    if (!allCompleted) return;
    void updateProgress({ event: "complete" });
    setChecklistOpen(false);
  }, [tutorial, tour, allCompleted, updateProgress]);

  return (
    <div className="flex min-h-[100dvh] overflow-hidden bg-fc-app-surface p-2 gap-0 lg:p-4 lg:gap-4">
      {/* Backdrop: only interactive after BACKDROP_READY_MS so opening tap doesn't close */}
      {sidebarOpen && !isDocked && (
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
          ${isDocked ? "relative left-auto inset-auto translate-x-0 transition-none pointer-events-auto" : ""}
          ${
            sidebarOpen || isDocked
              ? "translate-x-0 pointer-events-auto"
              : "-translate-x-full pointer-events-none"
          }
        `}
        aria-label="App navigation"
        aria-hidden={!isDocked && !sidebarOpen}
      >
        <AppSidebar
          onNavigate={handleCloseSidebar}
          showCloseButton={!isDocked}
          readOnlyMode={readOnlyMode}
        />
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col min-w-0 lg:z-auto">
        <AppHeader
          onMenuClick={handleOpenMenu}
          showMenuButton={!isDocked}
          readOnlyMode={readOnlyMode}
        />
        {readOnlyMode && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
              <p className="font-medium">
                You’re signed in, but setup isn’t finished yet. You can look around, but edits are disabled.
              </p>
              <Link
                href={routes.owner.onboarding}
                className="inline-flex items-center rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-950"
              >
                Finish onboarding
              </Link>
            </div>
          </div>
        )}
        <main
          className="min-h-0 flex-1 overflow-auto bg-fc-page"
          data-readonly={readOnlyMode ? "true" : "false"}
        >
          {children}
        </main>
      </div>

      {tutorial && tour && tour.status !== "completed" && !allCompleted && (
        <SetupChecklist
          open={checklistOpen}
          tour={tour}
          completion={completion ?? tutorial.completion}
          onCloseAndDismiss={() => {
            setChecklistOpen(false);
            void updateProgress({ event: "dismiss" });
          }}
          onResumeTour={() => {
            setChecklistOpen(true);
            void updateProgress({ event: "resume" });
          }}
          onStartGuidedTour={() => {
            setChecklistOpen(true);
            void updateProgress({ event: "resume" });
            // Coachmarks hook-in (implemented in next todo).
            window.dispatchEvent(new CustomEvent("fc:tutorial:start"));
          }}
        />
      )}

      <GuidedTour
        enabled={Boolean(tutorial && tour && tour.status !== "completed")}
        onFinish={() => {
          // keep checklist open; just end overlay
        }}
      />

      {tutorial && tour && showResumeButton && (
        <button
          type="button"
          onClick={() => {
            setChecklistOpen(true);
            void updateProgress({ event: "resume" });
          }}
          className="fixed bottom-4 right-4 z-40 rounded-full border border-fc-border bg-fc-surface px-4 py-2 text-sm font-semibold text-fc-brand shadow-fc-md hover:bg-fc-surface-muted"
          aria-label="Continue setup"
        >
          Continue setup
        </button>
      )}
    </div>
  );
}
