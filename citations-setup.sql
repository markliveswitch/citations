-- ─────────────────────────────────────────────────────────────
--  Citation sheet sync — Supabase setup
--  Run in: Supabase > SQL Editor > New query > Run
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────

-- Which Google Sheet belongs to which client. Seeded by the sync
-- script from the values baked into it, but editable here if a
-- sheet ever moves.
create table if not exists citation_sheets (
  client_code  text primary key,
  sheet_id     text not null,
  client_name  text,
  last_synced  timestamptz,
  row_count    integer,
  sync_error   text
);

-- One row per client per directory, as read from the sheet.
-- This is a SNAPSHOT of the sheet, not the source of truth for
-- edits: anything in citation_overrides still wins at render time,
-- so a correction made in the dashboard is not wiped by the next
-- sync.
create table if not exists citation_rows (
  client_code  text not null,
  site_name    text not null,
  category     text not null check (category in ('key','other')),
  domain       text,
  listing_url  text,
  status       text,
  synced_at    timestamptz not null default now(),
  primary key (client_code, site_name)
);

create index if not exists citation_rows_client on citation_rows (client_code);

alter table citation_sheets enable row level security;
alter table citation_rows   enable row level security;

drop policy if exists "sheets_read" on citation_sheets;
create policy "sheets_read" on citation_sheets for select using (true);

drop policy if exists "rows_read" on citation_rows;
create policy "rows_read" on citation_rows for select using (true);

-- Deliberately no public write policy. Only the GitHub Action
-- writes here, using the service role, which bypasses RLS.

do $$
begin
  alter publication supabase_realtime add table citation_rows;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table citation_sheets;
exception when others then null;
end $$;
