-- Super Admin control layer: audit logs + account status + usage rollups

-- Companies: separate "account status" from Stripe subscription status
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS signup_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_companies_account_status ON companies(account_status);
CREATE INDEX IF NOT EXISTS idx_companies_signup_at ON companies(signup_at);

-- Admin action audit log (append-only)
CREATE TABLE IF NOT EXISTS admin_action_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_company_id TEXT REFERENCES companies(id) ON DELETE SET NULL,
  target_user_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_action_logs_created_at ON admin_action_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_target_company ON admin_action_logs(target_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_action ON admin_action_logs(action);

-- Daily usage rollups (optional cache for churn flags / dashboards)
CREATE TABLE IF NOT EXISTS company_usage_daily (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  jobs_created INTEGER NOT NULL DEFAULT 0,
  time_entries_created INTEGER NOT NULL DEFAULT 0,
  active_workers INTEGER NOT NULL DEFAULT 0,
  reports_viewed INTEGER NOT NULL DEFAULT 0,
  insights_generated INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (company_id, day)
);

CREATE INDEX IF NOT EXISTS idx_company_usage_daily_day ON company_usage_daily(day DESC);

