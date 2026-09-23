-- ─────────────────────────────────────────────────────────────
--  Add a year-on-year comparison window
--  Run in: Supabase > SQL Editor > New query > Run
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────

-- gsc_metrics originally allowed only 'current' and 'previous'.
-- 'year_ago' is the same 28 days one year earlier, which is the
-- honest comparison for a seasonal business: a dental practice in
-- August against the previous 28 days in July is partly measuring
-- school holidays, not performance.
alter table gsc_metrics
  drop constraint if exists gsc_metrics_period_check;

alter table gsc_metrics
  add constraint gsc_metrics_period_check
  check (period in ('current', 'previous', 'year_ago'));

-- NOTE: Search Console retains roughly 16 months of data. The
-- year-ago window sits just inside that, so it is available now but
-- will be empty for any property added to Search Console less than
-- about 13 months ago. The dashboard shows "no year-ago data" in
-- that case rather than reporting a false decline.
