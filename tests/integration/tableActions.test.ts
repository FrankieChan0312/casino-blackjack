import { afterEach, describe, expect, it, vi } from 'vitest';
import * as shoeModule from '../../src/domain/shoe.js';
import { hitTableSeat, standTableSeat, type TableGameState } from '../../src/domain/tableGame.js';
import { getPublicTableView } from '../../src/domain/tablePublicView.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat, startedTable, tableFixture } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());

describe('table HUMAN commands', () => {
  it('draws exactly one card per Hit and keeps a below-21 hand current', () => {
    const state = startedTable(['5', '8', '6', '5', '9', '10', '3', '4'], [seat(2, 'HUMAN'), seat(7)]);
    const before = structuredClone(state);
    const first = hitTableSeat(state, 2);
    const second = hitTableSeat(first.state, 2);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.state.round?.players[0].cards.map((card) => card.rank)).toEqual(['5', '5', '3', '4']);
    expect(second.state.round?.currentSeat).toBe(2);
    expect(second.state.shoe.available).toHaveLength(304);
    expect(getPublicTableView(second.state).round?.dealer.holeCard).toBeNull();
    expectAccounting(second.state.shoe);
    expect(state).toEqual(before);
  });

  it.each([['6', undefined], ['K', 'DEALER_WIN']] as const)('Hit %s completes only the current seat', (rank, outcome) => {
    const state = startedTable(['8', '9', '6', '7', '8', '10', rank], [seat(2, 'HUMAN'), seat(7)]);
    const result = hitTableSeat(state, 2);
    expect(result.ok).toBe(true);
    expect(result.state.round?.phase).toBe('PLAYER_TURN');
    expect(result.state.round?.currentSeat).toBe(7);
    expect(result.state.round?.players[0].complete).toBe(true);
    expect(result.state.round?.players[0].outcome).toBe(outcome);
    expect(result.state.round?.players[1].complete).toBe(false);
    expect(result.state.shoe.inPlay).toHaveLength(7);
    expect(getPublicTableView(result.state).round?.dealer.holeCard).toBeNull();
    expectAccounting(result.state.shoe);
  });

  it('Stand advances to the next sparse seat without drawing', () => {
    const state = startedTable(['8', '9', '6', '7', '8', '10'], [seat(2, 'HUMAN'), seat(7)]);
    const result = standTableSeat(state, 2);
    expect(result.ok).toBe(true);
    expect(result.state.shoe).toBe(state.shoe);
    expect(result.state.round?.currentSeat).toBe(7);
    expect(result.state.round?.players[0].complete).toBe(true);
    expect(state.round?.players[0].complete).toBe(false);
  });

  it('skips naturals before/after the human and selects the next ordinary seat', () => {
    const state = startedTable(['A', '8', 'A', '9', '6', 'K', '7', 'Q', '8', '10'],
      [seat(1), seat(2, 'HUMAN'), seat(5), seat(7)]);
    expect(state.round?.currentSeat).toBe(2);
    const next = standTableSeat(state, 2).state;
    expect(next.round?.currentSeat).toBe(7);
    expect(next.round?.players.map((hand) => hand.outcome)).toEqual(['PLAYER_BLACKJACK', undefined, 'PLAYER_BLACKJACK', undefined]);
  });

  it.each(['STAND', '21', 'BUST'] as const)('final HUMAN %s enters dealer turn without dealer draws', (action) => {
    const state = startedTable(['8', '6', '7', '10', action === '21' ? '6' : 'K'], [seat(5, 'HUMAN')]);
    const result = action === 'STAND' ? standTableSeat(state, 5) : hitTableSeat(state, 5);
    expect(result.state.round?.phase).toBe('DEALER_TURN');
    expect(result.state.round?.currentSeat).toBeNull();
    expect(result.state.round?.dealerCards).toEqual(state.round?.dealerCards);
    expect(result.state.round?.players[0].outcome).toBe(action === 'BUST' ? 'DEALER_WIN' : undefined);
    expect(getPublicTableView(result.state).round?.dealer.holeCard).toEqual({ rank: '10', suit: 'spades' });
  });

  it('rejects empty, sitting-out, computer, wrong, out-of-range and finished seats unchanged', () => {
    const state = startedTable(['8', '9', '6', '7', '8', '10'], [seat(2, 'HUMAN'), seat(5, 'COMPUTER', true), seat(7)]);
    const before = structuredClone(state);
    for (const number of [0, 1, 5, 7, 8, NaN]) {
      for (const action of [hitTableSeat, standTableSeat]) {
        expect(action(state, number)).toEqual({ ok: false, state, error: 'WRONG_SEAT' });
        expect(action(state, number).state).toBe(state);
      }
    }
    const next = standTableSeat(state, 2).state;
    for (const action of [hitTableSeat, standTableSeat]) {
      expect(action(next, 7)).toEqual({ ok: false, state: next, error: 'NOT_HUMAN' });
      expect(action(next, 2).state).toBe(next);
      expect(action(next, 2).ok).toBe(false);
    }
    expect(state).toEqual(before);
  });

  it('rejects missing, dealer, complete and integrity rounds unchanged', () => {
    const initial = tableFixture([], [seat(1, 'HUMAN')]);
    const playing = startedTable(['8', '6', '7', '10'], [seat(1, 'HUMAN')]);
    const dealer = standTableSeat(playing, 1).state;
    const terminal = startedTable(['A', '6', 'K', '10'], [seat(1, 'HUMAN')]);
    const broken: TableGameState = { ...playing, round: { ...playing.round!, phase: 'INTEGRITY_ERROR', integrityError: 'SHOE_EXHAUSTED_DURING_ROUND' } };
    for (const [state, error] of [[initial, 'NO_ROUND'], [dealer, 'WRONG_PHASE'], [terminal, 'ROUND_ALREADY_TERMINAL'], [broken, 'ROUND_ALREADY_TERMINAL']] as const) {
      const before = structuredClone(state);
      for (const action of [hitTableSeat, standTableSeat]) {
        expect(action(state, 1)).toEqual({ ok: false, state, error });
        expect(action(state, 1).state).toBe(state);
      }
      expect(state).toEqual(before);
    }
  });

  it('failed HUMAN draw retires the table shoe, preserves cards and clears prior natural results', () => {
    const state = startedTable(['A', '8', '6', 'K', '7', '10'], [seat(1), seat(2, 'HUMAN')]);
    vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => ({ ok: false, shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' }));
    const failed = hitTableSeat(state, 2);
    expect(failed.ok).toBe(true);
    expect(failed.state.round?.phase).toBe('INTEGRITY_ERROR');
    expect(failed.state.shoe.retired).toBe(true);
    expect(failed.state.round?.players.map((player) => player.cards)).toEqual(state.round?.players.map((player) => player.cards));
    expect(failed.state.round?.players.every((player) => player.outcome === undefined)).toBe(true);
    expect(getPublicTableView(failed.state).round?.dealer.holeCard).toBeNull();
    expectAccounting(failed.state.shoe);
  });
});
