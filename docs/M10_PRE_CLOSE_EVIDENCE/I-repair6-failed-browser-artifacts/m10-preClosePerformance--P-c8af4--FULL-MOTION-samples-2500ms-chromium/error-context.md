# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\preClosePerformance.spec.ts >> [PRE-CLOSE-P01-1280] three cold and one warm native FULL_MOTION samples <=2500ms
- Location: tests\browser\m10\preClosePerformance.spec.ts:6:3

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 2500
Received:    2665.0999999046326
```

# Test source

```ts
  1  | import { chromium, expect, test } from '@playwright/test';
  2  | import { writeFileSync } from 'node:fs';
  3  | 
  4  | type Timing = { start: number | null; end: number | null; destinations: string[]; durations: number[] };
  5  | for (const [width, height] of [[1280, 900], [320, 720]]) {
  6  |   test(`[PRE-CLOSE-P01-${width}] three cold and one warm native FULL_MOTION samples <=2500ms`, async ({ baseURL }, info) => {
  7  |     test.setTimeout(60000);
  8  |     const samples: { temperature: string; elapsed: number; timing: Timing }[] = [];
  9  |     for (let cold = 0; cold < 3; cold++) {
  10 |       const browser = await chromium.launch({ channel: 'chromium' });
  11 |       try {
  12 |         for (const temperature of cold === 2 ? ['cold', 'warm'] : ['cold']) {
  13 |           const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
  14 |           await page.goto(`${baseURL}/?fixture=player-setup`);
  15 |           await page.getByLabel('Total players', { exact: true }).selectOption('7');
  16 |           await page.getByRole('button', { name: 'Start table', exact: true }).click();
  17 |           await page.evaluate(() => {
  18 |             const timing: Timing = { start: null, end: null, destinations: [], durations: [] };
  19 |             (window as unknown as { preCloseTiming: Timing }).preCloseTiming = timing;
  20 |             new MutationObserver(records => {
  21 |               for (const record of records) {
  22 |                 for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
  23 |                   timing.start ??= performance.now(); timing.destinations.push(node.dataset.dealTarget!);
  24 |                   timing.durations.push(...node.getAnimations({ subtree: true }).map(animation => Number(animation.effect!.getTiming().duration)));
  25 |                 }
  26 |                 if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.dataset.initialDealRunning === 'false' && timing.start !== null) timing.end ??= performance.now();
  27 |               }
  28 |             }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-initial-deal-running'] });
  29 |           });
  30 |           await page.getByLabel('Your main wager', { exact: false }).fill('100');
  31 |           await page.getByRole('button', { name: 'Deal', exact: true }).click();
  32 |           await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  33 |           const timing = await page.evaluate(() => (window as unknown as { preCloseTiming: Timing }).preCloseTiming);
  34 |           samples.push({ temperature, elapsed: timing.end! - timing.start!, timing });
  35 |           // Persist every bounded sample before assertions, including failures.
  36 |           const elapsed = samples.map(sample => sample.elapsed).sort((a, b) => a - b);
  37 |           writeFileSync(info.outputPath('bounded-native-samples.json'), JSON.stringify({ width, height, mode: 'FULL_MOTION', browser: browser.version(), samples,
  38 |             median: elapsed.length % 2 ? elapsed[Math.floor(elapsed.length / 2)] : (elapsed[elapsed.length / 2 - 1] + elapsed[elapsed.length / 2]) / 2,
  39 |             worst: Math.max(...elapsed), budgetMs: 2500 }, null, 2));
  40 |           await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  41 |           await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
  42 |           expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  43 |           await page.close();
  44 |         }
  45 |       } finally { await browser.close(); }
  46 |     }
  47 |     expect(samples).toHaveLength(4);
  48 |     for (const sample of samples) {
  49 |       expect(sample.timing.destinations).toEqual([0, 1].flatMap(index => [1, 2, 3, 4, 5, 6, 7].map(seat => `round-1/seat-${seat}:${index}`).concat(`dealer:${index}`)));
  50 |       expect(sample.timing.start).not.toBeNull(); expect(sample.timing.end).not.toBeNull();
  51 |       expect(sample.timing.durations).toHaveLength(16); expect(sample.timing.durations.every(duration => duration > 0)).toBe(true);
> 52 |       expect(sample.elapsed).toBeLessThanOrEqual(2500);
     |                              ^ Error: expect(received).toBeLessThanOrEqual(expected)
  53 |     }
  54 |   });
  55 | }
  56 | 
```