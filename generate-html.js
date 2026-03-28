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

// ─── SITE DATA (mirrors generate-all-sites-map.js) ────────────────────────────

const TOWN_LANDINGS = [
  { id:'01', label:'1',  slug:'ford-stand-landing',             name:'Ford Stand Landing',            lat:42.0631, lng:-70.6484, address:'Ocean Road North, Duxbury MA',            parking:'Unknown', notes:'Northern-most landing; Highway Extension access' },
  { id:'02', label:'2',  slug:'old-cove-landing',               name:'Old Cove Landing',              lat:42.0512, lng:-70.6717, address:'75 Cove Street, Duxbury MA',              parking:'Very limited (lower tides only)', notes:'Access to Duck Hill River and Duxbury Back River; no boat ramp; no ADA' },
  { id:'03', label:'3',  slug:'drew-salt-works-landing',        name:'Drew Salt Works Landing',       lat:42.0512, lng:-70.6689, address:'Bay Pond Road, Duxbury MA',               parking:'Unknown', notes:'Historical salt works site; Bay Road North area' },
  { id:'04', label:'4',  slug:'shipyard-lane-ellison-beach',    name:'Shipyard Lane (Ellison Beach)', lat:42.0274, lng:-70.6714, address:'99 Shipyard Lane, Duxbury MA',            parking:'27 cars · 0 trailers · 2 handicapped', notes:'1.2-acre sandy beach (Eben Ellison). Seasonal lifeguards, floating dock, calm water protected by breakwater. Sticker required Memorial Day–Labor Day.' },
  { id:'05', label:'5',  slug:'powder-point-landing',           name:'Powder Point Landing',          lat:42.0483, lng:-70.6479, address:'Powder Point Ave, Duxbury MA',            parking:'Limited', notes:'Near Powder Point Bridge; paddle/small boat access to bay' },
  { id:'06', label:'6',  slug:'powder-point-bridge-west-end',   name:'Powder Point Bridge (W. End)',  lat:42.0483, lng:-70.6490, address:'370 Powder Point Ave, Duxbury MA',        parking:'50 spaces · 0 trailers · 2 handicapped', notes:'Major access hub. Kayak/paddleboard/rowing shell launch. ADA accessible. Seasonal porta-potties. ⚠️ CLOSED Dec 2025–April 2026 for bridge repairs.' },
  { id:'07', label:'7',  slug:'anchorage-lane-landing',         name:'Anchorage Lane Landing',        lat:42.0466, lng:-70.6749, address:'10 Anchorage Lane, Duxbury MA',           parking:'Limited — viewing and fishing', notes:'Cushman Preserve (27.4 acres) borders Bluefish River. Easy flat trails. Wildlands Trust property.' },
  { id:'08', label:'8',  slug:'bluefish-river-landing',         name:'Bluefish River Landing',        lat:42.0448, lng:-70.6744, address:'Bluefish River area, Duxbury MA',         parking:'Minimal', notes:'Old Mill Dam / Salt Mill area; tidal river access' },
  { id:'09', label:'9',  slug:'sagamore-road-landing',          name:'Sagamore Road Landing',         lat:42.0094, lng:-70.6705, address:'Sagamore Road, Duxbury MA',               parking:'0 spaces (minimal)', notes:'Minimal parking; informal shoreline access' },
  { id:'10', label:'10', slug:'mattakeeset-town-pier',          name:'Mattakeeset Town Pier',         lat:42.0393, lng:-70.6703, address:'35 Mattakeeset Court, Duxbury MA',        parking:'60 cars · 12 trailers · 4 handicapped', notes:'Primary hub. Public boat launch ramp. ADA accessible. Seasonal restrooms, benches, trash. Snug Harbor between Duxbury Yacht Club and DBMS. Dawn to dusk. Harbormaster: (781) 934-2866.' },
  { id:'11', label:'11', slug:'winsor-street-landing',          name:'Winsor Street Landing',         lat:42.0349, lng:-70.6712, address:'Winsor Street, South Duxbury MA',          parking:'Unknown', notes:'Seasonal recreational access; Old Shipbuilders Historic District' },
  { id:'12', label:'12', slug:'jocelyn-lane-landing',           name:'Jocelyn Lane Landing',          lat:42.0200, lng:-70.6770, address:'Jocelyn Lane, Duxbury MA',                parking:'Unknown', notes:'Location approximate — not confirmed in mapping database', approx:true },
  { id:'13', label:'13', slug:'massasoit-road-landing',         name:'Massasoit Road Landing',        lat:42.0089, lng:-70.6720, address:'Massasoit Road, Duxbury MA',              parking:'Unknown', notes:'Pine Grove; shoreline access' },
  { id:'14', label:'14', slug:'water-street-landing',           name:'Water Street Landing',          lat:42.0329, lng:-70.6717, address:'Water Street, South Duxbury MA',          parking:'Unknown', notes:'Deep water anchorage; seasonal recreational access; Old Shipbuilders Historic District' },
  { id:'15', label:'15', slug:'harden-hill-road-landing',       name:'Harden Hill Road Landing',      lat:42.0235, lng:-70.6787, address:'Harden Hill Road, South Duxbury MA',     parking:'Time-restricted parking only', notes:'Time-restricted parking' },
  { id:'16', label:'16', slug:'elderberry-lane',                name:'Elderberry Lane',               lat:42.0190, lng:-70.6843, address:'Elderberry Lane, South Duxbury MA',      parking:'Unknown', notes:'0.7–1 acre parcel; southern shoreline access' },
  { id:'17', label:'17', slug:'bay-farm',                       name:'Bay Farm',                      lat:42.0030, lng:-70.7130, address:'31 Loring Street, Duxbury/Kingston MA',   parking:'~25 spaces', notes:'80-acre conservation area on the Duxbury/Kingston town line. Sandy beach, tide pools, salt marshes, woodlands. Southern terminus of Bay Circuit Trail. Jointly owned by Duxbury, Kingston, and MA DEP.' },
  { id:'18', label:'18', slug:'hicks-point-road-landing',       name:'Hicks Point Road Landing',      lat:42.0089, lng:-70.7101, address:'Hicks Point Road, Duxbury MA',           parking:'Unknown', notes:'Southern-designated landing; Miles Standish Park area' },
  { id:'19', label:'19', slug:'miles-standish-home-site',       name:'Miles Standish Home Site',      lat:42.0139, lng:-70.6822, address:'Myles Standish Monument area, Duxbury MA', parking:'Unknown', notes:'Historic site; Myles Standish Monument on Shantum Lane' },
  { id:'20', label:'20', slug:'howlands-landing',               name:"Howland's Landing",             lat:42.0102, lng:-70.6848, address:'23 Howland Landing, Duxbury MA',         parking:'18 cars · 3 trailers · 0 handicapped (free)', notes:'Deep water. 5-acre park on Kingston Bay. Historic shipbuilding heritage. Amphitheater, picnic tables, interpretive signage. Dawn to dusk.' },
  { id:'21', label:'21', slug:'landing-road-beach',             name:'Landing Road Beach',            lat:42.0133, lng:-70.7010, address:'44 Landing Road, Duxbury MA',             parking:'None', notes:'Kingston Bay; no parking on-site. Benches, informational signage. Historic property granted to Thomas Prence in 1627.' },
  { id:'22', label:'22', slug:'island-creek-pond',              name:'Island Creek Pond',             lat:42.0281, lng:-70.7112, address:'287 Tobey Garden Street, Duxbury MA',    parking:'Large lot — free', notes:'Freshwater Great Pond (43-acre Crocker Memorial Park). Canoe/kayak launch from shore. Herring migration history and Native American heritage. Dawn to dusk.' },
];

const WAYS_TO_WATER = [
  { id:'WW-01', label:'W1', slug:'simeon-soules-landing',   name:"Simeon Soule's Landing", lat:42.0350, lng:-70.6590, address:'Duxbury MA (near Powder Point)',   parking:'12 spaces · Town-Restricted', notes:'Town-restricted parking; location approximate', approx:true },
  { id:'WW-02', label:'W2', slug:'elder-brewster-road',     name:'Elder Brewster Road',    lat:42.0108, lng:-70.6703, address:'Elder Brewster Road, South Duxbury', parking:'12 spaces · Town-Restricted', notes:'Town-restricted parking; 12 spaces' },
  { id:'WW-03', label:'W3', slug:'somerset-road',           name:'Somerset Road',          lat:42.0490, lng:-70.6770, address:'Somerset Road, Duxbury MA',          parking:'Unknown', notes:'Boatslip access; location approximate', approx:true },
  { id:'WW-04', label:'W4', slug:'petersons-landing',       name:"Peterson's Landing",     lat:42.0487, lng:-70.6785, address:'78 George Street, Duxbury MA',       parking:'Unknown', notes:'Public waterway; 78 George Street (Saint George Street)' },
  { id:'WW-05', label:'W5', slug:'longview-road',           name:'Longview Road',          lat:42.0155, lng:-70.6860, address:'Longview Road, Duxbury MA',          parking:'Unknown', notes:'Location approximate', approx:true },
];

const ALL_SITES = [
  ...TOWN_LANDINGS.map(s => ({ ...s, category:'town-landing', color:'#C0392B' })),
  ...WAYS_TO_WATER.map(s => ({ ...s, category:'way-to-water', color:'#1A6FA8' })),
];

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

  const rowItem = (x, y, color, label, text, approx) => `
    <circle cx="${x+ldotR}" cy="${y+ldotR-1}" r="${ldotR}" fill="${color}"/>
    <text x="${x+ldotR}" y="${y+ldotR-1}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="bold" fill="white" font-family="Arial,sans-serif">${label}</text>
    <text x="${x+ldotR*2+5}" y="${y+ldotR+4}" font-size="${fsize}" fill="#111" font-family="Arial,sans-serif">${text}${approx?' *':''}</text>`;

  let rows = '';
  let hY = pad+17+17+12;
  rows += `<text x="${pad}" y="${hY}" font-size="${hsize}" font-weight="bold" fill="#C0392B" font-family="Arial,sans-serif" letter-spacing="0.5">TOWN LANDINGS</text>`;
  let rY = hY+lineH*0.85;
  let yC1=rY; for(const s of col1){ rows+=rowItem(pad,yC1,'#C0392B',s.label,`${s.id}. ${s.name}`,s.approx); yC1+=lineH; }
  let yC2=rY; for(const s of col2){ rows+=rowItem(col2X,yC2,'#C0392B',s.label,`${s.id}. ${s.name}`,s.approx); yC2+=lineH; }

  const wwHY = Math.max(yC1,yC2)+lineH*0.4;
  rows += `<text x="${pad}" y="${wwHY}" font-size="${hsize}" font-weight="bold" fill="#1A6FA8" font-family="Arial,sans-serif" letter-spacing="0.5">WAYS TO THE WATER</text>`;
  let wY=wwHY+lineH*0.85;
  for(const s of WAYS_TO_WATER){ rows+=rowItem(pad,wY,'#1A6FA8',s.label,`${s.id}. ${s.name}`,s.approx); wY+=lineH; }

  const noteY=wY+lineH*0.4;
  rows += `<text x="${pad}" y="${noteY}" font-size="11" fill="#888" font-family="Arial,sans-serif">* Location approximate — verify against Chapter 7</text>`;

  const boxW=col2X+320, boxH=noteY+12;
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
      <dd>${site.lat}, ${site.lng}${site.approx ? ' (approx.)' : ''}</dd>
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
