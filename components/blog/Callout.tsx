import type { ReactNode } from "react";

type CalloutVariant = "field-tip" | "key-takeaway" | "info";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantLabels: Record<CalloutVariant, string> = {
  "field-tip": "Field Tip",
  "key-takeaway": "Key takeaway",
  info: "Note",
};

export function Callout({
  variant = "field-tip",
  title,
  children,
}: CalloutProps) {
  const label = title ?? variantLabels[variant];
  return (
    <aside
      className="my-6 border-l-4 border-fc-accent bg-fc-surface-muted/80 p-4 rounded-r-md"
      role="note"
    >
      <p className="font-display text-sm font-bold text-fc-brand uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="text-fc-brand text-sm [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

/** Alias for use in MDX: <FieldTip>...</FieldTip> */
export function FieldTip({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Callout variant="field-tip" title={title}>
      {children}
    </Callout>
  );
}
