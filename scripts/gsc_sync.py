#!/usr/bin/env python3
"""
Pull Google Search Console performance for every property the
authorising account can read, and store two comparison windows
in Supabase.

Authenticates as a human account via a stored refresh token,
rather than as a service account. That matters because adding a
service account to a Search Console property requires verified
ownership, which we do not have on most client properties — but
our own account already has read access to all of them.

Env vars (all GitHub Secrets):
  GSC_CLIENT_ID
  GSC_CLIENT_SECRET
  GSC_REFRESH_TOKEN            from get_refresh_token.py
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY    bypasses RLS; server-side only
"""

import os
import sys
from datetime import date, timedelta
from urllib.parse import quote

import requests

# Search Console finalises data 2-3 days behind. Ending BOTH windows
# three days back compares complete data to complete data. Without
# this the current window is always missing its last few days and
# every client appears to be declining.
LAG_DAYS = 3
WINDOW = 28


def need(var):
    v = os.environ.get(var)
    if not v:
        sys.exit(f"{var} is not set")
    return v


def windows():
    end = date.today() - timedelta(days=LAG_DAYS)
    cur_start = end - timedelta(days=WINDOW - 1)
    prev_end = cur_start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=WINDOW - 1)
    return {
        "current": (cur_start.isoformat(), end.isoformat()),
        "previous": (prev_start.isoformat(), prev_end.isoformat()),
    }


def access_token():
    r = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": need("GSC_CLIENT_ID"),
            "client_secret": need("GSC_CLIENT_SECRET"),
            "refresh_token": need("GSC_REFRESH_TOKEN"),
            "grant_type": "refresh_token",
        },
        timeout=30,
    )
    if not r.ok:
        # invalid_grant almost always means the consent screen was
        # left in Testing mode and Google expired the token at 7 days.
        sys.exit(
            f"Token refresh failed: {r.status_code} {r.text[:300]}\n"
            "If this says 'invalid_grant', check the OAuth consent screen "
            "is PUBLISHED (in production), then re-run get_refresh_token.py."
        )
    return r.json()["access_token"]


def list_sites(tok):
    r = requests.get(
        "https://www.googleapis.com/webmasters/v3/sites",
        headers={"Authorization": f"Bearer {tok}"},
        timeout=30,
    )
    r.raise_for_status()
    entries = r.json().get("siteEntry", [])
    return [s for s in entries if s.get("permissionLevel") != "siteUnverifiedUser"]


def query(tok, site, start, end):
    r = requests.post(
        f"https://www.googleapis.com/webmasters/v3/sites/{quote(site, safe='')}/searchAnalytics/query",
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
        json={"startDate": start, "endDate": end, "dimensions": [], "rowLimit": 1},
        timeout=60,
    )
    if not r.ok:
        print(f"  ! {site} {start}..{end}: {r.status_code} {r.text[:160]}")
        return None
    rows = r.json().get("rows", [])
    if not rows:
        return {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0}
    row = rows[0]
    return {
        "clicks": int(row.get("clicks", 0)),
        "impressions": int(row.get("impressions", 0)),
        "ctr": float(row.get("ctr", 0)),
        "position": float(row.get("position", 0)),
    }


def sb_headers():
    key = need("SUPABASE_SERVICE_ROLE_KEY")
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


def upsert(table, rows, on_conflict, ignore_dupes=False):
    if not rows:
        return
    url = need("SUPABASE_URL").rstrip("/")
    prefer = "resolution=ignore-duplicates" if ignore_dupes else "resolution=merge-duplicates"
    r = requests.post(
        f"{url}/rest/v1/{table}?on_conflict={on_conflict}",
        headers={**sb_headers(), "Prefer": f"{prefer},return=minimal"},
        json=rows,
        timeout=60,
    )
    if not r.ok:
        sys.exit(f"Supabase write to {table} failed: {r.status_code} {r.text[:400]}")


def main():
    tok = access_token()
    sites = list_sites(tok)
    print(f"Properties visible: {len(sites)}")
    if not sites:
        sys.exit("No properties returned — does this account have Search Console access?")

    w = windows()
    print(f"current  {w['current'][0]} .. {w['current'][1]}")
    print(f"previous {w['previous'][0]} .. {w['previous'][1]}\n")

    # Register properties without clobbering client_code mappings
    # someone has already made in the dashboard.
    upsert(
        "gsc_properties",
        [{"property_url": s["siteUrl"], "permission": s.get("permissionLevel")} for s in sites],
        "property_url",
        ignore_dupes=True,
    )

    rows, failed = [], []
    for s in sites:
        site = s["siteUrl"]
        for period, (start, end) in w.items():
            m = query(tok, site, start, end)
            if m is None:
                failed.append(f"{site}:{period}")
                continue
            rows.append({
                "property_url": site, "period": period,
                "start_date": start, "end_date": end, **m,
            })
        print(f"  {site}")

    upsert("gsc_metrics", rows, "property_url,period")
    print(f"\nWrote {len(rows)} rows for {len(sites)} properties.")

    if failed:
        # Fail loudly. A green build hiding partial data is worse
        # than a red one you investigate.
        print(f"\nFailed: {len(failed)}")
        for f in failed:
            print(f"  {f}")
        sys.exit(1)


if __name__ == "__main__":
    main()
