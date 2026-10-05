import { expect, it } from 'vitest';
import { createBrowserController, type BrowserController } from '../../src/browser/controller.js';
import { observePresentation } from '../../src/browser/presentationObserver.js';
import { applySessionCommand } from '../../src/domain/sessionCommand.js';
import { createPresentationFeed, type PresentationEvent } from '../../src/presentation/events.js';
import { createWagerProjection, wagerEvents, wagerFlight } from '../../src/presentation/wagers.js';
import { createFixtureController, fixtureState, fixtureRandom } from '../browser/fixtures.js';

function collect(controller:BrowserController){const events:PresentationEvent[]=[];controller.presentation.acknowledge(controller.presentation.getSnapshot().revision);controller.presentation.subscribe(()=>{const s=controller.presentation.getSnapshot();events.push(...s.batches.flatMap(batch=>batch.events));controller.presentation.acknowledge(s.revision);});return events;}
function stand(controller:BrowserController){expect(controller.dispatch({type:'ACT',action:'STAND',handId:controller.getSnapshot().interaction.handId})).toBe(true);}
for(const [fixture,outcome,returned] of [['player-dealer-bust','PLAYER_WIN',400],['player-loss','DEALER_WIN',0],['player-push','PUSH',200],['player-natural','PLAYER_BLACKJACK',500]] as const)it(`[T09-E01-${outcome}] exact committed stake/gross and route from authoritative result`,()=>{
  const c=createFixtureController(fixture),events=collect(c);expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);if(!c.getSnapshot().interaction.nextRound)stand(c);
  const result=wagerEvents(events).find(event=>event.type==='SETTLE_RESULT'&&event.seat===4)!;
  expect(result).toMatchObject({kind:'MAIN',outcome,stake:200,returned,returnTo:'local-credits'});
  expect(wagerFlight(result)).toEqual({amount:returned||200,from:'hand-wager:round-1/seat-4',to:returned?'local-credits':'dealer-hand'});
  expect(events.filter(event=>event.type==='SETTLE_RESULT'&&event.seat===4)).toHaveLength(1);
});
it('[T09-E02] MAIN, Double and child Split label exact post-command total stakes; rejects place no token',()=>{
  const c=createFixtureController('player-loss'),events=collect(c);expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  expect(wagerEvents(events).find(event=>event.type==='MOVE_WAGER'&&event.seat===4)).toMatchObject({amount:200,kind:'MAIN'});
  expect(c.dispatch({type:'ACT',action:'DOUBLE',handId:'round-1/seat-4'})).toBe(true);
  expect(wagerEvents(events).find(event=>event.type==='MOVE_WAGER'&&event.kind==='DOUBLE')).toMatchObject({amount:400,handId:'round-1/seat-4'});
  const split=createFixtureController('player-split');split.dispatch({type:'DEAL',amount:200});const splitEvents=collect(split);split.dispatch({type:'ACT',action:'SPLIT',handId:'round-1/seat-4'});
  expect(wagerEvents(splitEvents).filter(event=>event.type==='MOVE_WAGER').map(event=>[event.handId,event.amount,event.kind])).toEqual([['round-1/seat-4.1',200,'SPLIT'],['round-1/seat-4.2',200,'SPLIT']]);
  const rejected=createFixtureController('player-loss'),rejectedEvents=collect(rejected);expect(rejected.dispatch({type:'DEAL',amount:2200})).toBe(false);expect(rejectedEvents).toEqual([]);
});
it('[T09-E03] Insurance stake/gross and Even Money/Charlie labels come from real settlement',()=>{
  const insured=createBrowserController({playerMode:true,deferPlayerStart:true,factory:()=>fixtureState(['5','A','6','K']),random:fixtureRandom});insured.dispatch({type:'START',count:1});insured.dispatch({type:'DEAL',amount:200});const insuredEvents=collect(insured);insured.dispatch({type:'ACE',choice:'INSURANCE'});
  expect(wagerEvents(insuredEvents).find(event=>event.type==='MOVE_WAGER')).toMatchObject({amount:100,kind:'INSURANCE',returnTo:'local-credits'});
  expect(wagerEvents(insuredEvents).find(event=>event.type==='SETTLE_RESULT'&&event.kind==='INSURANCE')).toMatchObject({stake:100,returned:300,outcome:'WIN'});
  const even=createFixtureController('player-even-money');even.dispatch({type:'DEAL',amount:200});const evenEvents=collect(even);even.dispatch({type:'ACE',choice:'EVEN_MONEY'});
  expect(wagerEvents(evenEvents).filter(event=>event.type==='MOVE_WAGER'&&event.kind==='INSURANCE')).toEqual([]);
  expect(wagerEvents(evenEvents).find(event=>event.type==='SETTLE_RESULT'&&event.seat===4)).toMatchObject({outcome:'EVEN_MONEY',stake:200,returned:400});
  const charlie=createFixtureController('charlie'),charlieEvents=collect(charlie);for(let i=0;i<3;i++)charlie.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-1'});charlie.dispatch({type:'ADVANCE'});
  expect(wagerEvents(charlieEvents).find(event=>event.type==='SETTLE_RESULT')).toMatchObject({outcome:'CHARLIE',stake:200,returned:400});
});
it('[T09-E04] VOID records are refunds, failed follow ADD does not manufacture a reserve or payout',()=>{
  const voided=createFixtureController('void'),events=collect(voided);voided.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-1'});
  expect(wagerEvents(events)).toMatchObject([{type:'SETTLE_RESULT',outcome:'VOID',stake:200,returned:200}]);
  expect(events.some(event=>event.type==='REVEAL_HOLE_CARD')).toBe(false);
  const poor=createFixtureController('poor-follow'),followEvents=collect(poor);poor.dispatch({type:'FOLLOW',choice:'ADD'});
  expect(wagerEvents(followEvents).filter(event=>event.type==='MOVE_WAGER'&&event.kind==='BACK')).toEqual([]);
});
it('[T09-E05] successful result facts copy exact committed records without altering authority; repeat SETTLE is inert',()=>{
  let before=fixtureState(['10','9','8','8']);for(const command of [{type:'CONFIGURE',seats:[{seatNumber:1,occupancy:'HUMAN',sittingOut:false}]},{type:'OPEN'},{type:'MAIN',seat:1,amount:200},{type:'CLOSE'},{type:'ACT',handId:'round-1/seat-1',action:'STAND'},{type:'ADVANCE'}] as const){const result=applySessionCommand(before,command,fixtureRandom);expect(result.ok).toBe(true);before=result.state;}
  const result=applySessionCommand(before,{type:'SETTLE'},fixtureRandom),bytes=JSON.stringify([before,result]);const facts=observePresentation(before,result,{type:'SETTLE'});
  expect(facts.filter(event=>event.type==='SETTLE_RESULT').map(event=>[event.stake,event.returned])).toEqual([[200,400]]);
  expect(JSON.stringify([before,result])).toBe(bytes);expect(observePresentation(result.state,applySessionCommand(result.state,{type:'SETTLE'},fixtureRandom),{type:'SETTLE'})).toEqual([]);
});
it('[T09-P01] idempotent visual settlement/skip cannot retain cash values or stale generations',()=>{
  const feed=createPresentationFeed();feed.append('r','SETTLE',[{type:'SETTLE_RESULT',seat:4,kind:'MAIN',outcome:'PUSH',stake:200,returned:200}]);const s=feed.getSnapshot(),event=wagerEvents(s.batches[0].events)[0],projection=createWagerProjection();
  projection.prepare(s.generation,[event]);projection.prepare(s.generation,[event]);expect(projection.getSnapshot().pending).toEqual([event.id]);projection.arrive(event);expect(projection.getSnapshot().pending).toEqual([]);
  projection.prepare(s.generation+1,[event]);projection.arrive(event);expect(projection.getSnapshot().pending).toEqual([event.id]);projection.clear();expect(projection.getSnapshot().pending).toEqual([]);expect(JSON.stringify(projection.getSnapshot())).not.toMatch(/amount|stake|returned|bankroll/);
});
it('[T09-E06] accepted wager cancellation returns the exact previous reserve without arithmetic',()=>{
  let before=fixtureState(['10','9','8','8']);
  for(const command of [{type:'CONFIGURE',seats:[{seatNumber:1,occupancy:'HUMAN',sittingOut:false}]},{type:'OPEN'},{type:'MAIN',seat:1,amount:200}] as const){const result=applySessionCommand(before,command,fixtureRandom);expect(result.ok).toBe(true);before=result.state;}
  const command={type:'MAIN',seat:1,amount:0} as const,result=applySessionCommand(before,command,fixtureRandom),facts=observePresentation(before,result,command);
  expect(facts).toEqual([{type:'MOVE_WAGER',seat:1,amount:200,kind:'MAIN_CANCELLED',handId:undefined,returnTo:'local-credits'}]);
  const feed=createPresentationFeed();feed.append('r',command.type,facts);
  expect(wagerFlight(wagerEvents(feed.getSnapshot().batches[0].events)[0])).toEqual({amount:200,from:'wager:1',to:'local-credits'});
  expect(result.state.human?.bankroll).toEqual({reserved:0,available:2000});
});
