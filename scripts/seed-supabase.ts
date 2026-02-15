/**
 * Seed Supabase with test data from mock-storage.
 * Run: npx tsx scripts/seed-supabase.ts
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";

// Load .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const companies = [
  { id: "c1", name: "Field Crew HVAC", address: "100 Business Ave, City" },
];

const ownerUsers = [
  { id: "ou1", email: "owner@fieldcrew.com", name: "Admin User", company_id: "c1" },
];

const workers = [
  { id: "test-worker", name: "Test Worker", phone: "(555) 000-0000", hourly_rate: 40, company_id: "c1" },
  { id: "w1", name: "J. Martinez", phone: "(555) 123-4567", hourly_rate: 40, company_id: "c1" },
  { id: "w2", name: "M. Chen", phone: "(555) 234-5678", hourly_rate: 42, company_id: "c1" },
  { id: "w3", name: "R. Davis", phone: "(555) 345-6789", hourly_rate: 38, company_id: "c1" },
  { id: "w4", name: "S. Johnson", phone: "(555) 456-7890", hourly_rate: 45, company_id: "c1" },
];

const projects = [
  { id: "p1", name: "ASMobbin Campaign", color: "bg-teal-400", company_id: "c1" },
  { id: "p2", name: "Product Demo - A", color: "bg-violet-400", company_id: "c1" },
];

const jobTypes = [
  { id: "jt1", name: "Installation", company_id: "c1" },
  { id: "jt2", name: "Repair", company_id: "c1" },
  { id: "jt3", name: "Maintenance", company_id: "c1" },
  { id: "jt4", name: "Inspection", company_id: "c1" },
];

const jobs = [
  { id: "j1", name: "Smith HVAC Install", address: "123 Main St", company_id: "c1", project_id: "p1", type_id: "jt1", customer_name: "Smith Family", revenue: 4500, start_date: "2026-02-10", end_date: "2026-02-14", hours_per_day: 4, worker_ids: ["w1"], status: "completed" },
  { id: "j2", name: "Jones Furnace Repair", address: "456 Oak Ave", company_id: "c1", project_id: "p1", type_id: "jt2", customer_name: "Jones Corp", revenue: 850, date: "2026-02-12", time: "09:00", hours_expected: 3, is_adhoc: true, worker_ids: ["w2"], status: "completed" },
  { id: "j3", name: "Williams Duct Cleaning", address: "789 Pine Rd", company_id: "c1", project_id: "p2", type_id: "jt3", customer_name: "Williams Home", revenue: 1200, date: "2026-02-13", time: "10:00", hours_expected: 4, worker_ids: ["w1", "test-worker"], status: "in_progress" },
  { id: "j4", name: "Brown AC Installation", address: "321 Elm St", company_id: "c1", type_id: "jt1", customer_name: "Brown Residence", revenue: 5200, start_date: "2026-02-11", end_date: "2026-02-15", hours_per_day: 5, worker_ids: ["w1", "w3"], status: "in_progress" },
  { id: "j5", name: "Taylor Emergency Repair", address: "654 Maple Dr", company_id: "c1", type_id: "jt2", customer_name: "Taylor Business", revenue: 1200, date: "2026-02-13", hours_expected: 2, worker_ids: ["w2"], status: "completed" },
  { id: "j6", name: "Anderson Maintenance", address: "987 Cedar Ln", company_id: "c1", type_id: "jt3", customer_name: "Anderson Property", revenue: 650, date: "2026-02-14", hours_expected: 3, worker_ids: ["w3", "test-worker"], status: "scheduled" },
  { id: "j7", name: "Miller Complex Install", address: "111 Tech Blvd", company_id: "c1", type_id: "jt1", customer_name: "Miller Industries", revenue: 6800, date: "2026-02-12", hours_expected: 6, worker_ids: ["w1", "w4"], status: "in_progress" },
  { id: "j8", name: "Davis System Overhaul", address: "222 Industrial Way", company_id: "c1", type_id: "jt2", customer_name: "Davis Manufacturing", revenue: 3200, date: "2026-02-11", hours_expected: 8, worker_ids: ["w2", "w3"], status: "in_progress" },
  { id: "j9", name: "Wilson Ductwork Repair", address: "333 Commerce St", company_id: "c1", type_id: "jt2", customer_name: "Wilson Office Complex", revenue: 1850, date: "2026-02-13", hours_expected: 4, worker_ids: ["w3"], status: "in_progress" },
  { id: "j10", name: "Garcia Preventative Maintenance", address: "444 Residential Ave", company_id: "c1", type_id: "jt3", customer_name: "Garcia Home", revenue: 420, date: "2026-02-14", hours_expected: 2, worker_ids: ["w4"], status: "completed" },
  { id: "j11", name: "Lee Inspection Service", address: "555 Business Park", company_id: "c1", type_id: "jt4", customer_name: "Lee Properties", revenue: 350, date: "2026-02-15", hours_expected: 2, worker_ids: ["w2"], status: "scheduled" },
  { id: "j12", name: "Thompson AC Install", address: "666 Main Street", company_id: "c1", type_id: "jt1", customer_name: "Thompson Residence", revenue: 4800, date: "2026-02-03", hours_expected: 5, worker_ids: ["w1"], status: "completed" },
  { id: "j13", name: "White Furnace Service", address: "777 Oak Drive", company_id: "c1", type_id: "jt3", customer_name: "White Family", revenue: 580, date: "2026-02-05", hours_expected: 3, worker_ids: ["w2"], status: "completed" },
  { id: "j14", name: "Harris Duct Cleaning", address: "888 Pine Road", company_id: "c1", type_id: "jt3", customer_name: "Harris Home", revenue: 950, date: "2026-01-20", hours_expected: 4, worker_ids: ["w3"], status: "completed" },
  { id: "j15", name: "Clark Emergency Repair", address: "999 Elm Street", company_id: "c1", type_id: "jt2", customer_name: "Clark Business", revenue: 1100, date: "2026-01-25", hours_expected: 3, worker_ids: ["w2"], status: "completed" },
  { id: "j16", name: "Lewis Installation", address: "1010 Maple Ave", company_id: "c1", type_id: "jt1", customer_name: "Lewis Industries", revenue: 5500, date: "2026-01-28", hours_expected: 6, worker_ids: ["w1", "w4"], status: "completed" },
];

const timeEntries = [
  { id: "te1", worker_id: "w1", job_id: "j1", start: "2026-02-10T08:00:00Z", end: "2026-02-10T12:30:00Z", breaks: 30, category: "billable", notes: "Morning install" },
  { id: "te2", worker_id: "w1", job_id: "j1", start: "2026-02-10T13:00:00Z", end: "2026-02-10T17:00:00Z", breaks: 0, category: "billable" },
  { id: "te3", worker_id: "w1", job_id: "j1", start: "2026-02-11T08:00:00Z", end: "2026-02-11T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te4", worker_id: "w1", job_id: "j1", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te5", worker_id: "w1", job_id: "j1", start: "2026-02-13T08:00:00Z", end: "2026-02-13T12:00:00Z", breaks: 0, category: "billable" },
  { id: "te6", worker_id: "w1", job_id: "j1", start: "2026-02-10T12:30:00Z", end: "2026-02-10T13:00:00Z", breaks: 0, category: "admin" },
  { id: "te7", worker_id: "w2", job_id: "j2", start: "2026-02-12T08:00:00Z", end: "2026-02-12T08:30:00Z", breaks: 0, category: "travel" },
  { id: "te8", worker_id: "w2", job_id: "j2", start: "2026-02-12T09:00:00Z", end: "2026-02-12T12:30:00Z", breaks: 30, category: "billable" },
  { id: "te9", worker_id: "w1", job_id: "j3", start: "2026-02-13T09:00:00Z", end: "2026-02-13T09:45:00Z", breaks: 0, category: "travel" },
  { id: "te10", worker_id: "w1", job_id: "j3", start: "2026-02-13T10:00:00Z", end: "2026-02-13T15:30:00Z", breaks: 30, category: "billable" },
  { id: "te11", worker_id: "w1", job_id: "j3", start: "2026-02-13T16:00:00Z", end: "2026-02-13T18:00:00Z", breaks: 0, category: "billable" },
  { id: "te12", worker_id: "w1", job_id: "j4", start: "2026-02-11T08:00:00Z", end: "2026-02-11T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te13", worker_id: "w3", job_id: "j4", start: "2026-02-11T08:00:00Z", end: "2026-02-11T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te14", worker_id: "w1", job_id: "j4", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te15", worker_id: "w3", job_id: "j4", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te16", worker_id: "w1", job_id: "j4", start: "2026-02-13T08:00:00Z", end: "2026-02-13T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te17", worker_id: "w3", job_id: "j4", start: "2026-02-13T08:00:00Z", end: "2026-02-13T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te18", worker_id: "w1", job_id: "j4", start: "2026-02-13T18:00:00Z", end: "2026-02-13T22:00:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te19", worker_id: "w1", job_id: "j4", start: "2026-02-14T08:00:00Z", end: "2026-02-14T13:30:00Z", breaks: 30, category: "billable" },
  { id: "te20", worker_id: "w2", job_id: "j5", start: "2026-02-13T13:00:00Z", end: "2026-02-13T13:30:00Z", breaks: 0, category: "travel" },
  { id: "te21", worker_id: "w2", job_id: "j5", start: "2026-02-13T14:00:00Z", end: "2026-02-13T16:30:00Z", breaks: 0, category: "billable" },
  { id: "te22", worker_id: "w2", job_id: "j5", start: "2026-02-13T16:30:00Z", end: "2026-02-13T17:00:00Z", breaks: 0, category: "idle" },
  { id: "te23", worker_id: "w1", job_id: "j7", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te24", worker_id: "w4", job_id: "j7", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te25", worker_id: "w1", job_id: "j7", start: "2026-02-12T13:30:00Z", end: "2026-02-12T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te26", worker_id: "w4", job_id: "j7", start: "2026-02-12T13:30:00Z", end: "2026-02-12T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te27", worker_id: "w1", job_id: "j7", start: "2026-02-12T18:30:00Z", end: "2026-02-12T21:00:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te28", worker_id: "w2", job_id: "j8", start: "2026-02-11T08:00:00Z", end: "2026-02-11T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te29", worker_id: "w3", job_id: "j8", start: "2026-02-11T08:00:00Z", end: "2026-02-11T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te30", worker_id: "w2", job_id: "j8", start: "2026-02-11T13:30:00Z", end: "2026-02-11T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te31", worker_id: "w3", job_id: "j8", start: "2026-02-11T13:30:00Z", end: "2026-02-11T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te32", worker_id: "w2", job_id: "j8", start: "2026-02-11T18:30:00Z", end: "2026-02-11T21:30:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te33", worker_id: "w3", job_id: "j8", start: "2026-02-11T18:30:00Z", end: "2026-02-11T21:30:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te34", worker_id: "w3", job_id: "j9", start: "2026-02-13T08:00:00Z", end: "2026-02-13T08:30:00Z", breaks: 0, category: "travel" },
  { id: "te35", worker_id: "w3", job_id: "j9", start: "2026-02-13T09:00:00Z", end: "2026-02-13T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te36", worker_id: "w3", job_id: "j9", start: "2026-02-13T13:30:00Z", end: "2026-02-13T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te37", worker_id: "w3", job_id: "j9", start: "2026-02-13T18:30:00Z", end: "2026-02-13T20:30:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te38", worker_id: "w4", job_id: "j10", start: "2026-02-14T08:00:00Z", end: "2026-02-14T10:00:00Z", breaks: 0, category: "billable" },
  { id: "te39", worker_id: "w4", job_id: "j10", start: "2026-02-14T10:00:00Z", end: "2026-02-14T10:15:00Z", breaks: 0, category: "admin" },
  { id: "te40", worker_id: "w1", job_id: "j4", start: "2026-02-14T18:00:00Z", end: "2026-02-14T21:00:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te41", worker_id: "w2", job_id: "j8", start: "2026-02-12T08:00:00Z", end: "2026-02-12T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te42", worker_id: "w2", job_id: "j8", start: "2026-02-12T18:00:00Z", end: "2026-02-12T21:00:00Z", breaks: 0, category: "billable", is_overtime: true },
  { id: "te43", worker_id: "w1", job_id: "j12", start: "2026-02-03T08:00:00Z", end: "2026-02-03T13:00:00Z", breaks: 30, category: "billable" },
  { id: "te44", worker_id: "w1", job_id: "j12", start: "2026-02-03T13:30:00Z", end: "2026-02-03T18:00:00Z", breaks: 30, category: "billable" },
  { id: "te45", worker_id: "w2", job_id: "j13", start: "2026-02-05T09:00:00Z", end: "2026-02-05T12:00:00Z", breaks: 0, category: "billable" },
  { id: "te46", worker_id: "w3", job_id: "j14", start: "2026-01-20T08:00:00Z", end: "2026-01-20T12:30:00Z", breaks: 30, category: "billable" },
  { id: "te47", worker_id: "w2", job_id: "j15", start: "2026-01-25T10:00:00Z", end: "2026-01-25T13:00:00Z", breaks: 0, category: "billable" },
  { id: "te48", worker_id: "w1", job_id: "j16", start: "2026-01-28T08:00:00Z", end: "2026-01-28T14:00:00Z", breaks: 30, category: "billable" },
  { id: "te49", worker_id: "w4", job_id: "j16", start: "2026-01-28T08:00:00Z", end: "2026-01-28T14:00:00Z", breaks: 30, category: "billable" },
  { id: "te50", worker_id: "w3", job_id: "j6", start: "2026-02-14T14:00:00Z", end: "2026-02-14T15:00:00Z", breaks: 0, category: "idle" },
  { id: "te51", worker_id: "w4", job_id: "j11", start: "2026-02-15T08:00:00Z", end: "2026-02-15T10:00:00Z", breaks: 0, category: "billable" },
];

async function seed() {
  console.log("Seeding Supabase...");

  const { error: e1 } = await supabase.from("companies").upsert(companies, { onConflict: "id" });
  if (e1) throw e1;
  console.log("  companies ✓");

  const { error: e2 } = await supabase.from("owner_users").upsert(ownerUsers, { onConflict: "id" });
  if (e2) throw e2;
  console.log("  owner_users ✓");

  const { error: e3 } = await supabase.from("workers").upsert(workers, { onConflict: "id" });
  if (e3) throw e3;
  console.log("  workers ✓");

  const { error: e4 } = await supabase.from("projects").upsert(projects, { onConflict: "id" });
  if (e4) throw e4;
  console.log("  projects ✓");

  const { error: e5 } = await supabase.from("job_types").upsert(jobTypes, { onConflict: "id" });
  if (e5) throw e5;
  console.log("  job_types ✓");

  const { error: e6 } = await supabase.from("jobs").upsert(jobs, { onConflict: "id" });
  if (e6) throw e6;
  console.log("  jobs ✓");

  const { error: e7 } = await supabase.from("time_entries").upsert(timeEntries, { onConflict: "id" });
  if (e7) throw e7;
  console.log("  time_entries ✓");

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
