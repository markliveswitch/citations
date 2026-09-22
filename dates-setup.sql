-- ─────────────────────────────────────────────────────────────
--  Citation creation dates
--  Run in: Supabase > SQL Editor > New query > Run
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────

-- Stored as TEXT, not DATE, on purpose.
--
-- The source sheets hold US M.D.YY strings and 11 of 24 clients have
-- no date column at all. Forcing a DATE type would mean either
-- guessing at malformed values or rejecting the row. Text keeps
-- exactly what the sheet said, or exactly what a human typed, and
-- never silently invents a day.
--
-- Display format throughout is "15 March 2026".
alter table citation_overrides
  add column if not exists created_on text;

alter table citation_rows
  add column if not exists created_on text;
