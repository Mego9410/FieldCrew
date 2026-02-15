"use client";

import { type HTMLAttributes, type TdHTMLAttributes } from "react";

export function Table({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={`w-full text-left text-sm text-fc-brand ${className}`}
      {...props}
    />
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-fc-border-subtle last:border-0 hover:bg-fc-surface-muted/40 ${className}`}
      {...props}
    />
  );
}

export function TableHead({
  className = "",
  align = "left",
  ...props
}: HTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" }) {
  return (
    <th
      className={`bg-fc-surface-muted px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-fc-muted ${align === "right" ? "text-right" : ""} ${className}`}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  align,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" }) {
  return (
    <td
      className={`px-3 py-2 text-sm ${align === "right" ? "text-right" : ""} ${className}`}
      {...props}
    />
  );
}

export function TableFooterRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-t-2 border-fc-border bg-fc-surface-muted font-bold ${className}`}
      {...props}
    />
  );
}
