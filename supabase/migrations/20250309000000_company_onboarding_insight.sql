-- First insight onboarding: persisted profile + estimated snapshot JSON

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS using_estimated_insight BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS company_onboarding_profile (
  company_id TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  trade_type TEXT NOT NULL,
  field_tech_count INTEGER NOT NULL,
  office_staff_count INTEGER,
  jobs_per_week INTEGER NOT NULL,
  avg_job_duration_band TEXT NOT NULL,
  overrun_frequency TEXT NOT NULL,
  overtime_frequency TEXT,
  estimated_snapshot_json JSONB NOT NULL DEFAULT '{}',
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_onboarding_profile_trade ON company_onboarding_profile (trade_type);

ALTER TABLE company_onboarding_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner CRUD onboarding profile of own company"
  ON company_onboarding_profile FOR ALL
  USING (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()::text)
  );
