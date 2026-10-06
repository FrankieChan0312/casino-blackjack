# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\nativeZoom.spec.ts >> [M13-B07-768] actual automatic native browser zoom 200%
- Location: tests\browser\baccarat\nativeZoom.spec.ts:5:39

# Error details

```
Error: tracing.start: Tracing has been already started
```

# Test source

```ts
  1  | import { chromium, expect, test } from '@playwright/test';
  2  | import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
  3  | import { resolve } from 'node:path';
  4  | type ZoomChrome = { tabs: { query(query: { url: string }): Promise<{ id: number }[]>; setZoomSettings(id: number, settings: { mode: string; scope: string }): Promise<void>; setZoom(id: number, factor: number): Promise<void>; getZoom(id: number): Promise<number> } };
  5  | for (const width of [1280, 768, 640]) test(`[M13-B07-${width}] actual automatic native browser zoom 200%`, async ({ browserName }, info) => {
  6  |   expect(browserName).toBe('chromium');
  7  |   const root = resolve('.git/overnight'); mkdirSync(root, { recursive: true });
  8  |   const extension = mkdtempSync(`${root}/zoom-extension-`), profile = mkdtempSync(`${root}/zoom-profile-`);
  9  |   writeFileSync(`${extension}/manifest.json`, JSON.stringify({ manifest_version: 3, name: 'Local Baccarat zoom evidence', version: '1.0', host_permissions: ['http://127.0.0.1/*'], background: { service_worker: 'worker.js' } }));
  10 |   writeFileSync(`${extension}/worker.js`, 'chrome.runtime.onInstalled.addListener(() => {});');
  11 |   const context = await chromium.launchPersistentContext(profile, { channel: 'chromium', headless: true, viewport: null, args: [`--window-size=${width},900`, `--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
> 12 |   await context.tracing.start({ screenshots: true, snapshots: true });
     |                         ^ Error: tracing.start: Tracing has been already started
  13 |   const page = await context.newPage();
  14 |   try {
  15 |     await page.goto('http://127.0.0.1:4173/baccarat?baccaratFixture=both-third');
  16 |     await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible();
  17 |     const before = await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio }));
  18 |     const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  19 |     const zoom = await worker.evaluate(async () => {
  20 |       const chrome = (globalThis as unknown as { chrome: ZoomChrome }).chrome;
  21 |       const tabs = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/*' }); const tab = tabs.find(tab => tab.id !== undefined)!;
  22 |       await chrome.tabs.setZoomSettings(tab.id, { mode: 'automatic', scope: 'per-tab' }); await chrome.tabs.setZoom(tab.id, 2); return chrome.tabs.getZoom(tab.id);
  23 |     });
  24 |     expect(zoom).toBe(2); await expect.poll(() => page.evaluate(() => devicePixelRatio)).toBe(before.dpr * 2);
  25 |     const after = await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth > innerWidth }));
  26 |     expect(Math.abs(after.width - before.width / 2)).toBeLessThanOrEqual(1); expect(after.overflow).toBe(false);
  27 |     await page.getByRole('button', { name: 'Place Bet · Player' }).click(); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  28 |     await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');
  29 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  30 |     const evidence = resolve('.git/overnight/visual/m13'); mkdirSync(evidence, { recursive: true });
  31 |     writeFileSync(`${evidence}/native-zoom-${width}.json`, JSON.stringify({ nativeApi: 'chrome.tabs.setZoom', mode: 'automatic', zoom, before, after }, null, 2));
  32 |     await page.screenshot({ path: `${evidence}/native-zoom-${width}.png`, fullPage: true });
  33 |     await context.tracing.stop();
  34 |   } catch (error) {
  35 |     await page.screenshot({ path: info.outputPath('native-zoom-failure.png'), fullPage: true });
  36 |     await context.tracing.stop({ path: info.outputPath('native-zoom-trace.zip') }); throw error;
  37 |   } finally { await context.close(); }
  38 | });
  39 |
  40 |
```
