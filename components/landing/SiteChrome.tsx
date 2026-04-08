"use client";

import type { ReactNode } from "react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--fc-bg-page)]">
      <Nav />
      <div className="flex min-h-[calc(100vh-var(--fc-nav-h,80px))] flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

