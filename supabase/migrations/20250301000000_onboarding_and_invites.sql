-- Onboarding flow: company fields, worker extensions, worker_invites, RLS for owners

-- Companies: add onboarding and owner link
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS owner_user_id TEXT,
  ADD COLUMN IF NOT EXISTS work_type TEXT,
  ADD COLUMN IF NOT EXISTS expected_team_size INTEGER,
  ADD COLUMN IF NOT EXISTS current_tracking_method TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_status TEXT NOT NULL DEFAULT 'incomplete',
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Workers: add role, overtime_rate, invite_status
ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'tech',
  ADD COLUMN IF NOT EXISTS overtime_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS invite_status TEXT NOT NULL DEFAULT 'not_sent';

-- Worker invites (SMS/link)
CREATE TABLE IF NOT EXISTS worker_invites (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  channel TEXT NOT NULL DEFAULT 'sms'
);

CREATE INDEX IF NOT EXISTS idx_worker_invites_worker ON worker_invites(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_invites_company ON worker_invites(company_id);
CREATE INDEX IF NOT EXISTS idx_worker_invites_token ON worker_invites(token);

-- RLS for worker_invites
ALTER TABLE worker_invites ENABLE ROW LEVEL SECURITY;

-- Owner can CRUD their company (by owner_user_id)
CREATE POLICY "Owner CRUD own company"
  ON companies FOR ALL
  USING (owner_user_id = auth.uid()::text)
  WITH CHECK (owner_user_id = auth.uid()::text);

-- Owner can CRUD workers for their company
CREATE POLICY "Owner CRUD workers of own company"
  ON workers FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );

-- Owner can CRUD invites for their company
CREATE POLICY "Owner CRUD invites of own company"
  ON worker_invites FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );
