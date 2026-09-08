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
//   2. Project Settings > Data API > copy "Project URL" and
//      the "anon / public" key into the two fields below
//   3. Run the SQL in supabase-setup.sql (SQL Editor > New query)
//   4. Commit this file
//
//  SECURITY NOTE: this repo is public, so this key is public too.
//  That is expected for a Supabase anon key, BUT it is only safe
//  if Row Level Security is switched on. The SQL in
//  supabase-setup.sql turns it on and restricts writes. Do not
//  skip that step, or anyone who views source can wipe the table.
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = "";       // e.g. "https://abcdefgh.supabase.co"
const SUPABASE_ANON_KEY = "";  // the anon / public key

// Shared write password. Anyone with the dashboard URL can read;
// only people who enter this can save. Change it here and in the
// SQL policy if you want to rotate it.
const WRITE_PASSPHRASE = "bdm-citations";
