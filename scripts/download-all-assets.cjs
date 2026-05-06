/**
 * download-all-assets.cjs
 *
 * Downloads all element assets (3D GLB models, Bohr images, spectral images,
 * and sample photographs) into public/assets/elements/<Symbol>/.
 *
 * Updates elements.json in-place with `local_*` paths so the app can load
 * assets from the local filesystem instead of hitting remote CDNs at runtime.
 *
 * Usage:
 *   node scripts/download-all-assets.cjs           # Normal run (skips existing files)
 *   node scripts/download-all-assets.cjs --retry    # Retry failed downloads with longer delays
 */
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const fetch = globalThis.fetch;

const elementsPath = path.join(__dirname, '..', 'src', 'data', 'elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, 'utf8'));

const publicDir = path.join(__dirname, '..', 'public', 'assets', 'elements');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Parse CLI flags
const isRetryMode = process.argv.includes('--retry');
const DELAY_SUCCESS = isRetryMode ? 1500 : 200;   // ms between successful downloads
const DELAY_FAILURE = isRetryMode ? 5000 : 1000;   // ms after a failed download
const MIN_RETRY_SIZE = 1000;                        // bytes — files smaller than this are re-downloaded in retry mode

/** Delays execution by `ms` milliseconds. */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Downloads a file from `url` to `destPath`.
 * Skips if the destination already exists (and is large enough in retry mode).
 * Returns an object indicating success, skip, or failure.
 */
async function downloadFile(url, destPath) {
  // In normal mode, skip if file exists at all
  // In retry mode, skip only if file exists AND is large enough
  if (fs.existsSync(destPath)) {
    if (!isRetryMode || fs.statSync(destPath).size > MIN_RETRY_SIZE) {
      return { success: true, skipped: true };
    }
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
  console.log(`Starting asset downloads${isRetryMode ? ' (RETRY MODE — slower, re-downloads small files)' : ''}...`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const el of elements) {
    const symbolDir = path.join(publicDir, el.symbol);
    if (!fs.existsSync(symbolDir)) {
      fs.mkdirSync(symbolDir, { recursive: true });
    }

    console.log(`\nProcessing ${el.name} (${el.symbol})...`);

    // 1. Download 3D Bohr model (.glb)
    if (el.bohr_model_3d) {
      const glbPath = path.join(symbolDir, 'model.glb');
      const res = await downloadFile(el.bohr_model_3d, glbPath);
      if (res.success) {
        el.local_bohr_model_3d = `/assets/elements/${el.symbol}/model.glb`;
        if (res.skipped) skipCount++; else successCount++;
      } else {
        console.warn(`  [FAILED] GLB: ${res.error}`);
        failCount++;
        await sleep(DELAY_FAILURE);
      }
    }

    // 2. Download 2D Bohr model image
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
        await sleep(DELAY_FAILURE);
      }
    }

    // 3. Download spectral emission/absorption image
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
        await sleep(DELAY_FAILURE);
      }
    }

    // 4. Download sample photograph
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
        await sleep(DELAY_FAILURE);
      }
    }

    // Save progress after each element so partial runs aren't lost
    fs.writeFileSync(elementsPath, JSON.stringify(elements, null, 2));

    // Throttle to respect remote server rate limits
    await sleep(DELAY_SUCCESS);
  }

  console.log(`\nDownload Summary:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Skipped (already exists): ${skipCount}`);
  console.log(`  Failed: ${failCount}`);
}

main().catch(console.error);
