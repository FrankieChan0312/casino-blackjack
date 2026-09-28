import { afterEach, describe, expect, it, vi } from 'vitest';
import * as shoeModule from '../../src/domain/shoe.js';
import { configureTableSeats, createTableGame, startTableRound } from '../../src/domain/tableGame.js';
import { getPublicTableView } from '../../src/domain/tablePublicView.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat, startedTable, tableFixture } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());

describe('multi-seat initial deal', () => {
  it.each([[4], [2, 5, 7], [1, 2, 3, 4, 5, 6, 7]])('deals two exact ascending passes to %j', (...numbers: number[]) => {
    const seats = numbers.map((number) => seat(number));
    const input = tableFixture([], seats);
    const before = structuredClone(input);
    const result = startTableRound(input, 'r1', 'unused', noRandom);
    expect(result.ok).toBe(true);
    const { round, shoe } = result.state;
    expect(round?.players.map((player) => player.seatNumber)).toEqual(numbers);
    round!.players.forEach((player, index) => {
      expect(player.cards.map((card) => card.id)).toEqual([
        input.shoe.available[index].id, input.shoe.available[numbers.length + 1 + index].id,
      ]);
    });
    expect(round?.dealerCards.map((card) => card.id)).toEqual([
      input.shoe.available[numbers.length].id, input.shoe.available[2 * numbers.length + 1].id,
    ]);
    expect(shoe.available.length).toBe(312 - 2 * numbers.length - 2);
    expectAccounting(shoe);
    expect(input).toEqual(before);
  });

  it('skips empty/sitting-out seats and freezes seven-seat occupancy', () => {
    const state = startedTable(['10', '9', '6', '7', '8', '10'], [seat(2), seat(3, 'HUMAN', true), seat(7)]);
    expect(state.round?.players.map((player) => player.seatNumber)).toEqual([2, 7]);
    expect(state.round?.currentSeat).toBe(2);
    expect(configureTableSeats(state, []).state).toBe(state);
    expect(startTableRound(state, 'bad', 'unused', noRandom).state).toBe(state);
    expect(Object.isFrozen(state.round?.seats)).toBe(true);
  });

  it.each(['A', '10', 'J', 'Q', 'K'] as const)('dealer natural with %s upcard resolves all players independently', (upcard) => {
    const state = startedTable(['A', '9', upcard, 'K', '8', upcard === 'A' ? 'Q' : 'A'], [seat(2), seat(7)]);
    expect(state.round?.phase).toBe('ROUND_COMPLETE');
    expect(state.round?.players.map((player) => [player.outcome, player.outcomeReason])).toEqual([
      ['PUSH', 'BOTH_NATURAL'], ['DEALER_WIN', 'DEALER_NATURAL'],
    ]);
    expect(state.round?.currentSeat).toBeNull();
    expect(state.shoe.discarded).toHaveLength(6);
    expectAccounting(state.shoe);
  });

  it('one natural does not finish ordinary hands and chooses first eligible seat', () => {
    const state = startedTable(['A', '9', 'A', '6', 'K', '8', '10', '10'], [seat(2), seat(5), seat(7)]);
    expect(state.round?.phase).toBe('PLAYER_TURN');
    expect(state.round?.currentSeat).toBe(5);
    expect(state.round?.players.map((player) => player.outcome)).toEqual(['PLAYER_BLACKJACK', undefined, 'PLAYER_BLACKJACK']);
    expect(state.shoe.inPlay).toHaveLength(8);
    expect(getPublicTableView(state).round?.dealer.holeCard).toBeNull();
  });

  it('all player naturals complete without dealer drawing and permit next configuration', () => {
    const state = startedTable(['A', 'A', '6', 'K', 'Q', '10'], [seat(1), seat(6)]);
    expect(state.round?.phase).toBe('ROUND_COMPLETE');
    expect(state.round?.players.map((player) => player.outcome)).toEqual(['PLAYER_BLACKJACK', 'PLAYER_BLACKJACK']);
    expect(state.shoe.available).toHaveLength(306);
    expect(configureTableSeats(state, [seat(6, 'HUMAN')]).ok).toBe(true);
    expect(getPublicTableView(state).round?.dealer.holeCard).toEqual({ rank: '10', suit: 'diamonds' });
  });

  it('redacts physical IDs, shoe, hidden rank/suit and negative-peek information', () => {
    const state = startedTable(['8', 'A', '9', '6'], [seat(4, 'HUMAN')]);
    const changedHole = { ...state, round: { ...state.round!, dealerCards: [state.round!.dealerCards[0],
      { ...state.round!.dealerCards[1], rank: '7' as const, suit: 'hearts' as const }] } };
    const view = getPublicTableView(state);
    expect(view).toEqual(getPublicTableView(changedHole));
    expect(view.round?.seats).toHaveLength(7);
    const serialized = JSON.stringify(view);
    for (const secret of ['deckIndex', 'available', 'cutPosition', 'shoeId', '"id"', '"6"']) expect(serialized).not.toContain(secret);
    view.configuration[3].sittingOut = true;
    expect(state.table.seats[3].sittingOut).toBe(false);
  });

  it('requires 2*n+2 available cards before any multi-seat deal', () => {
    const input = tableFixture([], [seat(2), seat(5), seat(7)]);
    const short = { ...input, shoe: { ...input.shoe, available: input.shoe.available.slice(-7), discarded: input.shoe.available.slice(0, -7) } };
    const state = startTableRound(short, 'r1', 'new', { nextInt: (max) => max - 1 }).state;
    expect(state.shoe.shoeId).toBe('new');
    expect(state.shoe.available).toHaveLength(304);
    expectAccounting(state.shoe);
  });

  it.each([0, 1, 3, 5])('preserves partial deal on failure after %i cards without results', (count) => {
    const input = tableFixture(['9', '8', '6', '7', '8', '10'], [seat(2), seat(7)]);
    const realDraw = shoeModule.drawCard;
    let draws = 0;
    vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => draws++ < count ? realDraw(shoe)
      : { ok: false, shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' });
    const state = startTableRound(input, 'r1', 'unused', noRandom).state;
    expect(state.round?.phase).toBe('INTEGRITY_ERROR');
    expect(state.shoe.inPlay).toHaveLength(count);
    expect(state.round?.players.every((player) => player.outcome === undefined)).toBe(true);
    expect(getPublicTableView(state).round?.dealer.holeCard).toBeNull();
    expectAccounting(state.shoe);
  });

  it('creates an empty table game and rejects no-active-seat start without RNG', () => {
    const state = createTableGame('s1', { nextInt: (max) => max - 1 });
    expect(state.table.seats).toHaveLength(7);
    expect(state.round).toBeNull();
    expect(getPublicTableView(state).round).toBeNull();
    expect(startTableRound(state, 'r1', 'unused', noRandom)).toEqual({ ok: false, state, error: 'NO_ACTIVE_SEATS' });
  });
});
