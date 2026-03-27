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

## Key Observations
1. The PDF (Duxbury Bay Management Plan) is a scanned image - text not extractable programmatically
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
| 12 - Jocelyn Lane Landing | 42.0200, -70.6770 | Between Water St and Massasoit Rd |
| WW-01 - Simeon Soule's Landing | 42.0350, -70.6590 | Near Powder Point area per overview image |
| WW-03 - Somerset Road | 42.0490, -70.6770 | Near George Street / Peterson's Landing |
| WW-05 - Longview Road | 42.0155, -70.6860 | Near Elderberry Lane |

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
