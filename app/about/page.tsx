import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About FieldCrew",
  description: "Learn what FieldCrew is building for HVAC owners and operations teams.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <section className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
                About FieldCrew
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
                The problem we are solving for HVAC owners
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                HVAC teams often have the work, the demand, and the people - but still lose margin quietly through labour leakage.
                We built FieldCrew to make that leakage visible and fixable.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:py-14 lg:px-8">
          <article className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="font-display text-2xl font-bold text-fc-brand">Why this problem exists</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  Most businesses do not lose profit in one obvious event. It disappears gradually:
                  jobs run over estimated labour, overtime is used to recover schedule, and leaders
                  only see the full impact after payroll has already landed.
                </p>
                <p>
                  The core issue is visibility. Owners can see activity, but they cannot easily see
                  which jobs, workflows, and labour patterns are driving margin down week after week.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-fc-brand">What we are doing to solve it</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  FieldCrew connects job execution and labour signals into one operating view so you can
                  spot where profit is leaking first, not last.
                </p>
                <p>
                  Instead of generic reporting, we focus on practical weekly decisions: where estimate drift
                  is happening, where overtime pressure is forming, and where recovery actions will have the
                  biggest financial impact.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-fc-brand">How we work with customers</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  We start with your current workflow, establish a baseline labour leak estimate, and then
                  help your team run a repeatable review cadence that improves margin over time.
                </p>
                <p>
                  The goal is simple: clearer control of labour spend, better execution decisions, and stronger
                  confidence in where profit is gained or lost.
                </p>
              </div>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">In this page</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#main" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    Why this problem exists
                  </a>
                </li>
                <li>
                  <a href="#main" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    What we are doing to solve it
                  </a>
                </li>
                <li>
                  <a href="#main" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    How we work with customers
                  </a>
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-fc-border bg-fc-brand p-6">
              <h2 className="font-display text-lg font-bold text-white">See it on your numbers</h2>
              <p className="mt-2 text-sm text-slate-300">
                Estimate your current labour leak and review a practical recovery path.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={routes.public.profitLeak}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Try calculator
                </Link>
                <Link
                  href={routes.public.sampleReport}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  View sample report
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
