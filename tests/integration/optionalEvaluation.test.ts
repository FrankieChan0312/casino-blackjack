import { expect, it } from 'vitest';
import * as game from '../../src/domain/optionalGame.js';
import * as advanced from '../../src/domain/advancedGame.js';
import { accepted, fundedOpen } from '../helpers/optionalFixture.js';
import { noRandom } from '../helpers/tableFixture.js';

it('evaluates only original cards once; pending does not alter available and draws no extra card', () => {
  let state = accepted(game.setSideWager(fundedOpen(['8', '9', '8', '7', '10']), 1, 'PAIR', 20));
  state = accepted(game.setSideWager(state, 1, 'THREE_CARD', 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.game.shoe.available).toHaveLength(308);
  expect(state.bankrolls[0]).toEqual({ available: 1760, reserved: 240 });
  expect(state.sideResults.map((entry) => [entry.category, entry.grossReturnUnits, entry.status]))
    .toEqual([['MIXED_PAIR', 140, 'PENDING'], ['NONE', 0, 'PENDING']]);
  expect(Object.isFrozen(state.sideResults)).toBe(true);
  const results = state.sideResults;
  const hit = advanced.hitAdvancedHand(state, 1, state.game.round!.currentHandId!);
  expect(hit.ok).toBe(true);
  expect(hit.state.game.round!.players[0].outcome).toBe('DEALER_WIN');
  expect(state.sideResults).toBe(results);
  expect(hit.state.bankrolls[0]).toEqual({ available: 1760, reserved: 240 });
});
it.each(['SPLIT', 'DOUBLE'] as const)('%s cannot increase/duplicate original side stakes/results', (action) => {
  let state = accepted(game.setSideWager(fundedOpen(['8', '6', '8', '10', '2', '3']), 1, 'PAIR', 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  const command = action === 'SPLIT' ? advanced.splitAdvancedHand : advanced.doubleAdvancedHand;
  const result = command(state, 1, state.game.round!.currentHandId!);
  expect(result.ok).toBe(true);
  expect(result.state).toHaveProperty('sideWagers', [{ seatNumber: 1, type: 'PAIR', stakeUnits: 20 }]);
  expect(result.state).toHaveProperty('sideResults', state.sideResults);
});
it('three-card uses dealer upcard, never hole card or subsequent dealer draws', () => {
  let state = accepted(game.setSideWager(fundedOpen(['Q', 'A', 'K', '2', '8']), 1, 'THREE_CARD', 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.sideResults[0]).toMatchObject({ category: 'STRAIGHT', grossReturnUnits: 220 });
  const stood = advanced.standAdvancedHand(state, 1, state.game.round!.currentHandId!);
  const completed = advanced.resolveAdvancedDealer(stood.state);
  expect(completed.ok).toBe(true);
  expect(completed.state.game.round!.dealerCards).toHaveLength(3);
  expect(completed.state).toHaveProperty('sideResults', state.sideResults);
});
it('dealer Natural does not suppress initial pair win', () => {
  let state = accepted(game.setSideWager(fundedOpen(['8', 'A', '8', 'K']), 1, 'PAIR', 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.game.round!.players[0].outcome).toBe('DEALER_WIN');
  expect(state.sideResults[0]).toMatchObject({ category: 'MIXED_PAIR', grossReturnUnits: 140 });
  expect(state.bankrolls[0].available).toBe(1780);
});
