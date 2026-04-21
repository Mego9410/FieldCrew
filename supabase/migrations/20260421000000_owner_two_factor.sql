-- Owner 2FA (TOTP) + recovery codes.
-- Stored separately from Supabase Auth MFA to keep app logic self-contained.

create table if not exists public.owner_two_factor (
  owner_user_id text primary key references public.owner_users(id) on delete cascade,
  enabled boolean not null default false,
  secret_enc text,
  recovery_codes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.owner_two_factor enable row level security;

-- Owners can read their own 2FA record.
drop policy if exists owner_two_factor_select_own on public.owner_two_factor;
create policy owner_two_factor_select_own
on public.owner_two_factor
for select
to authenticated
using (owner_user_id = auth.uid()::text);

-- Owners can insert their own 2FA record (during setup).
drop policy if exists owner_two_factor_insert_own on public.owner_two_factor;
create policy owner_two_factor_insert_own
on public.owner_two_factor
for insert
to authenticated
with check (owner_user_id = auth.uid()::text);

-- Owners can update their own 2FA record.
drop policy if exists owner_two_factor_update_own on public.owner_two_factor;
create policy owner_two_factor_update_own
on public.owner_two_factor
for update
to authenticated
using (owner_user_id = auth.uid()::text)
with check (owner_user_id = auth.uid()::text);

