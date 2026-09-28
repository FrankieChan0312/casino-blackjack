import { afterEach, describe, expect, it, vi } from 'vitest';
import * as shoeModule from '../../src/domain/shoe.js';
import { advanceTableAutomation, hitTableSeat, resolveTableDealer, standTableSeat } from '../../src/domain/tableGame.js';
import { getPublicTableView } from '../../src/domain/tablePublicView.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat, startedTable, tableFixture } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());

function freezeDeep(value: object) {
  for (const child of Object.values(value)) if (child && typeof child === 'object') freezeDeep(child);
  Object.freeze(value);
}

describe('computer automation and shared dealer', () => {
  it('runs consecutive computers in ascending order with exact Hit cards and one dealer', () => {
    const state = startedTable(['5', '8', '9', '10', '5', '8', '8', '7', '2', '5', '4'], [seat(2), seat(5), seat(7)]);
    const before = structuredClone(state);
    freezeDeep(state);
    const done = advanceTableAutomation(state);
    expect(done.ok).toBe(true);
    expect(done.state.round?.phase).toBe('ROUND_COMPLETE');
    expect(done.state.round?.players.map((player) => player.cards.map((card) => card.rank))).toEqual([
      ['5', '5', '2', '5'], ['8', '8', '4'], ['9', '8'],
    ]);
    expect(done.state.round?.players.map((player) => player.outcome)).toEqual(['PUSH', 'PLAYER_WIN', 'PUSH']);
    expect(done.state.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '7']);
    expect(done.state.shoe.discarded).toHaveLength(11);
    expect(done.state.shoe.inPlay).toHaveLength(0);
    expectAccounting(done.state.shoe);
    expect(state).toEqual(before);
    expect(advanceTableAutomation(state)).toEqual(done);
  });

  it('pauses at HUMAN and resumes subsequent computers after human Stand', () => {
    const state = startedTable(['8', '8', '5', '10', '9', '7', '5', '7', '7'], [seat(1), seat(4, 'HUMAN'), seat(7)]);
    const paused = advanceTableAutomation(state).state;
    expect(paused.round?.currentSeat).toBe(4);
    expect(paused.round?.players.map((player) => player.complete)).toEqual([true, false, false]);
    expect(paused.shoe.available).toHaveLength(304);
    expect(getPublicTableView(paused).round?.dealer.holeCard).toBeNull();
    expect(advanceTableAutomation(paused).state).toBe(paused);
    const done = advanceTableAutomation(standTableSeat(paused, 4).state).state;
    expect(done.round?.phase).toBe('ROUND_COMPLETE');
    expect(done.round?.players.map((player) => player.outcome)).toEqual(['PUSH', 'DEALER_WIN', 'PUSH']);
    expect(done.shoe.discarded).toHaveLength(9);
  });

  it('preserves bust/natural and compares three surviving hands to the same dealer 19', () => {
    const state = startedTable(['10', 'A', '10', '10', '10', '9', '8', 'K', '10', '9', '8', '7', '5', '3'],
      [seat(1, 'HUMAN'), seat(2), seat(3), seat(4), seat(5)]);
    const busted = hitTableSeat(state, 1).state;
    const draw = vi.spyOn(shoeModule, 'drawCard');
    const done = advanceTableAutomation(busted).state;
    expect(draw).toHaveBeenCalledTimes(1);
    expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(['9', '7', '3']);
    expect(done.round?.players.map((player) => [player.outcome, player.outcomeReason])).toEqual([
      ['DEALER_WIN', 'PLAYER_BUST'], ['PLAYER_BLACKJACK', 'PLAYER_NATURAL'],
      ['PLAYER_WIN', 'HIGHER_TOTAL'], ['PUSH', 'EQUAL_TOTAL'], ['DEALER_WIN', 'LOWER_TOTAL'],
    ]);
    expect(getPublicTableView(done).round?.dealer.visibleCards).toHaveLength(3);
    expectAccounting(done.shoe);
    expect(resolveTableDealer(done)).toEqual({ ok: false, state: done, error: 'ROUND_ALREADY_TERMINAL' });
    expect(draw).toHaveBeenCalledTimes(1);
  });

  it('a busted seat stays lost when dealer later busts against another seat', () => {
    const state = startedTable(['10', '10', '10', '8', '10', '6', '5', 'K'], [seat(1, 'HUMAN'), seat(7)]);
    const done = advanceTableAutomation(hitTableSeat(state, 1).state).state;
    expect(done.round?.players.map((player) => [player.outcome, player.outcomeReason])).toEqual([
      ['DEALER_WIN', 'PLAYER_BUST'], ['PLAYER_WIN', 'DEALER_BUST'],
    ]);
    expect(done.round?.dealerCards).toHaveLength(3);
  });

  it.each([
    ['A', '6', [], ['A', '6']], ['10', '7', [], ['10', '7']],
    ['A', '5', ['2'], ['A', '5', '2']], ['10', '6', ['2'], ['10', '6', '2']],
    ['2', '2', ['3', '10'], ['2', '2', '3', '10']],
  ] as const)('uses S17 for dealer %s,%s', (first, second, draws, expected) => {
    const state = startedTable(['10', first, '10', second, ...draws], [seat(1)]);
    const done = advanceTableAutomation(state).state;
    expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(expected);
    expect(done.round?.players[0].outcome).toBe('PLAYER_WIN');
    expectAccounting(done.shoe);
  });

  it('skips dealer drawing when every hand already has an outcome', () => {
    const state = startedTable(['A', '10', '2', 'K', '6', '2', 'K'], [seat(2), seat(7)]);
    const draw = vi.spyOn(shoeModule, 'drawCard');
    const done = advanceTableAutomation(state).state;
    expect(draw).toHaveBeenCalledTimes(1); // computer bust only, no dealer draw
    expect(done.round?.players.map((player) => player.outcome)).toEqual(['PLAYER_BLACKJACK', 'DEALER_WIN']);
    expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(['2', '2']);
    expect(done.round?.phase).toBe('ROUND_COMPLETE');
    expect(getPublicTableView(done).round?.dealer.holeCard).not.toBeNull();
  });

  it.each(['COMPUTER', 'DEALER'] as const)('retains partial %s draws on integrity failure without results', (stage) => {
    const state = stage === 'COMPUTER'
      ? startedTable(['A', '2', '2', 'K', '2', '2', '3'], [seat(1), seat(7)])
      : startedTable(['A', '10', '2', 'K', '10', '2', '3'], [seat(1), seat(7)]);
    const before = structuredClone(state);
    const realDraw = shoeModule.drawCard;
    let draws = 0;
    vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => draws++ === 0 ? realDraw(shoe)
      : { ok: false, shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' });
    const result = advanceTableAutomation(state);
    expect(result.ok).toBe(true);
    const failed = result.state;
    expect(failed.round?.phase).toBe('INTEGRITY_ERROR');
    expect(failed.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
    expect(failed.shoe.retired).toBe(true);
    expect(failed.shoe.inPlay).toHaveLength(7);
    expect(failed.round?.players.every((player) => player.outcome === undefined && player.outcomeReason === undefined)).toBe(true);
    expect(stage === 'COMPUTER' ? failed.round?.players[1].cards.map((card) => card.rank)
      : failed.round?.dealerCards.map((card) => card.rank)).toEqual(['2', '2', '3']);
    expect(getPublicTableView(failed).round?.dealer.holeCard).toBeNull();
    expectAccounting(failed.shoe);
    expect(state).toEqual(before);
    expect(advanceTableAutomation(failed).state).toBe(failed);
    expect(resolveTableDealer(failed).state).toBe(failed);
  });

  it('rejects missing/terminal automation and early dealer resolution unchanged', () => {
    const empty = tableFixture([], [seat(1)]);
    const playing = startedTable(['8', '6', '9', '10'], [seat(1)]);
    const terminal = startedTable(['A', '6', 'K', '10'], [seat(1)]);
    for (const command of [advanceTableAutomation, resolveTableDealer]) {
      expect(command(empty)).toEqual({ ok: false, state: empty, error: 'NO_ROUND' });
      expect(command(terminal)).toEqual({ ok: false, state: terminal, error: 'ROUND_ALREADY_TERMINAL' });
    }
    expect(resolveTableDealer(playing)).toEqual({ ok: false, state: playing, error: 'WRONG_PHASE' });
  });
});
