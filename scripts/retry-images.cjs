// Retry downloading failed images with longer delays
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
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/*,*/*',
      'Accept-Language': 'en-US,en;q=0.9',
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
        return reject(new Error(`HTTP ${res.statusCode}`));
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
  let downloaded = 0, failed = 0, skipped = 0;
  for (const el of elements) {
    if (!el.image || !el.image.url) { skipped++; continue; }
    const ext = path.extname(new URL(el.image.url).pathname).split('?')[0] || '.jpg';
    const filename = `${el.symbol.toLowerCase()}${ext}`;
    const dest = path.join(imgDir, filename);
    // Check if file already exists and has content
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      skipped++;
      continue;
    }
    try {
      process.stdout.write(`  Downloading ${el.symbol} (${el.number})...`);
      await download(el.image.url, dest);
      downloaded++;
      console.log(' OK');
      await sleep(1500); // 1.5s between downloads to avoid rate limiting
    } catch (e) {
      console.log(` FAILED: ${e.message}`);
      failed++;
      await sleep(3000); // wait longer after a failure
    }
  }
  console.log(`\nDone! Downloaded: ${downloaded}, Failed: ${failed}, Skipped: ${skipped}`);
}

main();
