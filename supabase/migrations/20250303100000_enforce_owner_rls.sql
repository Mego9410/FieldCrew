-- Enforce owner-only data access: drop any permissive policies and ensure
-- every table only allows access to rows owned by the authenticated user's company.
-- Run this if users can still see other users' data (e.g. RLS was not applied earlier).

-- ─── Drop permissive "Allow all" policies (may still exist if 20250301120000 didn't run) ─
DROP POLICY IF EXISTS "Allow all companies" ON companies;
DROP POLICY IF EXISTS "Allow all owner_users" ON owner_users;
DROP POLICY IF EXISTS "Allow all workers" ON workers;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all job_types" ON job_types;
DROP POLICY IF EXISTS "Allow all jobs" ON jobs;
DROP POLICY IF EXISTS "Allow all time_entries" ON time_entries;

-- ─── companies: only the row where owner_user_id = current user ─────────────────────
DROP POLICY IF EXISTS "Owner CRUD own company" ON companies;
CREATE POLICY "Owner CRUD own company"
  ON companies FOR ALL
  USING (owner_user_id = auth.uid()::text)
  WITH CHECK (owner_user_id = auth.uid()::text);

-- ─── owner_users: only own row; INSERT only for own company ─────────────────────────
DROP POLICY IF EXISTS "Owner users select own row" ON owner_users;
CREATE POLICY "Owner users select own row"
  ON owner_users FOR SELECT
  USING (id = auth.uid()::text);

DROP POLICY IF EXISTS "Owner users update own row" ON owner_users;
CREATE POLICY "Owner users update own row"
  ON owner_users FOR UPDATE
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

DROP POLICY IF EXISTS "Owner users delete own row" ON owner_users;
CREATE POLICY "Owner users delete own row"
  ON owner_users FOR DELETE
  USING (id = auth.uid()::text);

DROP POLICY IF EXISTS "Owner users insert own row for own company" ON owner_users;
CREATE POLICY "Owner users insert own row for own company"
  ON owner_users FOR INSERT
  WITH CHECK (
    id = auth.uid()::text
    AND company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── workers: only rows for companies owned by current user ──────────────────────────
DROP POLICY IF EXISTS "Owner CRUD workers of own company" ON workers;
CREATE POLICY "Owner CRUD workers of own company"
  ON workers FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── worker_invites: only rows for owner's company ───────────────────────────────────
DROP POLICY IF EXISTS "Owner CRUD invites of own company" ON worker_invites;
CREATE POLICY "Owner CRUD invites of own company"
  ON worker_invites FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── projects, job_types, jobs: only owner's company ─────────────────────────────────
DROP POLICY IF EXISTS "Owner CRUD projects of own company" ON projects;
CREATE POLICY "Owner CRUD projects of own company"
  ON projects FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Owner CRUD job_types of own company" ON job_types;
CREATE POLICY "Owner CRUD job_types of own company"
  ON job_types FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Owner CRUD jobs of own company" ON jobs;
CREATE POLICY "Owner CRUD jobs of own company"
  ON jobs FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── time_entries: only via jobs belonging to owner's company ───────────────────────
DROP POLICY IF EXISTS "Owner CRUD time_entries of own company" ON time_entries;
CREATE POLICY "Owner CRUD time_entries of own company"
  ON time_entries FOR ALL
  USING (
    job_id IN (
      SELECT id FROM jobs
      WHERE company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
    )
  )
  WITH CHECK (
    job_id IN (
      SELECT id FROM jobs
      WHERE company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
    )
  );
