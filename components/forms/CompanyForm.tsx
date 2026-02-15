"use client";

import { useState } from "react";
import { addCompany, updateCompany } from "@/lib/data";
import type { Company, CompanyInput } from "@/lib/entities";
import { FormField, FormInput } from "./FormField";

interface CompanyFormProps {
  company?: Company | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const [name, setName] = useState(company?.name ?? "");
  const [address, setAddress] = useState(company?.address ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Company name is required");
      return;
    }

    const input: CompanyInput = {
      name: name.trim(),
      address: address.trim() || undefined,
    };

    try {
      if (company) {
        await updateCompany(company.id, input);
      } else {
        await addCompany(input);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save company");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Company name" id="company-name" required>
        <FormInput
          id="company-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Field Crew HVAC"
          autoFocus
        />
      </FormField>
      <FormField label="Address" id="company-address">
        <FormInput
          id="company-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 100 Business Ave, City"
        />
      </FormField>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          {company ? "Update" : "Create"} company
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
