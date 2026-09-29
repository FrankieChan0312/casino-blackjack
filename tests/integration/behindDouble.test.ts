import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import { beginControllerDouble, decideDoubleFollow } from '../../src/domain/behindController.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import type { Rank } from '../../src/domain/card.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

export function doubleFixture(back = 200, ranks: readonly Rank[] = ['5', '9', '6', '8', '9']) {
  let state = accepted(game.openBehindBetting(behindFixture(ranks, [seat(1)])));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  if (back) state = accepted(game.setBackWager(state, 1, back));
  return accepted(game.closeBehindBetting(state, 'unused', noRandom));
}
it('controller Double without followers draws once immediately; follower owner is rejected', () => {
  const before = doubleFixture(0);
  expect(beginControllerDouble(before, 'local-human', 'round-1/seat-1').state).toBe(before);
  expect(beginControllerDouble(before, 'local-human', 'round-1/seat-1').ok).toBe(false);
  const state = accepted(beginControllerDouble(before, 'computer-1', 'round-1/seat-1'));
  expect(state.followWindow).toBeNull();
  expect(state.table.game.shoe.inPlay).toHaveLength(5);
  expect(state.computers[0].bankroll).toEqual({ available: 1600, reserved: 400 });
  expect(state.table.game.round!.players[0]).toMatchObject({ complete: true, stakeUnits: 400 });
});
it.each(['ADD', 'NO_ADD'] as const)('%s waits before card, then uses actual exposure and irreversible decision', (choice) => {
  const before = doubleFixture();
  let state = accepted(beginControllerDouble(before, 'computer-1', 'round-1/seat-1'));
  expect(state.table.game.shoe).toBe(before.table.game.shoe);
  expect(state.table.game.round!.players[0].cards).toBe(before.table.game.round!.players[0].cards);
  expect(state.computers[0].bankroll).toEqual({ available: 1600, reserved: 400 });
  expect(state.human!.bankroll).toEqual({ available: 1800, reserved: 200 });
  expect(game.advanceBehindTable(state).state).toBe(state);
  expect(game.actBehindHand(state, 'round-1/seat-1', 'HIT').ok).toBe(false);
  expect(game.settleBehindWagers(state).ok).toBe(false);
  expect(getPublicBehindView(state).follow).toMatchObject({ kind: 'DOUBLE', targetSeat: 1 });
  state = accepted(decideDoubleFollow(state, 'round-1/seat-1', choice));
  expect(state.table.game.shoe.inPlay).toHaveLength(5);
  expect(state.table.game.round!.players[0].cards.map((card) => card.rank)).toEqual(['5', '6', '9']);
  expect(state.backExposures[0].stakeUnits).toBe(choice === 'ADD' ? 400 : 200);
  expect(state.human!.bankroll).toEqual(choice === 'ADD' ? { available: 1600, reserved: 400 } : { available: 1800, reserved: 200 });
  expect(state.computers[0].bankroll).toEqual({ available: 1600, reserved: 400 });
  expect(decideDoubleFollow(state, 'round-1/seat-1', 'ADD').state).toBe(state);
  expect(beginControllerDouble(state, 'computer-1', 'round-1/seat-1').ok).toBe(false);
});
it('exact funds ADD succeeds; insufficient ADD records rejection and NO_ADD without blocking controller', () => {
  for (const back of [1000, 1200]) {
    let state = accepted(beginControllerDouble(doubleFixture(back), 'computer-1', 'round-1/seat-1'));
    const original = structuredClone(state.human);
    state = accepted(decideDoubleFollow(state, 'round-1/seat-1', 'ADD'));
    expect(state.followWindow).toBeNull();
    expect(state.table.game.round!.players[0].complete).toBe(true);
    expect(state.table.game.shoe.inPlay).toHaveLength(5);
    if (back === 1000) expect(state.human!.bankroll).toEqual({ available: 0, reserved: 2000 });
    else {
      expect(state.human).toEqual(original);
      expect(state.backExposures[0].stakeUnits).toBe(1200);
      expect(state.followDecisions[0]).toEqual({ kind: 'DOUBLE', handId: 'round-1/seat-1', choice: 'NO_ADD', fundingError: 'INSUFFICIENT_FUNDS' });
    }
    expect(state.computers[0].bankroll.reserved).toBe(400);
  }
});
it.each([
  { card: '9', choice: 'ADD', gross: 800, outcome: 'PLAYER_WIN' },
  { card: '9', choice: 'NO_ADD', gross: 400, outcome: 'PLAYER_WIN' },
  { card: '2', choice: 'ADD', gross: 0, outcome: 'DEALER_WIN' },
  { card: '6', choice: 'ADD', gross: 400, outcome: 'PUSH' },
])('doubled $outcome/$choice returns $gross', ({ card, choice, gross, outcome }) => {
  let state = accepted(beginControllerDouble(doubleFixture(200, ['5', '9', '6', '8', card as Rank]), 'computer-1', 'round-1/seat-1'));
  state = accepted(decideDoubleFollow(state, 'round-1/seat-1', choice as 'ADD' | 'NO_ADD'));
  state = accepted(game.advanceBehindTable(state));
  expect(game.getBackResults(state)[0]).toMatchObject({ outcome, grossReturnUnits: gross });
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll.available).toBe((choice === 'ADD' ? 1600 : 1800) + gross);
});
it('controller funding rejection creates no window, reserve or draw', () => {
  const dealt = doubleFixture();
  const state = { ...dealt, computers: dealt.computers.map((entry) => entry.seatNumber === 1
    ? { ...entry, bankroll: { available: 199, reserved: 200 } } : entry) };
  expect(beginControllerDouble(state, 'computer-1', 'round-1/seat-1')).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
  expect(state.followWindow).toBeNull();
  expect(state.table.game.shoe.inPlay).toHaveLength(4);
});
it('pending follower Natural cannot finance ADD; rejected addition creates no refundable exposure', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['A', '5', '9', 'K', '6', '8', '9'], [seat(1), seat(2)])));
  for (const target of [1, 2]) state = accepted(game.setBehindMainWager(state, target, 200));
  state = accepted(game.setBackWager(state, 1, 800));
  state = accepted(game.setBackWager(state, 2, 1000));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  expect(game.getBackResults(state)[0].grossReturnUnits).toBe(2000);
  expect(state.human!.bankroll.available).toBe(200);
  state = accepted(beginControllerDouble(state, 'computer-2', 'round-1/seat-2'));
  state = accepted(decideDoubleFollow(state, 'round-1/seat-2', 'ADD'));
  expect(state.human!.bankroll).toEqual({ available: 200, reserved: 1800 });
  expect(state.backExposures.map((entry) => entry.stakeUnits)).toEqual([800, 1000]);
  expect(state.followDecisions[0]).toMatchObject({ choice: 'NO_ADD', fundingError: 'INSUFFICIENT_FUNDS' });
});
