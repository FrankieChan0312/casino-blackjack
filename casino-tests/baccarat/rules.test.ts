import { expect, it } from 'vitest';
import { bankerDraws, playerDraws, resolveRound, settleWagers, total, value } from '../../src/baccarat/domain/rules.js';
import { cards } from './fixtures.js';

it('[M12-R01] thirteen ranks and explicit modulo examples', () => {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
  expect(ranks.map(value)).toEqual([1,2,3,4,5,6,7,8,9,0,0,0,0]);
  expect(total(cards([7,8]))).toBe(5); expect(total(cards([0,9]))).toBe(9); expect(total(cards([1,4,8]))).toBe(3);
  expect(Array.from({ length: 10 }, (_, n) => playerDraws(n))).toEqual([true,true,true,true,true,true,false,false,false,false]);
  for (const number of [-1, 10, 1.5, NaN]) { expect(() => playerDraws(number)).toThrow(); expect(() => bankerDraws(number, 0)).toThrow(); }
  expect(() => bankerDraws(4, 10)).toThrow();
});
it.each([
  [[8,4,0,0,7,7], 'PLAYER', 4, 'NATURAL', 'NATURAL', 8,4],
  [[3,9,0,0,7,7], 'BANKER', 4, 'NATURAL', 'NATURAL', 3,9],
  [[8,8,0,0,7,7], 'TIE', 4, 'NATURAL', 'NATURAL', 8,8],
  [[6,7,0,0,9,9], 'BANKER', 4, 'STAND', 'STAND', 6,7],
  [[5,7,0,0,4,9], 'PLAYER', 5, 'DRAW', 'STAND', 9,7],
  [[7,5,0,0,2,9], 'TIE', 5, 'STAND', 'DRAW', 7,7],
  [[5,5,0,0,4,2], 'PLAYER', 6, 'DRAW', 'DRAW', 9,7],
] as const)('[M12-R02] explicit round %j', (numbers, outcome, count, playerDecision, bankerDecision, playerTotal, bankerTotal) => {
  const round = resolveRound('example', cards(numbers));
  expect([round.outcome, round.draws.length, round.playerDecision, round.bankerDecision, round.playerTotal, round.bankerTotal])
    .toEqual([outcome,count,playerDecision,bankerDecision,playerTotal,bankerTotal]);
  expect(round.draws.slice(0,4).map(draw => draw.zone)).toEqual(['PLAYER','BANKER','PLAYER','BANKER']);
});
it('[M12-R03] independent gross/net payout examples include commission and main pushes', () => {
  const wagers = { PLAYER: 2500, BANKER: 2500, TIE: 2500 };
  expect(settleWagers(wagers, 'PLAYER').map(result => [result.grossUnits,result.netUnits,result.result]))
    .toEqual([[5000,2500,'WIN'],[0,-2500,'LOSS'],[0,-2500,'LOSS']]);
  expect(settleWagers(wagers, 'BANKER').map(result => [result.grossUnits,result.netUnits,result.result]))
    .toEqual([[0,-2500,'LOSS'],[4875,2375,'WIN'],[0,-2500,'LOSS']]);
  expect(settleWagers(wagers, 'TIE').map(result => [result.grossUnits,result.netUnits,result.result]))
    .toEqual([[2500,0,'PUSH'],[2500,0,'PUSH'],[22500,20000,'WIN']]);
  expect(settleWagers({PLAYER:0,BANKER:100,TIE:0},'BANKER')[0].grossUnits).toBe(195);
  expect(settleWagers({PLAYER:0,BANKER:100000,TIE:0},'BANKER')[0].grossUnits).toBe(195000);
  for (const stake of [-100, 1, 101, 100001, NaN]) expect(() => settleWagers({PLAYER:stake,BANKER:0,TIE:0},'PLAYER')).toThrow();
});
it('[M12-R04] invalid/duplicate or missing consumed cards are integrity failures', () => {
  expect(() => resolveRound('missing', cards([5,5,0,0]))).toThrow(/integrity/);
  const prefix = cards([5,5,0,0,4,2]); expect(() => resolveRound('duplicate', [prefix[0],prefix[0],...prefix.slice(2)])).toThrow(/integrity/);
  expect(Object.isFrozen(resolveRound('immutable', prefix).player[0])).toBe(true);
});
