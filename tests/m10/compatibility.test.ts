import { expect, it, vi } from 'vitest';
import { createBrowserController, type BrowserController } from '../../src/browser/controller.js';
import { createPresentationFeed, type PresentationEvent } from '../../src/presentation/events.js';
import { createPresentationTimeline, type PresentationMode } from '../../src/presentation/timeline.js';
import { connectPresentation, consumePresentation, createPresentationRuntime } from '../../src/ui/PresentationProvider.js';
import { wagerEvents, wagerFlight } from '../../src/presentation/wagers.js';
import { createFixtureController } from '../browser/fixtures.js';

for (const count of [1, 4, 7]) it(`[T10-U01-${count}] actual runtime modes preserve complete journal/outcomes/digest/audit and credits`, () => {
  const receipts = [];
  for (const mode of ['FULL_MOTION', 'REDUCED_MOTION', 'IMMEDIATE'] as PresentationMode[]) {
    const c = createBrowserController({ playerMode:true,deferPlayerStart:true,seed:7,clock:()=> '2026-01-01T00:00:00.000Z' });
    const runtime = createPresentationRuntime();
    const disconnect = c.presentation.subscribe(() => consumePresentation(c.presentation,runtime,mode));
    expect(c.dispatch({type:'START',count})).toBe(true); expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
    for (let index=0;index<20 && !c.getSnapshot().interaction.nextRound;index++) {
      const view=c.getSnapshot(); expect(c.dispatch(view.interaction.insurance ? {type:'ACE',choice:'DECLINE'} : {type:'ACT',action:'STAND',handId:view.interaction.handId})).toBe(true);
    }
    expect(c.getSnapshot().phase).toBe('COMMITTED'); const before=c.exportReplay(); expect(c.replayCompleted()).toBe(true);
    expect(c.exportReplay()).toEqual(before); runtime.timeline.skip();
    expect(runtime.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0});
    expect(runtime.initialDeal.getSnapshot().pending).toEqual([]); expect(runtime.playerActions.getSnapshot().pending).toEqual([]);
    expect(runtime.dealerActions.getSnapshot().pending).toEqual([]); expect(runtime.wagers.getSnapshot().pending).toEqual([]);
    receipts.push({view:c.getSnapshot(),package:c.exportReplay()}); disconnect(); runtime.timeline.dispose();
  }
  expect(receipts[1]).toEqual(receipts[0]); expect(receipts[2]).toEqual(receipts[0]);
});
it('[T10-U02] hidden after visibility skip consumes subsequent facts immediately; resume/unmount never replays stale work', () => {
  const doc=Object.assign(new EventTarget(),{hidden:false}); vi.stubGlobal('document',doc); vi.stubGlobal('window',new EventTarget());
  const feed=createPresentationFeed(),played:string[]=[],cancelled:string[]=[],settled:string[]=[];
  const runtime={...createPresentationRuntime(),timeline:createPresentationTimeline(event=>{
    played.push(event.id); return {finished:new Promise<void>(()=>{}),cancel(){cancelled.push(event.id);},settle(){settled.push(event.id);}};
  })};
  try {
    const disconnect=connectPresentation(feed,runtime,'FULL_MOTION');
    const append=()=>feed.append('r','MAIN',[{type:'MOVE_WAGER',seat:4,amount:200,kind:'MAIN'}]);
    append(); expect(played).toHaveLength(1); doc.hidden=true; doc.dispatchEvent(new Event('visibilitychange'));
    append(); expect(played).toHaveLength(1); expect(feed.getSnapshot().batches).toEqual([]);
    expect(runtime.timeline.getSnapshot()).toMatchObject({mode:'IMMEDIATE',activeId:null,pending:0});
    doc.hidden=false; doc.dispatchEvent(new Event('visibilitychange')); append(); expect(played).toHaveLength(2);
    disconnect(); expect(cancelled).toEqual(played); expect(settled).toEqual(played);
    append(); expect(played).toHaveLength(2); expect(feed.getSnapshot().batches).toHaveLength(1);
  } finally {vi.unstubAllGlobals();}
});
function collect(c:BrowserController) {
  const events:PresentationEvent[]=[];c.presentation.acknowledge(c.presentation.getSnapshot().revision);
  c.presentation.subscribe(()=>{const s=c.presentation.getSnapshot();events.push(...s.batches.flatMap(batch=>batch.events));c.presentation.acknowledge(s.revision);});return events;
}
const settlements=(events:readonly PresentationEvent[])=>wagerEvents(events).filter((event):event is Extract<PresentationEvent,{type:'SETTLE_RESULT'}>=>event.type==='SETTLE_RESULT');
it('[T10-U03] surrender half-return has its exact recorded amount and owner route',()=>{
  const c=createFixtureController('surrender'),events=collect(c);expect(c.dispatch({type:'ACT',action:'SURRENDER',handId:'round-1/seat-1'})).toBe(true);
  if(!c.getSnapshot().interaction.nextRound) expect(c.dispatch({type:'ADVANCE'})).toBe(true);
  const result=wagerEvents(events).find(event=>event.type==='SETTLE_RESULT')!;
  expect(result).toMatchObject({kind:'MAIN',outcome:'SURRENDERED',stake:200,returned:100,returnTo:'local-credits'});
  expect(wagerFlight(result)).toEqual({amount:100,from:'hand-wager:round-1/seat-1',to:'local-credits'});expect(c.getSnapshot().human).toMatchObject({available:1900,reserved:0});
});
it('[T10-U04] each Pair and Three Card record remains distinct with literal committed stake/gross',()=>{
  const c=createFixtureController('sides'),events=collect(c);expect(c.dispatch({type:'ACT',action:'STAND',handId:'round-1/seat-1'})).toBe(true);
  if(!c.getSnapshot().interaction.nextRound) expect(c.dispatch({type:'ADVANCE'})).toBe(true);
  expect(settlements(events).filter(event=>event.kind!=='MAIN').map(event=>[event.kind,event.stake,event.returned,event.returnTo])).toEqual([['PAIR',20,140,'local-credits'],['THREE_CARD',20,620,'local-credits']]);
});
it('[T10-U05] accepted follower ADD uses real exposure; owner/guest returns remain distinct',()=>{
  const c=createFixtureController('follow-double'),events=collect(c);expect(c.dispatch({type:'FOLLOW',choice:'ADD'})).toBe(true);
  expect(c.dispatch({type:'ADVANCE'})).toBe(true);
  expect(wagerEvents(events).find(event=>event.type==='MOVE_WAGER'&&event.kind==='BACK')).toMatchObject({amount:400,handId:'round-1/seat-1',returnTo:'local-credits'});
  expect(wagerEvents(events).filter(event=>event.type==='SETTLE_RESULT').map(event=>[event.kind,event.stake,event.returned,event.returnTo])).toEqual([['MAIN',400,800,'seat-1'],['BACK',400,800,'local-credits']]);
  expect(c.getSnapshot().human).toMatchObject({available:2400,reserved:0});
});
it('[T10-U06] Bet Behind Insurance reserve/loss and Blackjack gross remain separate accepted records',()=>{
  const c=createFixtureController('back-insurance'),events=collect(c);expect(c.dispatch({type:'ACE',choice:'INSURANCE'})).toBe(true);
  if(!c.getSnapshot().interaction.nextRound) expect(c.dispatch({type:'ADVANCE'})).toBe(true);
  expect(wagerEvents(events).find(event=>event.type==='MOVE_WAGER'&&event.kind==='BACK_INSURANCE')).toMatchObject({amount:100,returnTo:'local-credits'});
  expect(settlements(events).filter(event=>event.kind.startsWith('BACK')).map(event=>[event.kind,event.stake,event.returned,event.returnTo])).toEqual([['BACK',200,500,'local-credits'],['BACK_INSURANCE',100,0,'local-credits']]);
});
