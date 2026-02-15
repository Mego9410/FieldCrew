"use client";

import { type HTMLAttributes } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-fc-success-bg text-emerald-800",
  warning: "bg-fc-warning-bg text-amber-800",
  danger: "bg-fc-danger-bg text-red-800",
  neutral: "bg-fc-neutral-bg text-fc-neutral",
  info: "bg-fc-info-bg text-fc-info",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
