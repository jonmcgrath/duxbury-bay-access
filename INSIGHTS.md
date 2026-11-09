# Duxbury Bay Public Access - Project Insights

## Overview
Duxbury Bay has 25+ public access points broken into two categories:
- **Town Landings** - numbered, formally maintained
- **Ways to the Water** - additional public access, often informal

Source: Duxbury Bay Management Plan (2013), Chapter 7; overview sketch `unnamed (1).png`

---

## Access Point Data (Research as of 2026-03-27)

### MAJOR HUBS (highest capacity)
| Site | Parking | Trailers | Handicapped | Notes |
|------|---------|----------|-------------|-------|
| Mattakeeset Court (Primary Hub) | 60 | 12 | 4 | Main launch facility |
| Powder Point Bridge (West End) | 50 | 0 | 2 | Closed Dec 2025-April 2026 for repairs |
| Howland's Landing (Deep Water) | 18 | 3 | 0 | Kingston Bay |
| Shipyard Lane / Ellison Beach | 27 | 0 | 2 | Swimming beach |

### CONFIRMED SITES WITH ADDRESSES & COORDINATES
| # | Name | Address | Lat | Lng | Notes |
|---|------|---------|-----|-----|-------|
| - | Mattakeeset Town Pier | 35 Mattakeeset Court | 42.0393 | -70.6703 | ADA accessible; public restrooms (seasonal) |
| - | Howland's Landing | 23 Howland Landing | 42.0102 | -70.6848 | 5 acres; historic; amphitheater |
| - | Powder Point Bridge | 370 Powder Point Ave | ~42.038 | ~-70.648 | Paddle/small boat launch |
| - | Shipyard Lane (Ellison Beach) | 99 Ship Yard Lane | 42.0274 | -70.6714 | Sandy beach; seasonal lifeguards |
| - | Old Cove Landing | 75 Cove St | 42.0512 | -70.6717 | Duck Hill River / Back River access |
| - | Bay Farm | 31 Loring St | ~42.003 | ~-70.690 | 80 acres; Duxbury/Kingston town line |
| - | Landing Road Beach | 44 Landing Rd | 42.0128 | -70.7003 | No parking; Kingston Bay |
| - | Island Creek Pond | 287 Tobey Garden St | 42.0236 | -70.7124 | Freshwater; canoe/kayak launch |
| - | Cushman Preserve | 10 Anchorage Lane | 42.0452 | -70.6771 | 27.4 acres; Bluefish River |

### SITES WITHOUT CONFIRMED COORDINATES (need verification)
- Ford Stand Landing (Ocean Road North / Highway Extension)
- Drew Salt Works Landing (Bay Road North)
- Bluefish River Landing (Old Mill Dam area)
- Sagamore Road Landing
- Winsor Street Landing (seasonal)
- Jocelyn Lane Landing
- Massasoit Road Landing (Pine Grove)
- Water Street Landing (deep water anchorage)
- Harden Hill Road Landing (time-restricted parking)
- Elderberry Lane (0.7-1 acre parcel)
- Hicks Point Road Landing (southern designated landing)
- Miles Standish Home Site
- Simeon Soule's Landing
- Elder Brewster Road
- Somerset Road
- Peterson's Landing (78 George St)
- Longview Road

---

## Town Landings vs Ways to the Water: the legal definitions (found 2026-11-09)

**Source:** Duxbury Bay Management Plan (Sept 2011, rev. 2012), §7.2(b), PDF pp. 49–50, which quotes **Duxbury Protective Bylaw Article 300, Section 302**. *The current bylaw text has not been checked. The bylaw may have been amended since 2011.*

- **Town landing:** "designated areas to which the Town has an **undoubted right**, which have been **surveyed and recorded with the Plymouth County Registry of Deeds to the low water mark (mean)**"
- **Way to the water:** "designated areas to which the Town has rights as public ways to the water, **by gift, or otherwise** which **may or may not be restricted** as to their usage and which **have not been specifically laid out and surveyed to the low water mark** and recorded as a Town Landing." This also includes "roads properly laid out, improved and extended to the water by funds raised and appropriated by the Town and designated as public highways."

**What this means:** the difference is about legal title, not size or facilities. A town landing should have a **recorded survey plan at the Plymouth County Registry**. A way to the water has rights that are less certain, so its deed and town-meeting history matters more.

### Bylaw lists vs. this project's categories (sites.json), north to south as listed
| Bylaw: Town Landings (15) | Project category |
|---|---|
| Ford Stand, Old Cove, Drew Salt Works, Powder Point Bridge (west end, both sides), Anchorage Lane, Bluefish River, Mattakeeset Town Pier, Winsor St, Water St, Jocelyn Lane, Harden Hill Rd, Landing Road, Hicks Point Rd | town-landing ✔ |
| **Simeon Soule's Landing** | **way-to-water ✘ (WW-01)** |
| **Peterson's Landing** | **way-to-water ✘ (WW-04)** |

| Bylaw: Ways to the Water (9, plus Island Creek Pond) | Project category |
|---|---|
| Elder Brewster Rd, Longview Rd | way-to-water ✔ |
| **Samoset Road** | project has **"Somerset Road" (WW-03)**. This is probably a misname. *Assumed, not verified.* |
| **Shipyard Lane / Ellison Beach, Sagamore Rd, Massasoit Rd, Miles Standish Home Site, Elderberry Lane, Bay Farm** | **town-landing ✘ (04, 09, 13, 19, 16, 17)** |
| Island Creek Pond: "not included in the by-law," but included in the plan as a way to a herring run | town-landing ✘ (22) |

**RESOLVED 2026-11-09 (approved by Jon):** sites.json was re-categorized and renumbered to follow the bylaw lists and their north-to-south order. The result is 17 town landings and 10 ways to the water. Simeon Soule's and Peterson's became town landings 04 and 05. Shipyard Lane, Sagamore, Massasoit, Miles Standish Home Site, Elderberry, Bay Farm and Island Creek Pond became ways WW-01, WW-04, WW-05, WW-06, WW-08, WW-09 and WW-10. "Somerset Road" was renamed **Samoset Road** (WW-03). Sites missing from the bylaw were placed by location and noted on their pages. Old page URLs redirect to the new ones (`redirects.json`), and each site keeps a `formerId` in sites.json. The tables above use the **old** IDs.
- **Shipyard Lane (WW-01):** Jon first wanted to keep it as a town landing, because the Ellison family gave it to the town. He then agreed that a gift fits the bylaw's way-to-the-water wording ("by gift, or otherwise"), and it was moved the same day. Evidence: the on-site plaque credits Eben Ellison's "generous gift of land and money" ([NSRWA listing](https://nsrwa.org/listing/shipyard-lane-beach), checked 2026-11-09). **Not yet found:** the deed or town-meeting vote accepting the gift, and its date.

**Not in either bylaw list:** 05 Powder Point Landing (now 06), 20 Howland's Landing (now 15). The plan's §7.2(a) also counts "16 town landings, 10 ways to the water" but lists 15 landings, so one landing is unaccounted for. Howland's may be it (the NSRWA says the town bought it in 1894). *Unverified.*
- **Update 2026-11-09:** the 1975 Town Landing Study Committee report (source of the §302 wording) lists **16** shore landings, Howland's among them, plus a **St. George Street (by Old Mill Pond)** landing that this project lacks. It records Howland's as accepted by town vote in **1896**, not bought in 1894. See `sources/town-landing-report-1975/FINDINGS.md`.

## Key Observations
1. ~~The PDF is a scanned image~~ **Corrected 2026-11-09:** the Bay Management Plan PDF has a text layer (produced by Word 2010). Extract it with `pdftotext -layout`.
2. The overview sketch shows ~25 numbered access points with two primary categories
3. Several sites have time/season restrictions (Winsor Street = seasonal; Harden Hill = time-restricted)
4. Some "Ways to the Water" have zero or minimal parking
5. Bay Farm straddles Duxbury/Kingston town line - jointly managed
6. Powder Point Bridge under repair closure Dec 2025 - April 2026

---

## Data Sources
- North and South Rivers Watershed Association (nsrwa.org)
- Town of Duxbury official website
- Duxbury Harbormaster (781-934-2866)
- Overview image: `unnamed (1).png`

---

## Mapping Approach (Implemented 2026-03-27)
- **Tool**: Node.js `staticmaps` npm package + OpenStreetMap tile server
- **Script**: `generate-maps.js` — run with `node generate-maps.js` to regenerate all
- **Overview**: 1200×900 PNG, zoom 13, center 42.035/-70.683, 400m red circle marker + white ring
- **Detail**: 1200×900 PNG, zoom 17 (~750m wide), 20m red circle marker + white ring
- **Output**: Each site has its own folder (e.g., `10-mattakeeset-town-pier/`) with `overview.png`, `detail.png`, and `info.md`

## Approximate Coordinates — Needs Verification
These 4 sites could not be geocoded from OpenStreetMap and used estimated positions:
| Site | Estimated Coords | Basis |
|------|-----------------|-------|
| 12 - Jocelyn Lane Landing (now 13) | 42.0200, -70.6770 | Between Water St and Massasoit Rd |
| WW-01 - Simeon Soule's Landing (now 04) | 42.0350, -70.6590 | Near Powder Point area per overview image |
| WW-03 - Somerset Road (now WW-03 Samoset Road) | 42.0490, -70.6770 | Near George Street / Peterson's Landing |
| WW-05 - Longview Road (now WW-07) | 42.0155, -70.6860 | Near Elderberry Lane |

**Action**: Verify against Chapter 7 maps or physical GPS check. Run `node generate-maps.js` to regenerate after updating coordinates in `generate-maps.js`.

## All-Sites Combined Map
- File: `all-sites-map.png` (1200×1050 px)
- Script: `generate-all-sites-map.js`
- Town Landings = red circles (labeled 1–22), Ways to the Water = blue circles (labeled W1–W5)
- Numbers inside markers; no border ring; white text on colored dot
- Legend in upper-left (inland/highway area, fewest markers)
- Markers drawn via SVG Mercator projection for crisp colors (staticmaps circle API rendered dark at this scale)
- Zoom 14; east edge ≈ -70.636 (just east of Clark's Island/south of Saquish Neck)
- HEIGHT=1050 calculated so site span (942px) fills ~90% of vertical space
- CENTER_LAT=42.033 chosen via binary search to give equal 5% margins top and bottom

## Issues Found and Resolved
- Bay Farm initial coords (42.0050, -70.7050) placed marker in Kingston Bay → corrected to (42.0030, -70.7130) which lands correctly on the conservation area with Bay Circuit Trail visible
- Overview zoom 14 cut off northern sites (Ford Stand, Old Cove, Powder Point) → changed to zoom 13 with center adjusted to 42.035/-70.683
