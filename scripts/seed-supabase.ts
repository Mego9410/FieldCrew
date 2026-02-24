/**
 * Seed Supabase with test data up to the current date.
 * Run: npm run db:seed  (or npx tsx scripts/seed-supabase.ts)
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

// ——— Helpers: dates relative to "today" ———
const today = new Date();
today.setHours(0, 0, 0, 0);

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function toISO(d: Date, hour: number, min: number): string {
  const t = new Date(d);
  t.setHours(hour, min, 0, 0);
  return t.toISOString();
}

// ——— Static seed data ———
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

// ——— Generate jobs from ~8 weeks ago through today (and a few scheduled) ———
const workerIdsList: string[][] = [["w1"], ["w2"], ["w3"], ["w4"], ["w1", "w3"], ["w2", "w3"], ["w1", "w4"], ["w1", "test-worker"]];

const jobTemplates: Array<{
  name: string;
  address: string;
  project_id: string | null;
  type_id: string;
  customer_name: string;
  revenue: number;
  singleDay: boolean;
  hoursExpected?: number;
  hoursPerDay?: number;
  is_adhoc?: boolean;
}> = [
  { name: "Smith HVAC Install", address: "123 Main St", project_id: "p1", type_id: "jt1", customer_name: "Smith Family", revenue: 4500, singleDay: false, hoursPerDay: 4 },
  { name: "Jones Furnace Repair", address: "456 Oak Ave", project_id: "p1", type_id: "jt2", customer_name: "Jones Corp", revenue: 850, singleDay: true, hoursExpected: 3, is_adhoc: true },
  { name: "Williams Duct Cleaning", address: "789 Pine Rd", project_id: "p2", type_id: "jt3", customer_name: "Williams Home", revenue: 1200, singleDay: true, hoursExpected: 4 },
  { name: "Brown AC Installation", address: "321 Elm St", project_id: null, type_id: "jt1", customer_name: "Brown Residence", revenue: 5200, singleDay: false, hoursPerDay: 5 },
  { name: "Taylor Emergency Repair", address: "654 Maple Dr", project_id: null, type_id: "jt2", customer_name: "Taylor Business", revenue: 1200, singleDay: true, hoursExpected: 2 },
  { name: "Anderson Maintenance", address: "987 Cedar Ln", project_id: null, type_id: "jt3", customer_name: "Anderson Property", revenue: 650, singleDay: true, hoursExpected: 3 },
  { name: "Miller Complex Install", address: "111 Tech Blvd", project_id: null, type_id: "jt1", customer_name: "Miller Industries", revenue: 6800, singleDay: true, hoursExpected: 6 },
  { name: "Davis System Overhaul", address: "222 Industrial Way", project_id: null, type_id: "jt2", customer_name: "Davis Manufacturing", revenue: 3200, singleDay: false, hoursPerDay: 8 },
  { name: "Wilson Ductwork Repair", address: "333 Commerce St", project_id: null, type_id: "jt2", customer_name: "Wilson Office Complex", revenue: 1850, singleDay: true, hoursExpected: 4 },
  { name: "Garcia Preventative Maintenance", address: "444 Residential Ave", project_id: null, type_id: "jt3", customer_name: "Garcia Home", revenue: 420, singleDay: true, hoursExpected: 2 },
  { name: "Lee Inspection Service", address: "555 Business Park", project_id: null, type_id: "jt4", customer_name: "Lee Properties", revenue: 350, singleDay: true, hoursExpected: 2 },
  { name: "Thompson AC Install", address: "666 Main Street", project_id: null, type_id: "jt1", customer_name: "Thompson Residence", revenue: 4800, singleDay: true, hoursExpected: 5 },
  { name: "White Furnace Service", address: "777 Oak Drive", project_id: null, type_id: "jt3", customer_name: "White Family", revenue: 580, singleDay: true, hoursExpected: 3 },
  { name: "Harris Duct Cleaning", address: "888 Pine Road", project_id: null, type_id: "jt3", customer_name: "Harris Home", revenue: 950, singleDay: true, hoursExpected: 4 },
  { name: "Clark Emergency Repair", address: "999 Elm Street", project_id: null, type_id: "jt2", customer_name: "Clark Business", revenue: 1100, singleDay: true, hoursExpected: 3 },
  { name: "Lewis Installation", address: "1010 Maple Ave", project_id: null, type_id: "jt1", customer_name: "Lewis Industries", revenue: 5500, singleDay: true, hoursExpected: 6 },
];

const jobs: Array<Record<string, unknown>> = [];
let jobIndex = 0;
// 2 jobs per week over 9 weeks (past 8 + current) + a few scheduled next week
for (let weekOffset = -8; weekOffset <= 1; weekOffset++) {
  const weekStart = addDays(today, weekOffset * 7);
  const templatesThisWeek = weekOffset < 0 ? 3 : weekOffset === 0 ? 4 : 2;
  for (let i = 0; i < templatesThisWeek; i++) {
    const t = jobTemplates[(jobIndex + i) % jobTemplates.length];
    const jid = `j${++jobIndex}`;
    const workerIds = workerIdsList[(jobIndex - 1) % workerIdsList.length];
    const dayOffset = jobIndex % 5;
    const jobDate = addDays(weekStart, dayOffset);
    const jobDateStr = toDateStr(jobDate);
    const isPast = jobDate < today;
    const isFuture = jobDate > today;
    const status = isFuture ? "scheduled" : isPast ? "completed" : "in_progress";

    if (t.singleDay) {
      jobs.push({
        id: jid,
        name: `${t.name} (${jobDateStr})`,
        address: t.address,
        company_id: "c1",
        project_id: t.project_id,
        type_id: t.type_id,
        customer_name: t.customer_name,
        revenue: t.revenue,
        date: jobDateStr,
        time: "09:00",
        hours_expected: t.hoursExpected ?? 4,
        is_adhoc: t.is_adhoc ?? false,
        worker_ids: workerIds,
        status,
      });
    } else {
      const startDate = jobDateStr;
      const endDate = toDateStr(addDays(jobDate, 4));
      jobs.push({
        id: jid,
        name: `${t.name} (${startDate})`,
        address: t.address,
        company_id: "c1",
        project_id: t.project_id,
        type_id: t.type_id,
        customer_name: t.customer_name,
        revenue: t.revenue,
        start_date: startDate,
        end_date: endDate,
        hours_per_day: t.hoursPerDay ?? 4,
        worker_ids: workerIds,
        status,
      });
    }
  }
}

// ——— Generate time entries for jobs that are in the past or today ———
const timeEntries: Array<Record<string, unknown>> = [];
let teId = 0;

for (const job of jobs) {
  const jobId = job.id as string;
  const workerIds = (job.worker_ids as string[]) ?? [];
  const status = job.status as string;
  if (status === "scheduled") continue;

  const startDateStr = (job.start_date as string) ?? (job.date as string);
  const endDateStr = (job.end_date as string) ?? (job.date as string);
  const hoursPerDay = (job.hours_per_day as number) ?? (job.hours_expected as number) ?? 4;
  const isMultiDay = !!(job.start_date && job.end_date);

  const startDate = new Date(startDateStr + "T00:00:00Z");
  const endDate = new Date(endDateStr + "T23:59:59Z");
  const endCap = endDate > today ? today : endDate;

  for (let d = new Date(startDate.getTime()); d <= endCap; d.setDate(d.getDate() + 1)) {
    for (let wi = 0; wi < workerIds.length; wi++) {
      const workerId = workerIds[wi];
      const morningStartH = 8;
      const morningEndH = 12;
      const afternoonStartH = 13;
      const afternoonEndH = 17;
      const breaks = 30;
      const isOT = hoursPerDay >= 8 && wi === 0;

      timeEntries.push({
        id: `te-${++teId}`,
        worker_id: workerId,
        job_id: jobId,
        start: toISO(d, morningStartH, 0),
        end: toISO(d, morningEndH, 30),
        breaks,
        category: "billable",
        is_overtime: false,
      });
      timeEntries.push({
        id: `te-${++teId}`,
        worker_id: workerId,
        job_id: jobId,
        start: toISO(d, afternoonStartH, 0),
        end: toISO(d, afternoonEndH, isOT ? 0 : 30),
        breaks,
        category: "billable",
        is_overtime: isOT,
      });
    }
  }
}

async function seed() {
  console.log("Seeding Supabase (data up to %s)...", toDateStr(today));

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
  console.log("  jobs ✓ (%d jobs)", jobs.length);

  const { error: e7 } = await supabase.from("time_entries").upsert(timeEntries, { onConflict: "id" });
  if (e7) throw e7;
  console.log("  time_entries ✓ (%d entries)", timeEntries.length);

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
