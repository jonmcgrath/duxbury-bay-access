/**
 * Duxbury Bay Public Access - Map Generator
 * Generates overview + detail PNG maps for each site using OpenStreetMap tiles
 *
 * Overview map: Full bay area at zoom 13, site marked in red
 * Detail map:   Site zoomed in at zoom 17, red circle marker
 */

const StaticMaps = require('staticmaps');
const fs = require('fs');
const path = require('path');

// ─── SITE DATA ────────────────────────────────────────────────────────────────
// lat/lng | approx:true = best estimate, not GPS-confirmed
// Overview map center: entire Duxbury Bay area
// Center chosen to include all 27 sites (lat 42.005–42.063, lng -70.718 to -70.648)
const BAY_CENTER = { lat: 42.035, lng: -70.683 };
const BAY_ZOOM = 13;    // zoom 13 captures full study area including northern landings
const DETAIL_ZOOM = 17; // ~750m width — shows a few street names

const SITES = [
  // ── TOWN LANDINGS ───────────────────────────────────────────────────────────
  {
    id: '01',
    category: 'town-landing',
    name: 'Ford Stand Landing',
    slug: 'ford-stand-landing',
    address: 'Ocean Road North, Duxbury MA',
    lat: 42.0631,
    lng: -70.6484,
    parking: 'Unknown',
    notes: 'Northern-most landing; Highway Extension access',
    approx: false,
  },
  {
    id: '02',
    category: 'town-landing',
    name: 'Old Cove Landing',
    slug: 'old-cove-landing',
    address: '75 Cove Street, Duxbury MA',
    lat: 42.0512,
    lng: -70.6717,
    parking: 'Very limited (lower tides only)',
    notes: 'Access to Duck Hill River and Duxbury Back River; no boat ramp; no ADA',
    approx: false,
  },
  {
    id: '03',
    category: 'town-landing',
    name: 'Drew Salt Works Landing',
    slug: 'drew-salt-works-landing',
    address: 'Bay Pond Road, Duxbury MA',
    lat: 42.0512,
    lng: -70.6689,
    parking: 'Unknown',
    notes: 'Historical salt works site; Bay Road North area',
    approx: false,
  },
  {
    id: '04',
    category: 'town-landing',
    name: 'Shipyard Lane (Ellison Beach)',
    slug: 'shipyard-lane-ellison-beach',
    address: '99 Shipyard Lane, Duxbury MA',
    lat: 42.0274,
    lng: -70.6714,
    parking: '27 cars, 0 trailers, 2 handicapped; sticker required Memorial Day–Labor Day',
    notes: '1.2-acre sandy beach named after Eben Ellison; seasonal lifeguards; floating dock; calm water protected by breakwater',
    approx: false,
  },
  {
    id: '05',
    category: 'town-landing',
    name: 'Powder Point Landing',
    slug: 'powder-point-landing',
    address: 'Powder Point Ave, Duxbury MA',
    lat: 42.0483,
    lng: -70.6479,
    parking: 'Limited',
    notes: 'Near Powder Point Bridge; paddle/small boat access to bay',
    approx: false,
  },
  {
    id: '06',
    category: 'town-landing',
    name: 'Powder Point Bridge (West End)',
    slug: 'powder-point-bridge-west-end',
    address: '370 Powder Point Ave, Duxbury MA',
    lat: 42.0483,
    lng: -70.6479,
    parking: '50 spaces, 0 trailers, 2 handicapped',
    notes: 'Major access hub; kayak/paddleboard/rowing shell launch; CLOSED Dec 2025–April 2026 for repairs; ADA accessible; seasonal porta-potties',
    approx: false,
  },
  {
    id: '07',
    category: 'town-landing',
    name: 'Anchorage Lane Landing',
    slug: 'anchorage-lane-landing',
    address: '10 Anchorage Lane, Duxbury MA',
    lat: 42.0466,
    lng: -70.6749,
    parking: 'Limited; Viewing and Fishing',
    notes: '170 George St area; 27.4-acre Cushman Preserve borders Bluefish River; easy flat trails; Wildlands Trust',
    approx: false,
  },
  {
    id: '08',
    category: 'town-landing',
    name: 'Bluefish River Landing',
    slug: 'bluefish-river-landing',
    address: 'Bluefish River area, Duxbury MA',
    lat: 42.0448,
    lng: -70.6744,
    parking: 'Minimal',
    notes: 'Old Mill Dam / Salt Mill area; tidal river access',
    approx: false,
  },
  {
    id: '09',
    category: 'town-landing',
    name: 'Sagamore Road Landing',
    slug: 'sagamore-road-landing',
    address: 'Sagamore Road, Duxbury MA',
    lat: 42.0094,
    lng: -70.6705,
    parking: '0 spaces (minimal)',
    notes: 'Minimal parking; informal access',
    approx: false,
  },
  {
    id: '10',
    category: 'town-landing',
    name: 'Mattakeeset Town Pier',
    slug: 'mattakeeset-town-pier',
    address: '35 Mattakeeset Court, Duxbury MA',
    lat: 42.0393,
    lng: -70.6703,
    parking: '60 cars, 12 trailers, 4 handicapped (Primary Hub)',
    notes: 'Primary hub; public boat launch ramp; ADA accessible; seasonal restrooms/benches/trash; Snug Harbor between Duxbury Yacht Club and DBMS; Dawn to dusk; Harbormaster: (781) 934-2866',
    approx: false,
  },
  {
    id: '11',
    category: 'town-landing',
    name: 'Winsor Street Landing',
    slug: 'winsor-street-landing',
    address: 'Winsor Street, South Duxbury MA',
    lat: 42.0349,
    lng: -70.6712,
    parking: 'Unknown',
    notes: 'Seasonal recreational access; Old Shipbuilders Historic District',
    approx: false,
  },
  {
    id: '12',
    category: 'town-landing',
    name: 'Jocelyn Lane Landing',
    slug: 'jocelyn-lane-landing',
    address: 'Jocelyn Lane, Duxbury MA',
    lat: 42.0200,
    lng: -70.6770,
    parking: 'Unknown',
    notes: 'Location approximate — not found in OSM geocoder',
    approx: true,
  },
  {
    id: '13',
    category: 'town-landing',
    name: 'Massasoit Road Landing',
    slug: 'massasoit-road-landing',
    address: 'Massasoit Road, Duxbury MA',
    lat: 42.0089,
    lng: -70.6720,
    parking: 'Unknown',
    notes: 'Pine Grove; Shoreline Access',
    approx: false,
  },
  {
    id: '14',
    category: 'town-landing',
    name: 'Water Street Landing',
    slug: 'water-street-landing',
    address: 'Water Street, South Duxbury MA',
    lat: 42.0329,
    lng: -70.6717,
    parking: 'Unknown',
    notes: 'Deep Water Anchorage; seasonal recreational access; Old Shipbuilders Historic District',
    approx: false,
  },
  {
    id: '15',
    category: 'town-landing',
    name: 'Harden Hill Road Landing',
    slug: 'harden-hill-road-landing',
    address: 'Harden Hill Road, South Duxbury MA',
    lat: 42.0235,
    lng: -70.6787,
    parking: 'Time-restricted parking',
    notes: 'Time-restricted parking only',
    approx: false,
  },
  {
    id: '16',
    category: 'town-landing',
    name: 'Elderberry Lane',
    slug: 'elderberry-lane',
    address: 'Elderberry Lane, South Duxbury MA',
    lat: 42.0190,
    lng: -70.6843,
    parking: 'Unknown',
    notes: '0.7–1 acre parcel; Southern Shoreline access',
    approx: false,
  },
  {
    id: '17',
    category: 'town-landing',
    name: 'Bay Farm',
    slug: 'bay-farm',
    address: '31 Loring Street, Duxbury/Kingston MA',
    lat: 42.0030,
    lng: -70.7130,
    parking: '25 spaces; Viewing and Recreational Access',
    notes: '80-acre conservation area; Duxbury/Kingston town line; sandy beach, tide pools, salt marshes, woodlands; Southern terminus of Bay Circuit Trail; jointly owned by Duxbury, Kingston, DEP',
    approx: true,
  },
  {
    id: '18',
    category: 'town-landing',
    name: 'Hicks Point Road Landing',
    slug: 'hicks-point-road-landing',
    address: 'Hicks Point Road, Duxbury MA',
    lat: 42.0089,
    lng: -70.7101,
    parking: 'Unknown',
    notes: 'Southern-designated landing; Miles Standish Park area',
    approx: false,
  },
  {
    id: '19',
    category: 'town-landing',
    name: 'Miles Standish Home Site',
    slug: 'miles-standish-home-site',
    address: 'Myles Standish Monument area, Duxbury MA',
    lat: 42.0139,
    lng: -70.6822,
    parking: 'Unknown',
    notes: 'Historic site; Myles Standish Monument nearby on Shantum Lane',
    approx: false,
  },
  {
    id: '20',
    category: 'town-landing',
    name: "Howland's Landing",
    slug: 'howlands-landing',
    address: '23 Howland Landing, Duxbury MA',
    lat: 42.0102,
    lng: -70.6848,
    parking: '18 cars, 3 trailers, 0 handicapped; free',
    notes: 'Deep Water; 5-acre park on Kingston Bay; historic shipbuilding heritage; amphitheater; picnic tables; interpretive signage; Dawn to dusk',
    approx: false,
  },
  {
    id: '21',
    category: 'town-landing',
    name: 'Landing Road Beach',
    slug: 'landing-road-beach',
    address: '44 Landing Road, Duxbury MA',
    lat: 42.0133,
    lng: -70.7010,
    parking: 'None',
    notes: 'Kingston Bay; no parking; benches; informational signage; historic property (Thomas Prence 1627)',
    approx: false,
  },
  {
    id: '22',
    category: 'town-landing',
    name: 'Island Creek Pond',
    slug: 'island-creek-pond',
    address: '287 Tobey Garden Street, Duxbury MA',
    lat: 42.0281,
    lng: -70.7112,
    parking: 'Large lot; free',
    notes: 'Freshwater Great Pond; canoe/kayak launch; 43-acre Crocker Memorial Park; herring migration history; Native American heritage; Dawn to dusk',
    approx: false,
  },

  // ── WAYS TO THE WATER ───────────────────────────────────────────────────────
  {
    id: 'WW-01',
    category: 'way-to-water',
    name: "Simeon Soule's Landing",
    slug: 'simeon-soules-landing',
    address: 'Duxbury MA (near Powder Point area)',
    lat: 42.0350,
    lng: -70.6590,
    parking: '12 spaces; Town-Restricted',
    notes: 'Town-Restricted Parking; location approximate',
    approx: true,
  },
  {
    id: 'WW-02',
    category: 'way-to-water',
    name: 'Elder Brewster Road',
    slug: 'elder-brewster-road',
    address: 'Elder Brewster Road, South Duxbury MA',
    lat: 42.0108,
    lng: -70.6703,
    parking: '12 spaces; Town-Restricted',
    notes: 'Town-Restricted Parking; 12 spaces',
    approx: false,
  },
  {
    id: 'WW-03',
    category: 'way-to-water',
    name: 'Somerset Road',
    slug: 'somerset-road',
    address: 'Somerset Road, Duxbury MA',
    lat: 42.0490,
    lng: -70.6770,
    parking: 'Unknown',
    notes: 'Boatslip access; location approximate',
    approx: true,
  },
  {
    id: 'WW-04',
    category: 'way-to-water',
    name: "Peterson's Landing",
    slug: 'petersons-landing',
    address: '78 George Street, Duxbury MA',
    lat: 42.0487,
    lng: -70.6785,
    parking: 'Unknown',
    notes: 'Public waterway; 78 George St (Saint George Street)',
    approx: false,
  },
  {
    id: 'WW-05',
    category: 'way-to-water',
    name: 'Longview Road',
    slug: 'longview-road',
    address: 'Longview Road, Duxbury MA',
    lat: 42.0155,
    lng: -70.6860,
    parking: 'Unknown',
    notes: 'Location approximate',
    approx: true,
  },
];

// ─── MAP GENERATION ───────────────────────────────────────────────────────────

async function renderMap(options) {
  const { center, zoom, width, height, marker, outputPath } = options;
  const map = new StaticMaps({ width, height });

  // White outline ring for visibility against any background
  map.addCircle({
    coord: [marker.lng, marker.lat],
    radius: marker.radius + 30,
    fill: false,
    color: '#FFFFFF',
    width: 4,
  });
  // Red filled marker
  map.addCircle({
    coord: [marker.lng, marker.lat],
    radius: marker.radius,
    fill: true,
    color: '#CC0000DD',
    width: 3,
  });

  await map.render([center.lng, center.lat], zoom);
  await map.image.save(outputPath);
}

async function createSiteFolder(site) {
  const folderName = `${site.id}-${site.slug}`;
  const folderPath = path.join(__dirname, folderName);
  fs.mkdirSync(folderPath, { recursive: true });

  // Write site info markdown
  const infoContent = `# ${site.name}

**Category:** ${site.category === 'town-landing' ? 'Town Landing' : 'Way to the Water'}
**ID:** ${site.id}
**Address:** ${site.address}
**Coordinates:** ${site.lat}, ${site.lng}${site.approx ? ' *(approximate)*' : ''}

## Parking
${site.parking}

## Notes
${site.notes}

## Maps
- \`overview.png\` — Full Duxbury Bay area, site marked in red
- \`detail.png\` — Close-up (~750m radius), site marked in red
`;
  fs.writeFileSync(path.join(folderPath, 'info.md'), infoContent);

  return folderPath;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Duxbury Bay Map Generator — ${SITES.length} sites`);
  console.log('─'.repeat(60));

  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i];
    console.log(`\n[${i + 1}/${SITES.length}] ${site.name}`);

    // Create folder and info file
    const folderPath = await createSiteFolder(site);
    console.log(`  ✓ Folder: ${path.basename(folderPath)}/`);

    // Generate OVERVIEW map (full bay, site highlighted)
    try {
      await renderMap({
        center: BAY_CENTER,
        zoom: BAY_ZOOM,
        width: 1200,
        height: 900,
        marker: { lat: site.lat, lng: site.lng, radius: 400 },
        outputPath: path.join(folderPath, 'overview.png'),
      });
      console.log(`  ✓ overview.png`);
    } catch (e) {
      console.error(`  ✗ overview.png FAILED: ${e.message}`);
    }

    // Small delay to respect OSM tile server rate limits
    await new Promise(r => setTimeout(r, 500));

    // Generate DETAIL map (zoomed in to site)
    try {
      await renderMap({
        center: { lat: site.lat, lng: site.lng },
        zoom: DETAIL_ZOOM,
        width: 1200,
        height: 900,
        marker: { lat: site.lat, lng: site.lng, radius: 20 },
        outputPath: path.join(folderPath, 'detail.png'),
      });
      console.log(`  ✓ detail.png`);
    } catch (e) {
      console.error(`  ✗ detail.png FAILED: ${e.message}`);
    }

    // Delay between sites
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n' + '─'.repeat(60));
  console.log('Done! Check each site folder for overview.png and detail.png');
}

main().catch(console.error);
