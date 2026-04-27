// Download all element images from Wikimedia Commons locally
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const elements = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'elements.json'), 'utf-8')
);

const imgDir = path.join(__dirname, '..', 'public', 'images', 'elements');
fs.mkdirSync(imgDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'PeriodicTableBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
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

async function main() {
  let downloaded = 0, failed = 0;
  for (const el of elements) {
    if (!el.image || !el.image.url) {
      console.log(`  SKIP ${el.symbol} - no image URL`);
      failed++;
      continue;
    }
    const ext = path.extname(new URL(el.image.url).pathname).split('?')[0] || '.jpg';
    const filename = `${el.symbol.toLowerCase()}${ext}`;
    const dest = path.join(imgDir, filename);
    if (fs.existsSync(dest)) {
      console.log(`  EXISTS ${filename}`);
      downloaded++;
      continue;
    }
    try {
      console.log(`  Downloading ${el.symbol} (${el.number}/118)...`);
      await download(el.image.url, dest);
      downloaded++;
      // small delay to be nice to servers
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.log(`  FAILED ${el.symbol}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nDone! Downloaded: ${downloaded}, Failed: ${failed}`);
}

main();
