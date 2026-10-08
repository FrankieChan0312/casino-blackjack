import { expect, it } from 'vitest';
import { applyCommand, digest, publicView, type State, type Command } from '../../src/baccarat/domain/engine.js';
import { inventory, createShoe, validateInventory } from '../../src/baccarat/domain/shoe.js';
import { clock, ordered, send, createLegacyBaccarat as createBaccarat } from './fixtures.js';
const bet = (state: State, target: 'PLAYER'|'BANKER'|'TIE', amountUnits=2500) => send(state,{type:'WAGER',target,amountUnits});

it('[M12-E01] independent8x4x13 inventory count, frozen cards, deterministic separate seeded shoes', () => {
  const cards=inventory();expect(cards).toHaveLength(416);expect(new Set(cards.map(card=>card.id)).size).toBe(416);
  for(let deck=1;deck<=8;deck++)expect(cards.filter(card=>card.deckIndex===deck)).toHaveLength(52);
  for(const suit of ['clubs','diamonds','hearts','spades'])expect(cards.filter(card=>card.suit===suit)).toHaveLength(104);
  for(const rank of ['A','2','3','4','5','6','7','8','9','10','J','Q','K'])expect(cards.filter(card=>card.rank===rank)).toHaveLength(32);
  expect(Object.isFrozen(cards)).toBe(true);expect(cards.every(Object.isFrozen)).toBe(true);
  expect(createShoe(123)).toEqual(createShoe(123));expect(createShoe(123).cards).not.toEqual(createShoe(124).cards);
  expect(createShoe(123,1).cards).not.toEqual(createShoe(123,0).cards);
  expect(()=>validateInventory([...cards.slice(1),cards[1]])).toThrow();
  expect(()=>createBaccarat(-1)).toThrow();expect(()=>createBaccarat(1,-1)).toThrow();
});
it('[M12-E02] independent targets reserve only deltas; cancelling and Clear return exact exposure', () => {
  let state=createBaccarat(1);state=bet(state,'PLAYER');state=bet(state,'BANKER');state=bet(state,'TIE');
  expect([state.availableUnits,state.reservedUnits,state.pendingUnits]).toEqual([92500,7500,0]);
  state=bet(state,'PLAYER',1000);expect([state.availableUnits,state.reservedUnits]).toEqual([94000,6000]);
  state=bet(state,'BANKER',0);expect([state.availableUnits,state.reservedUnits]).toEqual([96500,3500]);
  state=send(state,{type:'CLEAR'});expect([state.availableUnits,state.reservedUnits,state.wagers]).toEqual([100000,0,{PLAYER:0,BANKER:0,TIE:0}]);
});
it('[M12-E03] rejected funding/value/stale/duplicate/phase intents preserve complete state and shoe', () => {
  const state=bet(createBaccarat(1),'PLAYER',100000),common={roundId:state.roundId,requestId:'new'};
  for(const amountUnits of [2500,-100,1,101,100001,NaN]){
    const result=applyCommand(state,{...common,type:'WAGER',target:'TIE',amountUnits},clock);
    expect(result.ok).toBe(false);expect(result.state).toBe(state);
  }
  for(const command of [
    {...common,type:'WAGER',target:'OTHER',amountUnits:100},
    {...common,type:'WAGER',target:'TIE',amountUnits:100,roundId:'stale'},
    {...common,type:'CLEAR',requestId:'c1'},
    {...common,type:'COMMIT'}, {...common,type:'VOID'}, {...common,type:'NEXT'},
    {...common,type:'CLEAR',requestId:undefined}, {...common,type:'CLEAR',viewport:320},
  ]){const result=applyCommand(state,command as Command,clock);expect(result.ok).toBe(false);expect(result.state).toBe(state);}
  expect(applyCommand(createBaccarat(1),{type:'DEAL',requestId:'no-bet',roundId:'baccarat-1'}).ok).toBe(false);
});
it.each([
  [[8,4,0,0,7,7],'PLAYER',102500,5000],
  [[3,9,0,0,7,7],'BANKER',102375,4875],
  [[8,8,0,0,7,7],'TIE',120000,22500],
] as const)('[M12-E04] exact reserve -> pending -> once-only commit %s', (numbers,target,available,gross) => {
  let state=bet(createBaccarat(7,100000,ordered(numbers)),target);
  state=send(state,{type:'DEAL'});expect(state.phase).toBe('RESOLVED');
  expect([state.availableUnits,state.reservedUnits,state.pendingUnits]).toEqual([97500,2500,gross]);
  const cursor=state.shoe.cursor;expect(cursor).toBe(4);
  expect(applyCommand(state,{type:'WAGER',target:'PLAYER',amountUnits:100,requestId:'closed',roundId:state.roundId}).ok).toBe(false);
  state=send(state,{type:'COMMIT'});expect([state.phase,state.availableUnits,state.reservedUnits,state.pendingUnits]).toEqual(['COMPLETE',available,0,0]);
  const rejected=applyCommand(state,{type:'COMMIT',requestId:'second',roundId:state.roundId});expect(rejected.ok).toBe(false);expect(rejected.state).toBe(state);
  state=send(state,{type:'NEXT'});expect(state.availableUnits).toBe(available);expect(state.shoe.cursor).toBe(cursor);expect(state.roundId).toBe('baccarat-2');
});
it('[M12-E05] simultaneous Tie returns both main stakes and exact8:1 Tie; Repeat reserves all three', () => {
  let state=createBaccarat(9,100000,ordered([8,8,0,0,7,7]));
  for(const target of ['PLAYER','BANKER','TIE'] as const)state=bet(state,target);
  state=send(state,{type:'DEAL'});expect(state.pendingUnits).toBe(27500);
  state=send(state,{type:'COMMIT'});expect(state.availableUnits).toBe(120000);
  state=send(state,{type:'REPEAT'});expect([state.availableUnits,state.reservedUnits,state.roundId]).toEqual([112500,7500,'baccarat-2']);
  expect(state.wagers).toEqual({PLAYER:2500,BANKER:2500,TIE:2500});
});
it('[M12-E06] Repeat is atomic on insufficient funds and never refills the bankroll', () => {
  let state=bet(createBaccarat(1,2500,ordered([3,9,0,0,7,7])),'PLAYER');state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});
  expect(state.availableUnits).toBe(0);
  const result=applyCommand(state,{type:'REPEAT',requestId:'poor-repeat',roundId:state.roundId});expect(result.ok).toBe(false);expect(result.state).toBe(state);
  expect(send(state,{type:'NEXT'}).availableUnits).toBe(0);
});
it('[M12-E07] six-card maximum consumes actual cards; minimum-six rollover happens before the next round', () => {
  let state=bet(createBaccarat(1,100000,ordered([5,5,0,0,4,2])),'PLAYER');state=send(state,{type:'DEAL'});
  expect(state.shoe.cursor).toBe(6);expect(state.round?.draws.map(draw=>draw.zone)).toEqual(['PLAYER','BANKER','PLAYER','BANKER','PLAYER','BANKER']);
  state=send(send(state,{type:'COMMIT'}),{type:'REPEAT'});
  const old=state.shoe;state=send({...state,shoe:Object.freeze({...old,cursor:411})},{type:'DEAL'});
  expect(state.shoe.ordinal).toBe(1);expect(state.shoe.cursor).toBeGreaterThanOrEqual(4);expect(state.shoe.cursor).toBeLessThanOrEqual(6);
  expect(state.shoe.cards).not.toEqual(old.cards);
  let exact=bet(createBaccarat(1),'PLAYER');exact=send({...exact,shoe:Object.freeze({...exact.shoe,cursor:410})},{type:'DEAL'});
  expect(exact.shoe.ordinal).toBe(0);expect(exact.shoe.cursor).toBeGreaterThanOrEqual(414);
});
it('[M12-E08] malformed shoe enters integrity error, explicit VOID refunds exactly once and retires shoe', () => {
  let state=bet(createBaccarat(1),'PLAYER');state=send({...state,shoe:{...state.shoe,cards:state.shoe.cards.slice(0,10)}},{type:'DEAL'});
  expect([state.phase,state.availableUnits,state.reservedUnits,state.pendingUnits,state.round]).toEqual(['INTEGRITY_ERROR',97500,2500,0,null]);
  expect(state.shoe.retired).toBe(true);state=send(state,{type:'VOID'});
  expect([state.phase,state.availableUnits,state.reservedUnits,state.pendingUnits,state.voided]).toEqual(['COMPLETE',100000,0,0,true]);
  const result=applyCommand(state,{type:'VOID',roundId:state.roundId,requestId:'second-void'});expect(result.ok).toBe(false);expect(result.state).toBe(state);
  state=send(send(state,{type:'REPEAT'}),{type:'DEAL'});expect(state.phase).toBe('RESOLVED');expect(state.shoe.ordinal).toBe(1);
});
it('[M12-E09] public state hides seed/future shoe/physical IDs; authority arrays and journal are immutable', () => {
  let state=bet(createBaccarat(43,100000,ordered([5,5,0,0,4,2])),'PLAYER');state=send(state,{type:'DEAL'});
  const view=publicView(state),text=JSON.stringify(view);
  for(const hidden of ['seed','orderedIds','deckIndex','1:clubs:5','cursor','configuration'])expect(text).not.toContain(hidden);
  expect(view.round?.draws.map(draw=>draw.card.rank)).toEqual(['5','5','K','K','4','2']);
  expect(state.journal.map(entry=>[entry.sequence,entry.type,entry.timestamp])).toEqual([[1,'WAGER',clock()],[2,'DEAL',clock()]]);
  expect(Object.isFrozen(state.commands)).toBe(true);expect(Object.isFrozen(view.round?.player)).toBe(true);
  expect(()=>applyCommand(state,{type:'COMMIT',requestId:'clock',roundId:state.roundId},()=> 'invalid')).toThrow(/clock/);
  expect(digest(state)).toMatch(/^fnv1a32-v1:[0-9a-f]{8}$/);
});
it('[M12-E10] eighty seeded sessions preserve exact exposure/unique draws across twenty sequential rounds', () => {
  for(let seed=0;seed<80;seed++){
    let state=createBaccarat(seed),ids=new Set<string>(),ordinal=0;
    for(let round=0;round<20;round++){
      state=bet(state,['PLAYER','BANKER','TIE'][round%3] as 'PLAYER'|'BANKER'|'TIE',100);
      expect(state.reservedUnits).toBe(100);state=send(state,{type:'DEAL'});
      if(state.shoe.ordinal!==ordinal){ids=new Set();ordinal=state.shoe.ordinal;}
      for(const draw of state.round!.draws){expect(ids.has(draw.card.id)).toBe(false);ids.add(draw.card.id);}
      const previous=state.availableUnits,pending=state.pendingUnits;state=send(state,{type:'COMMIT'});
      expect(state.availableUnits).toBe(previous+pending);expect(state.reservedUnits+state.pendingUnits).toBe(0);
      if(round<19)state=send(state,{type:'NEXT'});
    }
  }
});
