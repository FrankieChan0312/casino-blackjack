import { expect, it, vi } from 'vitest';
import * as replayModule from '../../src/domain/replay.js';
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
it('[REG-M8-060] new demo API exposes methods but no raw domain state or seed', () => {
  const c=seeded();expect(Object.keys(c).sort()).toEqual(['dispatch','exportReplay','getSnapshot','queryWager','replayCompleted','startDemo','subscribe']);
  expect(JSON.stringify(c.getSnapshot())).not.toMatch(/"seed"|deckIndex|availableCards|originalCards|"shoe"|randomAlgorithm/);
});
it('[REG-M8-061] profile cannot change in active round and invalid seed rejects atomically', () => {
  const c=seeded();const before=c.getSnapshot();expect(c.startDemo(CLASSIC,7)).toBe(false);
  expect(c.getSnapshot().round).toEqual(before.round);expect(c.getSnapshot().profileId).toBe(CHARLIE);
  const fresh=createBrowserController();expect(fresh.startDemo(CLASSIC,-1)).toBe(false);expect(fresh.getSnapshot().human?.available).toBe(2000);
});
it('[REG-M8-062] full replay package is inaccessible until real final settlement', () => {
  const c=seeded();expect(c.exportReplay()).toBeNull();expect(c.replayCompleted()).toBe(false);
  finish(c);expect(c.exportReplay()?.replayVersion).toBe(1);expect(c.getSnapshot().replayAvailable).toBe(true);
});
it('[REG-M8-063] browser replay reproduces original results without changing original archive', () => {
  const c=seeded();finish(c);const before=c.getSnapshot();expect(c.replayCompleted()).toBe(true);
  expect(c.getSnapshot().ownResults).toEqual(before.ownResults);expect(c.getSnapshot().human).toEqual(before.human);
  expect(c.getSnapshot().replayResult?.outcomes[0].resultRecords[0]).toMatchObject({outcome:'CHARLIE',grossReturnUnits:400});
  expect(c.getSnapshot().audit.slice(-2).map(e=>e.type)).toEqual(['REPLAY_START','REPLAY_COMPLETE']);
});
it('[REG-M8-064] next round removes replay result and export availability while preserving prior audit', () => {
  const c=seeded();finish(c);c.replayCompleted();const events=c.getSnapshot().audit;
  c.dispatch({type:'NEXT'});expect(c.exportReplay()).toBeNull();expect(c.getSnapshot().replayResult).toBeNull();
  expect(c.getSnapshot().audit.slice(0,events.length)).toEqual(events);
});
it('[REG-M8-065] seeded browser sessions reproduce cards and results; deliberate reset restores credits with event', () => {
  const a=seeded(),b=seeded();expect(a.getSnapshot().round).toEqual(b.getSnapshot().round);finish(a);finish(b);
  expect(a.getSnapshot().ownResults).toEqual(b.getSnapshot().ownResults);
  expect(a.startDemo(CLASSIC,0)).toBe(true);expect(a.getSnapshot().human?.available).toBe(2000);
  expect(a.getSnapshot().audit.at(-1)?.type).toBe('SESSION_RESET');
});
it('[REG-M8-066] unseeded demo keeps normal randomness and rejects early package requests', () => {
  const c=createBrowserController();expect(c.getSnapshot().seeded).toBe(false);expect(c.exportReplay()).toBeNull();
  expect(c.getSnapshot().profileId).toBe(CLASSIC);
});

it('[REG-M8-094] reviewer boundary completes at 10000 and rejects a two-intent overflow before any mutation', () => {
  for (const wagers of [9992, 9993]) {
    const c = createBrowserController({ seed: 21, profileId: CHARLIE, clock: time });
    expect(c.dispatch({ type: 'CONFIGURE', seats: [{ seatNumber: 1, occupancy: 'HUMAN', sittingOut: false }] })).toBe(true);
    expect(c.dispatch({ type: 'OPEN' })).toBe(true);
    for (let i = 0; i < wagers; i++) expect(c.dispatch({ type: 'MAIN', seat: 1, amount: i % 2 ? 202 : 200 })).toBe(true);
    expect(c.dispatch({ type: 'CLOSE' })).toBe(true);
    for (let i = 0; i < 3; i++) expect(c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' })).toBe(true);
    const before = c.getSnapshot();
    expect(c.dispatch({ type: 'ADVANCE' })).toBe(wagers === 9992);
    if (wagers === 9992) {
      expect(c.getSnapshot().phase).toBe('COMMITTED'); expect(c.getSnapshot().replayAvailable).toBe(true);
      const p = c.exportReplay()!; expect(p.commands).toHaveLength(10000);
      expect(replayModule.parseReplay(p)).toEqual(p); expect(c.replayCompleted()).toBe(true);
      const completed = c.getSnapshot();
      expect(completed.ownResults[0]).toMatchObject({ outcome: 'CHARLIE', stake: 202, returned: 404 });
      expect(c.dispatch({ type: 'NEXT' })).toBe(false);
      expect(c.getSnapshot()).toEqual({ ...completed, feedback: expect.stringContaining('command limit reached') });
      expect(c.exportReplay()).toEqual(p); expect(c.replayCompleted()).toBe(true);
      expect(c.startDemo(CLASSIC, 0)).toBe(true); expect(c.getSnapshot().human?.available).toBe(2000);
    } else {
      // ADVANCE+SETTLE would make the original 10001-entry package. Nothing runs.
      expect(c.getSnapshot()).toEqual({ ...before, feedback: expect.stringContaining('command limit reached') });
      expect(c.dispatch({ type: 'ADVANCE' })).toBe(false);
      expect(c.getSnapshot().audit).toEqual(before.audit); expect(c.getSnapshot().human).toEqual(before.human);
      expect(c.exportReplay()).toBeNull(); expect(c.getSnapshot().replayAvailable).toBe(false);
      expect(c.replayCompleted()).toBe(false); expect(c.startDemo(CLASSIC, 0)).toBe(false);
    }
  }
}, 20000); // Both near-10000-command scenarios and repeated replay under measured full-suite contention, not a product SLA.

it('[REG-M8-095] defensive replay validation failure hides availability and preserves original finances and audit', () => {
  const c = seeded(); finish(c); const before = c.getSnapshot();
  const spy = vi.spyOn(replayModule, 'replay').mockImplementation(() => { throw new replayModule.ReplayError('Malformed replay'); });
  try {
    expect(c.replayCompleted()).toBe(false);
    expect(c.getSnapshot()).toEqual({ ...before, replayAvailable: false, replayResult: null,
      feedback: 'Completed replay is unavailable: replay validation failed.' });
    expect(c.exportReplay()).toBeNull(); expect(c.replayCompleted()).toBe(false); expect(spy).toHaveBeenCalledTimes(1);
    expect(c.startDemo(CLASSIC, 0)).toBe(true); expect(c.getSnapshot().human?.available).toBe(2000);
  } finally { spy.mockRestore(); }
});
