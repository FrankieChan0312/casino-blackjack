import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createBaccaratController } from '../../src/baccarat/controller.js';
import { BaccaratTable } from '../../src/baccarat/BaccaratTable.js';
import { replay } from '../../src/baccarat/domain/replay.js';
import { baccaratCredits, signedCredits } from '../../src/baccarat/format.js';
import { CasinoApp } from '../../src/casino/CasinoApp.js';
import { ordered, createLegacyBaccarat as createBaccarat } from './fixtures.js';

it('[M13-U01] controller commits first and notifies one settled exact Banker view', () => {
  const controller=createBaccaratController(createBaccarat(1,100000,ordered([3,9,0,0,7,7]))),observed:string[]=[];
  const unsubscribe=controller.subscribe(()=>observed.push(controller.getSnapshot().phase));
  expect(controller.dispatch({type:'WAGER',target:'BANKER',amountUnits:2500}).ok).toBe(true);
  expect(controller.dispatch({type:'DEAL'}).ok).toBe(true);
  const view=controller.getSnapshot();expect(observed).toEqual(['BETTING','COMPLETE']);
  expect([view.availableUnits,view.reservedUnits,view.pendingUnits,view.round?.outcome]).toEqual([102375,0,0,'BANKER']);
  expect(replay(controller.exportReplay()).digest).toBe(controller.getDigest());
  unsubscribe();controller.dispatch({type:'NEXT'});expect(observed).toHaveLength(2);
});
it('[M13-U02] rejected exposure/stale/duplicate phase controls preserve snapshot and digest', () => {
  const controller=createBaccaratController(createBaccarat(1));controller.dispatch({type:'WAGER',target:'PLAYER',amountUnits:100000});
  const snapshot=controller.getSnapshot(),digest=controller.getDigest(),commands=controller.exportReplay().commands;
  expect(controller.dispatch({type:'WAGER',target:'TIE',amountUnits:100}).ok).toBe(false);
  expect(controller.dispatch({type:'CLEAR'},'stale').ok).toBe(false);
  expect(controller.getSnapshot()).toBe(snapshot);expect(controller.getDigest()).toBe(digest);expect(controller.exportReplay().commands).toEqual(commands);
});
it('[M13-U03] exact hundredth formatting keeps commission without half-unit rounding', () => {
  expect([baccaratCredits(195),baccaratCredits(4875),baccaratCredits(102375),signedCredits(-2500),signedCredits(2375)])
    .toEqual(['1.95','48.75','1,023.75','-25','+23.75']);
});
it('[M13-U04] table has one human, formal Dealer, shared cards and game-appropriate targets', () => {
  const controller=createBaccaratController(createBaccarat(1)),html=renderToStaticMarkup(<BaccaratTable controller={controller}/>);
  for(const value of ['Baccarat table','Your Baccarat credits','Your character: Roland','Dealer: Celestine','Player','Banker','Tie','Wager amount','Place Bet','Clear Bets','No real money','No bet'])expect(html).toContain(value);
  expect(html).not.toMatch(/person-dealer|Hit<|Stand<|Computer|Seat4|guest has/);
  expect(html.match(/Your character:/g)).toHaveLength(1);expect(html).not.toContain('baccaratFixture');
});
it('[M13-U05] integrated lobby is available, default M11 bootstrap remains truthful', () => {
  const html=renderToStaticMarkup(<CasinoApp path="/casino" baccaratAvailable/>);expect(html).toContain('Play Baccarat');expect(html).not.toContain('IN DEVELOPMENT');
  expect(renderToStaticMarkup(<CasinoApp path="/baccarat" baccarat={<BaccaratTable controller={createBaccaratController(createBaccarat(1))}/>}/>)).toContain('Baccarat table');
});
