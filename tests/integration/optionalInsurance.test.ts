import { expect, it } from 'vitest';
import * as game from '../../src/domain/optionalGame.js';
import { getPublicOptionalView } from '../../src/domain/optionalPublicView.js';
import type { Rank } from '../../src/domain/card.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function deal(ranks: readonly Rank[] = ['8', 'A', '8', 'K']) {
  return accepted(game.closeOptionalBetting(fundedOpen(ranks), 'unused', noRandom));
}
it('Ace waits before peek even on dealer Natural; no main result, hole or hand action', () => {
  const state = deal();
  expect(state.decisionPhase).toBe('INSURANCE');
  expect(state.peekPerformed).toBe(false);
  expect(state.game.round!.dealerNaturalExcluded).toBe(false);
  expect(state.game.round!.players[0].outcome).toBeUndefined();
  expect(state.game.round!.currentHandId).toBeNull();
  const publicView = getPublicOptionalView(state);
  expect(publicView.round!.phase).toBe('INSURANCE');
  expect(publicView.round!.dealer.holeCard).toBeNull();
  expect(publicView.round!.dealer.visibleCards).toHaveLength(1);
  for (const command of [game.hitOptionalHand, game.standOptionalHand, game.doubleOptionalHand,
    game.splitOptionalHand, game.surrenderOptionalHand]) {
    expect(command(state, 1, state.game.round!.players[0].handId).state).toBe(state);
    expect(command(state, 1, state.game.round!.players[0].handId).ok).toBe(false);
  }
  expect(game.advanceOptionalTable(state).state).toBe(state);
});
it('purchase reserves exact half; dealer Natural wins pending and resolves ordinary main loss', () => {
  const before = deal();
  const state = accepted(game.decideInsurance(before, 1, true));
  expect(state.insuranceDecisions).toEqual([{ seatNumber: 1, choice: 'INSURANCE', stakeUnits: 100, outcome: 'WIN' }]);
  expect(state.bankrolls[0]).toEqual({ available: 1700, reserved: 300 });
  expect(state.peekPerformed).toBe(true);
  expect(state.decisionPhase).toBe('NONE');
  expect(state.game.round!.phase).toBe('ROUND_COMPLETE');
  expect(state.game.round!.players[0].outcome).toBe('DEALER_WIN');
  expect(game.decideInsurance(state, 1, true)).toMatchObject({ ok: false, state });
});
it('decline consumes no funds/cards or player decision; negative peek keeps hole secret and permits surrender', () => {
  const before = deal(['8', 'A', '8', '6']);
  const state = accepted(game.decideInsurance(before, 1, false));
  expect(state.bankrolls).toEqual(before.bankrolls);
  expect(state.game.shoe).toBe(before.game.shoe);
  expect(state.game.round!.players[0].decisionTaken).toBe(false);
  expect(state.game.round!.dealerNaturalExcluded).toBe(true);
  expect(getPublicOptionalView(state).round!.dealer.holeCard).toBeNull();
  expect(game.surrenderOptionalHand(state, 1, state.game.round!.currentHandId!).ok).toBe(true);
  expect(game.decideInsurance(state, 1, true).state).toBe(state);
});
it('odd-unit half of 50 is 25, exact funds suffice, insufficient stays atomically pending', () => {
  let state = accepted(game.setOptionalMainWager(optionalOpen(['8', 'A', '8', '6']), 1, 50));
  state = { ...state, bankrolls: state.bankrolls.map((entry, i) => i === 0 ? { ...entry, available: 24 } : entry) };
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  const before = structuredClone(state);
  expect(game.decideInsurance(state, 1, true)).toMatchObject({ ok: false, error: 'INSUFFICIENT_FUNDS' });
  expect(game.decideInsurance(state, 1, true).state).toBe(state);
  expect(state).toEqual(before);
  state = { ...state, bankrolls: state.bankrolls.map((entry, i) => i === 0 ? { ...entry, available: 25 } : entry) };
  state = accepted(game.decideInsurance(state, 1, true));
  expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 75 });
  expect(state.insuranceDecisions[0]).toMatchObject({ stakeUnits: 25, outcome: 'LOSS' });
  expect(game.surrenderOptionalHand(state, 1, state.game.round!.currentHandId!).ok).toBe(true);
});
it('computers decline automatically but automation pauses for human decision', () => {
  let state = optionalOpen(['8', '9', 'A', '8', '9', '6'], [seat(1, 'COMPUTER'), seat(2, 'HUMAN')]);
  state = accepted(game.setOptionalMainWager(state, 1, 200));
  state = accepted(game.setOptionalMainWager(state, 2, 200));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.insuranceDecisions.map((entry) => entry.choice)).toEqual(['DECLINE', 'PENDING']);
  expect(state.peekPerformed).toBe(false);
  expect(game.advanceOptionalTable(state).state).toBe(state);
  expect(game.decideInsurance(state, 1, true).ok).toBe(false);
  const decided = accepted(game.decideInsurance(state, 2, false));
  expect(decided.peekPerformed).toBe(true);
  expect(decided.game.shoe).toBe(state.game.shoe);
});
it('computer-only Ace window closes deterministically with no Insurance reserve', () => {
  let state = optionalOpen(['9', 'A', '9', '6'], [seat(1, 'COMPUTER')]);
  state = accepted(game.setOptionalMainWager(state, 1, 200));
  state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
  expect(state.decisionPhase).toBe('NONE');
  expect(state.peekPerformed).toBe(true);
  expect(state.insuranceDecisions[0].choice).toBe('DECLINE');
  expect(state.bankrolls[0].reserved).toBe(200);
});
it.each(['10', 'J', 'Q', 'K'] as const)('%s peeks immediately with no window', (rank) => {
  const state = deal(['8', rank, '8', 'A']);
  expect(state.peekPerformed).toBe(true);
  expect(state.insuranceDecisions).toEqual([]);
  expect(state.game.round!.phase).toBe('ROUND_COMPLETE');
  expect(game.decideInsurance(state, 1, true).ok).toBe(false);
});
it.each(['2', '3', '4', '5', '6', '7', '8', '9'] as const)('%s needs no peek/window', (rank) => {
  const state = deal(['8', rank, '8', 'A']);
  expect(state.peekPerformed).toBe(false);
  expect(state.decisionPhase).toBe('NONE');
  expect(state.game.round!.dealerNaturalExcluded).toBe(true);
  expect(game.decideInsurance(state, 1, true).ok).toBe(false);
});
it('negative peek Insurance remains LOSS after later dealer three-card 21', () => {
  let state = accepted(game.decideInsurance(deal(['10', 'A', '9', '2', '8']), 1, true));
  expect(state.insuranceDecisions[0].outcome).toBe('LOSS');
  state = accepted(game.standOptionalHand(state, 1, state.game.round!.currentHandId!));
  state = accepted(game.resolveOptionalDealer(state));
  expect(state.game.round!.dealerCards.map((card) => card.rank)).toEqual(['A', '2', '8']);
  expect(state.insuranceDecisions[0].outcome).toBe('LOSS');
  expect(state.bankrolls[0]).toEqual({ available: 1700, reserved: 300 });
});
