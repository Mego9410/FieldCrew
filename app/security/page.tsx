import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Security — FieldCrew",
  description:
    "Security practices and controls used by FieldCrew to protect operational and payroll-related data.",
};

export default function SecurityPage() {
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
                Security - FieldCrew
              </h1>
              <p className="mt-4 text-lg text-fc-muted">
                FieldCrew is built to handle sensitive operational and payroll-related data for field
                service businesses. We design our systems to be secure, reliable, and controlled
                without adding unnecessary complexity.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">
          <article className="space-y-10 lg:col-span-2">
            <section id="overview">
              <h2 className="font-display text-2xl font-bold text-fc-brand">1. Overview</h2>
              <p className="mt-4 text-fc-muted">
                We apply practical, industry-standard security measures across infrastructure, data
                storage, access control, application security, monitoring, and incident response.
              </p>
              <p className="mt-2 text-fc-muted">
                Our goal is simple: keep your data secure, available, and under your control.
              </p>
            </section>

            <section id="infrastructure">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                2. Infrastructure security
              </h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew is hosted on secure, industry-standard cloud infrastructure.
              </p>
              <p className="mt-2 text-fc-muted">We implement:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Secure hosting environments with restricted access.</li>
                <li>Network-level protections and isolation.</li>
                <li>Regular system updates and patching.</li>
                <li>Environment separation (production vs development).</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                Access to infrastructure is limited to authorised personnel only.
              </p>
            </section>

            <section id="data-protection">
              <h2 className="font-display text-2xl font-bold text-fc-brand">3. Data protection</h2>
              <p className="mt-4 text-fc-muted">
                We protect customer data in transit and at rest:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>
                  <strong className="text-fc-brand">Encryption in transit</strong> using HTTPS/TLS.
                </li>
                <li>
                  <strong className="text-fc-brand">Secure data storage</strong> with controlled
                  access.
                </li>
                <li>Logical separation of customer data between workspaces.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                We do not sell or share customer data outside of what is required to operate the
                service.
              </p>
            </section>

            <section id="access-control">
              <h2 className="font-display text-2xl font-bold text-fc-brand">4. Access control</h2>
              <p className="mt-4 text-fc-muted">
                FieldCrew uses role-based access controls to ensure users only see what they need.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Workspace admins control user roles and permissions.</li>
                <li>Least-privilege principles are applied internally.</li>
                <li>Authentication controls protect account access.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                You are responsible for managing access within your team.
              </p>
            </section>

            <section id="application-security">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                5. Application security
              </h2>
              <p className="mt-4 text-fc-muted">
                We design the application to reduce risk at every level:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Input validation and protection against common vulnerabilities.</li>
                <li>Controlled API access.</li>
                <li>Secure authentication flows.</li>
                <li>Ongoing improvements based on real-world usage.</li>
              </ul>
            </section>

            <section id="monitoring">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                6. Monitoring and logging
              </h2>
              <p className="mt-4 text-fc-muted">
                We continuously monitor platform activity to detect issues early.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>System and access logging.</li>
                <li>Error tracking and alerting.</li>
                <li>Performance monitoring.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                This allows us to identify and respond to issues quickly.
              </p>
            </section>

            <section id="incident-response">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                7. Incident response
              </h2>
              <p className="mt-4 text-fc-muted">If a security issue occurs:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>We investigate and contain the issue quickly.</li>
                <li>We assess impact and take corrective action.</li>
                <li>We notify affected customers where required.</li>
              </ul>
              <p className="mt-4 text-fc-muted">
                Our focus is rapid response and clear communication.
              </p>
            </section>

            <section id="data-ownership">
              <h2 className="font-display text-2xl font-bold text-fc-brand">8. Data ownership</h2>
              <p className="mt-4 text-fc-muted">You retain full ownership of your data.</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>FieldCrew acts as a processor of your operational data.</li>
                <li>You control how your data is used within your workspace.</li>
                <li>You can request data export or deletion at any time.</li>
              </ul>
            </section>

            <section id="employee-practices">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                9. Employee and access practices
              </h2>
              <p className="mt-4 text-fc-muted">Access to systems is restricted and controlled:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Limited personnel access to production systems.</li>
                <li>Access granted based on role and necessity.</li>
                <li>Internal practices designed to reduce risk of exposure.</li>
              </ul>
            </section>

            <section id="third-party">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                10. Third-party providers
              </h2>
              <p className="mt-4 text-fc-muted">
                We rely on trusted third-party providers for infrastructure and core services (for
                example hosting, authentication, payments). These providers are selected based on
                their security standards and reliability.
              </p>
            </section>

            <section id="your-responsibilities">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                11. Your responsibilities
              </h2>
              <p className="mt-4 text-fc-muted">Security is shared. You should:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-fc-muted">
                <li>Use strong passwords.</li>
                <li>Restrict access to authorised users only.</li>
                <li>Remove access when team members leave.</li>
                <li>Ensure your use complies with applicable laws.</li>
              </ul>
            </section>

            <section id="reporting">
              <h2 className="font-display text-2xl font-bold text-fc-brand">
                12. Reporting security issues
              </h2>
              <p className="mt-4 text-fc-muted">
                If you discover a potential security issue, please report it immediately:
              </p>
              <p className="mt-2 text-fc-muted">
                <a
                  href="mailto:security@fieldcrew.app"
                  className="font-medium text-fc-brand underline decoration-fc-border hover:text-fc-accent"
                >
                  security@fieldcrew.app
                </a>
              </p>
              <p className="mt-2 text-fc-muted">
                We take all reports seriously and investigate promptly.
              </p>
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
                <li><a href="#overview" className="text-sm font-medium text-fc-brand hover:text-fc-accent">1. Overview</a></li>
                <li><a href="#infrastructure" className="text-sm font-medium text-fc-brand hover:text-fc-accent">2. Infrastructure security</a></li>
                <li><a href="#data-protection" className="text-sm font-medium text-fc-brand hover:text-fc-accent">3. Data protection</a></li>
                <li><a href="#access-control" className="text-sm font-medium text-fc-brand hover:text-fc-accent">4. Access control</a></li>
                <li><a href="#application-security" className="text-sm font-medium text-fc-brand hover:text-fc-accent">5. Application security</a></li>
                <li><a href="#monitoring" className="text-sm font-medium text-fc-brand hover:text-fc-accent">6. Monitoring and logging</a></li>
                <li><a href="#incident-response" className="text-sm font-medium text-fc-brand hover:text-fc-accent">7. Incident response</a></li>
                <li><a href="#data-ownership" className="text-sm font-medium text-fc-brand hover:text-fc-accent">8. Data ownership</a></li>
                <li><a href="#employee-practices" className="text-sm font-medium text-fc-brand hover:text-fc-accent">9. Employee practices</a></li>
                <li><a href="#third-party" className="text-sm font-medium text-fc-brand hover:text-fc-accent">10. Third-party providers</a></li>
                <li><a href="#your-responsibilities" className="text-sm font-medium text-fc-brand hover:text-fc-accent">11. Your responsibilities</a></li>
                <li><a href="#reporting" className="text-sm font-medium text-fc-brand hover:text-fc-accent">12. Reporting issues</a></li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
