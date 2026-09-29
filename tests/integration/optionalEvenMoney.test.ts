import { expect, it } from 'vitest';
import type { Rank } from '../../src/domain/card.js';
import * as game from '../../src/domain/optionalGame.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function natural(hole: Rank, up: Rank = 'A') {
  return accepted(game.closeOptionalBetting(fundedOpen(['A', up, 'K', hole]), 'unused', noRandom));
}
it.each(['K', '6'] as const)('Even Money locks 1:1 against hole %s, without any reserve or stacked Natural', (hole) => {
  const before = natural(hole);
  const state = accepted(game.electEvenMoney(before, 1));
  expect(state.bankrolls).toBe(before.bankrolls);
  expect(state.insuranceDecisions).toEqual([{ seatNumber: 1, choice: 'EVEN_MONEY', stakeUnits: 0 }]);
  expect(game.getOptionalMainResults(state)).toHaveLength(1);
  expect(game.getOptionalMainResults(state)[0]).toMatchObject({ outcome: 'EVEN_MONEY', stakeUnits: 200,
    grossReturnUnits: 400, netUnits: 200, status: 'PENDING' });
  expect(state.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
  expect(game.decideInsurance(state, 1, true).state).toBe(state);
  expect(game.decideInsurance(state, 1, false).state).toBe(state);
  expect(game.electEvenMoney(state, 1).state).toBe(state);
});
it('Even Money needs no available funds', () => {
  let state = accepted(game.setOptionalMainWager(optionalOpen(['A', 'A', 'K', '6']), 1, 2000));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  state = accepted(game.electEvenMoney(state, 1));
  expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
  expect(game.getOptionalMainResults(state)[0].grossReturnUnits).toBe(4000);
});
it('Insurance excludes Even Money; decline closes the decision irreversibly', () => {
  const insured = accepted(game.decideInsurance(natural('6'), 1, true));
  expect(game.electEvenMoney(insured, 1)).toMatchObject({ ok: false, state: insured });
  expect(game.getOptionalMainResults(insured)[0].grossReturnUnits).toBe(500);
  const declined = accepted(game.decideInsurance(natural('6'), 1, false));
  expect(game.electEvenMoney(declined, 1).ok).toBe(false);
  expect(game.getOptionalMainResults(declined)[0]).toMatchObject({ outcome: 'PLAYER_BLACKJACK', grossReturnUnits: 500 });
});
it('unconverted Natural pushes dealer Natural and wins 3:2 after negative peek', () => {
  expect(game.getOptionalMainResults(accepted(game.decideInsurance(natural('K'), 1, false)))[0])
    .toMatchObject({ outcome: 'PUSH', grossReturnUnits: 200 });
  expect(game.getOptionalMainResults(accepted(game.decideInsurance(natural('6'), 1, false)))[0])
    .toMatchObject({ outcome: 'PLAYER_BLACKJACK', grossReturnUnits: 500 });
});
it('non-Natural rejects without closing Insurance; non-Ace and after-peek reject', () => {
  const ordinary = accepted(game.closeOptionalBetting(fundedOpen(['8', 'A', '8', '6']), 'unused', noRandom));
  expect(game.electEvenMoney(ordinary, 1).ok).toBe(false);
  expect(game.electEvenMoney(ordinary, 1).state).toBe(ordinary);
  expect(ordinary.decisionPhase).toBe('INSURANCE');
  expect(game.electEvenMoney(natural('6', '10'), 1).ok).toBe(false);
  expect(game.electEvenMoney(natural('6', '9'), 1).ok).toBe(false);
});
it('dealer Natural ends all gameplay and preserves independent original side result', () => {
  let state = accepted(game.setSideWager(fundedOpen(['A', 'A', 'K', 'K']), 1, 'THREE_CARD', 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  const side = state.sideResults;
  state = accepted(game.electEvenMoney(state, 1));
  expect(state.sideResults).toBe(side);
  expect(state.game.round!.phase).toBe('ROUND_COMPLETE');
  for (const command of [game.hitOptionalHand, game.standOptionalHand, game.doubleOptionalHand,
    game.splitOptionalHand, game.surrenderOptionalHand]) {
    expect(command(state, 1, state.game.round!.players[0].handId).ok).toBe(false);
    expect(command(state, 1, state.game.round!.players[0].handId).state).toBe(state);
  }
});
it('computer declines Even Money while a human ordinary hand retains late surrender', () => {
  let state = optionalOpen(['A', '8', 'A', 'K', '8', '6'], [seat(1, 'COMPUTER'), seat(2, 'HUMAN')]);
  for (const number of [1, 2]) state = accepted(game.setOptionalMainWager(state, number, 200));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(game.electEvenMoney(state, 1).ok).toBe(false);
  state = accepted(game.decideInsurance(state, 2, true));
  expect(state.insuranceDecisions[0].choice).toBe('DECLINE');
  expect(game.getOptionalMainResults(state)[0].grossReturnUnits).toBe(500);
  expect(game.surrenderOptionalHand(state, 2, state.game.round!.currentHandId!).ok).toBe(true);
});
