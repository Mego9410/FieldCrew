import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Support — FieldCrew",
  description: "Get help with setup, billing, and day-to-day use of FieldCrew.",
};

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <section className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
                Support
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
                Help for onboarding and daily operations
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                Use this page to find the fastest path for setup questions, reporting interpretation,
                and account support without waiting on calls.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-10 lg:col-span-2">
            <section id="issue-paths">
              <h2 className="font-display text-2xl font-bold text-fc-brand">Best path by issue type</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  For setup and workflow issues, start with Documentation first. Most onboarding
                  bottlenecks are solved fastest when teams follow the role-based guides step by step.
                </p>
                <p>
                  For product questions tied to specific pages or reports, use contact support and
                  include exact context: what you expected, what happened, and which route you were on.
                </p>
                <p>
                  For operational guidance, run your estimate and compare it against the sample report,
                  then document where your team is seeing variance before requesting help.
                </p>
              </div>
            </section>

            <section id="expectations">
              <h2 className="font-display text-2xl font-bold text-fc-brand">Support expectations</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  The clearest requests get the fastest answers. Include your company context,
                  workflow goal, and the relevant screen or report in question.
                </p>
                <p>
                  If you can share screenshots and timestamps, we can move directly into diagnosis
                  and corrective steps without back-and-forth clarification.
                </p>
              </div>
            </section>

            <section id="self-serve">
              <h2 className="font-display text-2xl font-bold text-fc-brand">Self-serve first workflow</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-fc-muted">
                <li>Check the relevant docs guide for your role and task.</li>
                <li>Use troubleshooting matrix if behavior looks incorrect.</li>
                <li>Escalate with detailed context if issue persists.</li>
              </ol>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#issue-paths" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    Best path by issue type
                  </a>
                </li>
                <li>
                  <a href="#expectations" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    Support expectations
                  </a>
                </li>
                <li>
                  <a href="#self-serve" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    Self-serve first workflow
                  </a>
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-fc-border bg-fc-brand p-6">
              <h2 className="font-display text-lg font-bold text-white">Need help now?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Use docs for quick answers or contact support with full context for faster resolution.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={routes.public.docs}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Open docs
                </Link>
                <Link
                  href={routes.public.contact}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Contact support
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
