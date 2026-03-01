import React from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  className?: string;
}

export function FAQ({ items, className = "" }: FAQProps) {
  if (items.length === 0) return null;
  return (
    <section
      className={`border-t border-fc-border pt-8 mt-10 ${className}`}
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="font-display text-xl font-bold text-fc-brand mb-6"
      >
        Frequently asked questions
      </h2>
      <dl className="space-y-6">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <dt className="font-semibold text-fc-brand">{item.q}</dt>
            <dd className="mt-2 text-fc-muted text-sm">{item.a}</dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

export type { FAQItem };
