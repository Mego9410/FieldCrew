"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { FormField, FormInput, FormSelect } from "@/components/forms/FormField";
import { useToast } from "@/components/ui/Toast";
import {
  getSettings,
  saveSettings,
  type CompanySettings,
} from "@/lib/settings.mock";

const COUNTRIES = ["US", "CA", "MX"];
const CURRENCIES = ["USD", "CAD"];

export default function CompanySettingsPage() {
  const [company, setCompany] = useState<CompanySettings>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    taxId: "",
    currency: "USD",
    otDailyThreshold: 8,
    otWeeklyThreshold: 40,
    otMultiplier: 1.5,
  });
  const [saved, setSaved] = useState<CompanySettings>(company);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    getSettings().then((s) => {
      setCompany(s.company);
      setSaved(s.company);
    });
  }, []);

  const isDirty = JSON.stringify(company) !== JSON.stringify(saved);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!company.name.trim()) e.name = "Company name is required";
    const otD = company.otDailyThreshold;
    const otW = company.otWeeklyThreshold;
    const otM = company.otMultiplier;
    if (isNaN(otD) || otD < 0) e.otDaily = "Daily threshold must be ≥ 0";
    if (isNaN(otW) || otW < 0) e.otWeekly = "Weekly threshold must be ≥ 0";
    if (isNaN(otM) || otM < 1) e.otMultiplier = "Multiplier must be ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !isDirty || loading) return;
    setLoading(true);
    try {
      await saveSettings({ company });
      setSaved(company);
      toast.success("Company settings saved");
    } catch {
      toast.error("Failed to save company settings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCompany(saved);
    setErrors({});
  };

  return (
    <SettingsPageShell
      title="Company"
      description="Business name, address, tax ID, and overtime defaults."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <SettingsSectionCard title="Business details">
          <div className="space-y-4">
            <FormField
              label="Company name"
              id="company-name"
              required
              error={errors.name}
            >
              <FormInput
                id="company-name"
                type="text"
                value={company.name}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, name: e.target.value }))
                }
                placeholder="Field Crew HVAC"
                autoComplete="organization"
              />
            </FormField>
            <FormField label="Company email" id="company-email">
              <FormInput
                id="company-email"
                type="email"
                value={company.email}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, email: e.target.value }))
                }
                placeholder="billing@company.com"
              />
            </FormField>
            <FormField label="Phone" id="company-phone">
              <FormInput
                id="company-phone"
                type="tel"
                value={company.phone}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, phone: e.target.value }))
                }
                placeholder="(555) 000-0000"
              />
            </FormField>
            <FormField label="Tax ID / EIN" id="company-tax-id">
              <FormInput
                id="company-tax-id"
                type="text"
                value={company.taxId}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, taxId: e.target.value }))
                }
                placeholder="XX-XXXXXXX"
                autoComplete="off"
              />
            </FormField>
            <FormField label="Default currency" id="company-currency">
              <FormSelect
                id="company-currency"
                value={company.currency}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, currency: e.target.value }))
                }
              >
                {CURRENCIES.map((cc) => (
                  <option key={cc} value={cc}>
                    {cc}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Address"
          description="Business address for invoices and correspondence."
        >
          <div className="space-y-4">
            <FormField label="Street" id="company-street">
              <FormInput
                id="company-street"
                type="text"
                value={company.street}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, street: e.target.value }))
                }
                placeholder="123 Main St"
                autoComplete="street-address"
              />
            </FormField>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="City" id="company-city">
                <FormInput
                  id="company-city"
                  type="text"
                  value={company.city}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, city: e.target.value }))
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                />
              </FormField>
              <FormField label="State" id="company-state">
                <FormInput
                  id="company-state"
                  type="text"
                  value={company.state}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, state: e.target.value }))
                  }
                  placeholder="State"
                  autoComplete="address-level1"
                />
              </FormField>
              <FormField label="ZIP" id="company-zip">
                <FormInput
                  id="company-zip"
                  type="text"
                  value={company.zip}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, zip: e.target.value }))
                  }
                  placeholder="12345"
                  autoComplete="postal-code"
                />
              </FormField>
            </div>
            <FormField label="Country" id="company-country">
              <FormSelect
                id="company-country"
                value={company.country}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, country: e.target.value }))
                }
              >
                {COUNTRIES.map((cc) => (
                  <option key={cc} value={cc}>
                    {cc}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Overtime defaults"
          description="Default overtime rules for jobs."
        >
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="OT daily threshold (hours)"
              id="company-ot-daily"
              error={errors.otDaily}
            >
              <FormInput
                id="company-ot-daily"
                type="number"
                min="0"
                step="0.5"
                value={company.otDailyThreshold}
                onChange={(e) =>
                  setCompany((c) => ({
                    ...c,
                    otDailyThreshold: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </FormField>
            <FormField
              label="OT weekly threshold (hours)"
              id="company-ot-weekly"
              error={errors.otWeekly}
            >
              <FormInput
                id="company-ot-weekly"
                type="number"
                min="0"
                step="0.5"
                value={company.otWeeklyThreshold}
                onChange={(e) =>
                  setCompany((c) => ({
                    ...c,
                    otWeeklyThreshold: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </FormField>
            <FormField
              label="OT multiplier"
              id="company-ot-multiplier"
              error={errors.otMultiplier}
            >
              <FormInput
                id="company-ot-multiplier"
                type="number"
                min="1"
                step="0.1"
                value={company.otMultiplier}
                onChange={(e) =>
                  setCompany((c) => ({
                    ...c,
                    otMultiplier: parseFloat(e.target.value) || 1,
                  }))
                }
              />
            </FormField>
          </div>
        </SettingsSectionCard>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!isDirty || loading}
            className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </SettingsPageShell>
  );
}
