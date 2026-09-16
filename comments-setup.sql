-- ─────────────────────────────────────────────────────────────
--  Per-citation comments — Supabase setup
--  Run in: Supabase > SQL Editor > New query > Run
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- One row per comment. A comment is anchored to a client + citation
-- pair, which is the same key the rest of the tracker uses, so a
-- thread survives a sheet re-sync and is not tied to a row position.
create table if not exists citation_comments (
  id          uuid primary key default gen_random_uuid(),
  client_code text        not null,
  site_name   text        not null,
  author      text        not null,
  body        text        not null,
  parent_id   uuid        references citation_comments(id) on delete cascade,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz
);

create index if not exists citation_comments_thread
  on citation_comments (client_code, site_name, created_at);

alter table citation_comments enable row level security;

-- Anyone who can open the dashboard can read the discussion.
drop policy if exists "comments_read" on citation_comments;
create policy "comments_read" on citation_comments for select using (true);

-- Posting requires the shared passphrase, same gate as every other
-- write. Note this is a shared secret, not per-person auth: the
-- author name is self-declared and NOT verified. Treat comments as
-- attributable-by-convention, not as an audit trail.
drop policy if exists "comments_write" on citation_comments;
create policy "comments_write" on citation_comments for all
  using (
    current_setting('request.headers', true)::json ->> 'x-write-key' = 'bdm-citations'
  )
  with check (
    current_setting('request.headers', true)::json ->> 'x-write-key' = 'bdm-citations'
  );

do $$
begin
  alter publication supabase_realtime add table citation_comments;
exception when others then null;
end $$;
