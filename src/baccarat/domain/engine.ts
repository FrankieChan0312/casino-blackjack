import { isSeed } from '../../domain/random.js';
import { outcomeDigest } from '../../domain/replay.js';
import type { PhysicalCard } from '../../domain/card.js';
import { createShoe, validateInventory, type Shoe } from './shoe.js';
import { EMPTY_WAGERS, TARGETS, resolveRound, type Round, type Target, type Wagers } from './rules.js';

export type Phase = 'BETTING' | 'RESOLVED' | 'COMPLETE' | 'INTEGRITY_ERROR';
export type Command = Readonly<{ requestId: string; roundId: string }> & (
  | Readonly<{ type: 'WAGER'; target: Target; amountUnits: number }>
  | Readonly<{ type: 'CLEAR' | 'DEAL' | 'COMMIT' | 'NEXT' | 'REPEAT' | 'VOID' }>);
export type JournalEntry = Readonly<{ sequence: number; timestamp: string; roundId: string; type: Command['type'];
  availableUnits: number; reservedUnits: number; pendingUnits: number; outcome: Target | 'VOID' | null }>;
export type Configuration = Readonly<{ seed: number; initialUnits: number; orderedIds?: readonly string[] }>;
export type State = Readonly<{ configuration: Configuration; phase: Phase; roundId: string; roundNumber: number;
  availableUnits: number; reservedUnits: number; pendingUnits: number; wagers: Wagers; previousWagers: Wagers;
  shoe: Shoe; round: Round | null; voided: boolean; integrityError: string;
  commands: readonly Command[]; journal: readonly JournalEntry[] }>;
export type Result = Readonly<{ ok: true; state: State }> | Readonly<{ ok: false; state: State; error: string }>;
export function createBaccarat(seed: number, initialUnits = 100000, ordered?: readonly PhysicalCard[]): State {
  if (!isSeed(seed) || !Number.isSafeInteger(initialUnits) || initialUnits < 0 || initialUnits > 100000000) {
    throw new RangeError('Invalid initial Baccarat configuration');
  }
  const shoe = createShoe(seed, 0, ordered);
  const configuration = Object.freeze({ seed, initialUnits,
    ...(ordered ? { orderedIds: Object.freeze(shoe.cards.map(card => card.id)) } : {}) });
  return Object.freeze({ configuration, phase: 'BETTING', roundId: 'baccarat-1', roundNumber: 1,
    availableUnits: initialUnits, reservedUnits: 0, pendingUnits: 0, wagers: EMPTY_WAGERS,
    previousWagers: EMPTY_WAGERS, shoe, round: null, voided: false, integrityError: '', commands: Object.freeze([]), journal: Object.freeze([]) });
}
const exposure = (wagers: Wagers) => TARGETS.reduce((sum, target) => sum + wagers[target], 0);
const utcClock = () => new Date().toISOString();
export function applyCommand(before: State, input: Command, clock: () => string = utcClock): Result {
  const reject = (error: string): Result => Object.freeze({ ok: false, state: before, error });
  if (!input || typeof input !== 'object' || typeof input.requestId !== 'string'
    || !/^[a-zA-Z0-9_-]{1,64}$/.test(input.requestId)) return reject('Invalid request ID');
  const keys = input.type === 'WAGER' ? ['type', 'requestId', 'roundId', 'target', 'amountUnits'] : ['type', 'requestId', 'roundId'];
  if (Object.keys(input).some(key => !keys.includes(key))) return reject('Unknown command field');
  if (before.commands.some(command => command.requestId === input.requestId)) return reject('Duplicate request');
  if (input.roundId !== before.roundId) return reject('Stale round');
  if (before.commands.length >= 10000) return reject('Session command limit reached');
  let state: State;
  switch (input.type) {
    case 'WAGER': {
      if (before.phase !== 'BETTING') return reject('Betting is closed');
      if (!TARGETS.includes(input.target) || !Number.isSafeInteger(input.amountUnits) || input.amountUnits < 0
        || input.amountUnits > 100000 || input.amountUnits % 100 !== 0) return reject('Wager must be1–1000 whole credits, or zero to cancel');
      const delta = input.amountUnits - before.wagers[input.target];
      if (delta > before.availableUnits) return reject('Insufficient credits');
      state = { ...before, wagers: Object.freeze({ ...before.wagers, [input.target]: input.amountUnits }),
        availableUnits: before.availableUnits - delta, reservedUnits: before.reservedUnits + delta }; break;
    }
    case 'CLEAR':
      if (before.phase !== 'BETTING') return reject('Betting is closed');
      state = { ...before, availableUnits: before.availableUnits + before.reservedUnits,
        reservedUnits: 0, wagers: EMPTY_WAGERS }; break;
    case 'DEAL': {
      if (before.phase !== 'BETTING' || before.reservedUnits <= 0) return reject('Place a funded wager before Deal');
      try {
        if (!before.shoe.retired) validateInventory(before.shoe.cards);
        if (before.reservedUnits !== exposure(before.wagers) || before.shoe.cursor < 0
          || !Number.isInteger(before.shoe.cursor) || before.shoe.cursor > 416) throw new Error('Baccarat state integrity failure');
        const shoe = before.shoe.retired || 416 - before.shoe.cursor < 6
          ? createShoe(before.configuration.seed, before.shoe.ordinal + 1) : before.shoe;
        const round = resolveRound(before.roundId, shoe.cards.slice(shoe.cursor, shoe.cursor + 6), before.wagers);
        const pendingUnits = round.settlements.reduce((sum, settlement) => sum + settlement.grossUnits, 0);
        if (!Number.isSafeInteger(before.availableUnits + pendingUnits)) throw new Error('Baccarat balance integrity failure');
        state = { ...before, phase: 'RESOLVED', round,
          shoe: Object.freeze({ ...shoe, cursor: shoe.cursor + round.draws.length }), pendingUnits };
      } catch (error) {
        state = { ...before, phase: 'INTEGRITY_ERROR', round: null, pendingUnits: 0,
          integrityError: error instanceof Error ? error.message : 'Baccarat integrity failure',
          shoe: Object.freeze({ ...before.shoe, retired: true }) };
      }
      break;
    }
    case 'COMMIT':
      if (before.phase !== 'RESOLVED' || !before.round) return reject('No resolved round to commit');
      state = { ...before, phase: 'COMPLETE', availableUnits: before.availableUnits + before.pendingUnits,
        reservedUnits: 0, pendingUnits: 0, previousWagers: before.wagers }; break;
    case 'VOID':
      if (before.phase !== 'INTEGRITY_ERROR') return reject('Only an integrity failure can be voided');
      state = { ...before, phase: 'COMPLETE', availableUnits: before.availableUnits + before.reservedUnits,
        reservedUnits: 0, pendingUnits: 0, voided: true, previousWagers: before.wagers }; break;
    case 'NEXT': case 'REPEAT': {
      if (before.phase !== 'COMPLETE') return reject('Complete the current round first');
      const wagers = input.type === 'REPEAT' ? before.previousWagers : EMPTY_WAGERS, reservedUnits = exposure(wagers);
      if (reservedUnits > before.availableUnits) return reject('Insufficient credits for Repeat Bet');
      const roundNumber = before.roundNumber + 1;
      state = { ...before, phase: 'BETTING', roundNumber, roundId: `baccarat-${roundNumber}`, round: null,
        voided: false, integrityError: '', wagers, reservedUnits, pendingUnits: 0,
        availableUnits: before.availableUnits - reservedUnits }; break;
    }
    default: return reject('Unknown Baccarat command');
  }
  const timestamp = clock();
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(timestamp) || !Number.isFinite(Date.parse(timestamp))) {
    throw new RangeError('Journal clock must return ISO UTC');
  }
  const journal = Object.freeze([...before.journal, Object.freeze({ sequence: before.commands.length + 1, timestamp,
    roundId: input.roundId, type: input.type, availableUnits: state.availableUnits, reservedUnits: state.reservedUnits,
    pendingUnits: state.pendingUnits, outcome: state.voided ? 'VOID' as const : state.round?.outcome ?? null })]);
  return Object.freeze({ ok: true, state: Object.freeze({ ...state,
    commands: Object.freeze([...before.commands, Object.freeze({ ...input })]), journal }) });
}
function face(card: PhysicalCard) { return Object.freeze({ rank: card.rank, suit: card.suit }); }
export function publicView(state: State) {
  const round = state.round;
  return Object.freeze({ phase: state.phase, roundId: state.roundId, roundNumber: state.roundNumber,
    availableUnits: state.availableUnits, reservedUnits: state.reservedUnits, pendingUnits: state.pendingUnits,
    wagers: state.wagers, previousWagers: state.previousWagers, voided: state.voided,
    integrityError: state.integrityError, remainingCards: state.shoe.retired ? 0 : 416 - state.shoe.cursor,
    round: round && Object.freeze({ ...round, player: Object.freeze(round.player.map(face)), banker: Object.freeze(round.banker.map(face)),
      draws: Object.freeze(round.draws.map(draw => Object.freeze({ ...draw, card: face(draw.card) }))) }), journal: state.journal });
}
export type PublicView = ReturnType<typeof publicView>;
export function digest(state: State): string {
  const { journal: _journal, ...view } = publicView(state);
  void _journal;
  return outcomeDigest(view);
}
