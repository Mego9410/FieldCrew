-- RPC: Update a time entry (breaks/notes) for the worker identified by invite token.
-- Used by worker clock history edit. Runs with SECURITY DEFINER to bypass RLS.
CREATE OR REPLACE FUNCTION update_time_entry_for_worker_by_token(
  p_token text,
  p_time_entry_id text,
  p_breaks int DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS SETOF time_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_worker_id text;
BEGIN
  SELECT wi.worker_id INTO v_worker_id
  FROM worker_invites wi
  WHERE wi.token = p_token AND wi.expires_at > now()
  LIMIT 1;

  IF v_worker_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired worker token';
  END IF;

  -- Ensure the entry belongs to the worker.
  IF NOT EXISTS (SELECT 1 FROM time_entries te WHERE te.id = p_time_entry_id AND te.worker_id = v_worker_id) THEN
    RAISE EXCEPTION 'Time entry not found';
  END IF;

  RETURN QUERY
  UPDATE time_entries
  SET
    breaks = COALESCE(p_breaks, breaks),
    notes = CASE
      WHEN p_notes IS NULL THEN notes
      WHEN trim(p_notes) = '' THEN NULL
      ELSE p_notes
    END
  WHERE id = p_time_entry_id
  RETURNING *;
END;
$$;

GRANT EXECUTE ON FUNCTION update_time_entry_for_worker_by_token(text, text, int, text) TO anon;
GRANT EXECUTE ON FUNCTION update_time_entry_for_worker_by_token(text, text, int, text) TO authenticated;

