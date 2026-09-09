-- ─────────────────────────────────────────────────────────────
--  GSC performance tracking — Supabase setup
--  Run in: Supabase > SQL Editor > New query > Run
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────

-- Every property the service account can see. Populated by the
-- edge function; client_code is assigned by a human in the UI.
create table if not exists gsc_properties (
  property_url  text primary key,          -- 'sc-domain:example.com.au' or 'https://example.com.au/'
  client_code   text,                      -- null until someone maps it
  permission    text,
  discovered_at timestamptz not null default now()
);

-- One row per property per window. 'current' = last 28 complete
-- days, 'previous' = the 28 before that.
create table if not exists gsc_metrics (
  property_url text        not null,
  period       text        not null check (period in ('current','previous')),
  start_date   date        not null,
  end_date     date        not null,
  clicks       integer     not null default 0,
  impressions  integer     not null default 0,
  ctr          numeric     not null default 0,   -- fraction, 0.0342 = 3.42%
  position     numeric     not null default 0,
  fetched_at   timestamptz not null default now(),
  primary key (property_url, period)
);

alter table gsc_properties enable row level security;
alter table gsc_metrics   enable row level security;

-- Read is open (same posture as citation_overrides).
drop policy if exists "gsc_prop_read" on gsc_properties;
create policy "gsc_prop_read" on gsc_properties for select using (true);

drop policy if exists "gsc_metrics_read" on gsc_metrics;
create policy "gsc_metrics_read" on gsc_metrics for select using (true);

-- Only the passphrase lets you map a property to a client.
-- Metrics are written by the edge function using the service role,
-- which bypasses RLS, so there is deliberately NO public write
-- policy on gsc_metrics.
drop policy if exists "gsc_prop_write" on gsc_properties;
create policy "gsc_prop_write" on gsc_properties for all
  using (
    current_setting('request.headers', true)::json ->> 'x-write-key' = 'bdm-citations'
  )
  with check (
    current_setting('request.headers', true)::json ->> 'x-write-key' = 'bdm-citations'
  );

do $$
begin
  alter publication supabase_realtime add table gsc_metrics;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table gsc_properties;
exception when others then null;
end $$;
