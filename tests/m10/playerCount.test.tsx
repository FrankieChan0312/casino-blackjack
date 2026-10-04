import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { createBrowserController, type BrowserController } from '../../src/browser/controller.js';
import * as replayModule from '../../src/domain/replay.js';
import { CLASSIC_V1_2 } from '../../src/domain/profile.js';
import { createBehindGame } from '../../src/domain/behindGame.js';
import { App } from '../../src/ui/App.js';
import { createCharacterLineup, changeHumanCharacter, characters } from '../../src/presentation/characters.js';

const occupied = [[4], [3,4], [3,4,6], [1,3,4,6], [1,3,4,5,6], [1,2,3,4,5,6], [1,2,3,4,5,6,7]];
function finish(c: BrowserController) {
  for (let i = 0; i < 32 && !c.getSnapshot().interaction.nextRound; i++) {
    const v = c.getSnapshot();
    expect(c.dispatch(v.interaction.insurance ? {type:'ACE',choice:'DECLINE'} : v.interaction.canAdvance
      ? {type:'ADVANCE'} : {type:'ACT',action:'STAND',handId:v.interaction.handId})).toBe(true);
  }
  expect(c.getSnapshot().phase).toBe('COMMITTED');
}
it('[M10-C01] production defers all seat commands and funding; accessible default is four', () => {
  let draws = 0;
  const c = createBrowserController({playerMode:true,deferPlayerStart:true,random:{nextInt:n=>{draws++;return n-1;}}});
  const before = draws;
  expect(c.getSnapshot()).toMatchObject({playerCount:4,tableStarted:false,phase:'CONFIGURING',mainWagers:[]});
  expect(c.getSnapshot().configuration.every(s=>s.occupancy==='EMPTY')).toBe(true);
  const html = renderToStaticMarkup(<App controller={c} chooseCharacter={()=>0} />);
  expect(html).toContain('Total players'); expect(html).toContain('Start table'); expect(html).toContain('value="4" selected=""');
  expect(draws).toBe(before); expect(c.getSnapshot().audit).toHaveLength(1);
  expect(readFileSync('src/main.tsx','utf8')).toContain('else controller = createBrowserController({ playerMode: true, deferPlayerStart: true });');
});
for (let count=1; count<=7; count++) it(`[M10-C02-${count}] actual count, initial draw population, authoritative seats, replay and two continuations`, () => {
  const recorder = replayModule.createReplaySession(7,CLASSIC_V1_2);
  const factory = vi.spyOn(replayModule,'createReplaySession').mockReturnValue(recorder);
  const dispatch = vi.spyOn(recorder,'dispatch');
  try {
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7});
    const before=recorder.getState(); expect(c.dispatch({type:'START',count})).toBe(true);
    const v=c.getSnapshot(), seats=occupied[count-1], guests=seats.filter(s=>s!==4);
    expect(v.configuration.filter(s=>s.occupancy!=='EMPTY').map(s=>s.seatNumber)).toEqual(seats);
    expect(v.configuration.filter(s=>s.occupancy==='HUMAN').map(s=>s.seatNumber)).toEqual([4]);
    expect(v.configuration.filter(s=>s.occupancy==='COMPUTER')).toHaveLength(count-1);
    expect(v.mainWagers).toEqual(guests.map(seat=>({seat,amount:50})));
    expect(v.human).toMatchObject({available:2000,reserved:0});
    expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
    const closeIndex=dispatch.mock.calls.findIndex(([cmd])=>cmd.type==='CLOSE');
    const closed=dispatch.mock.results[closeIndex].value;
    expect(closed.ok).toBe(true);
    expect(closed.state.table.game.round.players.map((p: {seatNumber:number})=>p.seatNumber)).toEqual(seats);
    expect(closed.state.table.game.round.players.every((p: {cards:unknown[]})=>p.cards.length===2)).toBe(true);
    expect(closed.state.table.game.round.dealerCards).toHaveLength(2);
    expect(before.table.game.shoe.available.length-closed.state.table.game.shoe.available.length).toBe(2*(count+1));
    expect(c.getSnapshot().round?.dealer.holeCard).toBeNull();
    finish(c);
    const p=c.exportReplay()!; expect(replayModule.replay(p).digest).toBe(p.outcomeDigest);
    expect(p.commands[0].command).toMatchObject({type:'CONFIGURE'});
    expect(p.commands.slice(1,2+guests.length).map(e=>e.command.type)).toEqual(['OPEN',...guests.map(()=>'MAIN')]);
    const funds=c.getSnapshot().human, marker=c.getSnapshot().presentationSession;
    expect(c.dispatch({type:'NEXT'})).toBe(true); expect(c.getSnapshot().human).toEqual(funds);
    expect(c.getSnapshot().playerCount).toBe(count); expect(c.getSnapshot().presentationSession).toBe(marker);
    expect(c.dispatch({type:'DEAL',amount:200})).toBe(true); finish(c);
    expect(c.dispatch({type:'REPEAT'})).toBe(true); expect(c.getSnapshot().playerCount).toBe(count); finish(c);
    expect(replayModule.replay(c.exportReplay()!).outcomes).toHaveLength(3);
    expect(c.dispatch({type:'NEW_TABLE'})).toBe(true);
    expect(c.getSnapshot()).toMatchObject({tableStarted:false,phase:'CONFIGURING',playerCount:count});
    expect(c.getSnapshot().human).toMatchObject({available:2000,reserved:0});
    expect(c.dispatch({type:'START',count:8-count})).toBe(true); expect(c.getSnapshot().playerCount).toBe(8-count);
  } finally { factory.mockRestore(); }
});
it('[M10-C03] invalid/setup/active commands reject without RNG funds clock journal or configuration mutation', () => {
  let clock=0; const recorder=replayModule.createReplaySession(7,CLASSIC_V1_2,{clock:()=>new Date(Date.UTC(2026,0,1,0,0,++clock)).toISOString()});
  const factory=vi.spyOn(replayModule,'createReplaySession').mockReturnValue(recorder);
  try {
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7});
    const before=recorder.getState(), ticks=clock;
    for (const count of [0,8,-1,1.5,NaN,Infinity]) expect(c.dispatch({type:'START',count})).toBe(false);
    expect(c.dispatch({type:'OPEN'})).toBe(false); expect(c.dispatch({type:'DEAL',amount:200})).toBe(false);
    expect(recorder.getState()).toBe(before); expect(clock).toBe(ticks);
    c.dispatch({type:'START',count:7}); const funded=recorder.getState();
    expect(c.dispatch({type:'START',count:1})).toBe(false); expect(c.dispatch({type:'NEW_TABLE'})).toBe(false);
    expect(recorder.getState()).toBe(funded);
    c.dispatch({type:'DEAL',amount:200}); const active=recorder.getState();
    expect(c.dispatch({type:'START',count:1})).toBe(false); expect(c.dispatch({type:'NEW_TABLE'})).toBe(false);
    expect(recorder.getState()).toBe(active); expect(c.getSnapshot().playerCount).toBe(7);
  } finally { factory.mockRestore(); }
});
it('[M10-C04] seven guests preflight Start9 NEXT10 Repeat14 slots before any composite mutation', () => {
  const recorder=replayModule.createReplaySession(7,CLASSIC_V1_2); const factory=vi.spyOn(replayModule,'createReplaySession').mockReturnValue(recorder);
  try {
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7});
    const cap=vi.spyOn(recorder,'hasCapacity').mockImplementation((n=1)=>n<9), state=recorder.getState();
    expect(c.dispatch({type:'START',count:7})).toBe(false); expect(c.getSnapshot().tableStarted).toBe(false);
    expect(c.getSnapshot().playerCount).toBe(4); expect(recorder.getState()).toBe(state); cap.mockRestore();
    c.dispatch({type:'START',count:7}); c.dispatch({type:'DEAL',amount:200}); finish(c);
    for (const [type,capacity] of [['NEXT',10],['REPEAT',14]] as const) {
      const cap2=vi.spyOn(recorder,'hasCapacity').mockImplementation((n=1)=>n<capacity), before=recorder.getState(), p=c.exportReplay();
      expect(c.dispatch({type})).toBe(false); expect(recorder.getState()).toBe(before); expect(c.exportReplay()).toEqual(p); cap2.mockRestore();
    }
  } finally { factory.mockRestore(); }
});
it('[M10-C05] real low-funded guests stay configured, preserve odd units, and sit out without refill', () => {
  const random={nextInt:(n:number)=>n-1}; const base=createBehindGame('count-low',random,true,CLASSIC_V1_2);
  const initial={...base,computers:base.computers.map(p=>({...p,bankroll:{available:p.seatNumber===1?19:p.seatNumber===2?37:2000,reserved:0}}))};
  const c=createBrowserController({playerMode:true,deferPlayerStart:true,factory:()=>initial,random});
  c.dispatch({type:'START',count:7});
  expect(c.getSnapshot().configuration.filter(s=>s.occupancy!=='EMPTY')).toHaveLength(7);
  expect(c.getSnapshot().configuration[0]).toMatchObject({sittingOut:true});
  expect(c.getSnapshot().mainWagers).toEqual([2,3,5,6,7].map(seat=>({seat,amount:seat===2?36:50})));
  expect(initial.computers[0].bankroll.available).toBe(19); expect(initial.computers[1].bankroll.available).toBe(37);
});
it('[M10-C06] every count and human avatar choice keeps unique real roster IDs', () => {
  for (const seats of occupied) {
    const lineup=createCharacterLineup(seats.filter(s=>s!==4),()=>0);
    for (const avatar of characters) {
      const changed=changeHumanCharacter(lineup,avatar.id);
      expect(new Set([changed.human,...Object.values(changed.guests)]).size).toBe(seats.length);
      expect(Object.keys(changed.guests).map(Number)).toEqual(seats.filter(s=>s!==4));
    }
  }
});
