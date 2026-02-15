"use client";

import { ReactNode } from "react";
import { ChartCard } from "@/components/charts";

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
    <ChartCard title={title} href={href} footerLink={footerLink}>
      {children}
    </ChartCard>
  );
}
