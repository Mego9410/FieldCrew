"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { getSettings } from "@/lib/settings.mock";
import { CreditCard, Download, AlertCircle } from "lucide-react";

// TODO: Integrate with Stripe when backend is ready
const STRIPE_READY = false;

export default function BillingSettingsPage() {
  const [billing, setBilling] = useState<Awaited<ReturnType<typeof getSettings>>["billing"] | null>(null);
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof getSettings>>["invoices"]>([]);

  useEffect(() => {
    getSettings().then((s) => {
      setBilling(s.billing);
      setInvoices(s.invoices);
    });
  }, []);

  const handleManagePlan = () => {
    // TODO: Navigate to plan management or external Stripe portal
    console.log("Manage plan - stub");
  };

  const handleUpdatePayment = () => {
    // TODO: Open Stripe payment method modal
    console.log("Update payment method - stub");
  };

  const handleDownloadInvoice = (id: string) => {
    // TODO: Trigger invoice PDF download
    console.log("Download invoice", id);
  };

  if (!billing) {
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
        {!STRIPE_READY && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Billing is in setup</p>
              <p className="text-sm mt-0.5">
                Stripe integration is not connected yet. The UI below shows mock
                data. TODO: Wire to Stripe API when ready.
              </p>
            </div>
          </div>
        )}

        <SettingsSectionCard title="Current plan">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Plan</span>
              <span className="font-medium text-fc-brand">
                {billing.planName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Price</span>
              <span className="font-medium text-fc-brand">
                ${billing.planPrice}/mo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fc-muted">Seats</span>
              <span className="font-medium text-fc-brand">
                {billing.seatsUsed} / {billing.seatsLimit}
              </span>
            </div>
            <button
              type="button"
              onClick={handleManagePlan}
              className="mt-2 rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
            >
              Manage plan
            </button>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard title="Payment method">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-fc-border bg-slate-50">
                <CreditCard className="h-5 w-5 text-fc-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-fc-brand">
                  {billing.cardBrand} •••• {billing.cardLast4}
                </p>
                <p className="text-xs text-fc-muted">
                  Expires {billing.cardExpiry}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpdatePayment}
              className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
            >
              Update payment method
            </button>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Invoices"
          description="Download past invoices."
        >
          {invoices.length === 0 ? (
            <p className="py-6 text-sm text-fc-muted text-center">
              No invoices yet.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm" aria-label="Invoice history">
                <thead>
                  <tr className="border-b border-fc-border">
                    <th className="text-left py-2 px-2 font-medium text-fc-brand">
                      Date
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-fc-brand">
                      Amount
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-fc-brand">
                      Status
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-fc-brand">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-fc-border last:border-0"
                    >
                      <td className="py-3 px-2 text-fc-brand">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-fc-brand">
                        ${inv.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={
                            inv.status === "Paid"
                              ? "text-green-600"
                              : "text-amber-600"
                          }
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(inv.id)}
                          className="inline-flex items-center gap-1 text-fc-accent hover:underline"
                          aria-label={`Download invoice ${inv.id}`}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SettingsSectionCard>
      </div>
    </SettingsPageShell>
  );
}
