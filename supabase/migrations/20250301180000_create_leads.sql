-- Leads table for marketing lead capture (e.g. Hidden Profit calculator)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT,
  inputs JSONB,
  outputs JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email_created_at ON leads (email, created_at);

COMMENT ON TABLE leads IS 'Marketing leads from landing/blog (e.g. hidden profit calculator)';
