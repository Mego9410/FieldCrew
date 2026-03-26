import Link from "next/link";
import { ReactNode } from "react";

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="min-h-screen border-b border-fc-border bg-fc-page">
      {children}
    </main>
  );
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-fc-border bg-gradient-to-b from-slate-100/95 via-white to-slate-50/40 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-fc-accent">
          {eyebrow}
        </span>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fc-muted">{description}</p>
      </div>
    </section>
  );
}

export function PublicSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-fc-brand">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-fc-muted">{description}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

export function FeatureGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item} className="rounded-xl border border-fc-border bg-white p-5 shadow-fc-sm">
          <p className="text-fc-brand">{item}</p>
        </article>
      ))}
    </div>
  );
}

export function CTAButtons({
  primary,
  secondary,
}: {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={primary.href}
        className="inline-flex min-h-[44px] items-center rounded-md bg-fc-accent px-5 py-2.5 font-semibold text-white hover:bg-fc-accent-dark"
      >
        {primary.label}
      </Link>
      {secondary ? (
        <Link
          href={secondary.href}
          className="inline-flex min-h-[44px] items-center rounded-md border border-fc-border bg-white px-5 py-2.5 font-semibold text-fc-brand hover:bg-fc-surface-muted"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}

