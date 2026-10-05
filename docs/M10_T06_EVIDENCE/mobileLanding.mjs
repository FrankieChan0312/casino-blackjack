/* global document, window, MutationObserver, HTMLElement */
import { chromium, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import process from 'node:process';
import { log } from 'node:console';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 320, height: 720 }, reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:4173/?fixture=player-setup');
  await page.getByLabel('Total players', { exact: true }).selectOption('7');
  await page.getByRole('button', { name: 'Start table', exact: true }).click();
  await page.evaluate(() => {
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.dealTarget === 'round-1/seat-1:0') {
        node.getAnimations({ subtree: true }).forEach(animation => animation.pause()); window.landingReady = true; observer.disconnect();
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
  });
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.landingReady)).toBe(true);
  const receipt = await page.evaluate(() => {
    const card = document.querySelector('[data-initial-deal-flight] .card'), summary = document.querySelector('[data-seat-anchor="seat-1"] summary');
    const box = summary.getBoundingClientRect();
    return { actual: { x: parseFloat(card.style.left) + parseFloat(card.style.width)/2, y: parseFloat(card.style.top) + parseFloat(card.style.height)/2 },
      expected: { x: box.left + box.width/2 + window.scrollX, y: box.top + box.height/2 + window.scrollY },
      open: summary.parentElement.open, semanticTarget: 'Seat1 collapsed Cards summary' };
  });
  writeFileSync('docs/M10_T06_EVIDENCE/mobile-landing-first.json', JSON.stringify(receipt, null, 2) + '\n'); log(receipt);
  expect(receipt.open).toBe(false);
  expect(Math.abs(receipt.actual.x - receipt.expected.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(receipt.actual.y - receipt.expected.y)).toBeLessThanOrEqual(1);
} catch (failure) { log(String(failure)); process.exitCode = 1; }
finally { await browser.close(); }
