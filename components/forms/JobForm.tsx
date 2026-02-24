"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { addJob, updateJob } from "@/lib/data";
import { useCompanies, useWorkers, useProjects, useJobTypes } from "@/lib/hooks/useData";
import type { Job, JobInput } from "@/lib/entities";
import { FormField, FormInput } from "./FormField";

interface JobFormProps {
  job?: Job | null;
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  /** Called when the user has changed any field (for backdrop-close confirmation). */
  onDirtyChange?: (dirty: boolean) => void;
}

export function JobForm({ job, projectId: propProjectId, onSuccess, onCancel, onDirtyChange }: JobFormProps) {
  const { items: companies } = useCompanies();
  const { items: workers } = useWorkers();
  const { items: projects } = useProjects();
  const companyId = companies[0]?.id ?? job?.companyId ?? "";
  const { items: jobTypes } = useJobTypes(companyId || undefined);

  const dirtyRef = useRef(false);
  const markDirty = useCallback(() => {
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      onDirtyChange?.(true);
    }
  }, [onDirtyChange]);
  useEffect(() => {
    onDirtyChange?.(false);
  }, [onDirtyChange]);

  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState(job?.name ?? "");
  const [address, setAddress] = useState(job?.address ?? "");
  const [projectId, setProjectId] = useState(propProjectId ?? job?.projectId ?? projects[0]?.id ?? "");
  const [isMultiDay, setIsMultiDay] = useState(
    Boolean(job?.startDate && job?.endDate && job?.hoursPerDay != null)
  );
  const [startDate, setStartDate] = useState(job?.startDate ?? job?.date ?? today);
  const [endDate, setEndDate] = useState(job?.endDate ?? job?.date ?? today);
  const [date, setDate] = useState(job?.date ?? today);
  const [time, setTime] = useState(job?.time ?? "09:00");
  const [hoursPerDay, setHoursPerDay] = useState(job?.hoursPerDay?.toString() ?? "4");
  const [hoursExpected, setHoursExpected] = useState(job?.hoursExpected?.toString() ?? "");
  const [workerIds, setWorkerIds] = useState<string[]>(
    job?.workerIds ?? (workers.some((w) => w.id === "test-worker") ? ["test-worker"] : [])
  );
  const [workerSearch, setWorkerSearch] = useState("");
  const [typeId, setTypeId] = useState(job?.typeId ?? "");
  const [customerName, setCustomerName] = useState(job?.customerName ?? "");
  const [revenue, setRevenue] = useState(job?.revenue != null ? String(job.revenue) : "");
  const [status, setStatus] = useState<Job["status"]>(job?.status ?? "scheduled");
  const [instructions, setInstructions] = useState(job?.instructions ?? "");
  const [error, setError] = useState<string | null>(null);

  const companyWorkers = workers.filter((w) => w.companyId === companyId);
  const filteredWorkers = workerSearch.trim()
    ? companyWorkers.filter(
        (w) =>
          w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
          w.phone.includes(workerSearch)
      )
    : companyWorkers;

  const toggleWorker = (id: string) => {
    markDirty();
    setWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Job name is required");
      return;
    }
    if (!address.trim()) {
      setError("Address is required");
      return;
    }
    if (!companyId) {
      setError("No company configured. Please set up a company first.");
      return;
    }
    if (isMultiDay) {
      const hrsPer = parseFloat(hoursPerDay);
      if (isNaN(hrsPer) || hrsPer < 0) {
        setError("Hours per day must be a valid positive number");
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setError("End date must be on or after start date");
        return;
      }
    } else {
      const hrs = parseFloat(hoursExpected);
      if (hoursExpected !== "" && (isNaN(hrs) || hrs < 0)) {
        setError("Hours expected must be a valid positive number");
        return;
      }
    }

    const companyWorkerIds = companyWorkers.map((w) => w.id);
    const validWorkerIds = workerIds.filter((id) => companyWorkerIds.includes(id));

    const revenueNum = revenue.trim() !== "" ? parseFloat(revenue) : undefined;
    if (revenue.trim() !== "" && (revenueNum === undefined || isNaN(revenueNum) || revenueNum < 0)) {
      setError("Revenue must be a valid positive number");
      return;
    }

    const input: JobInput = {
      name: name.trim(),
      address: address.trim(),
      companyId,
      projectId: projectId || undefined,
      typeId: typeId || undefined,
      customerName: customerName.trim() || undefined,
      revenue: revenueNum,
      date: isMultiDay ? undefined : date,
      time: isMultiDay ? undefined : time,
      startDate: isMultiDay ? startDate : date,
      endDate: isMultiDay ? endDate : undefined,
      hoursPerDay: isMultiDay ? parseFloat(hoursPerDay) : undefined,
      hoursExpected: !isMultiDay && hoursExpected ? parseFloat(hoursExpected) : undefined,
      isAdhoc: !isMultiDay,
      workerIds: validWorkerIds.length > 0 ? validWorkerIds : undefined,
      status: job ? status : "scheduled",
      instructions: job ? instructions.trim() : (instructions.trim() || undefined),
    };

    try {
      if (job) {
        await updateJob(job.id, input);
      } else {
        await addJob(input);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
      <FormField label="Job name" id="job-name" required>
        <FormInput
          id="job-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); markDirty(); }}
          placeholder="e.g. Smith HVAC Install"
          autoFocus
        />
      </FormField>
      <FormField label="Address" id="job-address" required>
        <FormInput
          id="job-address"
          type="text"
          value={address}
          onChange={(e) => { setAddress(e.target.value); markDirty(); }}
          placeholder="e.g. 123 Main St"
        />
      </FormField>
      {projects.length > 0 && !propProjectId && (
        <FormField label="Project" id="job-project">
          <select
            id="job-project"
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); markDirty(); }}
            className="w-full rounded-lg border border-fc-border bg-white py-2 px-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FormField>
      )}
      {jobTypes.length > 0 && (
        <FormField label="Job type" id="job-type">
          <select
            id="job-type"
            value={typeId}
            onChange={(e) => { setTypeId(e.target.value); markDirty(); }}
            className="w-full rounded-lg border border-fc-border bg-white py-2 px-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          >
            <option value="">No type</option>
            {jobTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </FormField>
      )}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-fc-brand">
          <input
            type="radio"
            name="job-type"
            checked={!isMultiDay}
            onChange={() => { setIsMultiDay(false); markDirty(); }}
            className="rounded border-fc-border text-fc-accent focus:ring-fc-accent"
          />
          Ad-hoc (single day)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-fc-brand">
          <input
            type="radio"
            name="job-type"
            checked={isMultiDay}
            onChange={() => { setIsMultiDay(true); markDirty(); }}
            className="rounded border-fc-border text-fc-accent focus:ring-fc-accent"
          />
          Multi-day (set hours over period)
        </label>
      </div>
      {isMultiDay ? (
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start date" id="job-start-date">
            <FormInput
              id="job-start-date"
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); markDirty(); }}
            />
          </FormField>
          <FormField label="End date" id="job-end-date">
            <FormInput
              id="job-end-date"
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); markDirty(); }}
            />
          </FormField>
          <FormField label="Hours per day" id="job-hours-per-day">
            <FormInput
              id="job-hours-per-day"
              type="number"
              min="0"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => { setHoursPerDay(e.target.value); markDirty(); }}
              placeholder="e.g. 4"
            />
          </FormField>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" id="job-date">
            <FormInput
              id="job-date"
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); markDirty(); }}
            />
          </FormField>
          <FormField label="Time" id="job-time">
            <FormInput
              id="job-time"
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); markDirty(); }}
            />
          </FormField>
        </div>
      )}
      {!isMultiDay && (
      <FormField label="Hours expected" id="job-hours-expected">
        <FormInput
          id="job-hours-expected"
          type="number"
          min="0"
          step="0.5"
          value={hoursExpected}
          onChange={(e) => { setHoursExpected(e.target.value); markDirty(); }}
          placeholder="e.g. 4"
        />
      </FormField>
      )}
      <FormField label="Customer name" id="job-customer">
        <FormInput
          id="job-customer"
          type="text"
          value={customerName}
          onChange={(e) => { setCustomerName(e.target.value); markDirty(); }}
          placeholder="e.g. Smith Family"
        />
      </FormField>
      <FormField label="Revenue" id="job-revenue">
        <FormInput
          id="job-revenue"
          type="number"
          min={0}
          step={0.01}
          value={revenue}
          onChange={(e) => { setRevenue(e.target.value); markDirty(); }}
          placeholder="e.g. 4500"
        />
      </FormField>
      {job && (
        <FormField label="Status" id="job-status">
          <select
            id="job-status"
            value={status}
            onChange={(e) => { setStatus(e.target.value as Job["status"]); markDirty(); }}
            className="w-full rounded-lg border border-fc-border bg-white py-2 px-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </FormField>
      )}
      <FormField label="Instructions for crew" id="job-instructions">
        <textarea
          id="job-instructions"
          value={instructions}
          onChange={(e) => { setInstructions(e.target.value); markDirty(); }}
          placeholder="Access codes, site contact, scope notes…"
          rows={3}
          className="w-full rounded-lg border border-fc-border bg-white py-2 px-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent resize-y"
        />
      </FormField>
      <FormField label="Workers" id="job-workers">
        <input
          type="search"
          placeholder="Search workers…"
          value={workerSearch}
          onChange={(e) => setWorkerSearch(e.target.value)}
          className="mb-2 w-full rounded-lg border border-fc-border bg-white py-2 px-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          aria-label="Search workers"
        />
        <div className="max-h-40 overflow-y-auto rounded-lg border border-fc-border bg-white p-3 space-y-2">
          {filteredWorkers.map((worker) => (
            <label
              key={worker.id}
              className="flex items-center gap-2 cursor-pointer text-sm text-fc-brand hover:bg-slate-50 rounded px-2 py-1.5 -mx-2 -my-1"
            >
              <input
                type="checkbox"
                checked={workerIds.includes(worker.id)}
                onChange={() => toggleWorker(worker.id)}
                className="rounded border-fc-border text-fc-accent focus:ring-fc-accent"
              />
              {worker.name}
            </label>
          ))}
          {filteredWorkers.length === 0 && (
            <p className="text-sm text-fc-muted">
              {companyWorkers.length === 0
                ? "No workers in this company yet."
                : "No workers match your search."}
            </p>
          )}
        </div>
      </FormField>
      </div>
      <div className="flex shrink-0 flex-col gap-2 border-t border-fc-border pt-4 mt-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
          >
            {job ? "Update" : "Create"} job
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
      </div>
    </form>
  );
}
