import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact — FieldCrew",
  description: "Contact FieldCrew for sales, support, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <section className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
                Resources
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
                Contact FieldCrew
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                Tell us what you need and we will route your request to the right team. No calls
                required.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-10 lg:col-span-2">
            <section id="contact-form">
              <h2 className="font-display text-2xl font-bold text-fc-brand">Send us a message</h2>
              <p className="mt-3 text-fc-muted">
                Share your context and goals so we can respond with concrete next steps. The more
                specific your message, the faster we can help.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </section>

            <section id="what-to-include">
              <h2 className="font-display text-2xl font-bold text-fc-brand">What to include</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Current workflow and where the blocker appears.</li>
                <li>What outcome you expected versus what happened.</li>
                <li>Any links, screenshots, or report names tied to the issue.</li>
              </ul>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#contact-form"
                    className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                  >
                    Send us a message
                  </a>
                </li>
                <li>
                  <a
                    href="#what-to-include"
                    className="text-sm font-medium text-fc-brand hover:text-fc-accent"
                  >
                    What to include
                  </a>
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-fc-border bg-fc-brand p-6">
              <h2 className="font-display text-lg font-bold text-white">Need a faster path?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Most setup and usage questions are answered in docs and support guides.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={routes.public.docs}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Open docs
                </Link>
                <Link
                  href={routes.public.support}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  View support
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
