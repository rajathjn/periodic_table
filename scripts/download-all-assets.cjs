const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

// Using dynamic import for fetch if not available globally, though Node 18+ has it.
const fetch = globalThis.fetch;

const elementsPath = path.join(__dirname, '..', 'src', 'data', 'elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, 'utf8'));

const publicDir = path.join(__dirname, '..', 'public', 'assets', 'elements');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath)) {
    return { success: true, skipped: true };
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PeriodicTableApp/1.0 (educational; contact@example.com)'
      }
    });

    if (!res.ok) {
      if (res.status === 429 || res.status === 403) {
        throw new Error(`Rate limited or forbidden (${res.status})`);
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const fileStream = fs.createWriteStream(destPath);
    await pipeline(res.body, fileStream);
    return { success: true, skipped: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('Starting asset downloads...');
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const el of elements) {
    const symbolDir = path.join(publicDir, el.symbol);
    if (!fs.existsSync(symbolDir)) {
      fs.mkdirSync(symbolDir, { recursive: true });
    }

    console.log(`\nProcessing ${el.name} (${el.symbol})...`);
    
    // 1. Download GLB
    if (el.bohr_model_3d) {
      const glbPath = path.join(symbolDir, 'model.glb');
      const res = await downloadFile(el.bohr_model_3d, glbPath);
      if (res.success) {
        el.local_bohr_model_3d = `/assets/elements/${el.symbol}/model.glb`;
        if (res.skipped) skipCount++; else successCount++;
      } else {
        console.warn(`  [FAILED] GLB: ${res.error}`);
        failCount++;
      }
    }

    // 2. Download bohr_model_image
    if (el.bohr_model_image) {
      const ext = path.extname(new URL(el.bohr_model_image).pathname) || '.png';
      const imgPath = path.join(symbolDir, `bohr_image${ext}`);
      const res = await downloadFile(el.bohr_model_image, imgPath);
      if (res.success) {
        el.local_bohr_model_image = `/assets/elements/${el.symbol}/bohr_image${ext}`;
        if (res.skipped) skipCount++; else successCount++;
      } else {
        console.warn(`  [FAILED] Bohr Image: ${res.error}`);
        failCount++;
      }
    }

    // 3. Download spectral_img
    if (el.spectral_img) {
      const ext = path.extname(new URL(el.spectral_img).pathname) || '.jpg';
      const imgPath = path.join(symbolDir, `spectral${ext}`);
      const res = await downloadFile(el.spectral_img, imgPath);
      if (res.success) {
        el.local_spectral_img = `/assets/elements/${el.symbol}/spectral${ext}`;
        if (res.skipped) skipCount++; else successCount++;
      } else {
        console.warn(`  [FAILED] Spectral: ${res.error}`);
        failCount++;
      }
    }

    // 4. Download main image
    if (el.image && el.image.url) {
      const ext = path.extname(new URL(el.image.url).pathname) || '.jpg';
      const imgPath = path.join(symbolDir, `image${ext}`);
      const res = await downloadFile(el.image.url, imgPath);
      if (res.success) {
        el.image.local_url = `/assets/elements/${el.symbol}/image${ext}`;
        if (res.skipped) skipCount++; else successCount++;
      } else {
        console.warn(`  [FAILED] Main Image: ${res.error}`);
        failCount++;
      }
    }

    // Save progressively
    fs.writeFileSync(elementsPath, JSON.stringify(elements, null, 2));

    // Throttle to avoid rate limits
    await sleep(200); 
  }

  console.log(`\nDownload Summary:`);
  console.log(`Success: ${successCount}`);
  console.log(`Skipped (already exists): ${skipCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
