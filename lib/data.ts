/**
 * Supabase-backed data layer.
 * Replaces mock-storage with async Supabase queries for better performance.
 */

import { createClient } from "@/lib/supabase/client";
import type {
  Company,
  OwnerUser,
  Worker,
  Project,
  Job,
  TimeEntry,
  JobType,
  CompanyInput,
  OwnerUserInput,
  WorkerInput,
  ProjectInput,
  JobInput,
  TimeEntryInput,
  JobTypeInput,
} from "./entities";

type SupabaseClient = ReturnType<typeof createClient>;

function uid(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Row mappers (snake_case ↔ camelCase) ───────────────────────────────────

function toCompany(r: Record<string, unknown>): Company {
  return {
    id: r.id as string,
    name: r.name as string,
    address: r.address as string | undefined,
  };
}

function toOwnerUser(r: Record<string, unknown>): OwnerUser {
  return {
    id: r.id as string,
    email: r.email as string,
    name: r.name as string,
    companyId: r.company_id as string,
  };
}

function toWorker(r: Record<string, unknown>): Worker {
  return {
    id: r.id as string,
    name: r.name as string,
    phone: r.phone as string,
    hourlyRate: Number(r.hourly_rate ?? 0),
    companyId: r.company_id as string,
  };
}

function toProject(r: Record<string, unknown>): Project {
  return {
    id: r.id as string,
    name: r.name as string,
    color: (r.color as string) ?? "bg-slate-400",
    companyId: r.company_id as string,
  };
}

function toJobType(r: Record<string, unknown>): JobType {
  return {
    id: r.id as string,
    name: r.name as string,
    companyId: r.company_id as string,
  };
}

function toJob(r: Record<string, unknown>): Job {
  const row = r as Record<string, unknown>;
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    companyId: row.company_id as string,
    projectId: row.project_id as string | undefined,
    typeId: row.type_id as string | undefined,
    customerName: row.customer_name as string | undefined,
    revenue: row.revenue != null ? Number(row.revenue) : undefined,
    date: row.date as string | undefined,
    time: row.time as string | undefined,
    startDate: row.start_date as string | undefined,
    endDate: row.end_date as string | undefined,
    hoursPerDay: row.hours_per_day != null ? Number(row.hours_per_day) : undefined,
    hoursExpected: row.hours_expected != null ? Number(row.hours_expected) : undefined,
    isAdhoc: Boolean(row.is_adhoc),
    workerIds: Array.isArray(row.worker_ids) ? (row.worker_ids as string[]) : undefined,
    status: row.status as Job["status"],
  };
}

function toTimeEntry(r: Record<string, unknown>): TimeEntry {
  const row = r as Record<string, unknown>;
  const start = row.start;
  const end = row.end;
  return {
    id: row.id as string,
    workerId: row.worker_id as string,
    jobId: row.job_id as string,
    start: typeof start === "string" ? start : (start as Date)?.toISOString?.() ?? "",
    end: typeof end === "string" ? end : (end as Date)?.toISOString?.() ?? "",
    breaks: Number(row.breaks ?? 0),
    category: (row.category as TimeEntry["category"]) ?? "billable",
    isOvertime: Boolean(row.is_overtime),
    notes: row.notes as string | undefined,
  };
}

// ─── Companies ──────────────────────────────────────────────────────────────

export async function getCompanies(supabase?: SupabaseClient): Promise<Company[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("companies").select("*");
  if (error) throw error;
  return (data ?? []).map(toCompany);
}

export async function addCompany(input: CompanyInput, supabase?: SupabaseClient): Promise<Company> {
  const db = supabase ?? createClient();
  const company: Company = { ...input, id: uid() };
  const { error } = await db.from("companies").insert({
    id: company.id,
    name: company.name,
    address: company.address ?? null,
  });
  if (error) throw error;
  return company;
}

export async function updateCompany(id: string, input: Partial<CompanyInput>, supabase?: SupabaseClient): Promise<Company | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("companies")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.address != null && { address: input.address }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toCompany(data);
}

export async function deleteCompany(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("companies").delete().eq("id", id);
  return !error;
}

// ─── OwnerUsers ─────────────────────────────────────────────────────────────

export async function getOwnerUsers(supabase?: SupabaseClient): Promise<OwnerUser[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("owner_users").select("*");
  if (error) throw error;
  return (data ?? []).map(toOwnerUser);
}

export async function addOwnerUser(input: OwnerUserInput, supabase?: SupabaseClient): Promise<OwnerUser> {
  const db = supabase ?? createClient();
  const user: OwnerUser = { ...input, id: uid() };
  const { error } = await db.from("owner_users").insert({
    id: user.id,
    email: user.email,
    name: user.name,
    company_id: user.companyId,
  });
  if (error) throw error;
  return user;
}

export async function updateOwnerUser(id: string, input: Partial<OwnerUserInput>, supabase?: SupabaseClient): Promise<OwnerUser | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("owner_users")
    .update({
      ...(input.email != null && { email: input.email }),
      ...(input.name != null && { name: input.name }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toOwnerUser(data);
}

// ─── Workers ────────────────────────────────────────────────────────────────

export async function getWorkers(companyId?: string, supabase?: SupabaseClient): Promise<Worker[]> {
  const db = supabase ?? createClient();
  let q = db.from("workers").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toWorker);
}

export async function getWorker(id: string, supabase?: SupabaseClient): Promise<Worker | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("workers").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toWorker(data);
}

export async function addWorker(input: WorkerInput, supabase?: SupabaseClient): Promise<Worker> {
  const db = supabase ?? createClient();
  const worker: Worker = { ...input, id: uid() };
  const { error } = await db.from("workers").insert({
    id: worker.id,
    name: worker.name,
    phone: worker.phone,
    hourly_rate: worker.hourlyRate,
    company_id: worker.companyId,
  });
  if (error) throw error;
  return worker;
}

export async function updateWorker(id: string, input: Partial<WorkerInput>, supabase?: SupabaseClient): Promise<Worker | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("workers")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.phone != null && { phone: input.phone }),
      ...(input.hourlyRate != null && { hourly_rate: input.hourlyRate }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toWorker(data);
}

export async function deleteWorker(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("workers").delete().eq("id", id);
  return !error;
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function getProjects(companyId?: string, supabase?: SupabaseClient): Promise<Project[]> {
  const db = supabase ?? createClient();
  let q = db.from("projects").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function addProject(input: ProjectInput, supabase?: SupabaseClient): Promise<Project> {
  const db = supabase ?? createClient();
  const project: Project = { ...input, id: uid() };
  const { error } = await db.from("projects").insert({
    id: project.id,
    name: project.name,
    color: project.color,
    company_id: project.companyId,
  });
  if (error) throw error;
  return project;
}

export async function updateProject(id: string, input: Partial<ProjectInput>, supabase?: SupabaseClient): Promise<Project | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("projects")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.color != null && { color: input.color }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toProject(data);
}

export async function deleteProject(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("projects").delete().eq("id", id);
  return !error;
}

// ─── JobTypes ───────────────────────────────────────────────────────────────

export async function getJobTypes(companyId?: string, supabase?: SupabaseClient): Promise<JobType[]> {
  const db = supabase ?? createClient();
  let q = db.from("job_types").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toJobType);
}

export async function addJobType(input: JobTypeInput, supabase?: SupabaseClient): Promise<JobType> {
  const db = supabase ?? createClient();
  const jobType: JobType = { ...input, id: uid() };
  const { error } = await db.from("job_types").insert({
    id: jobType.id,
    name: jobType.name,
    company_id: jobType.companyId,
  });
  if (error) throw error;
  return jobType;
}

export async function updateJobType(id: string, input: Partial<JobTypeInput>, supabase?: SupabaseClient): Promise<JobType | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("job_types")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toJobType(data);
}

export async function deleteJobType(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("job_types").delete().eq("id", id);
  return !error;
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

export async function getJobs(companyId?: string, projectId?: string, supabase?: SupabaseClient): Promise<Job[]> {
  const db = supabase ?? createClient();
  let q = db.from("jobs").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toJob);
}

export async function getJobsForWorker(workerId: string, supabase?: SupabaseClient): Promise<Job[]> {
  const jobs = await getJobs(undefined, undefined, supabase);
  return jobs.filter((j) => j.workerIds?.includes(workerId));
}

export async function getJob(id: string, supabase?: SupabaseClient): Promise<Job | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("jobs").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toJob(data);
}

function jobToRow(input: JobInput & { id?: string }) {
  return {
    id: input.id ?? uid(),
    name: input.name,
    address: input.address,
    company_id: input.companyId,
    project_id: input.projectId ?? null,
    type_id: input.typeId ?? null,
    customer_name: input.customerName ?? null,
    revenue: input.revenue ?? null,
    date: input.date ?? null,
    time: input.time ?? null,
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    hours_per_day: input.hoursPerDay ?? null,
    hours_expected: input.hoursExpected ?? null,
    is_adhoc: input.isAdhoc ?? false,
    worker_ids: input.workerIds ?? [],
    status: input.status ?? "scheduled",
  };
}

export async function addJob(input: JobInput, supabase?: SupabaseClient): Promise<Job> {
  const db = supabase ?? createClient();
  const job: Job = { ...input, id: uid() };
  const row = jobToRow({ ...job });
  row.id = job.id;
  const { error } = await db.from("jobs").insert(row);
  if (error) throw error;
  return job;
}

export async function updateJob(id: string, input: Partial<JobInput>, supabase?: SupabaseClient): Promise<Job | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if (input.address != null) updates.address = input.address;
  if (input.companyId != null) updates.company_id = input.companyId;
  if (input.projectId != null) updates.project_id = input.projectId;
  if (input.typeId != null) updates.type_id = input.typeId;
  if (input.customerName != null) updates.customer_name = input.customerName;
  if (input.revenue != null) updates.revenue = input.revenue;
  if (input.date != null) updates.date = input.date;
  if (input.time != null) updates.time = input.time;
  if (input.startDate != null) updates.start_date = input.startDate;
  if (input.endDate != null) updates.end_date = input.endDate;
  if (input.hoursPerDay != null) updates.hours_per_day = input.hoursPerDay;
  if (input.hoursExpected != null) updates.hours_expected = input.hoursExpected;
  if (input.isAdhoc != null) updates.is_adhoc = input.isAdhoc;
  if (input.workerIds != null) updates.worker_ids = input.workerIds;
  if (input.status != null) updates.status = input.status;
  const { data, error } = await db.from("jobs").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toJob(data);
}

export async function deleteJob(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("jobs").delete().eq("id", id);
  return !error;
}

// ─── TimeEntries ────────────────────────────────────────────────────────────

export async function getTimeEntries(workerId?: string, jobId?: string, supabase?: SupabaseClient): Promise<TimeEntry[]> {
  const db = supabase ?? createClient();
  let q = db.from("time_entries").select("*");
  if (workerId) q = q.eq("worker_id", workerId);
  if (jobId) q = q.eq("job_id", jobId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toTimeEntry);
}

export async function addTimeEntry(input: TimeEntryInput, supabase?: SupabaseClient): Promise<TimeEntry> {
  const db = supabase ?? createClient();
  const entry: TimeEntry = { ...input, id: uid() };
  const { error } = await db.from("time_entries").insert({
    id: entry.id,
    worker_id: entry.workerId,
    job_id: entry.jobId,
    start: entry.start,
    end: entry.end,
    breaks: entry.breaks ?? 0,
    category: entry.category ?? "billable",
    is_overtime: entry.isOvertime ?? false,
    notes: entry.notes ?? null,
  });
  if (error) throw error;
  return entry;
}

export async function updateTimeEntry(id: string, input: Partial<TimeEntryInput>, supabase?: SupabaseClient): Promise<TimeEntry | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.workerId != null) updates.worker_id = input.workerId;
  if (input.jobId != null) updates.job_id = input.jobId;
  if (input.start != null) updates.start = input.start;
  if (input.end != null) updates.end = input.end;
  if (input.breaks != null) updates.breaks = input.breaks;
  if (input.category != null) updates.category = input.category;
  if (input.isOvertime != null) updates.is_overtime = input.isOvertime;
  if (input.notes != null) updates.notes = input.notes;
  const { data, error } = await db.from("time_entries").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toTimeEntry(data);
}

export async function deleteTimeEntry(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("time_entries").delete().eq("id", id);
  return !error;
}
