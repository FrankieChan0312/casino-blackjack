import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { LocalPlayerHud } from '../../src/ui/LocalPlayerHud.js';
import { resultLabel } from '../../src/ui/presentation.js';
import { character } from '../../src/presentation/characters.js';
import { createFixtureController } from '../browser/fixtures.js';
import { fiveCardHand, splitHands } from './seatFixtures.js';

it('[M10A-T09-U01] real Classic2/3/4/5-card progression has literal totals and stays Playing without inferred Charlie', () => {
  const c=createFixtureController('player-five');expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  for(const [count,total] of [[2,4],[3,6],[4,8],[5,10]]) {
    const view=c.getSnapshot(),hand=view.round!.seats.find(s=>s.seatNumber===4)!.hands[0];
    expect(hand.cards).toHaveLength(count);expect(hand.total).toBe(total);expect(hand.outcome).toBeUndefined();
    const before=JSON.stringify(view),html=renderToStaticMarkup(<App controller={c} chooseCharacter={()=>0}/>);
    expect(html).toContain(`aria-label="Total: ${total}"`);expect(html).toContain('class="hud-state">Playing');expect(html).not.toContain('Charlie Win');
    expect(JSON.stringify(c.getSnapshot())).toBe(before);if(count<5)expect(c.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-4'})).toBe(true);
  }
});
it('[M10A-T09-U02] actual Split sibling and four-leaf cap retain explicit depth-first IDs stakes outcomes and funds', () => {
  const c=createFixtureController('player-split');expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  expect(c.dispatch({type:'ACT',action:'SPLIT',handId:'round-1/seat-4'})).toBe(true);expect(c.getSnapshot().round!.currentHandId).toBe('round-1/seat-4.1');
  expect(c.dispatch({type:'ACT',action:'STAND',handId:'round-1/seat-4.1'})).toBe(true);expect(c.getSnapshot().round!.currentHandId).toBe('round-1/seat-4.2');
  const sibling=c.getSnapshot().round!.seats.find(s=>s.seatNumber===4)!.hands;expect(sibling.map(h=>h.total)).toEqual([10,11]);expect(sibling.map(h=>h.stakeUnits)).toEqual([200,200]);
  const cap=createFixtureController('player-rsa-cap');expect(cap.dispatch({type:'DEAL',amount:200})).toBe(true);
  for(const id of ['round-1/seat-4','round-1/seat-4.1','round-1/seat-4.1.1'])expect(cap.dispatch({type:'ACT',action:'SPLIT',handId:id})).toBe(true);
  const view=cap.getSnapshot(),hands=view.round!.seats.find(s=>s.seatNumber===4)!.hands;
  expect(hands.map(h=>h.handId)).toEqual(['round-1/seat-4.1.1.1','round-1/seat-4.1.1.2','round-1/seat-4.1.2','round-1/seat-4.2']);
  expect(hands.map(h=>[h.total,h.stakeUnits,h.outcome])).toEqual(Array(4).fill([12,200,'DEALER_WIN']));
  expect(view.human).toMatchObject({available:1200,reserved:0});expect(view.pending).toBe(0);
  const html=renderToStaticMarkup(<App controller={cap} chooseCharacter={()=>0}/>);
  for(const label of ['Hand A.1.1','Hand A.1.2','Hand A.2','Hand B'])expect(html).toContain(label);
  expect([...html.matchAll(/class="hud-state" data-result="DEALER_WIN">Loss/g)]).toHaveLength(4);expect(html).not.toContain('aria-current="true"');
});
it('[M10A-T09-U03] public natural split21 Charlie and longest roster metadata remain distinct complete labels', () => {
  const base={seat:{seatNumber:4,occupancy:'HUMAN' as const,sittingOut:false,controllerId:'human'},wager:100,currentHandId:null,ownResults:[]};
  for(const avatar of [character('knight_female'),character('halforc_female')]){
    const html=renderToStaticMarkup(<LocalPlayerHud {...base} avatar={avatar} hands={splitHands.map(h=>({...h,handId:h.handId.replace('seat-1','seat-4')}))}/>);
    expect(html).toContain(`Your avatar: ${avatar.name}, ${avatar.archetype}`);for(const label of ['Win','Playing','Bust','Push'])expect(html).toContain(label);expect(html).not.toContain('Blackjack');
  }
  const natural={...fiveCardHand,handId:'layout/seat-4',cards:[{rank:'A' as const,suit:'clubs' as const},{rank:'K' as const,suit:'diamonds' as const}],total:21,complete:true,outcome:'PLAYER_BLACKJACK' as const};
  expect(renderToStaticMarkup(<LocalPlayerHud {...base} hands={[natural]}/>)).toContain('Blackjack');
  expect(renderToStaticMarkup(<LocalPlayerHud {...base} hands={[{...fiveCardHand,handId:'layout/seat-4',complete:true,outcome:'CHARLIE'}]}/>)).toContain('Charlie Win');
  expect(resultLabel('VOID')).toBe('VOID / Integrity Error');
});
