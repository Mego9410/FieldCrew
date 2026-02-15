"use client";

interface SettingsSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSectionCard({
  title,
  description,
  children,
}: SettingsSectionCardProps) {
  return (
    <div className="border border-fc-border bg-fc-surface p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-fc-muted">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-fc-muted mb-4">{description}</p>
      )}
      <div className={description ? "" : "mt-4"}>{children}</div>
    </div>
  );
}
