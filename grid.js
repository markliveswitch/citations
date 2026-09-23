// ─────────────────────────────────────────────────────────────
//  Local Search Grid — BrightLocal
//
//  Average rank on each client's PRIMARY LOCAL KEYWORD: the
//  service-plus-suburb term, whatever the service is. That is
//  "dentist lidcombe" for one client and "oral surgeon Kogarah"
//  for another — not always the word "dentist".
//
//  Pulled by hand through the BrightLocal MCP connector. It cannot
//  be automated from the nightly GitHub Action, because the MCP
//  connector only works inside a Claude conversation. Automating it
//  needs a production BrightLocal REST API key; the current key is
//  a 1,000-request trial that 24 clients would exhaust.
//
//  avg_rank: lower is better. 1.0 means first place at every point.
//  Entries with avg_rank null have not been pulled yet — the ids
//  are recorded so the next pull is a single call per client.
// ─────────────────────────────────────────────────────────────

const GRID_DATA = {
 "pulled_on": "23 September 2026",
 "source": "BrightLocal Local Search Grid",

 // READING avg_rank — two traps:
 //  1. BrightLocal returns rank 0 for a point where the business does
 //     NOT appear, and folds those into the average as a penalty. A
 //     mediocre average can therefore mean "absent from some points"
 //     rather than "mid-table everywhere".
 //  2. An average of 0 does NOT mean first place. It means the
 //     business appeared at NO point on the grid. Never band 0 as good.
 // found_at is the honest measure: how many points it appeared at.
 "clients": {
  "SWD": { "keyword": "dentist sherwood", "avg_rank": 1.0, "points": 49, "found_at": 49,
           "high": 49, "med": 0, "low": 0, "run_date": "2 September 2026",
           "report_id": 345821, "keyword_id": 2170246, "run_id": 5737257 },
  "ELV": { "keyword": "oral surgeon Kogarah", "avg_rank": 1.0, "points": 49, "found_at": 49,
           "high": 49, "med": 0, "low": 0, "run_date": "2 September 2026",
           "report_id": 305373, "keyword_id": 1971103, "run_id": 5737203 },
  "WIN": { "keyword": "dentist sutherland", "avg_rank": 4.1, "points": 49, "found_at": 49,
           "high": 0, "med": 49, "low": 0, "run_date": "10 September 2026",
           "report_id": 456208, "keyword_id": 2931330, "run_id": 5779670 },
  "MAR": { "keyword": "dentist lidcombe", "avg_rank": 4.3, "points": 49, "found_at": 49,
           "high": 0, "med": 49, "low": 0, "run_date": "7 September 2026",
           "report_id": 234832, "keyword_id": 1479450, "run_id": 5767247 },
  "WEL": { "keyword": "dentist oakleigh", "avg_rank": 5.2, "points": 49, "found_at": 49,
           "high": 3, "med": 46, "low": 0, "run_date": "2 September 2026",
           "report_id": 259558, "keyword_id": 1631258, "run_id": 5737258 },
  "MQD": { "keyword": "dentist Macquarie Park", "avg_rank": 5.8, "points": 49, "found_at": 38,
           "high": 38, "med": 0, "low": 11, "run_date": "16 September 2026",
           "note": "Ranks 1st or 2nd at every point where it appears, but is absent from 11 of 49. A coverage problem, not a ranking one.",
           "report_id": 293879, "keyword_id": 1853697, "run_id": 5811165 },
  "HEN": { "keyword": "dentist homebush", "avg_rank": 6.2, "points": 49, "found_at": 49,
           "high": 0, "med": 49, "low": 0, "run_date": "2 September 2026",
           "report_id": 54238, "keyword_id": 218865, "run_id": 5737241 },
  "CHI": { "keyword": "dentist preston", "avg_rank": 7.3, "points": 49, "found_at": 49,
           "high": 6, "med": 34, "low": 9, "run_date": "2 September 2026",
           "report_id": 262887, "keyword_id": 1651136, "run_id": 5737175 },
  "PER": { "keyword": "dentist adelaide", "avg_rank": 9.1, "points": 49, "found_at": 49,
           "high": 1, "med": 33, "low": 15, "run_date": "2 September 2026",
           "report_id": 88427, "keyword_id": 1495669, "run_id": 5737256 },
  "HDS": { "keyword": "dentist Mackay", "avg_rank": 12.6, "points": 37, "found_at": 37,
           "high": 0, "med": 8, "low": 29, "run_date": "8 September 2026",
           "report_id": 451920, "keyword_id": 2907375, "run_id": 5774617 },

  // Rank 0 at all 49 points: does not appear anywhere on the grid.
  "LFD": { "keyword": "dentist Ripley", "avg_rank": 0, "points": 49, "found_at": 0,
           "high": 0, "med": 0, "low": 49, "run_date": "2 September 2026",
           "note": "Does not appear at ANY point on the grid for this keyword. Not a ranking problem — the listing is absent from local results entirely.",
           "report_id": 454482, "keyword_id": 2988105, "run_id": 5737250 },

  "ARC": { "keyword": "orthodontist Burwood", "avg_rank": 1.0, "points": 49, "found_at": 49,
           "high": 49, "med": 0, "low": 0, "run_date": "17 July 2026", "stale": true,
           "note": "Grid run is from 17 July — over two months older than every other client. The 1.0 may no longer hold.",
           "report_id": 309929, "keyword_id": 2054341, "run_id": 5485613 },
  "BSD": { "keyword": "dentist Rowville", "avg_rank": 12.2, "points": 49, "found_at": 49,
           "high": 0, "med": 15, "low": 34, "run_date": "2 September 2026",
           "report_id": 453298, "keyword_id": 2914699, "run_id": 5737173 },

  // Rank 0 at all 49 points: does not appear anywhere on the grid.
  "MAI": { "keyword": "dentist Parramatta", "avg_rank": 0, "points": 49, "found_at": 0,
           "high": 0, "med": 0, "low": 49, "run_date": "12 August 2026",
           "note": "Does not appear at ANY point on the grid for this keyword. Not a ranking problem — the listing is absent from local results entirely.",
           "report_id": 434133, "keyword_id": 2810209, "run_id": 5622837 },

  // Report exists but tracks NO service-plus-suburb keyword.
  "GOO": { "keyword": null, "avg_rank": null, "note": "No suburb keyword tracked",
           "report_id": 373802 }
 }
};

// ─────────────────────────────────────────────────────────────
//  BrightLocal location IDs, matched by business name 23 Sep 2026.
//  Recorded so the next step (find_lsg_reports by location_id, then
//  get_lsg_report_run) is two calls per client rather than three.
//
//  DUPLICATES: three clients have two location records each in
//  BrightLocal, same address, different reference. Reports may be
//  attached to either, so the wrong one can look like "no report".
//  Worth cleaning up in BrightLocal rather than working around here.
// ─────────────────────────────────────────────────────────────
const GRID_LOCATIONS = {
 "ADP": { "location_id": 2489162, "name": "Advanced Dental Practice Kingsgrove" },
 "ALB": { "location_id": 4038614, "name": "Albany Place Dental Practice" },
 "ALT": { "location_id": 4066929, "name": "Altona Meadows Dental Clinic" },
 "ARC": { "location_id": 3846624, "name": "Arc Orthodontic Specialists",
          "duplicate_of": 3799834,
          "note": "REPORT IS ON THE OTHER RECORD (3799834). 3846624 has no LSG report at all." },
 "ART": { "location_id": 3710446, "name": "Dental Art Clinic" },
 "BAL": { "location_id": 2986125, "name": "Balmain Dentist" },
 "BSD": { "location_id": 4040761, "name": "Balanced Smiles Dental Clinic",
          "duplicate_of": 4016170,
          "note": "BOTH records have a report. 4040761 holds the recent run (Sep); 4016170 is far older. Used the newer." },
 "CAL": { "location_id": 3929215, "name": "Calderwood Family Dental" },
 "CRO": { "location_id": 4022544, "name": "Cronulla Beach Dental" },
 "DSO": { "location_id": 2396249, "name": "Dental Society (formerly part of St Clair Medical and Dental Centre)" },
 "LUM": { "location_id": 4091902, "name": "LUMA Dental Clinic SA" },
 "MAI": { "location_id": 4064230, "name": "Dr Mai Dental Surgery Parramatta",
          "duplicate_of": 3981595,
          "note": "Two Parramatta records at 126 Church St. A separate Bankstown location (3981597) is a different practice site, not a duplicate." },

 // Already have report and run ids recorded above.
 "CHI": { "location_id": 3656957, "name": "Chic Dental | Dentist Preston" }
};
