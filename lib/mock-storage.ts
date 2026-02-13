/**
 * Mock local storage for entities.
 * Uses localStorage in the browser; falls back to in-memory when unavailable (SSR).
 */

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

const STORAGE_KEYS = {
  companies: "fc_companies",
  ownerUsers: "fc_owner_users",
  workers: "fc_workers",
  projects: "fc_projects",
  jobs: "fc_jobs",
  timeEntries: "fc_time_entries",
  jobTypes: "fc_job_types",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function get<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("mock-storage: failed to write", key, e);
  }
}

function uid(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Seed data used when storage is empty */
const SEED = {
  companies: [
    { id: "c1", name: "Field Crew HVAC", address: "100 Business Ave, City" },
  ] as Company[],
  ownerUsers: [
    { id: "ou1", email: "owner@fieldcrew.com", name: "Admin User", companyId: "c1" },
  ] as OwnerUser[],
  workers: [
    { id: "w1", name: "J. Martinez", phone: "(555) 123-4567", hourlyRate: 40, companyId: "c1" },
    { id: "w2", name: "M. Chen", phone: "(555) 234-5678", hourlyRate: 42, companyId: "c1" },
    { id: "w3", name: "R. Davis", phone: "(555) 345-6789", hourlyRate: 38, companyId: "c1" },
    { id: "w4", name: "S. Johnson", phone: "(555) 456-7890", hourlyRate: 45, companyId: "c1" },
  ] as Worker[],
  projects: [
    { id: "p1", name: "ASMobbin Campaign", color: "bg-teal-400", companyId: "c1" },
    { id: "p2", name: "Product Demo - A", color: "bg-violet-400", companyId: "c1" },
  ] as Project[],
  jobTypes: [
    { id: "jt1", name: "Installation", companyId: "c1" },
    { id: "jt2", name: "Repair", companyId: "c1" },
    { id: "jt3", name: "Maintenance", companyId: "c1" },
    { id: "jt4", name: "Inspection", companyId: "c1" },
  ] as JobType[],
  jobs: [
    // Current week jobs (Feb 10-16, 2026)
    {
      id: "j1",
      name: "Smith HVAC Install",
      address: "123 Main St",
      companyId: "c1",
      projectId: "p1",
      typeId: "jt1",
      customerName: "Smith Family",
      revenue: 4500,
      startDate: "2026-02-10",
      endDate: "2026-02-14",
      hoursPerDay: 4,
      workerIds: ["w1"],
      status: "completed",
    },
    {
      id: "j2",
      name: "Jones Furnace Repair",
      address: "456 Oak Ave",
      companyId: "c1",
      projectId: "p1",
      typeId: "jt2",
      customerName: "Jones Corp",
      revenue: 850,
      date: "2026-02-12",
      time: "09:00",
      hoursExpected: 3,
      isAdhoc: true,
      workerIds: ["w2"],
      status: "completed",
    },
    {
      id: "j3",
      name: "Williams Duct Cleaning",
      address: "789 Pine Rd",
      companyId: "c1",
      projectId: "p2",
      typeId: "jt3",
      customerName: "Williams Home",
      revenue: 1200,
      date: "2026-02-13",
      time: "10:00",
      hoursExpected: 4,
      workerIds: ["w1"],
      status: "in_progress",
    },
    {
      id: "j4",
      name: "Brown AC Installation",
      address: "321 Elm St",
      companyId: "c1",
      typeId: "jt1",
      customerName: "Brown Residence",
      revenue: 5200,
      startDate: "2026-02-11",
      endDate: "2026-02-15",
      hoursPerDay: 5,
      workerIds: ["w1", "w3"],
      status: "in_progress",
    },
    {
      id: "j5",
      name: "Taylor Emergency Repair",
      address: "654 Maple Dr",
      companyId: "c1",
      typeId: "jt2",
      customerName: "Taylor Business",
      revenue: 1200,
      date: "2026-02-13",
      hoursExpected: 2,
      workerIds: ["w2"],
      status: "completed",
    },
    {
      id: "j6",
      name: "Anderson Maintenance",
      address: "987 Cedar Ln",
      companyId: "c1",
      typeId: "jt3",
      customerName: "Anderson Property",
      revenue: 650,
      date: "2026-02-14",
      hoursExpected: 3,
      workerIds: ["w3"],
      status: "scheduled",
    },
    // Overrunning jobs (exceeding estimates)
    {
      id: "j7",
      name: "Miller Complex Install",
      address: "111 Tech Blvd",
      companyId: "c1",
      typeId: "jt1",
      customerName: "Miller Industries",
      revenue: 6800,
      date: "2026-02-12",
      hoursExpected: 6,
      workerIds: ["w1", "w4"],
      status: "in_progress",
    },
    {
      id: "j8",
      name: "Davis System Overhaul",
      address: "222 Industrial Way",
      companyId: "c1",
      typeId: "jt2",
      customerName: "Davis Manufacturing",
      revenue: 3200,
      date: "2026-02-11",
      hoursExpected: 8,
      workerIds: ["w2", "w3"],
      status: "in_progress",
    },
    {
      id: "j9",
      name: "Wilson Ductwork Repair",
      address: "333 Commerce St",
      companyId: "c1",
      typeId: "jt2",
      customerName: "Wilson Office Complex",
      revenue: 1850,
      date: "2026-02-13",
      hoursExpected: 4,
      workerIds: ["w3"],
      status: "in_progress",
    },
    {
      id: "j10",
      name: "Garcia Preventative Maintenance",
      address: "444 Residential Ave",
      companyId: "c1",
      typeId: "jt3",
      customerName: "Garcia Home",
      revenue: 420,
      date: "2026-02-14",
      hoursExpected: 2,
      workerIds: ["w4"],
      status: "completed",
    },
    {
      id: "j11",
      name: "Lee Inspection Service",
      address: "555 Business Park",
      companyId: "c1",
      typeId: "jt4",
      customerName: "Lee Properties",
      revenue: 350,
      date: "2026-02-15",
      hoursExpected: 2,
      workerIds: ["w2"],
      status: "scheduled",
    },
    // Last week jobs (for comparison)
    {
      id: "j12",
      name: "Thompson AC Install",
      address: "666 Main Street",
      companyId: "c1",
      typeId: "jt1",
      customerName: "Thompson Residence",
      revenue: 4800,
      date: "2026-02-03",
      hoursExpected: 5,
      workerIds: ["w1"],
      status: "completed",
    },
    {
      id: "j13",
      name: "White Furnace Service",
      address: "777 Oak Drive",
      companyId: "c1",
      typeId: "jt3",
      customerName: "White Family",
      revenue: 580,
      date: "2026-02-05",
      hoursExpected: 3,
      workerIds: ["w2"],
      status: "completed",
    },
    // Last 30 days jobs (for trend charts)
    {
      id: "j14",
      name: "Harris Duct Cleaning",
      address: "888 Pine Road",
      companyId: "c1",
      typeId: "jt3",
      customerName: "Harris Home",
      revenue: 950,
      date: "2026-01-20",
      hoursExpected: 4,
      workerIds: ["w3"],
      status: "completed",
    },
    {
      id: "j15",
      name: "Clark Emergency Repair",
      address: "999 Elm Street",
      companyId: "c1",
      typeId: "jt2",
      customerName: "Clark Business",
      revenue: 1100,
      date: "2026-01-25",
      hoursExpected: 3,
      workerIds: ["w2"],
      status: "completed",
    },
    {
      id: "j16",
      name: "Lewis Installation",
      address: "1010 Maple Ave",
      companyId: "c1",
      typeId: "jt1",
      customerName: "Lewis Industries",
      revenue: 5500,
      date: "2026-01-28",
      hoursExpected: 6,
      workerIds: ["w1", "w4"],
      status: "completed",
    },
  ] as Job[],
  timeEntries: [
    // Current week - Job 1 (Smith HVAC Install) - Completed
    {
      id: "te1",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-10T08:00:00Z",
      end: "2026-02-10T12:30:00Z",
      breaks: 30,
      category: "billable",
      notes: "Morning install",
    },
    {
      id: "te2",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-10T13:00:00Z",
      end: "2026-02-10T17:00:00Z",
      breaks: 0,
      category: "billable",
    },
    {
      id: "te3",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-11T08:00:00Z",
      end: "2026-02-11T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te4",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te5",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-13T08:00:00Z",
      end: "2026-02-13T12:00:00Z",
      breaks: 0,
      category: "billable",
    },
    {
      id: "te6",
      workerId: "w1",
      jobId: "j1",
      start: "2026-02-10T12:30:00Z",
      end: "2026-02-10T13:00:00Z",
      breaks: 0,
      category: "admin",
    },
    // Current week - Job 2 (Jones Furnace Repair)
    {
      id: "te7",
      workerId: "w2",
      jobId: "j2",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T08:30:00Z",
      breaks: 0,
      category: "travel",
    },
    {
      id: "te8",
      workerId: "w2",
      jobId: "j2",
      start: "2026-02-12T09:00:00Z",
      end: "2026-02-12T12:30:00Z",
      breaks: 30,
      category: "billable",
    },
    // Current week - Job 3 (Williams Duct Cleaning) - Overrunning (expected 4, actual 6.5)
    {
      id: "te9",
      workerId: "w1",
      jobId: "j3",
      start: "2026-02-13T09:00:00Z",
      end: "2026-02-13T09:45:00Z",
      breaks: 0,
      category: "travel",
    },
    {
      id: "te10",
      workerId: "w1",
      jobId: "j3",
      start: "2026-02-13T10:00:00Z",
      end: "2026-02-13T15:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te11",
      workerId: "w1",
      jobId: "j3",
      start: "2026-02-13T16:00:00Z",
      end: "2026-02-13T18:00:00Z",
      breaks: 0,
      category: "billable",
    },
    // Current week - Job 4 (Brown AC Installation) - Overrunning (expected 5/day, actual more)
    {
      id: "te12",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-11T08:00:00Z",
      end: "2026-02-11T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te13",
      workerId: "w3",
      jobId: "j4",
      start: "2026-02-11T08:00:00Z",
      end: "2026-02-11T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te14",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te15",
      workerId: "w3",
      jobId: "j4",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te16",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-13T08:00:00Z",
      end: "2026-02-13T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te17",
      workerId: "w3",
      jobId: "j4",
      start: "2026-02-13T08:00:00Z",
      end: "2026-02-13T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te18",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-13T18:00:00Z",
      end: "2026-02-13T22:00:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    {
      id: "te19",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-14T08:00:00Z",
      end: "2026-02-14T13:30:00Z",
      breaks: 30,
      category: "billable",
    },
    // Current week - Job 5 (Taylor Emergency Repair)
    {
      id: "te20",
      workerId: "w2",
      jobId: "j5",
      start: "2026-02-13T13:00:00Z",
      end: "2026-02-13T13:30:00Z",
      breaks: 0,
      category: "travel",
    },
    {
      id: "te21",
      workerId: "w2",
      jobId: "j5",
      start: "2026-02-13T14:00:00Z",
      end: "2026-02-13T16:30:00Z",
      breaks: 0,
      category: "billable",
    },
    {
      id: "te22",
      workerId: "w2",
      jobId: "j5",
      start: "2026-02-13T16:30:00Z",
      end: "2026-02-13T17:00:00Z",
      breaks: 0,
      category: "idle",
    },
    // Current week - Job 7 (Miller Complex Install) - Overrunning (expected 6, actual 9)
    {
      id: "te23",
      workerId: "w1",
      jobId: "j7",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te24",
      workerId: "w4",
      jobId: "j7",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te25",
      workerId: "w1",
      jobId: "j7",
      start: "2026-02-12T13:30:00Z",
      end: "2026-02-12T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te26",
      workerId: "w4",
      jobId: "j7",
      start: "2026-02-12T13:30:00Z",
      end: "2026-02-12T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te27",
      workerId: "w1",
      jobId: "j7",
      start: "2026-02-12T18:30:00Z",
      end: "2026-02-12T21:00:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    // Current week - Job 8 (Davis System Overhaul) - Overrunning (expected 8, actual 11)
    {
      id: "te28",
      workerId: "w2",
      jobId: "j8",
      start: "2026-02-11T08:00:00Z",
      end: "2026-02-11T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te29",
      workerId: "w3",
      jobId: "j8",
      start: "2026-02-11T08:00:00Z",
      end: "2026-02-11T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te30",
      workerId: "w2",
      jobId: "j8",
      start: "2026-02-11T13:30:00Z",
      end: "2026-02-11T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te31",
      workerId: "w3",
      jobId: "j8",
      start: "2026-02-11T13:30:00Z",
      end: "2026-02-11T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te32",
      workerId: "w2",
      jobId: "j8",
      start: "2026-02-11T18:30:00Z",
      end: "2026-02-11T21:30:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    {
      id: "te33",
      workerId: "w3",
      jobId: "j8",
      start: "2026-02-11T18:30:00Z",
      end: "2026-02-11T21:30:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    // Current week - Job 9 (Wilson Ductwork Repair) - Overrunning (expected 4, actual 6)
    {
      id: "te34",
      workerId: "w3",
      jobId: "j9",
      start: "2026-02-13T08:00:00Z",
      end: "2026-02-13T08:30:00Z",
      breaks: 0,
      category: "travel",
    },
    {
      id: "te35",
      workerId: "w3",
      jobId: "j9",
      start: "2026-02-13T09:00:00Z",
      end: "2026-02-13T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te36",
      workerId: "w3",
      jobId: "j9",
      start: "2026-02-13T13:30:00Z",
      end: "2026-02-13T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te37",
      workerId: "w3",
      jobId: "j9",
      start: "2026-02-13T18:30:00Z",
      end: "2026-02-13T20:30:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    // Current week - Job 10 (Garcia Preventative Maintenance)
    {
      id: "te38",
      workerId: "w4",
      jobId: "j10",
      start: "2026-02-14T08:00:00Z",
      end: "2026-02-14T10:00:00Z",
      breaks: 0,
      category: "billable",
    },
    {
      id: "te39",
      workerId: "w4",
      jobId: "j10",
      start: "2026-02-14T10:00:00Z",
      end: "2026-02-14T10:15:00Z",
      breaks: 0,
      category: "admin",
    },
    // More overtime entries for w1 (high OT worker)
    {
      id: "te40",
      workerId: "w1",
      jobId: "j4",
      start: "2026-02-14T18:00:00Z",
      end: "2026-02-14T21:00:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    {
      id: "te41",
      workerId: "w2",
      jobId: "j8",
      start: "2026-02-12T08:00:00Z",
      end: "2026-02-12T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te42",
      workerId: "w2",
      jobId: "j8",
      start: "2026-02-12T18:00:00Z",
      end: "2026-02-12T21:00:00Z",
      breaks: 0,
      category: "billable",
      isOvertime: true,
    },
    // Last week entries (for comparison)
    {
      id: "te43",
      workerId: "w1",
      jobId: "j12",
      start: "2026-02-03T08:00:00Z",
      end: "2026-02-03T13:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te44",
      workerId: "w1",
      jobId: "j12",
      start: "2026-02-03T13:30:00Z",
      end: "2026-02-03T18:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te45",
      workerId: "w2",
      jobId: "j13",
      start: "2026-02-05T09:00:00Z",
      end: "2026-02-05T12:00:00Z",
      breaks: 0,
      category: "billable",
    },
    // Last 30 days entries (for trend charts)
    {
      id: "te46",
      workerId: "w3",
      jobId: "j14",
      start: "2026-01-20T08:00:00Z",
      end: "2026-01-20T12:30:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te47",
      workerId: "w2",
      jobId: "j15",
      start: "2026-01-25T10:00:00Z",
      end: "2026-01-25T13:00:00Z",
      breaks: 0,
      category: "billable",
    },
    {
      id: "te48",
      workerId: "w1",
      jobId: "j16",
      start: "2026-01-28T08:00:00Z",
      end: "2026-01-28T14:00:00Z",
      breaks: 30,
      category: "billable",
    },
    {
      id: "te49",
      workerId: "w4",
      jobId: "j16",
      start: "2026-01-28T08:00:00Z",
      end: "2026-01-28T14:00:00Z",
      breaks: 30,
      category: "billable",
    },
    // More idle time entries
    {
      id: "te50",
      workerId: "w3",
      jobId: "j6",
      start: "2026-02-14T14:00:00Z",
      end: "2026-02-14T15:00:00Z",
      breaks: 0,
      category: "idle",
    },
    {
      id: "te51",
      workerId: "w4",
      jobId: "j11",
      start: "2026-02-15T08:00:00Z",
      end: "2026-02-15T10:00:00Z",
      breaks: 0,
      category: "billable",
    },
  ] as TimeEntry[],
};

function ensureSeeded() {
  if (!isBrowser()) return;
  const companies = get<Company[]>(STORAGE_KEYS.companies, []);
  // Always seed if empty or if we want to reset (for development)
  // Check if any key is missing or empty
  const jobs = get<Job[]>(STORAGE_KEYS.jobs, []);
  const workers = get<Worker[]>(STORAGE_KEYS.workers, []);
  const timeEntries = get<TimeEntry[]>(STORAGE_KEYS.timeEntries, []);
  const jobTypes = get<JobType[]>(STORAGE_KEYS.jobTypes, []);
  
  if (companies.length === 0 || jobs.length === 0 || workers.length === 0 || timeEntries.length === 0 || jobTypes.length === 0) {
    set(STORAGE_KEYS.companies, SEED.companies);
    set(STORAGE_KEYS.ownerUsers, SEED.ownerUsers);
    set(STORAGE_KEYS.workers, SEED.workers);
    set(STORAGE_KEYS.projects, SEED.projects);
    set(STORAGE_KEYS.jobTypes, SEED.jobTypes);
    set(STORAGE_KEYS.jobs, SEED.jobs);
    set(STORAGE_KEYS.timeEntries, SEED.timeEntries);
  }
}

/** Call on app init to ensure data exists */
export function initMockStorage() {
  ensureSeeded();
}

// ─── Companies ─────────────────────────────────────────────────────────────
export function getCompanies(): Company[] {
  ensureSeeded();
  return get<Company[]>(STORAGE_KEYS.companies, SEED.companies);
}
export function addCompany(input: CompanyInput): Company {
  const companies = getCompanies();
  const company: Company = { ...input, id: uid() };
  set(STORAGE_KEYS.companies, [...companies, company]);
  return company;
}
export function updateCompany(id: string, input: Partial<CompanyInput>): Company | null {
  const companies = getCompanies();
  const i = companies.findIndex((c) => c.id === id);
  if (i < 0) return null;
  companies[i] = { ...companies[i], ...input };
  set(STORAGE_KEYS.companies, companies);
  return companies[i];
}
export function deleteCompany(id: string): boolean {
  const companies = getCompanies().filter((c) => c.id !== id);
  set(STORAGE_KEYS.companies, companies);
  return true;
}

// ─── OwnerUsers ────────────────────────────────────────────────────────────
export function getOwnerUsers(): OwnerUser[] {
  ensureSeeded();
  return get<OwnerUser[]>(STORAGE_KEYS.ownerUsers, SEED.ownerUsers);
}
export function addOwnerUser(input: OwnerUserInput): OwnerUser {
  const users = getOwnerUsers();
  const user: OwnerUser = { ...input, id: uid() };
  set(STORAGE_KEYS.ownerUsers, [...users, user]);
  return user;
}
export function updateOwnerUser(id: string, input: Partial<OwnerUserInput>): OwnerUser | null {
  const users = getOwnerUsers();
  const i = users.findIndex((u) => u.id === id);
  if (i < 0) return null;
  users[i] = { ...users[i], ...input };
  set(STORAGE_KEYS.ownerUsers, users);
  return users[i];
}

// ─── Workers ───────────────────────────────────────────────────────────────
export function getWorkers(companyId?: string): Worker[] {
  ensureSeeded();
  const workers = get<Worker[]>(STORAGE_KEYS.workers, SEED.workers);
  return companyId ? workers.filter((w) => w.companyId === companyId) : workers;
}
export function addWorker(input: WorkerInput): Worker {
  const workers = getWorkers();
  const worker: Worker = { ...input, id: uid() };
  set(STORAGE_KEYS.workers, [...workers, worker]);
  return worker;
}
export function updateWorker(id: string, input: Partial<WorkerInput>): Worker | null {
  const workers = getWorkers();
  const i = workers.findIndex((w) => w.id === id);
  if (i < 0) return null;
  workers[i] = { ...workers[i], ...input };
  set(STORAGE_KEYS.workers, workers);
  return workers[i];
}
export function deleteWorker(id: string): boolean {
  const workers = getWorkers().filter((w) => w.id !== id);
  set(STORAGE_KEYS.workers, workers);
  return true;
}

// ─── Projects ───────────────────────────────────────────────────────────────
export function getProjects(companyId?: string): Project[] {
  ensureSeeded();
  const projects = get<Project[]>(STORAGE_KEYS.projects, SEED.projects);
  return companyId ? projects.filter((p) => p.companyId === companyId) : projects;
}
export function addProject(input: ProjectInput): Project {
  const projects = getProjects();
  const newProject: Project = { ...input, id: uid() };
  set(STORAGE_KEYS.projects, [...projects, newProject]);
  return newProject;
}
export function updateProject(id: string, input: Partial<ProjectInput>): Project | null {
  const projects = getProjects();
  const i = projects.findIndex((p) => p.id === id);
  if (i < 0) return null;
  projects[i] = { ...projects[i], ...input };
  set(STORAGE_KEYS.projects, projects);
  return projects[i];
}
export function deleteProject(id: string): boolean {
  const projects = getProjects().filter((p) => p.id !== id);
  set(STORAGE_KEYS.projects, projects);
  return true;
}

// ─── Jobs ──────────────────────────────────────────────────────────────────
export function getJobs(companyId?: string, projectId?: string): Job[] {
  ensureSeeded();
  let jobs = get<Job[]>(STORAGE_KEYS.jobs, SEED.jobs);
  if (companyId) jobs = jobs.filter((j) => j.companyId === companyId);
  if (projectId) jobs = jobs.filter((j) => j.projectId === projectId);
  return jobs;
}
export function addJob(input: JobInput): Job {
  const jobs = getJobs();
  const job: Job = { ...input, id: uid() };
  set(STORAGE_KEYS.jobs, [...jobs, job]);
  return job;
}
export function updateJob(id: string, input: Partial<JobInput>): Job | null {
  const jobs = getJobs();
  const i = jobs.findIndex((j) => j.id === id);
  if (i < 0) return null;
  jobs[i] = { ...jobs[i], ...input };
  set(STORAGE_KEYS.jobs, jobs);
  return jobs[i];
}
export function deleteJob(id: string): boolean {
  const jobs = getJobs().filter((j) => j.id !== id);
  set(STORAGE_KEYS.jobs, jobs);
  return true;
}

// ─── TimeEntries ───────────────────────────────────────────────────────────
export function getTimeEntries(workerId?: string, jobId?: string): TimeEntry[] {
  ensureSeeded();
  let entries = get<TimeEntry[]>(STORAGE_KEYS.timeEntries, SEED.timeEntries);
  if (workerId) entries = entries.filter((e) => e.workerId === workerId);
  if (jobId) entries = entries.filter((e) => e.jobId === jobId);
  return entries;
}
export function addTimeEntry(input: TimeEntryInput): TimeEntry {
  const entries = getTimeEntries();
  const entry: TimeEntry = { ...input, id: uid() };
  set(STORAGE_KEYS.timeEntries, [...entries, entry]);
  return entry;
}
export function updateTimeEntry(id: string, input: Partial<TimeEntryInput>): TimeEntry | null {
  const entries = getTimeEntries();
  const i = entries.findIndex((e) => e.id === id);
  if (i < 0) return null;
  entries[i] = { ...entries[i], ...input };
  set(STORAGE_KEYS.timeEntries, entries);
  return entries[i];
}
export function deleteTimeEntry(id: string): boolean {
  const entries = getTimeEntries().filter((e) => e.id !== id);
  set(STORAGE_KEYS.timeEntries, entries);
  return true;
}

// ─── JobTypes ────────────────────────────────────────────────────────────────
export function getJobTypes(companyId?: string): JobType[] {
  ensureSeeded();
  const jobTypes = get<JobType[]>(STORAGE_KEYS.jobTypes, SEED.jobTypes);
  return companyId ? jobTypes.filter((jt) => jt.companyId === companyId) : jobTypes;
}
export function addJobType(input: JobTypeInput): JobType {
  const jobTypes = getJobTypes();
  const jobType: JobType = { ...input, id: uid() };
  set(STORAGE_KEYS.jobTypes, [...jobTypes, jobType]);
  return jobType;
}
export function updateJobType(id: string, input: Partial<JobTypeInput>): JobType | null {
  const jobTypes = getJobTypes();
  const i = jobTypes.findIndex((jt) => jt.id === id);
  if (i < 0) return null;
  jobTypes[i] = { ...jobTypes[i], ...input };
  set(STORAGE_KEYS.jobTypes, jobTypes);
  return jobTypes[i];
}
export function deleteJobType(id: string): boolean {
  const jobTypes = getJobTypes().filter((jt) => jt.id !== id);
  set(STORAGE_KEYS.jobTypes, jobTypes);
  return true;
}
