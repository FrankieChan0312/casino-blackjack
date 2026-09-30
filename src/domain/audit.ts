import { controlledSeat, controllerId, getBehindInteraction, type BehindGameState } from './behindGame.js';
import type { SessionCommand, SessionResult } from './sessionCommand.js';

export const AUDIT_VERSION = 1;
export type Clock = () => string;
export const utcClock: Clock = () => new Date().toISOString();
export interface PublicAuditEvent {
  readonly auditVersion: 1;
  readonly sequence: number;
  readonly timestamp: string;
  readonly type: string;
  readonly profileId: string;
  readonly roundId: string | null;
  readonly actorId: string;
  readonly seat: number | null;
  readonly handId: string | null;
  readonly wagerId: string | null;
  readonly commandId: string | null;
  readonly amountUnits: number | null;
  readonly returnedUnits: number | null;
  readonly outcome: string | null;
  readonly status: 'ACCEPTED' | 'REJECTED';
  readonly reason: string | null;
}
type Detail = Partial<Omit<PublicAuditEvent, 'auditVersion' | 'sequence' | 'timestamp' | 'profileId'>>;
// Observation only: no event is used to reconstruct state or change outcomes.
// No card objects, seed or shoe are accepted by the public event schema.
export function createAuditTrail(initial: BehindGameState, clock: Clock = utcClock) {
  const events: PublicAuditEvent[] = [];
  let attempt = 0;
  function append(state: BehindGameState, detail: Detail) {
    const timestamp = clock();
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(timestamp) || !Number.isFinite(Date.parse(timestamp))) {
      throw new RangeError('Audit clock must return an ISO UTC timestamp');
    }
    const event: PublicAuditEvent = Object.freeze({ auditVersion: 1, sequence: events.length + 1, timestamp,
      profileId: state.table.profileId, roundId: state.table.roundNumber ? `round-${state.table.roundNumber}` : null,
      type: detail.type ?? 'TRANSITION', actorId: detail.actorId ?? 'system', seat: detail.seat ?? null,
      handId: detail.handId ?? null, wagerId: detail.wagerId ?? null, commandId: detail.commandId ?? null,
      amountUnits: detail.amountUnits ?? null, returnedUnits: detail.returnedUnits ?? null,
      outcome: detail.outcome ?? null, status: detail.status ?? 'ACCEPTED', reason: detail.reason ?? null });
    events.push(event);
  }
  append(initial, { type: 'SESSION_START' });
  function record(before: BehindGameState, result: SessionResult, command: SessionCommand) {
    const after = result.state;
    const commandId = `command-${++attempt}`;
    const localSeat = controlledSeat(before);
    const insurance = command.type === 'ACE' ? getBehindInteraction(before).insurance : null;
    const seat = command.type === 'MAIN' || command.type === 'BACK' ? command.seat
      : command.type === 'FOLLOW' ? before.followWindow?.targetSeat ?? null
      : command.type === 'ACE' ? insurance?.targetSeat ?? null
      : command.type === 'ACT' || command.type === 'CONTROLLER' ? before.table.game.round?.players.find(h => h.handId === command.handId)?.seatNumber ?? null
      : command.type === 'SIDE' ? localSeat : null;
    const handId = command.type === 'ACT' || command.type === 'CONTROLLER' ? command.handId
      : command.type === 'FOLLOW' ? before.followWindow?.handId ?? null : null;
    const actorId = command.type === 'CONTROLLER' || command.type === 'MAIN' ? controllerId(before, seat ?? 0) ?? 'table-setup'
      : ['ADVANCE','SETTLE','VOID','DEMO_DRAW_FAULT'].includes(command.type) ? 'system' : 'local-human';
    const kind = command.type === 'BACK' || (command.type === 'ACE' && insurance?.role === 'BACK') || command.type === 'FOLLOW' ? 'BACK'
      : command.type === 'SIDE' ? command.kind : 'MAIN';
    const roundId = after.table.roundNumber ? `round-${after.table.roundNumber}` : null;
    const baseWagerId = seat === null ? null : kind === 'BACK'
      ? before.backWagers.find(w => w.targetSeat === seat)?.wagerId ?? `${roundId}/seat-${seat}/BACK/local-human`
      : `${handId ?? `${roundId}/seat-${seat}`}/${kind}`;
    const wagerId = baseWagerId && command.type === 'ACE' && command.choice === 'INSURANCE'
      ? kind === 'BACK' ? `${baseWagerId}/INSURANCE` : `${roundId}/seat-${seat}/INSURANCE` : baseWagerId;
    const type = command.type === 'ACT' || command.type === 'CONTROLLER' ? command.action
      : command.type === 'ACE' ? command.choice
      : command.type === 'FOLLOW' ? `FOLLOW_${command.choice}`
      : command.type === 'MAIN' || command.type === 'SIDE' || command.type === 'BACK'
        ? `${kind}_${command.amount === 0 ? 'CANCEL' : 'SET'}` : command.type;
    const cancellations: Detail[] = [];
    if (result.ok && before.table.phase === 'OPEN' && after.table.phase === 'OPEN') {
      for (const w of before.table.wagers) if (!after.table.wagers.some(next => next.seatNumber === w.seatNumber)) {
        cancellations.push({ type: 'MAIN_CANCEL', actorId: controllerId(before, w.seatNumber) ?? 'table-setup',
          seat: w.seatNumber, wagerId: `${roundId}/seat-${w.seatNumber}/MAIN`, amountUnits: w.stakeUnits, returnedUnits: w.stakeUnits });
      }
      for (const w of before.table.sideWagers) if (!after.table.sideWagers.some(next => next.seatNumber === w.seatNumber && next.type === w.type)) {
        cancellations.push({ type: `${w.type}_CANCEL`, actorId: controllerId(before, w.seatNumber) ?? 'table-setup',
          seat: w.seatNumber, wagerId: `${roundId}/seat-${w.seatNumber}/${w.type}`, amountUnits: w.stakeUnits, returnedUnits: w.stakeUnits });
      }
      for (const w of before.backWagers) if (!after.backWagers.some(next => next.wagerId === w.wagerId)) {
        cancellations.push({ type: 'BACK_CANCEL', actorId: w.participantId, seat: w.targetSeat,
          handId: w.handId, wagerId: w.wagerId, amountUnits: w.stakeUnits, returnedUnits: w.stakeUnits });
      }
    }
    const directCancellation = cancellations.find(e => e.type === type && e.seat === seat);
    append(after, { type, actorId, seat, handId, wagerId, commandId,
      amountUnits: 'amount' in command ? command.amount : command.type === 'FOLLOW' ? getBehindInteraction(before).followAmount
        : command.type === 'ACE' && command.choice === 'INSURANCE' ? insurance?.amount ?? null
        : handId ? before.table.game.round?.players.find(h => h.handId === handId)?.stakeUnits ?? null : null,
      ...directCancellation, status: result.ok ? 'ACCEPTED' : 'REJECTED', reason: result.ok ? null : result.error });
    if (!result.ok) return;
    for (const cancellation of cancellations) if (cancellation !== directCancellation) append(after, { ...cancellation, commandId });
    for (const action of result.computerActions ?? []) append(after, { type: action.action,
      actorId: controllerId(before, action.seatNumber) ?? 'system', seat: action.seatNumber,
      handId: action.handId, wagerId: `${action.handId}/MAIN`, amountUnits: action.stakeUnits, commandId });
    if (command.type === 'CONFIGURE') for (const s of command.seats) append(after, { type: 'SEAT_CONFIGURED', actorId: 'local-human',
      seat: s.seatNumber, outcome: s.sittingOut ? 'SITTING_OUT' : s.occupancy, commandId });
    if (command.type === 'CLOSE') append(after, { type: 'INITIAL_DEAL', commandId });
    const prior = before.table.game.round;
    const round = after.table.game.round;
    if (round && round.roundId === prior?.roundId) {
      for (const h of round.players) {
        const old = prior.players.find(p => p.handId === h.handId);
        const attribution = { actorId: controllerId(after, h.seatNumber) ?? 'system', seat: h.seatNumber,
          handId: h.handId, wagerId: `${h.handId}/MAIN`, commandId, amountUnits: h.stakeUnits };
        if (!old) append(after, { ...attribution, type: 'SPLIT_CHILD' });
        if (h.outcome === 'CHARLIE' && old?.outcome !== 'CHARLIE') append(after, { ...attribution, type: 'CHARLIE', outcome: 'CHARLIE', returnedUnits: 2 * h.stakeUnits });
      }
      if (round.phase === 'ROUND_COMPLETE' && prior.phase !== 'ROUND_COMPLETE') append(after, { type: 'DEALER_COMPLETE', actorId: 'dealer', commandId });
      if (round.phase === 'INTEGRITY_ERROR' && prior.phase !== 'INTEGRITY_ERROR') append(after, { type: 'INTEGRITY_FAULT', actorId: 'system', commandId, reason: round.integrityError });
    }
    if (command.type === 'SETTLE' || command.type === 'VOID') {
      for (const r of after.table.wagerResults) append(after, { type: command.type === 'VOID' ? 'WAGER_REFUND' : 'WAGER_SETTLEMENT',
        actorId: controllerId(after, r.seatNumber) ?? 'system', seat: r.seatNumber, handId: r.handId,
        wagerId: r.wagerId, amountUnits: r.stakeUnits, returnedUnits: r.grossReturnUnits, outcome: r.outcome, commandId });
      for (const r of after.backResults) append(after, { type: command.type === 'VOID' ? 'WAGER_REFUND' : 'WAGER_SETTLEMENT',
        actorId: r.participantId, seat: r.targetSeat, handId: r.handId, wagerId: r.wagerId,
        amountUnits: r.stakeUnits, returnedUnits: r.grossReturnUnits, outcome: r.outcome, commandId });
    }
  }
  return { record, getPublic: () => Object.freeze([...events]),
    recordReset: (state: BehindGameState) => append(state, { type: 'SESSION_RESET', amountUnits: 2000 }),
    recordReplay: (state: BehindGameState, completed: boolean) => append(state, { type: completed ? 'REPLAY_COMPLETE' : 'REPLAY_START' }) };
}
