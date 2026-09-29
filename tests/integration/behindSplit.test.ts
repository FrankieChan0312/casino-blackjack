import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import { beginControllerSplit, decideSplitFollow, standControllerHand,
  beginControllerDouble, decideDoubleFollow } from '../../src/domain/behindController.js';
import { accepted, backedGame } from '../helpers/behindFixture.js';

const root = 'round-1/seat-1';
function split(state: game.BehindGameState, choice: 'ADD' | 'NO_ADD', hand = root) {
  return accepted(decideSplitFollow(accepted(beginControllerSplit(state, 'computer-1', hand)), hand, choice));
}
it.each(['ADD', 'NO_ADD'] as const)('Split %s reserves controller before decision, preserves physical first-child order', (choice) => {
  const before = backedGame(['8', '9', '8', '8', '2', '3']);
  const originals = before.table.game.round!.players[0].cards;
  let state = accepted(beginControllerSplit(before, 'computer-1', root));
  expect(state.table.game.shoe).toBe(before.table.game.shoe);
  expect(state.table.game.round!.players.map((hand) => hand.cards)).toEqual([[originals[0]], [originals[1]]]);
  expect(state.computers[0].bankroll).toEqual({ available: 1600, reserved: 400 });
  expect(state.human!.bankroll).toEqual({ available: 1800, reserved: 200 });
  expect(game.advanceBehindTable(state).state).toBe(state);
  state = accepted(decideSplitFollow(state, root, choice));
  expect(state.table.game.shoe.inPlay).toHaveLength(5);
  expect(state.table.game.round!.players[0].cards[0]).toBe(originals[0]);
  expect(state.table.game.round!.players[1].cards).toEqual([originals[1]]);
  expect(state.backExposures.map((entry) => [entry.handId, entry.stakeUnits, entry.parentHandId]))
    .toEqual(choice === 'ADD' ? [[`${root}.1`, 200, root], [`${root}.2`, 200, root]] : [[`${root}.1`, 200, root]]);
  expect(state.human!.bankroll.reserved).toBe(choice === 'ADD' ? 400 : 200);
  expect(decideSplitFollow(state, root, 'ADD').state).toBe(state);
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1`));
  expect(state.table.game.round!.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['8', '2'], ['8', '3']]);
});
it('Split exact funds ADD, insufficient fallback and follower cannot request Split', () => {
  for (const stake of [1000, 1200]) {
    const before = backedGame(['8', '9', '8', '8', '2'], stake);
    expect(beginControllerSplit(before, 'local-human', root)).toEqual({ ok: false, state: before, error: 'NOT_CONTROLLER' });
    const state = split(before, 'ADD');
    expect(state.computers[0].bankroll.reserved).toBe(400);
    expect(state.table.game.round!.players).toHaveLength(2);
    expect(state.human!.bankroll).toEqual(stake === 1000 ? { available: 0, reserved: 2000 } : { available: 800, reserved: 1200 });
    expect(state.backExposures.map((entry) => entry.stakeUnits)).toEqual(stake === 1000 ? [1000, 1000] : [1200]);
    if (stake === 1200) expect(state.followDecisions[0].fundingError).toBe('INSUFFICIENT_FUNDS');
  }
});
it.each(['ADD', 'NO_ADD'] as const)('tracked descendant re-split %s creates fresh pre-card decision and depth-first leaves', (choice) => {
  let state = split(backedGame(['8', '9', '8', '8', '8', '2', '3', '4']), 'ADD');
  const before = state;
  state = accepted(beginControllerSplit(state, 'computer-1', `${root}.1`));
  expect(state.followWindow).toMatchObject({ kind: 'SPLIT', handId: `${root}.1` });
  expect(state.table.game.shoe).toBe(before.table.game.shoe);
  expect(state.table.game.round!.players.map((hand) => hand.cards.length)).toEqual([1, 1, 1]);
  state = accepted(decideSplitFollow(state, `${root}.1`, choice));
  expect(state.backExposures.map((entry) => entry.handId)).toEqual(choice === 'ADD'
    ? [`${root}.1.1`, `${root}.1.2`, `${root}.2`] : [`${root}.1.1`, `${root}.2`]);
  expect(state.table.game.round!.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['8', '2'], ['8'], ['8']]);
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1.1`));
  expect(state.table.game.round!.players[1].cards.map((card) => card.rank)).toEqual(['8', '3']);
  expect(state.table.game.round!.players[2].cards).toHaveLength(1);
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1.2`));
  expect(state.table.game.round!.players[2].cards.map((card) => card.rank)).toEqual(['8', '4']);
});
it('untracked second child re-splits without follow window or phantom exposure', () => {
  let state = split(backedGame(['8', '9', '8', '8', '2', '8', '3']), 'NO_ADD');
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1`));
  state = accepted(beginControllerSplit(state, 'computer-1', `${root}.2`));
  expect(state.followWindow).toBeNull();
  expect(state.backExposures.map((entry) => entry.handId)).toEqual([`${root}.1`]);
  expect(state.table.game.round!.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['8', '2'], ['8', '3'], ['8']]);
  expect(state.human!.bankroll).toEqual({ available: 1800, reserved: 200 });
});
it('four-leaf cap counts finished leaves; follower money cannot buy a fifth hand', () => {
  let state = split(backedGame(['8', '9', '8', '8', '8', '8', '2', '8']), 'ADD');
  state = split(state, 'ADD', `${root}.1`);
  state = split(state, 'ADD', `${root}.1.1`);
  state = accepted(standControllerHand(state, 'computer-1', `${root}.1.1.1`));
  expect(state.table.game.round!.players).toHaveLength(4);
  expect(state.human!.bankroll.available).toBe(1200);
  expect(beginControllerSplit(state, 'computer-1', `${root}.1.1.2`)).toEqual({ ok: false, state, error: 'HAND_LIMIT_REACHED' });
  expect(state.computers[0].bankroll).toEqual({ available: 1200, reserved: 800 });
});
it.each(['ADD', 'NO_ADD'] as const)('Split Aces %s receives one card each and never a Natural or further action', (choice) => {
  const state = split(backedGame(['A', '9', 'A', '8', 'K', 'A']), choice);
  expect(state.table.game.round!.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['A', 'K'], ['A', 'A']]);
  expect(state.table.game.round!.players.every((hand) => hand.complete && hand.splitAces && !hand.outcome)).toBe(true);
  expect(beginControllerSplit(state, 'computer-1', `${root}.2`).ok).toBe(false);
  expect(beginControllerDouble(state, 'computer-1', `${root}.1`).ok).toBe(false);
  const finished = accepted(game.advanceBehindTable(state));
  expect(game.getBackResults(finished).map((entry) => [entry.handId, entry.grossReturnUnits]))
    .toEqual(choice === 'ADD' ? [[`${root}.1`, 400], [`${root}.2`, 0]] : [[`${root}.1`, 400]]);
});
it('Double after Split resumes the later child only after Double follow closes', () => {
  let state = split(backedGame(['8', '9', '8', '8', '3', '9', '2']), 'ADD');
  state = accepted(beginControllerDouble(state, 'computer-1', `${root}.1`));
  expect(state.table.game.round!.players.map((hand) => hand.cards.length)).toEqual([2, 1]);
  state = accepted(decideDoubleFollow(state, `${root}.1`, 'NO_ADD'));
  expect(state.table.game.round!.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['8', '3', '9'], ['8', '2']]);
  expect(state.backExposures.map((entry) => entry.stakeUnits)).toEqual([200, 200]);
});
