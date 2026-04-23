-- =============================================================================
-- CRM App — Calendar Events
-- Run in Supabase SQL Editor after the initial schema migration.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / drop if exists).
-- =============================================================================

-- ---------- Enum ----------
do $$ begin
  create type public.event_type as enum ('call', 'chat', 'meeting', 'email', 'other');
exception when duplicate_object then null; end $$;

-- ---------- calendar_events ----------
create table if not exists public.calendar_events (
  id          uuid        primary key default gen_random_uuid(),
  owner_id    uuid        not null references auth.users(id) on delete cascade,
  lead_id     uuid        references public.leads(id) on delete set null,
  title       text        not null,
  type        public.event_type not null default 'meeting',
  start_at    timestamptz not null,
  end_at      timestamptz,
  all_day     boolean     not null default false,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists calendar_events_owner_start_idx
  on public.calendar_events(owner_id, start_at);

create index if not exists calendar_events_lead_idx
  on public.calendar_events(lead_id);

-- Reuse trigger function tg_set_updated_at from initial schema
drop trigger if exists set_updated_at_on_calendar_events on public.calendar_events;
create trigger set_updated_at_on_calendar_events
  before update on public.calendar_events
  for each row execute function public.tg_set_updated_at();

-- ---------- RLS ----------
alter table public.calendar_events enable row level security;

drop policy if exists "calendar_events select own" on public.calendar_events;
create policy "calendar_events select own"
  on public.calendar_events for select
  using (auth.uid() = owner_id);

drop policy if exists "calendar_events insert own" on public.calendar_events;
create policy "calendar_events insert own"
  on public.calendar_events for insert
  with check (auth.uid() = owner_id);

drop policy if exists "calendar_events update own" on public.calendar_events;
create policy "calendar_events update own"
  on public.calendar_events for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "calendar_events delete own" on public.calendar_events;
create policy "calendar_events delete own"
  on public.calendar_events for delete
  using (auth.uid() = owner_id);
