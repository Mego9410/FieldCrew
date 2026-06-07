-- Pre-launch security hardening:
--  1) Fix email_delivery_log.company_id type mismatch (UUID -> TEXT) + RLS join
--  2) Enable RLS (deny-by-default) on leads, admin_action_logs, company_usage_daily
--  3) Enforce invite expiry inside get_worker_invite_by_token (defense in depth)
--  4) Lock down short_links: remove public table SELECT, expose a SECURITY DEFINER lookup
--
-- Every block is guarded with to_regclass(...) so the migration runs cleanly
-- regardless of which optional tables already exist, and is safe to re-run.

-- ─── 1) email_delivery_log.company_id UUID -> TEXT ─────────────────────────────
-- companies.id is TEXT, so a UUID column silently breaks for non-UUID ids and
-- makes the RLS join cross-type. Convert to TEXT and rebuild the read policy.
DO $$
BEGIN
  IF to_regclass('public.email_delivery_log') IS NOT NULL THEN
    -- Only convert if it is not already TEXT.
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'email_delivery_log'
        AND column_name = 'company_id'
        AND data_type <> 'text'
    ) THEN
      EXECUTE 'ALTER TABLE public.email_delivery_log
               ALTER COLUMN company_id TYPE text USING company_id::text';
    END IF;

    EXECUTE 'DROP POLICY IF EXISTS "Owners can read email delivery log" ON public.email_delivery_log';
    EXECUTE $pol$
      CREATE POLICY "Owners can read email delivery log"
        ON public.email_delivery_log
        FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1
            FROM public.owner_users ou
            WHERE ou.id = auth.uid()::text
              AND ou.company_id = email_delivery_log.company_id
          )
        )
    $pol$;
  END IF;
END $$;

-- ─── 2) Enable RLS (deny-by-default) on service-role-only tables ───────────────
-- These tables are only ever read/written by service-role code (admin APIs,
-- cron, marketing capture). Enabling RLS with no permissive policy denies anon
-- and authenticated roles while service role continues to bypass RLS.
DO $$
BEGIN
  IF to_regclass('public.leads') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.admin_action_logs') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.company_usage_daily') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.company_usage_daily ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- ─── 3) Worker invite lookup must honour expiry ───────────────────────────────
DO $$
BEGIN
  IF to_regclass('public.worker_invites') IS NOT NULL THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION get_worker_invite_by_token(p_token text)
      RETURNS SETOF worker_invites
      LANGUAGE sql
      SECURITY DEFINER
      SET search_path = public
      AS $body$
        SELECT * FROM worker_invites
        WHERE token = p_token
          AND (expires_at IS NULL OR expires_at > now())
        LIMIT 1;
      $body$;
    $fn$;
    EXECUTE 'GRANT EXECUTE ON FUNCTION get_worker_invite_by_token(text) TO anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION get_worker_invite_by_token(text) TO authenticated';
  END IF;
END $$;

-- ─── 4) short_links: replace public table SELECT with a scoped RPC ─────────────
-- A blanket "SELECT USING (true)" lets anyone enumerate every short code and its
-- target. Redirects only need single-code resolution, so expose that via a
-- SECURITY DEFINER function and drop the table-wide read policy.
DO $$
BEGIN
  IF to_regclass('public.short_links') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read short_links by code" ON short_links';
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION get_short_link_target(p_code text)
      RETURNS text
      LANGUAGE sql
      SECURITY DEFINER
      SET search_path = public
      AS $body$
        SELECT target_path FROM short_links WHERE code = lower(p_code) LIMIT 1;
      $body$;
    $fn$;
    EXECUTE 'GRANT EXECUTE ON FUNCTION get_short_link_target(text) TO anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION get_short_link_target(text) TO authenticated';
  END IF;
END $$;
