"use client";

import { useState } from "react";
import Link from "next/link";
import { addWorker, updateWorker, WorkerLimitError } from "@/lib/data";
import { useCompanies } from "@/lib/hooks/useData";
import { routes } from "@/lib/routes";
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
  const [sendProfileLink, setSendProfileLink] = useState(true);
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
        const created = await addWorker(input);
        if (sendProfileLink) {
          await fetch("/api/invite/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workerId: created.id }),
          });
        }
        // Reset form so it can't be resubmitted; parent shows confirmation toast
        setName("");
        setPhone("");
        setHourlyRate("");
        setSendProfileLink(true);
        setError(null);
      }
      onSuccess?.();
    } catch (err) {
      if (err instanceof WorkerLimitError) {
        setError(
          `You've reached your plan limit (${err.limit} workers). Upgrade to add more workers.`
        );
        return;
      }
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
      {!worker && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sendProfileLink}
            onChange={(e) => setSendProfileLink(e.target.checked)}
            className="rounded border-fc-border text-fc-accent focus:ring-fc-accent"
          />
          <span className="text-sm text-fc-brand">Send profile link by SMS after adding</span>
        </label>
      )}
      {error && (
        <div className="text-sm">
          <p className="text-red-500">{error}</p>
          {error.includes("plan limit") && (
            <Link
              href={routes.owner.settingsBilling}
              className="mt-2 inline-block font-medium text-fc-accent hover:underline"
            >
              Upgrade plan
            </Link>
          )}
        </div>
      )}
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
