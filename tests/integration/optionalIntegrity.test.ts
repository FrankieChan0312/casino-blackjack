import { afterEach, expect, it, vi } from 'vitest';
import * as g from '../../src/domain/optionalGame.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());
it('partial initial deal failure refunds every funded seat/side, including not-yet-dealt hands', () => {
  let state = optionalOpen(['8', '9', 'A', '8', '9', 'K'], [seat(1, 'HUMAN'), seat(2, 'COMPUTER')]);
  for (const number of [1, 2]) {
    state = accepted(g.setOptionalMainWager(state, number, 200));
    state = accepted(g.setSideWager(state, number, 'PAIR', 20));
  }
  const draw = shoe.drawCard;
  let calls = 0;
  vi.spyOn(shoe, 'drawCard').mockImplementation((input) => {
    if (++calls !== 2) return draw(input);
    return { ok: false, error: 'SHOE_EXHAUSTED_DURING_ROUND', shoe: { ...input, retired: true,
      available: [], discarded: [...input.discarded, ...input.available] } };
  });
  state = accepted(g.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.game.round!.phase).toBe('INTEGRITY_ERROR');
  expect(state.game.round!.players.map((entry) => entry.cards.length)).toEqual([1, 0]);
  expect(state.sideResults).toEqual([]);
  expectAccounting(state.game.shoe);
  state = accepted(g.voidOptionalRound(state));
  expect(state.wagerResults.map((entry) => entry.stakeUnits)).toEqual([200, 200, 20, 20]);
  expect(state.bankrolls.every((entry) => entry.available === 2000 && entry.reserved === 0)).toBe(true);
});
it('rejected Insurance adds no refundable exposure; next round resets choices and preserves balances/shoe lifecycle', () => {
  let state = accepted(g.setOptionalMainWager(fundedOpen(['8', 'A', '8', '6']), 1, 2000));
  state = accepted(g.closeOptionalBetting(state, 'unused', noRandom));
  expect(g.decideInsurance(state, 1, true).ok).toBe(false);
  state = accepted(g.decideInsurance(state, 1, false));
  state = { ...state, game: { ...state.game, shoe: { ...state.game.shoe,
    discarded: [...state.game.shoe.discarded, ...state.game.shoe.available], available: [] } } };
  state = accepted(g.hitOptionalHand(state, 1, state.game.round!.currentHandId!));
  const failed = state;
  state = accepted(g.voidOptionalRound(state));
  expect(state.wagerResults).toHaveLength(1);
  expect(state.wagerResults[0].stakeUnits).toBe(2000);
  expect(state.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
  state = accepted(g.prepareNextOptionalRound(state));
  expect(state.game.shoe).toBe(failed.game.shoe);
  expect(state.insuranceDecisions).toEqual([]);
  state = accepted(g.openOptionalBetting(state));
  state = accepted(g.setOptionalMainWager(state, 1, 200));
  state = accepted(g.closeOptionalBetting(state, 'replacement', { nextInt: (max) => max - 1 }));
  expect(state.game.shoe.shoeId).toBe('replacement');
  expect(state.roundNumber).toBe(2);
  expectAccounting(state.game.shoe);
});
