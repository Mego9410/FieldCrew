"use client";

import { Button } from "@/components/ui/Button";

export interface WorkerSeedRow {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: string;
  hourlyRate: string;
}

export function createEmptyWorkerRow(): WorkerSeedRow {
  return {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    role: "",
    hourlyRate: "",
  };
}

interface SeedWorkersStepProps {
  rows: WorkerSeedRow[];
  onChange: (rows: WorkerSeedRow[]) => void;
  onAdd: () => void;
}

export function SeedWorkersStep({ rows, onChange, onAdd }: SeedWorkersStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-fc-muted">Most teams start with 2–5 workers.</p>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="rounded-2xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-fc-muted">
                Worker {idx + 1}
              </p>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => {
                  const next = rows.filter((_, i) => i !== idx);
                  onChange(next.length > 0 ? next : [createEmptyWorkerRow()]);
                }}
              >
                Remove
              </Button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-5">
              <Input
                label="First name *"
                value={row.firstName}
                onChange={(v) => updateRow(rows, idx, { firstName: v }, onChange)}
                placeholder="Alex"
              />
              <Input
                label="Last name"
                value={row.lastName}
                onChange={(v) => updateRow(rows, idx, { lastName: v }, onChange)}
                placeholder="Smith"
              />
              <Input
                label="Mobile number"
                value={row.mobileNumber}
                onChange={(v) => updateRow(rows, idx, { mobileNumber: v }, onChange)}
                placeholder="0400 000 000"
              />
              <Input
                label="Role / crew type"
                value={row.role}
                onChange={(v) => updateRow(rows, idx, { role: v }, onChange)}
                placeholder="Tech"
              />
              <Input
                label="Hourly rate *"
                value={row.hourlyRate}
                onChange={(v) => updateRow(rows, idx, { hourlyRate: v }, onChange)}
                placeholder="45"
                type="number"
              />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={onAdd}>
        Add another worker
      </Button>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-fc-muted-strong">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-fc-border bg-fc-surface px-3 py-2 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
      />
    </label>
  );
}

function updateRow(
  rows: WorkerSeedRow[],
  idx: number,
  patch: Partial<WorkerSeedRow>,
  onChange: (rows: WorkerSeedRow[]) => void
) {
  const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
  onChange(next);
}
