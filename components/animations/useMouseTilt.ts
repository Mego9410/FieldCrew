"use client";

import { useRef, useCallback, useEffect, type RefObject } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  easing?: string;
  scale?: number;
}

const defaultOptions: Required<TiltOptions> = {
  maxTilt: 12,
  perspective: 1000,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  scale: 1.02,
};

export function useMouseTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const opts = { ...defaultOptions, ...options };
  const frameRef = useRef<number>(0);
  const stateRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stateRef.current.targetX = y * opts.maxTilt;
      stateRef.current.targetY = -x * opts.maxTilt;
    },
    [opts.maxTilt]
  );

  const handleLeave = useCallback(() => {
    stateRef.current.targetX = 0;
    stateRef.current.targetY = 0;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMove, { passive: true });
    el.addEventListener("mouseleave", handleLeave);

    el.style.transition = "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)";
    function animate() {
      const current = ref.current;
      if (!current) return;
      const s = stateRef.current;
      s.x += (s.targetX - s.x) * 0.12;
      s.y += (s.targetY - s.y) * 0.12;
      current.style.transform = `perspective(${opts.perspective}px) rotateX(${s.x}deg) rotateY(${s.y}deg) scale3d(${opts.scale}, ${opts.scale}, ${opts.scale})`;
      frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frameRef.current);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [handleMove, handleLeave, opts.perspective, opts.scale]);

  return ref;
}

export function useMousePosition(): RefObject<{ x: number; y: number }> {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ref.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return ref;
}
