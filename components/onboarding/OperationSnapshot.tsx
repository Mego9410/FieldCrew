"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FormField, FormInput } from "@/components/forms/FormField";
import type { WorkType, TrackingMethod } from "@/lib/entities";

const WORK_TYPES: { value: WorkType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "install", label: "Install" },
  { value: "mixed", label: "Mixed" },
];

const TRACKING_METHODS: { value: TrackingMethod; label: string }[] = [
  { value: "digital", label: "Digital / app" },
  { value: "paper", label: "Paper timesheets" },
  { value: "none", label: "Not tracking yet" },
];

export interface OperationSnapshotData {
  companyName: string;
  workType: WorkType;
  expectedTeamSize: number;
  currentTrackingMethod: TrackingMethod;
}

interface OperationSnapshotProps {
  initial?: Partial<OperationSnapshotData>;
  onChange: (data: OperationSnapshotData) => void;
}

export function OperationSnapshot({ initial, onChange }: OperationSnapshotProps) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [workType, setWorkType] = useState<WorkType>(initial?.workType ?? "mixed");
  const [expectedTeamSize, setExpectedTeamSize] = useState(initial?.expectedTeamSize ?? 5);
  const [currentTrackingMethod, setCurrentTrackingMethod] = useState<TrackingMethod>(
    initial?.currentTrackingMethod ?? "none"
  );

  const emit = () => {
    onChange({
      companyName: companyName.trim(),
      workType,
      expectedTeamSize,
      currentTrackingMethod,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <FormField label="Company name" id="ob-company-name" required>
          <FormInput
            id="ob-company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onBlur={emit}
            placeholder="e.g. Ace HVAC"
          />
        </FormField>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-fc-brand">Work type</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WORK_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setWorkType(opt.value);
                onChange({ companyName: companyName.trim(), workType: opt.value, expectedTeamSize, currentTrackingMethod });
              }}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                workType === opt.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand"
                  : "border-fc-border bg-fc-surface text-fc-muted hover:border-fc-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-5">
        <label className="block text-sm font-medium text-fc-brand">
          Expected team size
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={25}
            value={expectedTeamSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              setExpectedTeamSize(v);
              onChange({ companyName: companyName.trim(), workType, expectedTeamSize: v, currentTrackingMethod });
            }}
            className="h-2 flex-1 accent-fc-accent"
          />
          <span className="w-8 text-right font-semibold text-fc-brand">
            {expectedTeamSize}
          </span>
        </div>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-fc-brand">Current tracking</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TRACKING_METHODS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setCurrentTrackingMethod(opt.value);
                onChange({ companyName: companyName.trim(), workType, expectedTeamSize, currentTrackingMethod: opt.value });
              }}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                currentTrackingMethod === opt.value
                  ? "border-fc-accent bg-fc-accent/10 text-fc-brand"
                  : "border-fc-border bg-fc-surface text-fc-muted hover:border-fc-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
