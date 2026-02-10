import Link from "next/link";
import { HeroDecor } from "./HeroDecor";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-fc-border bg-gradient-to-b from-zinc-100 to-fc-surface">
      <HeroDecor />
      {/* Subtle industrial grid */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, #d4d4d8 1px, transparent 1px),
            linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Subtle grain texture */}
      <div className="hero-noise" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-8 lg:justify-between">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-md lg:text-left">
            <p className="hero-reveal hero-reveal-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-fc-accent">
              Payroll intelligence for HVAC
            </p>
            <h1 className="hero-reveal hero-reveal-2 mt-3 border-l-4 border-fc-accent pl-4 font-display text-4xl font-extrabold tracking-tighter text-fc-brand sm:text-5xl lg:pl-5 lg:text-5xl">
              Which jobs are destroying your margins?
            </h1>
            <div className="hero-reveal hero-reveal-3 mx-auto mt-4 h-1 w-16 rounded-full bg-fc-accent lg:mx-0" aria-hidden />
            <p className="hero-reveal hero-reveal-4 mt-6 text-lg leading-relaxed text-fc-muted sm:text-xl">
              FieldCrew is job-based payroll intelligence for small US HVAC crews.
              See labour cost per job, stop payroll leakage, and run payroll with
              job context—not just hours.
            </p>
            <div className="hero-reveal hero-reveal-5 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="#pricing"
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-fc-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-fc-accent/90 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                Start free trial
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-fc-border bg-white px-6 py-3 text-base font-medium text-fc-brand transition-all duration-200 hover:-translate-y-0.5 hover:border-fc-muted hover:bg-fc-surface focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="hero-reveal hero-reveal-6 relative lg:ml-auto lg:flex-shrink-0 lg:self-end lg:-mr-4 xl:-mr-8">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
