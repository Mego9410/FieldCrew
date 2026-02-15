"use client";

import { useState } from "react";
import { addTimeEntry, updateTimeEntry } from "@/lib/data";
import { useWorkers, useJobs } from "@/lib/hooks/useData";
import type { TimeEntry, TimeEntryInput } from "@/lib/entities";
import { FormField, FormInput, FormSelect, FormTextarea } from "./FormField";

interface TimeEntryFormProps {
  timeEntry?: TimeEntry | null;
  workerId?: string;
  jobId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function toLocalDateTimeStr(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TimeEntryForm({
  timeEntry,
  workerId: propWorkerId,
  jobId: propJobId,
  onSuccess,
  onCancel,
}: TimeEntryFormProps) {
  const { items: workers } = useWorkers();
  const { items: jobs } = useJobs();

  const defaultStart = timeEntry?.start
    ? new Date(timeEntry.start)
    : new Date();
  const defaultEnd = timeEntry?.end
    ? new Date(timeEntry.end)
    : new Date(Date.now() + 60 * 60 * 1000);

  const [workerId, setWorkerId] = useState(
    propWorkerId ?? timeEntry?.workerId ?? workers[0]?.id ?? ""
  );
  const [jobId, setJobId] = useState(
    propJobId ?? timeEntry?.jobId ?? jobs[0]?.id ?? ""
  );
  const [start, setStart] = useState(toLocalDateTimeStr(defaultStart));
  const [end, setEnd] = useState(toLocalDateTimeStr(defaultEnd));
  const [breaks, setBreaks] = useState(timeEntry?.breaks?.toString() ?? "0");
  const [notes, setNotes] = useState(timeEntry?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!workerId) {
      setError("Worker is required");
      return;
    }
    if (!jobId) {
      setError("Job is required");
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Valid start and end times are required");
      return;
    }
    if (endDate <= startDate) {
      setError("End time must be after start time");
      return;
    }
    const breakMins = parseInt(breaks, 10);
    if (isNaN(breakMins) || breakMins < 0) {
      setError("Breaks must be a non-negative number (minutes)");
      return;
    }

    const input: TimeEntryInput = {
      workerId,
      jobId,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      breaks: breakMins,
      notes: notes.trim() || undefined,
    };

    try {
      if (timeEntry) {
        await updateTimeEntry(timeEntry.id, input);
      } else {
        await addTimeEntry(input);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save time entry");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!propWorkerId && (
        <FormField label="Worker" id="timeentry-worker" required>
          <FormSelect
            id="timeentry-worker"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
          >
            <option value="">Select worker…</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </FormSelect>
        </FormField>
      )}
      {!propJobId && (
        <FormField label="Job" id="timeentry-job" required>
          <FormSelect
            id="timeentry-job"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          >
            <option value="">Select job…</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name} — {j.address}
              </option>
            ))}
          </FormSelect>
        </FormField>
      )}
      <FormField label="Start" id="timeentry-start" required>
        <FormInput
          id="timeentry-start"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </FormField>
      <FormField label="End" id="timeentry-end" required>
        <FormInput
          id="timeentry-end"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </FormField>
      <FormField label="Breaks (minutes)" id="timeentry-breaks" required>
        <FormInput
          id="timeentry-breaks"
          type="number"
          min="0"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
          placeholder="0"
        />
      </FormField>
      <FormField label="Notes" id="timeentry-notes">
        <FormTextarea
          id="timeentry-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes…"
        />
      </FormField>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          {timeEntry ? "Update" : "Create"} time entry
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
