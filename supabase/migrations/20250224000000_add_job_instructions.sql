-- Add instructions field for worker-facing job notes (Option A)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS instructions TEXT;
