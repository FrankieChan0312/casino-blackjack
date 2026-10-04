import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { LocalPlayerHud } from '../../src/ui/LocalPlayerHud.js';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { character, characters } from '../../src/presentation/characters.js';
import { fiveCardHand, splitHands } from './seatFixtures.js';

// Literal public component examples; actual played rounds are separately verified in Chromium.
const hands = splitHands.map(hand => ({...hand,handId:hand.handId.replace('seat-1','seat-4')}));
const original = {...fiveCardHand,handId:'layout/seat-4',stakeUnits:100};
const facts = {seat:{seatNumber:4,occupancy:'HUMAN' as const,sittingOut:false,controllerId:'human'},
  avatar:character('knight_male'),hands:[original],wager:100,currentHandId:original.handId,ownResults:[]};

it.each([2,3,4,5])('[M10A-L01] %i local cards retain one semantic hand and independent total/wager', count=>{
  const totals={2:5,3:9,4:14,5:20} as const;
  const hand={...original,cards:original.cards.slice(0,count),total:totals[count as keyof typeof totals]};
  const html=renderToStaticMarkup(<LocalPlayerHud {...facts} hands={[hand]} />);
  expect(html).toContain('aria-label="Your player HUD"');expect(html).toContain('aria-controls="player-decisions"');
  expect([...html.matchAll(/class="card /g)]).toHaveLength(count);expect([...html.matchAll(/data-hand-id=/g)]).toHaveLength(1);
  expect(html).toContain(`aria-label="Total: ${totals[count as keyof typeof totals]}"`);
  expect(html).toContain('MAIN: 50 credits');expect(html).toContain('Wager: 50 credits');
  expect(html).toContain('Hand A · Current hand');expect(html).toContain('aria-current="true"');expect(html).toContain('ACTIVE');
});
it.each([2,3,4])('[M10A-L02] %i split leaves keep explicit identities stakes totals results and one current hand', count=>{
  const html=renderToStaticMarkup(<LocalPlayerHud {...facts} hands={hands.slice(0,count)} currentHandId="layout/seat-4.1.2" />);
  expect([...html.matchAll(/data-hand-id="([^"]+)"/g)].map(m=>m[1])).toEqual(['layout/seat-4.1.1','layout/seat-4.1.2','layout/seat-4.2.1','layout/seat-4.2.2'].slice(0,count));
  expect(html).toContain('Hand A.2 · Current hand');expect(html).toContain('Wager: 100 credits');
  expect(html).toContain('Win');expect(html).not.toContain('Blackjack');
  expect([...html.matchAll(/aria-current="true"/g)]).toHaveLength(1);
  if(count===4){for(const text of ['Hand A.1','Hand B.1','Hand B.2','Total: 21','Total: 17','Total: 24','Total: 18','Bust','Push'])expect(html).toContain(text);}
});
it('[M10A-L03] missing portrait and sitting-out/no-hand retain You identity without invented public cards',()=>{
  const html=renderToStaticMarkup(<LocalPlayerHud {...facts} avatar={undefined} hands={[]} currentHandId={null} seat={{...facts.seat,sittingOut:true}} wager={0} />);
  expect(html).toContain('Seat 4 · You · Human · Sitting Out');expect(html).toContain('Your cards will be dealt here.');
  expect(html).toContain('MAIN: 0 credits');expect(html).not.toContain('role="img"');expect(html).not.toContain('aria-current');
});
it('[M10A-L04] natural Charlie and bust labels follow public outcomes rather than card-count inference',()=>{
  const examples: [ComponentProps<typeof LocalPlayerHud>['hands'][number], string][] = [
    [{...original,cards:[{rank:'A' as const,suit:'clubs' as const},{rank:'K' as const,suit:'diamonds' as const}],total:21,complete:true,outcome:'PLAYER_BLACKJACK' as const},'Blackjack'],
    [{...original,complete:true,outcome:'CHARLIE' as const},'Charlie Win'],
    [{...original,cards:[{rank:'10' as const,suit:'clubs' as const},{rank:'9' as const,suit:'diamonds' as const},{rank:'5' as const,suit:'hearts' as const}],total:24,complete:true,outcome:'DEALER_WIN' as const,outcomeReason:'PLAYER_BUST' as const},'Bust'],
    [original,'Playing'],
  ];
  for(const [hand,label] of examples){const html=renderToStaticMarkup(<LocalPlayerHud {...facts} hands={[hand]} currentHandId={null} />);expect(html).toContain(label);if(!hand.outcome)expect(html).not.toContain('Charlie Win');}
});
it('[M10A-L05] surrender preserves independently expected half-credit return and loss',()=>{
  const hand={...original,stakeUnits:62,complete:true,outcome:'SURRENDERED' as const};
  const html=renderToStaticMarkup(<LocalPlayerHud {...facts} hands={[hand]} wager={62} currentHandId={null}
    ownResults={[{type:'MAIN',handId:hand.handId,stake:62,returned:31,outcome:'SURRENDERED',status:'COMMITTED'}]} />);
  expect(html).toContain('MAIN: 31 credits');expect(html).toContain('Wager: 31 credits');expect(html).toContain('Returned: 15.5 · Lost: 15.5');
});
it('[M10A-L06] real public scene has one full card tree exact funds and preserved remote units without dispatch',()=>{
  const controller=createBrowserController({playerMode:true,seed:7});controller.dispatch({type:'DEAL',amount:200});
  const before=JSON.stringify(controller.getSnapshot());let notifications=0;const unsubscribe=controller.subscribe(()=>notifications++);
  const html=renderToStaticMarkup(<App controller={controller} chooseCharacter={()=>0} />);
  expect([...html.matchAll(/class="card /g)]).toHaveLength(11);expect([...html.matchAll(/data-hand-id=/g)]).toHaveLength(4);
  expect([...html.matchAll(/class="seat-unit"/g)]).toHaveLength(3);expect([...html.matchAll(/aria-label="Your player HUD"/g)]).toHaveLength(1);
  for(const text of ['Your avatar: Roland','Seat 4 · You · Human','MAIN: 100 credits','<dt>Available</dt><dd>900</dd>','<dt>Reserved / current exposure</dt><dd>100</dd>','<dt>Pending return</dt><dd>0</dd>'])expect(html).toContain(text);
  expect(html).not.toMatch(/deckIndex|physicalCardId/);expect(JSON.stringify(controller.getSnapshot())).toBe(before);expect(notifications).toBe(0);unsubscribe();
});
it('[M10A-L07] all twelve accepted identities retain exact portrait name and accessible metadata',()=>{
  for(const avatar of characters){const html=renderToStaticMarkup(<LocalPlayerHud {...facts} avatar={avatar} />);
    expect(html).toContain(avatar.portrait);expect(html).toContain(`aria-label="${avatar.name}"`);expect(html).toContain(`Your avatar: ${avatar.name}, ${avatar.archetype}`);}
});
