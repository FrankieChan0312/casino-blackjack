import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';
import type { Rank } from '../../src/domain/card.js';

function dealt(ranks: readonly Rank[] = ['5', '9', '6', '8', '2', '3'], stake = 200) {
  const c = createBrowserController({ factory: () => behindFixture(ranks), random: noRandom });
  c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: stake }); c.dispatch({ type: 'CLOSE' }); return c;
}
const html = (c: ReturnType<typeof dealt>) => renderToStaticMarkup(<App controller={c} />);
const act = (c: ReturnType<typeof dealt>, action: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER') => c.dispatch({ type: 'ACT', action, handId: c.getSnapshot().interaction.handId });
it('current actions use authoritative availability and direct invalid Split remains rejected', () => {
  const c = dealt(); expect(html(c)).toContain('Split unavailable'); expect(act(c, 'SPLIT')).toBe(false); expect(c.getSnapshot().human?.reserved).toBe(200);
});
it('Hit displays exactly one new card and leaves a sub-21 hand active', () => {
  const c = dealt(); act(c, 'HIT'); expect(c.getSnapshot().round?.seats[0].hands[0].cards.map((card) => card.rank)).toEqual(['5', '6', '2']); expect(html(c)).toContain('Total: 13');
});
it('Stand ends local decisions without a card and keeps dealer advance distinct', () => {
  const c = dealt(); act(c, 'STAND'); expect(c.getSnapshot().round?.seats[0].hands[0].cards).toHaveLength(2); expect(html(c)).toContain('Dealer is drawing'); expect(html(c)).not.toContain('>Hit</button>');
});
it('Double displays matching stake, adds one card, ends hand and prevents later Hit', () => {
  const c = dealt(); expect(html(c)).toContain('Matching additional wager: 100'); act(c, 'DOUBLE');
  expect(c.getSnapshot().round?.seats[0].hands[0]).toMatchObject({ stakeUnits: 400, complete: true }); expect(c.getSnapshot().round?.seats[0].hands[0].cards).toHaveLength(3);
  expect(c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' })).toBe(false);
});
it('insufficient Double is unavailable and rejection leaves funds/cards unchanged', () => {
  const c = dealt(undefined, 2000); const before = c.getSnapshot(); expect(html(c)).toContain('Double unavailable — Not enough available credits.');
  expect(act(c, 'DOUBLE')).toBe(false); expect(c.getSnapshot().round).toEqual(before.round); expect(c.getSnapshot().human).toEqual(before.human);
});
it('Split keeps ordered child hands visible with independent wagers', () => {
  const c = dealt(['8', '9', '8', 'K', '3', '4']); act(c, 'SPLIT');
  expect(c.getSnapshot().round?.seats[0].hands.map((hand) => [hand.handId, hand.cards.map((card) => card.rank)])).toEqual([['round-1/seat-1.1', ['8', '3']], ['round-1/seat-1.2', ['8']]]);
  expect(html(c)).toContain('Hand A · Current hand'); expect(html(c)).toContain('Hand B');
});
it('Re-split labels remain stable for the existing sibling and match depth-first order', () => {
  const c = dealt(['8', '9', '8', 'K', '8', '3', '4']); act(c, 'SPLIT'); act(c, 'SPLIT');
  const output = html(c); expect(output.indexOf('Hand A.1')).toBeLessThan(output.indexOf('Hand A.2')); expect(output.indexOf('Hand A.2')).toBeLessThan(output.indexOf('Hand B'));
  expect(c.getSnapshot().round?.seats[0].hands.map((hand) => hand.stakeUnits)).toEqual([200, 200, 200]);
});
it('Split Aces get exactly one added card each, ordinary 21 and no subsequent controls', () => {
  const c = dealt(['A', '9', 'A', 'K', 'K', '5']); act(c, 'SPLIT');
  expect(c.getSnapshot().round?.seats[0].hands.map((hand) => [hand.total, hand.complete, hand.cards.length])).toEqual([[21, true, 2], [16, true, 2]]);
  const output = html(c); expect(output).not.toContain('Blackjack</p>'); for (const action of ['Hit', 'Double', 'Surrender']) expect(output).not.toContain(`>${action}</button>`);
});
it('Surrender shows returned half and lost half rather than full loss', () => {
  const c = dealt(); act(c, 'SURRENDER'); expect(html(c)).toContain('Surrendered'); expect(html(c)).toContain('Returned: 50 · Lost: 50'); expect(c.getSnapshot().ownResults[0].returned).toBe(100);
});
it('terminal 21 protects cards while another computer seat can continue', () => {
  const c = createBrowserController({ factory: () => behindFixture(['10', '5', '9', '5', '6', '8', '6'], [seat(1, 'HUMAN'), seat(2)]), random: noRandom });
  c.dispatch({ type: 'OPEN' }); for (const n of [1, 2]) c.dispatch({ type: 'MAIN', seat: n, amount: 200 }); c.dispatch({ type: 'CLOSE' }); act(c, 'HIT');
  expect(c.getSnapshot().round?.seats[0].hands[0].total).toBe(21); expect(html(c)).toContain('Waiting for Seat 2'); expect(html(c)).toContain('Continue table');
});
