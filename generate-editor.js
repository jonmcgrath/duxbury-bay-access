const fs = require('fs');
const sites = require('./sites.json');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Location Editor — Duxbury Bay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f6f8; color: #222; }
    header {
      background: #2c3e50; color: white;
      padding: 14px 24px; display: flex; align-items: center; gap: 16px;
      position: sticky; top: 0; z-index: 10;
    }
    header h1 { font-size: 18px; flex: 1; }
    header p { font-size: 12px; color: #aac; margin-top: 2px; }
    .btn {
      padding: 8px 16px; border: none; border-radius: 4px;
      cursor: pointer; font-size: 14px; font-weight: bold;
    }
    .btn-copy     { background: #1a6fa8; color: white; }
    .btn-download { background: #27ae60; color: white; }
    .btn-maps     { background: #e8f0fe; color: #1a6fa8; border: 1px solid #1a6fa8;
                    padding: 4px 10px; font-size: 12px; border-radius: 3px; cursor: pointer; }
    .btn:hover { opacity: 0.85; }
    .notice {
      background: #fffbe6; border-left: 4px solid #f0ad00;
      padding: 10px 16px; font-size: 13px; margin: 12px 24px;
    }
    table { width: calc(100% - 48px); margin: 12px 24px; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    th { background: #2c3e50; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
    td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr.landing td:first-child { border-left: 4px solid #C0392B; }
    tr.way     td:first-child { border-left: 4px solid #1A6FA8; }
    .site-name { font-weight: bold; }
    .site-id   { color: #888; font-size: 11px; }
    input[type=number] {
      width: 110px; padding: 4px 6px; border: 1px solid #ccc;
      border-radius: 3px; font-size: 13px; font-family: monospace;
    }
    input[type=number]:focus { outline: 2px solid #1a6fa8; border-color: #1a6fa8; }
    input[type=checkbox] { width: 16px; height: 16px; cursor: pointer; }
    .copied { background: #27ae60 !important; }
  </style>
</head>
<body>
  <header>
    <div style="flex:1">
      <h1>Location Editor — Duxbury Bay Access Points</h1>
      <p>Edit lat/lng values, then copy or download the updated sites.json, replace the file, and run npm run build.</p>
    </div>
    <button class="btn btn-copy" onclick="copyJSON()">Copy sites.json</button>
    <button class="btn btn-download" onclick="downloadJSON()" style="margin-left:8px">Download sites.json</button>
  </header>

  <div class="notice">
    After saving changes: replace <strong>sites.json</strong> in the project folder, then run <code>npm run build</code> to regenerate all maps.
  </div>

  <table>
    <thead>
      <tr>
        <th>Site</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Approx?</th>
        <th>Verify</th>
      </tr>
    </thead>
    <tbody id="tbody"></tbody>
  </table>

  <script>
    const SITES = ${JSON.stringify(sites, null, 2)};

    function renderTable() {
      const tbody = document.getElementById('tbody');
      SITES.forEach((site, i) => {
        const cls = site.category === 'town-landing' ? 'landing' : 'way';
        const row = document.createElement('tr');
        row.className = cls;
        row.innerHTML = \`
          <td>
            <div class="site-name">\${site.name}</div>
            <div class="site-id">\${site.id}</div>
          </td>
          <td><input type="number" id="lat-\${i}" value="\${site.lat}" step="0.0001" min="41" max="43"></td>
          <td><input type="number" id="lng-\${i}" value="\${site.lng}" step="0.0001" min="-71" max="-70"></td>
          <td style="text-align:center"><input type="checkbox" id="approx-\${i}" \${site.approx ? 'checked' : ''}></td>
          <td><button class="btn btn-maps" data-idx="\${i}" onclick="openMaps(this)">Open in Google Maps</button></td>
        \`;
        tbody.appendChild(row);
      });
    }

    function openMaps(btn) {
      const i = btn.dataset.idx;
      const lat = document.getElementById('lat-' + i).value;
      const lng = document.getElementById('lng-' + i).value;
      window.open('https://www.google.com/maps?q=' + lat + ',' + lng + '&ll=' + lat + ',' + lng + '&z=18', '_blank');
    }

    function getSites() {
      return SITES.map((site, i) => ({
        ...site,
        lat: parseFloat(document.getElementById('lat-' + i).value),
        lng: parseFloat(document.getElementById('lng-' + i).value),
        approx: document.getElementById('approx-' + i).checked,
      }));
    }

    function copyJSON() {
      const btn = document.querySelector('.btn-copy');
      navigator.clipboard.writeText(JSON.stringify(getSites(), null, 2)).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy sites.json'; btn.classList.remove('copied'); }, 2000);
      });
    }

    function downloadJSON() {
      const blob = new Blob([JSON.stringify(getSites(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sites.json';
      a.click();
    }

    renderTable();
  </script>
</body>
</html>`;

fs.writeFileSync('editor.html', html);
console.log('editor.html generated');
