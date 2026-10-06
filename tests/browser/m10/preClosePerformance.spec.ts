import { chromium, expect, test } from '@playwright/test';
import { writeFileSync } from 'node:fs';

type Timing = { start: number | null; end: number | null; destinations: string[]; durations: number[] };
for (const [width, height] of [[1280, 900], [320, 720]]) {
  test(`[PRE-CLOSE-P01-${width}] three cold and one warm native FULL_MOTION samples <=2500ms`, async ({ baseURL }, info) => {
    test.setTimeout(60000);
    const samples: { temperature: string; elapsed: number; timing: Timing }[] = [];
    for (let cold = 0; cold < 3; cold++) {
      const browser = await chromium.launch({ channel: 'chromium' });
      try {
        for (const temperature of cold === 2 ? ['cold', 'warm'] : ['cold']) {
          const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
          await page.goto(`${baseURL}/?fixture=player-setup`);
          await page.getByLabel('Total players', { exact: true }).selectOption('7');
          await page.getByRole('button', { name: 'Start table', exact: true }).click();
          await page.evaluate(() => {
            const timing: Timing = { start: null, end: null, destinations: [], durations: [] };
            (window as unknown as { preCloseTiming: Timing }).preCloseTiming = timing;
            new MutationObserver(records => {
              for (const record of records) {
                for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
                  timing.start ??= performance.now(); timing.destinations.push(node.dataset.dealTarget!);
                  timing.durations.push(...node.getAnimations({ subtree: true }).map(animation => Number(animation.effect!.getTiming().duration)));
                }
                if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.dataset.initialDealRunning === 'false' && timing.start !== null) timing.end ??= performance.now();
              }
            }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-initial-deal-running'] });
          });
          await page.getByLabel('Your main wager', { exact: false }).fill('100');
          await page.getByRole('button', { name: 'Deal', exact: true }).click();
          await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
          const timing = await page.evaluate(() => (window as unknown as { preCloseTiming: Timing }).preCloseTiming);
          samples.push({ temperature, elapsed: timing.end! - timing.start!, timing });
          // Persist every bounded sample before assertions, including failures.
          const elapsed = samples.map(sample => sample.elapsed).sort((a, b) => a - b);
          writeFileSync(info.outputPath('bounded-native-samples.json'), JSON.stringify({ width, height, mode: 'FULL_MOTION', browser: browser.version(), samples,
            median: elapsed.length % 2 ? elapsed[Math.floor(elapsed.length / 2)] : (elapsed[elapsed.length / 2 - 1] + elapsed[elapsed.length / 2]) / 2,
            worst: Math.max(...elapsed), budgetMs: 2500 }, null, 2));
          await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
          await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          await page.close();
        }
      } finally { await browser.close(); }
    }
    expect(samples).toHaveLength(4);
    for (const sample of samples) {
      expect(sample.timing.destinations).toEqual([0, 1].flatMap(index => [1, 2, 3, 4, 5, 6, 7].map(seat => `round-1/seat-${seat}:${index}`).concat(`dealer:${index}`)));
      expect(sample.timing.start).not.toBeNull(); expect(sample.timing.end).not.toBeNull();
      expect(sample.timing.durations).toHaveLength(16); expect(sample.timing.durations.every(duration => duration > 0)).toBe(true);
      expect(sample.elapsed).toBeLessThanOrEqual(2500);
    }
  });
}
