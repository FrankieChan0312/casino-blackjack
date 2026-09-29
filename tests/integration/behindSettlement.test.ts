import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import { beginControllerDouble, decideDoubleFollow, beginControllerSplit, decideSplitFollow,
  standControllerHand } from '../../src/domain/behindController.js';
import { accepted, backedGame, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';

const root = 'round-1/seat-1';
function empty(state: game.BehindGameState): game.BehindGameState {
  const shoe = state.table.game.shoe;
  return { ...state, table: { ...state.table, game: { ...state.table.game,
    shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
}
it.each(['ADD', 'NO_ADD'] as const)('Split %s settles funded children independently, never parent/phantom child', (choice) => {
  let state = accepted(beginControllerSplit(backedGame(['8', '9', '8', '8', '10', '2']), 'computer-1', root));
  state = accepted(decideSplitFollow(state, root, choice));
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1`));
  state = accepted(standControllerHand(state, 'computer-1', `${root}.2`));
  state = accepted(game.advanceBehindTable(state));
  state = accepted(game.settleBehindWagers(state));
  expect(state.backResults.map((entry) => [entry.handId, entry.stakeUnits, entry.grossReturnUnits]))
    .toEqual(choice === 'ADD' ? [[`${root}.1`, 200, 400], [`${root}.2`, 200, 0]] : [[`${root}.1`, 200, 400]]);
  expect(state.human!.bankroll.available).toBe(choice === 'ADD' ? 2000 : 2200);
  expect(state.computers[0].bankroll.available).toBe(2000);
  expect(game.settleBehindWagers(state).state).toBe(state);
  expect(game.voidBehindRound(state).state).toBe(state);
});
it('re-split ADD and NO_ADD settle only three actual descendant exposures', () => {
  let state = accepted(beginControllerSplit(backedGame(['8', '9', '8', '8', '8', '10', '2', '9']), 'computer-1', root));
  state = accepted(decideSplitFollow(state, root, 'ADD'));
  state = accepted(beginControllerSplit(state, 'computer-1', `${root}.1`));
  state = accepted(decideSplitFollow(state, `${root}.1`, 'ADD'));
  for (const path of ['.1.1', '.1.2', '.2']) state = accepted(standControllerHand(state, 'computer-1', root + path));
  state = accepted(game.advanceBehindTable(state));
  state = accepted(game.settleBehindWagers(state));
  expect(state.backResults.map((entry) => [entry.handId, entry.grossReturnUnits])).toEqual([[`${root}.1.1`, 400], [`${root}.1.2`, 0], [`${root}.2`, 200]]);
  expect(state.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
});
it.each(['ADD', 'NO_ADD'] as const)('Double fault %s refunds actual reserve once with no ordinary payout', (choice) => {
  let state = accepted(beginControllerDouble(empty(backedGame(['5', '9', '6', '8'])), 'computer-1', root));
  state = accepted(decideDoubleFollow(state, root, choice));
  expect(state.table.game.round!.phase).toBe('INTEGRITY_ERROR');
  expect(game.getBackResults(state)).toEqual([]);
  const refund = accepted(game.voidBehindRound(state));
  expect(refund.backResults[0]).toMatchObject({ stakeUnits: choice === 'ADD' ? 400 : 200,
    grossReturnUnits: choice === 'ADD' ? 400 : 200, netUnits: 0, status: 'REFUNDED', outcome: 'VOID' });
  expect(refund.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(refund.computers[0].bankroll.available).toBe(2000);
  expect(game.voidBehindRound(refund).state).toBe(refund);
  expect(game.settleBehindWagers(refund).state).toBe(refund);
  expectAccounting(refund.table.game.shoe);
});
it('rejected ADD never creates a hypothetical refund', () => {
  let state = accepted(beginControllerDouble(empty(backedGame(['5', '9', '6', '8'], 1200)), 'computer-1', root));
  state = accepted(decideDoubleFollow(state, root, 'ADD'));
  expect(state.human!.bankroll.reserved).toBe(1200);
  state = accepted(game.voidBehindRound(state));
  expect(state.backResults[0].grossReturnUnits).toBe(1200);
  expect(state.human!.bankroll.available).toBe(2000);
});
it('Split/Re-split additions and Insurance refund together after required child draw fault', () => {
  let state = accepted(game.decideBackInsurance(backedGame(['8', 'A', '8', '6', '8']), 1, 'INSURANCE'));
  state = accepted(beginControllerSplit(state, 'computer-1', root));
  state = accepted(decideSplitFollow(state, root, 'ADD'));
  state = accepted(beginControllerSplit(empty(state), 'computer-1', `${root}.1`));
  state = accepted(decideSplitFollow(state, `${root}.1`, 'ADD'));
  expect(state.human!.bankroll).toEqual({ available: 1300, reserved: 700 });
  expect(state.backInsurance[0].outcome).toBeUndefined();
  state = accepted(game.voidBehindRound(state));
  expect(state.backResults.map((entry) => entry.stakeUnits)).toEqual([200, 200, 200, 100]);
  expect(state.backResults.every((entry) => entry.outcome === 'VOID' && entry.netUnits === 0)).toBe(true);
  expect(state.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(state.computers[0].bankroll.available).toBe(2000);
});
it('VOID clears pending Even Money and original back results across multiple targets', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['A', '5', 'A', 'K', '6', '6'], [seat(1), seat(2)])));
  for (const target of [1, 2]) {
    state = accepted(game.setBehindMainWager(state, target, 200));
    state = accepted(game.setBackWager(state, target, 200));
  }
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(game.decideBackInsurance(state, 1, 'EVEN_MONEY'));
  state = accepted(game.decideBackInsurance(state, 2, 'DECLINE'));
  expect(game.getBackResults(state)[0]).toMatchObject({ outcome: 'EVEN_MONEY', grossReturnUnits: 400 });
  expect(state.human!.bankroll.available).toBe(1600);
  state = accepted(game.advanceBehindTable(empty(state)));
  expect(game.getBackResults(state)).toEqual([]);
  state = accepted(game.voidBehindRound(state));
  expect(state.backResults.map((entry) => [entry.targetSeat, entry.grossReturnUnits, entry.outcome])).toEqual([[1, 200, 'VOID'], [2, 200, 'VOID']]);
  expect(state.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
});
it('invalid follower reservation prevents the entire table settlement atomically', () => {
  let state = accepted(game.advanceBehindTable(backedGame(['10', '9', '10', '8'])));
  state = { ...state, human: { ...state.human!, bankroll: { available: 1800, reserved: 199 } } };
  const before = structuredClone(state);
  expect(game.settleBehindWagers(state)).toEqual({ ok: false, state, error: 'INVALID_BACK_SETTLEMENT' });
  expect(state).toEqual(before);
  expect(state.computers[0].bankroll).toEqual({ available: 1800, reserved: 200 });
});
