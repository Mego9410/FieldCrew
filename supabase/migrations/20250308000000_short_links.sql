-- Short links for worker invite/job SMS (shorter URLs in messages)
CREATE TABLE IF NOT EXISTS short_links (
  code TEXT PRIMARY KEY,
  target_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_short_links_created_at ON short_links(created_at);

-- Allow anonymous read so redirect works without auth
ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read short_links by code"
  ON short_links FOR SELECT
  USING (true);

-- API (authenticated owner) creates short links when sending SMS
CREATE POLICY "Authenticated can insert short_links"
  ON short_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
