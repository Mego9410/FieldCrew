"use client";

import { Button } from "@/components/ui/Button";

export interface JobSeedRow {
  title: string;
  customerOrSiteName: string;
  jobType: string;
  estimatedHours: string;
  scheduledDate: string;
  assignedWorkerIds: string[];
}

export interface AssignableWorker {
  id: string;
  name: string;
}

export function createEmptyJobRow(): JobSeedRow {
  return {
    title: "",
    customerOrSiteName: "",
    jobType: "",
    estimatedHours: "",
    scheduledDate: "",
    assignedWorkerIds: [],
  };
}

interface SeedJobsStepProps {
  rows: JobSeedRow[];
  workers: AssignableWorker[];
  onChange: (rows: JobSeedRow[]) => void;
  onAdd: () => void;
}

export function SeedJobsStep({ rows, workers, onChange, onAdd }: SeedJobsStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="rounded-2xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                label="Job title *"
                value={row.title}
                onChange={(v) => updateRow(rows, idx, { title: v }, onChange)}
                placeholder={idx === 0 ? "Smith AC install" : idx === 1 ? "Johnson service call" : "Rooftop maintenance"}
              />
              <Input
                label="Customer / site"
                value={row.customerOrSiteName}
                onChange={(v) => updateRow(rows, idx, { customerOrSiteName: v }, onChange)}
                placeholder="Smith Residence"
              />
              <Input
                label="Job type"
                value={row.jobType}
                onChange={(v) => updateRow(rows, idx, { jobType: v }, onChange)}
                placeholder="Install"
              />
              <Input
                label="Estimated hours *"
                value={row.estimatedHours}
                onChange={(v) => updateRow(rows, idx, { estimatedHours: v }, onChange)}
                placeholder="6"
                type="number"
              />
              <Input
                label="Scheduled date"
                value={row.scheduledDate}
                onChange={(v) => updateRow(rows, idx, { scheduledDate: v }, onChange)}
                placeholder=""
                type="date"
              />
              <label className="block">
                <span className="text-xs font-medium text-fc-muted-strong">Assigned workers</span>
                <select
                  multiple
                  value={row.assignedWorkerIds}
                  onChange={(e) =>
                    updateRow(
                      rows,
                      idx,
                      {
                        assignedWorkerIds: Array.from(e.target.selectedOptions).map((o) => o.value),
                      },
                      onChange
                    )
                  }
                  className="mt-1 h-[42px] w-full rounded-xl border border-fc-border bg-fc-surface px-3 py-2 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={onAdd}>
        Add another job
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
  rows: JobSeedRow[],
  idx: number,
  patch: Partial<JobSeedRow>,
  onChange: (rows: JobSeedRow[]) => void
) {
  const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
  onChange(next);
}
