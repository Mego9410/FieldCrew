"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, FormInput, FormSelect } from "@/components/forms/FormField";
import { addWorker, updateWorker, deleteWorker } from "@/lib/data";
import type { Worker, WorkerInput, WorkerRole } from "@/lib/entities";
import { UserPlus, Pencil, Trash2 } from "lucide-react";

const ROLES: { value: WorkerRole; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "tech", label: "Tech" },
  { value: "apprentice", label: "Apprentice" },
];

function formatE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

function isValidE164(phone: string): boolean {
  const p = formatE164(phone);
  return /^\+[1-9]\d{6,14}$/.test(p);
}

interface CrewBuilderProps {
  companyId: string;
  expectedTeamSize: number;
  workers: Worker[];
  onWorkersChange: () => void;
}

export function CrewBuilder({
  companyId,
  expectedTeamSize,
  workers,
  onWorkersChange,
}: CrewBuilderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<WorkerRole>("tech");
  const [hourlyRate, setHourlyRate] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setPhone("");
    setRole("tech");
    setHourlyRate("");
    setOvertimeRate("");
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (w: Worker) => {
    setEditing(w);
    setName(w.name);
    setPhone(w.phone);
    setRole((w.role as WorkerRole) ?? "tech");
    setHourlyRate(String(w.hourlyRate ?? ""));
    setOvertimeRate(w.overtimeRate != null ? String(w.overtimeRate) : "");
    setError(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const saveWorker = async () => {
    setError(null);
    const rawRate = parseFloat(hourlyRate);
    const hourly = isNaN(rawRate) ? 0 : rawRate;
    const rawOt = overtimeRate.trim() ? parseFloat(overtimeRate) : hourly * 1.5;
    const ot = isNaN(rawOt) ? hourly * 1.5 : rawOt;

    if (!name.trim()) {
      setError("Full name is required");
      return;
    }
    const e164 = formatE164(phone);
    if (!e164 || !isValidE164(phone)) {
      setError("Enter a valid mobile number (e.g. +1 555 123 4567)");
      return;
    }
    if (hourly < 0) {
      setError("Hourly rate must be 0 or more");
      return;
    }

    const input: WorkerInput = {
      name: name.trim(),
      phone: e164,
      hourlyRate: hourly,
      companyId,
      role,
      overtimeRate: ot,
    };

    try {
      if (editing) {
        await updateWorker(editing.id, input);
      } else {
        await addWorker(input);
      }
      onWorkersChange();
      closeDrawer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const removeWorker = async (w: Worker) => {
    if (!confirm(`Remove ${w.name} from crew?`)) return;
    try {
      await deleteWorker(w.id);
      onWorkersChange();
    } catch {
      setError("Failed to remove worker");
    }
  };

  const weeklyLabor = workers.reduce((sum, w) => sum + (w.hourlyRate ?? 0) * 40, 0);
  const otExposure = workers.some((w) => (w.overtimeRate ?? w.hourlyRate * 1.5) > (w.hourlyRate ?? 0));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-fc-muted">
            Add your crew. You can edit or remove anyone before sending invites.
          </p>
          <Button type="button" variant="outline" onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add worker
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {workers.map((w) => (
            <Card key={w.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-fc-brand">{w.name}</p>
                <p className="text-sm text-fc-muted">{w.phone}</p>
                <p className="mt-1 text-xs text-fc-muted">
                  {(w.role ?? "tech").charAt(0).toUpperCase() + (w.role ?? "tech").slice(1)} · ${Number(w.hourlyRate).toFixed(2)}/hr
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(w)}
                  className="rounded-lg p-2 text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                  aria-label={`Edit ${w.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeWorker(w)}
                  className="rounded-lg p-2 text-fc-muted hover:bg-fc-danger-bg hover:text-fc-danger"
                  aria-label={`Remove ${w.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {workers.length === 0 && (
          <Card variant="muted" className="border-dashed p-8 text-center">
            <p className="text-fc-muted">No workers yet.</p>
            <Button type="button" variant="outline" className="mt-3" onClick={openAdd}>
              Add your first worker
            </Button>
          </Card>
        )}

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-fc-brand/20"
              aria-hidden
              onClick={closeDrawer}
            />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-fc-border bg-fc-surface p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-fc-brand">
                {editing ? "Edit worker" : "Add worker"}
              </h2>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveWorker();
                }}
              >
                <FormField label="Full name" id="worker-name" required>
                  <FormInput
                    id="worker-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jamie Martinez"
                  />
                </FormField>
                <FormField label="Mobile (E.164)" id="worker-phone" required>
                  <FormInput
                    id="worker-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </FormField>
                <FormField label="Role" id="worker-role">
                  <FormSelect
                    id="worker-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as WorkerRole)}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
                <FormField label="Hourly rate ($)" id="worker-hourly" required>
                  <FormInput
                    id="worker-hourly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="40"
                  />
                </FormField>
                <FormField label="Overtime rate ($)" id="worker-ot">
                  <FormInput
                    id="worker-ot"
                    type="number"
                    min="0"
                    step="0.01"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value)}
                    placeholder="1.5× hourly (default)"
                  />
                </FormField>
                {error && (
                  <p className="text-sm text-fc-danger" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    {editing ? "Update" : "Add"} worker
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDrawer}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      <Card variant="muted" className="h-fit p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
          Crew snapshot
        </h3>
        <div className="mt-4 space-y-3">
          <p className="text-2xl font-bold text-fc-brand">
            {workers.length}
            <span className="ml-1 text-sm font-normal text-fc-muted">
              / {expectedTeamSize} expected
            </span>
          </p>
          <p className="text-sm text-fc-muted">
            Est. weekly labor: <span className="font-semibold text-fc-brand">${weeklyLabor.toLocaleString()}</span>
            <span className="block text-xs">(40h/wk per worker)</span>
          </p>
          {otExposure && (
            <p className="text-xs text-fc-warning">
              Overtime rates set — you’ll see OT exposure once tracking starts.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
