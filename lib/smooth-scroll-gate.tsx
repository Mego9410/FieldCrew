"use client";

/**
 * Smooth scroll (Lenis) is disabled — uses native browser scrolling.
 * Re-enable by wrapping children with SmoothScrollProvider when pathname === "/".
 */
export function SmoothScrollGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
