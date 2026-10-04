import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeatUnit } from '../../src/ui/SeatUnit.js';
import { Table } from '../../src/ui/Table.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { characters, createCharacterLineup } from '../../src/presentation/characters.js';
import { seatFacts, fiveCardHand, splitHands } from './seatFixtures.js';

it.each([2,3,4,5])('[M10A-U01] %i public cards have one owner and exact independent score/stake', count => {
  const totals = {2:5,3:9,4:14,5:20} as const;
  const hand = {...fiveCardHand,cards:fiveCardHand.cards.slice(0,count),total:totals[count as keyof typeof totals]};
  const html=renderToStaticMarkup(<SeatUnit {...seatFacts} hands={[hand]} />);
  expect([...html.matchAll(/class="card /g)]).toHaveLength(count);
  expect([...html.matchAll(/data-hand-id=/g)]).toHaveLength(1);
  expect(html).toContain(`aria-label="Total: ${totals[count as keyof typeof totals]}"`);
  expect(html).toContain('MAIN: 25.5 credits'); expect(html).toContain('Current turn');
  expect(html).toContain('Hand A · Current hand'); expect(html).toContain('ACTIVE');
  expect(html).not.toMatch(/bankroll|Available|physicalCardId|deckIndex/);
});
it('[M10A-U02] four split leaves retain distinct labels cards stakes and outcomes without combined total',()=>{
  const html=renderToStaticMarkup(<SeatUnit {...seatFacts} hands={splitHands} currentHandId={splitHands[1].handId} />);
  expect([...html.matchAll(/data-hand-id="([^"]+)"/g)].map(m=>m[1])).toEqual(['layout/seat-1.1.1','layout/seat-1.1.2','layout/seat-1.2.1','layout/seat-1.2.2']);
  for(const label of ['Hand A.1','Hand A.2 · Current hand','Hand B.1','Hand B.2','Total: 21','Total: 17','Total: 24','Total: 18','Wager: 50 credits','Wager: 100 credits','Win','Bust','Push'])expect(html).toContain(label);
  expect([...html.matchAll(/ACTIVE/g)]).toHaveLength(1); expect(html).not.toContain('Blackjack');
});
it('[M10A-U03] sitting out and missing portrait preserve explicit identity with no invented cards or funds',()=>{
  const html=renderToStaticMarkup(<SeatUnit {...seatFacts} avatar={undefined} hands={[]} wager={0} seat={{...seatFacts.seat,sittingOut:true}} currentSeat={null} />);
  expect(html).toContain('Seat 1 · Computer · Sitting Out'); expect(html).toContain('MAIN: 0 credits');
  expect(html).not.toContain('class="card '); expect(html).not.toContain('1,000'); expect(html).not.toContain('Current turn');
});
it('[M10A-U04] every real roster identity retains exact original portrait and accessible archetype',()=>{
  for(const avatar of characters){const html=renderToStaticMarkup(<SeatUnit {...seatFacts} avatar={avatar} />);
    expect(html).toContain(`aria-label="${avatar.name}"`); expect(html).toContain(avatar.portrait);
    expect(html).toContain(avatar.archetype); expect(html).toContain('Computer guest:');}
});
it('[M10A-U05] Blackjack and Charlie are displayed only from the public outcome',()=>{
  for(const [outcome,label] of [['PLAYER_BLACKJACK','Blackjack'],['CHARLIE','Charlie Win'],[undefined,'Playing']] as const){
    const hand=outcome==='PLAYER_BLACKJACK'?{...fiveCardHand,cards:[{rank:'A' as const,suit:'clubs' as const},{rank:'K' as const,suit:'diamonds' as const}],total:21,complete:true,outcome}
      :{...fiveCardHand,complete:outcome==='CHARLIE',outcome};
    const html=renderToStaticMarkup(<SeatUnit {...seatFacts} hands={[hand]} />);
    expect(html).toContain(label); if(!outcome)expect(html).not.toContain('Charlie');}
});
it('[M10A-U06] representative1–7 occupied-seat composition never changes public state or semantic ownership',()=>{
  const controller=createBrowserController({playerMode:true,seed:7}); controller.dispatch({type:'DEAL',amount:200});
  const original=controller.getSnapshot(), before=JSON.stringify(original);let notifications=0;const unsubscribe=controller.subscribe(()=>notifications++);
  for(const guestSeats of [[],[1],[1,3],[1,3,6],[1,2,3,6],[1,2,3,5,6],[1,2,3,5,6,7]]){
    const occupied=[...guestSeats,4].sort((a,b)=>a-b);
    const view={...original,configuration:original.configuration.map(s=>({...s,occupancy:occupied.includes(s.seatNumber)?s.seatNumber===4?'HUMAN' as const:'COMPUTER' as const:'EMPTY' as const}))};
    const html=renderToStaticMarkup(<Table view={view} lineup={createCharacterLineup(guestSeats,()=>0)} />);
    expect([...html.matchAll(/aria-label="Seat (\d)"/g)].map(m=>Number(m[1]))).toEqual(occupied);
    expect([...html.matchAll(/class="seat-unit"/g)]).toHaveLength(guestSeats.length);
    expect([...html.matchAll(/id="player-hand"/g)]).toHaveLength(1);
  }
  expect(JSON.stringify(controller.getSnapshot())).toBe(before);expect(notifications).toBe(0);unsubscribe();
});
