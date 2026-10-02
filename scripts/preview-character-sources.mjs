// Browser-composited audit screenshots; never edits source files.
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import process from 'node:process';

const production = process.argv.includes('--production');
const audit = JSON.parse(readFileSync(production ? 'art/character-production-audit.json' : 'docs/PA1_SOURCE_AUDIT.json', 'utf8'));
mkdirSync('test-results', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1050, height: 1020 }, deviceScaleFactor: 1 });
  for (const background of ['#12362e', '#eeeeee']) {
    for (let group = 0; group < 2; group++) {
      const entries = audit.files.slice(group * 6, group * 6 + 6);
      await page.setContent(`<style>body{margin:0;background:${background};color:${background === '#eeeeee' ? '#111' : '#fff'};font:16px sans-serif}main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:12px}figure{margin:0;text-align:center}img{display:block;width:100%;height:${production ? 320 : 460}px;object-fit:contain}figcaption{padding:6px}</style><main>${entries.map(entry => `<figure><img src="data:image/png;base64,${readFileSync(entry.path).toString('base64')}"><figcaption>${entry.name}</figcaption></figure>`).join('')}</main>`);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      const path = `${production ? 'docs/images/pa1-production' : 'test-results/pa1-source'}-${background === '#eeeeee' ? 'light' : 'felt'}-${group + 1}.png`;
      await page.screenshot({ path, fullPage: true });
      process.stdout.write(`${path}\n`);
    }
  }
} finally {
  await browser.close();
}
