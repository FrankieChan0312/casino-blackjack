import { expect, it } from 'vitest';
import { applyCommand, digest, publicView } from '../../src/baccarat/domain/engine.js';
import { DEFAULT_RULES } from '../../src/baccarat/domain/config.js';
import { isPair, resolveRound } from '../../src/baccarat/domain/rules.js';
import { replay, exportReplay } from '../../src/baccarat/domain/replay.js';
import { createBaccaratController } from '../../src/baccarat/controller.js';
import { baccaratFacts } from '../../src/baccarat/presentation/facts.js';
import { createBaccaratPresentationRuntime } from '../../src/baccarat/presentation/runtime.js';
import { consumePresentation } from '../../src/ui/PresentationProvider.js';
import { fixture } from './m15Fixtures.js';
import { send } from './fixtures.js';

it('[M15-B01] rank equality, suits irrelevant, point-zero ranks distinct, third cards irrelevant', () => {
  expect(isPair([{rank:'8'},{rank:'8'},{rank:'K'}])).toBe(true);
  for(const ranks of [['Q','K'],['10','J'],['8','K','8']] as const) expect(isPair(ranks.map(rank=>({rank})))).toBe(false);
  expect(isPair([])).toBe(false);expect(isPair([{rank:'A'}])).toBe(false);
  const base=fixture(['7','K','7','K','K','4']);
  const first=resolveRound('pair',base.shoe.cards.slice(11,17));
  expect([first.playerPair,first.bankerPair,first.draws.length,first.outcome]).toEqual([true,true,6,'TIE']);
  expect(first.player[0].suit).not.toBe(first.player[1].suit);
});
it.each([
  ['Player main win and pair win',['4','6','4','A','9','9'],'PLAYER',true,false,'PLAYER',2000,12000,0],
  ['Banker main loss and Player pair win',['4','6','4','A','9','9'],'BANKER',true,false,'PLAYER',0,12000,0],
  ['Main push and Banker pair win',['8','4','K','4','7','7'],'PLAYER',false,true,'TIE',1000,0,12000],
  ['Tie main and both pairs',['7','K','7','K','K','4'],'TIE',true,true,'TIE',9000,12000,12000],
  ['Pair losses',['8','4','K','2','7','7'],'PLAYER',false,false,'PLAYER',2000,0,0],
] as const)('[M15-B02-%s] independent settlements and exact profit/stake', (_name,ranks,target,playerPair,bankerPair,winner,main,playerGross,bankerGross) => {
  let state=fixture(ranks);for(const wager of [target,'PLAYER_PAIR','BANKER_PAIR'] as const)state=send(state,{type:'WAGER',target:wager,amountUnits:1000});
  expect([state.availableUnits,state.reservedUnits]).toEqual([97000,3000]);
  state=send(state,{type:'DEAL'});
  expect([state.round?.playerPair,state.round?.bankerPair,state.round?.outcome]).toEqual([playerPair,bankerPair,winner]);
  expect(state.round?.settlements.map(result=>result.grossUnits)).toEqual([main,playerGross,bankerGross]);
  expect(state.pendingUnits).toBe(main+playerGross+bankerGross);
  state=send(state,{type:'COMMIT'});expect(state.availableUnits).toBe(97000+main+playerGross+bankerGross);
  expect(replay(exportReplay(state)).digest).toBe(digest(state));
});
it('[M15-B03] side-only, optional absent/zero/one/both, immutable once-only settlement, configured paytable', () => {
  let state=fixture(['7','K','7','K','K','4'],'K',{...DEFAULT_RULES,playerPairProfit:3,bankerPairProfit:5});
  state=send(state,{type:'WAGER',target:'PLAYER_PAIR',amountUnits:1000});state=send(state,{type:'DEAL'});
  expect(state.pendingUnits).toBe(4000);expect(state.round?.settlements).toHaveLength(1);
  state=send(state,{type:'COMMIT'});const duplicate=applyCommand(state,{type:'COMMIT',roundId:state.roundId,requestId:'again'});
  expect(duplicate.ok).toBe(false);expect(duplicate.state).toBe(state);
  const noPairs=send(send(fixture(['7','K','7','K','K','4']),{type:'WAGER',target:'TIE',amountUnits:100}),{type:'DEAL'});
  expect(noPairs.round?.settlements).toHaveLength(1);expect(noPairs.round?.playerPair).toBe(true);
});
it('[M15-B04] exposure includes all components; single main/funding/invalid/late rejects atomically; Clear refunds all', () => {
  let state=fixture(['7','K','7','K','K','4'],'K',DEFAULT_RULES,3000);
  for(const target of ['PLAYER','PLAYER_PAIR','BANKER_PAIR'] as const)state=send(state,{type:'WAGER',target,amountUnits:1000});
  expect([state.availableUnits,state.reservedUnits]).toEqual([0,3000]);
  for(const [target,amountUnits] of [['BANKER',100],['PLAYER_PAIR',1100],['BANKER_PAIR',101],['PLAYER_PAIR',-100]] as const){
    const rejected=applyCommand(state,{type:'WAGER',target,amountUnits,roundId:state.roundId,requestId:'rejected'});
    expect(rejected.ok).toBe(false);expect(rejected.state).toBe(state);
  }
  state=send(state,{type:'CLEAR'});expect([state.availableUnits,state.reservedUnits]).toEqual([3000,0]);expect(Object.values(state.wagers).every(amount=>amount===0)).toBe(true);
});
it('[M15-B05] Repeat restores main and both pairs across new shoe; insufficient Repeat preserves every authority field', () => {
  let state=fixture(['7','K','7','K','K','4'],'K',{...DEFAULT_RULES,cutCardReserve:399});
  for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'] as const)state=send(state,{type:'WAGER',target,amountUnits:1000});
  state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});const previous=state.wagers;
  state=send(state,{type:'REPEAT'});expect(state.wagers).toEqual(previous);expect(state.reservedUnits).toBe(3000);expect(state.shoe.ordinal).toBe(1);
  let poor=fixture(['8','4','K','2','7','7'],'K',DEFAULT_RULES,3000);
  for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'] as const)poor=send(poor,{type:'WAGER',target,amountUnits:1000});
  poor=send(send(poor,{type:'DEAL'}),{type:'COMMIT'});expect(poor.availableUnits).toBe(0);
  const rejected=applyCommand(poor,{type:'REPEAT',roundId:poor.roundId,requestId:'poor'});expect(rejected.ok).toBe(false);expect(rejected.state).toBe(poor);
});
it('[M15-B06] observational Pair facts use exact authority amounts and equivalent FULL/REDUCED/IMMEDIATE/skip digests', () => {
  const controller=createBaccaratController(fixture(['7','K','7','K','K','4']));
  for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'] as const)expect(controller.dispatch({type:'WAGER',target,amountUnits:1000}).ok).toBe(true);
  expect(controller.dispatch({type:'DEAL'}).ok).toBe(true);const baseline=controller.getDigest();
  const facts=baccaratFacts(controller.getSnapshot().round!).filter(event=>event.type==='SETTLE_RESULT');
  expect(facts.map(event=>[event.kind,event.stake,event.returned])).toEqual([['BACCARAT_BANKER',1000,1000],['BACCARAT_PLAYER_PAIR',1000,12000],['BACCARAT_BANKER_PAIR',1000,12000]]);
  for(const mode of ['FULL_MOTION','REDUCED_MOTION','IMMEDIATE'] as const){
    const runtime=createBaccaratPresentationRuntime(()=>({finished:new Promise<void>(()=>{}),cancel(){},settle(){}}));
    consumePresentation(controller.presentation,runtime,mode);runtime.timeline.skip();expect(controller.getDigest()).toBe(baseline);
  }
  expect(replay(controller.exportReplay()).digest).toBe(baseline);expect(publicView(replay(controller.exportReplay()).state).history).toHaveLength(1);
});
