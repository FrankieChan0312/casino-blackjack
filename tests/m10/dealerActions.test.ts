import { expect, it } from 'vitest';
import { createBrowserController } from '../../src/browser/controller.js';
import type { Rank } from '../../src/domain/card.js';
import { createDealerActionProjection, dealerCardKeys } from '../../src/presentation/dealerActions.js';
import { createPresentationFeed, type PresentationEvent } from '../../src/presentation/events.js';
import { fixtureState, fixtureRandom } from '../browser/fixtures.js';

const cases: readonly [string, readonly Rank[], readonly string[], number, boolean][] = [
  ['stand', ['5','10','6','7'], [], 17, false],
  ['one', ['5','9','6','6','2'], ['2'], 17, false],
  ['multiple', ['5','5','6','6','2','4'], ['2','4'], 17, false],
  ['bust', ['5','9','6','6','10'], ['10'], 25, false],
  ['soft17', ['5','A','6','6'], [], 17, true],
  ['Blackjack', ['5','10','6','A'], [], 21, false],
  ['Insurance Blackjack', ['5','A','6','K'], [], 21, true],
];
for (const [name,ranks,draws,total,insurance] of cases) it(`[T08-E01-${name}] public reveal and ordered appended Dealer cards, no strategy inference`, () => {
  const controller = createBrowserController({ playerMode:true, deferPlayerStart:true, factory:()=>fixtureState(ranks),random:fixtureRandom });
  expect(controller.dispatch({type:'START',count:1})).toBe(true);
  const events: PresentationEvent[]=[];
  controller.presentation.subscribe(()=>{const s=controller.presentation.getSnapshot(); events.push(...s.batches.flatMap(batch=>batch.events));controller.presentation.acknowledge(s.revision);});
  expect(controller.dispatch({type:'DEAL',amount:200})).toBe(true);
  const initial=events.filter(event=>event.type==='DEAL_CARD'&&event.reason==='INITIAL'&&event.card.owner==='dealer');
  expect(initial).toMatchObject([{face:{rank:ranks[1]}},{face:null}]);
  if(insurance){expect(events.filter(event=>event.type==='REVEAL_HOLE_CARD')).toHaveLength(0);expect(controller.getSnapshot().round?.dealer.holeCard).toBeNull();expect(controller.dispatch({type:'ACE',choice:'INSURANCE'})).toBe(true);}
  if(!controller.getSnapshot().interaction.nextRound) expect(controller.dispatch({type:'ACT',action:'STAND',handId:controller.getSnapshot().interaction.handId})).toBe(true);
  expect(events.filter(event=>event.type==='REVEAL_HOLE_CARD')).toMatchObject([{card:{handId:'dealer',index:1},face:{rank:ranks[3]}}]);
  expect(events.filter((event): event is Extract<PresentationEvent,{type:'DEAL_CARD'}>=>event.type==='DEAL_CARD'&&event.reason==='DEALER').map(event=>[event.card.index,event.face?.rank])).toEqual(draws.map((rank,index)=>[index+2,rank]));
  expect(controller.getSnapshot().round?.dealer.total).toBe(total);
  const reveal=events.findIndex(event=>event.type==='REVEAL_HOLE_CARD');
  expect(events.every((event,index)=>event.type!=='DEAL_CARD'||event.reason!=='DEALER'||index>reveal)).toBe(true);
  expect(JSON.stringify(events)).not.toMatch(/physical|deckIndex|availableCards/);
});
it('[T08-P01] projection exposes only semantic completion, midpoint and cancellation generations',()=>{
  const feed=createPresentationFeed();feed.append('r','ADVANCE',[
    {type:'REVEAL_HOLE_CARD',card:{roundId:'r',owner:'dealer',handId:'dealer',index:1},face:{rank:'6',suit:'clubs'}},
    {type:'DEAL_CARD',reason:'DEALER',card:{roundId:'r',owner:'dealer',handId:'dealer',index:2},face:{rank:'2',suit:'hearts'},destination:'dealer-hand'},
  ]);
  const snapshot=feed.getSnapshot(), events=snapshot.batches[0].events, projection=createDealerActionProjection();
  expect(dealerCardKeys(events)).toEqual(['dealer:1','dealer:2']);projection.prepare(snapshot.generation,events);projection.prepare(snapshot.generation,events);
  expect(projection.getSnapshot().pending).toEqual(['dealer:1','dealer:2']);expect(projection.getSnapshot().revealed).toEqual([]);
  projection.reveal(events[0]);expect(projection.getSnapshot().pending).toHaveLength(2);expect(projection.getSnapshot().revealed).toEqual(['dealer:1']);
  projection.arrive(events[0]);expect(projection.getSnapshot().pending).toEqual(['dealer:2']);
  projection.prepare(snapshot.generation+1,events);projection.reveal(events[0]);projection.arrive(events[0]);expect(projection.getSnapshot().revealed).toEqual([]);
  projection.clear();expect(projection.getSnapshot().pending).toEqual([]);expect(JSON.stringify(projection.getSnapshot())).not.toMatch(/rank|suit|face/);
});
