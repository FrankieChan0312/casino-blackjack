import { expect, it } from 'vitest';
import { createReplaySession, replay } from '../../src/domain/replay.js';
import { createAuditTrail } from '../../src/domain/audit.js';
import { CLASSIC, CHARLIE } from '../../src/domain/profile.js';
import { startSession, closeAce, finishSession, send } from '../helpers/replayFixture.js';

const time = '2026-09-30T05:00:00.000Z';
it('[REG-M8-043] audit sequence is contiguous and authoritative even for identical injected UTC times', () => {
  const s = startSession(0,CLASSIC,false,false,() => time); finishSession(s);
  const events = s.getAudit();
  expect(events.map(e => e.sequence)).toEqual(events.map((_,i) => i+1));
  expect(events.every(e => e.timestamp === time && e.auditVersion === 1)).toBe(true);
  expect(events[0]).toMatchObject({ type: 'SESSION_START', profileId: CLASSIC, actorId: 'system', roundId: null });
});
it('[REG-M8-044] audit clock rejects timestamps without explicit UTC', () => {
  for (const value of ['2026-09-30 13:00:00','bad','2026-09-30T05:00:00.000']) expect(() => createReplaySession(0,CLASSIC,{clock:()=>value})).toThrow('ISO UTC');
});
it('[REG-M8-045] accepted Hit carries actor round seat hand wager action ID and stake', () => {
  const s = startSession(21); closeAce(s);
  send(s,{type:'ACT',action:'HIT',handId:'round-1/seat-1'});
  expect(s.getAudit().find(e => e.type === 'HIT')).toMatchObject({ actorId:'local-human',roundId:'round-1',seat:1,
    handId:'round-1/seat-1',wagerId:'round-1/seat-1/MAIN',amountUnits:200,status:'ACCEPTED' });
  expect(s.getAudit().find(e => e.type === 'HIT')!.commandId).toMatch(/^command-\d+$/);
});
it('[REG-M8-046] rejected Split appends diagnostic without gameplay mutation', () => {
  const s = startSession(0); closeAce(s); const before = s.getState(); const count = s.getAudit().length;
  expect(s.dispatch({type:'ACT',action:'SPLIT',handId:'wrong-hand'}).ok).toBe(false);
  expect(s.getState()).toBe(before);
  expect(s.getAudit()).toHaveLength(count+1);
  expect(s.getAudit().at(-1)).toMatchObject({type:'SPLIT',status:'REJECTED',reason:'WRONG_HAND',actorId:'local-human'});
});
it('[REG-M8-047] Split attributes parent action and each ordered child separately', () => {
  const s = startSession(36); closeAce(s); send(s,{type:'ACT',action:'SPLIT',handId:'round-1/seat-1'});
  expect(s.getAudit().find(e=>e.type==='SPLIT')).toMatchObject({handId:'round-1/seat-1',seat:1,actorId:'local-human'});
  expect(s.getAudit().filter(e=>e.type==='SPLIT_CHILD').map(e=>[e.handId,e.wagerId,e.amountUnits])).toEqual([
    ['round-1/seat-1.1','round-1/seat-1.1/MAIN',200],['round-1/seat-1.2','round-1/seat-1.2/MAIN',200]]);
});
it('[REG-M8-048] Stand and Surrender record the exact human action', () => {
  const stand = startSession(); closeAce(stand); send(stand,{type:'ACT',action:'STAND',handId:'round-1/seat-1'});
  expect(stand.getAudit().at(-1)).toMatchObject({type:'STAND',actorId:'local-human',handId:'round-1/seat-1'});
  const surrender = startSession(); closeAce(surrender); send(surrender,{type:'ACT',action:'SURRENDER',handId:'round-1/seat-1'});
  finishSession(surrender);
  expect(surrender.getAudit().find(e=>e.type==='SURRENDER')).toMatchObject({status:'ACCEPTED',amountUnits:200});
  expect(surrender.getAudit().find(e=>e.type==='WAGER_SETTLEMENT')).toMatchObject({outcome:'SURRENDERED',returnedUnits:100});
});
it('[REG-M8-049] Double attribution and settlement use actual funded doubled exposure', () => {
  const s = startSession(); closeAce(s); send(s,{type:'ACT',action:'DOUBLE',handId:'round-1/seat-1'}); finishSession(s);
  expect(s.getAudit().find(e=>e.type==='DOUBLE')).toMatchObject({actorId:'local-human',amountUnits:200,status:'ACCEPTED'});
  expect(s.getAudit().find(e=>e.type==='WAGER_SETTLEMENT')).toMatchObject({amountUnits:400});
});
it('[REG-M8-050] Bet Behind follower ADD has follower actor, affected hand and original wager', () => {
  const s=startSession(36,CLASSIC,true); closeAce(s);
  send(s,{type:'CONTROLLER',ownerId:'computer-1',action:'SPLIT',handId:'round-1/seat-1'});
  send(s,{type:'FOLLOW',choice:'ADD'}); finishSession(s);
  expect(s.getAudit().find(e=>e.type==='FOLLOW_ADD')).toMatchObject({actorId:'local-human',seat:1,handId:'round-1/seat-1',wagerId:'round-1/seat-1/BACK/local-human',amountUnits:50});
  expect(s.getAudit().filter(e=>e.type==='WAGER_SETTLEMENT'&&e.actorId==='local-human')).toHaveLength(2);
});
it('[REG-M8-051] Insurance audit has independent decision, actor, amount and result', () => {
  const s=startSession(); closeAce(s,'INSURANCE'); finishSession(s);
  const event=s.getAudit().find(e=>e.type==='INSURANCE');
  expect(event).toMatchObject({actorId:'local-human',seat:1,amountUnits:100,status:'ACCEPTED'});
  expect(event!.wagerId).toBe('round-1/seat-1/INSURANCE');
  expect(s.getAudit().find(e=>e.type==='WAGER_SETTLEMENT'&&e.wagerId?.endsWith('/INSURANCE'))).toMatchObject({amountUnits:100,outcome:'LOSS',returnedUnits:0});
});
it('[REG-M8-052] Even Money audit is a main election with no extra funded stake', () => {
  const s=startSession(125); closeAce(s,'EVEN_MONEY'); finishSession(s);
  expect(s.getAudit().find(e=>e.type==='EVEN_MONEY')).toMatchObject({actorId:'local-human',wagerId:'round-1/seat-1/MAIN',status:'ACCEPTED'});
  expect(s.getAudit().find(e=>e.type==='WAGER_SETTLEMENT')).toMatchObject({outcome:'EVEN_MONEY',amountUnits:200,returnedUnits:400});
});
it('[REG-M8-053] Charlie event is attributable and distinct from final settlement', () => {
  const s=startSession(21,CHARLIE); closeAce(s);
  for(let i=0;i<3;i++) send(s,{type:'ACT',action:'HIT',handId:'round-1/seat-1'});
  expect(s.getAudit().find(e=>e.type==='CHARLIE')).toMatchObject({actorId:'local-human',handId:'round-1/seat-1',amountUnits:200,outcome:'CHARLIE',returnedUnits:400});
  expect(s.getAudit().some(e=>e.type==='WAGER_SETTLEMENT')).toBe(false);
  finishSession(s); expect(s.getAudit().find(e=>e.type==='WAGER_SETTLEMENT')).toMatchObject({outcome:'CHARLIE',returnedUnits:400});
});
it('[REG-M8-054] VOID records actual integrity reason and attributed zero-profit refund', () => {
  const s=startSession(0,CLASSIC,false,true);closeAce(s);send(s,{type:'DEMO_DRAW_FAULT'});
  send(s,{type:'ACT',action:'HIT',handId:'round-1/seat-1'});send(s,{type:'VOID'});
  expect(s.getAudit().find(e=>e.type==='INTEGRITY_FAULT')).toMatchObject({reason:'SHOE_EXHAUSTED_DURING_ROUND',roundId:'round-1'});
  expect(s.getAudit().find(e=>e.type==='WAGER_REFUND')).toMatchObject({actorId:'local-human',amountUnits:200,returnedUnits:200,outcome:'VOID'});
});
it('[REG-M8-055] prior frozen events and next-round archive remain unchanged and sequence continues', () => {
  const s=startSession();finishSession(s);const events=s.getAudit();const before=JSON.stringify(events);
  expect(Object.isFrozen(events)).toBe(true);expect(events.every(Object.isFrozen)).toBe(true);
  send(s,{type:'NEXT'});send(s,{type:'OPEN'});send(s,{type:'MAIN',seat:1,amount:200});
  expect(JSON.stringify(events)).toBe(before);
  expect(s.getAudit().at(-1)).toMatchObject({roundId:'round-2',sequence:events.length+3});
});
it('[REG-M8-056] public audit includes no hole, shoe order, physical card IDs or active seed/state', () => {
  const s=startSession(0);const hidden=s.getState().table.game.round!.dealerCards[1];
  const serialized=JSON.stringify(s.getAudit());
  expect(serialized).not.toContain(hidden.id);
  expect(serialized).not.toMatch(/deckIndex|available|discarded|cards|seed|prng|randomAlgorithm|rank|suit|hole/i);
  expect(Object.keys(s.getAudit()[0])).toEqual(['auditVersion','sequence','timestamp','profileId','roundId','type','actorId','seat','handId','wagerId','commandId','amountUnits','returnedUnits','outcome','status','reason']);
});
it('[REG-M8-057] clock changes audit evidence without affecting replay digest or terminal equality', () => {
  const a=startSession(0,CLASSIC,false,false,()=>time);const b=startSession(0,CLASSIC,false,false,()=> '2026-10-01T05:00:00.000Z');
  const pa=finishSession(a);const pb=finishSession(b);
  expect(a.getAudit()).not.toEqual(b.getAudit());expect(pa).toEqual(pb);expect(replay(pa)).toEqual(replay(pb));
});
it('[REG-M8-058] explicit replay audit boundaries retain ordering without changing gameplay', () => {
  const s=startSession();finishSession(s);const state=s.getState();const audit=createAuditTrail(state,()=>time);
  audit.recordReplay(state,false);replay(s.exportPackage());audit.recordReplay(state,true);
  expect(audit.getPublic().map(e=>e.type)).toEqual(['SESSION_START','REPLAY_START','REPLAY_COMPLETE']);expect(s.getState()).toBe(state);
});
it('[REG-M8-059] actual computer HIT/HIT/STAND is complete and Split supplements are not HIT decisions', () => {
  const s=startSession(21,CLASSIC,true);
  expect(s.getState().table.game.round!.players[0].cards.map(c=>c.rank)).toEqual(['4','5']);
  finishSession(s);
  expect(s.getState().table.game.round!.players[0].cards.map(c=>c.rank)).toEqual(['4','5','5','4']);
  const actions = s.getAudit().filter(e=>e.type==='HIT'||e.type==='STAND');
  expect(actions.map(e=>[e.type,e.actorId,e.seat,e.handId,e.wagerId,e.amountUnits])).toEqual([
    ['HIT','computer-1',1,'round-1/seat-1','round-1/seat-1/MAIN',200],
    ['HIT','computer-1',1,'round-1/seat-1','round-1/seat-1/MAIN',200],
    ['STAND','computer-1',1,'round-1/seat-1','round-1/seat-1/MAIN',200],
  ]);
  expect(new Set(actions.map(e=>e.commandId)).size).toBe(1);
  expect(s.getAudit().find(e=>e.type==='DEALER_COMPLETE')).toMatchObject({actorId:'dealer',roundId:'round-1'});
  const split=startSession(36,CLASSIC,true);closeAce(split);
  send(split,{type:'CONTROLLER',ownerId:'computer-1',action:'SPLIT',handId:'round-1/seat-1'});
  send(split,{type:'FOLLOW',choice:'NO_ADD'});
  expect(split.getState().table.game.round!.players.map(h=>h.cards.map(c=>c.rank))).toEqual([['3','4'],['3']]);
  finishSession(split);
  expect(split.getState().table.game.round!.players.map(h=>h.cards.map(c=>c.rank))).toEqual([['3','4','A'],['3','K','K']]);
  expect(split.getAudit().filter(e=>e.type==='HIT'||e.type==='STAND').map(e=>[e.type,e.handId])).toEqual([
    ['HIT','round-1/seat-1.1'],['STAND','round-1/seat-1.1'],['HIT','round-1/seat-1.2'],
  ]); // Child 2's K supplement is not HIT; its subsequent bust does not invent STAND.
  const charlie=startSession(22,CHARLIE,true);finishSession(charlie);
  expect(charlie.getAudit().filter(e=>e.type==='HIT'||e.type==='STAND').map(e=>e.type)).toEqual(['HIT','HIT','HIT']);
  expect(charlie.getAudit().find(e=>e.type==='CHARLIE')).toMatchObject({actorId:'computer-1',outcome:'CHARLIE'});
});
it('[REG-M8-092] MAIN cancellation records actual MAIN and dependent SIDE/BACK refunds with owner wager amount and shared command attribution', () => {
  const s=createReplaySession(1,CLASSIC,{clock:()=>time});
  send(s,{type:'CONFIGURE',seats:[{seatNumber:1,occupancy:'HUMAN',sittingOut:false},
    {seatNumber:2,occupancy:'COMPUTER',sittingOut:false}]});
  send(s,{type:'OPEN'});send(s,{type:'MAIN',seat:1,amount:200});send(s,{type:'SIDE',kind:'PAIR',amount:20});
  send(s,{type:'MAIN',seat:2,amount:200});send(s,{type:'BACK',seat:2,amount:50});
  expect(s.getState().human!.bankroll).toEqual({available:1730,reserved:270});
  const index=s.getAudit().length;
  send(s,{type:'MAIN',seat:1,amount:0});send(s,{type:'MAIN',seat:2,amount:0});
  expect(s.getState().human!.bankroll).toEqual({available:2000,reserved:0});
  expect(s.getState().computers[1].bankroll).toEqual({available:2000,reserved:0});
  expect(s.getState().table.sideWagers).toEqual([]);expect(s.getState().backWagers).toEqual([]);
  const cancellations=s.getAudit().slice(index);
  expect(cancellations.map(e=>[e.type,e.actorId,e.seat,e.wagerId,e.amountUnits,e.returnedUnits])).toEqual([
    ['MAIN_CANCEL','local-human',1,'round-1/seat-1/MAIN',200,200],
    ['PAIR_CANCEL','local-human',1,'round-1/seat-1/PAIR',20,20],
    ['MAIN_CANCEL','computer-2',2,'round-1/seat-2/MAIN',200,200],
    ['BACK_CANCEL','local-human',2,'round-1/seat-2/BACK/local-human',50,50],
  ]);
  expect(cancellations[0].commandId).toBe(cancellations[1].commandId);
  expect(cancellations[2].commandId).toBe(cancellations[3].commandId);
  expect(cancellations[0].commandId).not.toBe(cancellations[2].commandId);
  expect(cancellations.every(e=>e.roundId==='round-1'&&e.status==='ACCEPTED')).toBe(true);
  const count=s.getAudit().length;
  expect(s.dispatch({type:'MAIN',seat:1,amount:0})).toMatchObject({ok:false,error:'NO_WAGER'});
  // A rejected duplicate cancellation cannot create another refund.
  expect(s.getAudit().slice(count).filter(e=>e.returnedUnits!==null)).toEqual([]);
  expect(s.getState().human!.bankroll).toEqual({available:2000,reserved:0});
  send(s,{type:'MAIN',seat:1,amount:200});send(s,{type:'SIDE',kind:'THREE_CARD',amount:10});
  send(s,{type:'MAIN',seat:1,amount:0});
  expect(s.getAudit().at(-1)).toMatchObject({type:'THREE_CARD_CANCEL',actorId:'local-human',seat:1,
    wagerId:'round-1/seat-1/THREE_CARD',amountUnits:10,returnedUnits:10});
});
