"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";

const baseStyles =
  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-fc-accent text-white hover:bg-fc-accent-dark focus:ring-fc-accent",
  secondary:
    "border border-fc-border bg-fc-surface text-fc-brand hover:bg-fc-surface-muted focus:ring-fc-muted",
  ghost:
    "text-fc-brand hover:bg-fc-surface-muted focus:ring-fc-muted",
  destructive:
    "bg-fc-danger-bg text-fc-danger border border-red-200 hover:bg-red-100 focus:ring-fc-danger",
  outline:
    "border border-fc-border bg-transparent text-fc-brand hover:bg-fc-surface-muted focus:ring-fc-accent",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
