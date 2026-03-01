"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FormField, FormInput } from "@/components/forms/FormField";
import type { CompanySettings } from "@/lib/entities";

interface PayRulesProps {
  initial?: Partial<CompanySettings>;
  onChange: (settings: Partial<CompanySettings>) => void;
}

export function PayRules({ initial, onChange }: PayRulesProps) {
  const [otPerDay, setOtPerDay] = useState(String(initial?.otAfterHoursPerDay ?? 8));
  const [otPerWeek, setOtPerWeek] = useState(String(initial?.otAfterHoursPerWeek ?? 40));
  const [weekendMult, setWeekendMult] = useState(String(initial?.weekendMultiplier ?? 1));
  const [holidayMult, setHolidayMult] = useState(String(initial?.holidayMultiplier ?? 1));
  const [requireJobCode, setRequireJobCode] = useState(initial?.requireJobCode ?? true);
  const [requireGps, setRequireGps] = useState(initial?.requireGps ?? false);
  const [requireNotes, setRequireNotes] = useState(initial?.requireNotesOnClockOut ?? false);
  const [requirePhoto, setRequirePhoto] = useState(initial?.requirePhotoOnClockOut ?? false);

  const emit = () => {
    onChange({
      otAfterHoursPerDay: parseFloat(otPerDay) || 8,
      otAfterHoursPerWeek: parseFloat(otPerWeek) || 40,
      weekendMultiplier: parseFloat(weekendMult) || 1,
      holidayMultiplier: parseFloat(holidayMult) || 1,
      requireJobCode,
      requireGps,
      requireNotesOnClockOut: requireNotes,
      requirePhotoOnClockOut: requirePhoto,
    });
  };

  const setJobCode = (v: boolean) => {
    setRequireJobCode(v);
    onChange({
      otAfterHoursPerDay: parseFloat(otPerDay) || 8,
      otAfterHoursPerWeek: parseFloat(otPerWeek) || 40,
      weekendMultiplier: parseFloat(weekendMult) || 1,
      holidayMultiplier: parseFloat(holidayMult) || 1,
      requireJobCode: v,
      requireGps,
      requireNotesOnClockOut: requireNotes,
      requirePhotoOnClockOut: requirePhoto,
    });
  };
  const setGps = (v: boolean) => {
    setRequireGps(v);
    emit();
  };
  const setNotes = (v: boolean) => {
    setRequireNotes(v);
    emit();
  };
  const setPhoto = (v: boolean) => {
    setRequirePhoto(v);
    emit();
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fc-brand">Overtime thresholds</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="OT after hours per day" id="ot-day">
            <FormInput
              id="ot-day"
              type="number"
              min="0"
              step="0.5"
              value={otPerDay}
              onChange={(e) => setOtPerDay(e.target.value)}
              onBlur={emit}
            />
          </FormField>
          <FormField label="OT after hours per week" id="ot-week">
            <FormInput
              id="ot-week"
              type="number"
              min="0"
              step="0.5"
              value={otPerWeek}
              onChange={(e) => setOtPerWeek(e.target.value)}
              onBlur={emit}
            />
          </FormField>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fc-brand">Multipliers</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Weekend multiplier" id="weekend-mult">
            <FormInput
              id="weekend-mult"
              type="number"
              min="0"
              step="0.1"
              value={weekendMult}
              onChange={(e) => setWeekendMult(e.target.value)}
              onBlur={emit}
            />
          </FormField>
          <FormField label="Holiday multiplier" id="holiday-mult">
            <FormInput
              id="holiday-mult"
              type="number"
              min="0"
              step="0.1"
              value={holidayMult}
              onChange={(e) => setHolidayMult(e.target.value)}
              onBlur={emit}
            />
          </FormField>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fc-brand">Tracking preferences</h3>
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={requireJobCode}
              onChange={(e) => setJobCode(e.target.checked)}
              className="h-4 w-4 rounded border-fc-border accent-fc-accent"
            />
            <span className="text-sm text-fc-brand">Require job code on clock-in</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={requireGps}
              onChange={(e) => setGps(e.target.checked)}
              className="h-4 w-4 rounded border-fc-border accent-fc-accent"
            />
            <span className="text-sm text-fc-brand">Require GPS location</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={requireNotes}
              onChange={(e) => setNotes(e.target.checked)}
              className="h-4 w-4 rounded border-fc-border accent-fc-accent"
            />
            <span className="text-sm text-fc-brand">Require notes on clock-out</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={requirePhoto}
              onChange={(e) => setPhoto(e.target.checked)}
              className="h-4 w-4 rounded border-fc-border accent-fc-accent"
            />
            <span className="text-sm text-fc-brand">Require photo on clock-out</span>
          </label>
        </div>
      </Card>
    </div>
  );
}
