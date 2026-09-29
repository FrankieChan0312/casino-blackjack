import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as g from '../../src/domain/optionalGame.js';
import * as shoe from '../../src/domain/shoe.js';
import * as hand from '../../src/domain/hand.js';
import { getPublicOptionalView } from '../../src/domain/optionalPublicView.js';
import { createSixDeckInventory, type Rank } from '../../src/domain/card.js';
import { classifyPair, classifyThreeCard, sideGross } from '../../src/domain/sideBets.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { freezeDeep } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());
const mapped: number[] = [];
// Each ID registers an executable scenario. Related IDs share independent assertions.
function reg(ids: readonly number[], name: string, run: () => void) {
  for (const id of ids) {
    mapped.push(id);
    it(`REG-M5-${String(id).padStart(3, '0')}: ${name}`, run);
  }
}
const close = (state: g.OptionalGameState) => accepted(g.closeOptionalBetting(state, 'unused', noRandom));
const id = (state: g.OptionalGameState) => state.game.round!.currentHandId!;
const stand = (state: g.OptionalGameState) => accepted(g.standOptionalHand(state, 1, id(state)));
const finish = (state: g.OptionalGameState) => accepted(g.resolveOptionalDealer(stand(state)));
const pay = (state: g.OptionalGameState) => accepted(g.settleOptionalWagers(state));
const deal = (ranks: readonly Rank[] = ['8', 'A', '8', '6']) => close(fundedOpen(ranks));
function sides(ranks: readonly Rank[] = ['8', '8', '8', '10']) {
  let state = fundedOpen(ranks);
  for (const type of ['PAIR', 'THREE_CARD'] as const) state = accepted(g.setSideWager(state, 1, type, 20));
  return close(state);
}
function exhausted(state: g.OptionalGameState): g.OptionalGameState {
  return { ...state, game: { ...state.game, shoe: { ...state.game.shoe, available: [],
    discarded: [...state.game.shoe.discarded, ...state.game.shoe.available] } } };
}
function rejected(state: g.OptionalGameState, command: () => g.OptionalResult) {
  const before = structuredClone(state);
  freezeDeep(state);
  const draw = vi.spyOn(shoe, 'drawCard');
  draw.mockClear();
  const result = command();
  expect(result.ok).toBe(false);
  expect(result.state).toBe(state);
  expect(state).toEqual(before);
  expect(draw).not.toHaveBeenCalled();
  expect(Math.random).not.toHaveBeenCalled();
}
function cards(...ids: string[]) {
  return ids.map((cardId) => createSixDeckInventory().find((card) => card.id === cardId)!);
}
for (const [caseId, type, amount] of [[1, 'PAIR', 2], [2, 'PAIR', 200], [4, 'THREE_CARD', 2], [5, 'THREE_CARD', 200]] as const) {
  reg([caseId], `${type} boundary ${amount}`, () => {
    const state = accepted(g.setSideWager(fundedOpen(), 1, type, amount));
    expect(state.sideWagers).toEqual([{ seatNumber: 1, type, stakeUnits: amount }]);
    expect(state.bankrolls[0]).toEqual({ available: 1800 - amount, reserved: 200 + amount });
  });
}
for (const [caseId, type] of [[3, 'PAIR'], [6, 'THREE_CARD']] as const) {
  reg([caseId], `${type} invalid increment and range`, () => {
    const state = fundedOpen();
    for (const amount of [1, 3, 201, 202, 0, 2.5, NaN, Infinity]) rejected(state, () => g.setSideWager(state, 1, type, amount));
  });
}
reg([7], 'own active funded MAIN required', () => {
  const state = optionalOpen();
  rejected(state, () => g.setSideWager(state, 1, 'PAIR', 2));
  rejected(state, () => g.setSideWager(state, 2, 'PAIR', 2));
  const sitting = optionalOpen(undefined, [seat(1, 'HUMAN', true)]);
  rejected(sitting, () => g.setSideWager(sitting, 1, 'THREE_CARD', 2));
});
reg([8, 9], 'exact side funds accepted; insufficient atomic', () => {
  let state = accepted(g.setOptionalMainWager(optionalOpen(), 1, 1998));
  state = accepted(g.setSideWager(state, 1, 'PAIR', 2));
  expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
  rejected(state, () => g.setSideWager(state, 1, 'THREE_CARD', 2));
});
reg([10, 11, 12], 'side delta/duplicate/cancel and main cascade', () => {
  let state = accepted(g.setSideWager(fundedOpen(), 1, 'PAIR', 20));
  state = accepted(g.setSideWager(state, 1, 'PAIR', 40));
  expect(state.bankrolls[0].reserved).toBe(240);
  state = accepted(g.setSideWager(state, 1, 'PAIR', 10));
  expect(state.bankrolls[0].reserved).toBe(210);
  expect(g.setSideWager(state, 1, 'PAIR', 10).state).toBe(state);
  state = accepted(g.cancelSideWager(state, 1, 'PAIR'));
  expect(state.bankrolls[0].reserved).toBe(200);
  rejected(state, () => g.cancelSideWager(state, 1, 'PAIR'));
  for (const type of ['PAIR', 'THREE_CARD'] as const) state = accepted(g.setSideWager(state, 1, type, 20));
  state = accepted(g.cancelOptionalMainWager(state, 1));
  expect([state.wagers, state.sideWagers]).toEqual([[], []]);
  expect(state.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
});
reg([13], 'close freezes three wager types', () => {
  const state = sides();
  expect(Object.isFrozen(state.wagers)).toBe(true);
  expect(Object.isFrozen(state.sideWagers)).toBe(true);
  rejected(state, () => g.setOptionalMainWager(state, 1, 400));
  rejected(state, () => g.cancelOptionalMainWager(state, 1));
  for (const type of ['PAIR', 'THREE_CARD'] as const) {
    rejected(state, () => g.setSideWager(state, 1, type, 40));
    rejected(state, () => g.cancelSideWager(state, 1, type));
  }
});
for (const [caseId, second, category, gross] of [[14, '2:clubs:Q', 'PERFECT_PAIR', 520],
  [15, '1:spades:Q', 'COLOURED_PAIR', 260], [16, '1:hearts:Q', 'MIXED_PAIR', 140]] as const) {
  reg([caseId], category, () => {
    const actual = classifyPair(cards('1:clubs:Q', second));
    expect(actual).toBe(category);
    expect(sideGross(20, actual)).toBe(gross);
  });
}
reg([17], 'equal Blackjack value is not rank pair', () => {
  expect(classifyPair(cards('1:clubs:10', '1:clubs:J'))).toBe('NONE');
  expect(classifyPair(cards('1:clubs:K', '1:clubs:Q'))).toBe('NONE');
});
reg([18], 'highest category only, no stacked categories', () => {
  expect(sideGross(20, classifyPair(cards('1:clubs:Q', '2:clubs:Q')))).toBe(520);
  expect(sideGross(20, classifyThreeCard(cards('1:clubs:Q', '2:clubs:Q', '3:clubs:Q')))).toBe(2020);
  expect(sideGross(20, classifyThreeCard(cards('1:clubs:Q', '1:clubs:K', '1:clubs:A')))).toBe(820);
});
for (const [caseId, a, b, c, category, gross] of [
  [19, '1:clubs:Q', '2:clubs:Q', '3:clubs:Q', 'SUITED_TRIPS', 2020],
  [20, '1:clubs:4', '1:clubs:5', '1:clubs:6', 'STRAIGHT_FLUSH', 820],
  [21, '1:clubs:Q', '1:hearts:Q', '1:spades:Q', 'THREE_OF_A_KIND', 620],
  [22, '1:clubs:4', '1:hearts:5', '1:spades:6', 'STRAIGHT', 220],
  [23, '1:clubs:4', '1:clubs:5', '1:clubs:9', 'FLUSH', 120],
  [24, '1:clubs:A', '1:hearts:2', '1:spades:3', 'STRAIGHT', 220],
  [25, '1:clubs:Q', '1:hearts:K', '1:spades:A', 'STRAIGHT', 220],
  [26, '1:clubs:K', '1:hearts:A', '1:spades:2', 'NONE', 0],
  [27, '1:clubs:K', '1:clubs:A', '1:clubs:2', 'FLUSH', 120],
] as const) reg([caseId], category, () => {
  const actual = classifyThreeCard(cards(a, b, c));
  expect(actual).toBe(category);
  expect(sideGross(20, actual)).toBe(gross);
});
reg([28, 29, 30], 'immutable originals, split/double do not re-evaluate or duplicate side wagers', () => {
  let state = sides(['8', '6', '8', '10', '3', '10', '2', '10']);
  const results = state.sideResults;
  const originals = state.game.round!.players[0].originalCards;
  state = accepted(g.splitOptionalHand(state, 1, id(state)));
  state = accepted(g.doubleOptionalHand(state, 1, id(state)));
  state = finish(state);
  expect(state.sideResults).toBe(results);
  expect(state.sideWagers.map((entry) => entry.stakeUnits)).toEqual([20, 20]);
  expect(state.game.round!.players.every((entry) => entry.originalCards === originals)).toBe(true);
  expect(originals.map((entry) => entry.rank)).toEqual(['8', '8']);
  expect(Object.isFrozen(originals)).toBe(true);
  expect(state.game.round!.dealerCards).toHaveLength(3);
});
reg([31, 32, 59, 61, 62], 'main loser and independent side winners; all pending until unified exact commit', () => {
  const ready = sides();
  expect(ready.sideResults.map((entry) => entry.grossReturnUnits)).toEqual([140, 620]);
  expect(ready.bankrolls[0].available).toBe(1760);
  rejected(ready, () => g.settleOptionalWagers(ready));
  const complete = finish(ready);
  expect(complete.bankrolls[0].available).toBe(1760);
  const final = pay(complete);
  expect(final.wagerResults.map((entry) => [entry.type, entry.outcome, entry.grossReturnUnits, entry.netUnits]))
    .toEqual([['MAIN', 'DEALER_WIN', 0, -200], ['PAIR', 'MIXED_PAIR', 140, 120], ['THREE_CARD', 'THREE_OF_A_KIND', 620, 600]]);
  expect(final.bankrolls[0]).toEqual({ available: 2520, reserved: 0 });
});
reg([33, 34, 71], 'Ace defers exactly one peek and public view never leaks pending/negative hole', () => {
  const peek = vi.spyOn(hand, 'isNaturalBlackjack');
  const state = deal();
  const holeId = state.game.round!.dealerCards[1].id;
  expect(peek.mock.calls.filter(([input]) => input.some((card) => card.id === holeId))).toHaveLength(0);
  expect(state.decisionPhase).toBe('INSURANCE');
  expect(state.peekPerformed).toBe(false);
  const before = getPublicOptionalView(state);
  expect(before.round!.phase).toBe('INSURANCE');
  expect(before.round!.dealer.holeCard).toBeNull();
  const next = accepted(g.decideInsurance(state, 1, false));
  expect(peek.mock.calls.filter(([input]) => input.some((card) => card.id === holeId))).toHaveLength(1);
  expect(getPublicOptionalView(next).round!.dealer.holeCard).toBeNull();
  rejected(next, () => g.decideInsurance(next, 1, true));
  expect(peek.mock.calls.filter(([input]) => input.some((card) => card.id === holeId))).toHaveLength(1);
  for (const view of [before, getPublicOptionalView(next)]) {
    expect(JSON.stringify(view)).not.toContain(holeId);
    for (const key of ['shoeId', 'deckIndex', 'cutPosition', 'originalCards', 'available', 'peekPerformed']) {
      expect(JSON.stringify(view)).not.toContain(`"${key}"`);
    }
    expect(view.round!.dealer.visibleCards).toHaveLength(1);
  }
});
reg([35, 36, 37, 38], 'half-original exact/odd units and insufficient atomic', () => {
  let state = accepted(g.setOptionalMainWager(optionalOpen(['8', 'A', '8', '6']), 1, 50));
  state = { ...state, bankrolls: state.bankrolls.map((entry, i) => i === 0 ? { ...entry, available: 24 } : entry) };
  state = close(state);
  rejected(state, () => g.decideInsurance(state, 1, true));
  state = { ...state, bankrolls: state.bankrolls.map((entry, i) => i === 0 ? { ...entry, available: 25 } : entry) };
  state = accepted(g.decideInsurance(state, 1, true));
  expect(state.insuranceDecisions[0].stakeUnits).toBe(25);
  expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 75 });
  expect(accepted(g.decideInsurance(deal(), 1, true)).insuranceDecisions[0].stakeUnits).toBe(100);
});
reg([39], 'computer declines; automation stops at human Insurance', () => {
  let state = optionalOpen(['A', '8', 'A', 'K', '8', '6'], [seat(1, 'COMPUTER'), seat(2, 'HUMAN')]);
  for (const number of [1, 2]) state = accepted(g.setOptionalMainWager(state, number, 200));
  state = close(state);
  expect(state.insuranceDecisions.map((entry) => entry.choice)).toEqual(['DECLINE', 'PENDING']);
  expect(g.advanceOptionalTable(state).state).toBe(state);
  expect(state.peekPerformed).toBe(false);
  rejected(state, () => g.electEvenMoney(state, 1));
  rejected(state, () => g.decideInsurance(state, 1, true));
});
reg([40, 41], 'Insurance once only and never after peek/player action', () => {
  const state = accepted(g.decideInsurance(deal(), 1, true));
  rejected(state, () => g.decideInsurance(state, 1, true));
  const played = stand(state);
  rejected(played, () => g.decideInsurance(played, 1, true));
  expect(played.bankrolls[0].reserved).toBe(300);
});
reg([42, 43], 'ten peeks immediately; 2..9 no peek/window', () => {
  for (const rank of ['10', 'J', 'Q', 'K', '2', '3', '4', '5', '6', '7', '8', '9'] as const) {
    const state = deal(['8', rank, '8', 'A']);
    expect(state.peekPerformed).toBe(['10', 'J', 'Q', 'K'].includes(rank));
    expect(state.decisionPhase).toBe('NONE');
    expect(state.insuranceDecisions).toEqual([]);
    rejected(state, () => g.decideInsurance(state, 1, true));
  }
});
reg([44, 45, 60], 'Insurance Natural win/negative loss exact and once', () => {
  for (const hole of ['K', '6'] as const) {
    let state = accepted(g.decideInsurance(deal(['8', 'A', '8', hole]), 1, true));
    expect(g.getOptionalWagerResults(state).find((entry) => entry.type === 'INSURANCE'))
      .toMatchObject({ outcome: hole === 'K' ? 'WIN' : 'LOSS', stakeUnits: 100, grossReturnUnits: hole === 'K' ? 300 : 0 });
    if (hole === '6') state = finish(state);
    const final = pay(state);
    expect(final.bankrolls[0].available).toBe(hole === 'K' ? 2000 : 1700);
    rejected(final, () => g.settleOptionalWagers(final));
  }
});
reg([46], 'later three-card dealer 21 does not win Insurance', () => {
  const state = finish(accepted(g.decideInsurance(deal(['10', 'A', '9', '2', '8']), 1, true)));
  expect(state.game.round!.dealerCards.map((entry) => entry.rank)).toEqual(['A', '2', '8']);
  expect(g.getOptionalWagerResults(state).find((entry) => entry.type === 'INSURANCE'))
    .toMatchObject({ outcome: 'LOSS', grossReturnUnits: 0 });
});
reg([47, 48, 49, 50, 51, 52], 'Even Money eligibility/no reserve/exclusion/exact 1:1 for both peek outcomes', () => {
  for (const hole of ['K', '6'] as const) {
    const before = deal(['A', 'A', 'K', hole]);
    const elected = accepted(g.electEvenMoney(before, 1));
    expect(elected.bankrolls).toBe(before.bankrolls);
    rejected(elected, () => g.decideInsurance(elected, 1, true));
    rejected(elected, () => g.electEvenMoney(elected, 1));
    const records = pay(elected).wagerResults;
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ type: 'MAIN', outcome: 'EVEN_MONEY', stakeUnits: 200, grossReturnUnits: 400, netUnits: 200 });
    const insured = accepted(g.decideInsurance(before, 1, true));
    rejected(insured, () => g.electEvenMoney(insured, 1));
  }
  const ordinary = deal();
  rejected(ordinary, () => g.electEvenMoney(ordinary, 1));
  const nonAce = deal(['A', '9', 'K', '6']);
  rejected(nonAce, () => g.electEvenMoney(nonAce, 1));
});
reg([53, 54], 'declined Natural gets 3:2 or dealer Natural push', () => {
  for (const hole of ['K', '6'] as const) {
    const state = accepted(g.decideInsurance(deal(['A', 'A', 'K', hole]), 1, false));
    expect(pay(state).wagerResults[0]).toMatchObject({ outcome: hole === 'K' ? 'PUSH' : 'PLAYER_BLACKJACK',
      grossReturnUnits: hole === 'K' ? 200 : 500 });
  }
});
reg([55, 56], 'dealer Natural terminates gameplay, retains side win', () => {
  const state = accepted(g.decideInsurance(sides(['8', 'A', '8', 'K']), 1, false));
  expect(state.game.round!.phase).toBe('ROUND_COMPLETE');
  for (const command of [g.hitOptionalHand, g.splitOptionalHand, g.doubleOptionalHand, g.surrenderOptionalHand]) {
    rejected(state, () => command(state, 1, state.game.round!.players[0].handId));
  }
  expect(pay(state).wagerResults.find((entry) => entry.type === 'PAIR')).toMatchObject({ grossReturnUnits: 140 });
});
reg([57, 58], 'purchase/decline preserves first action and late surrender', () => {
  for (const purchase of [true, false]) {
    const before = deal();
    const state = accepted(g.decideInsurance(before, 1, purchase));
    expect(state.game.shoe).toBe(before.game.shoe);
    expect(state.game.round!.players[0].decisionTaken).toBe(false);
    expect(state.game.round!.dealerNaturalExcluded).toBe(true);
    const surrendered = accepted(g.surrenderOptionalHand(state, 1, id(state)));
    expect(g.getOptionalMainResults(surrendered)[0]).toMatchObject({ outcome: 'SURRENDERED', grossReturnUnits: 100 });
  }
});
reg([63], 'pending proceeds cannot fund advanced action', () => {
  let state = accepted(g.setOptionalMainWager(optionalOpen(['8', '8', '8', '10']), 1, 1800));
  state = close(accepted(g.setSideWager(state, 1, 'THREE_CARD', 200)));
  expect(state.sideResults[0].grossReturnUnits).toBe(6200);
  expect(state.bankrolls[0].available).toBe(0);
  rejected(state, () => g.splitOptionalHand(state, 1, id(state)));
  rejected(state, () => g.doubleOptionalHand(state, 1, id(state)));
});
reg([64, 65, 66, 68, 70], 'VOID actual advanced and optional exposure once, no pending profit survives', () => {
  let state = accepted(g.decideInsurance(sides(['8', 'A', '8', '6', '3', '10', '2']), 1, true));
  state = accepted(g.splitOptionalHand(state, 1, id(state)));
  state = accepted(g.doubleOptionalHand(state, 1, id(state)));
  expect(state.bankrolls[0].reserved).toBe(740);
  const failed = accepted(g.hitOptionalHand(exhausted(state), 1, id(state)));
  expectAccounting(failed.game.shoe);
  expect(g.getOptionalWagerResults(failed)).toEqual([]);
  expect(failed.game.shoe.retired).toBe(true);
  const refunded = accepted(g.voidOptionalRound(failed));
  expect(refunded.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
  expect(refunded.wagerResults.map((entry) => entry.stakeUnits)).toEqual([400, 200, 20, 20, 100]);
  expect(refunded.wagerResults.every((entry) => entry.outcome === 'VOID' && entry.netUnits === 0
    && entry.grossReturnUnits === entry.stakeUnits)).toBe(true);
  rejected(refunded, () => g.voidOptionalRound(refunded));
  rejected(refunded, () => g.settleOptionalWagers(refunded));
});
reg([67], 'VOID removes Even Money and Insurance pending outcomes', () => {
  for (const choice of ['EVEN_MONEY', 'INSURANCE'] as const) {
    let state = optionalOpen(['A', '8', 'A', 'K', '8', '6'], [seat(1, 'HUMAN'), seat(2, 'COMPUTER')]);
    for (const number of [1, 2]) state = accepted(g.setOptionalMainWager(state, number, 200));
    state = close(state);
    state = choice === 'EVEN_MONEY' ? accepted(g.electEvenMoney(state, 1)) : accepted(g.decideInsurance(state, 1, true));
    const failed = accepted(g.advanceOptionalTable(exhausted(state)));
    const refunded = accepted(g.voidOptionalRound(failed));
    expect(refunded.bankrolls.every((entry) => entry.available === 2000 && entry.reserved === 0)).toBe(true);
    expect(refunded.wagerResults.every((entry) => entry.outcome === 'VOID' && entry.netUnits === 0)).toBe(true);
    expect(refunded.wagerResults).toHaveLength(choice === 'INSURANCE' ? 3 : 2);
  }
});
reg([69], 'duplicate settlement/VOID after committed normal round has no effect', () => {
  const final = pay(finish(sides()));
  rejected(final, () => g.settleOptionalWagers(final));
  rejected(final, () => g.voidOptionalRound(final));
  expect(final.wagerResults.every((entry) => entry.status === 'COMMITTED')).toBe(true);
});
reg([72], 'no M6 ownership or automatic computer side bet', () => {
  let state = optionalOpen(undefined, [seat(1, 'COMPUTER')]);
  state = accepted(g.setOptionalMainWager(state, 1, 200));
  expect(close(state).sideWagers).toEqual([]);
  state = accepted(g.setSideWager(state, 1, 'PAIR', 20));
  expect(Object.keys(state.sideWagers[0]).sort()).toEqual(['seatNumber', 'stakeUnits', 'type']);
  expect(Object.keys(g).some((key) => /behind|follower|backbet|charlie/i.test(key))).toBe(false);
});
it('REG-M5 mapping has exactly 001..072 once each', () => {
  expect([...mapped].sort((a, b) => a - b)).toEqual(Array.from({ length: 72 }, (_, i) => i + 1));
  expect(new Set(mapped).size).toBe(72);
});
