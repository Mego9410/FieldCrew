"use client";

import { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes } from "react";

export type CardVariant = "default" | "muted" | "highlight" | "warning" | "critical";

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-fc-surface text-fc-brand shadow-fc-sm hover:shadow-fc-md border border-fc-border-subtle",
  muted:
    "bg-fc-surface-muted text-fc-brand border border-fc-border-subtle",
  highlight:
    "bg-fc-nav-sidebar text-white border-l-4 border-fc-accent",
  warning:
    "bg-fc-warning-bg text-fc-brand border border-orange-200/60 shadow-fc-sm hover:shadow-fc-md",
  critical:
    "bg-fc-danger-bg text-fc-brand border border-red-200/60 shadow-fc-sm hover:shadow-fc-md",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  as?: "div" | "section" | "article";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", as: As = "div", className = "", ...props }, ref) => {
    return (
      <As
        ref={ref}
        className={`border border-fc-border p-4 transition-colors ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface CardLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  href: string;
  variant?: CardVariant;
  className?: string;
  children?: React.ReactNode;
}

export function CardLink({
  variant = "default",
  className = "",
  href,
  children,
  ...props
}: CardLinkProps) {
  return (
    <a
      href={href}
      className={`group block p-4 transition-colors ${variantStyles[variant]} border border-fc-border ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
