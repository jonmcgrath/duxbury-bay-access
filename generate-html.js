/**
 * Duxbury Bay — HTML Generator
 * Creates:
 *   all-sites-map.html    — interactive map with clickable numbered markers
 *   {folder}/index.html   — site detail page (maps, parking, conditions, plans)
 *
 * Run AFTER generate-all-sites-map.js (needs all-sites-base.png + site folders)
 */

const fs   = require('fs');
const path = require('path');

// ─── SITE DATA ────────────────────────────────────────────────────────────────
const ALL_SITES     = require('./sites.json').map(s => ({
  ...s,
  color: s.category === 'town-landing' ? '#C0392B' : '#1A6FA8',
}));
const TOWN_LANDINGS = ALL_SITES.filter(s => s.category === 'town-landing');
const WAYS_TO_WATER = ALL_SITES.filter(s => s.category === 'way-to-water');

// ─── MAP PROJECTION (same as generate-all-sites-map.js) ───────────────────────

const ZOOM = 14, WIDTH = 1200, HEIGHT = 1050;
const CENTER_LAT = 42.033, CENTER_LNG = -70.687;
const DOT_R = 14;

function project(lat, lng) {
  const TILE  = 256;
  const scale = Math.pow(2, ZOOM) * TILE;
  const worldX = (lng + 180) / 360 * scale;
  const sinLat = Math.sin(lat * Math.PI / 180);
  const worldY = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  const cX = (CENTER_LNG + 180) / 360 * scale;
  const cS = Math.sin(CENTER_LAT * Math.PI / 180);
  const cY = (0.5 - Math.log((1 + cS) / (1 - cS)) / (4 * Math.PI)) * scale;
  return { x: Math.round(worldX - cX + WIDTH / 2), y: Math.round(worldY - cY + HEIGHT / 2) };
}

// ─── LEGEND SVG (same as in generate-all-sites-map.js) ───────────────────────

function legendSVG() {
  const pad=14, lineH=22, ldotR=9, fsize=13, hsize=13, col2X=340;
  const col1 = TOWN_LANDINGS.slice(0, 11);
  const col2 = TOWN_LANDINGS.slice(11);

  const rowItem = (x, y, color, label, text, approx, href) => `
    <a href="${href}" class="marker-link">
      <circle cx="${x+ldotR}" cy="${y+ldotR-1}" r="${ldotR}" fill="${color}" class="dot"/>
      <text x="${x+ldotR}" y="${y+ldotR-1}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="bold" fill="white" font-family="Arial,sans-serif" class="lbl">${label}</text>
    </a>
    <text x="${x+ldotR*2+5}" y="${y+ldotR+4}" font-size="${fsize}" fill="#111" font-family="Arial,sans-serif">${text}${approx?' *':''}</text>`;

  let rows = '';
  let hY = pad+17+17+12;
  rows += `<text x="${pad}" y="${hY}" font-size="${hsize}" font-weight="bold" fill="#C0392B" font-family="Arial,sans-serif" letter-spacing="0.5">TOWN LANDINGS</text>`;
  let rY = hY+lineH*0.85;
  let yC1=rY; for(const s of col1){ rows+=rowItem(pad,yC1,'#C0392B',s.label,`${s.id}. ${s.name}`,s.approx,`${s.id}-${s.slug}/index.html`); yC1+=lineH; }
  let yC2=rY; for(const s of col2){ rows+=rowItem(col2X,yC2,'#C0392B',s.label,`${s.id}. ${s.name}`,s.approx,`${s.id}-${s.slug}/index.html`); yC2+=lineH; }

  const wwHY = Math.max(yC1,yC2)+lineH*0.4;
  rows += `<text x="${pad}" y="${wwHY}" font-size="${hsize}" font-weight="bold" fill="#1A6FA8" font-family="Arial,sans-serif" letter-spacing="0.5">WAYS TO THE WATER</text>`;
  let wY=wwHY+lineH*0.85;
  for(const s of WAYS_TO_WATER){ rows+=rowItem(pad,wY,'#1A6FA8',s.label,`${s.id}. ${s.name}`,s.approx,`${s.id}-${s.slug}/index.html`); wY+=lineH; }

  const noteY=wY+lineH*0.4;
  rows += `<text x="${pad}" y="${noteY}" font-size="11" fill="#888" font-family="Arial,sans-serif">* Location approximate — verify against Chapter 7</text>`;

  const boxW=col2X+320;
  // Links float to the right of the Ways to the Water items
  const wwMid = wwHY + lineH*0.85 + (WAYS_TO_WATER.length * lineH) / 2;
  const rpLeft = col2X + 4;
  const rpWidth = (boxW - pad) - rpLeft - 8;  // boxW-pad = box right edge in g-coords
  const linkX = rpLeft + rpWidth / 2;
  const gisY = wwMid - 14;
  const concomY = wwMid + 14;
  rows += `
  <rect x="${rpLeft}" y="${gisY-20}" width="${rpWidth}" height="${concomY-gisY+36}" rx="4" fill="white" fill-opacity="0.42"/>
  <a href="https://www.axisgis.com/DuxburyMA/" target="_blank" class="legend-link">
    <text x="${linkX}" y="${gisY}" font-size="15" fill="#1A6FA8" font-family="Arial,sans-serif" text-anchor="middle" text-decoration="underline">→ Duxbury GIS Map</text>
  </a>
  <a href="https://www.town.duxbury.ma.us/sites/g/files/vyhlif10506/f/pages/scan_of_2009_conservation_land_and_other_points_of_interest.pdf" target="_blank" class="legend-link">
    <text x="${linkX}" y="${concomY}" font-size="15" fill="#1A6FA8" font-family="Arial,sans-serif" text-anchor="middle" text-decoration="underline">→ Duxbury concom site</text>
  </a>`;

  const boxH=noteY+12;
  return `
  <rect x="${pad}" y="${pad}" width="${boxW}" height="${boxH}" rx="7" fill="white" fill-opacity="0.50" stroke="#bbb" stroke-width="1.2"/>
  <text x="${pad+pad}" y="${pad+pad+17}" font-size="17" font-weight="bold" fill="#111" font-family="Arial,sans-serif">Duxbury Bay — Public Access Points</text>
  <text x="${pad+pad}" y="${pad+pad+34}" font-size="12" fill="#555" font-family="Arial,sans-serif">Red: formally designated public landings  ·  Blue: public rights-of-way to the shoreline  |  Click a marker for details</text>
  <g transform="translate(${pad+pad},${pad})" font-family="Arial,sans-serif">${rows}</g>`;
}

// ─── INTERACTIVE MAP HTML ─────────────────────────────────────────────────────

function generateMapHTML() {
  let markerLinks = '';
  for (const site of ALL_SITES) {
    const { x, y } = project(site.lat, site.lng);
    const fsize = site.label.length <= 2 ? 11 : 9;
    const folder = `${site.id}-${site.slug}`;
    markerLinks += `
  <a href="${folder}/index.html" class="marker-link">
    <title>${site.id}. ${site.name}</title>
    <circle cx="${x}" cy="${y}" r="${DOT_R + 6}" fill="transparent"/>
    <circle cx="${x}" cy="${y}" r="${DOT_R}" fill="${site.color}" class="dot"/>
    <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
          font-size="${fsize}" font-weight="bold" fill="white"
          font-family="Arial,sans-serif" class="lbl">${site.label}</text>
  </a>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Duxbury Bay — Public Access Points</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1a2634; font-family: Arial, Helvetica, sans-serif; }
    header {
      background: #2c3e50; color: white;
      padding: 12px 24px; display: flex; align-items: center; gap: 16px;
    }
    header h1 { font-size: 20px; font-weight: bold; }
    header p  { font-size: 13px; color: #aac; }
    .map-container {
      position: relative; display: inline-block;
      margin: 16px auto; display: block; width: ${WIDTH}px;
    }
    #base-map { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
    #overlay  { position: absolute; top: 0; left: 0; pointer-events: none; }
    .marker-link { pointer-events: all; cursor: pointer; }
    .marker-link .dot { transition: filter 0.15s, r 0.15s; }
    .marker-link:hover .dot { filter: brightness(1.35); }
    .marker-link:hover .lbl { font-size: 13px; }
    .marker-link:focus { outline: none; }
    .marker-link:focus .dot { stroke: white; stroke-width: 2; }
    .legend-link { pointer-events: all; cursor: pointer; }
    .legend-link:hover text { filter: brightness(1.3); }
    footer {
      text-align: center; padding: 12px; color: #667;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Duxbury Bay — Public Water Access Points</h1>
      <p>Duxbury Bay Management Commission · Click any marker to view site details</p>
    </div>
  </header>

  <div class="map-container">
    <img id="base-map" src="all-sites-base.png" width="${WIDTH}" height="${HEIGHT}" alt="Duxbury Bay map">
    <svg id="overlay" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"
         xmlns="http://www.w3.org/2000/svg">
      ${legendSVG()}
      ${markerLinks}
    </svg>
  </div>

  <footer>Duxbury Bay Management Plan · Chapter 7 Public Access Points · Map tiles © OpenStreetMap contributors</footer>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'all-sites-map.html'), html, 'utf8');
  console.log('✓  all-sites-map.html');
}

// ─── SITE INDEX PAGE ──────────────────────────────────────────────────────────

function categoryLabel(site) {
  return site.category === 'town-landing' ? 'Town Landing' : 'Way to the Water';
}
function accentColor(site) {
  return site.category === 'town-landing' ? '#C0392B' : '#1A6FA8';
}

function generateSiteHTML(site, prev, next) {
  const folder   = path.join(__dirname, `${site.id}-${site.slug}`);
  const accent   = accentColor(site);
  const catLabel = categoryLabel(site);
  const approxNote = site.approx
    ? '<p style="color:#c0392b;font-size:13px">⚠️ Coordinates are approximate — verify against Chapter 7.</p>'
    : '';

  const prevLink = prev
    ? `<a href="../${prev.id}-${prev.slug}/index.html" class="sitenav-btn">&#8592; ${prev.id}. ${prev.name}</a>`
    : `<span class="sitenav-btn disabled">&#8592; First Site</span>`;
  const nextLink = next
    ? `<a href="../${next.id}-${next.slug}/index.html" class="sitenav-btn">&#8594; ${next.id}. ${next.name}</a>`
    : `<span class="sitenav-btn disabled">Last Site &#8594;</span>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.id}. ${site.name} — Duxbury Bay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f6f8; color: #222; }

    /* ── Header ── */
    header {
      background: ${accent}; color: white;
      padding: 16px 28px;
    }
    header .back {
      font-size: 13px; color: rgba(255,255,255,0.8);
      text-decoration: none; display: inline-block; margin-bottom: 6px;
    }
    header .back:hover { color: white; }
    header h1 { font-size: 24px; margin-bottom: 4px; }
    header .meta { font-size: 13px; opacity: 0.85; }

    /* ── Nav ── */
    nav {
      background: #2c3e50; padding: 0 16px;
      display: flex; flex-wrap: wrap; gap: 4px;
    }
    nav a {
      color: #cde; text-decoration: none;
      padding: 10px 16px; display: inline-block;
      font-size: 14px; border-bottom: 3px solid transparent;
      transition: border-color 0.15s, color 0.15s;
    }
    nav a:hover { color: white; border-bottom-color: ${accent}; }

    /* ── Content ── */
    main { max-width: 1140px; margin: 24px auto; padding: 0 20px 40px; }

    section {
      background: white; border-radius: 8px;
      padding: 24px 28px; margin-bottom: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    section h2 {
      font-size: 18px; color: ${accent};
      border-bottom: 2px solid ${accent};
      padding-bottom: 8px; margin-bottom: 16px;
    }
    section img {
      max-width: 100%; height: auto;
      border-radius: 6px; border: 1px solid #e0e0e0;
    }

    /* ── Info grid ── */
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px;
      font-size: 14px;
    }
    .info-grid dt { font-weight: bold; color: #555; }
    .info-grid dd { margin: 0; }

    /* ── Placeholder ── */
    .placeholder {
      border: 2px dashed #d0d5dd; border-radius: 6px;
      padding: 40px 24px; text-align: center; color: #999;
      background: #fafbfc;
    }
    .placeholder p { font-size: 15px; margin-bottom: 8px; }
    .placeholder small { font-size: 12px; }

    /* ── Maps side by side ── */
    .map-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .map-pair figure { margin: 0; }
    .map-pair figcaption { font-size: 13px; color: #666; margin-top: 6px; text-align: center; }

    /* ── Site navigation bar ── */
    .sitenav {
      background: #1a2634; padding: 14px 20px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }
    .sitenav-btn {
      color: white; text-decoration: none; font-size: 13px;
      background: rgba(255,255,255,0.12); border-radius: 5px;
      padding: 8px 14px; transition: background 0.15s;
      white-space: nowrap; max-width: 320px;
      overflow: hidden; text-overflow: ellipsis;
    }
    .sitenav-btn:hover { background: rgba(255,255,255,0.25); }
    .sitenav-btn.disabled { opacity: 0.35; cursor: default; }
    .sitenav-home {
      color: white; text-decoration: none; font-size: 13px; font-weight: bold;
      background: ${accent}; border-radius: 5px; padding: 8px 18px;
      transition: opacity 0.15s;
    }
    .sitenav-home:hover { opacity: 0.85; }

    /* ── Fixed home tab ── */
    .home-tab {
      position: fixed; left: 0; top: 50%;
      transform: translateY(-50%);
      background: rgba(44,62,80,0.60);
      color: white; text-decoration: none;
      writing-mode: vertical-lr;
      padding: 20px 12px; border-radius: 0 10px 10px 0;
      font-size: 14px; font-weight: bold; letter-spacing: 1px;
      z-index: 1000; transition: background 0.15s;
    }
    .home-tab:hover { background: rgba(44,62,80,0.90); }

    @media (max-width: 700px) {
      .map-pair { grid-template-columns: 1fr; }
      .info-grid { grid-template-columns: 1fr; }
      .sitenav { justify-content: center; }
    }
  </style>
</head>
<body>

<a href="../all-sites-map.html" class="home-tab">&#8962; All Sites Map</a>

<header>
  <a href="../all-sites-map.html" class="back">← Back to All Sites Map</a>
  <h1>${site.id}. ${site.name}</h1>
  <div class="meta">${catLabel} &nbsp;·&nbsp; ${site.address}</div>
</header>

<nav>
  <a href="#maps">Maps</a>
  <a href="#parking">Parking</a>
  <a href="#conditions">Existing Conditions</a>
  <a href="#mitigation">Mitigation Plans</a>
  <span style="flex:1"></span>
  ${prev ? `<a href="../${prev.id}-${prev.slug}/index.html">&#8592; ${prev.id}. ${prev.name}</a>` : ''}
  ${next ? `<a href="../${next.id}-${next.slug}/index.html">${next.id}. ${next.name} &#8594;</a>` : ''}
</nav>

<main>
  ${approxNote}

  <!-- ── Maps ── -->
  <section id="maps">
    <h2>Maps</h2>
    <div class="map-pair">
      <figure>
        <a href="overview.png" target="_blank">
          <img src="overview.png" alt="Overview map — ${site.name}">
        </a>
        <figcaption>Overview — full Duxbury Bay context (click to enlarge)</figcaption>
      </figure>
      <figure>
        <a href="detail.png" target="_blank">
          <img src="detail.png" alt="Detail map — ${site.name}">
        </a>
        <figcaption>Close-up — site location detail (click to enlarge)</figcaption>
      </figure>
    </div>
  </section>

  <!-- ── Parking ── -->
  <section id="parking">
    <h2>Parking &amp; Access</h2>
    <dl class="info-grid">
      <dt>Capacity</dt>
      <dd>${site.parking || 'Unknown'}</dd>
      <dt>Address</dt>
      <dd>${site.address}</dd>
      <dt>Coordinates</dt>
      <dd>${site.lat}, ${site.lng}${site.approx ? ' (approx.)' : ''}
        &nbsp;<a href="https://www.google.com/maps?q=${site.lat},${site.lng}&ll=${site.lat},${site.lng}&z=18"
           target="_blank" rel="noopener" style="font-size:12px;color:#1a6fa8;">Verify on Google Maps ↗</a>
      </dd>
      <dt>Category</dt>
      <dd>${catLabel}</dd>
    </dl>
    ${site.notes ? `<p style="margin-top:14px;font-size:14px;color:#444;">${site.notes}</p>` : ''}
  </section>

  <!-- ── Existing Conditions ── -->
  <section id="conditions">
    <h2>Existing Conditions</h2>
    <div class="placeholder">
      <p>No conditions data recorded yet.</p>
      <small>Add field notes, photos, and observations here.</small>
    </div>
  </section>

  <!-- ── Mitigation Plans ── -->
  <section id="mitigation">
    <h2>Mitigation Plans</h2>
    <div class="placeholder">
      <p>No mitigation plan recorded yet.</p>
      <small>Add proposed improvements, timeline, and responsible parties here.</small>
    </div>
  </section>

</main>

<!-- ── Bottom site navigation ── -->
<div class="sitenav">
  ${prevLink}
  <a href="../all-sites-map.html" class="sitenav-home">&#8962; All Sites Map</a>
  ${nextLink}
</div>

</body>
</html>`;

  fs.writeFileSync(path.join(folder, 'index.html'), html, 'utf8');
  console.log(`✓  ${site.id}-${site.slug}/index.html`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Generating interactive map HTML…');
  generateMapHTML();

  console.log('\nGenerating site pages…');
  for (let i = 0; i < ALL_SITES.length; i++) {
    const prev = i > 0                    ? ALL_SITES[i - 1] : null;
    const next = i < ALL_SITES.length - 1 ? ALL_SITES[i + 1] : null;
    generateSiteHTML(ALL_SITES[i], prev, next);
  }

  console.log('\nDone.');
  console.log('Open all-sites-map.html in a browser to use the interactive map.');
}

main();
