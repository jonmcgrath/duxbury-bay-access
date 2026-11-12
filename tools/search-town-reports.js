// Search the Duxbury Annual Town Report OCR (Internet Archive) page by page.
// usage: node tools/search-town-reports.js <regex> [ctxChars=300] [idFilter] [maxHits]
// Prints: item | OCR leaf (page image index n = leaf - 1) | last "year ending" seen | context.
// Printed page numbers are NOT reliable in the IA page map; read them from the text or the image.
const fs = require('fs'), zlib = require('zlib'), path = require('path');
const ROOT = path.join(__dirname, '..', 'sources', 'duxbury-annual-reports', 'ocr');
const re = new RegExp(process.argv[2], 'gi');
const ctx = +(process.argv[3] || 300), filt = process.argv[4] || '', max = +(process.argv[5] || 400);
let hits = 0;
const cache = path.join(ROOT, '.cache');
if (!fs.existsSync(cache)) fs.mkdirSync(cache);
function load(id) {
  const cf = path.join(cache, id + '.json');
  if (fs.existsSync(cf)) return JSON.parse(fs.readFileSync(cf, 'utf8'));
  const d = path.join(ROOT, id);
  const text = zlib.gunzipSync(fs.readFileSync(path.join(d, 'hocr_searchtext.txt.gz'))).toString('utf8');
  const idx = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(d, 'hocr_pageindex.json.gz'))).toString());
  let pn = [];
  try { pn = JSON.parse(fs.readFileSync(path.join(d, 'page_numbers.json'), 'utf8')).pages; } catch (e) {}
  // idx[i] = [charStart, charEnd, hocrStart, hocrEnd] for scan index n=i (archive.org/details/ID/page/n{i})
  const pages = idx.map((r, i) => { const q = pn.find(x => x.leafNum === i); return { leaf: i, pno: q ? q.pageNumber : '?', t: text.slice(r[0], r[1]) }; });
  // Report year: last "YEAR ENDING ... 19xx" title page seen so far
  let yr = '';
  for (const p of pages) {
    const m = p.t.replace(/\s+/g, ' ').match(/YEAR\s*ENDING[^0-9]{0,60}((18|19|20)\d\d)/i);
    if (m) yr = m[1];
    p.yr = yr;
  }
  fs.writeFileSync(cf, JSON.stringify(pages));
  return pages;
}
const ids = fs.readdirSync(ROOT).filter(x => !x.startsWith('.') && new RegExp(filt).test(x)).sort();
for (const id of ids) {
  let pages; try { pages = load(id); } catch (e) { console.error('skip', id, e.message); continue; }
  for (const p of pages) {
    const t = p.t.replace(/\s+/g, ' ');
    let m; re.lastIndex = 0;
    while ((m = re.exec(t))) {
      if (++hits > max) { console.log('...max hits'); process.exit(); }
      console.log(`\n## ${id} | leaf ${p.leaf} (image n${p.leaf - 1}) | yr-end ${p.yr}\n` + t.slice(Math.max(0, m.index - ctx), m.index + m[0].length + ctx));
      break; // one hit per page
    }
  }
}
console.log('\nhits', hits);
