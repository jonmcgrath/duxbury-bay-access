/**
 * Duxbury Bay Public Access — All Sites Overview Map
 * - Town Landings  → Red  (#C0392B), numbered 1–22
 * - Ways to Water  → Blue (#1A6FA8), numbered W1–W5
 * - Numbers inside markers, no border ring
 * - Crop: east edge just east of Clark's Island; zoom 14
 */

const StaticMaps = require('staticmaps');
const sharp = require('sharp');
const fs = require('fs');

// ─── SITE DATA ────────────────────────────────────────────────────────────────

const TOWN_LANDINGS = [
  { id: '01', label: '1',  name: 'Ford Stand Landing',             lat: 42.0631, lng: -70.6484 },
  { id: '02', label: '2',  name: 'Old Cove Landing',               lat: 42.0512, lng: -70.6717 },
  { id: '03', label: '3',  name: 'Drew Salt Works Landing',        lat: 42.0512, lng: -70.6689 },
  { id: '04', label: '4',  name: 'Shipyard Lane (Ellison Beach)',  lat: 42.0274, lng: -70.6714 },
  { id: '05', label: '5',  name: 'Powder Point Landing',           lat: 42.0483, lng: -70.6479 },
  { id: '06', label: '6',  name: 'Powder Point Bridge (W. End)',   lat: 42.0483, lng: -70.6490 }, // offset slightly
  { id: '07', label: '7',  name: 'Anchorage Lane Landing',         lat: 42.0466, lng: -70.6749 },
  { id: '08', label: '8',  name: 'Bluefish River Landing',         lat: 42.0448, lng: -70.6744 },
  { id: '09', label: '9',  name: 'Sagamore Road Landing',          lat: 42.0094, lng: -70.6705 },
  { id: '10', label: '10', name: 'Mattakeeset Town Pier',          lat: 42.0393, lng: -70.6703 },
  { id: '11', label: '11', name: 'Winsor Street Landing',          lat: 42.0349, lng: -70.6712 },
  { id: '12', label: '12', name: 'Jocelyn Lane Landing',           lat: 42.0200, lng: -70.6770, approx: true },
  { id: '13', label: '13', name: 'Massasoit Road Landing',         lat: 42.0089, lng: -70.6720 },
  { id: '14', label: '14', name: 'Water Street Landing',           lat: 42.0329, lng: -70.6717 },
  { id: '15', label: '15', name: 'Harden Hill Road Landing',       lat: 42.0235, lng: -70.6787 },
  { id: '16', label: '16', name: 'Elderberry Lane',                lat: 42.0190, lng: -70.6843 },
  { id: '17', label: '17', name: 'Bay Farm',                       lat: 42.0030, lng: -70.7130 },
  { id: '18', label: '18', name: 'Hicks Point Road Landing',       lat: 42.0089, lng: -70.7101 },
  { id: '19', label: '19', name: 'Miles Standish Home Site',       lat: 42.0139, lng: -70.6822 },
  { id: '20', label: '20', name: "Howland's Landing",              lat: 42.0102, lng: -70.6848 },
  { id: '21', label: '21', name: 'Landing Road Beach',             lat: 42.0133, lng: -70.7010 },
  { id: '22', label: '22', name: 'Island Creek Pond',              lat: 42.0281, lng: -70.7112 },
];

const WAYS_TO_WATER = [
  { id: 'WW-01', label: 'W1', name: "Simeon Soule's Landing", lat: 42.0350, lng: -70.6590, approx: true },
  { id: 'WW-02', label: 'W2', name: 'Elder Brewster Road',    lat: 42.0108, lng: -70.6703 },
  { id: 'WW-03', label: 'W3', name: 'Somerset Road',          lat: 42.0490, lng: -70.6770, approx: true },
  { id: 'WW-04', label: 'W4', name: "Peterson's Landing",     lat: 42.0487, lng: -70.6785 },
  { id: 'WW-05', label: 'W5', name: 'Longview Road',          lat: 42.0155, lng: -70.6860, approx: true },
];

// ─── MAP SETTINGS ─────────────────────────────────────────────────────────────
// Zoom 14, cropped east just past Clark's Island (~-70.636)
// Site lat range: 42.003 (Bay Farm) to 42.063 (Ford Stand)
// Center chosen so sites fill ~90% of height with balanced margins

const ZOOM   = 14;
const WIDTH  = 1200;
const HEIGHT = 1050;   // sites span 942px at zoom 14 → 942/0.90 = 1047 ≈ 1050

// East edge ≈ -70.636 (just east of Clark's Island, south of Saquish Neck)
// At zoom 14: 1px ≈ 0.0000858°, so CENTER_LNG = -70.636 - 600*0.0000858 = -70.687
// CENTER_LAT = 42.033 balances 5% margin at top (Ford Stand) and bottom (Bay Farm)
const CENTER_LAT = 42.033;
const CENTER_LNG = -70.687;

// Colors
const COLOR_LANDING = '#C0392B';
const COLOR_WAY     = '#1A6FA8';

// Marker size (radius in pixels of the drawn SVG dot)
const DOT_R = 14;

// ─── MERCATOR PROJECTION ──────────────────────────────────────────────────────

function project(lat, lng) {
  const TILE  = 256;
  const scale = Math.pow(2, ZOOM) * TILE;

  const worldX = (lng + 180) / 360 * scale;
  const sinLat = Math.sin(lat * Math.PI / 180);
  const worldY = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;

  const cX = (CENTER_LNG + 180) / 360 * scale;
  const cS = Math.sin(CENTER_LAT * Math.PI / 180);
  const cY = (0.5 - Math.log((1 + cS) / (1 - cS)) / (4 * Math.PI)) * scale;

  return {
    x: Math.round(worldX - cX + WIDTH  / 2),
    y: Math.round(worldY - cY + HEIGHT / 2),
  };
}

// ─── SVG OVERLAY ─────────────────────────────────────────────────────────────

function buildOverlaySVG() {
  // ── Markers ────────────────────────────────────────────────────────────────
  let markersSVG = '';

  function marker(lat, lng, color, label) {
    const { x, y } = project(lat, lng);
    const fsize = label.length <= 2 ? 11 : 9;
    return `
    <circle cx="${x}" cy="${y}" r="${DOT_R}" fill="${color}"/>
    <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
          font-size="${fsize}" font-weight="bold" fill="white"
          font-family="Arial, Helvetica, sans-serif">${label}</text>`;
  }

  for (const s of TOWN_LANDINGS) markersSVG += marker(s.lat, s.lng, COLOR_LANDING, s.label);
  for (const s of WAYS_TO_WATER)  markersSVG += marker(s.lat, s.lng, COLOR_WAY,     s.label);

  // ── Legend ────────────────────────────────────────────────────────────────
  const pad    = 14;
  const lineH  = 22;
  const ldotR  = 9;
  const fsize  = 13;
  const hsize  = 13;
  const col2X  = 340;

  const col1 = TOWN_LANDINGS.slice(0, 11);
  const col2 = TOWN_LANDINGS.slice(11);

  const rowItem = (x, y, color, label, text, approx) => `
    <circle cx="${x + ldotR}" cy="${y + ldotR - 1}" r="${ldotR}" fill="${color}"/>
    <text x="${x + ldotR}" y="${y + ldotR - 1}" text-anchor="middle" dominant-baseline="central"
          font-size="8" font-weight="bold" fill="white" font-family="Arial, Helvetica, sans-serif">${label}</text>
    <text x="${x + ldotR * 2 + 5}" y="${y + ldotR + 4}" font-size="${fsize}" fill="#111"
          font-family="Arial, Helvetica, sans-serif">${text}${approx ? ' *' : ''}</text>`;

  let rows = '';

  // Town Landings header
  let hY = pad + 17 + 17 + 12;
  rows += `<text x="${pad}" y="${hY}" font-size="${hsize}" font-weight="bold" fill="${COLOR_LANDING}"
                 font-family="Arial, Helvetica, sans-serif" letter-spacing="0.5">TOWN LANDINGS</text>`;
  let rY = hY + lineH * 0.85;

  let yC1 = rY;
  for (const s of col1) { rows += rowItem(pad, yC1, COLOR_LANDING, s.label, `${s.id}. ${s.name}`, s.approx); yC1 += lineH; }

  let yC2 = rY;
  for (const s of col2) { rows += rowItem(col2X, yC2, COLOR_LANDING, s.label, `${s.id}. ${s.name}`, s.approx); yC2 += lineH; }

  // Ways to Water header
  const wwHY = Math.max(yC1, yC2) + lineH * 0.4;
  rows += `<text x="${pad}" y="${wwHY}" font-size="${hsize}" font-weight="bold" fill="${COLOR_WAY}"
                 font-family="Arial, Helvetica, sans-serif" letter-spacing="0.5">WAYS TO THE WATER</text>`;
  let wY = wwHY + lineH * 0.85;
  for (const s of WAYS_TO_WATER) { rows += rowItem(pad, wY, COLOR_WAY, s.label, `${s.id}. ${s.name}`, s.approx); wY += lineH; }

  const noteY = wY + lineH * 0.4;
  rows += `<text x="${pad}" y="${noteY}" font-size="11" fill="#888"
                 font-family="Arial, Helvetica, sans-serif">* Location approximate — verify against Chapter 7</text>`;

  const boxW = col2X + 320;
  const boxH = noteY + 12;

  const legendSVG = `
  <rect x="${pad}" y="${pad}" width="${boxW}" height="${boxH}"
        rx="7" fill="white" fill-opacity="0.20" stroke="#bbb" stroke-width="1.2"/>
  <text x="${pad + pad}" y="${pad + pad + 17}"
        font-size="17" font-weight="bold" fill="#111"
        font-family="Arial, Helvetica, sans-serif">Duxbury Bay — Public Access Points</text>
  <text x="${pad + pad}" y="${pad + pad + 17 + 17}"
        font-size="12" fill="#555" font-family="Arial, Helvetica, sans-serif"
        >${TOWN_LANDINGS.length} Town Landings  ·  ${WAYS_TO_WATER.length} Ways to the Water</text>
  <g transform="translate(${pad + pad}, ${pad})" font-family="Arial, Helvetica, sans-serif">
    ${rows}
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  ${markersSVG}
  ${legendSVG}
</svg>`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Rendering base map at zoom ${ZOOM}, ${WIDTH}×${HEIGHT}…`);
  const map = new StaticMaps({ width: WIDTH, height: HEIGHT });
  await map.render([CENTER_LNG, CENTER_LAT], ZOOM);
  await map.image.save('all-sites-base.png');

  console.log('Compositing markers + legend…');
  const svg = buildOverlaySVG();
  await sharp('all-sites-base.png')
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .toFile('all-sites-map.png');

  // Keep all-sites-base.png — needed by all-sites-map.html
  console.log('Done → all-sites-map.png + all-sites-base.png');
}

main().catch(console.error);
