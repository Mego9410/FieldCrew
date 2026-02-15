"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

interface SettingsPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsPageShell({
  title,
  description,
  children,
}: SettingsPageShellProps) {
  return (
    <div className="px-6 py-6 max-w-2xl">
      <Link
        href={routes.owner.settings}
        className="mb-4 inline-flex items-center gap-1 text-sm text-fc-muted hover:text-fc-accent transition-colors"
      >
        ← Back to settings
      </Link>
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">{title}</h1>
        <p className="mt-0.5 text-sm text-fc-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
