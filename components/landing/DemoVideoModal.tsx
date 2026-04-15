"use client";

import { useEffect, useRef } from "react";

function getVimeoId(): string {
  return (process.env.NEXT_PUBLIC_DEMO_VIMEO_ID ?? "").trim();
}

export function DemoVideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActiveRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const vimeoId = getVimeoId();
  const src = vimeoId
    ? `https://player.vimeo.com/video/${encodeURIComponent(
        vimeoId,
      )}?autoplay=1&title=0&byline=0&portrait=0`
    : "";

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const requestFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    // @ts-expect-error - older Safari types
    const fn: (() => Promise<void>) | undefined =
      el.requestFullscreen ??
      // @ts-expect-error - Safari
      el.webkitRequestFullscreen ??
      // @ts-expect-error - Firefox
      el.mozRequestFullScreen ??
      // @ts-expect-error - IE/Edge legacy
      el.msRequestFullscreen;
    if (fn) {
      try {
        await fn.call(el);
      } catch {
        // Ignore (often blocked without direct user gesture on some platforms)
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Demo video"
      onClick={handleOverlayClick}
    >
      <div
        ref={containerRef}
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-black/60 px-3 py-2 sm:px-4">
          <p className="text-sm font-semibold text-white/90">2‑minute demo</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestFullscreen}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-accent"
            >
              Full screen
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent"
              aria-label="Close"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {src ? (
            <iframe
              title="FieldCrew demo video"
              src={src}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Demo video is being linked.
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Set{" "}
                  <code className="font-mono text-white/85">
                    NEXT_PUBLIC_DEMO_VIMEO_ID
                  </code>{" "}
                  to show the video here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

