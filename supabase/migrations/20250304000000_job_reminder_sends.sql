-- Dedupe table: one reminder SMS per (job, worker).
-- Used by cron job-reminders to avoid sending the same reminder twice.
CREATE TABLE IF NOT EXISTS job_reminder_sends (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_job_reminder_sends_job_worker ON job_reminder_sends(job_id, worker_id);

ALTER TABLE job_reminder_sends ENABLE ROW LEVEL SECURITY;

-- No policies: only the cron (using service role) reads/writes this table.
