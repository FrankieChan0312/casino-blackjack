import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { createFixtureController } from '../browser/fixtures.js';

function check(c: ReturnType<typeof createFixtureController>, values: readonly string[]) {
  const before = JSON.stringify(c.getSnapshot()), html = renderToStaticMarkup(<App controller={c} />);
  const region = html.slice(html.indexOf('<section class="credits'), html.indexOf('</dl></section>', html.indexOf('<section class="credits')));
  expect(region).toContain('aria-label="Your credits"><h2>Credits</h2>');
  for (const [i, label] of ['Available', 'Reserved / current exposure', 'Pending return'].entries()) expect(region).toContain(`<dt>${label}</dt><dd>${values[i]}</dd>`);
  expect(region).not.toContain('Computer'); expect(region).not.toContain('hidden');
  expect(JSON.stringify(c.getSnapshot())).toBe(before);
}
it('[M10A-T07-U01] compact region preserves open, active, Double and Split funds as literal authoritative values', () => {
  const c = createFixtureController('player-split'); check(c, ['1,000','0','0']);
  expect(c.dispatch({ type: 'DEAL', amount: 200 })).toBe(true); check(c, ['900','100','0']);
  expect(c.dispatch({ type: 'ACT', action: 'SPLIT', handId: 'round-1/seat-4' })).toBe(true); check(c, ['800','200','0']);
  expect(c.dispatch({ type: 'ACT', action: 'DOUBLE', handId: 'round-1/seat-4.1' })).toBe(true); check(c, ['700','300','0']);
});
it('[M10A-T07-U02] Insurance shows exact half credits and pending pair returns stay unavailable', () => {
  const c = createFixtureController('player-ace'); expect(c.dispatch({ type: 'DEAL', amount: 202 })).toBe(true);
  expect(c.dispatch({ type: 'ACE', choice: 'INSURANCE' })).toBe(true); check(c, ['848.5','151.5','0']);
  const pending = createFixtureController('player-pending'); expect(pending.dispatch({ type: 'DEAL', amount: 200 })).toBe(true);
  check(pending, ['890','110','70']); expect(pending.getSnapshot().human?.available).toBe(1780);
});
it('[M10A-T07-U03] completion and all-credit loss retain settlement and low funds without replenishment', () => {
  const c = createFixtureController('player-loss'); expect(c.dispatch({ type: 'DEAL', amount: 2000 })).toBe(true);
  check(c, ['0','1,000','0']); expect(c.dispatch({ type: 'ACT', action: 'STAND', handId: 'round-1/seat-4' })).toBe(true);
  check(c, ['0','0','0']); expect(c.dispatch({ type: 'NEXT' })).toBe(true); check(c, ['0','0','0']);
});
