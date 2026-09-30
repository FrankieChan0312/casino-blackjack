import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import * as game from '../../src/domain/behindGame.js';
import * as controlled from '../../src/domain/behindController.js';
import { accepted as ok, backedGame, behindFixture } from '../helpers/behindFixture.js';
import { noRandom } from '../helpers/tableFixture.js';
import type { Rank } from '../../src/domain/card.js';

function dealt(ranks: readonly Rank[], sides = false) {
  const c = createBrowserController({ factory: () => behindFixture(ranks), random: noRandom }); c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 });
  if (sides) { c.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 20 }); c.dispatch({ type: 'SIDE', kind: 'THREE_CARD', amount: 20 }); }
  c.dispatch({ type: 'CLOSE' }); return c;
}
const html = (c: ReturnType<typeof dealt>) => renderToStaticMarkup(<App controller={c} />);
it('Ace opens a dedicated pre-peek screen without known hidden rank/suit/ID', () => {
  const c = dealt(['5', 'A', '6', 'K']); const output = html(c); expect(output).toContain('Insurance decision'); expect(output).toContain('Insurance amount: 50'); expect(output).not.toContain('K'); expect(output).not.toContain('spades'); expect(output).not.toContain('Take Even Money');
});
it('Insurance is funded independently and disappears after peek', () => {
  const c = dealt(['5', 'A', '6', '9']); c.dispatch({ type: 'ACE', choice: 'INSURANCE' });
  expect(c.getSnapshot().human).toMatchObject({ available: 1700, reserved: 300 }); expect(html(c)).not.toContain('Buy Insurance'); expect(html(c)).toContain('Insurance results');
});
it('eligible Even Money is distinct and adds no reserve', () => {
  const c = dealt(['A', 'A', 'K', '9']); expect(html(c)).toContain('Take Even Money'); c.dispatch({ type: 'ACE', choice: 'EVEN_MONEY' });
  expect(c.getSnapshot().ownResults[0]).toMatchObject({ outcome: 'EVEN_MONEY', returned: 400 }); expect(c.getSnapshot().human).toMatchObject({ available: 2200, reserved: 0 });
});
it('controlled Double follower screen uses real funded domain window, with no target gameplay controls', () => {
  const state = ok(controlled.beginControllerDouble(backedGame(['5', '9', '6', '8', '9']), 'computer-1', 'round-1/seat-1'));
  const c = createBrowserController({ factory: () => state, random: noRandom }); const output = html(c);
  expect(output).toContain('Double follow decision'); expect(output).toContain('Matching additional amount: 100'); expect(output).toContain('>ADD</button>'); expect(output).not.toContain('>Double</button>');
  c.dispatch({ type: 'FOLLOW', choice: 'ADD' }); expect(c.getSnapshot().trackedBack[0].amount).toBe(400);
});
it('controlled Split NO ADD clearly tracks only first ordered child', () => {
  const state = ok(controlled.beginControllerSplit(backedGame(['8', '9', '8', '8', '3', '4']), 'computer-1', 'round-1/seat-1'));
  const c = createBrowserController({ factory: () => state, random: noRandom }); expect(html(c)).toContain('first ordered child only');
  c.dispatch({ type: 'FOLLOW', choice: 'NO_ADD' }); expect(c.getSnapshot().trackedBack).toEqual([{ seat: 1, handId: 'round-1/seat-1.1', amount: 200 }]); expect(html(c)).toContain('NO ADD applied');
});
it('controlled Split ADD funds both ordered children', () => {
  const state = ok(controlled.beginControllerSplit(backedGame(['8', '9', '8', '8', '3', '4']), 'computer-1', 'round-1/seat-1'));
  const c = createBrowserController({ factory: () => state, random: noRandom }); c.dispatch({ type: 'FOLLOW', choice: 'ADD' });
  expect(c.getSnapshot().trackedBack.map((entry) => [entry.handId, entry.amount])).toEqual([['round-1/seat-1.1', 200], ['round-1/seat-1.2', 200]]);
});
it('side results remain separate from main result', () => {
  const c = dealt(['8', '8', '8', '10'], true); c.dispatch({ type: 'ACT', action: 'STAND', handId: 'round-1/seat-1' }); c.dispatch({ type: 'ADVANCE' });
  expect(html(c)).toContain('Main hand results'); expect(html(c)).toContain('Side-bet results'); expect(html(c)).toContain('Mixed Pair'); expect(html(c)).toContain('Three of a Kind');
});
it('real required-draw failure becomes VOID/refund and never normal player loss', () => {
  let s = behindFixture(['5', '9', '6', '8']); s = ok(game.openBehindBetting(s)); s = ok(game.setBehindMainWager(s, 1, 200)); s = ok(game.closeBehindBetting(s, 'unused', noRandom));
  const shoe = s.table.game.shoe; s = { ...s, table: { ...s.table, game: { ...s.table.game, shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
  const c = createBrowserController({ factory: () => s, random: noRandom }); c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  expect(c.getSnapshot().phase).toBe('VOID'); expect(c.getSnapshot().human?.available).toBe(2000); const output = html(c); expect(output).toContain('Round interrupted'); expect(output).toContain('stakes were refunded'); expect(output).not.toContain('<strong>Loss</strong>');
});
it('completed next-round preparation retains funds and existing shoe semantics', () => {
  const c = dealt(['10', '9', '10', '8']); c.dispatch({ type: 'ACT', action: 'STAND', handId: 'round-1/seat-1' }); c.dispatch({ type: 'ADVANCE' });
  expect(html(c)).toContain('Next round'); const available = c.getSnapshot().human?.available; c.dispatch({ type: 'NEXT' }); expect(c.getSnapshot().phase).toBe('CONFIGURING'); expect(c.getSnapshot().human?.available).toBe(available); expect(html(c)).toContain('Existing 6-deck shoe continues');
});
it('CLASSIC five-card hand remains actionable and never shows Charlie', () => {
  const c = dealt(['2', '9', '2', '8', '2', '2', '2']); for (let n = 0; n < 3; n++) c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  expect(c.getSnapshot().round?.seats[0].hands[0]).toMatchObject({ total: 10, complete: false }); expect(html(c)).not.toContain('Charlie'); expect(html(c)).toContain('>Hit</button>');
});
