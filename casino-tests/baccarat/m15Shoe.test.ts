import { expect, it } from 'vitest';
import { applyCommand, createBaccarat, digest, publicView } from '../../src/baccarat/domain/engine.js';
import { DEFAULT_RULES, validateRules } from '../../src/baccarat/domain/config.js';
import { createShoe, burnValue, mayBeginRound } from '../../src/baccarat/domain/shoe.js';
import { value } from '../../src/baccarat/domain/rules.js';
import { exportReplay, replay } from '../../src/baccarat/domain/replay.js';
import { send } from './fixtures.js';
import { fixture, RANKS, BURN } from './m15Fixtures.js';

it.each(RANKS.map((rank,index) => [rank,BURN[index]] as const))('[M15-S01-%s] independent indicator/additional/total burn and unavailable burned cards', (rank,count) => {
  let state = fixture(['8','4','K','2','7','7'],rank);
  expect(state.shoe.initialSize).toBe(416);expect(state.shoe.indicator?.rank).toBe(rank);
  expect([state.shoe.burnCount,state.shoe.totalBurned,state.shoe.cursor]).toEqual([count,count+1,count+1]);
  expect(publicView(state).remainingCards).toBe(415-count);expect(state.shoe.cutPosition).toBe(402);
  expect(burnValue(rank)).toBe(count);if (['10','J','Q','K'].includes(rank)) expect(value(rank)).toBe(0);
  const burned = new Set(state.shoe.cards.slice(0,count+1).map(card=>card.id));
  state = send(send(state,{type:'WAGER',target:'PLAYER',amountUnits:100}),{type:'DEAL'});
  expect(state.round?.player.map(card=>card.rank)).toEqual(['8','K']);
  expect(state.round!.draws.every(draw=>!burned.has(draw.card.id))).toBe(true);
});
it('[M15-S02] explicit configurable rules, no burn, cut boundary and immutable defaults', () => {
  const shoe = createShoe(3,0,undefined,{...DEFAULT_RULES,deckCount:1,burnEnabled:false,cutCardReserve:7});
  expect([shoe.initialSize,shoe.cursor,shoe.indicator,shoe.totalBurned,shoe.cutPosition]).toEqual([52,0,null,0,45]);
  expect(Object.isFrozen(DEFAULT_RULES)).toBe(true);expect(Object.isFrozen(createBaccarat(1).configuration.rules)).toBe(true);
  for (const rules of [{...DEFAULT_RULES,deckCount:0},{...DEFAULT_RULES,burnEnabled:1},{...DEFAULT_RULES,cutCardReserve:400},{...DEFAULT_RULES,playerPairProfit:1.5},{...DEFAULT_RULES,hidden:true}]) expect(()=>validateRules(rules as typeof DEFAULT_RULES)).toThrow();
  expect(()=>burnValue('bad' as 'A')).toThrow();
});
it('[M15-S03] six-card valid round reaches cut, resolves and commits before closing; next starts/burns new shoe preserving money/history', () => {
  let state = fixture(['7','K','7','K','K','4'],'K',{...DEFAULT_RULES,cutCardReserve:399});
  expect([state.shoe.cursor,state.shoe.cutPosition,mayBeginRound(state.shoe)]).toEqual([11,17,true]);
  state = send(send(state,{type:'WAGER',target:'PLAYER_PAIR',amountUnits:1000}),{type:'DEAL'});
  expect([state.phase,state.shoe.cursor,state.shoe.cutReached,state.shoe.status,state.round?.draws.length]).toEqual(['RESOLVED',17,true,'CLOSING',6]);
  expect(state.pendingUnits).toBe(12000);expect(state.history).toHaveLength(0);expect(mayBeginRound(state.shoe)).toBe(false);
  expect(applyCommand(state,{type:'DEAL',roundId:state.roundId,requestId:'late'}).ok).toBe(false);
  state = send(state,{type:'COMMIT'});expect(state.shoe.status).toBe('CLOSED');expect(state.availableUnits).toBe(111000);
  const history = state.history, oldId = state.shoe.id, balance = state.availableUnits;
  state = send(state,{type:'NEXT'});
  expect([state.shoe.ordinal,state.shoe.roundNumber,state.shoe.status,state.shoe.cutReached,state.availableUnits]).toEqual([1,0,'PLAYABLE',false,balance]);
  expect(state.shoe.id).not.toBe(oldId);expect(state.shoe.cursor).toBe(state.shoe.totalBurned);expect(state.shoe.totalBurned).toBeGreaterThanOrEqual(2);
  expect(state.history).toBe(history);expect(Object.isFrozen(history[0])).toBe(true);
  expect(history[0]).toEqual({id:'baccarat-1',playerTotal:4,bankerTotal:4,winner:'TIE',tie:true,playerPair:true,bankerPair:true,shoeId:oldId,shoeRoundNumber:1});
  expect(replay(exportReplay(state)).digest).toBe(digest(state));
});
it('[M15-S04] maximum-six safety is independent of cut realism and blocks unsafe ordinary Deal', () => {
  let state=createBaccarat(1,100000,undefined,{...DEFAULT_RULES,deckCount:1,burnEnabled:false,cutCardReserve:0});
  state=send(state,{type:'WAGER',target:'PLAYER',amountUnits:100});
  const unsafe={...state,shoe:Object.freeze({...state.shoe,cursor:47})};
  expect(mayBeginRound(unsafe.shoe)).toBe(false);
  const rejected=applyCommand(unsafe,{type:'DEAL',roundId:state.roundId,requestId:'unsafe'});
  expect(rejected.ok).toBe(false);expect(rejected.state).toBe(unsafe);
  const exact={...state,shoe:Object.freeze({...state.shoe,cursor:46})};
  expect(mayBeginRound(exact.shoe)).toBe(true);expect(send(exact,{type:'DEAL'}).phase).toBe('RESOLVED');
});
it('[M15-S05] public projection never leaks future identities/order, only exposed burn indicator and completed cards', () => {
  const state=createBaccarat(77),view=publicView(state),text=JSON.stringify(view);
  for(const hidden of ['orderedIds','deckIndex','seed','cursor','configuration',state.shoe.cards.at(-1)!.id]) expect(text).not.toContain(hidden);
  expect(view.shoe.indicator).toEqual({rank:state.shoe.indicator!.rank,suit:state.shoe.indicator!.suit});
  expect(view.shoe.mayBeginRound).toBe(true);expect(view.shoe.generation).toBe(1);
});
it('[M15-S06] deterministic multi-shoe replay, closed-shoe repeat, unique consumed cards and immutable history', () => {
  let state=createBaccarat(81),ids=new Set<string>(),generation=0;
  for(let round=0;round<180;round++){
    if(state.shoe.ordinal!==generation){ids=new Set();generation=state.shoe.ordinal;}
    for(const card of state.shoe.cards.slice(0,state.shoe.totalBurned))ids.add(card.id);
    state=send(state,{type:'WAGER',target:'BANKER',amountUnits:100});
    state=send(state,{type:'WAGER',target:'PLAYER_PAIR',amountUnits:100});
    state=send(state,{type:'WAGER',target:'BANKER_PAIR',amountUnits:100});
    state=send(state,{type:'DEAL'});
    for(const draw of state.round!.draws){expect(ids.has(draw.card.id)).toBe(false);ids.add(draw.card.id);}
    state=send(state,{type:'COMMIT'});if(round<179)state=send(state,{type:'NEXT'});
  }
  expect(state.shoe.ordinal).toBeGreaterThan(0);expect(state.history).toHaveLength(180);
  const rebuilt=replay(JSON.parse(JSON.stringify(exportReplay(state))),()=> '2026-10-08T00:00:00.000Z');
  expect(rebuilt.state.shoe).toEqual(state.shoe);expect(rebuilt.state.history).toEqual(state.history);expect(rebuilt.digest).toBe(digest(state));
  const altered={...state,shoe:{...state.shoe,burnCount:state.shoe.burnCount+1}};expect(digest(altered)).not.toBe(digest(state));
  const replayData=JSON.parse(JSON.stringify(exportReplay(state)));replayData.configuration.rules.playerPairProfit=10;
  expect(()=>replay(replayData)).toThrow(/digest/);
});
it('[M15-S07] corrupted audit metadata is an integrity fault with explicit refund, never a gameplay loss', () => {
  const funded=send(fixture(['8','4','K','2']),{type:'WAGER',target:'PLAYER_PAIR',amountUnits:1000});
  for(const change of [{burnCount:0},{totalBurned:12},{cutPosition:403},{initialSize:415},{id:'fake'},{indicator:funded.shoe.cards.at(-1)!}]){
    let state=send({...funded,shoe:{...funded.shoe,...change}},{type:'DEAL'});
    expect([state.phase,state.availableUnits,state.reservedUnits,state.pendingUnits,state.round]).toEqual(['INTEGRITY_ERROR',99000,1000,0,null]);
    state=send(state,{type:'VOID'});expect(state.availableUnits).toBe(100000);expect(state.history).toHaveLength(0);
    state=send(state,{type:'NEXT'});expect(state.shoe.id).toBe('baccarat-shoe-2');expect(state.shoe.status).toBe('PLAYABLE');
  }
});
