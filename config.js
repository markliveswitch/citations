// ─────────────────────────────────────────────────────────────
//  BACKEND CONFIG
//
//  Leave these blank and the dashboard runs in read-only mode
//  with export-to-file editing.
//
//  Fill them in and edits save to Supabase and sync live
//  across everyone viewing the dashboard.
//
//  SETUP:
//   1. Create a free project at https://supabase.com
//   2. Project Settings > API Keys > copy the Project URL and
//      the PUBLISHABLE key (sb_publishable_...) into the fields below.
//      NEVER use the secret key (sb_secret_...) here — this repo
//      is public and that key bypasses Row Level Security.
//   3. Run the SQL in supabase-setup.sql (SQL Editor > New query)
//   4. Commit this file
//
//  SECURITY NOTE: this repo is public, so this key is public too.
//  That is expected for a Supabase anon key, BUT it is only safe
//  if Row Level Security is switched on. The SQL in
//  supabase-setup.sql turns it on and restricts writes. Do not
//  skip that step, or anyone who views source can wipe the table.
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = "https://ymcecfebxvzbginngvvj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dh7mNnkEgLBgmernBWmRCQ_8pgjsMZn";

// Shared write password. Anyone with the dashboard URL can read;
// only people who enter this can save. Change it here and in the
// SQL policy if you want to rotate it.
const WRITE_PASSPHRASE = "bdm-citations";
