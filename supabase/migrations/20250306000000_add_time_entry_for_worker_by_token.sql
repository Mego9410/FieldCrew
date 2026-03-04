-- RPC: Insert a time entry for the worker identified by invite token.
-- Used by the worker clock-out flow; runs with SECURITY DEFINER so it can insert despite RLS.
CREATE OR REPLACE FUNCTION add_time_entry_for_worker_by_token(
  p_token text,
  p_job_id text,
  p_start timestamptz,
  p_end timestamptz,
  p_breaks int DEFAULT 0,
  p_notes text DEFAULT NULL,
  p_is_overtime boolean DEFAULT false,
  p_category text DEFAULT 'billable'
)
RETURNS SETOF time_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_worker_id text;
BEGIN
  -- Resolve worker from token
  SELECT wi.worker_id INTO v_worker_id
  FROM worker_invites wi
  WHERE wi.token = p_token AND wi.expires_at > now()
  LIMIT 1;

  IF v_worker_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired worker token';
  END IF;

  -- Ensure worker is assigned to the job
  IF NOT (SELECT (worker_ids @> ARRAY[v_worker_id]) FROM jobs WHERE id = p_job_id) THEN
    RAISE EXCEPTION 'Worker not assigned to this job';
  END IF;

  RETURN QUERY
  INSERT INTO time_entries (id, worker_id, job_id, start, "end", breaks, category, is_overtime, notes)
  VALUES (
    gen_random_uuid()::text,
    v_worker_id,
    p_job_id,
    p_start,
    p_end,
    COALESCE(p_breaks, 0),
    COALESCE(NULLIF(trim(p_category), ''), 'billable'),
    COALESCE(p_is_overtime, false),
    NULLIF(trim(p_notes), '')
  )
  RETURNING *;
END;
$$;

GRANT EXECUTE ON FUNCTION add_time_entry_for_worker_by_token(text, text, timestamptz, timestamptz, int, text, boolean, text) TO anon;
GRANT EXECUTE ON FUNCTION add_time_entry_for_worker_by_token(text, text, timestamptz, timestamptz, int, text, boolean, text) TO authenticated;
