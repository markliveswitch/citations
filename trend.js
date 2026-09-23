// ─────────────────────────────────────────────────────────────
//  Shared search-performance scoring.
//
//  Loaded by BOTH index.html and client.html on purpose. The key
//  citation list was previously duplicated in two files and had to
//  be manually checked for drift; scoring lives here so the same
//  client can never show "good" on one page and "flat" on another.
// ─────────────────────────────────────────────────────────────

// Flat band, per Rich: anything within +/-8% is not a real move.
var TREND_BAND = 8;

// Combined clicks below this across both periods is too small to
// score honestly — 9 clicks becoming 12 is +33% and means nothing.
var TREND_MIN_CLICKS = 20;

function trendPct(cur, prev) {
  if (!prev) return null;                 // no baseline, no verdict
  return ((cur - prev) / prev) * 100;
}

// Scores clicks, impressions and average position.
//
// CTR is deliberately EXCLUDED: it is clicks divided by impressions,
// so counting it as well would count clicks twice and flatter any
// client whose impressions have collapsed.
//
// Clicks carry double weight. Impressions and position are leading
// indicators; clicks are the outcome that matters.
function scoreTrend(c, v) {
  if (!c || !v) {
    return { verdict: 'none', label: 'no data', composite: null,
             why: 'No Search Console data for this client yet.' };
  }
  if ((c.clicks + v.clicks) < TREND_MIN_CLICKS) {
    return { verdict: 'low', label: 'low volume', composite: null,
             why: 'Fewer than ' + TREND_MIN_CLICKS + ' clicks across both periods — percentage moves here are noise, not signal.' };
  }

  var dClicks = trendPct(c.clicks, v.clicks);
  var dImpr   = trendPct(c.impressions, v.impressions);
  // Position is better when it falls, so invert it to put every
  // metric on the same "up is good" scale.
  var dPos    = trendPct(c.position, v.position);
  if (dPos !== null) dPos = -dPos;

  // The +/-8% band is applied to EACH metric, then the votes are
  // combined. Applying it to an average instead lets opposing moves
  // cancel: a client with clicks down 9% and impressions down 23%
  // averages back inside the band and reads "flat", which is wrong.
  var parts = [], score = 0;
  function vote(d, w, name) {
    if (d === null) { parts.push(name + ' n/a'); return; }
    var dir = d > TREND_BAND ? 1 : (d < -TREND_BAND ? -1 : 0);
    score += dir * w;
    parts.push(name + ' ' + (d > 0 ? '+' : '') + d.toFixed(1) + '%' +
               (dir === 0 ? ' (flat)' : ''));
  }
  vote(dClicks, 2, 'clicks');
  vote(dImpr, 1, 'impressions');
  vote(dPos, 1, 'position');

  if (dClicks === null && dImpr === null && dPos === null) {
    return { verdict: 'none', label: 'no data', composite: null,
             why: 'No previous-period baseline to compare against.' };
  }

  var verdict = score > 0 ? 'good' : (score < 0 ? 'bad' : 'flat');
  var label = verdict === 'good' ? 'improving'
            : verdict === 'bad' ? 'declining'
            : 'flat';

  return {
    verdict: verdict, label: label, composite: score,
    why: parts.join(', ') + '  →  score ' + (score > 0 ? '+' : '') + score +
         '. Each metric is scored against a +/-' + TREND_BAND + '% band; clicks count double; ' +
         'position is inverted so up is good; CTR is excluded because it is derived from clicks and impressions.'
  };
}

function trendTagHtml(c, v) {
  var t = scoreTrend(c, v);
  var cls = t.verdict === 'good' ? 'live'
          : t.verdict === 'bad' ? 'mismatch'
          : 'pending';
  var safe = String(t.why).replace(/"/g, '&quot;');
  return '<span class="tag ' + cls + '" title="' + safe + '">' + t.label + '</span>';
}
