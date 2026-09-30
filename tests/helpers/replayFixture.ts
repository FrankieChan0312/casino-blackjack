import { expect } from 'vitest';
import { createReplaySession } from '../../src/domain/replay.js';
import { CLASSIC, type ProfileId } from '../../src/domain/profile.js';
import type { SessionCommand } from '../../src/domain/sessionCommand.js';
export type DemoSession = ReturnType<typeof createReplaySession>;
export function send(s: DemoSession, command: SessionCommand) {
  const result = s.dispatch(command);
  expect(result.ok, 'error' in result ? result.error : undefined).toBe(true);
}
export function startSession(seed = 0, profileId: ProfileId = CLASSIC, spectator = false, demoFaults = false) {
  const s = createReplaySession(seed, profileId, { demoFaults });
  send(s, { type: 'CONFIGURE', seats: [{ seatNumber: 1, occupancy: spectator ? 'COMPUTER' : 'HUMAN', sittingOut: false }] });
  send(s, { type: 'OPEN' }); send(s, { type: 'MAIN', seat: 1, amount: 200 });
  if (spectator) send(s, { type: 'BACK', seat: 1, amount: 50 });
  send(s, { type: 'CLOSE' });
  return s;
}
export function closeAce(s: DemoSession, choice: 'DECLINE' | 'INSURANCE' | 'EVEN_MONEY' = 'DECLINE') {
  while (s.getState().table.decisionPhase === 'INSURANCE') send(s, { type: 'ACE', choice });
}
export function finishSession(s: DemoSession) {
  closeAce(s);
  while (s.getState().table.game.round?.phase === 'PLAYER_TURN') {
    const r = s.getState().table.game.round!;
    const hand = r.players.find(h => h.handId === r.currentHandId)!;
    if (hand.controller === 'HUMAN') send(s, { type: 'ACT', handId: hand.handId, action: 'STAND' });
    else send(s, { type: 'ADVANCE' });
  }
  if (s.getState().table.game.round?.phase === 'DEALER_TURN') send(s, { type: 'ADVANCE' });
  send(s, { type: s.getState().table.game.round?.phase === 'INTEGRITY_ERROR' ? 'VOID' : 'SETTLE' });
  return s.exportPackage();
}
