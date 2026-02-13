"use client";

import { useState } from "react";
import { addJob, updateJob, getCompanies, getWorkers, getProjects } from "@/lib/mock-storage";
import type { Job, JobInput } from "@/lib/entities";
import { FormField, FormInput } from "./FormField";

interface JobFormProps {
  job?: Job | null;
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JobForm({ job, projectId: propProjectId, onSuccess, onCancel }: JobFormProps) {
  const companies = getCompanies();
  const workers = getWorkers();
  const projects = getProjects();
  const companyId = companies[0]?.id ?? job?.companyId ?? "";

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
  const [workerIds, setWorkerIds] = useState<string[]>(job?.workerIds ?? []);
  const [workerSearch, setWorkerSearch] = useState("");
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
    setWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const input: JobInput = {
      name: name.trim(),
      address: address.trim(),
      companyId,
      projectId: projectId || undefined,
      date: isMultiDay ? undefined : date,
      time: isMultiDay ? undefined : time,
      startDate: isMultiDay ? startDate : date,
      endDate: isMultiDay ? endDate : undefined,
      hoursPerDay: isMultiDay ? parseFloat(hoursPerDay) : undefined,
      hoursExpected: !isMultiDay && hoursExpected ? parseFloat(hoursExpected) : undefined,
      isAdhoc: !isMultiDay,
      workerIds: validWorkerIds.length > 0 ? validWorkerIds : undefined,
    };

    if (job) {
      updateJob(job.id, input);
    } else {
      addJob(input);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Job name" id="job-name" required>
        <FormInput
          id="job-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Smith HVAC Install"
          autoFocus
        />
      </FormField>
      <FormField label="Address" id="job-address" required>
        <FormInput
          id="job-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 123 Main St"
        />
      </FormField>
      {projects.length > 0 && !propProjectId && (
        <FormField label="Project" id="job-project">
          <select
            id="job-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
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
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-fc-brand">
          <input
            type="radio"
            name="job-type"
            checked={!isMultiDay}
            onChange={() => setIsMultiDay(false)}
            className="rounded border-fc-border text-fc-accent focus:ring-fc-accent"
          />
          Ad-hoc (single day)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-fc-brand">
          <input
            type="radio"
            name="job-type"
            checked={isMultiDay}
            onChange={() => setIsMultiDay(true)}
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
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormField>
          <FormField label="End date" id="job-end-date">
            <FormInput
              id="job-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormField>
          <FormField label="Hours per day" id="job-hours-per-day">
            <FormInput
              id="job-hours-per-day"
              type="number"
              min="0"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
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
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField label="Time" id="job-time">
            <FormInput
              id="job-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
          onChange={(e) => setHoursExpected(e.target.value)}
          placeholder="e.g. 4"
        />
      </FormField>
      )}
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
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
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
    </form>
  );
}
