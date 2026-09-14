#!/usr/bin/env python3
"""
ONE-TIME SETUP — run this on your own machine, not in CI.

Signs you in to Google and prints a refresh token that lets the
GitHub Action read Search Console as you. Because it acts as your
account, it can see every property you already have access to —
no service-account grants needed.

BEFORE RUNNING
--------------
1. Google Cloud Console > APIs & Services > OAuth consent screen
     - User type: External
     - Fill in app name / support email / developer email
     - Scopes: you can skip adding any here
     - Test users: add your own Google account
     - THEN CLICK "PUBLISH APP" so status is "In production".
       Leave it in Testing and Google expires your refresh token
       after 7 DAYS. The sync will work for a week and then die
       quietly. This is the single most common way this setup fails.

2. APIs & Services > Credentials > + Create Credentials
     > OAuth client ID > Application type: DESKTOP APP
   Note the Client ID and Client Secret.

RUN
---
    pip install google-auth-oauthlib
    GSC_CLIENT_ID=xxx GSC_CLIENT_SECRET=yyy python get_refresh_token.py

A browser opens; sign in with the Google account that has Search
Console access and approve. The refresh token is printed at the end.

Store these three as GitHub Secrets:
    GSC_CLIENT_ID
    GSC_CLIENT_SECRET
    GSC_REFRESH_TOKEN
"""

import os
import sys

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
except ImportError:
    sys.exit("Run:  pip install google-auth-oauthlib")

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
]

client_id = os.environ.get("GSC_CLIENT_ID")
client_secret = os.environ.get("GSC_CLIENT_SECRET")
if not client_id or not client_secret:
    sys.exit("Set GSC_CLIENT_ID and GSC_CLIENT_SECRET first.")

flow = InstalledAppFlow.from_client_config(
    {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost"],
        }
    },
    scopes=SCOPES,
)

# access_type=offline + prompt=consent forces Google to hand back a
# refresh token. Without prompt=consent it often returns none on
# repeat authorisations, which is confusing to debug.
creds = flow.run_local_server(
    port=0,
    access_type="offline",
    prompt="consent",
)

if not creds.refresh_token:
    sys.exit(
        "No refresh token returned. Revoke this app at "
        "https://myaccount.google.com/permissions and run again."
    )

print("\n" + "=" * 62)
print("GSC_REFRESH_TOKEN")
print("=" * 62)
print(creds.refresh_token)
print("=" * 62)
print("\nAdd that as a GitHub Secret. Treat it like a password —")
print("it grants read access to your Search Console data.")
