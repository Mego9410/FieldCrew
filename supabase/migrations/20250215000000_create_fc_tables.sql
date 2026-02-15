-- Field Crew app: companies, workers, projects, job_types, jobs, time_entries, owner_users
-- Run this in Supabase Dashboard SQL Editor or via: supabase db push

-- Drop existing tables (in reverse dependency order) for a clean slate
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS job_types CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS workers CASCADE;
DROP TABLE IF EXISTS owner_users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT
);

-- Owner users (linked to companies)
CREATE TABLE IF NOT EXISTS owner_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  company_id TEXT NOT NULL REFERENCES companies(id)
);

-- Workers
CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  hourly_rate NUMERIC NOT NULL DEFAULT 0,
  company_id TEXT NOT NULL REFERENCES companies(id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-slate-400',
  company_id TEXT NOT NULL REFERENCES companies(id)
);

-- Job types
CREATE TABLE IF NOT EXISTS job_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_id TEXT NOT NULL REFERENCES companies(id)
);

-- Jobs (supports multi-day and single-day)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  company_id TEXT NOT NULL REFERENCES companies(id),
  project_id TEXT REFERENCES projects(id),
  type_id TEXT REFERENCES job_types(id),
  customer_name TEXT,
  revenue NUMERIC,
  date TEXT,
  time TEXT,
  start_date TEXT,
  end_date TEXT,
  hours_per_day INTEGER,
  hours_expected INTEGER,
  is_adhoc BOOLEAN DEFAULT FALSE,
  worker_ids TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'overdue'))
);

-- Time entries
CREATE TABLE IF NOT EXISTS time_entries (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL REFERENCES workers(id),
  job_id TEXT NOT NULL REFERENCES jobs(id),
  start TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ NOT NULL,
  breaks INTEGER NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'billable' CHECK (category IN ('billable', 'travel', 'admin', 'idle')),
  is_overtime BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workers_company ON workers(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_project ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_worker ON time_entries(worker_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_job ON time_entries(job_id);

-- Enable RLS but allow all for now (using anon key for demo)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Permissive policies (allow all for anon - tighten later with auth)
CREATE POLICY "Allow all companies" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all owner_users" ON owner_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all workers" ON workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all job_types" ON job_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all time_entries" ON time_entries FOR ALL USING (true) WITH CHECK (true);
