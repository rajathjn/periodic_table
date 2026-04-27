// Retry with very long delays to avoid rate limiting
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const elements = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'elements.json'), 'utf-8')
);

const imgDir = path.join(__dirname, '..', 'public', 'images', 'elements');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/*,*/*',
    };
    client.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error('HTTP ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(e);
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let ok = 0, fail = 0, skip = 0;
  for (const el of elements) {
    if (!el.image || !el.image.url) { skip++; continue; }
    let ext;
    try { ext = path.extname(new URL(el.image.url).pathname).split('?')[0] || '.jpg'; } catch { ext = '.jpg'; }
    const filename = el.symbol.toLowerCase() + ext;
    const dest = path.join(imgDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) { skip++; continue; }
    try {
      process.stdout.write('  ' + el.symbol + '...');
      await download(el.image.url, dest);
      ok++;
      console.log(' OK');
      await sleep(5000); // 5 second delay between downloads
    } catch (e) {
      console.log(' FAIL: ' + e.message);
      fail++;
      await sleep(10000); // 10 second delay after failure
    }
  }
  console.log('\nResult: OK=' + ok + ' FAIL=' + fail + ' SKIP=' + skip);
}

main();
