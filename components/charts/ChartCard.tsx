"use client";

import { type ReactNode } from "react";
import { CardLink } from "@/components/ui/Card";

export interface ChartCardProps {
  title: string;
  href: string;
  children: ReactNode;
  footerLink?: { label: string; href: string };
}

export function ChartCard({ title, href, children, footerLink }: ChartCardProps) {
  return (
    <CardLink href={href} variant="default" className="border border-fc-border p-4 hover:shadow-fc-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">{title}</h2>
        {footerLink && (
          <span className="text-[10px] font-semibold text-fc-accent opacity-0 group-hover:opacity-100">
            {footerLink.label} →
          </span>
        )}
      </div>
      <div className="h-44">{children}</div>
    </CardLink>
  );
}
