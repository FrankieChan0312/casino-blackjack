import { expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_RULES } from '../../src/baccarat/domain/config.js';
import { burnValue, consumeRound, closeAfterSettlement, mayBeginRound } from '../../src/baccarat/domain/shoe.js';
import { resolveRound } from '../../src/baccarat/domain/rules.js';
import { fixture, RANKS, BURN } from './m15Fixtures.js';
import { send } from './fixtures.js';

const directory='.git/m15/validators';
it('[M15-V01] independent bounded shoe oracle: thirteen burns, literal boundary, round sizes4/5/6, closure and replacement', () => {
  const scenarios: unknown[]=[];
  for(let index=0;index<13;index++) {
    const initial=fixture(['8','4','K','2'],RANKS[index]);
    expect(burnValue(RANKS[index])).toBe(BURN[index]);expect(initial.shoe.cursor).toBe(BURN[index]+1);
    expect(initial.shoe.cutPosition).toBe(402);expect(initial.shoe.cards.length).toBe(416);
    for(const length of [4,5,6]) {
      const before={...initial.shoe,cursor:401};expect(mayBeginRound(before)).toBe(true);
      const resolved=consumeRound(before,length),closed=closeAfterSettlement(resolved);
      expect([resolved.cursor,resolved.cutReached,resolved.status]).toEqual([401+length,true,'CLOSING']);
      expect([closed.status,mayBeginRound(closed)]).toEqual(['CLOSED',false]);
      expect(416-closed.cursor).toBe(15-length);
      scenarios.push({indicator:RANKS[index],additional:BURN[index],total:BURN[index]+1,roundCards:length,endCursor:401+length});
    }
  }
  const rules={...DEFAULT_RULES,cutCardReserve:399};
  let state=fixture(['7','K','7','K','K','4'],'K',rules);
  state=send(state,{type:'WAGER',target:'TIE',amountUnits:1000});state=send(state,{type:'DEAL'});
  expect([state.shoe.cursor,state.shoe.status,state.pendingUnits]).toEqual([17,'CLOSING',9000]);
  state=send(state,{type:'COMMIT'});expect(state.availableUnits).toBe(108000);expect(state.shoe.status).toBe('CLOSED');
  state=send(state,{type:'REPEAT'});expect([state.shoe.ordinal,state.shoe.roundNumber,state.availableUnits,state.reservedUnits]).toEqual([1,0,107000,1000]);
  expect(state.shoe.id).toBe('baccarat-shoe-2');expect(state.shoe.cursor).toBeGreaterThanOrEqual(2);expect(state.shoe.cursor).toBeLessThanOrEqual(11);
  for(const remaining of [0,1,2,3,4,5,6]) expect(mayBeginRound({...state.shoe,cursor:416-remaining,cutPosition:416})).toBe(remaining===6);
  mkdirSync(directory,{recursive:true});writeFileSync(`${directory}/shoe.json`,JSON.stringify({status:'PASS',burnCategories:13,boundaryScenarios:39,safetyScenarios:7,transitionScenarios:1,scenarios},null,2)+'\n');
});
it('[M15-V02] independent ordered13×13 rank matrix for each side: exactly13 wins of169, separate from point values', () => {
  const counts={PLAYER:0,BANKER:0},rows:unknown[]=[];
  for(let first=0;first<13;first++)for(let second=0;second<13;second++) {
    // Oracle is index equality in the literal thirteen-rank alphabet, not production isPair/value.
    const expected=first===second;
    for(const side of ['PLAYER','BANKER'] as const) {
      const ranks=side==='PLAYER'?[RANKS[first],'8' as const,RANKS[second],'K' as const,'K' as const,'5' as const]
        :['8' as const,RANKS[first],'K' as const,RANKS[second],'K' as const,'5' as const];
      const state=fixture(ranks),round=resolveRound('matrix',state.shoe.cards.slice(11,17),{PLAYER:0,BANKER:0,TIE:0,[`${side}_PAIR`]:1000});
      const actual=side==='PLAYER'?round.playerPair:round.bankerPair;
      expect(actual).toBe(expected);expect(round.settlements[0].grossUnits).toBe(expected?12000:0);
      expect(round.settlements[0].netUnits).toBe(expected?11000:-1000);
      if(actual)counts[side]++;rows.push({side,first:RANKS[first],second:RANKS[second],expected,actual});
    }
  }
  expect(counts).toEqual({PLAYER:13,BANKER:13});
  mkdirSync(directory,{recursive:true});writeFileSync(`${directory}/pairs.json`,JSON.stringify({status:'PASS',orderedCombinationsPerSide:169,winningCombinationsPerSide:13,counts,rows},null,2)+'\n');
});
