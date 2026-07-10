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
const BAY_CENTER = { lat: 42.035, lng: -70.683 };
const BAY_ZOOM = 13;
const DETAIL_ZOOM = 17;

const SITES = require('./sites.json');

// ─── MAP GENERATION ───────────────────────────────────────────────────────────

async function renderMap(options) {
  const { center, zoom, width, height, marker, outputPath } = options;
  const map = new StaticMaps({ width, height });

  if (marker) {
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
  }

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
        marker: null, // marker is now a scalable HTML/CSS overlay (see generate-html.js)
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
