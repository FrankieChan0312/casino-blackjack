import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as a from '../../src/domain/advancedGame.js';
import type { Rank } from '../../src/domain/card.js';
import { getPublicAdvancedView } from '../../src/domain/advancedPublicView.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedTable, currentId, freezeDeep, withAvailable } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

// Executable acceptance mapping: every contract ID registers its own real scenario.
// Related IDs deliberately share a scenario with all relevant independent assertions.
const mappedIds: number[] = [];
function regression(ids: readonly number[], name: string, run: () => void) {
  for (const id of ids) {
    mappedIds.push(id);
    it(`REG-M4-${String(id).padStart(3, '0')}: ${name}`, run);
  }
}
const split = (state: a.AdvancedGameState) => accepted(a.splitAdvancedHand(state, 1, currentId(state)));
const stand = (state: a.AdvancedGameState) => accepted(a.standAdvancedHand(state, 1, currentId(state)));
const double = (state: a.AdvancedGameState) => accepted(a.doubleAdvancedHand(state, 1, currentId(state)));
const pay = (state: a.AdvancedGameState) => accepted(a.settleAdvancedWagers(accepted(a.advanceAdvancedTable(state))));

function rejected(state: a.AdvancedGameState, command: () => a.AdvancedResult, error?: string) {
  const before = structuredClone(state);
  freezeDeep(state);
  const draw = vi.spyOn(shoe, 'drawCard');
  const result = command();
  expect(result.ok).toBe(false);
  expect(result.state).toBe(state);
  if (error) expect(result).toMatchObject({ error });
  expect(state).toEqual(before);
  expect(draw).not.toHaveBeenCalled();
  expect(Math.random).not.toHaveBeenCalled();
}
function exhausted(state: a.AdvancedGameState): a.AdvancedGameState {
  return { ...state, game: { ...state.game, shoe: { ...state.game.shoe,
    available: [], discarded: [...state.game.shoe.discarded, ...state.game.shoe.available] } } };
}
function assertVoid(failed: a.AdvancedGameState, stake: number) {
  expect(failed.game.round?.phase).toBe('INTEGRITY_ERROR');
  expect(failed.game.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(failed.game.shoe.retired).toBe(true);
  expect(failed.game.shoe.shoeId).toBe('fixture');
  expect(failed.game.shoe.available).toHaveLength(0);
  expect(failed.game.round?.players.every((hand) => hand.outcome === undefined)).toBe(true);
  expect(a.getAdvancedResults(failed)).toEqual([]);
  expect(failed.bankrolls[0].reserved).toBe(stake);
  const refunded = accepted(a.voidAdvancedRound(failed));
  expect(refunded.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
  expect(refunded.results.reduce((sum, entry) => sum + entry.grossReturnUnits, 0)).toBe(stake);
  expect(refunded.results.every((entry) => entry.outcome === 'VOID' && entry.status === 'REFUNDED' && entry.netUnits === 0)).toBe(true);
  expect(refunded.game).toBe(failed.game);
  expect(a.voidAdvancedRound(refunded).state).toBe(refunded);
  expect(a.voidAdvancedRound(refunded).ok).toBe(false);
  expect(a.settleAdvancedWagers(refunded).ok).toBe(false);
  expectAccounting(refunded.game.shoe);
}

describe('M4 executable 60-case regression map', () => {
  regression([1, 6, 7, 8], 'original Double: one card, doubled stake and ordinary win', () => {
    const start = advancedTable(['5', '10', '6', '7', '10']);
    const next = double(start);
    expect(next.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['5', '6', '10']);
    expect(next.game.shoe.available.length).toBe(start.game.shoe.available.length - 1);
    expect(next.game.round?.players[0]).toMatchObject({ complete: true, stakeUnits: 400 });
    expect(next.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
    const paid = pay(next);
    expect(paid.results[0]).toMatchObject({ outcome: 'PLAYER_WIN', grossReturnUnits: 800, netUnits: 400 });
    expect(paid.bankrolls[0].available).toBe(2400);
  });
  regression([2], 'Double exact funds', () => {
    const state = advancedTable(['5', '10', '6', '7', '10'], [seat(1, 'HUMAN')], [1000]);
    expect(double(state).bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
  });
  regression([3, 51], 'Double shortfall is completely atomic', () => {
    const state = withAvailable(advancedTable(['5', '10', '6', '7']), 199);
    rejected(state, () => a.doubleAdvancedHand(state, 1, currentId(state)), 'INSUFFICIENT_FUNDS');
  });
  regression([4], 'Double after Hit rejects', () => {
    const start = advancedTable(['2', '10', '3', '7', '2']);
    const state = accepted(a.hitAdvancedHand(start, 1, currentId(start)));
    rejected(state, () => a.doubleAdvancedHand(state, 1, currentId(state)), 'DOUBLE_NOT_ALLOWED');
  });
  regression([5], 'Double on ordinary split 21 rejects', () => {
    const state = split(advancedTable(['10', '10', 'K', '7', 'A', '2']));
    expect(state.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['10', 'A']);
    rejected(state, () => a.doubleAdvancedHand(state, 1, 'round-1/seat-1.1'), 'WRONG_HAND');
  });
  for (const [id, card, outcome, gross, balance] of [
    [9, '2', 'DEALER_WIN', 0, 1600], [10, '6', 'PUSH', 400, 2000],
  ] as const) regression([id], `doubled ${outcome}`, () => {
    const paid = pay(double(advancedTable(['5', '10', '6', '7', card])));
    expect(paid.results[0]).toMatchObject({ stakeUnits: 400, outcome, grossReturnUnits: gross });
    expect(paid.bankrolls[0].available).toBe(balance);
  });
  regression([11, 48], 'DAS and doubled leaf settlement', () => {
    const state = double(split(advancedTable(['8', '10', '8', '7', '3', '10', '9'])));
    expect(state.game.round?.players.map((hand) => hand.stakeUnits)).toEqual([400, 200]);
    expect(state.bankrolls[0]).toEqual({ available: 1400, reserved: 600 });
    const paid = pay(stand(state));
    expect(paid.results.map((entry) => [entry.outcome, entry.grossReturnUnits])).toEqual([['PLAYER_WIN', 800], ['PUSH', 200]]);
    expect(paid.bankrolls[0].available).toBe(2400);
  });
  regression([12, 29, 30, 31, 32, 33, 34], 'Split Aces: two additions, no decisions, A K ordinary 21', () => {
    const start = advancedTable(['A', '10', 'A', '7', 'A', 'K']);
    const state = split(start);
    expect(state.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['A', 'A'], ['A', 'K']]);
    expect(state.game.shoe.available.length).toBe(start.game.shoe.available.length - 2);
    expect(state.game.round?.players.every((hand) => hand.complete && hand.splitAces && !a.isAdvancedNatural(hand))).toBe(true);
    const before = structuredClone(state);
    for (const hand of state.game.round!.players) {
      for (const command of [a.hitAdvancedHand, a.doubleAdvancedHand, a.surrenderAdvancedHand, a.splitAdvancedHand]) {
        const result = command(state, 1, hand.handId);
        expect(result.ok).toBe(false);
        expect(result.state).toBe(state);
      }
    }
    expect(state).toEqual(before);
    expect(pay(state).results.map((entry) => [entry.outcome, entry.grossReturnUnits])).toEqual([['DEALER_WIN', 0], ['PLAYER_WIN', 400]]);
  });
  for (const [id, first, second] of [[13, '10', 'K'], [14, 'J', 'Q'], [15, '9', '9']] as const) {
    regression([id], `${first}/${second} Split`, () => {
      const state = split(advancedTable([first, '10', second, '7', '2']));
      expect(state.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([[first, '2'], [second]]);
      expect(state.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
    });
  }
  regression([16], 'unequal Split rejection', () => {
    const state = advancedTable(['9', '10', '8', '7']);
    rejected(state, () => a.splitAdvancedHand(state, 1, currentId(state)), 'UNEQUAL_SPLIT_VALUE');
  });
  regression([17], 'Split exact funds', () => {
    const state = advancedTable(['8', '10', '8', '7', '2'], [seat(1, 'HUMAN')], [1000]);
    expect(split(state).bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
  });
  regression([18, 52], 'Split shortfall is completely atomic', () => {
    const state = withAvailable(advancedTable(['8', '10', '8', '7']), 199);
    rejected(state, () => a.splitAdvancedHand(state, 1, currentId(state)), 'INSUFFICIENT_FUNDS');
  });
  regression([19, 20, 21, 35], 'physical child ownership and depth-first seat completion', () => {
    const start = advancedTable(['8', '10', '10', '8', '7', '7', '2', '3', '4'], [seat(1, 'HUMAN'), seat(4)]);
    const original = start.game.round!.players[0].cards;
    const state = split(start);
    expect(state.game.round!.players[0].cards[0]).toBe(original[0]);
    expect(state.game.round!.players[1].cards[0]).toBe(original[1]);
    expect(state.game.round!.players[1].cards).toHaveLength(1);
    const hit = accepted(a.hitAdvancedHand(state, 1, currentId(state)));
    expect(hit.game.round!.players[0].cards.map((card) => card.rank)).toEqual(['8', '2', '3']);
    expect(hit.game.round!.players[1].cards).toHaveLength(1);
    const next = stand(hit);
    expect(next.game.round?.currentSeat).toBe(1);
    expect(next.game.round!.players[1].cards[1]).toBe(start.game.shoe.available[2]);
    expect(next.game.round!.players[1].cards.map((card) => card.rank)).toEqual(['8', '4']);
    expect(stand(next).game.round?.currentSeat).toBe(4);
    expectAccounting(next.game.shoe);
  });
  regression([22], 'ten split child plus Ace is not Natural', () => {
    const state = split(advancedTable(['10', '10', 'K', '7', 'A', '2']));
    expect(state.game.round?.players[0].complete).toBe(true);
    expect(a.isAdvancedNatural(state.game.round!.players[0])).toBe(false);
    expect(pay(stand(state)).results[0]).toMatchObject({ outcome: 'PLAYER_WIN', grossReturnUnits: 400 });
  });
  regression([23], 're-split follows depth-first children', () => {
    const state = split(split(advancedTable(['8', '10', '8', '7', '8', '2'])));
    expect(state.game.round?.players.map((hand) => [hand.handId, hand.cards.length])).toEqual([
      ['round-1/seat-1.1.1', 2], ['round-1/seat-1.1.2', 1], ['round-1/seat-1.2', 1]]);
    expect(state.bankrolls[0]).toEqual({ available: 1400, reserved: 600 });
  });
  regression([24, 25], 'four-leaf cap rejects fifth despite funds', () => {
    const state = split(split(split(advancedTable(['8', '10', '8', '7', '8', '8', '8']))));
    expect(state.game.round?.players).toHaveLength(4);
    expect(state.bankrolls[0]).toEqual({ available: 1200, reserved: 800 });
    rejected(state, () => a.splitAdvancedHand(state, 1, currentId(state)), 'HAND_LIMIT_REACHED');
  });
  for (const [id, bust] of [[26, false], [27, true]] as const) regression([id], `ended leaf counts (bust=${bust})`, () => {
    const state = split(split(split(advancedTable(['8', '10', '8', '7', '8', '8', '8', ...(bust ? ['K' as const] : []), '8']))));
    const next = bust ? accepted(a.hitAdvancedHand(state, 1, currentId(state))) : stand(state);
    expect(next.game.round?.players[0].complete).toBe(true);
    if (bust) expect(next.game.round?.players[0].outcomeReason).toBe('PLAYER_BUST');
    rejected(next, () => a.splitAdvancedHand(next, 1, currentId(next)), 'HAND_LIMIT_REACHED');
  });
  regression([28], 're-split requires available funds below cap', () => {
    const state = split(advancedTable(['8', '10', '8', '7', '8'], [seat(1, 'HUMAN')], [1000]));
    expect(state.game.round?.players).toHaveLength(2);
    rejected(state, () => a.splitAdvancedHand(state, 1, currentId(state)), 'INSUFFICIENT_FUNDS');
  });
  regression([36], 'computer retains Hit/Stand-only policy on pair and Double-eligible hands', () => {
    for (const ranks of [['8', '10', '8', '7', '3'], ['5', '10', '6', '7', '10']] as const) {
      const state = advancedTable(ranks, [seat(1)]);
      const done = accepted(a.advanceAdvancedTable(state));
      expect(done.game.round?.players).toHaveLength(1);
      expect(done.game.round?.players[0]).toMatchObject({ origin: 'ORIGINAL', stakeUnits: 200, complete: true });
      expect(done.game.round?.players[0].cards).toHaveLength(3);
      expect(done.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    }
  });
  regression([37, 38, 39, 45, 46], 'original Late Surrender, negative peek, exact half return and no extra reserve', () => {
    for (const up of ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'] as const) {
      const start = advancedTable(['10', up, '6', '5'], [seat(1, 'HUMAN')], [50]);
      const next = accepted(a.surrenderAdvancedHand(start, 1, currentId(start)));
      expect(start.game.round?.dealerNaturalExcluded).toBe(true);
      expect(next.game.shoe).toBe(start.game.shoe);
      expect(next.bankrolls).toBe(start.bankrolls);
      expect(a.getAdvancedResults(next)[0]).toMatchObject({ outcome: 'SURRENDERED', grossReturnUnits: 25, netUnits: -25 });
      expect(pay(next).bankrolls[0]).toEqual({ available: 1975, reserved: 0 });
    }
  });
  for (const [ids, command] of [
    [[40], a.hitAdvancedHand], [[41], a.doubleAdvancedHand], [[42, 43], a.splitAdvancedHand],
  ] as const) regression(ids, `surrender rejects after ${command.name}`, () => {
    const start = advancedTable(['8', '10', '8', '7', '2']);
    const state = accepted(command(start, 1, currentId(start)));
    rejected(state, () => a.surrenderAdvancedHand(state, 1, currentId(state) ?? currentId(start)));
  });
  regression([44], 'Natural surrender rejects', () => {
    const state = advancedTable(['A', '10', 'K', '7']);
    rejected(state, () => a.surrenderAdvancedHand(state, 1, 'round-1/seat-1'));
  });
  regression([47, 49], 'mixed leaf win/loss and no parent double settlement', () => {
    const paid = pay(stand(stand(split(advancedTable(['8', '10', '8', '7', 'K', '2'])))));
    expect(paid.results.map((entry) => [entry.handId, entry.stakeUnits, entry.outcome, entry.grossReturnUnits]))
      .toEqual([['round-1/seat-1.1', 200, 'PLAYER_WIN', 400], ['round-1/seat-1.2', 200, 'DEALER_WIN', 0]]);
    expect(paid.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
  });
  regression([50], 'advanced returns stay unavailable until final table commit', () => {
    const state = split(advancedTable(['10', '10', 'K', '7', 'A', '2'], [seat(1, 'HUMAN')], [1000]));
    expect(state.game.round?.players[0].complete).toBe(true);
    expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    rejected(state, () => a.doubleAdvancedHand(state, 1, currentId(state)), 'INSUFFICIENT_FUNDS');
    const done = accepted(a.advanceAdvancedTable(stand(state)));
    expect(a.getAdvancedResults(done)[0].grossReturnUnits).toBe(2000);
    expect(done.bankrolls[0].available).toBe(0);
    expect(a.doubleAdvancedHand(done, 1, 'round-1/seat-1.2').state).toBe(done);
  });
  for (const [id, kind] of [[53, 'DOUBLE'], [54, 'SPLIT'], [55, 'RESPLIT']] as const) regression([id], `${kind} exhaustion and VOID`, () => {
    const start = kind === 'DOUBLE' ? advancedTable(['5', '10', '6', '7']) : advancedTable(['8', '10', '8', '7', '8']);
    const ready = exhausted(kind === 'RESPLIT' ? split(start) : start);
    const failed = accepted(kind === 'DOUBLE' ? a.doubleAdvancedHand(ready, 1, currentId(ready))
      : a.splitAdvancedHand(ready, 1, currentId(ready)));
    expect(failed.game.shoe.inPlay).toHaveLength(kind === 'RESPLIT' ? 5 : 4);
    assertVoid(failed, kind === 'RESPLIT' ? 600 : 400);
  });
  regression([56, 58], 'Double plus re-split actual exposure refunds exactly once', () => {
    const first = split(split(advancedTable(['8', '10', '8', '6', '8', '3', '10', '2', '4'])));
    const doubled = double(first);
    const last = stand(stand(doubled));
    expect(last.bankrolls[0]).toEqual({ available: 1200, reserved: 800 });
    const failed = accepted(a.advanceAdvancedTable(exhausted(last)));
    assertVoid(failed, 800);
  });
  regression([57], 'duplicate settlement has no second financial effect', () => {
    const paid = pay(double(advancedTable(['5', '10', '6', '7', '10'])));
    rejected(paid, () => a.settleAdvancedWagers(paid), 'SETTLEMENT_NOT_READY');
    expect(paid.bankrolls[0]).toEqual({ available: 2400, reserved: 0 });
  });
  regression([59], 'public multi-hand projection never exposes physical/shoe/hidden data', () => {
    const state = split(advancedTable(['8', 'K', '8', '6', '3']));
    const view = getPublicAdvancedView(state);
    expect(view.round?.seats[0].hands).toHaveLength(2);
    expect(view.round?.dealer.holeCard).toBeNull();
    expect(view.round?.dealer.visibleCards).toEqual([{ rank: 'K', suit: 'diamonds' }]);
    const text = JSON.stringify(view);
    expect(text).not.toMatch(/deckIndex|originalCards|cutPosition|shoeId|available|inPlay/);
    for (const card of [...state.game.shoe.available, ...state.game.shoe.inPlay]) expect(text).not.toContain(card.id);
    const changed = { ...state, game: { ...state.game, round: { ...state.game.round!,
      dealerCards: [state.game.round!.dealerCards[0], { ...state.game.round!.dealerCards[1], rank: '5' as Rank }] } } };
    expect(getPublicAdvancedView(changed)).toEqual(view);
  });
  regression([60], 'M5/M6 and Charlie functionality absent', () => {
    const banned = /insurance|evenmoney|sidebet|betbehind|charlie|wallet|account/i;
    expect(Object.keys(a).some((key) => banned.test(key))).toBe(false);
    const state = split(advancedTable(['8', 'A', '8', '6', '3']));
    expect(state.game.round?.phase).toBe('PLAYER_TURN');
    function inspect(value: unknown) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        expect(banned.test(key), key).toBe(false);
        inspect(child);
      }
    }
    inspect(state);
    inspect(getPublicAdvancedView(state));
  });
  it('maps exactly contract IDs 001 through 060 without omissions or duplicates', () => {
    expect([...mappedIds].sort((left, right) => left - right)).toEqual(Array.from({ length: 60 }, (_, index) => index + 1));
  });
});
