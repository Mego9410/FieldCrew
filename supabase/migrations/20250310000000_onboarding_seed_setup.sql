-- Optional onboarding seeding: workers/jobs + onboarding progress fields.

ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS created_via_onboarding BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS created_via_onboarding BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE company_onboarding_profile
  ADD COLUMN IF NOT EXISTS onboarding_step_completed INTEGER,
  ADD COLUMN IF NOT EXISTS onboarding_seed_workers_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_seed_jobs_completed BOOLEAN NOT NULL DEFAULT false;
