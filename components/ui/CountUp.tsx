"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  /** Target number (integer or float). For currency, pass number and use prefix/suffix. */
  value: number;
  /** Optional prefix e.g. "$" */
  prefix?: string;
  /** Optional suffix e.g. " hrs" or "/mo" */
  suffix?: string;
  /** Duration in seconds. Default 1.2 */
  duration?: number;
  /** Decimals for display. Default 0 */
  decimals?: number;
  /** Easing: linear or easeOut. Default easeOut */
  ease?: "linear" | "easeOut";
  className?: string;
  /** When true, start counting immediately (e.g. when tab is active). When undefined, count when in view. */
  trigger?: boolean;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  decimals = 0,
  ease = "easeOut",
  className,
  trigger,
}: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });
  const hasAnimated = useRef(false);

  const shouldRun = trigger !== undefined ? trigger : isInView;

  // When trigger-driven, reset when trigger goes false so it can re-run when tab is shown again
  useEffect(() => {
    if (trigger === false) hasAnimated.current = false;
  }, [trigger]);

  useEffect(() => {
    if (!shouldRun || hasAnimated.current) return;
    if (reducedMotion) {
      setDisplay(value);
      hasAnimated.current = true;
      return;
    }
    hasAnimated.current = true;
    const start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = ease === "easeOut" ? 1 - Math.pow(1 - t, 3) : t;
      const current = start + (value - start) * eased;
      setDisplay(current);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value, duration, ease, reducedMotion, shouldRun]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
