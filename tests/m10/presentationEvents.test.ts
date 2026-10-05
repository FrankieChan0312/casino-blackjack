import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createBrowserController, type BrowserController } from '../../src/browser/controller.js';
import { createPresentationTimeline, type PresentationMode } from '../../src/presentation/timeline.js';
import type { PresentationBatch, PresentationEvent } from '../../src/presentation/events.js';
import { createFixtureController, fixtureState, fixtureRandom } from '../browser/fixtures.js';
import { observePresentation } from '../../src/browser/presentationObserver.js';
import { applySessionCommand } from '../../src/domain/sessionCommand.js';
import { acceptedController } from './historicalConfiguration.js';

function collect(controller: BrowserController) {
  const batches: PresentationBatch[] = [];
  controller.presentation.acknowledge(controller.presentation.getSnapshot().revision);
  controller.presentation.subscribe(() => {
    const snapshot=controller.presentation.getSnapshot();batches.push(...snapshot.batches);controller.presentation.acknowledge(snapshot.revision);
  });
  return batches;
}
function dealEvents(batches: readonly PresentationBatch[]) { return batches.flatMap(b=>b.events).filter((e):e is Extract<PresentationEvent,{type:'DEAL_CARD'}>=>e.type==='DEAL_CARD'); }
const seats=[[4],[3,4],[3,4,6],[1,3,4,6],[1,3,4,5,6],[1,2,3,4,5,6],[1,2,3,4,5,6,7]];
for(let count=1;count<=7;count++)it(`[T05-E01-${count}] initial ${count}-player destinations use ascending funded two-pass order with anonymous hole slot`,()=>{
  const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7});c.dispatch({type:'START',count});const batches=collect(c);
  expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  const initial=dealEvents(batches).filter(e=>e.reason==='INITIAL');
  expect(initial.map(e=>e.card.owner)).toEqual([...seats[count-1],'dealer',...seats[count-1],'dealer']);
  expect(initial.map(e=>e.card.index)).toEqual([...Array(count+1).fill(0),...Array(count+1).fill(1)]);
  expect(initial.at(-1)?.face).toBeNull();expect(new Set(initial.map(e=>e.id)).size).toBe(2*count+2);
  expect(JSON.stringify(batches)).not.toMatch(/deckIndex|physicalCardId|shoeId|availableCards|"id":"\d+:(clubs|hearts|spades|diamonds)/);
});
it('[T05-E02] explicit public fixtures prove CLOSE and synchronous automatic STAND ordering before human input',()=>{
  const c=createFixtureController('player-split'),batches=collect(c);c.dispatch({type:'DEAL',amount:200});
  expect(dealEvents(batches).map(e=>`${e.card.owner}:${e.card.index}:${e.face?.rank??'hidden'}`)).toEqual([
    '1:0:10','3:0:10','4:0:8','6:0:10','dealer:0:10','1:1:7','3:1:7','4:1:8','6:1:7','dealer:1:hidden',
  ]);
  expect(batches.map(b=>b.command)).toEqual(['MAIN','CLOSE','ADVANCE']);
  expect(batches.at(-1)?.events.filter(e=>e.type==='PLAYER_ACTION').map(e=>[e.seat,e.action])).toEqual([[1,'STAND'],[3,'STAND']]);
  expect(batches.at(-1)?.events.at(-1)).toMatchObject({type:'DEALER_STATE',state:'WAITING_PLAYER'});
});
it('[T05-E03] Split retains literal old card slots and supplements children in actual depth-first order',()=>{
  const c=createFixtureController('player-split');c.dispatch({type:'DEAL',amount:200});const batches=collect(c);
  c.dispatch({type:'ACT',action:'SPLIT',handId:'round-1/seat-4'});
  const split=batches.flatMap(b=>b.events).find(e=>e.type==='SPLIT_HANDS');
  expect(split?.type==='SPLIT_HANDS'&&split.children.map(e=>[e.handId,e.retained.handId,e.retained.index,e.destination.index])).toEqual([
    ['round-1/seat-4.1','round-1/seat-4',0,0],['round-1/seat-4.2','round-1/seat-4',1,0],
  ]);
  expect(dealEvents(batches).map(e=>[e.card.handId,e.card.index,e.face?.rank,e.reason])).toEqual([['round-1/seat-4.1',1,'2','SUPPLEMENT']]);
  c.dispatch({type:'ACT',action:'STAND',handId:'round-1/seat-4.1'});
  expect(dealEvents(batches).map(e=>[e.card.handId,e.face?.rank])).toEqual([['round-1/seat-4.1','2'],['round-1/seat-4.2','3']]);
});
it('[T05-E04] atomic computer HIT/STAND uses ordered observations, then public reveal and Dealer draws',()=>{
  const c=createBrowserController({playerMode:true,factory:()=>fixtureState(['5','6','10','10','6','5','5','6','7','6','7','2','10','10']),random:fixtureRandom});
  const batches=collect(c);c.dispatch({type:'DEAL',amount:200});
  const automatic=batches.find(b=>b.command==='ADVANCE')!;
  expect(automatic.events.filter(e=>e.type==='PLAYER_ACTION').map(e=>[e.seat,e.action])).toEqual([[1,'HIT'],[1,'STAND'],[3,'HIT'],[3,'HIT']]);
  expect(dealEvents([automatic]).map(e=>[e.card.owner,e.face?.rank])).toEqual([[1,'7'],[3,'2'],[3,'10']]);
  c.dispatch({type:'ACT',action:'STAND',handId:'round-1/seat-4'});
  const final=batches.filter(b=>b.command==='ADVANCE').at(-1)!;
  expect(final.events.find(e=>e.type==='REVEAL_HOLE_CARD')).toMatchObject({face:{rank:'6',suit:'diamonds'}});
  expect(dealEvents([final]).filter(e=>e.reason==='DEALER').map(e=>e.face?.rank)).toEqual(['10']);
  expect(batches.at(-1)?.command).toBe('SETTLE');
  expect(batches.at(-1)?.events.some(e=>e.type==='DEALER_STATE'&&e.state==='SETTLING')).toBe(true);
});
it('[T05-E05] Double emits one new card, no new card on Stand, and committed result uses already-computed amounts',()=>{
  const c=createFixtureController('player-loss');c.dispatch({type:'DEAL',amount:200});const batches=collect(c);
  c.dispatch({type:'ACT',action:'DOUBLE',handId:'round-1/seat-4'});
  expect(dealEvents(batches).filter(e=>e.reason==='DOUBLE')).toHaveLength(1);
  const result=batches.flatMap(b=>b.events).find(e=>e.type==='SETTLE_RESULT'&&e.seat===4);
  expect(result).toMatchObject({kind:'MAIN',stake:400,returned:0,outcome:'DEALER_WIN'});
  expect(c.getSnapshot().human?.available).toBe(1600);
});
it('[T05-E06] rejected commands emit no cards; hidden Ace slot never leaks before public reveal',()=>{
  const c=createFixtureController('player-ace'),batches=collect(c);c.dispatch({type:'DEAL',amount:200});
  expect(c.getSnapshot().interaction.insurance).not.toBeNull();
  expect(batches.flatMap(b=>b.events).filter(e=>e.type==='REVEAL_HOLE_CARD')).toEqual([]);
  const before=batches.length;expect(c.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-4'})).toBe(false);expect(batches).toHaveLength(before);
  expect(dealEvents(batches).filter(e=>e.card.owner==='dealer')).toMatchObject([{face:{rank:'A'}},{face:null}]);
});
it('[T05-E07] observation reads immutable authority without altering state or consuming entropy',()=>{
  const before=fixtureState(['5','9','6','8']),result=applySessionCommand(before,{type:'CONFIGURE',seats:[]},fixtureRandom);
  const receipt=JSON.stringify([before,result]);const rng=vi.spyOn(Math,'random').mockImplementation(()=>{throw Error('entropy');});
  try { observePresentation(before,result,{type:'CONFIGURE',seats:[]});expect(JSON.stringify([before,result])).toBe(receipt);expect(rng).not.toHaveBeenCalled(); } finally {rng.mockRestore();}
});
it('[T05-P01] full/immediate/reduced/skip/cancel/failure keep RNG receipts, full replay, digest, journal, audit and money identical',()=>{
  const receipts=[];
  for(const policy of ['FULL_MOTION','IMMEDIATE','REDUCED_MOTION','SKIP','CANCEL','FAIL'] as const){
    const bounds:number[]=[];
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7,clock:()=> '2026-01-01T00:00:00.000Z',random:{nextInt:n=>{bounds.push(n);return n-1;}}});
    const q=createPresentationTimeline(()=>policy==='FAIL'?{finished:Promise.resolve(),cancel(){throw Error('visual');},settle(){}}:undefined);
    q.setMode(['SKIP','CANCEL','FAIL'].includes(policy)?'FULL_MOTION':policy as PresentationMode);
    c.presentation.subscribe(()=>{const s=c.presentation.getSnapshot();q.begin(s.generation);for(const b of s.batches)q.enqueue(b.events);if(policy==='SKIP')q.skip();if(policy==='CANCEL')q.cancel();c.presentation.acknowledge(s.revision);});
    c.dispatch({type:'START',count:7});c.dispatch({type:'DEAL',amount:200});
    for(let i=0;i<30&&!c.getSnapshot().interaction.nextRound;i++){const v=c.getSnapshot();expect(c.dispatch(v.interaction.insurance?{type:'ACE',choice:'DECLINE'}:{type:'ACT',action:'STAND',handId:v.interaction.handId})).toBe(true);}
    expect(c.getSnapshot().phase).toBe('COMMITTED');expect(c.replayCompleted()).toBe(true);q.skip();q.dispose();
    receipts.push({snapshot:c.getSnapshot(),replay:c.exportReplay(),bounds});
  }
  for(const receipt of receipts)expect(receipt).toEqual(receipts[0]);
  const bounds:number[]=[],c=createBrowserController({playerMode:true,random:{nextInt:n=>{bounds.push(n);return n-1;}}});
  const initial=[...Array.from({length:311},(_,i)=>312-i),31];expect(bounds).toEqual(initial);
  const q=createPresentationTimeline();q.begin(c.presentation.getSnapshot().generation);q.enqueue(c.presentation.getSnapshot().batches.flatMap(b=>b.events));q.skip();q.cancel();
  expect(bounds).toEqual(initial);
});
it('[T05-P02] only exact observation additions differ from baseline controller; domain and unrelated dependency entries stay unchanged',()=>{
  const git=(...args:string[])=>execFileSync('git',args).toString().replaceAll('\r\n','\n');
  const delta:{before:string;after:string}[]=JSON.parse(readFileSync('tests/m10/presentationDelta.json','utf8'));
  let current=readFileSync('src/browser/controller.ts','utf8').replaceAll('\r\n','\n');
  for(const {before,after} of [...delta].reverse()){expect(current.split(after)).toHaveLength(2);current=current.replace(after,before);}
  expect(current).toBe(git('show','c853a7e7e7cc234dc6fad07477d5aab1d0a3035a:src/browser/controller.ts'));
  expect(acceptedController(readFileSync('src/browser/controller.ts','utf8')).trimEnd()).toBe(git('show','57443bbefddd47512104ba941c65e3ff1988cf02:src/browser/controller.ts').trimEnd());
  expect(git('diff','--name-only','HEAD','--','src/domain','art','public','src/ui/styles.css')).toBe('');
  const baseline=JSON.parse(git('show','HEAD:package-lock.json')),lock=JSON.parse(readFileSync('package-lock.json','utf8'));
  for(const [path,entry] of Object.entries(baseline.packages))if(path)expect(lock.packages[path],path).toEqual(entry);
  const pkg=JSON.parse(git('show','HEAD:package.json'));expect(JSON.parse(readFileSync('package.json','utf8'))).toEqual({...pkg,dependencies:{...pkg.dependencies,motion:'14.0.0'}});
});
