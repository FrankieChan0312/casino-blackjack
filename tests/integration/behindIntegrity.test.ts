import { afterEach, expect, it, vi } from 'vitest';
import * as g from '../../src/domain/behindGame.js';
import * as optional from '../../src/domain/optionalGame.js';
import * as shoeModule from '../../src/domain/shoe.js';
import { beginControllerDouble, decideDoubleFollow, beginControllerSplit, decideSplitFollow,
  standControllerHand } from '../../src/domain/behindController.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import { accepted as ok, backedGame, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';

afterEach(() => vi.restoreAllMocks());
const root = 'round-1/seat-1';
function empty(s: g.BehindGameState): g.BehindGameState {
  const shoe = s.table.game.shoe;
  return { ...s, table: { ...s.table, game: { ...s.table.game,
    shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
}
it('partial initial deal refunds original back and all funded seats, including undealt seats', () => {
  let s = ok(g.openBehindBetting(behindFixture(['8', '9', '6', '8', '8', '10'], [seat(1), seat(2)])));
  for (const target of [1, 2]) { s = ok(g.setBehindMainWager(s, target, 200)); s = ok(g.setBackWager(s, target, 100)); }
  const originalDraw = shoeModule.drawCard;
  let draws = 0;
  vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => {
    draws++;
    return originalDraw(draws === 2 ? { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } : shoe);
  });
  s = ok(g.closeBehindBetting(s, 'unused', noRandom));
  expect(s.table.game.round!.phase).toBe('INTEGRITY_ERROR');
  expect(s.table.game.round!.players.map((hand) => hand.cards.length)).toEqual([1, 0]);
  expect(s.backExposures).toHaveLength(2);
  s = ok(g.voidBehindRound(s));
  expect(s.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(s.computers.slice(0, 2).map((entry) => entry.bankroll.available)).toEqual([2000, 2000]);
  expect(s.backResults.map((entry) => entry.grossReturnUnits)).toEqual([100, 100]);
  expectAccounting(s.table.game.shoe);
});
it('post-VOID next round retains ownership/funds and explicitly replaces retired shoe', () => {
  let s = ok(g.advanceBehindTable(empty(backedGame(['5', '9', '6', '8']))));
  s = ok(g.voidBehindRound(s));
  const archived = structuredClone(s);
  s = ok(g.prepareNextBehindRound(s));
  expect(s.table.game.shoe.retired).toBe(true);
  expect(s.backInsurance).toEqual([]);
  s = ok(g.configureBehindSeats(s, [seat(3, 'HUMAN')]));
  s = ok(g.openBehindBetting(s));
  s = ok(g.setBehindMainWager(s, 1, 200));
  s = ok(g.setBackWager(s, 1, 200));
  s = ok(g.closeBehindBetting(s, 'replacement', { nextInt: (max) => max - 1 }));
  expect(s.table.game.shoe.shoeId).toBe('replacement');
  expect(s.backWagers[0].handId).toBe('round-2/seat-1');
  expect(archived.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(archived.backResults[0].status).toBe('REFUNDED');
});
it.each([219, 249])('follow card crosses cut %i without replacing active shoe', (cutPosition) => {
  let s = backedGame(['5', '9', '6', '8', '9']);
  const shoe = s.table.game.shoe;
  const remaining = 312 - cutPosition + 1;
  s = { ...s, table: { ...s.table, game: { ...s.table.game, shoe: { ...shoe, cutPosition,
    available: shoe.available.slice(0, remaining), discarded: [...shoe.discarded, ...shoe.available.slice(remaining)] } } } };
  expectAccounting(s.table.game.shoe);
  s = ok(beginControllerDouble(s, 'computer-1', root));
  expect(s.table.game.shoe.reshufflePending).toBe(false);
  s = ok(decideDoubleFollow(s, root, 'ADD'));
  expect(s.table.game.shoe.reshufflePending).toBe(true);
  expect(s.table.game.shoe.shoeId).toBe(shoe.shoeId);
  expectAccounting(s.table.game.shoe);
});
it('same target controller Even Money does not force follower election in a controlled domain fixture', () => {
  let s = backedGame(['A', 'A', 'K', '6']);
  // Local computer policy always declines; fixture isolates independent financial elections.
  s = { ...s, table: { ...s.table, insuranceDecisions: s.table.insuranceDecisions
    .map((entry) => ({ ...entry, choice: 'EVEN_MONEY' as const })) } };
  s = ok(g.decideBackInsurance(s, 1, 'DECLINE'));
  expect(g.getBackResults(s)[0].grossReturnUnits).toBe(500);
  s = ok(g.settleBehindWagers(s));
  expect(s.computers[0].bankroll.available).toBe(2200);
  expect(s.human!.bankroll.available).toBe(2300);
});
it('re-split NO_ADD settles first grandchild only plus funded original sibling', () => {
  let s = ok(beginControllerSplit(backedGame(['8', '9', '8', '8', '8', '10', '2', '9']), 'computer-1', root));
  s = ok(decideSplitFollow(s, root, 'ADD'));
  s = ok(beginControllerSplit(s, 'computer-1', root + '.1'));
  s = ok(decideSplitFollow(s, root + '.1', 'NO_ADD'));
  for (const path of ['.1.1', '.1.2', '.2']) s = ok(standControllerHand(s, 'computer-1', root + path));
  s = ok(g.advanceBehindTable(s));
  s = ok(g.settleBehindWagers(s));
  expect(s.backResults.map((entry) => [entry.handId, entry.grossReturnUnits])).toEqual([[root + '.1.1', 400], [root + '.2', 200]]);
  expect(s.human!.bankroll).toEqual({ available: 2200, reserved: 0 });
});
it('deferred-Ace seam rejects early, wrong-phase and repeated closure', () => {
  let s = ok(g.openBehindBetting(behindFixture(['8', 'A', '8', '6'])));
  s = ok(g.setBehindMainWager(s, 1, 200));
  const input = { ...s.table, bankrolls: [s.human!.bankroll, ...s.computers.slice(1).map((entry) => entry.bankroll)] };
  expect(optional.closeDeferredAceDecisions(input).state).toBe(input);
  const dealt = optional.closeOptionalBetting(input, 'unused', noRandom);
  expect(dealt.ok).toBe(true);
  expect(optional.closeDeferredAceDecisions(dealt.state).state).toBe(dealt.state);
  const decided = optional.decideInsurance(dealt.state, 1, false);
  expect(decided.ok).toBe(true);
  expect(optional.closeDeferredAceDecisions(decided.state).state).toBe(decided.state);
});
it('follow draw integrity preserves hidden hole and blocks payout until VOID', () => {
  let s = ok(beginControllerDouble(empty(backedGame(['5', '9', '6', '8'])), 'computer-1', root));
  s = ok(decideDoubleFollow(s, root, 'ADD'));
  const view = getPublicBehindView(s);
  expect(view.round!.dealer.holeCard).toBeNull();
  expect(view.backResults).toEqual([]);
  expect(g.settleBehindWagers(s).state).toBe(s);
  expect(s.human!.bankroll).toEqual({ available: 1600, reserved: 400 });
});
