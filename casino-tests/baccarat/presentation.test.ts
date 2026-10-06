import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createBaccaratController } from '../../src/baccarat/controller.js';
import { createBaccarat } from '../../src/baccarat/domain/engine.js';
import { replay } from '../../src/baccarat/domain/replay.js';
import { baccaratFacts } from '../../src/baccarat/presentation/facts.js';
import { createBaccaratPresentationRuntime } from '../../src/baccarat/presentation/runtime.js';
import { consumePresentation } from '../../src/ui/PresentationProvider.js';
import type { PresentationEvent } from '../../src/presentation/events.js';
import { ordered } from './fixtures.js';

function controller(numbers = [5,5,0,0,4,2]) {
  const value = createBaccaratController(createBaccarat(77,100000,ordered(numbers)));
  for (const target of ['PLAYER','BANKER','TIE'] as const) expect(value.dispatch({ type: 'WAGER', target, amountUnits: 100 }).ok).toBe(true);
  expect(value.dispatch({ type: 'DEAL' }).ok).toBe(true); return value;
}
const first = ['PLAYER:0','BANKER:0','PLAYER:1','BANKER:1'];
for (const [name,numbers,extra] of [
  ['four',[6,7,0,0,9,9],[]], ['natural',[8,4,0,0,7,7],[]],
  ['Player third',[5,7,0,0,4,9],['PLAYER:2']], ['Banker third',[7,5,0,0,2,9],['BANKER:2']],
  ['both thirds',[5,5,0,0,4,2],['PLAYER:2','BANKER:2']],
] as const) it(`[M14-U01-${name}] copies literal resolved order and public faces`, () => {
  const value=controller([...numbers]),view=value.getSnapshot(),facts=baccaratFacts(view.round!);
  const draws=facts.filter(event=>event.type==='DEAL_CARD');
  expect(draws.map(event=>`${event.card.owner===0?'PLAYER':'BANKER'}:${event.card.index}`)).toEqual([...first,...extra]);
  expect(draws.map(event=>event.reason)).toEqual([...first.map(()=>'INITIAL'),...extra.map(()=>'SUPPLEMENT')]);
  expect(draws.map(event=>event.face)).toEqual(view.round!.draws.map(draw=>draw.card));
  expect(JSON.stringify(facts)).not.toMatch(/deckIndex|physical|REVEAL_HOLE_CARD/);
  expect(facts.slice(draws.length).map(event=>event.type)).toEqual(['SETTLE_RESULT','SETTLE_RESULT','SETTLE_RESULT']);
});
it('[M14-U02] literal cent-precise Banker win and Tie push settlement facts', () => {
  const banker=controller([3,9,0,0,7,7]),tie=controller([8,8,0,0,7,7]);
  for(const [value,amounts,results] of [[banker,[0,195,0],['LOSS','WIN','LOSS']],[tie,[100,100,900],['PUSH','PUSH','WIN']]] as const){
    const facts=baccaratFacts(value.getSnapshot().round!).filter(event=>event.type==='SETTLE_RESULT');
    expect(facts.map(event=>event.returned)).toEqual(amounts);expect(facts.map(event=>event.outcome)).toEqual(results);
    expect(facts.map(event=>[event.seat,event.stake,event.returnTo])).toEqual([[0,100,'local-credits'],[1,100,'local-credits'],[2,100,'local-credits']]);
  }
});
for(const mode of ['REDUCED_MOTION','IMMEDIATE'] as const)it(`[M14-U03-${mode}] settles without visual player or authority mutation`,()=>{
  const value=controller(),before={view:value.getSnapshot(),digest:value.getDigest(),replay:value.exportReplay()},played:PresentationEvent[]=[];
  const runtime=createBaccaratPresentationRuntime(event=>{played.push(event);});
  consumePresentation(value.presentation,runtime,mode);
  expect(played).toEqual([]);expect(runtime.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0});
  expect(value.getSnapshot()).toBe(before.view);expect(value.getDigest()).toBe(before.digest);expect(value.exportReplay()).toEqual(before.replay);
  expect(replay(before.replay).digest).toBe(before.digest);
});
for(const stopAt of [0,4,5,6])it(`[M14-U04-${stopAt}] skip initial/P3/B3/settlement and ignore late completion`,async()=>{
  const value=controller(),before={view:value.getSnapshot(),digest:value.getDigest(),replay:value.exportReplay()};
  const completions:(()=>void)[]=[],played:PresentationEvent[]=[],cancelled:string[]=[],settled:string[]=[];
  const runtime=createBaccaratPresentationRuntime(event=>{
    played.push(event);return {finished:new Promise<void>(resolve=>completions.push(resolve)),cancel:()=>{cancelled.push(event.id);},settle:()=>{settled.push(event.id);}};
  });
  consumePresentation(value.presentation,runtime,'FULL_MOTION');
  for(let index=0;index<stopAt;index++){completions[index]!();await Promise.resolve();await Promise.resolve();}
  expect(played).toHaveLength(stopAt+1);expect(value.getSnapshot().phase).toBe('COMPLETE');
  runtime.timeline.skip();completions[stopAt]!();await Promise.resolve();await Promise.resolve();
  expect(played).toHaveLength(stopAt+1);expect(cancelled).toHaveLength(1);expect(settled).toHaveLength(stopAt+1);
  expect(runtime.initialDeal.getSnapshot().pending).toEqual([]);expect(runtime.playerActions.getSnapshot().pending).toEqual([]);expect(runtime.wagers.getSnapshot().pending).toEqual([]);
  expect(runtime.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0,fault:''});
  expect(value.getSnapshot()).toBe(before.view);expect(value.getDigest()).toBe(before.digest);expect(value.exportReplay()).toEqual(before.replay);
});
it('[M14-U05] new generation and disposal invalidate outstanding visual completion',async()=>{
  const value=controller(),completions:(()=>void)[]=[],played:string[]=[];
  const runtime=createBaccaratPresentationRuntime(event=>{played.push(event.id);return{finished:new Promise<void>(resolve=>completions.push(resolve)),cancel(){},settle(){}};});
  consumePresentation(value.presentation,runtime,'FULL_MOTION');const generation=runtime.timeline.getSnapshot().generation;
  expect(value.dispatch({type:'NEXT'}).ok).toBe(true);consumePresentation(value.presentation,runtime,'FULL_MOTION');
  expect(runtime.timeline.getSnapshot().generation).toBeGreaterThan(generation);completions[0]!();await Promise.resolve();
  expect(played).toHaveLength(1);expect(runtime.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0});
  runtime.timeline.dispose();expect(value.getSnapshot().phase).toBe('BETTING');
});
it('[M14-U06] mapping/player contain no rule or command capability and rejected intent emits no batch',()=>{
  for(const file of ['src/baccarat/presentation/facts.ts','src/baccarat/presentation/runtime.ts']){
    const source=readFileSync(file,'utf8');expect(source).not.toMatch(/applyCommand|dispatch\(|resolveRound|bankerDraws|playerDraws|grossReturn/);
    expect(source).not.toMatch(/import\s+(?!type\b)[^;]+from\s+['"][^'"]*domain\/rules\.js/);
  }
  const value=controller(),before=value.presentation.getSnapshot();expect(value.dispatch({type:'DEAL'}).ok).toBe(false);
  expect(value.presentation.getSnapshot()).toBe(before);
});
