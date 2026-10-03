import { test, expect, type Page } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const viewports = [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }];
async function deal(page: Page, fixture = 'player') {
  await page.goto(`/?fixture=${fixture}`);
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
}
async function geometry(page: Page) {
  const data = await page.locator('.casino-table').evaluate(table => {
    const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    const anchors = [...table.querySelectorAll('.dealer, .seat')].map(el => ({ label: el.getAttribute('aria-label'), ...rect(el) }));
    return { table: rect(table), anchors, viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth };
  });
  expect(data.scrollWidth).toBeLessThanOrEqual(data.viewport.width);
  const dealer = data.anchors[0];
  expect(Math.abs(dealer.x + dealer.width / 2 - data.viewport.width / 2)).toBeLessThan(2);
  for (let i = 0; i < data.anchors.length; i++) {
    const a = data.anchors[i];
    expect(a.x, a.label!).toBeGreaterThanOrEqual(data.table.x);
    expect(a.x + a.width, a.label!).toBeLessThanOrEqual(data.table.x + data.table.width);
    for (const b of data.anchors.slice(i + 1)) {
      expect(a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1 || a.y + a.height <= b.y + 1 || b.y + b.height <= a.y + 1,
        `${a.label} intersects ${b.label}`).toBe(true);
    }
  }
  for (const cards of await page.locator('.seat article .cards:visible').all()) {
    expect(await cards.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
  return data;
}

test('[M10-E01] current casino table anchors retain public players and usable controls at three viewports', async ({ page }) => {
  const receipts = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page); await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('[data-anchor="dealer-cards"]')).toBeVisible();
    await expect(page.locator('[data-anchor="table-centre"]')).toBeVisible();
    expect(await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-seat-anchor')))).toEqual(['seat-1','seat-3','seat-4','seat-6']);
    await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
    receipts.push(await geometry(page));
    for (const name of ['Hit','Stand','Double','Split','Surrender']) {
      const button = page.getByRole('button', { name, exact: true });
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const stand = page.getByRole('button', { name: 'Stand', exact: true });
    if (viewport.width === 1280) { const box = (await stand.boundingBox())!; expect(box.y + box.height).toBeLessThanOrEqual(900); }
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/table-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await stand.click(); await expect(page.locator('#player-result')).toBeFocused();
    await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
    await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
  }
  writeFileSync('docs/M10_T01_EVIDENCE/geometry.json', JSON.stringify(receipts, null, 2) + '\n');
});

test('[M10-E02] five actual cards and four actual split leaves use vertical flow without overlapping seat regions', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-five');
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Hit', exact: true }).click();
    await expect(page.locator('#player-hand article .card')).toHaveCount(5); await geometry(page);
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/five-cards-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('#player-result')).toBeFocused();
    await deal(page, 'player-rsa-cap');
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Split', exact: true }).click();
    await expect(page.locator('#player-hand article')).toHaveCount(4); await geometry(page);
    const ids = await page.locator('#player-hand article').evaluateAll(els => els.map(el => el.getAttribute('data-hand-id')));
    expect(new Set(ids).size).toBe(4);
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/four-leaves-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeEnabled();
  }
});

test('[M10-E03] enlarged text failed portraits and reduced motion keep identity cards and keyboard decisions accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/characters/*.png', route => route.abort());
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await expect(page.locator('#player-hand').getByRole('heading', { name: 'Roland', exact: true })).toBeVisible();
    await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth', 0);
    await geometry(page);
    if (viewport.width === 320) {
      const guest = page.getByRole('region', { name: 'Seat 1', exact: true });
      await guest.locator('summary').click();
      await expect(guest.locator('.guest-mobile-cards .card').first()).toBeVisible(); await geometry(page);
    }
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/text-fallback-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await page.locator('#player-hand').focus();
    const stand = page.getByRole('button', { name: 'Stand', exact: true });
    for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused();
    expect(await stand.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
    expect(await page.locator('#player-hand .card').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  }
});
