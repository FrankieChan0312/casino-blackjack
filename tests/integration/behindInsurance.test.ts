import { afterEach, expect, it, vi } from 'vitest';
import * as handModule from '../../src/domain/hand.js';
import * as game from '../../src/domain/behindGame.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import { beginControllerSplit, decideSplitFollow } from '../../src/domain/behindController.js';
import { accepted, backedGame, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());
it.each(['K', '6'] as const)('follower Insurance with hole %s settles own stake independently of controller decline', (hole) => {
  let state = backedGame(['8', 'A', '8', hole]);
  expect(state.table.peekPerformed).toBe(false);
  expect(state.table.insuranceDecisions[0].choice).toBe('DECLINE');
  expect(state.backInsurance[0].choice).toBe('PENDING');
  state = accepted(game.decideBackInsurance(state, 1, 'INSURANCE'));
  expect(state.human!.bankroll).toEqual({ available: 1700, reserved: 300 });
  expect(state.computers[0].bankroll).toEqual({ available: 1800, reserved: 200 });
  expect(state.backInsurance[0]).toMatchObject({ choice: 'INSURANCE', stakeUnits: 100, outcome: hole === 'K' ? 'WIN' : 'LOSS' });
  if (hole === '6') state = accepted(game.advanceBehindTable(state));
  state = accepted(game.settleBehindWagers(state));
  expect(state.backResults.find((entry) => entry.wagerId.endsWith('/INSURANCE')))
    .toMatchObject({ grossReturnUnits: hole === 'K' ? 300 : 0, status: 'COMMITTED' });
});
it.each(['K', '6'] as const)('follower Even Money independent of controller decline, hole %s, no additional reserve', (hole) => {
  let state = backedGame(['A', 'A', 'K', hole]);
  const bankroll = state.human!.bankroll;
  state = accepted(game.decideBackInsurance(state, 1, 'EVEN_MONEY'));
  expect(state.human!.bankroll).toEqual(bankroll);
  expect(game.getBackResults(state)).toHaveLength(1);
  expect(game.getBackResults(state)[0]).toMatchObject({ outcome: 'EVEN_MONEY', grossReturnUnits: 400 });
  expect(state.table.game.round!.players[0].outcome).toBe(hole === 'K' ? 'PUSH' : 'PLAYER_BLACKJACK');
  expect(game.decideBackInsurance(state, 1, 'INSURANCE').state).toBe(state);
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll).toEqual({ available: 2200, reserved: 0 });
  expect(state.computers[0].bankroll.available).toBe(hole === 'K' ? 2000 : 2300);
});
it('exact odd-unit Insurance succeeds; insufficient request is unchanged and does not close other decisions', () => {
  const dealt = backedGame(['8', 'A', '8', '6'], 50);
  const short = { ...dealt, human: { ...dealt.human!, bankroll: { available: 24, reserved: 50 } } };
  expect(game.decideBackInsurance(short, 1, 'INSURANCE')).toEqual({ ok: false, state: short, error: 'INSUFFICIENT_FUNDS' });
  expect(short.table.peekPerformed).toBe(false);
  expect(short.table.insuranceDecisions[0].choice).toBe('DECLINE');
  const exact = { ...short, human: { ...short.human!, bankroll: { available: 25, reserved: 50 } } };
  const state = accepted(game.decideBackInsurance(exact, 1, 'INSURANCE'));
  expect(state.human!.bankroll).toEqual({ available: 0, reserved: 75 });
  expect(state.backInsurance[0].stakeUnits).toBe(25);
});
it('own MAIN then ascending backed targets; actual hole evaluation waits until all decisions close', () => {
  const evaluate = vi.spyOn(handModule, 'isNaturalBlackjack');
  let state = accepted(game.openBehindBetting(behindFixture(['A', '8', '9', 'A', 'K', '8', '9', '6'],
    [seat(1, 'HUMAN'), seat(3), seat(7)])));
  for (const target of [1, 3, 7]) state = accepted(game.setBehindMainWager(state, target, 200));
  state = accepted(game.setBackWager(state, 7, 100));
  state = accepted(game.setBackWager(state, 3, 50));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  const hole = state.table.game.round!.dealerCards[1];
  const peeks = () => evaluate.mock.calls.filter(([cards]) => cards.some((card) => card.id === hole.id)).length;
  expect(peeks()).toBe(0);
  expect(game.decideBackInsurance(state, 3, 'INSURANCE').state).toBe(state);
  state = accepted(game.electBehindMainEvenMoney(state));
  expect(peeks()).toBe(0);
  expect(game.decideBackInsurance(state, 7, 'DECLINE').ok).toBe(false);
  state = accepted(game.decideBackInsurance(state, 3, 'INSURANCE'));
  expect(peeks()).toBe(0);
  expect(game.decideBackInsurance(state, 3, 'EVEN_MONEY').ok).toBe(false);
  state = accepted(game.decideBackInsurance(state, 7, 'DECLINE'));
  expect(peeks()).toBe(1);
  expect(state.table.peekPerformed).toBe(true);
  expect(state.table.insuranceDecisions.find((entry) => entry.seatNumber === 1)!.choice).toBe('EVEN_MONEY');
  expect(state.backInsurance.map((entry) => [entry.targetSeat, entry.choice])).toEqual([[3, 'INSURANCE'], [7, 'DECLINE']]);
  expect(getPublicBehindView(state).round!.dealer.holeCard).toBeNull();
  expect(state.human!.bankroll).toEqual({ available: 1625, reserved: 375 });
});
it('own Insurance and follower Even Money use independent stakes and choices', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['8', 'A', 'A', '8', 'K', 'K'], [seat(1, 'HUMAN'), seat(2)])));
  for (const target of [1, 2]) state = accepted(game.setBehindMainWager(state, target, 200));
  state = accepted(game.setBackWager(state, 2, 50));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(game.decideBehindMainInsurance(state, true));
  expect(state.table.peekPerformed).toBe(false);
  state = accepted(game.decideBackInsurance(state, 2, 'EVEN_MONEY'));
  state = accepted(game.settleBehindWagers(state));
  expect(state.human!.bankroll).toEqual({ available: 2050, reserved: 0 });
  expect(state.backResults[0]).toMatchObject({ outcome: 'EVEN_MONEY', grossReturnUnits: 100 });
});
it('no Even Money for non-Natural, no Insurance against ten, after peek, or after Split', () => {
  let state = backedGame(['8', 'A', '8', '6', '2']);
  expect(game.decideBackInsurance(state, 1, 'EVEN_MONEY').state).toBe(state);
  state = accepted(game.decideBackInsurance(state, 1, 'DECLINE'));
  expect(game.decideBackInsurance(state, 1, 'INSURANCE').state).toBe(state);
  state = accepted(beginControllerSplit(state, 'computer-1', 'round-1/seat-1'));
  state = accepted(decideSplitFollow(state, 'round-1/seat-1', 'ADD'));
  expect(game.decideBackInsurance(state, 1, 'INSURANCE').state).toBe(state);
  expect(state.backInsurance).toHaveLength(1);
  const ten = backedGame(['8', '10', '8', '6']);
  expect(ten.backInsurance).toEqual([]);
  expect(game.decideBackInsurance(ten, 1, 'INSURANCE').ok).toBe(false);
});
it.each(['K', '6'] as const)('declined Natural gets push/3:2 with hole %s', (hole) => {
  const state = accepted(game.decideBackInsurance(backedGame(['A', 'A', 'K', hole], 50), 1, 'DECLINE'));
  expect(game.getBackResults(state)[0]).toMatchObject({ grossReturnUnits: hole === 'K' ? 50 : 125 });
});
