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

### TOWN LANDINGS (renumbered 2026-11-09 to follow Protective Bylaw Art. 300 §302 order; see INSIGHTS.md)
- [x] 01 - Ford Stand Landing
- [x] 02 - Old Cove Landing
- [x] 03 - Drew Salt Works Landing
- [x] 04 - Simeon Soule's Landing (formerly WW-01)
- [x] 05 - Peterson's Landing (formerly WW-04)
- [x] 06 - Powder Point Landing (formerly 05)
- [x] 07 - Powder Point Bridge (West End) (formerly 06)
- [x] 08 - Anchorage Lane Landing (formerly 07)
- [x] 09 - Bluefish River Landing (formerly 08)
- [x] 10 - Mattakeeset Town Pier
- [x] 11 - Winsor Street Landing
- [x] 12 - Water Street Landing (formerly 14)
- [x] 13 - Jocelyn Lane Landing (formerly 12)
- [x] 14 - Harden Hill Road Landing (formerly 15)
- [x] 15 - Howland's Landing (formerly 20)
- [x] 16 - Landing Road Beach (formerly 21)
- [x] 17 - Hicks Point Road Landing (formerly 18)

### WAYS TO THE WATER
- [x] WW-01 - Shipyard Lane (Ellison Beach) (formerly 04)
- [x] WW-02 - Elder Brewster Road
- [x] WW-03 - Samoset Road (formerly "Somerset Road", misnamed)
- [x] WW-04 - Sagamore Road Landing (formerly 09)
- [x] WW-05 - Massasoit Road Landing (formerly 13)
- [x] WW-06 - Miles Standish Home Site (formerly 19)
- [x] WW-07 - Longview Road (formerly WW-05)
- [x] WW-08 - Elderberry Lane (formerly 16)
- [x] WW-09 - Bay Farm (formerly 17)
- [x] WW-10 - Island Creek Pond (formerly 22)

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
- [ ] 04 Simeon Soule's Landing (formerly WW-01) — verify coords
- [ ] WW-03 Samoset Road (formerly "Somerset Road", misnamed) — verify coords
- [ ] WW-07 Longview Road (formerly WW-05) — verify coords
- [ ] 13 Jocelyn Lane (formerly 12) — verify coords
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
- ~~PDF is image-based (scanned)~~ Corrected 2026-11-09: the PDF has a text layer; see INSIGHTS.md "Town Landings vs Ways to the Water"
- Site list confirmed complete by user
- Powder Point Bridge closed Dec 2025 - late March/April 2026 for repairs
- node-canvas (used by staticmaps) may have Windows native dependency issues - test first

## DECISIONS (2026-11-09)
- **Site categories** follow Protective Bylaw Art. 300 §302, as quoted in Bay Management Plan §7.2(b). Sites were renumbered and old URLs redirect. Shipyard Lane was moved to Ways to the Water (WW-01) after review with Jon.
