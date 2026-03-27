# Duxbury Bay Public Access - Map Project TODO

## Project Goal
Create two map versions for each public landing/way to the water in Duxbury, MA:
1. **Overview map** - entire area covered, showing location in context
2. **Detail map** - close-up showing exact location + ~300-yard surroundings

## Source Documents
- `Duxbury Bay Management Plan final 130118.pdf` - Bay Management Plan (Chapter 7 has site list)
- `unnamed (1).png` - Overview sketch showing all 25 access points
- Web research compiled in INSIGHTS.md

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## PHASE 1: Setup & Clarification
- [x] Read/create TODO file
- [x] Read overview sketch image
- [x] Web research on sites
- [x] Ask user clarifying questions
- [x] Confirm complete site list from Chapter 7
- [x] Create folder structure for all sites

---

## PHASE 2: Site Folders & Data Collection

### TOWN LANDINGS (numbered North to South per overview map)
- [x] 01 - Ford Stand Landing (Ocean Road North)
- [x] 02 - Old Cove Landing (75 Cove St)
- [x] 03 - Drew Salt Works Landing (Bay Road North)
- [x] 04 - Shipyard Lane / Ellison Beach (99 Ship Yard Lane)
- [x] 05 - Powder Point Landing
- [x] 06 - Powder Point Bridge (370 Powder Point Ave)
- [x] 07 - Anchorage Lane Landing
- [x] 08 - Bluefish River Landing
- [x] 09 - Sagamore Road Landing
- [x] 10 - Mattakeeset Town Pier / Mattakeeset Court (35 Mattakeeset Court)
- [x] 11 - Winsor Street Landing (Seasonal Recreational Access)
- [x] 12 - Jocelyn Lane Landing ⚠️ APPROX coords — verify against Chapter 7
- [x] 13 - Massasoit Road Landing
- [x] 14 - Water Street Landing (Deep Water)
- [x] 15 - Harden Hill Road Landing
- [x] 16 - Elderberry Lane
- [x] 17 - Bay Farm (31 Loring St) — fixed coords (was in water)
- [x] 18 - Hicks Point Road Landing
- [x] 19 - Miles Standish Home Site
- [x] 20 - Howland's Landing / Deep Water (23 Howland Landing)
- [x] 21 - Landing Road Beach (44 Landing Rd)
- [x] 22 - Island Creek Pond / Crocker Memorial Park (287 Tobey Garden St)

### WAYS TO THE WATER
- [x] WW-01 - Simeon Soule's Landing ⚠️ APPROX coords — verify against Chapter 7
- [x] WW-02 - Elder Brewster Road
- [x] WW-03 - Somerset Road ⚠️ APPROX coords — verify against Chapter 7
- [x] WW-04 - Peterson's Landing (78 George St)
- [x] WW-05 - Longview Road ⚠️ APPROX coords — verify against Chapter 7

---

## PHASE 3: Map Creation
- [x] Set up mapping approach (Node.js staticmaps + OpenStreetMap tiles)
- [x] Create overview maps for each site (zoom 13, all bay visible, 400m red marker)
- [x] Create detail maps for each site (zoom 17, ~750m width, 20m red marker)
- [x] Create all-sites combined map with color-coded legend → `all-sites-map.png`
- [x] Create interactive HTML map → `all-sites-map.html` (clickable markers)
- [x] Create site detail pages → `{folder}/index.html` (27 pages)
- [ ] Final review / coordinate corrections for 4 approximate sites
- [ ] Fill in Existing Conditions for each site (field work)
- [ ] Fill in Mitigation Plans for each site

## PHASE 4: Coordinate Verification (NEXT STEP)
- [ ] WW-01 Simeon Soule's Landing — verify coords with user or Chapter 7
- [ ] WW-03 Somerset Road — verify coords
- [ ] WW-05 Longview Road — verify coords
- [ ] 12 Jocelyn Lane — verify coords
- [ ] Re-run generate-maps.js after any corrections (takes ~3 min)

---

## DECISIONS (confirmed 2026-03-27)
- **Output format**: PNG/JPG static images
- **Map tool**: OpenStreetMap (no API key required)
- **Style**: Street map style (roads + labels)
- **Site list**: Confirmed complete (~25 sites)
- **Audience**: Bay Management Commission presentations
- **Overview scale**: Immediate bay area only
- **Detail scale**: ~300 yards radius (enough to see a few street names)

## APPROACH
- Node.js script using `staticmaps` npm package (OSM tiles)
- Two PNG files per site: `overview.png` and `detail.png`
- One folder per site named with number and slug (e.g., `01-ford-stand-landing/`)

## NOTES / BLOCKERS
- PDF is image-based (scanned) - text confirmed not extractable
- Site list confirmed complete by user
- Powder Point Bridge closed Dec 2025 - late March/April 2026 for repairs
- node-canvas (used by staticmaps) may have Windows native dependency issues - test first
