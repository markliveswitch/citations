-- ─────────────────────────────────────────────────────────────
--  Citations dashboard — Supabase setup
--  Run this once in: Supabase > SQL Editor > New query > Run
-- ─────────────────────────────────────────────────────────────

-- One row per client+site override. The dashboard falls back to
-- the tracker-sheet data whenever no override row exists, so this
-- table only ever holds what someone has edited.
create table if not exists citation_overrides (
  client_code   text        not null,
  site_name     text        not null,
  listing_url   text,
  status        text,
  updated_at    timestamptz not null default now(),
  updated_by    text,
  primary key (client_code, site_name)
);

-- Row Level Security. Without this, the public anon key lets
-- anyone read AND wipe the table.
alter table citation_overrides enable row level security;

-- Anyone may read. The dashboard is behind an obscure URL, and
-- this data is directory listings, not credentials.
drop policy if exists "read_all" on citation_overrides;
create policy "read_all"
  on citation_overrides for select
  using (true);

-- Writes require the shared passphrase, sent by the dashboard as
-- a request header. Keep this string identical to
-- WRITE_PASSPHRASE in config.js.
drop policy if exists "write_with_passphrase" on citation_overrides;
create policy "write_with_passphrase"
  on citation_overrides for all
  using (
    current_setting('request.headers', true)::json ->> 'x-write-key'
      = 'bdm-citations'
  )
  with check (
    current_setting('request.headers', true)::json ->> 'x-write-key'
      = 'bdm-citations'
  );

-- Broadcast changes to every open dashboard so edits appear live.
-- Wrapped so re-running this script does not error with
-- "already member of publication".
do $$
begin
  alter publication supabase_realtime add table citation_overrides;
exception
  when duplicate_object then null;
  when others then null;
end $$;

-- ─────────────────────────────────────────────────────────────
--  NOTE ON THE PASSPHRASE
--  This is a shared secret, not real per-user auth. It stops
--  casual/anonymous tampering; it does not tell you WHO made a
--  change, and anyone who has ever had the dashboard can still
--  write until you rotate it. If you need per-person accountability
--  or revocable access, switch to Supabase Auth with an email
--  allowlist instead.
-- ─────────────────────────────────────────────────────────────
