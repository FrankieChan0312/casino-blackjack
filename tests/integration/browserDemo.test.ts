import { expect, it } from 'vitest';
import { createBrowserController } from '../../src/browser/controller.js';
import { CLASSIC, CHARLIE } from '../../src/domain/profile.js';
const time = () => '2026-09-30T05:00:00.000Z';
function seeded() {
  const c = createBrowserController({ seed: 21, profileId: CHARLIE, clock: time });
  c.dispatch({type:'CONFIGURE',seats:[{seatNumber:1,occupancy:'HUMAN',sittingOut:false}]});c.dispatch({type:'OPEN'});
  c.dispatch({type:'MAIN',seat:1,amount:200});c.dispatch({type:'CLOSE'});return c;
}
function finish(c: ReturnType<typeof seeded>) {
  if(c.getSnapshot().interaction.insurance)c.dispatch({type:'ACE',choice:'DECLINE'});
  for(let i=0;i<3;i++)c.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-1'});
  c.dispatch({type:'ADVANCE'});
}
it('new demo API exposes methods but no raw domain state or seed', () => {
  const c=seeded();expect(Object.keys(c).sort()).toEqual(['dispatch','exportReplay','getSnapshot','queryWager','replayCompleted','startDemo','subscribe']);
  expect(JSON.stringify(c.getSnapshot())).not.toMatch(/"seed"|deckIndex|availableCards|originalCards|"shoe"|randomAlgorithm/);
});
it('profile cannot change in active round and invalid seed rejects atomically', () => {
  const c=seeded();const before=c.getSnapshot();expect(c.startDemo(CLASSIC,7)).toBe(false);
  expect(c.getSnapshot().round).toEqual(before.round);expect(c.getSnapshot().profileId).toBe(CHARLIE);
  const fresh=createBrowserController();expect(fresh.startDemo(CLASSIC,-1)).toBe(false);expect(fresh.getSnapshot().human?.available).toBe(2000);
});
it('full replay package is inaccessible until real final settlement', () => {
  const c=seeded();expect(c.exportReplay()).toBeNull();expect(c.replayCompleted()).toBe(false);
  finish(c);expect(c.exportReplay()?.replayVersion).toBe(1);expect(c.getSnapshot().replayAvailable).toBe(true);
});
it('browser replay reproduces original results without changing original archive', () => {
  const c=seeded();finish(c);const before=c.getSnapshot();expect(c.replayCompleted()).toBe(true);
  expect(c.getSnapshot().ownResults).toEqual(before.ownResults);expect(c.getSnapshot().human).toEqual(before.human);
  expect(c.getSnapshot().replayResult?.outcomes[0].resultRecords[0]).toMatchObject({outcome:'CHARLIE',grossReturnUnits:400});
  expect(c.getSnapshot().audit.slice(-2).map(e=>e.type)).toEqual(['REPLAY_START','REPLAY_COMPLETE']);
});
it('next round removes replay result and export availability while preserving prior audit', () => {
  const c=seeded();finish(c);c.replayCompleted();const events=c.getSnapshot().audit;
  c.dispatch({type:'NEXT'});expect(c.exportReplay()).toBeNull();expect(c.getSnapshot().replayResult).toBeNull();
  expect(c.getSnapshot().audit.slice(0,events.length)).toEqual(events);
});
it('seeded browser sessions reproduce cards and results; deliberate reset restores credits with event', () => {
  const a=seeded(),b=seeded();expect(a.getSnapshot().round).toEqual(b.getSnapshot().round);finish(a);finish(b);
  expect(a.getSnapshot().ownResults).toEqual(b.getSnapshot().ownResults);
  expect(a.startDemo(CLASSIC,0)).toBe(true);expect(a.getSnapshot().human?.available).toBe(2000);
  expect(a.getSnapshot().audit.at(-1)?.type).toBe('SESSION_RESET');
});
it('unseeded demo keeps normal randomness and rejects early package requests', () => {
  const c=createBrowserController();expect(c.getSnapshot().seeded).toBe(false);expect(c.exportReplay()).toBeNull();
  expect(c.getSnapshot().profileId).toBe(CLASSIC);
});
