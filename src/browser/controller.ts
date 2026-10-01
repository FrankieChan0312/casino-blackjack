import * as game from '../domain/behindGame.js';
import { getPublicBehindView } from '../domain/behindPublicView.js';
import { isSeed, mathRandomSource, type RandomSource } from '../domain/random.js';
import type { SeatState } from '../domain/table.js';
import type { PlayerAction } from '../domain/advancedGame.js';
import type { SideWagerType } from '../domain/optionalGame.js';
import { evaluateHand, isNaturalBlackjack } from '../domain/hand.js';
import { CLASSIC, CLASSIC_V1_2, getProfile, type ProfileId } from '../domain/profile.js';
import { createReplaySession, replay, ReplayError, type ReplayPackage } from '../domain/replay.js';
import { applySessionCommand, type SessionCommand } from '../domain/sessionCommand.js';
import { createAuditTrail, type Clock } from '../domain/audit.js';

export type BrowserCommand =
  | { type: 'CONFIGURE'; seats: readonly SeatState[] }
  | { type: 'OPEN' | 'CLOSE' | 'ADVANCE' | 'NEXT' }
  | { type: 'DEAL'; amount: number }
  | { type: 'REPEAT' }
  | { type: 'MODE'; playerMode: boolean }
  | { type: 'MAIN'; seat: number; amount: number }
  | { type: 'SIDE'; kind: SideWagerType; amount: number }
  | { type: 'BACK'; seat: number; amount: number }
  | { type: 'ACT'; action: PlayerAction; handId: string }
  | { type: 'ACE'; choice: 'INSURANCE' | 'EVEN_MONEY' | 'DECLINE' }
  | { type: 'FOLLOW'; choice: 'ADD' | 'NO_ADD' };

const reasons: Record<string, string> = {
  REPLAY_COMMAND_LIMIT: 'Replay session command limit reached. Start a new demo after settlement, or refresh to restart an unfinished demo.',
  INSUFFICIENT_FUNDS: 'Not enough available credits.', INELIGIBLE_BACK_TARGET: 'Choose another funded seat; you cannot back your own seat.',
  BETTING_NOT_OPEN: 'Betting is closed.', WRONG_PHASE: 'This action is unavailable now.',
  DOUBLE_NOT_ALLOWED: 'Double requires an eligible two-card first decision.', SPLIT_NOT_ALLOWED: 'Split requires an eligible first decision.',
  HIT_NOT_ALLOWED: 'Split Aces receive one additional card; Hit is unavailable.',
  STAND_NOT_ALLOWED: 'This Split-Ace hand has no re-split decision to decline.',
  UNEQUAL_SPLIT_VALUE: 'The two cards must have equal Blackjack values.', HAND_LIMIT_REACHED: 'The four-hand limit is reached.',
  SURRENDER_NOT_ALLOWED: 'Surrender requires an original hand before its first decision.',
  ROUND_ALREADY_TERMINAL: 'This hand or round has finished.', NOT_SEATED: 'Spectators do not control target cards.',
  WRONG_SEAT: 'Another seat is playing.', WRONG_HAND: 'This hand is not active.',
  INVALID_MAIN_WAGER: 'Main wager must be 10–1000 whole credits.', INVALID_BACK_WAGER: 'Bet Behind must be 10–1000 whole credits.',
  INVALID_SIDE_WAGER: 'Side wager must be 1–100 whole credits.',
};
export function explainReason(reason: string | undefined) { return reason ? reasons[reason] ?? 'This command is unavailable in the current state.' : ''; }

export function createBrowserController(options: { factory?: () => game.BehindGameState; random?: RandomSource;
  profileId?: ProfileId; seed?: number; clock?: Clock; playerMode?: boolean } = {}) {
  let playerMode = options.playerMode ?? false;
  const random = options.random ?? mathRandomSource;
  const profileId = options.profileId ?? (playerMode ? CLASSIC_V1_2 : CLASSIC);
  if (options.factory && options.seed !== undefined) throw new Error('Seeded replay cannot start from a state factory');
  let session = options.seed !== undefined ? createReplaySession(options.seed, profileId, { clock: options.clock }) : null;
  let state = session?.getState() ?? options.factory?.() ?? game.createBehindGame('local-shoe-1', random, true, profileId);
  let audit = createAuditTrail(state, options.clock);
  let replayResult: ReturnType<typeof replay> | null = null;
  let replayFailed = false;
  let feedback = '';
  let lastBet = 0;
  let shoeMessage = '6-deck persistent shoe';
  function project() {
    const view = getPublicBehindView(state);
    const interaction = game.getBehindInteraction(state);
    const ownResults = game.getBehindOwnResults(state).map((entry) => ({ type: entry.type, handId: entry.handId,
      stake: entry.stakeUnits, outcome: entry.outcome, returned: entry.grossReturnUnits, status: entry.status }));
    const backResults = view.backResults.map((entry) => ({ type: entry.wagerId.endsWith('/INSURANCE') ? 'BACK_INSURANCE' : 'BACK',
      seat: entry.targetSeat, handId: entry.handId, stake: entry.stakeUnits, outcome: entry.outcome,
      returned: entry.grossReturnUnits, status: entry.status }));
    // Explicit safe fields only. No raw state, shoe order, card IDs or lineage.
    const round = view.round && !(playerMode && (view.phase === 'OPEN' || view.phase === 'CONFIGURING')) ? { ...view.round,
      dealer: { ...view.round.dealer, total: evaluateHand(state.table.game.round!.dealerCards.slice(0, view.round.dealer.visibleCards.length)).total,
        status: !view.round.dealer.holeCard ? 'Hole card hidden'
          : evaluateHand(state.table.game.round!.dealerCards).isBust ? 'Bust'
          : isNaturalBlackjack(state.table.game.round!.dealerCards, true) ? 'Blackjack'
          : view.round.phase === 'ROUND_COMPLETE' ? 'Dealer complete' : 'Revealed' },
      seats: view.round.seats.map((seat) => ({ ...seat, hands: seat.hands.map((hand) => ({ ...hand,
        total: evaluateHand(state.table.game.round!.players.find((entry) => entry.handId === hand.handId)!.cards).total })) })) } : null;
    return { playerMode, lastBet, profileId: state.table.profileId, seeded: session !== null,
      canStartDemo: state.table.phase === 'COMMITTED' || state.table.phase === 'VOID'
        || (state.table.phase === 'CONFIGURING' && state.table.roundNumber === 0)
        || (playerMode && state.table.phase === 'OPEN' && state.human?.bankroll.reserved === 0
          && (!state.table.game.round || ['ROUND_COMPLETE', 'INTEGRITY_ERROR'].includes(state.table.game.round.phase))),
      replayAvailable: !!session && !replayFailed && (state.table.phase === 'COMMITTED' || state.table.phase === 'VOID'),
      replayResult, audit: audit.getPublic(), configuration: view.configuration, round, human: view.human,
      backWagers: view.backWagers.map((entry) => ({ targetSeat: entry.targetSeat, stakeUnits: entry.stakeUnits })),
      trackedBack: state.backExposures.map((entry) => ({ seat: entry.targetSeat, handId: entry.handId, amount: entry.stakeUnits })),
      lastFollow: state.followDecisions.length ? { kind: state.followDecisions.at(-1)!.kind, choice: state.followDecisions.at(-1)!.choice } : null,
      mainWagers: state.table.wagers.map((entry) => ({ seat: entry.seatNumber, amount: entry.stakeUnits })),
      sideWagers: state.table.sideWagers.map((entry) => ({ type: entry.type, amount: entry.stakeUnits })),
      follow: view.follow ? { kind: view.follow.kind, targetSeat: view.follow.targetSeat, handId: view.follow.handId } : null,
      interaction, ownResults, backResults, pending: [...ownResults, ...backResults]
        .filter((entry) => entry.status === 'PENDING').reduce((sum, entry) => sum + entry.returned, 0),
      feedback, shoeMessage, phase: view.phase };
  }
  let snapshot = project();
  const listeners = new Set<() => void>();
  function publish() { snapshot = project(); listeners.forEach((listener) => listener()); }
  function invoke(command: SessionCommand) {
    const before = state;
    const result = session ? session.dispatch(command) : applySessionCommand(state, command, random);
    audit.record(before, result, command);
    if (result.ok) state = result.state;
    return result;
  }
  function dispatch(command: BrowserCommand): boolean {
    if (command.type === 'MODE') {
      if (!snapshot.canStartDemo) { feedback = 'Change mode only before play or after final settlement.'; publish(); return false; }
      if (playerMode === command.playerMode) return true;
      playerMode = command.playerMode;
      return startDemo(state.table.profileId);
    }
    // Reserve the whole browser intent before mutation, including automatic
    // ADVANCE and SETTLE/VOID. Manual mode keeps its accepted two-slot boundary.
    const progresses = ['CLOSE', 'ACT', 'ACE', 'FOLLOW'].includes(command.type);
    const capacity = playerMode ? command.type === 'REPEAT' ? 11 : command.type === 'DEAL' ? 5 : command.type === 'NEXT' ? 7 : progresses ? 4 : 2 : 2;
    if (session && !session.hasCapacity(capacity)) {
      feedback = explainReason('REPLAY_COMMAND_LIMIT'); publish(); return false;
    }
    if (command.type === 'DEAL' || command.type === 'REPEAT') {
      if (!playerMode || (command.type === 'REPEAT' && (!lastBet || !snapshot.interaction.nextRound))
        || (command.type === 'DEAL' && state.table.phase !== 'OPEN')) {
        feedback = explainReason('WRONG_PHASE'); publish(); return false;
      }
      const amount = command.type === 'DEAL' ? command.amount : lastBet;
      if (command.type === 'REPEAT' && !dispatch({ type: 'NEXT' })) return false;
      const seat = snapshot.human?.controlledSeat;
      // Zero is a domain cancellation command, never a valid player Deal.
      const error = amount === 0 ? 'INVALID_MAIN_WAGER' : game.getBehindWagerError(state, { type: 'MAIN', seat: seat ?? 4, amount });
      if (error) { feedback = explainReason(error); publish(); return false; }
      return dispatch({ type: 'MAIN', seat: seat ?? 4, amount }) && dispatch({ type: 'CLOSE' });
    }
    if (playerMode && command.type === 'CLOSE' && !state.table.wagers.some(w => w.seatNumber === snapshot.human?.controlledSeat)) {
      feedback = 'Choose your main wager before dealing.'; publish(); return false;
    }
    const previousShoe = state.table.game.shoe.shoeId;
    const result = invoke(command);
    if (result.ok) {
      replayResult = null;
      replayFailed = false;
      if (command.type === 'CLOSE' && playerMode) lastBet = state.table.wagers.find(w => w.seatNumber === snapshot.human?.controlledSeat)?.stakeUnits ?? 0;
      if (command.type === 'CLOSE') shoeMessage = previousShoe === state.table.game.shoe.shoeId ? 'Existing 6-deck shoe continues' : 'New 6-deck shoe shuffled';
      feedback = command.type === 'FOLLOW' && state.followDecisions.at(-1)?.fundingError ? explainReason('INSUFFICIENT_FUNDS') : '';
      if (state.table.phase === 'CLOSED' && state.table.game.round?.phase === 'ROUND_COMPLETE') {
        const settled = invoke({ type: 'SETTLE' });
        if (!settled.ok) feedback = explainReason(settled.error);
      }
      if (state.table.phase === 'CLOSED' && state.table.game.round?.phase === 'INTEGRITY_ERROR') {
        const voided = invoke({ type: 'VOID' });
        if (!voided.ok) feedback = explainReason(voided.error);
      }
    } else feedback = explainReason(result.error);
    publish();
    if (result.ok && playerMode && command.type === 'NEXT') return preparePlayerTable();
    if (result.ok && playerMode && progresses && game.getBehindInteraction(state).canAdvance) {
      return dispatch({ type: 'ADVANCE' });
    }
    return result.ok;
  }
  function startDemo(profileId: ProfileId, seed?: number) {
    if (!snapshot.canStartDemo) { feedback = 'Start a new demo only before play or after final settlement.'; publish(); return false; }
    try { getProfile(profileId); }
    catch { feedback = 'Choose a valid profile.'; publish(); return false; }
    if (seed !== undefined && !isSeed(seed)) { feedback = 'Choose an unsigned 32-bit integer seed.'; publish(); return false; }
    const nextSession = seed === undefined ? null : createReplaySession(seed, profileId, { clock: options.clock });
    const nextState = nextSession?.getState() ?? game.createBehindGame('local-shoe-1', random, true, profileId);
    session = nextSession; state = nextState; audit = createAuditTrail(state, options.clock); audit.recordReset(state);
    replayResult = null; replayFailed = false; feedback = ''; lastBet = 0; shoeMessage = 'New demo session: starting credits restored';
    publish(); if (playerMode) preparePlayerTable(); return true;
  }
  function preparePlayerTable() {
    // CONFIGURE + OPEN + up to three guest wagers, plus finalization headroom.
    if (session && !session.hasCapacity(6)) {
      feedback = explainReason('REPLAY_COMMAND_LIMIT'); publish(); return false;
    }
    const guests = [1, 3, 6];
    const seats: SeatState[] = state.table.game.table.seats.map(seat => ({ seatNumber: seat.seatNumber,
      occupancy: seat.seatNumber === 4 ? 'HUMAN' : guests.includes(seat.seatNumber) ? 'COMPUTER' : 'EMPTY',
      sittingOut: guests.includes(seat.seatNumber) && state.computers[seat.seatNumber - 1].bankroll.available < 20 }));
    if (!dispatch({ type: 'CONFIGURE', seats }) || !dispatch({ type: 'OPEN' })) return false;
    for (const seat of seats.filter(seat => seat.occupancy === 'COMPUTER' && !seat.sittingOut)) {
      const amount = Math.min(50, Math.floor(state.computers[seat.seatNumber - 1].bankroll.available / 2) * 2);
      if (!dispatch({ type: 'MAIN', seat: seat.seatNumber, amount })) return false;
    }
    return true;
  }
  function exportReplay(): ReplayPackage | null {
    return snapshot.replayAvailable && session ? session.exportPackage() : null;
  }
  function replayCompleted() {
    const p = exportReplay(); if (!p) return false;
    let reconstructed: ReturnType<typeof replay>;
    try { reconstructed = replay(p); }
    catch (error) {
      if (!(error instanceof ReplayError)) throw error;
      replayResult = null; replayFailed = true;
      feedback = 'Completed replay is unavailable: replay validation failed.'; publish(); return false;
    }
    audit.recordReplay(state, false);
    replayResult = reconstructed; audit.recordReplay(state, true); publish(); return true;
  }
  if (playerMode && state.table.phase === 'CONFIGURING') preparePlayerTable();
  return { getSnapshot: () => snapshot, subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, dispatch,
    startDemo, exportReplay, replayCompleted,
    queryWager: (query: game.WagerQuery) => explainReason(game.getBehindWagerError(state, query)) };
}
export type BrowserController = ReturnType<typeof createBrowserController>;
export type BrowserView = ReturnType<BrowserController['getSnapshot']>;
