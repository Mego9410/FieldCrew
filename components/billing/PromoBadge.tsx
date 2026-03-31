"use client";

import { cn } from "@/lib/utils";

export function PromoBadge({
  children = "Launch offer",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-fc-orange-400/55 bg-fc-orange-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100",
        "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

