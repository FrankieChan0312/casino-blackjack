import { expect, it } from 'vitest';
import * as game from '../../src/domain/optionalGame.js';
import { createSixDeckInventory, type Rank } from '../../src/domain/card.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function deal(ranks: readonly Rank[], pair = 20, three = 20) {
  let state = fundedOpen(ranks);
  if (pair) state = accepted(game.setSideWager(state, 1, 'PAIR', pair));
  if (three) state = accepted(game.setSideWager(state, 1, 'THREE_CARD', three));
  return accepted(game.closeOptionalBetting(state, 'unused', noRandom));
}
function stand(state: game.OptionalGameState) {
  return accepted(game.standOptionalHand(state, 1, state.game.round!.currentHandId!));
}
function finish(state: game.OptionalGameState) {
  return accepted(game.resolveOptionalDealer(stand(state)));
}
function emptyShoe(state: game.OptionalGameState) {
  return { ...state, game: { ...state.game, shoe: { ...state.game.shoe, available: [],
    discarded: [...state.game.shoe.discarded, ...state.game.shoe.available] } } };
}
it('one commit: main loss plus mixed pair and trips independently win, exact attribution/gross/net', () => {
  const before = deal(['8', '8', '8', '10']);
  expect(game.getOptionalWagerResults(before).map((entry) => [entry.type, entry.grossReturnUnits]))
    .toEqual([['PAIR', 140], ['THREE_CARD', 620]]);
  expect(game.settleOptionalWagers(before).state).toBe(before);
  const complete = finish(before);
  expect(complete.bankrolls[0]).toEqual({ available: 1760, reserved: 240 });
  const final = accepted(game.settleOptionalWagers(complete));
  expect(final.bankrolls[0]).toEqual({ available: 2520, reserved: 0 });
  expect(final.wagerResults.map((entry) => [entry.type, entry.outcome, entry.stakeUnits, entry.grossReturnUnits, entry.netUnits]))
    .toEqual([['MAIN', 'DEALER_WIN', 200, 0, -200], ['PAIR', 'MIXED_PAIR', 20, 140, 120],
      ['THREE_CARD', 'THREE_OF_A_KIND', 20, 620, 600]]);
  expect(new Set(final.wagerResults.map((entry) => entry.wagerId)).size).toBe(3);
  expect(final.wagerResults.every((entry) => entry.roundId === 'round-1' && entry.seatNumber === 1
    && entry.status === 'COMMITTED' && Object.isFrozen(entry))).toBe(true);
  expect(game.settleOptionalWagers(final).state).toBe(final);
  expect(game.voidOptionalRound(final).state).toBe(final);
  expect(game.getOptionalWagerResults(final)).toBe(final.wagerResults);
});
it('winning side return and surrender stay pending until final commit', () => {
  const before = deal(['8', '8', '8', '10']);
  const surrendered = accepted(game.surrenderOptionalHand(before, 1, before.game.round!.currentHandId!));
  expect(surrendered.bankrolls[0].available).toBe(1760);
  const complete = accepted(game.resolveOptionalDealer(surrendered));
  expect(complete.game.round!.dealerCards).toHaveLength(2);
  const final = accepted(game.settleOptionalWagers(complete));
  expect(final.bankrolls[0].available).toBe(2620);
  expect(final.wagerResults[0]).toMatchObject({ outcome: 'SURRENDERED', grossReturnUnits: 100, netUnits: -100 });
});
it.each(['K', '6'] as const)('Insurance hole %s settles once at 3x or zero; main/side independent', (hole) => {
  let state = accepted(game.decideInsurance(deal(['8', 'A', '8', hole], 20, 0), 1, true));
  expect(state.bankrolls[0]).toEqual({ available: 1680, reserved: 320 });
  const insurance = game.getOptionalWagerResults(state).find((entry) => entry.type === 'INSURANCE')!;
  expect(insurance).toMatchObject({ stakeUnits: 100, grossReturnUnits: hole === 'K' ? 300 : 0, status: 'PENDING' });
  if (hole === '6') state = finish(state);
  const final = accepted(game.settleOptionalWagers(state));
  expect(final.bankrolls[0].available).toBe(hole === 'K' ? 2120 : 1820);
  expect(game.settleOptionalWagers(final).state).toBe(final);
});
it.each(['K', '6'] as const)('Even Money main hole %s returns exactly 400 with no extra wager', (hole) => {
  const state = accepted(game.electEvenMoney(deal(['A', 'A', 'K', hole], 0, 0), 1));
  const final = accepted(game.settleOptionalWagers(state));
  expect(final.bankrolls[0]).toEqual({ available: 2200, reserved: 0 });
  expect(final.wagerResults).toHaveLength(1);
  expect(game.getOptionalMainResults(final)[0]).toMatchObject({ outcome: 'EVEN_MONEY', grossReturnUnits: 400 });
});
it('split/double settle leaves while the original side wager remains fixed', () => {
  let state = deal(['8', '6', '8', '10', '3', '10', '2', '10'], 20, 0);
  state = accepted(game.splitOptionalHand(state, 1, state.game.round!.currentHandId!));
  state = accepted(game.doubleOptionalHand(state, 1, state.game.round!.currentHandId!));
  state = finish(state);
  expect(state.bankrolls[0]).toEqual({ available: 1380, reserved: 620 });
  const final = accepted(game.settleOptionalWagers(state));
  expect(final.wagerResults.map((entry) => [entry.type, entry.stakeUnits, entry.grossReturnUnits]))
    .toEqual([['MAIN', 400, 800], ['MAIN', 200, 400], ['PAIR', 20, 140]]);
  expect(final.bankrolls[0].available).toBe(2720);
});
it('pending large side proceeds cannot fund a Split/Double', () => {
  let state = accepted(game.setOptionalMainWager(optionalOpen(['8', '8', '8', '10']), 1, 1800));
  state = accepted(game.setSideWager(state, 1, 'THREE_CARD', 200));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(game.getOptionalWagerResults(state)[0].grossReturnUnits).toBe(6200);
  expect(state.bankrolls[0].available).toBe(0);
  for (const command of [game.splitOptionalHand, game.doubleOptionalHand]) {
    expect(command(state, 1, state.game.round!.currentHandId!)).toMatchObject({ ok: false, error: 'INSUFFICIENT_FUNDS' });
    expect(command(state, 1, state.game.round!.currentHandId!).state).toBe(state);
  }
});
it('VOID overrides side/Insurance and refunds actual split+double reserve once', () => {
  let state = accepted(game.decideInsurance(deal(['8', 'A', '8', '6', '3', '10', '2']), 1, true));
  state = accepted(game.splitOptionalHand(state, 1, state.game.round!.currentHandId!));
  state = accepted(game.doubleOptionalHand(state, 1, state.game.round!.currentHandId!));
  expect(state.bankrolls[0].reserved).toBe(740);
  state = accepted(game.hitOptionalHand(emptyShoe(state), 1, state.game.round!.currentHandId!));
  expect(state.game.round!.phase).toBe('INTEGRITY_ERROR');
  expect(game.getOptionalWagerResults(state)).toEqual([]);
  expect(state.sideResults).toEqual([]);
  expectAccounting(state.game.shoe);
  const refunded = accepted(game.voidOptionalRound(state));
  expect(refunded.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
  expect(refunded.wagerResults.map((entry) => entry.stakeUnits)).toEqual([400, 200, 20, 20, 100]);
  expect(refunded.wagerResults.every((entry) => entry.outcome === 'VOID' && entry.netUnits === 0
    && entry.grossReturnUnits === entry.stakeUnits && entry.status === 'REFUNDED')).toBe(true);
  expect(game.voidOptionalRound(refunded).state).toBe(refunded);
  expect(game.settleOptionalWagers(refunded).state).toBe(refunded);
});
it('VOID discards pending Even Money and all wagers across seats without hypothetical exposure', () => {
  let state = optionalOpen(['A', '8', 'A', 'K', '8', '6'], [seat(1, 'HUMAN'), seat(2, 'COMPUTER')]);
  for (const number of [1, 2]) state = accepted(game.setOptionalMainWager(state, number, 200));
  state = accepted(game.setSideWager(state, 1, 'PAIR', 20));
  expect(game.setSideWager(state, 1, 'THREE_CARD', 202).state).toBe(state);
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  state = accepted(game.electEvenMoney(state, 1));
  expect(game.getOptionalWagerResults(state)[0].outcome).toBe('EVEN_MONEY');
  state = accepted(game.advanceOptionalTable(emptyShoe(state)));
  const refunded = accepted(game.voidOptionalRound(state));
  expect(refunded.bankrolls.slice(0, 2)).toEqual([{ available: 2000, reserved: 0 }, { available: 2000, reserved: 0 }]);
  expect(refunded.wagerResults).toHaveLength(3);
  expect(refunded.wagerResults.every((entry) => entry.outcome === 'VOID')).toBe(true);
  expect(game.getOptionalMainResults(refunded).every((entry) => entry.outcome === 'VOID')).toBe(true);
  const next = accepted(game.prepareNextOptionalRound(refunded));
  expect(next.bankrolls).toBe(refunded.bankrolls);
  expect([next.sideWagers, next.insuranceDecisions, next.wagerResults]).toEqual([[], [], []]);
});
it('settlement reconciliation rejects malformed reserves atomically for the whole table', () => {
  let state = finish(deal(['8', '8', '8', '10']));
  state = { ...state, bankrolls: state.bankrolls.map((entry, i) => i === 0 ? { ...entry, reserved: 241 } : entry) };
  expect(game.settleOptionalWagers(state)).toMatchObject({ ok: false, error: 'INVALID_SETTLEMENT_FUNDS' });
  expect(game.settleOptionalWagers(state).state).toBe(state);
});
it('exact Perfect Pair and suited trips payout only their highest category', () => {
  let state = fundedOpen();
  const inventory = [...createSixDeckInventory()];
  const ids = ['1:clubs:Q', '2:clubs:Q', '3:clubs:Q', '1:hearts:10'];
  const top = ids.map((id) => inventory.splice(inventory.findIndex((card) => card.id === id), 1)[0]);
  state = { ...state, game: { ...state.game, shoe: { ...state.game.shoe, available: [...top, ...inventory] } } };
  for (const type of ['PAIR', 'THREE_CARD'] as const) state = accepted(game.setSideWager(state, 1, type, 20));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  const final = accepted(game.settleOptionalWagers(finish(state)));
  expect(final.wagerResults.map((entry) => entry.grossReturnUnits)).toEqual([200, 520, 2020]);
  expect(final.bankrolls[0].available).toBe(4500);
});
