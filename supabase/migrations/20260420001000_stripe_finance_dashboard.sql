-- Stripe finance dashboard persistence (Stripe-only)

-- Store subscription snapshots (for normalized MRR trend)
CREATE TABLE IF NOT EXISTS stripe_subscription_snapshots (
  id BIGSERIAL PRIMARY KEY,
  stripe_subscription_id TEXT NOT NULL,
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  effective_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  worker_limit INTEGER,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  paused BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stripe_sub_snap_sub_id ON stripe_subscription_snapshots (stripe_subscription_id, effective_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_sub_snap_company ON stripe_subscription_snapshots (company_id, effective_at DESC);

-- Store invoices as facts for collections & cash reporting
CREATE TABLE IF NOT EXISTS stripe_invoice_facts (
  stripe_invoice_id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES companies(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  amount_due INTEGER,
  amount_paid INTEGER,
  currency TEXT,
  attempt_count INTEGER,
  next_payment_attempt TIMESTAMPTZ,
  hosted_invoice_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stripe_inv_company_created ON stripe_invoice_facts (company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_inv_status_created ON stripe_invoice_facts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_inv_customer ON stripe_invoice_facts (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_inv_subscription ON stripe_invoice_facts (stripe_subscription_id);

-- Store charges for refunds reporting (and basic cash reality)
CREATE TABLE IF NOT EXISTS stripe_charge_facts (
  stripe_charge_id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES companies(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  stripe_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  amount INTEGER NOT NULL,
  amount_refunded INTEGER NOT NULL DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  currency TEXT,
  receipt_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stripe_charge_company_created ON stripe_charge_facts (company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_charge_customer_created ON stripe_charge_facts (stripe_customer_id, created_at DESC);

-- Precomputed daily rollups (fast timeseries)
CREATE TABLE IF NOT EXISTS stripe_finance_daily (
  day DATE PRIMARY KEY,
  mrr_usd INTEGER NOT NULL DEFAULT 0,
  cash_collected_usd_cents INTEGER NOT NULL DEFAULT 0,
  refunds_usd_cents INTEGER NOT NULL DEFAULT 0,
  paid_invoices_count INTEGER NOT NULL DEFAULT 0,
  failed_invoices_count INTEGER NOT NULL DEFAULT 0,
  open_invoices_count INTEGER NOT NULL DEFAULT 0,
  past_due_invoices_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security: keep these tables private (service role / admin APIs only)
ALTER TABLE stripe_subscription_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_invoice_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_charge_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_finance_daily ENABLE ROW LEVEL SECURITY;

