// Companion to search-town-reports.js. Three commands:
//   node tools/town-report-pages.js ocr                       download OCR + page index for every
//                                                              Duxbury annual report volume on Internet Archive
//   node tools/town-report-pages.js show <itemId> <leaf> [toLeaf]   print the OCR text of those leaves
//   node tools/town-report-pages.js fetch <itemId> <n> [n ...]      save page images (n = leaf - 1) to
//        sources/duxbury-annual-reports/pages/<years>/p<n>.jpg (1000 px wide; run the shrink step after)
// Item ids look like annualreportfort1901duxb; <years> is the item's volume (e.g. 1901-1910).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const BASE = path.join(__dirname, '..', 'sources', 'duxbury-annual-reports');
const OCR = path.join(BASE, 'ocr');
const curl = (url, out) => execFileSync('curl', ['-sfL', '-o', out, url]);
const json = (url) => JSON.parse(execFileSync('curl', ['-sfL', url]).toString());
const [cmd, ...a] = process.argv.slice(2);

if (cmd === 'ocr') {
  const q = 'https://archive.org/advancedsearch.php?q=identifier%3Aannualrepor*duxb*&fl%5B%5D=identifier&rows=300&output=json';
  for (const { identifier: id } of json(q).response.docs) {
    const d = path.join(OCR, id); fs.mkdirSync(d, { recursive: true });
    for (const f of ['hocr_searchtext.txt.gz', 'hocr_pageindex.json.gz', 'page_numbers.json']) {
      const out = path.join(d, f);
      if (fs.existsSync(out) && !fs.readFileSync(out).slice(0, 20).toString().includes('<html')) continue;
      try { curl(`https://archive.org/download/${id}/${id}_${f}`, out); } catch (e) { console.log('failed', id, f); }
    }
    console.log('ok', id);
  }
} else if (cmd === 'show') {
  const [id, from, to] = a;
  execFileSync('node', [path.join(__dirname, 'search-town-reports.js'), 'zzzqqqnomatch', '0', id]);
  const pages = JSON.parse(fs.readFileSync(path.join(OCR, '.cache', id + '.json'), 'utf8'));
  for (const p of pages) if (p.leaf >= +from && p.leaf <= +(to || from))
    console.log(`\n=== ${id} leaf ${p.leaf} (image n${p.leaf - 1})\n` + p.t.replace(/[ \t]+/g, ' '));
} else if (cmd === 'fetch') {
  const [id, ...ns] = a;
  const meta = json(`https://archive.org/metadata/${id}`).metadata;
  const years = String(meta.volume || meta.year || id).replace(/[^0-9-]/g, '');
  const dir = path.join(BASE, 'pages', years); fs.mkdirSync(dir, { recursive: true });
  for (const n of ns) {
    const out = path.join(dir, `p${n}.jpg`);
    if (!fs.existsSync(out)) curl(`https://archive.org/download/${id}/page/n${n}_w1000.jpg`, out);
    console.log(out);
  }
} else {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter(l => l.startsWith('//')).join('\n'));
}
