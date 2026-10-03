/* global scrollTo, document, getComputedStyle */
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { log } from 'node:console';

const server = await createServer({ mode: 'e2e', server: { host: '127.0.0.1', port: 4184, strictPort: true } });
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4184/?fixture=player');
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await page.evaluate(() => scrollTo(0, 0));
  const data = await page.evaluate(() => [...document.querySelectorAll('header,.round-status,.table-surface,.dealer,.table-inscription,.seats,.seat,.character-identity,.seat article,.seat article .cards,.seat article p,.local-actions,.action-bar')].map(el => {
    const r = el.getBoundingClientRect(), css = getComputedStyle(el);
    return { label: el.getAttribute('aria-label'), class: el.className, x: r.x, y: r.y, width: r.width, height: r.height,
      grid: css.gridArea, margin: css.margin, padding: css.padding, position: css.position };
  }));
  writeFileSync('docs/M10_T01_EVIDENCE/footprint-diagnosis.json', JSON.stringify(data, null, 2) + '\n');
  log(JSON.stringify(data));
  await page.screenshot({ path: 'docs/M10_T01_EVIDENCE/diagnosis-desktop.png', fullPage: true, animations: 'disabled' });
} finally {
  await browser.close(); await server.close();
}
