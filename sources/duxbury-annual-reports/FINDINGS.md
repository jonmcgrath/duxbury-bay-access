# Findings: Annual Reports of the Town of Duxbury (searched 2026-11-11)

**Source:** printed annual town reports, bound by decade, scanned on Internet Archive (41 items, `annualreportfort{YEAR}duxb`, covering 1860–2014). Each report prints the Town Clerk's record of every town meeting vote, so for votes this is a **primary printed source**. The 1975 Town Landing Study Committee report only retyped excerpts from these; where both exist, `history.json` now cites the original page.

**Gaps:** **1916–1919 are not online.** Internet Archive skips from the 1911–1915 volume to 1920–1925, and the Massachusetts State Library (archives.lib.state.ma.us) has 1900–1915 but nothing for 1916–1919 (checked 2026-11-11). The 1870–1879 item would not download its OCR (server error 500, twice).

## Process (repeatable)
1. `node tools/town-report-pages.js ocr`: downloads the OCR text and page index of every volume into `sources/duxbury-annual-reports/ocr/` (about 40 MB, gitignored).
2. `node tools/search-town-reports.js "<regex>" [context] [volume-filter] [max]`: prints every matching page with its OCR leaf and **image index n = leaf − 1**. Search a site name, then keep the hits that mention a conveyance word (lay out, accept, deed, gift, purchase, taking, eminent domain, exchange, quitclaim, release, low water).
3. `node tools/town-report-pages.js show <item> <leaf>`: reads the whole page. Find the meeting date by reading back to the "annual/special town meeting held …" heading.
4. `node tools/town-report-pages.js fetch <item> <n>`, then `python -I tools/shrink-page-images.py sources/duxbury-annual-reports/pages`: saves the page image as `pages/<years>/p<n>.jpg`.
5. **Check the quote and the printed page number against the image.** The IA page-number map is wrong in places, and the OCR misreads names (e.g. "Rowland's" for Howland's, "Eushton" for Rushton).
6. Add the record to `history.json` (source key `ar-<first year of volume>`, `pages: [n]`), then `node generate-html.js`.

## What counts as a record (decided 2026-11-11)
Only records of **how the town got, defined, or gave up its rights**: layouts, acceptances, deeds, gifts, purchases, takings, exchanges, quitclaims and boundary changes. Removed from `history.json`: 1975 committee recommendations, repair and construction money, street naming, and family background (31 records).

## Original pages found (all verified against the page images)
| Site | Date | What | Volume, image n | Printed page |
|---|---|---|---|---|
| 02–07, 09 | 1899-01-21 / 03-06 | Report on Town Landings (six landings) and the vote adopting Bradford's surveys, recording them "in Plymouth", and recording Point End as a "Highway to the sea" | 1890–99, n789–791, n876 | pp. 38–41 |
| 02 | 1898-03-07 | Highway from end of Cove St to top of Abram's Hill accepted | 1890–99, n793 | p. 42 |
| 12 | 1898-03-07 | Highway near J. K. Burgess house "thence to the shore" accepted | 1890–99, n793 | p. 42 |
| 15 | **1895-03-04** | "road and landing near Allen's wharf" accepted. **Corrects** the 1975 report's 1896 (that is the report year) | 1890–99, n502 | p. 49 |
| 09 | 1899/1900 | Town owns part of the Blue River Bridge wharf; Killian offers the rest | 1890–99, n870–871 | pp. 35–36 |
| 12 | 1899/1900 | Charles C. Clapp gives the land for Water St to the shore | 1890–99, n871 | p. 36 |
| 06/07 | 1900-03-05, 1902-03-03 | F. B. Knapp quitclaim exchange at Point End voted, then reversed | 1901–10, n15, n263 | p. 38 (1902) |
| 09? | 1901-03-04 | Committee to settle the St. George Street landing and buy adjoining land | 1901–10, n151 | |
| 10 | 1902-03-03 | Build the County Commissioners' highway to include Mattakeesett Court; Irwin land damage $34.20 | 1901–10, n263, n242 | p. 38, p. 17 |
| 03 | **1905-03-06** | Ellen F. Adams may move the way to the landing. **Corrects** the 1975 report's 1904 | 1901–10, n619 | p. 68 |
| 13 | 1907-03-04 | Josselyn highway accepted | 1901–10, n891 | p. 52 |
| WW-02–05 | 1907-03-04 | Standish Shore ways (Columbus Ave, Brewster, Samoset, Sagamore, Massasoit Rds) accepted "to the shore" | 1901–10, n892 | p. 53 |
| 11, 16, 17 | 1908 | Committee on Town Landings: Winsor St first steps; Foote offers land; Irwin offers salt meadow | 1901–10, n1028–1029 | pp. 43–44 |
| **12** | **1908-11-03** | **Town landing at the end of Water St accepted** (new; not in the 1975 report) | 1901–10, n1040 | p. 55 |
| 16, 17 | 1909-03-08 | Selectmen to lay out Hicks Point and the Foote landing | 1901–10, n1191 | p. 64 |
| **16, 17** | **1909-09-02** | **Both landings and ways accepted**: over land of E. A. D. Foote, and over land of Joshua B. Weston, David H. Chandler and The Loring Company (new) | 1901–10, n1192 | p. 65 |
| **10** | **1910** | **$400 paid to John A. Irwin for "upland and shore"** (new) | 1901–10, n1285 | p. 14 |
| WW-05 | 1920-03-13 | Massasoit Rd and Mayflower Ave to be laid out | 1920–25, n94 | p. 83 |
| 16 | 1924-03-01 | Selectmen may relocate Landing Road for Timothy Coughlin (new) | 1920–25, n631 | |
| 02 | 1924-03-01 | Old Cove land exchange with Clapp and Evans | 1920–25, n633 | p. 72 |
| WW-06 | 1930-03-01 | Standish homesite accepted | 1926–30, n790 | |
| WW-03 | 1941-03-01 | Part of Samoset Rd to be laid out | 1941–45, n143 | p. 136 |
| WW-01 | 1944-03-04 | Ellison gift accepted, with full description and restrictions | 1941–45, n887–888 | pp. 108–109 |
| **WW-07** | **1953-03-14** | **Longview Rd accepted, Captain's Hill Rd to Midway Rd** (new) | 1951–55, n537 | p. 90 |
| 15 | 1954 | Article to take three parcels beside Town Landing Road fails, 262–162 (two-thirds needed); gives bearings | 1951–55, n919, n921 | pp. 102–104 |
| **WW-08** | **1955-08-12** | **Midway Rd and Elderberry Lane accepted** (new) | 1951–55, n1154 | p. 116 |
| **WW-07** | **1956-03-10** | **Rest of Longview Rd, Midway Rd "to the Shore", accepted** (new) | 1956–60, n162 | p. 151 |
| **16** | **1957-03-09** | **Foote Shore Lots U and T taken by eminent domain for the Landing Road beach**, 233–0 (new) | 1956–60, n443–444 | pp. 118–119 |
| WW-09 | 1972-03-11 | Bay Farm acquired | 1971–75, n381–382 | pp. 36–37 |

## Found but not added (not a conveyance, or site unknown)
- 1882 warrant Art. 15: "accept of the town way and landing on the land formerly owned by George Bradford" (petition of Harvey Soule). Outcome and site are not yet checked (1879–89 volume, leaf 180).
- 1901–02 oyster grant to J. H. Killian, which uses "a stone bound on the easterly side of the Town Landing, marked on plan by Lawrence Bradford as the Clark Peterson Landing" (1901–10, leaf 748). This is evidence of a bound at 05 Peterson's.
- 1922: Town Counsel to publish an opinion on rights to "the shore and town landings" (1920–25, leaf 325). The opinion text was not found in the 1922–25 reports by keyword search.
- 1933: a petition to lease the landing at the west end of Gurnet (Powder Point) Bridge to the Duxbury Rural Society; the town appointed a committee instead.
- 1956: "Posts have been erected at all Town landings to delineate the bounds of the public ways."
- 2004 report p. 27 lists the bylaw's town landings and ways to the water in shoreline order (same list as the Bay Plan).
