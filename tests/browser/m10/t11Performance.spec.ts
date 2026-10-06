import { chromium, expect, test } from '@playwright/test';
import { writeFileSync } from 'node:fs';

// Full native Chromium's cold renderer is distinct from the default headless shell.
// Measure real arrivals with explicit destinations; no production timing calculation.
for (const [width, height] of [[1280, 900], [768, 1024], [320, 720]]) {
  test(`[T11-P01-${width}] cold native seven-player initial deal completes within 2500ms`, async ({ baseURL }, info) => {
    const browser = await chromium.launch({ channel: 'chromium' });
    try {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
      await page.goto(`${baseURL}/?fixture=player-setup`);
      await page.getByLabel('Total players', { exact: true }).selectOption('7');
      await page.getByRole('button', { name: 'Start table', exact: true }).click();
      await page.evaluate(() => {
        const timing: { start: number | null; end: number | null; destinations: string[] } = { start: null, end: null, destinations: [] };
        (window as unknown as { t11Timing: typeof timing }).t11Timing = timing;
        new MutationObserver(records => {
          for (const record of records) {
            for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
              timing.start ??= performance.now(); timing.destinations.push(node.dataset.dealTarget!);
            }
            if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.dataset.initialDealRunning === 'false' && timing.start !== null) timing.end ??= performance.now();
          }
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-initial-deal-running'] });
      });
      await page.getByLabel('Your main wager', { exact: false }).fill('100');
      await page.getByRole('button', { name: 'Deal', exact: true }).click();
      await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
      const timing = await page.evaluate(() => (window as unknown as { t11Timing: { start: number | null; end: number | null; destinations: string[] } }).t11Timing);
      writeFileSync(info.outputPath('native-initial-timing.json'), JSON.stringify({ width, height, browser: browser.version(), timing }, null, 2));
      expect(timing.destinations).toEqual([0, 1].flatMap(index => [1, 2, 3, 4, 5, 6, 7].map(seat => `round-1/seat-${seat}:${index}`).concat(`dealer:${index}`)));
      expect(timing.start).not.toBeNull(); expect(timing.end).not.toBeNull();
      expect(timing.end! - timing.start!).toBeLessThanOrEqual(2500);
      await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
      await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { await browser.close(); }
  });
}
