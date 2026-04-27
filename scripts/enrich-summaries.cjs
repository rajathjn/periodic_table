// Fetch enriched element summaries from Simple Wikipedia
// Uses the Wikipedia API to get the extract (plain text summary) for each element
const fs = require('fs');
const path = require('path');
const https = require('https');

const elementsPath = path.join(__dirname, '..', 'src', 'data', 'elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, 'utf-8'));

function fetchWikiSummary(elementName) {
  return new Promise((resolve, reject) => {
    // Simple Wikipedia API - get extract for the element
    const url = `https://simple.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(elementName)}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'PeriodicTableProject/1.0 (educational; contact@example.com)',
        'Accept': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${elementName}`));
        }
        try {
          const json = JSON.parse(data);
          resolve(json.extract || '');
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let updated = 0, failed = 0;
  
  for (const el of elements) {
    // Skip element 119 (not a real element)
    if (el.number > 118) continue;
    
    try {
      process.stdout.write(`  ${el.name} (${el.number})...`);
      const summary = await fetchWikiSummary(el.name);
      
      if (summary && summary.length > 50) {
        // Store the enriched summary - keep original as fallback
        el.summary_extended = summary;
        updated++;
        console.log(` OK (${summary.length} chars)`);
      } else {
        console.log(` SKIP (too short: ${summary.length})`);
      }
      
      await sleep(500); // Be respectful to Wikipedia servers
    } catch (e) {
      console.log(` FAILED: ${e.message}`);
      failed++;
      await sleep(1000);
    }
  }
  
  fs.writeFileSync(elementsPath, JSON.stringify(elements, null, 2));
  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

main();
