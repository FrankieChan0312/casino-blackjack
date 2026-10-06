import { chromium, expect, test } from '@playwright/test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
type ZoomChrome = { tabs: { query(query: { url: string }): Promise<{ id: number }[]>; setZoomSettings(id: number, settings: { mode: string; scope: string }): Promise<void>; setZoom(id: number, factor: number): Promise<void>; getZoom(id: number): Promise<number> } };
for (const width of [1280, 768, 640]) test(`[M13-B07-${width}] actual automatic native browser zoom 200%`, async ({ browserName }, info) => {
  expect(browserName).toBe('chromium');
  const root = resolve('.git/overnight'); mkdirSync(root, { recursive: true });
  const extension = mkdtempSync(`${root}/zoom-extension-`), profile = mkdtempSync(`${root}/zoom-profile-`);
  writeFileSync(`${extension}/manifest.json`, JSON.stringify({ manifest_version: 3, name: 'Local Baccarat zoom evidence', version: '1.0', host_permissions: ['http://127.0.0.1/*'], background: { service_worker: 'worker.js' } }));
  writeFileSync(`${extension}/worker.js`, 'chrome.runtime.onInstalled.addListener(() => {});');
  const context = await chromium.launchPersistentContext(profile, { channel: 'chromium', headless: true, viewport: null, args: [`--window-size=${width},900`, `--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/baccarat?baccaratFixture=both-third');
    await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible();
    const before = await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio }));
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    const zoom = await worker.evaluate(async () => {
      const chrome = (globalThis as unknown as { chrome: ZoomChrome }).chrome;
      const tabs = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/*' }); const tab = tabs.find(tab => tab.id !== undefined)!;
      await chrome.tabs.setZoomSettings(tab.id, { mode: 'automatic', scope: 'per-tab' }); await chrome.tabs.setZoom(tab.id, 2); return chrome.tabs.getZoom(tab.id);
    });
    expect(zoom).toBe(2); await expect.poll(() => page.evaluate(() => devicePixelRatio)).toBe(before.dpr * 2);
    const after = await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth > innerWidth }));
    expect(Math.abs(after.width - before.width / 2)).toBeLessThanOrEqual(1); expect(after.overflow).toBe(false);
    await page.getByRole('button', { name: 'Place Bet · Player' }).click(); await page.getByRole('button', { name: 'Deal', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const evidence = resolve('.git/overnight/visual/m13'); mkdirSync(evidence, { recursive: true });
    writeFileSync(`${evidence}/native-zoom-${width}.json`, JSON.stringify({ nativeApi: 'chrome.tabs.setZoom', mode: 'automatic', zoom, before, after }, null, 2));
    // Native zoom exposes CSS and DIP sizes separately. Capture in the protocol's
    // DIP coordinates; no emulation/zoom command is sent through CDP.
    await page.evaluate(() => scrollTo(0, 0));
    const cdp = await context.newCDPSession(page);
    const metrics = await cdp.send('Page.getLayoutMetrics');
    const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip: { ...metrics.contentSize, scale: 1 } });
    const pixels = Buffer.from(screenshot.data, 'base64');
    expect(pixels.readUInt32BE(16)).toBe(Math.ceil(metrics.contentSize.width));
    writeFileSync(`${evidence}/native-zoom-${width}.png`, pixels); await cdp.detach();
  } catch (error) {
    await page.screenshot({ path: info.outputPath('native-zoom-failure.png'), fullPage: true });
    throw error;
  } finally { await context.close(); }
});
