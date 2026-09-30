import { expect, it } from 'vitest';
import { createReplaySession, replay, parseReplay, outcomeDigest, canonical } from '../../src/domain/replay.js';
import { CLASSIC, CHARLIE } from '../../src/domain/profile.js';
import { startSession, closeAce, finishSession, send } from '../helpers/replayFixture.js';
import { freezeDeep } from '../helpers/advancedFixture.js';

it('[REG-M8-025] Classic package repeats final public state and exact result records', () => {
  const s = startSession(); const p = finishSession(s); const first = replay(p);
  expect(first.publicState).toEqual(s.getPublic());
  expect(first.outcomes).toEqual(s.getOutcomes());
  expect(first).toEqual(replay(JSON.stringify(p)));
  expect(first.outcomes[0].resultRecords[0]).toMatchObject({ stakeUnits: 200, status: 'COMMITTED' });
});
it('[REG-M8-026] Charlie replay reproduces fifth legal Hit with exact 1:1 outcome', () => {
  const s = startSession(21, CHARLIE); closeAce(s);
  for (let i = 0; i < 3; i++) send(s, { type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  const p = finishSession(s); const r = replay(p);
  expect(r.outcomes[0].resultRecords[0]).toMatchObject({ outcome: 'CHARLIE', stakeUnits: 200, grossReturnUnits: 400 });
  expect(r.outcomes).toEqual(s.getOutcomes());
});
it('[REG-M8-027] split replay routes real handlers and preserves leaf records', () => {
  const s = startSession(36); closeAce(s);
  send(s, { type: 'ACT', action: 'SPLIT', handId: 'round-1/seat-1' });
  const p = finishSession(s); const r = replay(p);
  expect(r.outcomes[0].resultRecords.filter(r => r.type === 'MAIN').map(r => r.handId)).toEqual(['round-1/seat-1.1','round-1/seat-1.2']);
});
it('[REG-M8-028] Insurance replay records real independent purchase and result', () => {
  const s = startSession(0); closeAce(s, 'INSURANCE');
  const r = replay(finishSession(s));
  expect(r.outcomes[0].resultRecords.find(r => r.type === 'INSURANCE')).toMatchObject({ stakeUnits: 100, outcome: 'LOSS', grossReturnUnits: 0 });
});
it('[REG-M8-029] Bet Behind replay retains separate actual follower stake', () => {
  const s = startSession(0, CLASSIC, true); const r = replay(finishSession(s));
  expect(r.outcomes[0].backRecords[0].stakeUnits).toBe(50);
  expect(r.outcomes).toEqual(s.getOutcomes());
});
it('[REG-M8-030] follower ADD replay uses owner-checked Split and actual two child stakes', () => {
  const s = startSession(36, CLASSIC, true); closeAce(s);
  send(s, { type: 'CONTROLLER', ownerId: 'computer-1', action: 'SPLIT', handId: 'round-1/seat-1' });
  send(s, { type: 'FOLLOW', choice: 'ADD' });
  const r = replay(finishSession(s));
  expect(r.outcomes[0].backRecords.map(r => [r.handId,r.stakeUnits])).toEqual([['round-1/seat-1.1',50],['round-1/seat-1.2',50]]);
});
it('[REG-M8-031] follower NO_ADD replay tracks only first child', () => {
  const s = startSession(36, CLASSIC, true); closeAce(s);
  send(s, { type: 'CONTROLLER', ownerId: 'computer-1', action: 'SPLIT', handId: 'round-1/seat-1' });
  send(s, { type: 'FOLLOW', choice: 'NO_ADD' });
  expect(replay(finishSession(s)).outcomes[0].backRecords.map(r => r.handId)).toEqual(['round-1/seat-1.1']);
});
it('[REG-M8-032] explicit developer draw-fault evidence reproduces real VOID and refund once', () => {
  const s = startSession(0, CLASSIC, false, true); closeAce(s);
  send(s, { type: 'DEMO_DRAW_FAULT' });
  expect(s.dispatch({ type: 'VOID' }).ok).toBe(false); // not yet a required draw failure
  send(s, { type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' }); send(s, { type: 'VOID' });
  const r = replay(s.exportPackage());
  expect(r.publicState.phase).toBe('VOID');
  expect(r.outcomes[0].resultRecords[0]).toMatchObject({ outcome: 'VOID', grossReturnUnits: 200, netUnits: 0 });
  expect(s.dispatch({ type: 'VOID' }).ok).toBe(false);
});
it('[REG-M8-033] demo fault is rejected by default and changes no state', () => {
  const s = startSession(); closeAce(s); const before = s.getState();
  expect(s.dispatch({ type: 'DEMO_DRAW_FAULT' })).toMatchObject({ ok: false, state: before });
  expect(s.getState()).toBe(before);
});
it('[REG-M8-034] multiple rounds replay preserves ordered archived results and persistent shoe', () => {
  const s = startSession(); finishSession(s); const prior = s.getOutcomes()[0]; const before = JSON.stringify(prior);
  const shoeId = s.getState().table.game.shoe.shoeId;
  send(s, { type: 'NEXT' }); send(s, { type: 'OPEN' }); send(s, { type: 'MAIN', seat: 1, amount: 200 }); send(s, { type: 'CLOSE' });
  const r = replay(finishSession(s));
  expect(r.outcomes).toHaveLength(2);
  expect(r.outcomes.map(r => r.publicState.round!.roundId)).toEqual(['round-1','round-2']);
  expect(JSON.stringify(prior)).toBe(before);
  expect(s.getState().table.game.shoe.shoeId).toBe(shoeId);
});
it('[REG-M8-035] unsupported replay version is explicitly rejected', () => {
  const p = finishSession(startSession()); expect(() => replay({ ...p, replayVersion: 2 })).toThrow('Unsupported replay version');
});
it('[REG-M8-036] malformed JSON, missing schema, unsafe snapshot keys and invalid seed reject', () => {
  const p = finishSession(startSession());
  for (const value of ['{', null, [], { ...p, state: {} }, { ...p, commands: [] },
    { ...p, configuration: { ...p.configuration, seed: -1 } }, { ...p, configuration: { ...p.configuration, randomAlgorithm: 'unknown' } }]) {
    expect(() => replay(value)).toThrow();
  }
});
it('[REG-M8-037] unknown command rejects at exact sequence', () => {
  const p = finishSession(startSession());
  expect(() => replay({ ...p, commands: [{ sequence: 1, command: { type: 'UNKNOWN' } }] })).toThrow('Replay sequence 1: Unknown command');
});
it('[REG-M8-038] invalid authoritative command sequence fails with number and reason', () => {
  const p = finishSession(startSession());
  expect(() => replay({ ...p, commands: [{ sequence: 1, command: { type: 'CLOSE' } }] })).toThrow('Replay sequence 1: BETTING_NOT_OPEN');
  expect(() => parseReplay({ ...p, commands: [{ sequence: 9, command: { type: 'OPEN' } }] })).toThrow('sequence 1: Non-contiguous');
});
it('[REG-M8-039] replay neither mutates frozen source package nor restores a state snapshot', () => {
  const p = finishSession(startSession()); const before = JSON.stringify(p); freezeDeep(p);
  replay(p); expect(JSON.stringify(p)).toBe(before);
  expect(Object.keys(p)).toEqual(['replayVersion','configuration','commands','outcomeDigest']);
});
it('[REG-M8-040] canonical fingerprint has known vector, sorted keys and preserved array order', () => {
  expect(outcomeDigest({})).toBe('fnv1a32-v1:5465b825');
  expect(canonical({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
  expect(outcomeDigest({ b: 2, a: 1 })).toBe(outcomeDigest({ a: 1, b: 2 }));
  expect(outcomeDigest([1,2])).not.toBe(outcomeDigest([2,1]));
});
it('[REG-M8-041] tampered outcome fingerprint rejects; replay packages have no timestamp dependency', () => {
  const p = finishSession(startSession());
  expect(() => replay({ ...p, outcomeDigest: 'fnv1a32-v1:00000000' })).toThrow('digest mismatch');
  expect(JSON.stringify(p)).not.toMatch(/timestamp|clock|date/i);
  expect(finishSession(startSession()).outcomeDigest).toBe(p.outcomeDigest);
});
it('[REG-M8-042] pre-terminal public state has no seed/shoe order/IDs; export requires financial terminal', () => {
  const s = createReplaySession(0); expect(() => s.exportPackage()).toThrow('finalized');
  const active = startSession(0); expect(() => active.exportPackage()).toThrow('finalized');
  expect(JSON.stringify(active.getPublic())).not.toMatch(/seed|randomAlgorithm|deckIndex|availableCards|physical|0:clubs/i);
  closeAce(active); send(active, { type: 'ACT', action: 'STAND', handId: 'round-1/seat-1' }); send(active, { type: 'ADVANCE' });
  expect(() => active.exportPackage()).toThrow('finalized');
  send(active, { type: 'SETTLE' }); expect(active.exportPackage().replayVersion).toBe(1);
});
