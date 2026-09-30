import { createBehindGame, type BehindGameState } from './behindGame.js';
import { getPublicBehindView } from './behindPublicView.js';
import { CLASSIC, isProfileId, type ProfileId } from './profile.js';
import { createSeededRandom, isSeed, SEEDED_ALGORITHM } from './random.js';
import { applySessionCommand, type SessionCommand } from './sessionCommand.js';
import { createAuditTrail, type Clock } from './audit.js';

export const REPLAY_VERSION = 1;
// Replay v1 bounds the entire session, including automatic finalization intents.
export const MAX_REPLAY_COMMANDS = 10000;
export interface ReplayConfiguration {
  readonly profileId: ProfileId;
  readonly seed: number;
  readonly randomAlgorithm: typeof SEEDED_ALGORITHM;
  readonly initialCreditUnits: 2000;
  readonly withHuman: boolean;
  readonly demoFaults: boolean;
}
export interface ReplayEntry { readonly sequence: number; readonly command: SessionCommand }
export interface ReplayPackage {
  readonly replayVersion: 1;
  readonly configuration: ReplayConfiguration;
  readonly commands: readonly ReplayEntry[];
  readonly outcomeDigest: string;
}
export class ReplayError extends Error {
  constructor(message: string, readonly sequence: number | null = null) {
    super(sequence === null ? message : `Replay sequence ${sequence}: ${message}`);
    this.name = 'ReplayError';
  }
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ReplayError('Expected object');
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: readonly string[]) {
  if (Object.keys(value).sort().join(',') !== [...expected].sort().join(',')) throw new ReplayError('Malformed schema keys');
}
function integer(value: unknown) { return typeof value === 'number' && Number.isSafeInteger(value); }
function oneOf(value: unknown, values: readonly unknown[]) { return values.includes(value); }
export function validateCommand(value: unknown): SessionCommand {
  const c = object(value);
  let valid = true;
  switch (c.type) {
    case 'CONFIGURE':
      keys(c, ['type','seats']);
      valid = Array.isArray(c.seats) && c.seats.length <= 7 && c.seats.every((s: unknown) => {
        const entry = object(s); keys(entry, ['seatNumber','occupancy','sittingOut']);
        return integer(entry.seatNumber) && oneOf(entry.occupancy, ['EMPTY','HUMAN','COMPUTER']) && typeof entry.sittingOut === 'boolean';
      }); break;
    case 'OPEN': case 'CLOSE': case 'ADVANCE': case 'NEXT': case 'SETTLE': case 'VOID': case 'DEMO_DRAW_FAULT': keys(c, ['type']); break;
    case 'MAIN': case 'BACK': keys(c, ['type','seat','amount']); valid = integer(c.seat) && integer(c.amount); break;
    case 'SIDE': keys(c, ['type','kind','amount']); valid = integer(c.amount) && oneOf(c.kind, ['PAIR','THREE_CARD']); break;
    case 'ACT': keys(c, ['type','action','handId']); valid = typeof c.handId === 'string' && oneOf(c.action, ['HIT','STAND','DOUBLE','SPLIT','SURRENDER']); break;
    case 'ACE': keys(c, ['type','choice']); valid = oneOf(c.choice, ['INSURANCE','EVEN_MONEY','DECLINE']); break;
    case 'FOLLOW': keys(c, ['type','choice']); valid = oneOf(c.choice, ['ADD','NO_ADD']); break;
    case 'CONTROLLER': keys(c, ['type','ownerId','handId','action']); valid = typeof c.ownerId === 'string' && typeof c.handId === 'string' && oneOf(c.action, ['DOUBLE','SPLIT','STAND']); break;
    default: throw new ReplayError('Unknown command');
  }
  if (!valid) throw new ReplayError('Malformed command');
  return JSON.parse(JSON.stringify(c)) as SessionCommand;
}
function configuration(value: unknown): ReplayConfiguration {
  const c = object(value);
  keys(c, ['profileId','seed','randomAlgorithm','initialCreditUnits','withHuman','demoFaults']);
  if (!isSeed(c.seed) || c.randomAlgorithm !== SEEDED_ALGORITHM || c.initialCreditUnits !== 2000
    || typeof c.withHuman !== 'boolean' || typeof c.demoFaults !== 'boolean') throw new ReplayError('Invalid configuration');
  if (!isProfileId(c.profileId)) throw new ReplayError('Invalid profile');
  return { profileId: c.profileId, seed: c.seed, randomAlgorithm: c.randomAlgorithm,
    initialCreditUnits: c.initialCreditUnits, withHuman: c.withHuman, demoFaults: c.demoFaults };
}
export function parseReplay(value: unknown): ReplayPackage {
  let decoded = value;
  if (typeof value === 'string') {
    try { decoded = JSON.parse(value); } catch { throw new ReplayError('Malformed JSON'); }
  }
  const p = object(decoded);
  if (p.replayVersion !== REPLAY_VERSION) throw new ReplayError('Unsupported replay version');
  keys(p, ['replayVersion','configuration','commands','outcomeDigest']);
  const config = configuration(p.configuration);
  if (!Array.isArray(p.commands) || !p.commands.length || p.commands.length > MAX_REPLAY_COMMANDS
    || typeof p.outcomeDigest !== 'string' || !/^fnv1a32-v1:[0-9a-f]{8}$/.test(p.outcomeDigest)) throw new ReplayError('Malformed replay');
  const commands = p.commands.map((value, index): ReplayEntry => {
    try {
      const e = object(value); keys(e, ['sequence','command']);
      if (e.sequence !== index + 1) throw new ReplayError('Non-contiguous sequence');
      return { sequence: index + 1, command: validateCommand(e.command) };
    } catch (error) { throw new ReplayError(error instanceof Error ? error.message : 'Malformed entry', index + 1); }
  });
  return { replayVersion: 1, configuration: config, commands, outcomeDigest: p.outcomeDigest };
}
// Sorted object keys, preserved array order. Outcome has no clocks/PRNG state.
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([,v]) => v !== undefined)
    .sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
// Non-cryptographic engineering fingerprint, FNV-1a over canonical UTF-16 code
// units. Not authenticity/security; replay independently recomputes outcomes.
export function outcomeDigest(outcome: unknown): string {
  let hash = 0x811c9dc5;
  for (const unit of canonical(outcome).split('')) hash = Math.imul(hash ^ unit.charCodeAt(0), 0x01000193) >>> 0;
  return `fnv1a32-v1:${hash.toString(16).padStart(8,'0')}`;
}
export function terminalOutcome(state: BehindGameState) {
  return { profileId: state.table.profileId, publicState: getPublicBehindView(state),
    resultRecords: state.table.wagerResults, backRecords: state.backResults,
    computers: state.computers.map(c => ({ participantId: c.participantId, bankroll: { ...c.bankroll } })) };
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export function createReplaySession(seed: number, profileId: ProfileId = CLASSIC,
  options: { withHuman?: boolean; demoFaults?: boolean; clock?: Clock } = {}) {
  const config: ReplayConfiguration = { seed, profileId, randomAlgorithm: SEEDED_ALGORITHM,
    initialCreditUnits: 2000, withHuman: options.withHuman ?? true, demoFaults: options.demoFaults ?? false };
  configuration(config);
  const random = createSeededRandom(seed);
  let state = createBehindGame('local-shoe-1', random, config.withHuman, profileId);
  const audit = createAuditTrail(state, options.clock);
  const entries: ReplayEntry[] = [];
  const outcomes: ReturnType<typeof terminalOutcome>[] = [];
  function hasCapacity(requiredEntries = 1) { return entries.length + requiredEntries <= MAX_REPLAY_COMMANDS; }
  function dispatch(input: SessionCommand) {
    // Reject before handlers, RNG consumption, audit/clock or journal mutation.
    if (!hasCapacity()) return { ok: false as const, state, error: 'REPLAY_COMMAND_LIMIT' };
    const command = validateCommand(input);
    const before = state;
    const result = applySessionCommand(state, command, random, config.demoFaults);
    audit.record(before, result, command);
    if (result.ok) {
      state = result.state;
      entries.push(freeze({ sequence: entries.length + 1, command }));
      if (before.table.phase !== state.table.phase && (state.table.phase === 'COMMITTED' || state.table.phase === 'VOID')) {
        outcomes.push(freeze(terminalOutcome(state)));
      }
    }
    return result;
  }
  function exportPackage(): ReplayPackage {
    if (state.table.phase !== 'COMMITTED' && state.table.phase !== 'VOID') throw new ReplayError('Replay export requires finalized round');
    if (!entries.length || entries.length > MAX_REPLAY_COMMANDS) throw new ReplayError('Malformed replay');
    return freeze({ replayVersion: 1, configuration: { ...config }, commands: [...entries], outcomeDigest: outcomeDigest(outcomes) });
  }
  return { dispatch, exportPackage, hasCapacity, getPublic: () => getPublicBehindView(state), getAudit: audit.getPublic,
    // Explicit internal/developer boundary. Never hand this object to React.
    getState: () => state, getOutcomes: () => [...outcomes] };
}
export function replay(value: unknown) {
  const p = parseReplay(value);
  const session = createReplaySession(p.configuration.seed, p.configuration.profileId, p.configuration);
  for (const entry of p.commands) {
    const result = session.dispatch(entry.command);
    if (!result.ok) throw new ReplayError(result.error, entry.sequence);
  }
  const reconstructed = session.exportPackage();
  if (reconstructed.outcomeDigest !== p.outcomeDigest) throw new ReplayError('Outcome digest mismatch');
  return { publicState: session.getPublic(), outcomes: session.getOutcomes(), digest: reconstructed.outcomeDigest };
}
