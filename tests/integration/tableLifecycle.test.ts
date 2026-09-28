import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { advanceTableAutomation, configureTableSeats, hitTableSeat, resolveTableDealer,
  standTableSeat, startTableRound } from '../../src/domain/tableGame.js';
import { prepareShoeForNextRound } from '../../src/domain/shoe.js';
import { getPublicTableView } from '../../src/domain/tablePublicView.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat, startedTable, tableFixture } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

describe('M2 complete lifecycle regression', () => {
  it.each(['HUMAN', 'COMPUTER'] as const)('%s alone completes a deterministic ordinary round', (controller) => {
    const start = startedTable(['10', '10', '5', '6', '6', '4'], [seat(4, controller)]);
    const playing = controller === 'HUMAN' ? hitTableSeat(start, 4).state : start;
    const done = advanceTableAutomation(playing).state;
    expect(done.round?.phase).toBe('ROUND_COMPLETE');
    expect(done.round?.players[0].cards.map((card) => card.rank)).toEqual(['10', '5', '6']);
    expect(done.round?.players[0].outcome).toBe('PLAYER_WIN');
    expect(done.round?.players[0].outcomeReason).toBe('HIGHER_TOTAL');
    expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '6', '4']);
    expect(done.shoe.discarded).toHaveLength(6);
    expectAccounting(done.shoe);
  });

  it('completes all seven computer seats against one dealer without any human', () => {
    const state = startedTable(['10', '10', '10', '10', '10', '10', '10', '9',
      '7', '8', '9', '10', '7', '8', '9', '8'], [1, 2, 3, 4, 5, 6, 7].map((n) => seat(n)));
    const done = advanceTableAutomation(state).state;
    expect(done.round?.phase).toBe('ROUND_COMPLETE');
    expect(done.round?.players.map((player) => player.outcome)).toEqual([
      'PUSH', 'PLAYER_WIN', 'PLAYER_WIN', 'PLAYER_WIN', 'PUSH', 'PLAYER_WIN', 'PLAYER_WIN',
    ]);
    expect(done.round?.players.every((player) => player.controller === 'COMPUTER' && player.complete)).toBe(true);
    expect(done.shoe.discarded).toHaveLength(16);
    expect(done.shoe.available).toHaveLength(296);
    expectAccounting(done.shoe);
    expect(advanceTableAutomation(state).state).toEqual(done);
  });

  it('two rounds reuse one shoe with between-round seat changes and immutable prior snapshots', () => {
    const input = tableFixture(['10', '9', '10', '10', '8', '7', '10', '10', '10', '9', '10', '7'],
      [seat(2), seat(7), seat(4, 'HUMAN', true)]);
    const first = advanceTableAutomation(startTableRound(input, 'r1', 'unused', noRandom).state).state;
    const snapshot = structuredClone(first);
    expect(first.round?.players.map((player) => player.outcome)).toEqual(['PLAYER_WIN', 'PUSH']);
    const configured = configureTableSeats(first, [seat(1, 'HUMAN'), seat(5),
      { seatNumber: 2, occupancy: 'EMPTY', sittingOut: false },
      { seatNumber: 4, occupancy: 'EMPTY', sittingOut: false },
      { seatNumber: 7, occupancy: 'EMPTY', sittingOut: false }]);
    expect(configured.ok).toBe(true);
    const view = getPublicTableView(configured.state);
    expect(view.configuration[0].occupancy).toBe('HUMAN');
    expect(view.round?.seats[0].occupancy).toBe('EMPTY');
    const second = startTableRound(configured.state, 'r2', 'unused', noRandom).state;
    expect(second.round?.players.map((player) => player.seatNumber)).toEqual([1, 5]);
    expect(second.round?.players.map((player) => player.cards.map((card) => card.rank))).toEqual([['10', '9'], ['10', '10']]);
    expect(second.shoe.discarded).toHaveLength(6);
    expect(second.shoe.inPlay).toHaveLength(6);
    const done = advanceTableAutomation(standTableSeat(second, 1).state).state;
    expect(done.round?.players.map((player) => player.outcome)).toEqual(['PLAYER_WIN', 'PLAYER_WIN']);
    expect(done.shoe.discarded).toHaveLength(12);
    for (const state of [first, second, done]) {
      expect(state.shoe.shoeId).toBe('fixture');
      expect(state.shoe.cutPosition).toBe(219);
      expectAccounting(state.shoe);
    }
    expect(first).toEqual(snapshot);
  });

  it.each([219, 249])('computer crosses cut %i; dealer uses same shoe; next round replaces', (cut) => {
    const initial = tableFixture(['5', '10', '10', '10', '5', '10', '10', '6', '7', '4'], [seat(2), seat(5), seat(7)]);
    const availableCount = 312 - (cut - 9);
    const input = { ...initial, shoe: { ...initial.shoe, cutPosition: cut,
      available: initial.shoe.available.slice(0, availableCount), discarded: initial.shoe.available.slice(availableCount) } };
    const dealt = startTableRound(input, 'r1', 'unused', noRandom).state;
    expect(312 - dealt.shoe.available.length).toBe(cut - 1);
    expect(dealt.shoe.reshufflePending).toBe(false);
    const done = advanceTableAutomation(dealt).state;
    expect(done.round?.players.map((player) => player.outcome)).toEqual(['DEALER_WIN', 'PUSH', 'PUSH']);
    expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '6', '4']);
    expect(done.shoe.reshufflePending).toBe(true);
    expect(done.shoe.shoeId).toBe('fixture');
    expect(done.shoe.cutPosition).toBe(cut);
    expect(done.shoe.discarded).toHaveLength(cut + 1);
    const snapshot = structuredClone(done);
    const random = { nextInt: vi.fn((max: number) => max - 1) };
    const next = startTableRound(done, 'r2', 'replacement', random).state;
    expect(next.shoe.shoeId).toBe('replacement');
    expect(next.shoe.cutPosition).toBe(249);
    expect(next.shoe.available).toHaveLength(304);
    expect(random.nextInt).toHaveBeenCalledTimes(312);
    expect(next.round?.players.map((player) => player.cards.map((card) => card.id))).toEqual([
      ['1:clubs:A', '1:clubs:5'], ['1:clubs:2', '1:clubs:6'], ['1:clubs:3', '1:clubs:7'],
    ]);
    for (const state of [dealt, done, next]) expectAccounting(state.shoe);
    expect(done).toEqual(snapshot);
  });

  it.each([1, 3, 7])('checks exact minimum 2*n+2 before dealing to %i seats', (count) => {
    const minimum = 2 * count + 2;
    for (const remaining of [minimum - 1, minimum]) {
      const initial = tableFixture([], Array.from({ length: count }, (_, index) => seat(index + 1)));
      // Isolate the minimum guard with accounting-valid fault data: pending=false.
      const input = { ...initial, shoe: { ...initial.shoe, available: initial.shoe.available.slice(0, remaining),
        discarded: initial.shoe.available.slice(remaining) } };
      const random = { nextInt: vi.fn((max: number) => max - 1) };
      const next = startTableRound(input, 'r1', 'replacement', random).state;
      expect(next.shoe.shoeId).toBe(remaining < minimum ? 'replacement' : 'fixture');
      expect(next.shoe.available).toHaveLength(remaining < minimum ? 312 - minimum : 0);
      expect(random.nextInt).toHaveBeenCalledTimes(remaining < minimum ? 312 : 0);
      expectAccounting(next.shoe);
    }
  });

  it('real computer exhaustion invalidates all results and next round requires a fresh shoe', () => {
    const initial = tableFixture(['A', '2', '2', 'K', '2', '2'], [seat(2), seat(7)]);
    const input = { ...initial, shoe: { ...initial.shoe,
      available: initial.shoe.available.slice(0, 6), discarded: initial.shoe.available.slice(6) } };
    const failed = advanceTableAutomation(startTableRound(input, 'r1', 'unused', noRandom).state).state;
    const snapshot = structuredClone(failed);
    expect(failed.round?.phase).toBe('INTEGRITY_ERROR');
    expect(failed.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
    expect(failed.round?.players.map((player) => player.outcome)).toEqual([undefined, undefined]);
    expect(failed.shoe.inPlay).toHaveLength(6);
    const recovered = startTableRound(failed, 'r2', 'new-shoe', { nextInt: (max) => max - 1 }).state;
    expect(recovered.shoe.shoeId).toBe('new-shoe');
    expect(recovered.shoe.retired).toBe(false);
    expect(recovered.shoe.available).toHaveLength(306);
    expectAccounting(failed.shoe);
    expectAccounting(recovered.shoe);
    expect(failed).toEqual(snapshot);
  });

  it('terminal table rejects all gameplay commands repeatedly without mutation', () => {
    const done = advanceTableAutomation(startedTable(['10', '10', '10', '7'], [seat(3)])).state;
    const snapshot = structuredClone(done);
    for (let repeat = 0; repeat < 2; repeat++) {
      for (const command of [() => hitTableSeat(done, 3), () => standTableSeat(done, 3),
        () => advanceTableAutomation(done), () => resolveTableDealer(done)]) {
        expect(command()).toEqual({ ok: false, state: done, error: 'ROUND_ALREADY_TERMINAL' });
        expect(command().state).toBe(done);
      }
    }
    expect(done).toEqual(snapshot);
    expectAccounting(done.shoe);
  });

  it('rejects reconfiguration/start during dealer phase and invalid configuration without changing round', () => {
    const playing = startedTable(['10', '10', '10', '7'], [seat(3, 'HUMAN')]);
    const dealer = standTableSeat(playing, 3).state;
    expect(configureTableSeats(dealer, [seat(7)])).toEqual({ ok: false, state: dealer, error: 'ROUND_ALREADY_ACTIVE' });
    expect(startTableRound(dealer, 'bad', 'unused', noRandom)).toEqual({ ok: false, state: dealer, error: 'ROUND_ALREADY_ACTIVE' });
    const done = resolveTableDealer(dealer).state;
    expect(configureTableSeats(done, [seat(7, 'HUMAN')])).toEqual({ ok: false, state: done, error: 'INVALID_SEATS' });
  });

  it('contains no wagering/credits or advanced action state in internal/public table data', () => {
    const state = advanceTableAutomation(startedTable(['10', '10', '10', '7'], [seat(3)])).state;
    const banned = new Set(['balance', 'credits', 'wager', 'bet', 'wallet', 'split', 'double', 'surrender', 'insurance', 'betBehind']);
    function inspect(value: unknown) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        expect(banned.has(key), key).toBe(false);
        inspect(child);
      }
    }
    inspect(state);
    inspect(getPublicTableView(state));
  });

  it.each([3, 17, 4.5, NaN])('rejects invalid initial-deal minimum %s before consuming randomness', (minimum) => {
    const input = tableFixture([], [seat(1)]);
    expect(() => prepareShoeForNextRound(input.shoe, 'unused', noRandom, minimum)).toThrow(RangeError);
  });
});
