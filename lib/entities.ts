/**
 * Entity types for the time tracking app.
 * Company → OwnerUser → Projects → Jobs → TimeEntries
 * Workers assigned to jobs (multi-day or ad-hoc)
 */

export interface Company {
  id: string;
  name: string;
  address?: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  hourlyRate: number;
  companyId: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;          // Tailwind class, e.g. "bg-teal-400"
  companyId: string;
}

export interface JobType {
  id: string;
  name: string;
  companyId: string;
}

export interface Job {
  id: string;
  name: string;
  address: string;
  companyId: string;
  projectId?: string;     // optional: job belongs to a project
  typeId?: string;         // optional: job type (e.g., "Install", "Repair", "Maintenance")
  customerName?: string;   // optional: customer name
  revenue?: number;         // revenue for this job
  date?: string;          // ISO date (YYYY-MM-DD) - for single-day / backward compat
  time?: string;          // HH:mm 24h format
  startDate?: string;     // multi-day: start of range
  endDate?: string;       // multi-day: end of range
  hoursPerDay?: number;   // multi-day: set hours per day over the period
  hoursExpected?: number; // single-day / ad-hoc: total hours
  isAdhoc?: boolean;      // true = ad-hoc (one-off, can use different workers)
  workerIds?: string[];   // assigned workers (multiselect)
  status?: "scheduled" | "in_progress" | "completed" | "overdue";
  instructions?: string;  // notes for crew (access, scope, contact)
}

export type TimeEntryCategory = "billable" | "travel" | "admin" | "idle";

export interface TimeEntry {
  id: string;
  workerId: string;
  jobId: string;
  start: string; // ISO date string
  end: string;   // ISO date string
  breaks: number; // minutes
  category?: TimeEntryCategory; // default: "billable"
  isOvertime?: boolean; // true if hours exceed 40/week for worker
  notes?: string;
}

/** Input types for creating new entities (omit id) */
export type CompanyInput = Omit<Company, "id">;
export type ProjectInput = Omit<Project, "id">;
export type OwnerUserInput = Omit<OwnerUser, "id">;
export type WorkerInput = Omit<Worker, "id">;
export type JobTypeInput = Omit<JobType, "id">;
export type JobInput = Omit<Job, "id">;
export type TimeEntryInput = Omit<TimeEntry, "id">;
