"use client";

import { useState } from "react";
import { addOwnerUser, updateOwnerUser, getCompanies } from "@/lib/mock-storage";
import type { OwnerUser, OwnerUserInput } from "@/lib/entities";
import { FormField, FormInput, FormSelect } from "./FormField";

interface OwnerUserFormProps {
  ownerUser?: OwnerUser | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OwnerUserForm({ ownerUser, onSuccess, onCancel }: OwnerUserFormProps) {
  const companies = getCompanies();
  const [name, setName] = useState(ownerUser?.name ?? "");
  const [email, setEmail] = useState(ownerUser?.email ?? "");
  const [companyId, setCompanyId] = useState(ownerUser?.companyId ?? companies[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!companyId) {
      setError("Company is required");
      return;
    }

    const input: OwnerUserInput = {
      name: name.trim(),
      email: email.trim(),
      companyId,
    };

    if (ownerUser) {
      updateOwnerUser(ownerUser.id, input);
    } else {
      addOwnerUser(input);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Name" id="owner-name" required>
        <FormInput
          id="owner-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Admin User"
          autoFocus
        />
      </FormField>
      <FormField label="Email" id="owner-email" required>
        <FormInput
          id="owner-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. owner@company.com"
        />
      </FormField>
      <FormField label="Company" id="owner-company" required>
        <FormSelect
          id="owner-company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        >
          <option value="">Select company…</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FormSelect>
      </FormField>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          {ownerUser ? "Update" : "Create"} owner
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
