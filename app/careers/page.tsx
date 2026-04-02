import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Careers — FieldCrew",
  description: "Careers at FieldCrew.",
};

export default function CareersPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <section className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
                Careers
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
                Build practical software for real operations teams
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                FieldCrew exists to help HVAC owners run stronger businesses with clearer labor and job visibility.
                We are looking for people who care about useful products and measurable customer outcomes.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-10 lg:col-span-2">
            <section id="what-matters">
              <h2 className="font-display text-2xl font-bold text-fc-brand">What matters on this team</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  We are product-minded and operations-focused. We do not optimize for feature volume.
                  We optimize for whether customers can make better weekly decisions because of what we build.
                </p>
                <p>
                  Strong communication, clear ownership, and practical execution matter more than polished theory.
                  We value people who can simplify complexity and deliver outcomes that are easy for teams to use.
                </p>
              </div>
            </section>

            <section id="how-we-hire">
              <h2 className="font-display text-2xl font-bold text-fc-brand">How we hire</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  Our hiring process is straightforward and role-specific. We start with a practical conversation,
                  then move into a focused assessment that reflects the actual work, followed by a final discussion
                  with direct collaborators.
                </p>
                <p>
                  We care about signal over ceremony. You should leave each step with a clear understanding of the
                  role, expectations, and how success is measured.
                </p>
              </div>
            </section>

            <section id="openings">
              <h2 className="font-display text-2xl font-bold text-fc-brand">Current openings and interest</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  We do not always publish every role publicly. If your background aligns with product, design,
                  engineering, or customer success in operations software, we still want to hear from you.
                </p>
                <p>
                  Share your experience and the kind of problems you like solving. We review every inbound
                  application with role fit and timing in mind.
                </p>
              </div>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#what-matters" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    What matters on this team
                  </a>
                </li>
                <li>
                  <a href="#how-we-hire" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    How we hire
                  </a>
                </li>
                <li>
                  <a href="#openings" className="text-sm font-medium text-fc-brand hover:text-fc-accent">
                    Current openings and interest
                  </a>
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-fc-border bg-fc-brand p-6">
              <h2 className="font-display text-lg font-bold text-white">Interested in joining us?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Share your background and we will keep you in mind for current and upcoming roles.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={routes.public.contact}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Contact our team
                </Link>
                <Link
                  href={routes.public.about}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Learn about us
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
