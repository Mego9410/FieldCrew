"use client";

import Link from "next/link";
import { ReactNode } from "react";

export interface InsightCardProps {
  title: string;
  href: string;
  children: ReactNode;
  footerLink?: {
    label: string;
    href: string;
  };
}

export function InsightCard({ title, href, children, footerLink }: InsightCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-fc-border bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fc-brand">{title}</h2>
        {footerLink && (
          <span className="text-xs font-medium text-fc-accent opacity-0 transition-opacity group-hover:opacity-100">
            {footerLink.label} →
          </span>
        )}
      </div>
      <div className="h-48">{children}</div>
    </Link>
  );
}
