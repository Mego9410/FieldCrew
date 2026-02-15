"use client";

import { useState } from "react";
import { addWorker, updateWorker } from "@/lib/data";
import { useCompanies } from "@/lib/hooks/useData";
import type { Worker, WorkerInput } from "@/lib/entities";
import { FormField, FormInput } from "./FormField";

interface WorkerFormProps {
  worker?: Worker | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WorkerForm({ worker, onSuccess, onCancel }: WorkerFormProps) {
  const { items: companies } = useCompanies();
  const companyId = companies[0]?.id ?? worker?.companyId ?? "";

  const [name, setName] = useState(worker?.name ?? "");
  const [phone, setPhone] = useState(worker?.phone ?? "");
  const [hourlyRate, setHourlyRate] = useState(worker?.hourlyRate?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!phone.trim()) {
      setError("Phone is required");
      return;
    }
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate < 0) {
      setError("Hourly rate must be a valid positive number");
      return;
    }
    if (!companyId) {
      setError("No company configured. Please set up a company first.");
      return;
    }

    const input: WorkerInput = {
      name: name.trim(),
      phone: phone.trim(),
      hourlyRate: rate,
      companyId,
    };

    try {
      if (worker) {
        await updateWorker(worker.id, input);
      } else {
        await addWorker(input);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save worker");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Name" id="worker-name" required>
        <FormInput
          id="worker-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. J. Martinez"
          autoFocus
        />
      </FormField>
      <FormField label="Phone" id="worker-phone" required>
        <FormInput
          id="worker-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. (555) 123-4567"
        />
      </FormField>
      <FormField label="Hourly rate ($)" id="worker-hourly-rate" required>
        <FormInput
          id="worker-hourly-rate"
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="e.g. 40"
        />
      </FormField>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          {worker ? "Update" : "Create"} worker
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
