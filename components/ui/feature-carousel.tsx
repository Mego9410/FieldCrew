"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeatureCarouselItem = {
  id: string;
  label: string;
  title: string;
};

type FeatureCarouselProps = {
  items: FeatureCarouselItem[];
  /** Auto-advance; disabled when reduced-motion is on or there is only one slide */
  autoPlayIntervalMs?: number;
  className?: string;
};

/**
 * Text-first feature carousel (cult-ui–style flow). Registry install from 21st.dev
 * is often mangled; this matches the pattern with framer-motion + FieldCrew tokens.
 */
export function FeatureCarousel({
  items,
  autoPlayIntervalMs = 5200,
  className,
}: FeatureCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const n = items.length;
  const safeIndex = n === 0 ? 0 : index % n;
  const go = useCallback(
    (delta: number) => {
      if (n === 0) return;
      setIndex((i) => (i + delta + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (reduceMotion || paused || n < 2) return;
    timerRef.current = setTimeout(() => go(1), autoPlayIntervalMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [safeIndex, paused, reduceMotion, n, autoPlayIntervalMs, go]);

  if (n === 0) return null;

  const current = items[safeIndex]!;

  return (
    <div
      className={cn("mx-auto w-full max-w-3xl", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative min-h-[12.5rem] overflow-hidden rounded-2xl border border-fc-border bg-white px-6 py-7 shadow-fc-md ring-1 ring-slate-200/70 sm:min-h-[11rem] sm:px-8 sm:py-9 md:px-10 md:py-10",
          "before:pointer-events-none before:absolute before:inset-y-6 before:left-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-fc-accent before:to-amber-500",
        )}
      >
        <div className="relative z-[1] pl-4 sm:pl-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={
                reduceMotion ? false : { opacity: 0, y: 14 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{
                duration: reduceMotion ? 0 : 0.32,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-fc-accent">
                {current.label}
              </p>
              <p className="mt-4 hyphens-none break-normal text-xl font-semibold leading-snug text-fc-brand sm:text-2xl fc-body-air">
                {current.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-[1] mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-fc-border/80 pt-6 sm:mt-10 sm:pt-7">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-fc-border bg-fc-surface-muted text-fc-brand transition-colors hover:border-fc-accent/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div
            className="flex flex-1 flex-wrap justify-center gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Carousel steps"
          >
            {items.map((item, i) => {
              const active = i === safeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${item.label}: ${item.title}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2",
                    active
                      ? "w-10 bg-fc-accent"
                      : "w-2.5 bg-fc-border hover:bg-fc-muted/50",
                  )}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-fc-border bg-fc-surface-muted text-fc-brand transition-colors hover:border-fc-accent/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            aria-label="Next step"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
