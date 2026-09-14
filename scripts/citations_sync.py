#!/usr/bin/env python3
"""
Read every client's Citations Tracker Google Sheet and store a
snapshot of it in Supabase.

Runs nightly from GitHub Actions, authenticating as a human account
via a stored refresh token (the same one the GSC sync uses). It needs
the Sheets read scope in addition to the Search Console scope.

IMPORTANT: this writes a SNAPSHOT. Anything a human has edited in the
dashboard lives in citation_overrides and is applied on top at render
time, so corrections made in the UI survive a sync.

Env vars (GitHub Secrets):
  GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
"""

import os
import sys
import re
import time
from urllib.parse import quote

import requests

# code -> Google Sheet file id
SHEETS = {
    "ADP": "1wnTSYbVF7cJrIqCsp7sPWrcSG9C5RqV2aN22lwqBhNs",
    "ALB": "1cn7VzFMy27Y0GG1xWKw0yypbJJWcQwm65i9-VV6r054",
    "ALT": "1Y8bDPDMHzM7pOOBOBtawoQUMA5JJHgks0c1RFPRN97I",
    "ARC": "1L-2LL2PuBv0t3RJBKxpW-wghi1qlqFWENAD_EXRm3xo",
    "ART": "15DopIeZjaa8qCYQNWJNpoE6GfQSgYH_oV6QXjtGzW7A",
    "BAL": "17J_dG16s9h5od07gt3UN7Mkixg7cAW9_fNi99jYr2kI",
    "BSD": "1si5VjDQUyDz8UMEd--UG4MJsBRiaPGkLuLnFIjTjIUE",
    "CAL": "1m6x5FvlGKfWGtbpCNMxPhY7aS1xsmoDGb1slPES8LxQ",
    "CHI": "1dA-eh_1E2567TYDHh1aOeb66y5Xe6-8X6mdKNl4cp80",
    "CRO": "1-lNNQEERWPeOTBy1PYCSQThPhdlCA3X--sB2AhPxzVw",
    "DSO": "1-pEP6KoU8xQiQWlkBGcC1_J-JhQVrYkj72J5MFfpOGg",
    "ELV": "13p1QOrzeJD-QMWPWd8wSdAdTpZIuvOQIMrkGs4GVEuk",
    "GOO": "1_NUH55piymvuVOl7h03zGe7CeUUPcoHq3i_9bno3otA",
    "HDS": "1QmdUPy0_xTEjmAdhw6Wil60e7yKHpzqMCT-yGy-G_yk",
    "HEN": "1CEFowJkZvGDHEhGDL2v0W3n30t3NvB4Pcz-Gqv_ww_Y",
    "LFD": "17quQXgVNM921VZOXPYaEH1mYFDfFxf52tPKztNGU_6U",
    "LUM": "1Q9iHuLK00Byv3xk40gkEVc77iNq1SH5GvJ1GQ9Wr0tk",
    "MAI": "1Go34B6psfEJisdzHWNFTzITmJXa44KudZZ4B7xGni8Q",
    "MAR": "1XEHVc4wUlrE8igx_Ycq9AS8Amx3vVBjeLfKXOjqOL80",
    "MQD": "1dFXRSSkPi-c0B4v_eHSw8SQM64lZo3brpaJx2Zh6DPM",
    "PER": "1QcFsQF1MCB-zQZz2hxV_Fv3NiXPJccUYNTGClLZ7ol0",
    "SWD": "1yEGGcPbH96JyGCJqbTex4rB4WPwWCPDjAVseIhOoiVs",
    "WEL": "1otgOP4pvkQuXvS5RTlYeUPGdMW1V82n-e_hkEPcXvG8",
    "WIN": "1a2uEkM5dWAnvYf8_GIYSYFo5EfihZqaGNnt4u7RS1Xc",
}

NAMES = {
    "ADP": "Advanced Dental Practice", "ALB": "Albany Place Dental Practice",
    "ALT": "Altona Meadows Dental Clinic", "ARC": "Arc Orthodontic Specialists",
    "ART": "Dental Art Clinic", "BAL": "Balmain Dental",
    "BSD": "Balanced Smiles Dental Clinic", "CAL": "Calderwood Family Dental",
    "CHI": "Chic Dental | Dentist Preston", "CRO": "Cronulla Beach Dental",
    "DSO": "Dental Society", "ELV": "Elevate Oral Surgery Kogarah",
    "GOO": "Goodna Family Dentist", "HDS": "Hanly Dental Studio Mackay",
    "HEN": "Henley Dental", "LFD": "Lily Family Dental Ripley",
    "LUM": "Luma Dental Clinic Edwardstown", "MAI": "Dr Mai Dental Surgery Parramatta",
    "MAR": "Mary St Dental Health", "MQD": "Macquarie Park Dentists",
    "PER": "Perfect Smile Adelaide", "SWD": "Sherwood Dental Brisbane",
    "WEL": "Wellness Dental Oakleigh", "WIN": "Winning Smiles Sutherland",
}

# The 34 key citation sites, keyed by canonical name -> domains that
# identify them in the sheet's "Website URL" column.
KEY_34 = {
    "Google": ["google.com", "google.com.au"],
    "Apple": ["maps.apple.com", "businessconnect.apple.com", "apple.com"],
    "LinkedIn": ["linkedin.com"], "Facebook": ["facebook.com"],
    "Bing": ["bing.com", "bingplaces.com"],
    "Yelp": ["yelp.com", "biz.yelp.com", "yelp.com.au"],
    "Foursquare": ["foursquare.com"], "American Express": ["americanexpress.com"],
    "Here": ["here.com"], "TomTom": ["tomtom.com"], "Nextdoor": ["nextdoor.com"],
    "True Local": ["truelocal.com.au"], "Health Direct": ["healthdirect.gov.au"],
    "Kompass": ["kompass.com", "au.kompass.com"], "Local Search": ["localsearch.com.au"],
    "Yahoo": ["yahoo.com"], "Infobel": ["infobel.com"],
    "Health Engine": ["healthengine.com.au"], "Word of Mouth": ["wordofmouth.com.au"],
    "Cybo": ["cybo.com"], "Yellow Pages": ["yellowpages.com.au"],
    "What Clinic": ["whatclinic.com"], "White Pages": ["whitepages.com.au"],
    "StartLocal": ["startlocal.com.au"], "VY Maps": ["vymaps.com"],
    "Health Share": ["healthshare.com.au"], "Top Rated Online": ["top-rated.online"],
    "My Community Directory": ["mycommunitydirectory.com.au"],
    "My Health 1st": ["myhealth1st.com.au"],
    "Three Best Rated": ["threebestrated.com", "threebestrated.com.au"],
    "Healthcare Link": ["healthcarelink.com.au"],
    "Aus Health Pages": ["aushealthpages.com", "aushealthpages.com.au"],
    "Fixed Dental": ["fixeddental.com.au"], "Dentist.com.au": ["dentist.com.au"],
}
DOMAIN_TO_KEY = {d: k for k, doms in KEY_34.items() for d in doms}

SHEET_RANGE = "'Citations List'!A1:Z400"


def need(var):
    v = os.environ.get(var)
    if not v:
        sys.exit(f"{var} is not set")
    return v


def access_token():
    r = requests.post("https://oauth2.googleapis.com/token", data={
        "client_id": need("GSC_CLIENT_ID"),
        "client_secret": need("GSC_CLIENT_SECRET"),
        "refresh_token": need("GSC_REFRESH_TOKEN"),
        "grant_type": "refresh_token",
    }, timeout=30)
    if not r.ok:
        sys.exit(
            f"Token refresh failed: {r.status_code} {r.text[:300]}\n"
            "If this is 'invalid_scope' or the Sheets calls 403, the refresh "
            "token predates the Sheets scope — re-run get_refresh_token.py."
        )
    return r.json()["access_token"]


def norm_domain(v):
    if not v:
        return ""
    s = str(v).strip().lower()
    s = re.sub(r"^https?://", "", s)
    s = re.sub(r"^www\.", "", s)
    return s.split("/")[0].strip()


def is_live(v):
    if not v:
        return False
    s = str(v).strip()
    return bool(s) and s.lower() not in ("nan", "none", "-") and \
        (s.lower().startswith("http") or "." in s)


def fetch_sheet(tok, sheet_id):
    r = requests.get(
        f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/{quote(SHEET_RANGE)}",
        headers={"Authorization": f"Bearer {tok}"}, timeout=60,
    )
    if not r.ok:
        raise RuntimeError(f"{r.status_code} {r.text[:200]}")
    return r.json().get("values", [])


def parse(values):
    """Return (rows, key_count, other_count) from raw sheet values."""
    hdr_idx = None
    for i, row in enumerate(values[:10]):
        low = [str(c).strip().lower() for c in row]
        if "website name" in low:
            hdr_idx = i
            break
    if hdr_idx is None:
        raise RuntimeError("no header row containing 'Website Name'")

    hdr = [str(c).strip() for c in values[hdr_idx]]

    def col(name):
        for j, h in enumerate(hdr):
            if h.lower() == name.lower():
                return j
        return None

    c_name, c_url = col("Website Name"), col("Website URL")
    c_list, c_stat = col("Listing URL"), col("Status")
    if c_url is None or c_list is None:
        raise RuntimeError("missing Website URL or Listing URL column")

    def cell(row, idx):
        return row[idx] if idx is not None and idx < len(row) else ""

    rows, seen_key, seen_other = [], set(), set()
    for raw in values[hdr_idx + 1:]:
        if not raw:
            continue
        if not is_live(cell(raw, c_list)):
            continue
        dom = norm_domain(cell(raw, c_url))
        # Many sheets have rows where a Listing URL was pasted in but
        # the Website URL column was never filled. Those are real
        # citations; fall back to the listing's own domain.
        if not dom:
            dom = norm_domain(cell(raw, c_list))
        if not dom:
            continue
        listing = str(cell(raw, c_list)).strip()
        status = str(cell(raw, c_stat)).strip()
        # Match subdomains too: app.foursquare.com is Foursquare, not
        # a separate directory.
        keyname = DOMAIN_TO_KEY.get(dom)
        if not keyname:
            for kd, kn in DOMAIN_TO_KEY.items():
                if dom.endswith("." + kd):
                    keyname = kn
                    break
        if keyname:
            if keyname in seen_key:
                continue
            seen_key.add(keyname)
            rows.append({"site_name": keyname, "category": "key", "domain": dom,
                         "listing_url": listing, "status": status})
        else:
            if dom in seen_other:
                continue
            seen_other.add(dom)
            nm = str(cell(raw, c_name)).strip() or dom
            rows.append({"site_name": nm, "category": "other", "domain": dom,
                         "listing_url": listing, "status": status})
    return rows, len(seen_key), len(seen_other)


def sb_headers():
    key = need("SUPABASE_SERVICE_ROLE_KEY")
    return {"apikey": key, "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"}


def sb(method, path, payload=None, prefer=None):
    url = need("SUPABASE_URL").rstrip("/") + "/rest/v1/" + path
    h = sb_headers()
    if prefer:
        h["Prefer"] = prefer
    r = requests.request(method, url, headers=h, json=payload, timeout=60)
    if not r.ok:
        raise RuntimeError(f"Supabase {method} {path}: {r.status_code} {r.text[:300]}")
    return r


def main():
    tok = access_token()
    total_rows, failures = 0, []

    for code, sheet_id in sorted(SHEETS.items()):
        try:
            values = fetch_sheet(tok, sheet_id)
            rows, nkey, nother = parse(values)

            # Replace this client's snapshot wholesale. A directory
            # removed from the sheet should disappear here too, which
            # an upsert alone would not achieve.
            sb("DELETE", f"citation_rows?client_code=eq.{code}", prefer="return=minimal")
            if rows:
                sb("POST", "citation_rows",
                   [{"client_code": code, **r} for r in rows],
                   prefer="return=minimal")

            sb("POST", "citation_sheets?on_conflict=client_code",
               [{"client_code": code, "sheet_id": sheet_id,
                 "client_name": NAMES.get(code, code),
                 "last_synced": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                 "row_count": len(rows), "sync_error": None}],
               prefer="resolution=merge-duplicates,return=minimal")

            total_rows += len(rows)
            print(f"  {code}  key {nkey:>2}/34   other {nother:>3}")

        except Exception as e:
            msg = str(e)[:400]
            failures.append(f"{code}: {msg}")
            print(f"  {code}  FAILED: {msg}")
            try:
                sb("POST", "citation_sheets?on_conflict=client_code",
                   [{"client_code": code, "sheet_id": sheet_id,
                     "client_name": NAMES.get(code, code), "sync_error": msg}],
                   prefer="resolution=merge-duplicates,return=minimal")
            except Exception:
                pass

    print(f"\n{len(SHEETS) - len(failures)}/{len(SHEETS)} sheets synced, "
          f"{total_rows} rows written.")

    if failures:
        # Fail the build. A green run hiding stale data for some
        # clients is worse than a red one someone investigates.
        print("\nFailures:")
        for f in failures:
            print(f"  {f}")
        sys.exit(1)


if __name__ == "__main__":
    main()
