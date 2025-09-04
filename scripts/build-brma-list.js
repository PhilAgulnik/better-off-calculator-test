// Build BRMA list for England by scraping GOV.UK LHA page
// Usage: node scripts/build-brma-list.js
// Outputs: src/data/brmaListEngland.json

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const SOURCE_URL = 'https://www.gov.uk/government/statistics/local-housing-allowance-indicative-rates-for-2024-to-2025/indicative-local-housing-allowance-rates-for-2024-to-2025#monthly-indicative-lha-rates-for-financial-year-2024-to-2025';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'brmaListEngland.json');

(async () => {
  try {
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`Failed to fetch source: ${res.status}`);
    const html = await res.text();

    const $ = cheerio.load(html);

    // Look for the table(s) listing BRMAs and extract the first column text (BRMA name)
    // The page contains Weekly and Monthly tables; either is fine for names.
    const names = new Set();

    // Try different table selectors to find the BRMA data
    $('table').each((_, table) => {
      const $table = $(table);
      const headers = $table.find('thead th, tr:first-child th, tr:first-child td').map((_, el) => $(el).text().trim()).get();
      
      // Look for tables that have BRMA-related headers
      const hasBRMAHeader = headers.some(header => 
        /BRMA|Broad Rental Market Area|Area|Location/i.test(header)
      );
      
      if (hasBRMAHeader) {
        $table.find('tbody tr, tr').each((_, tr) => {
          const tds = $(tr).find('td');
          if (tds.length === 0) return;
          
          const brmaRaw = $(tds[0]).text().trim();
          if (!brmaRaw) return;
          
          // Filter out obvious non-BRMA entries
          if (/^BRMA$/i.test(brmaRaw)) return;
          if (/^\d+\.?\d*$/.test(brmaRaw)) return; // Skip pure numbers (rates)
          if (brmaRaw.length < 3) return; // Skip very short entries
          if (/^£|^[0-9]/.test(brmaRaw)) return; // Skip entries starting with £ or numbers
          
          names.add(brmaRaw);
        });
      }
    });

    // Known BRMAs include England, Scotland, Wales.
    // We do not have a reliable country column on the page, so we include all and
    // rely on a maintainable allow-list to exclude non-England if needed later.
    // For now, write all names; app can still show full list.

    const list = Array.from(names).sort((a, b) => a.localeCompare(b));

    // Ensure directory exists
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(list, null, 2), 'utf8');

    console.log(`Wrote ${list.length} BRMA names to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error building BRMA list:', err);
    process.exit(1);
  }
})();
