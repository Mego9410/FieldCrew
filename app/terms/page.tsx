import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms of Service — FieldCrew",
  description:
    "Terms of Service governing access to and use of the FieldCrew platform, website, and related services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen border-b border-fc-border bg-white">
        <section className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-fc-accent">
                Legal
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
                Terms of Service
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                These Terms govern access to and use of the FieldCrew platform, website, and related
                services.
              </p>
              <p className="mt-3 text-sm text-fc-muted">Effective date: 26 March 2026</p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-10 lg:col-span-2">
            <section id="who-we-are">
              <h2 className="font-display text-2xl font-bold text-fc-brand">1. Who we are</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  FieldCrew is a software platform that helps field service businesses manage
                  job-based labour, payroll insights, and operational performance.
                </p>
                <p>
                  <strong className="text-fc-brand">Legal entity:</strong> FieldCrew Ltd
                  <br />
                  <strong className="text-fc-brand">Registered address:</strong> [Insert address]
                  <br />
                  <strong className="text-fc-brand">Contact email:</strong>{" "}
                  <a
                    href="mailto:support@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    support@fieldcrew.app
                  </a>
                </p>
              </div>
            </section>

            <section id="acceptance">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                2. Acceptance of terms
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  By accessing or using FieldCrew, you agree to these Terms on behalf of yourself and
                  the business entity you represent.
                </p>
                <p>If you do not agree to these Terms, you must not use the service.</p>
                <p>
                  If you are using FieldCrew on behalf of an organization, you confirm that you have
                  the authority to bind that organization to these Terms.
                </p>
              </div>
            </section>

            <section id="services">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                3. Services and eligibility
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew provides a subscription-based software platform. To use the service:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>You must be at least 18 years old.</li>
                <li>You must be legally able to enter into a binding agreement.</li>
                <li>
                  You must use the service only for legitimate business purposes.
                </li>
              </ul>
              <p className="mt-4 text-fc-muted">
                You are responsible for ensuring your use of FieldCrew complies with all applicable
                laws, including payroll, employment, and data protection laws.
              </p>
            </section>

            <section id="accounts">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                4. Accounts and workspace administration
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Account owners and administrators control access to their workspace.</li>
                <li>You are responsible for maintaining the security of login credentials.</li>
                <li>You must notify us promptly of any unauthorized access.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                You are responsible for all activity that occurs within your account, including
                actions taken by invited users.
              </p>
            </section>

            <section id="customer-data">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                5. Customer data and responsibilities
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  You retain ownership of all data you submit to FieldCrew (&quot;Customer Data&quot;),
                  including:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Timesheets.</li>
                  <li>Worker records.</li>
                  <li>Payroll inputs.</li>
                  <li>Job and operational data.</li>
                </ul>
                <p>You are responsible for:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>The accuracy and legality of Customer Data.</li>
                  <li>Ensuring you have the right to collect and use that data.</li>
                </ul>
                <p>
                  FieldCrew processes Customer Data solely to provide and improve the service, in
                  accordance with these Terms and our Privacy Policy.
                </p>
              </div>
            </section>

            <section id="acceptable-use">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                6. Acceptable use
              </h2>
              <p className="mt-4 text-fc-muted">You must not:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Use the service for unlawful, fraudulent, or abusive purposes.</li>
                <li>Attempt to access systems, data, or accounts you are not authorized to use.</li>
                <li>Interfere with or disrupt the integrity or performance of the platform.</li>
                <li>Reverse engineer, copy, or replicate the service.</li>
                <li>Use the service to build a competing product.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                We may investigate and take appropriate action, including suspension, where misuse is
                suspected.
              </p>
            </section>

            <section id="billing">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                7. Subscription, billing, and renewals
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Paid features require an active subscription.</li>
                <li>Pricing, billing cycles, and plan details are provided at purchase.</li>
                <li>
                  You authorize FieldCrew and its payment providers to charge applicable fees and
                  taxes.
                </li>
              </ul>
              <p className="mt-4 text-fc-muted">
                Subscriptions renew automatically unless cancelled before the renewal date.
              </p>
              <p className="mt-2 text-fc-muted">
                Failure to pay may result in suspension or termination of access.
              </p>
            </section>

            <section id="cancellation">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                8. Cancellation and termination
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  You may cancel your subscription at any time through your account or by contacting
                  support.
                </p>
                <p>
                  Cancellation will take effect at the end of the current billing period unless
                  otherwise stated.
                </p>
                <p>We may suspend or terminate access if:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>You breach these Terms.</li>
                  <li>Payment is overdue.</li>
                  <li>Required for legal or security reasons.</li>
                </ul>
                <p>We may also terminate accounts that remain inactive for extended periods.</p>
              </div>
            </section>

            <section id="data-access-deletion">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                9. Data access and deletion
              </h2>
              <p className="mt-4 text-fc-muted">Upon termination or cancellation:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>You may request export of your data within a reasonable period.</li>
                <li>
                  We may delete data after a defined retention period in line with our Privacy Policy.
                </li>
              </ul>
              <p className="mt-4 text-fc-muted">
                You are responsible for exporting any required data before account closure.
              </p>
            </section>

            <section id="ip">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                10. Intellectual property
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew and its licensors retain all rights, title, and interest in:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>The software.</li>
                <li>Platform design and functionality.</li>
                <li>Branding and content.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                You are granted a limited, non-exclusive, non-transferable license to use the service
                for internal business purposes only.
              </p>
            </section>

            <section id="availability">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                11. Service availability and changes
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  We aim to provide a reliable service but do not guarantee uninterrupted or error-free
                  operation.
                </p>
                <p>We may:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Modify or improve features.</li>
                  <li>Add or remove functionality.</li>
                  <li>Perform maintenance that may affect availability.</li>
                </ul>
                <p>Where possible, we will provide reasonable notice of significant changes.</p>
              </div>
            </section>

            <section id="warranties">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                12. Warranties and disclaimers
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  To the maximum extent permitted by law, FieldCrew is provided on an &quot;as is&quot; and
                  &quot;as available&quot; basis.
                </p>
                <p>We do not guarantee that:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>The service will meet all business requirements.</li>
                  <li>Results or outputs (including reports) are error-free.</li>
                  <li>The platform will be uninterrupted at all times.</li>
                </ul>
                <p>
                  You are responsible for how you use outputs generated by the platform, including
                  payroll or operational decisions.
                </p>
              </div>
            </section>

            <section id="liability">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                13. Limitation of liability
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>To the maximum extent permitted by law, FieldCrew will not be liable for:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Indirect, incidental, or consequential damages.</li>
                  <li>Loss of profits, revenue, data, or goodwill.</li>
                  <li>Business interruption or operational losses.</li>
                </ul>
                <p>
                  FieldCrew&apos;s total liability for any claim arising from the service will not
                  exceed the amount paid by you to FieldCrew in the 12 months preceding the claim.
                </p>
              </div>
            </section>

            <section id="indemnity">
              <h2 className="font-display text-2xl font-bold text-fc-brand">14. Indemnity</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  You agree to indemnify and hold FieldCrew harmless from any claims, damages, or
                  expenses arising from:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Your use or misuse of the service.</li>
                  <li>Your Customer Data.</li>
                  <li>Your breach of these Terms.</li>
                  <li>Your violation of applicable laws.</li>
                </ul>
              </div>
            </section>

            <section id="third-party">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                15. Third-party services
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew may integrate with or rely on third-party services (for example hosting,
                payments, messaging). We are not responsible for the performance or availability of
                third-party services.
              </p>
            </section>

            <section id="changes">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                16. Changes to these Terms
              </h2>
              <p className="mt-4 text-fc-muted">
                We may update these Terms from time to time. Material changes will be posted with an
                updated effective date. Continued use of the service after changes constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section id="governing-law">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                17. Governing law
              </h2>
              <p className="mt-4 text-fc-muted">
                These Terms are governed by the laws of England and Wales, unless otherwise required
                by applicable law. Any disputes will be subject to the jurisdiction of the courts of
                England and Wales.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-display text-2xl font-bold text-fc-brand">18. Contact</h2>
              <div className="mt-4 space-y-2 text-fc-muted">
                <p>For questions about these Terms:</p>
                <p>
                  <strong className="text-fc-brand">Email:</strong>{" "}
                  <a
                    href="mailto:support@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    support@fieldcrew.app
                  </a>
                </p>
                <p>
                  <strong className="text-fc-brand">Support:</strong> Available via the FieldCrew
                  platform and website
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={routes.public.support}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Contact support
                </Link>
                <Link
                  href={routes.public.privacy}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-fc-border px-4 py-2 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted"
                >
                  View privacy policy
                </Link>
              </div>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="space-y-3">
                <li><a href="#who-we-are" className="text-sm font-medium text-fc-brand hover:text-fc-accent">1. Who we are</a></li>
                <li><a href="#acceptance" className="text-sm font-medium text-fc-brand hover:text-fc-accent">2. Acceptance</a></li>
                <li><a href="#services" className="text-sm font-medium text-fc-brand hover:text-fc-accent">3. Services</a></li>
                <li><a href="#accounts" className="text-sm font-medium text-fc-brand hover:text-fc-accent">4. Accounts</a></li>
                <li><a href="#customer-data" className="text-sm font-medium text-fc-brand hover:text-fc-accent">5. Customer data</a></li>
                <li><a href="#acceptable-use" className="text-sm font-medium text-fc-brand hover:text-fc-accent">6. Acceptable use</a></li>
                <li><a href="#billing" className="text-sm font-medium text-fc-brand hover:text-fc-accent">7. Billing</a></li>
                <li><a href="#cancellation" className="text-sm font-medium text-fc-brand hover:text-fc-accent">8. Cancellation</a></li>
                <li><a href="#data-access-deletion" className="text-sm font-medium text-fc-brand hover:text-fc-accent">9. Data access and deletion</a></li>
                <li><a href="#ip" className="text-sm font-medium text-fc-brand hover:text-fc-accent">10. Intellectual property</a></li>
                <li><a href="#availability" className="text-sm font-medium text-fc-brand hover:text-fc-accent">11. Availability and changes</a></li>
                <li><a href="#warranties" className="text-sm font-medium text-fc-brand hover:text-fc-accent">12. Warranties</a></li>
                <li><a href="#liability" className="text-sm font-medium text-fc-brand hover:text-fc-accent">13. Liability</a></li>
                <li><a href="#indemnity" className="text-sm font-medium text-fc-brand hover:text-fc-accent">14. Indemnity</a></li>
                <li><a href="#third-party" className="text-sm font-medium text-fc-brand hover:text-fc-accent">15. Third-party services</a></li>
                <li><a href="#changes" className="text-sm font-medium text-fc-brand hover:text-fc-accent">16. Changes</a></li>
                <li><a href="#governing-law" className="text-sm font-medium text-fc-brand hover:text-fc-accent">17. Governing law</a></li>
                <li><a href="#contact" className="text-sm font-medium text-fc-brand hover:text-fc-accent">18. Contact</a></li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
