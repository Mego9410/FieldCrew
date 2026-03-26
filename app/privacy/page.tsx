import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy Policy — FieldCrew",
  description:
    "Privacy Policy for FieldCrew describing how account, operational, and support data is collected, used, retained, and protected.",
};

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                This Privacy Policy explains how FieldCrew collects, uses, stores, and protects
                personal and operational data across product usage, support, and service operations.
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
                  FieldCrew is a software platform that helps field service businesses track
                  job-based labour, payroll, and operational performance.
                </p>
                <p>
                  <strong className="text-fc-brand">Legal entity:</strong> FieldCrew Ltd
                  <br />
                  <strong className="text-fc-brand">Registered address:</strong> [Insert address]
                  <br />
                  <strong className="text-fc-brand">Contact email:</strong>{" "}
                  <a
                    href="mailto:privacy@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    privacy@fieldcrew.app
                  </a>
                </p>
                <p>
                  In most cases, the business using FieldCrew (your employer or company) is the data
                  controller, and FieldCrew acts as a data processor/service provider on their behalf.
                </p>
                <p>
                  For website visitors and account owners, FieldCrew may act as the data controller.
                </p>
              </div>
            </section>

            <section id="scope">
              <h2 className="font-display text-2xl font-bold text-fc-brand">2. Scope</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  This Privacy Policy applies to information processed by FieldCrew in connection
                  with:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Our website</li>
                  <li>The FieldCrew platform and mobile/web applications</li>
                  <li>Onboarding and account setup</li>
                  <li>Customer support and communications</li>
                </ul>
                <p>It applies to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Account owners and administrators</li>
                  <li>Workers invited into a workspace</li>
                  <li>Website visitors</li>
                </ul>
              </div>
            </section>

            <section id="data-collected">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                3. Information we collect
              </h2>
              <div className="mt-4 space-y-5 text-fc-muted">
                <div>
                  <h3 className="font-display text-lg font-semibold text-fc-brand">
                    Account and profile information
                  </h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>Name, work email address, company name, and role.</li>
                    <li>Authentication data (login status, access permissions).</li>
                    <li>Subscription and billing-related metadata.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-fc-brand">
                    Operational and platform data
                  </h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>Job records, timesheets, and labour tracking data.</li>
                    <li>Reporting outputs and performance metrics.</li>
                    <li>System logs, timestamps, and usage activity.</li>
                    <li>Configuration settings for payroll and workflows.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-fc-brand">
                    Support and communications
                  </h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>Messages submitted via forms, email, or support tools.</li>
                    <li>Files, screenshots, or attachments provided for troubleshooting.</li>
                    <li>Feedback and product request information.</li>
                  </ul>
                </div>

                <div id="cookies">
                  <h3 className="font-display text-lg font-semibold text-fc-brand">
                    Cookies and usage data
                  </h3>
                  <p className="mt-2">
                    We use cookies and similar technologies to maintain sessions and authentication,
                    understand product usage and performance, and improve reliability and user
                    experience.
                  </p>
                  <p className="mt-2">You can control cookies through your browser settings.</p>
                </div>
              </div>
            </section>

            <section id="how-used">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                4. How we use information
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Provide and operate the FieldCrew platform.</li>
                <li>Authenticate users and manage access control.</li>
                <li>Generate reports and insights requested by customers.</li>
                <li>Process billing and manage subscriptions.</li>
                <li>Respond to support requests and resolve issues.</li>
                <li>Improve product performance, reliability, and security.</li>
                <li>Monitor usage to prevent misuse or abuse.</li>
                <li>Comply with legal obligations and enforce service terms.</li>
              </ul>
            </section>

            <section id="legal-basis">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                5. Legal basis for processing (UK/EU users)
              </h2>
              <p className="mt-4 text-fc-muted">
                Where applicable under UK GDPR / GDPR, we rely on:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>
                  <strong className="text-fc-brand">Contractual necessity</strong> to provide the
                  FieldCrew service.
                </li>
                <li>
                  <strong className="text-fc-brand">Legitimate interests</strong> to improve the
                  product, ensure security, and operate efficiently.
                </li>
                <li>
                  <strong className="text-fc-brand">Legal obligations</strong> where required by law.
                </li>
                <li>
                  <strong className="text-fc-brand">Consent</strong> where required (for example,
                  certain cookies or communications).
                </li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                6. How information is shared
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>
                  FieldCrew does not sell personal data.
                </p>
                <p>We may share data with trusted service providers that support:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Cloud hosting and infrastructure.</li>
                  <li>Authentication and security.</li>
                  <li>Analytics and performance monitoring.</li>
                  <li>Customer support and communications.</li>
                </ul>
                <p>We may also disclose information:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>To comply with legal obligations or lawful requests.</li>
                  <li>To protect the security, rights, or integrity of FieldCrew and its users.</li>
                  <li>
                    In connection with a merger, acquisition, or restructuring (with safeguards in
                    place).
                  </li>
                </ul>
              </div>
            </section>

            <section id="international">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                7. International data transfers
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew and its providers may process data in multiple countries, including outside
                the UK/EU.
              </p>
              <p className="mt-2 text-fc-muted">
                Where required, we implement appropriate safeguards such as standard contractual
                clauses and secure data transfer mechanisms.
              </p>
            </section>

            <section id="retention">
              <h2 className="font-display text-2xl font-bold text-fc-brand">8. Data retention</h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>We retain data only as long as necessary to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Provide the service.</li>
                  <li>Meet contractual obligations.</li>
                  <li>Resolve disputes.</li>
                  <li>Comply with legal requirements.</li>
                </ul>
                <p>
                  Customers may request export or deletion of data via support. Requests are processed
                  in line with legal and operational requirements.
                </p>
              </div>
            </section>

            <section id="security">
              <h2 className="font-display text-2xl font-bold text-fc-brand">9. Security</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Role-based access control (least privilege).</li>
                <li>Encryption in transit (TLS).</li>
                <li>Secure infrastructure and storage protections.</li>
                <li>Logging, monitoring, and incident response processes.</li>
                <li>Controlled access to production systems.</li>
              </ul>
            </section>

            <section id="breaches">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                10. Data breaches
              </h2>
              <p className="mt-4 text-fc-muted">
                If a data breach occurs that affects your personal data, we will notify affected
                parties where required by applicable law.
              </p>
            </section>

            <section id="rights">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                11. Your rights
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Access your personal data.</li>
                  <li>Correct inaccurate data.</li>
                  <li>Request deletion of your data.</li>
                  <li>Restrict or object to certain processing.</li>
                  <li>Request data portability.</li>
                </ul>
                <p>
                  If you are part of a company using FieldCrew, you should first contact your
                  employer or account administrator.
                </p>
                <p>
                  You can also contact us directly at{" "}
                  <a
                    href="mailto:privacy@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    privacy@fieldcrew.app
                  </a>
                  , and we will assist or route your request appropriately.
                </p>
              </div>
            </section>

            <section id="us-rights">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                12. US privacy rights
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>FieldCrew does not sell personal data.</p>
                <p>
                  If you are a US resident (including California), you may have rights to request
                  access to your data and request deletion of your data.
                </p>
                <p>
                  To exercise these rights, contact{" "}
                  <a
                    href="mailto:privacy@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    privacy@fieldcrew.app
                  </a>
                  .
                </p>
              </div>
            </section>

            <section id="marketing">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                13. Marketing and communications
              </h2>
              <div className="mt-4 space-y-4 text-fc-muted">
                <p>Where applicable, we may send service-related or product communications.</p>
                <p>You can opt out of non-essential communications at any time by:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Using the unsubscribe link.</li>
                  <li>Contacting us directly.</li>
                </ul>
                <p>
                  We comply with applicable email marketing laws, including CAN-SPAM requirements.
                </p>
              </div>
            </section>

            <section id="children">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                14. Children&apos;s privacy
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew is designed for business use and is not intended for individuals under 18.
                We do not knowingly collect personal data from children.
              </p>
            </section>

            <section id="changes">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                15. Changes to this policy
              </h2>
              <p className="mt-4 text-fc-muted">
                We may update this Privacy Policy from time to time. Material changes will be posted
                on this page with an updated effective date.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                16. Contact
              </h2>
              <div className="mt-4 space-y-2 text-fc-muted">
                <p>For privacy-related questions or requests:</p>
                <p>
                  <strong className="text-fc-brand">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@fieldcrew.app"
                    className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                  >
                    privacy@fieldcrew.app
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
                  href={routes.public.contact}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-fc-border px-4 py-2 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted"
                >
                  Contact team
                </Link>
              </div>
            </section>
          </article>

          <aside className="space-y-8">
            <section>
              <h2 className="mb-4 font-display text-lg font-bold text-fc-brand">On this page</h2>
              <ul className="space-y-3">
                <li><a href="#who-we-are" className="text-sm font-medium text-fc-brand hover:text-fc-accent">1. Who we are</a></li>
                <li><a href="#scope" className="text-sm font-medium text-fc-brand hover:text-fc-accent">2. Scope</a></li>
                <li><a href="#data-collected" className="text-sm font-medium text-fc-brand hover:text-fc-accent">3. Information we collect</a></li>
                <li><a href="#how-used" className="text-sm font-medium text-fc-brand hover:text-fc-accent">4. How we use information</a></li>
                <li><a href="#legal-basis" className="text-sm font-medium text-fc-brand hover:text-fc-accent">5. Legal basis</a></li>
                <li><a href="#sharing" className="text-sm font-medium text-fc-brand hover:text-fc-accent">6. Sharing</a></li>
                <li><a href="#international" className="text-sm font-medium text-fc-brand hover:text-fc-accent">7. Transfers</a></li>
                <li><a href="#retention" className="text-sm font-medium text-fc-brand hover:text-fc-accent">8. Retention</a></li>
                <li><a href="#security" className="text-sm font-medium text-fc-brand hover:text-fc-accent">9. Security</a></li>
                <li><a href="#breaches" className="text-sm font-medium text-fc-brand hover:text-fc-accent">10. Data breaches</a></li>
                <li><a href="#rights" className="text-sm font-medium text-fc-brand hover:text-fc-accent">11. Rights</a></li>
                <li><a href="#us-rights" className="text-sm font-medium text-fc-brand hover:text-fc-accent">12. US rights</a></li>
                <li><a href="#marketing" className="text-sm font-medium text-fc-brand hover:text-fc-accent">13. Marketing</a></li>
                <li><a href="#children" className="text-sm font-medium text-fc-brand hover:text-fc-accent">14. Children&apos;s privacy</a></li>
                <li><a href="#changes" className="text-sm font-medium text-fc-brand hover:text-fc-accent">15. Policy changes</a></li>
                <li><a href="#contact" className="text-sm font-medium text-fc-brand hover:text-fc-accent">16. Contact</a></li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
