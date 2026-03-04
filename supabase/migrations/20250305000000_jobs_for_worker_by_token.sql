-- RPC: Return jobs assigned to the worker identified by their invite token.
-- Used by the worker app (/w/:token/jobs) so workers see only their assigned jobs (anon key).
CREATE OR REPLACE FUNCTION get_jobs_for_worker_by_token(p_token text)
RETURNS SETOF jobs
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT j.* FROM jobs j
  INNER JOIN worker_invites wi ON wi.token = p_token AND wi.expires_at > now()
  WHERE wi.worker_id = ANY(COALESCE(j.worker_ids, ARRAY[]::text[]));
$$;

GRANT EXECUTE ON FUNCTION get_jobs_for_worker_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION get_jobs_for_worker_by_token(text) TO authenticated;

-- RPC: Return the worker row for the invite token (so worker app can show name etc. with anon key).
CREATE OR REPLACE FUNCTION get_worker_by_invite_token(p_token text)
RETURNS SETOF workers
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.* FROM workers w
  INNER JOIN worker_invites wi ON wi.worker_id = w.id AND wi.token = p_token AND wi.expires_at > now();
$$;

GRANT EXECUTE ON FUNCTION get_worker_by_invite_token(text) TO anon;
GRANT EXECUTE ON FUNCTION get_worker_by_invite_token(text) TO authenticated;

-- RPC: Time entries for the worker identified by invite token (worker app with anon key).
CREATE OR REPLACE FUNCTION get_time_entries_for_worker_by_token(p_token text)
RETURNS SETOF time_entries
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT te.* FROM time_entries te
  INNER JOIN worker_invites wi ON wi.worker_id = te.worker_id AND wi.token = p_token AND wi.expires_at > now();
$$;

GRANT EXECUTE ON FUNCTION get_time_entries_for_worker_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION get_time_entries_for_worker_by_token(text) TO authenticated;
