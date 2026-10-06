# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\t11Performance.spec.ts >> [T11-P01-320] cold native seven-player initial deal completes within 2500ms
- Location: tests\browser\m10\t11Performance.spec.ts:7:3

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 2500
Received:    2891.600000143051
```

# Test source

```ts
  1  | import { chromium, expect, test } from '@playwright/test';
  2  | import { writeFileSync } from 'node:fs';
  3  | 
  4  | // Full native Chromium's cold renderer is distinct from the default headless shell.
  5  | // Measure real arrivals with explicit destinations; no production timing calculation.
  6  | for (const [width, height] of [[1280, 900], [768, 1024], [320, 720]]) {
  7  |   test(`[T11-P01-${width}] cold native seven-player initial deal completes within 2500ms`, async ({ baseURL }, info) => {
  8  |     const browser = await chromium.launch({ channel: 'chromium' });
  9  |     try {
  10 |       const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
  11 |       await page.goto(`${baseURL}/?fixture=player-setup`);
  12 |       await page.getByLabel('Total players', { exact: true }).selectOption('7');
  13 |       await page.getByRole('button', { name: 'Start table', exact: true }).click();
  14 |       await page.evaluate(() => {
  15 |         const timing: { start: number | null; end: number | null; destinations: string[] } = { start: null, end: null, destinations: [] };
  16 |         (window as unknown as { t11Timing: typeof timing }).t11Timing = timing;
  17 |         new MutationObserver(records => {
  18 |           for (const record of records) {
  19 |             for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
  20 |               timing.start ??= performance.now(); timing.destinations.push(node.dataset.dealTarget!);
  21 |             }
  22 |             if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.dataset.initialDealRunning === 'false' && timing.start !== null) timing.end ??= performance.now();
  23 |           }
  24 |         }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-initial-deal-running'] });
  25 |       });
  26 |       await page.getByLabel('Your main wager', { exact: false }).fill('100');
  27 |       await page.getByRole('button', { name: 'Deal', exact: true }).click();
  28 |       await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  29 |       const timing = await page.evaluate(() => (window as unknown as { t11Timing: { start: number | null; end: number | null; destinations: string[] } }).t11Timing);
  30 |       writeFileSync(info.outputPath('native-initial-timing.json'), JSON.stringify({ width, height, browser: browser.version(), timing }, null, 2));
  31 |       expect(timing.destinations).toEqual([0, 1].flatMap(index => [1, 2, 3, 4, 5, 6, 7].map(seat => `round-1/seat-${seat}:${index}`).concat(`dealer:${index}`)));
  32 |       expect(timing.start).not.toBeNull(); expect(timing.end).not.toBeNull();
> 33 |       expect(timing.end! - timing.start!).toBeLessThanOrEqual(2500);
     |                                           ^ Error: expect(received).toBeLessThanOrEqual(expected)
  34 |       await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  35 |       await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
  36 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  37 |     } finally { await browser.close(); }
  38 |   });
  39 | }
  40 | 
```