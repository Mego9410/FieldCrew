import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ShapeLandingHeroBackground } from "@/components/ui/shape-landing-hero";

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="min-h-screen border-b border-fc-border bg-fc-page">
      {children}
    </main>
  );
}

type SectionBandVariant = "white" | "muted" | "dark";

export function SectionBand({
  children,
  className,
  variant = "white",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  variant?: SectionBandVariant;
  id?: string;
  labelledBy?: string;
}) {
  const base = "relative overflow-hidden border-b";
  const byVariant: Record<SectionBandVariant, string> = {
    white: "border-fc-border bg-white",
    muted: "border-fc-border bg-gradient-to-b from-slate-50 via-white to-slate-50/60",
    dark: "border-fc-navy-800 bg-fc-navy-950 text-white",
  };

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(base, byVariant[variant], className)}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleId,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
  tone?: "light" | "dark";
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const eyebrowTone = tone === "dark" ? "text-fc-orange-500" : "text-fc-accent";
  const titleTone = tone === "dark" ? "text-white" : "text-fc-brand";
  const descTone = tone === "dark" ? "text-slate-300" : "text-fc-muted";

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {eyebrow ? (
        <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", eyebrowTone)}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          "font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
          titleTone,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("max-w-2xl text-base leading-relaxed sm:text-lg", descTone)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function RailHeader({
  eyebrow,
  title,
  description,
  titleId,
  tone = "light",
  className,
  aside,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  titleId?: string;
  tone?: "light" | "dark";
  className?: string;
  aside?: ReactNode;
}) {
  const eyebrowTone = tone === "dark" ? "text-fc-orange-500" : "text-fc-accent";
  const titleTone = tone === "dark" ? "text-white" : "text-fc-brand";
  const descTone = tone === "dark" ? "text-slate-300" : "text-fc-muted";

  return (
    <div className={cn("min-w-0 max-w-xl", className)}>
      {eyebrow ? (
        <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", eyebrowTone)}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          "mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
          titleTone,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", descTone)}>
          {description}
        </p>
      ) : null}
      {aside ? <div className="mt-7">{aside}</div> : null}
    </div>
  );
}

export function SplitBand({
  variant = "muted",
  labelledBy,
  id,
  className,
  left,
  right,
}: {
  variant?: SectionBandVariant;
  labelledBy?: string;
  id?: string;
  className?: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <SectionBand variant={variant} labelledBy={labelledBy} id={id} className={className}>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-12 xl:gap-14">
          <div className="min-w-0">{left}</div>
          <div className="min-w-0 lg:justify-self-end lg:w-full lg:max-w-[640px]">{right}</div>
        </div>
      </div>
    </SectionBand>
  );
}

export function BentoCard({
  children,
  className,
  as: As = "article",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "li";
  interactive?: boolean;
}) {
  return (
    <As
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-fc-border bg-white/80 shadow-fc-sm backdrop-blur-sm",
        "ring-1 ring-black/[0.02]",
        interactive &&
          "cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:border-fc-border hover:shadow-fc-md",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(800px circle at var(--x,50%) var(--y,50%), rgba(249,115,22,0.10), transparent 45%)",
        }}
      />
      <div className="relative p-6 sm:p-7">{children}</div>
    </As>
  );
}

export function MockAppFrame({
  title = "FieldCrew",
  subtitle,
  children,
  className,
  headerRight,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-[0_30px_80px_-35px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.10] backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.05] px-5 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/16" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-wide text-white/85">
              {title}
            </p>
            {subtitle ? (
              <p className="truncate text-[11px] text-white/55">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </div>
      <div className="relative bg-gradient-to-b from-white/[0.04] via-transparent to-transparent">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden>
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fc-accent blur-3xl" />
          <div className="absolute -right-28 bottom-[-5rem] h-72 w-72 rounded-full bg-sky-400 blur-3xl" />
        </div>
        <div className="relative p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function LogoStrip({
  label = "Used by busy owner-operators",
  items,
  className,
}: {
  label?: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((name) => (
          <div
            key={name}
            className="flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-white/70"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublicDarkHero({
  eyebrow,
  title,
  description,
  rightSlot,
  ctaSlot,
  bottomSlot,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
  ctaSlot?: ReactNode;
  bottomSlot?: ReactNode;
  className?: string;
}) {
  return (
    <SectionBand variant="dark" className={cn("py-14 sm:py-20", className)}>
      <ShapeLandingHeroBackground reduceMotion={false} className="opacity-70" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 15%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(ellipse 110% 90% at 50% 100%, rgba(3,7,18,0.9) 0%, transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 hero-noise" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              tone="dark"
              className="max-w-xl"
            />
            {ctaSlot ? <div className="mt-7 flex flex-wrap gap-3">{ctaSlot}</div> : null}
            {bottomSlot ? <div className="mt-6">{bottomSlot}</div> : null}
          </div>
          {rightSlot ? <div className="min-w-0">{rightSlot}</div> : null}
        </div>
      </div>
    </SectionBand>
  );
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** Merges with default padding; use to tighten spacing (e.g. calculator pages). */
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-b border-fc-border bg-gradient-to-b from-slate-100/95 via-white to-slate-50/40 py-12 sm:py-16 lg:py-20",
        className,
      )}
    >
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
    <SectionBand variant="white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <SectionHeader title={title} description={description} />
        <div className="mt-8">{children}</div>
      </div>
    </SectionBand>
  );
}

export function FeatureGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <BentoCard key={item}>
          <p className="text-sm font-semibold text-fc-brand">{item}</p>
        </BentoCard>
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

