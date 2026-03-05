-- Stripe subscription: link company to Stripe customer/subscription and enforce worker limit

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS worker_limit INTEGER NOT NULL DEFAULT 5;

-- Optional index for webhook lookups by Stripe customer/subscription
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON companies(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription ON companies(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
