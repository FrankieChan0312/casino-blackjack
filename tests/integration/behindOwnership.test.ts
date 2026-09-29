import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

it('one stable seated HUMAN owns one bankroll, with explicit independent computer identities', () => {
  const state = behindFixture();
  expect(state.human).toEqual({ participantId: 'local-human', bankroll: { available: 2000, reserved: 0 } });
  expect(game.controlledSeat(state)).toBe(1);
  expect(game.controllerId(state, 1)).toBe('local-human');
  expect(game.controllerId(state, 2)).toBeNull();
  expect(state.table).not.toHaveProperty('bankrolls');
  const changed = accepted(game.configureBehindSeats(state, [seat(2, 'COMPUTER')]));
  expect(game.controllerId(changed, 2)).toBe('computer-2');
  expect(new Set(changed.computers.map((entry) => entry.participantId)).size).toBe(7);
  expect(changed.computers.every((entry) => entry.bankroll.available === 2000 && entry.bankroll.reserved === 0)).toBe(true);
});
it('spectator needs no seat, and a computer-only session has no HUMAN', () => {
  const spectator = behindFixture(undefined, [seat(3)]);
  expect(game.controlledSeat(spectator)).toBeNull();
  expect(spectator.human!.bankroll.available).toBe(2000);
  const computerOnly = behindFixture(undefined, [seat(3)], false);
  expect(computerOnly.human).toBeNull();
  expect(game.configureBehindSeats(computerOnly, [seat(2, 'HUMAN')])).toEqual({ ok: false,
    state: computerOnly, error: 'NO_HUMAN_PARTICIPANT' });
});
it('max one HUMAN; failed multi-seat update is unchanged', () => {
  const state = behindFixture();
  const before = structuredClone(state);
  expect(game.configureBehindSeats(state, [seat(2, 'HUMAN')])).toMatchObject({ ok: false, state });
  expect(game.configureBehindSeats(state, [seat(2, 'HUMAN')]).state).toBe(state);
  expect(state).toEqual(before);
});
it('earned HUMAN funds follow seat move, spectator interval and rejoining without duplication', () => {
  let state = accepted(game.openBehindBetting(behindFixture()));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  expect(state.human!.bankroll).toEqual({ available: 1800, reserved: 200 });
  expect(state.computers[0].bankroll).toEqual({ available: 2000, reserved: 0 });
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(game.actBehindHand(state, state.table.game.round!.currentHandId!, 'STAND'));
  state = accepted(game.advanceBehindTable(state));
  expect(state.human!.bankroll.available).toBe(1800);
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll).toEqual({ available: 2200, reserved: 0 });
  const archived = structuredClone(state);
  state = accepted(game.prepareNextBehindRound(state));
  state = accepted(game.configureBehindSeats(state, [seat(1, 'COMPUTER'), seat(4, 'HUMAN')]));
  expect(game.controlledSeat(state)).toBe(4);
  expect(state.human!.bankroll.available).toBe(2200);
  expect(game.controllerId(state, 1)).toBe('computer-1');
  state = accepted(game.configureBehindSeats(state, [{ seatNumber: 4, occupancy: 'EMPTY', sittingOut: false }]));
  expect(game.controlledSeat(state)).toBeNull();
  expect(state.human!.bankroll.available).toBe(2200);
  state = accepted(game.configureBehindSeats(state, [seat(6, 'HUMAN')]));
  state = accepted(game.openBehindBetting(state));
  state = accepted(game.setBehindMainWager(state, 6, 2000));
  expect(state.human).toEqual({ participantId: 'local-human', bankroll: { available: 200, reserved: 2000 } });
  expect(state.table).not.toHaveProperty('bankrolls');
  expect(state.computers.reduce((sum, entry) => sum + entry.bankroll.available + entry.bankroll.reserved, 0)).toBe(14000);
  expect(archived.human!.bankroll).toEqual({ available: 2200, reserved: 0 });
});
it('OPEN and active-round controller changes reject with every fund/card unchanged', () => {
  let state = accepted(game.openBehindBetting(behindFixture()));
  for (const phase of ['OPEN', 'CLOSED']) {
    if (phase === 'CLOSED') {
      state = accepted(game.setBehindMainWager(state, 1, 200));
      state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
    }
    const before = structuredClone(state);
    const result = game.configureBehindSeats(state,
      [{ seatNumber: 1, occupancy: 'EMPTY', sittingOut: false }, seat(2, 'HUMAN')]);
    expect(result.ok).toBe(false);
    expect(result.state).toBe(state);
    expect(state).toEqual(before);
  }
});
it('computer money persists when HUMAN occupies its seat and later leaves', () => {
  let state = accepted(game.openBehindBetting(behindFixture(undefined, [seat(1)])));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(game.advanceBehindTable(state));
  state = accepted(game.settleBehindWagers(state));
  expect(state.computers[0].bankroll.available).toBe(2200);
  state = accepted(game.prepareNextBehindRound(state));
  state = accepted(game.configureBehindSeats(state, [seat(1, 'HUMAN')]));
  expect(state.human!.bankroll.available).toBe(2000);
  state = accepted(game.configureBehindSeats(state, [seat(1)]));
  expect(state.computers[0].bankroll.available).toBe(2200);
});
it('M5 side/Insurance financial adapter settles participant funds exactly once', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['8', 'A', '8', 'K'])));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.setBehindSideWager(state, 1, 'PAIR', 20));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(game.decideBehindMainInsurance(state, true));
  expect(state.human!.bankroll).toEqual({ available: 1680, reserved: 320 });
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll).toEqual({ available: 2120, reserved: 0 });
  expect(game.settleBehindWagers(state).state).toBe(state);
  expect(game.voidBehindRound(state).state).toBe(state);
  expect(state.computers[0].bankroll.available).toBe(2000);
});
it('public view includes only local funds, ownership and redacted visible game', () => {
  let state = accepted(game.openBehindBetting(behindFixture()));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  const view = getPublicBehindView(state);
  expect(view.human).toEqual({ participantId: 'local-human', controlledSeat: 1, available: 1800, reserved: 200 });
  expect(view.round!.dealer.holeCard).toBeNull();
  const json = JSON.stringify(view);
  for (const secret of ['bankrolls', 'computers', 'cutPosition', 'originalCards', 'deckIndex', 'insuranceDecisions']) {
    expect(json).not.toContain(`"${secret}"`);
  }
});
