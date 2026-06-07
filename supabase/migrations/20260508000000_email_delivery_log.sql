-- Outbound email dedupe + audit log.
-- Used to prevent duplicate sends from retrying webhooks/cron.

create table if not exists public.email_delivery_log (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'resend',
  provider_event_id text,
  template_alias text not null,
  company_id text,
  recipient_email text not null,
  sent_at timestamptz not null default now(),
  metadata jsonb
);

-- Dedupe key: (provider, event_id, template_alias, recipient)
create unique index if not exists email_delivery_log_dedupe_idx
  on public.email_delivery_log (provider, provider_event_id, template_alias, recipient_email);

-- Useful query index
create index if not exists email_delivery_log_company_idx
  on public.email_delivery_log (company_id, sent_at desc);

alter table public.email_delivery_log enable row level security;

-- Owners can view their own company's log (read-only).
drop policy if exists "Owners can read email delivery log" on public.email_delivery_log;
create policy "Owners can read email delivery log"
  on public.email_delivery_log
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.owner_users ou
      where ou.id = auth.uid()::text
        and ou.company_id = email_delivery_log.company_id
    )
  );

-- Service role can insert.
-- (No policy needed; service role bypasses RLS in Supabase.)

