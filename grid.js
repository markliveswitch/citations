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
 "source": "BrightLocal Local Search Grid, 7x7 grids",
 "clients": {
  "SWD": { "keyword": "dentist sherwood", "avg_rank": 1.0,
           "points": 49, "high": 49, "med": 0, "low": 0,
           "run_date": "2 September 2026", "report_id": 345821, "keyword_id": 2170246, "run_id": 5737257 },
  "MAR": { "keyword": "dentist lidcombe", "avg_rank": 4.3,
           "points": 49, "high": 0, "med": 49, "low": 0,
           "run_date": "7 September 2026", "report_id": 234832, "keyword_id": 1479450, "run_id": 5767247 },
  "WEL": { "keyword": "dentist oakleigh", "avg_rank": 5.2,
           "points": 49, "high": 3, "med": 46, "low": 0,
           "run_date": "2 September 2026", "report_id": 259558, "keyword_id": 1631258, "run_id": 5737258 },
  "CHI": { "keyword": "dentist preston", "avg_rank": 7.3,
           "points": 49, "high": 6, "med": 34, "low": 9,
           "run_date": "2 September 2026", "report_id": 262887, "keyword_id": 1651136, "run_id": 5737175 },

  // Report located, average not yet pulled.
  "HEN": { "keyword": "dentist homebush", "avg_rank": null,
           "report_id": 54238, "keyword_id": 218865, "run_id": 5737241 },
  "PER": { "keyword": "dentist adelaide", "avg_rank": null,
           "report_id": 88427, "keyword_id": 1495669, "run_id": 5737256 },
  "MQD": { "keyword": "dentist Macquarie Park", "avg_rank": null,
           "report_id": 293879, "keyword_id": 1853697, "run_id": 5811165 },
  "ELV": { "keyword": "oral surgeon Kogarah", "avg_rank": null,
           "report_id": 305373, "keyword_id": 1971103, "run_id": 5737203 },
  "HDS": { "keyword": "dentist Mackay", "avg_rank": null,
           "report_id": 451920, "keyword_id": 2907375, "run_id": 5774617 },
  "LFD": { "keyword": "dentist Ripley", "avg_rank": null,
           "report_id": 454482, "keyword_id": 2988105, "run_id": 5737250 },
  "WIN": { "keyword": "dentist sutherland", "avg_rank": null,
           "report_id": 456208, "keyword_id": 2931330, "run_id": 5779670 },

  // Report exists but tracks NO service-plus-suburb keyword. Its
  // keywords are "dentist near me", "dentist Redbank Plains",
  // "dentist Collingwood Park", "dentist Camira" — nothing for
  // Goodna itself, despite that being the practice suburb.
  "GOO": { "keyword": null, "avg_rank": null, "note": "No suburb keyword tracked",
           "report_id": 373802 }
 }
};
