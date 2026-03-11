"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionRevealDefaults, cardRevealDefaults, LEGEND_EASE } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export function useSectionReveal<T extends HTMLElement>(options?: Partial<typeof sectionRevealDefaults>) {
  const ref = useRef<T>(null);
  const opts = { ...sectionRevealDefaults, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: opts.y, opacity: opts.opacity },
        {
          y: 0,
          opacity: 1,
          duration: opts.duration,
          ease: LEGEND_EASE as unknown as gsap.EaseString,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [opts.y, opts.opacity, opts.duration]);

  return ref;
}

export function useStaggerReveal<T extends HTMLElement>(
  selector: string,
  options?: Partial<typeof sectionRevealDefaults> & { stagger?: number }
) {
  const ref = useRef<T>(null);
  const stagger = options?.stagger ?? sectionRevealDefaults.stagger;
  const opts = { ...sectionRevealDefaults, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(selector);
      gsap.fromTo(
        targets,
        { y: opts.y, opacity: opts.opacity },
        {
          y: 0,
          opacity: 1,
          duration: opts.duration,
          ease: LEGEND_EASE as unknown as gsap.EaseString,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [selector, opts.y, opts.opacity, opts.duration, stagger]);

  return ref;
}

export function useCardReveal<T extends HTMLElement>(options?: Partial<typeof cardRevealDefaults>) {
  const ref = useRef<T>(null);
  const opts = { ...cardRevealDefaults, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: opts.scale, opacity: opts.opacity, rotation: opts.rotation },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: opts.duration,
          ease: LEGEND_EASE as unknown as gsap.EaseString,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 12%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [opts.scale, opts.opacity, opts.rotation, opts.duration]);

  return ref;
}
