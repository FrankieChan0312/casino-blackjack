import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import * as optional from '../../src/domain/optionalGame.js';
import type { Rank } from '../../src/domain/card.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function deal(ranks: readonly Rank[], back = 200) {
  let state = accepted(game.openBehindBetting(behindFixture(ranks, [seat(1)])));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.setBackWager(state, 1, back));
  return accepted(game.closeBehindBetting(state, 'unused', noRandom));
}
it.each([
  { ranks: ['10', '9', '10', '8'], outcome: 'PLAYER_WIN', gross: 400 },
  { ranks: ['10', '10', '8', '9'], outcome: 'DEALER_WIN', gross: 0 },
  { ranks: ['10', '10', '8', '8'], outcome: 'PUSH', gross: 200 },
  { ranks: ['10', '9', '6', '8', 'K'], outcome: 'DEALER_WIN', gross: 0 },
  { ranks: ['10', '9', '5', '8', '5'], outcome: 'PLAYER_WIN', gross: 400 },
  { ranks: ['A', '9', 'K', '8'], outcome: 'PLAYER_BLACKJACK', gross: 500 },
  { ranks: ['A', 'K', 'K', 'A'], outcome: 'PUSH', gross: 200 },
])('tracks controller result $outcome with gross $gross', ({ ranks, outcome, gross }) => {
  let state = deal(ranks as Rank[]);
  if (state.table.game.round!.phase !== 'ROUND_COMPLETE') state = accepted(game.advanceBehindTable(state));
  expect(game.getBackResults(state)).toEqual([{ ...state.backExposures[0], roundId: 'round-1',
    outcome, grossReturnUnits: gross, netUnits: gross - 200, status: 'PENDING' }]);
  expect(state.human!.bankroll).toEqual({ available: 1800, reserved: 200 });
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll).toEqual({ available: 1800 + gross, reserved: 0 });
  expect(state.backResults[0].status).toBe('COMMITTED');
  expect(game.settleBehindWagers(state).state).toBe(state);
});
it('controller surrender follows without follower decision or reserve, using own half stake', () => {
  const state = deal(['8', '6', '8', '10'], 50);
  // Controlled domain fixture only: local COMPUTER policy never surrenders.
  // Execute the accepted M5 controller rule, without exposing it to the local follower API.
  const input = { ...state.table, bankrolls: state.computers.map((entry) => entry.bankroll),
    game: { ...state.table.game, round: { ...state.table.game.round!, players: state.table.game.round!.players
      .map((hand) => ({ ...hand, controller: 'HUMAN' as const })) } } };
  const surrendered = optional.surrenderOptionalHand(input, 1, input.game.round.currentHandId!);
  expect(surrendered.ok).toBe(true);
  const resolved = optional.resolveOptionalDealer(surrendered.state);
  expect(resolved.ok).toBe(true);
  const fixture = { ...state, table: { ...state.table, game: { ...resolved.state.game,
    round: { ...resolved.state.game.round!, players: resolved.state.game.round!.players
      .map((hand) => ({ ...hand, controller: 'COMPUTER' as const })) } } } };
  expect(fixture.human!.bankroll).toEqual({ available: 1950, reserved: 50 });
  expect(game.getBackResults(fixture)[0]).toMatchObject({ outcome: 'SURRENDERED', stakeUnits: 50,
    grossReturnUnits: 25, netUnits: -25 });
  expect(accepted(game.settleBehindWagers(fixture)).human!.bankroll.available).toBe(1975);
});
it('spectator and seated follower cannot control any target gameplay action', () => {
  const spectator = deal(['8', '6', '8', '10']);
  for (const action of ['HIT', 'STAND', 'DOUBLE', 'SPLIT', 'SURRENDER'] as const) {
    const result = game.actBehindHand(spectator, spectator.backWagers[0].handId, action);
    expect(result).toEqual({ ok: false, state: spectator, error: 'NOT_SEATED' });
  }
  let seated = accepted(game.openBehindBetting(behindFixture(['8', '8', '6', '8', '8', '10'], [seat(1, 'HUMAN'), seat(2)])));
  seated = accepted(game.setBehindMainWager(seated, 1, 200));
  seated = accepted(game.setBehindMainWager(seated, 2, 200));
  seated = accepted(game.setBackWager(seated, 2, 200));
  seated = accepted(game.closeBehindBetting(seated, 'unused', noRandom));
  for (const action of ['HIT', 'STAND', 'DOUBLE', 'SPLIT', 'SURRENDER'] as const) {
    expect(game.actBehindHand(seated, seated.backWagers[0].handId, action).ok).toBe(false);
    expect(game.actBehindHand(seated, seated.backWagers[0].handId, action).state).toBe(seated);
  }
});
it('multiple targets settle independently; pending Natural cannot finance own Double', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['8', 'A', '10', '9', '8', 'K', '8', '8'],
    [seat(1, 'HUMAN'), seat(2), seat(3)])));
  for (const target of [1, 2, 3]) state = accepted(game.setBehindMainWager(state, target, 200));
  state = accepted(game.setBackWager(state, 2, 1000));
  state = accepted(game.setBackWager(state, 3, 800));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  expect(game.getBackResults(state)[0]).toMatchObject({ targetSeat: 2, grossReturnUnits: 2500 });
  expect(state.human!.bankroll.available).toBe(0);
  expect(game.actBehindHand(state, state.table.game.round!.currentHandId!, 'DOUBLE')).toMatchObject({ ok: false, error: 'INSUFFICIENT_FUNDS' });
  expect(game.settleBehindWagers(state).state).toBe(state);
  state = accepted(game.actBehindHand(state, state.table.game.round!.currentHandId!, 'STAND'));
  state = accepted(game.advanceBehindTable(state));
  state = accepted(game.settleBehindWagers(state));
  expect(state.backResults.map((entry) => [entry.targetSeat, entry.stakeUnits, entry.grossReturnUnits])).toEqual([[2, 1000, 2500], [3, 800, 1600]]);
  expect(state.human!.bankroll).toEqual({ available: 4100, reserved: 0 });
  const next = accepted(game.prepareNextBehindRound(state));
  expect(next.human!.bankroll).toEqual({ available: 4100, reserved: 0 });
  expect(next.backWagers).toEqual([]);
  expect(next.backExposures).toEqual([]);
  expect(state.backResults).toHaveLength(2);
});
