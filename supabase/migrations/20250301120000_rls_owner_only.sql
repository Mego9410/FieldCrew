-- RLS: Restrict all tables to data owned by the current user (company owner).
-- Drops permissive "Allow all" policies and adds owner-scoped policies.

-- ─── Drop permissive policies (from initial migration) ─────────────────────
DROP POLICY IF EXISTS "Allow all companies" ON companies;
DROP POLICY IF EXISTS "Allow all owner_users" ON owner_users;
DROP POLICY IF EXISTS "Allow all workers" ON workers;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all job_types" ON job_types;
DROP POLICY IF EXISTS "Allow all jobs" ON jobs;
DROP POLICY IF EXISTS "Allow all time_entries" ON time_entries;

-- ─── owner_users: own row only; INSERT only for own company ─────────────────
CREATE POLICY "Owner users select own row"
  ON owner_users FOR SELECT
  USING (id = auth.uid()::text);

CREATE POLICY "Owner users update own row"
  ON owner_users FOR UPDATE
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Owner users delete own row"
  ON owner_users FOR DELETE
  USING (id = auth.uid()::text);

CREATE POLICY "Owner users insert own row for own company"
  ON owner_users FOR INSERT
  WITH CHECK (
    id = auth.uid()::text
    AND company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── projects: CRUD for owner's company ────────────────────────────────────
CREATE POLICY "Owner CRUD projects of own company"
  ON projects FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── job_types: CRUD for owner's company ───────────────────────────────────
CREATE POLICY "Owner CRUD job_types of own company"
  ON job_types FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── jobs: CRUD for owner's company ────────────────────────────────────────
CREATE POLICY "Owner CRUD jobs of own company"
  ON jobs FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- ─── time_entries: CRUD via job → company ownership ─────────────────────────
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

-- ─── RPC: Look up worker invite by token (for worker links; bypasses RLS safely) ─
CREATE OR REPLACE FUNCTION get_worker_invite_by_token(p_token text)
RETURNS SETOF worker_invites
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM worker_invites WHERE token = p_token LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_worker_invite_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION get_worker_invite_by_token(text) TO authenticated;
