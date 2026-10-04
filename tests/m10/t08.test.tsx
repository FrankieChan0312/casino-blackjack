import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { Table } from '../../src/ui/Table.js';
import { createFixtureController } from '../browser/fixtures.js';

it('[M10A-T08-U01] responsive presentation retains ascending public seats, cards-before-facts and controls-before-funds', () => {
  const c = createFixtureController('player'); expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  const before = JSON.stringify(c.getSnapshot()), html = renderToStaticMarkup(<App controller={c}/>);
  const markers = ['aria-label="Dealer"','aria-label="Seat 1"','aria-label="Seat 3"','id="player-hand"','aria-label="Seat 6"','id="player-decisions"','aria-label="Your credits"'];
  const indices = markers.map(m=>html.indexOf(m)); expect(indices.every(i=>i>=0)).toBe(true);
  expect(indices).toEqual([...indices].sort((a,b)=>a-b));
  const local = html.slice(indices[3],indices[4]); expect(local.indexOf('class="cards"')).toBeLessThan(local.indexOf('class="hud-hand-facts"'));
  for (const text of ['Total: <strong>9</strong>','Wager: 100 credits','Playing','Hand A · Current hand']) expect(local).toContain(text);
  expect(JSON.stringify(c.getSnapshot())).toBe(before);
});
it('[M10A-T08-U02] labelled public count concepts1–7 preserve one human and ascending identities without runtime count support', () => {
  const c = createFixtureController('player'), view = c.getSnapshot(), before = JSON.stringify(view);
  const sets = [[4],[1,4],[1,4,7],[1,3,4,6],[1,2,4,6,7],[1,2,3,4,6,7],[1,2,3,4,5,6,7]];
  for (const numbers of sets) {
    // Public composition fixture only; never dispatched, installed in the app, or represented as played occupancy.
    const configuration = numbers.map(seatNumber=>({seatNumber,occupancy:seatNumber===4?'HUMAN' as const:'COMPUTER' as const,sittingOut:false,controllerId:seatNumber===4?'human':'computer-'+seatNumber}));
    const html = renderToStaticMarkup(<Table view={{...view,configuration}}/>);
    expect([...html.matchAll(/aria-label="Seat (\d)"/g)].map(m=>Number(m[1]))).toEqual(numbers);
    expect([...html.matchAll(/aria-label="Your player HUD"/g)]).toHaveLength(1);
    expect([...html.matchAll(/class="seat-unit"/g)]).toHaveLength(numbers.length-1);
    expect(html).toContain('Waiting for the initial deal'); expect(html).not.toContain('Total players');
  }
  expect(JSON.stringify(c.getSnapshot())).toBe(before);
});
