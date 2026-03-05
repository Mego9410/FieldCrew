"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { CreditCard } from "lucide-react";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface SubscriptionData {
  planName: string;
  planPrice: number;
  workerLimit: number;
  workersUsed: number;
  subscriptionStatus: string | null;
}

export default function BillingSettingsPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData({ planName: d.planName, planPrice: d.planPrice, workerLimit: d.workerLimit, workersUsed: d.workersUsed, subscriptionStatus: d.subscriptionStatus ?? null });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <SettingsPageShell title="Billing" description="Plan, payment method, and invoices.">
        <p className="text-fc-muted">Loading billing…</p>
      </SettingsPageShell>
    );
  }

  return (
    <SettingsPageShell
      title="Billing"
      description="Plan, payment method, and invoices."
    >
      <div className="space-y-6">
        <SettingsSectionCard title="Current plan">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Plan</span>
              <span className="font-medium text-fc-brand">{data.planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Price</span>
              <span className="font-medium text-fc-brand">${data.planPrice}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Workers</span>
              <span className="font-medium text-fc-brand">
                {data.workersUsed} / {data.workerLimit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Status</span>
              <span className="font-medium text-fc-brand capitalize">{data.subscriptionStatus ?? "—"}</span>
            </div>
            <p className="mt-2 text-xs text-fc-muted">
              To change plan or payment method, use Stripe Customer Portal (can be wired via a portal session API).
            </p>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard title="Payment method">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-fc-border bg-slate-50">
              <CreditCard className="h-5 w-5 text-fc-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-brand">Saved on Stripe</p>
              <p className="text-xs text-fc-muted">Update payment method in Stripe Customer Portal.</p>
            </div>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard title="Invoices" description="Download past invoices from Stripe.">
          <p className="py-4 text-sm text-fc-muted">
            Invoices are available in your Stripe dashboard. Wire a Customer Portal session to allow downloads from this page.
          </p>
        </SettingsSectionCard>

        <p className="text-sm text-fc-muted">
          <Link href={routes.owner.settings} className="text-fc-accent hover:underline">
            Back to settings
          </Link>
        </p>
      </div>
    </SettingsPageShell>
  );
}
