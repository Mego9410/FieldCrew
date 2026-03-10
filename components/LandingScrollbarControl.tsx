"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Hides the main page scrollbar when on the marketing home page (cleaner look).
 */
export function LandingScrollbarControl() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isLanding) {
      document.documentElement.setAttribute("data-landing", "true");
      document.body.setAttribute("data-landing", "true");
    } else {
      document.documentElement.removeAttribute("data-landing");
      document.body.removeAttribute("data-landing");
    }
    return () => {
      document.documentElement.removeAttribute("data-landing");
      document.body.removeAttribute("data-landing");
    };
  }, [isLanding]);

  return null;
}
