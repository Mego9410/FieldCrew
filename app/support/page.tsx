import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";
import { BentoCard, PublicPageHero, PublicPageShell } from "@/components/landing/PublicPagePrimitives";

export const metadata: Metadata = {
  title: "Support — FieldCrew",
  description: "Get help with setup, billing, and day-to-day use of FieldCrew.",
};

export default function SupportPage() {
  return (
    <>
      <Nav />
      <PublicPageShell>
        <PublicPageHero
          eyebrow="Support"
          title="Help for onboarding and daily operations"
          description="Find the fastest path for setup questions, reporting interpretation, and account support without waiting on calls."
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-8 lg:col-span-2">
            <section id="issue-paths">
              <BentoCard>
                <h2 className="font-display text-xl font-bold text-fc-brand sm:text-2xl">
                  Best path by issue type
                </h2>
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
              </BentoCard>
            </section>

            <section id="expectations">
              <BentoCard>
                <h2 className="font-display text-xl font-bold text-fc-brand sm:text-2xl">
                  Support expectations
                </h2>
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
              </BentoCard>
            </section>

            <section id="self-serve">
              <BentoCard>
                <h2 className="font-display text-xl font-bold text-fc-brand sm:text-2xl">
                  Self-serve first workflow
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-fc-muted">
                  <li>Check the relevant docs guide for your role and task.</li>
                  <li>Use troubleshooting matrix if behavior looks incorrect.</li>
                  <li>Escalate with detailed context if issue persists.</li>
                </ol>
              </BentoCard>
            </section>
          </article>

          <aside className="space-y-6">
            <BentoCard as="div">
              <h2 className="font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="mt-4 space-y-3">
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
            </BentoCard>

            <div className="rounded-2xl border border-fc-navy-800 bg-fc-navy-950 p-6 shadow-fc-panel">
              <h2 className="font-display text-lg font-bold text-white">Need help now?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Use docs for quick answers or contact support with full context for faster resolution.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={routes.public.docs}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-fc-orange-500 px-4 py-2 text-sm font-semibold text-fc-navy-950 hover:bg-fc-orange-600"
                >
                  Open docs
                </Link>
                <Link
                  href={routes.public.contact}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </PublicPageShell>
      <Footer />
    </>
  );
}
