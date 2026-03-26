import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docsNavGroups } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Settings and Security — FieldCrew Docs",
  description: "Owner/Admin guide for company settings, notifications, billing, and security routines.",
};

export default function OwnerSettingsSecurityPage() {
  return (
    <>
      <Nav />
      <DocsLayout
        title="Owner/Admin: Settings and Security"
        description="Maintain stable account operations, strong access control, and predictable billing workflows."
        navGroups={docsNavGroups}
        currentPath="/docs/owner/settings-and-security"
        toc={[
          { id: "objective", label: "Objective" },
          { id: "company", label: "Company settings" },
          { id: "notifications", label: "Notifications and billing" },
          { id: "security", label: "Security routine" },
        ]}
      >
        <section id="objective">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Objective</h2>
          <p className="mt-3 text-fc-muted">
            Keep configuration, billing, and account security aligned with operational needs and risk controls.
          </p>
        </section>

        <section id="company" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Company settings</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Review company profile and payroll assumptions monthly.</li>
            <li>Update role access when team responsibilities change.</li>
            <li>Confirm integrations and export expectations each quarter.</li>
          </ul>
        </section>

        <section id="notifications" className="mt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Notifications and billing</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Use notification settings to surface only high-signal events.</li>
            <li>Track subscription state and renewal windows proactively.</li>
            <li>Route billing ownership to one accountable admin.</li>
          </ul>
        </section>

        <section id="security" className="mt-8 border-t border-fc-border pt-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand">Security routine</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fc-muted">
            <li>Review admin access and remove stale users on a recurring schedule.</li>
            <li>Require password hygiene and monitor unusual access patterns.</li>
            <li>Document incident response ownership and support escalation path.</li>
          </ul>
          <p className="mt-5 text-sm text-fc-muted">
            Continue with:{" "}
            <Link href="/docs/playbooks/weekly-review-template" className="text-fc-accent hover:underline">
              Weekly Review Template
            </Link>
          </p>
        </section>
      </DocsLayout>
      <Footer />
    </>
  );
}
