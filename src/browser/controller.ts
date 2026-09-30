import * as game from '../domain/behindGame.js';
import { decideDoubleFollow, decideSplitFollow } from '../domain/behindController.js';
import { getPublicBehindView } from '../domain/behindPublicView.js';
import { mathRandomSource, type RandomSource } from '../domain/random.js';
import type { SeatState } from '../domain/table.js';
import type { PlayerAction } from '../domain/advancedGame.js';
import type { SideWagerType } from '../domain/optionalGame.js';

export type BrowserCommand =
  | { type: 'CONFIGURE'; seats: readonly SeatState[] }
  | { type: 'OPEN' | 'CLOSE' | 'ADVANCE' | 'NEXT' }
  | { type: 'MAIN'; seat: number; amount: number }
  | { type: 'SIDE'; kind: SideWagerType; amount: number }
  | { type: 'BACK'; seat: number; amount: number }
  | { type: 'ACT'; action: PlayerAction; handId: string }
  | { type: 'ACE'; choice: 'INSURANCE' | 'EVEN_MONEY' | 'DECLINE' }
  | { type: 'FOLLOW'; choice: 'ADD' | 'NO_ADD' };

const reasons: Record<string, string> = {
  INSUFFICIENT_FUNDS: 'Not enough available credits.', INELIGIBLE_BACK_TARGET: 'Choose another funded seat; you cannot back your own seat.',
  BETTING_NOT_OPEN: 'Betting is closed.', WRONG_PHASE: 'This action is unavailable now.',
  DOUBLE_NOT_ALLOWED: 'Double requires an eligible two-card first decision.', SPLIT_NOT_ALLOWED: 'Split requires an eligible first decision.',
  UNEQUAL_SPLIT_VALUE: 'The two cards must have equal Blackjack values.', HAND_LIMIT_REACHED: 'The four-hand limit is reached.',
  SURRENDER_NOT_ALLOWED: 'Surrender requires an original hand before its first decision.',
  ROUND_ALREADY_TERMINAL: 'This hand or round has finished.', NOT_SEATED: 'Spectators do not control target cards.',
  WRONG_SEAT: 'Another seat is playing.', WRONG_HAND: 'This hand is not active.',
  INVALID_MAIN_WAGER: 'Main wager must be 10–1000 whole credits.', INVALID_BACK_WAGER: 'Bet Behind must be 10–1000 whole credits.',
  INVALID_SIDE_WAGER: 'Side wager must be 1–100 whole credits.',
};
export function explainReason(reason: string | undefined) { return reason ? reasons[reason] ?? 'This command is unavailable in the current state.' : ''; }

export function createBrowserController(options: { factory?: () => game.BehindGameState; random?: RandomSource } = {}) {
  const random = options.random ?? mathRandomSource;
  let state = options.factory?.() ?? game.createBehindGame('local-shoe-1', random);
  let feedback = '';
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
    return { configuration: view.configuration, round: view.round, human: view.human,
      backWagers: view.backWagers.map((entry) => ({ targetSeat: entry.targetSeat, stakeUnits: entry.stakeUnits })),
      mainWagers: state.table.wagers.map((entry) => ({ seat: entry.seatNumber, amount: entry.stakeUnits })),
      sideWagers: state.table.sideWagers.map((entry) => ({ type: entry.type, amount: entry.stakeUnits })),
      follow: view.follow ? { kind: view.follow.kind, targetSeat: view.follow.targetSeat, handId: view.follow.handId } : null,
      interaction, ownResults, backResults, pending: [...ownResults, ...backResults]
        .filter((entry) => entry.status === 'PENDING').reduce((sum, entry) => sum + entry.returned, 0),
      feedback, shoeMessage, phase: view.phase };
  }
  let snapshot = project();
  const listeners = new Set<() => void>();
  function dispatch(command: BrowserCommand) {
    const seat = game.controlledSeat(state);
    let result: game.BehindResult;
    switch (command.type) {
      case 'CONFIGURE': result = game.configureBehindSeats(state, command.seats); break;
      case 'OPEN': result = game.openBehindBetting(state); break;
      case 'MAIN': result = command.amount === 0 ? game.cancelBehindMainWager(state, command.seat) : game.setBehindMainWager(state, command.seat, command.amount); break;
      case 'SIDE': result = command.amount === 0 ? game.cancelBehindSideWager(state, seat ?? 0, command.kind) : game.setBehindSideWager(state, seat ?? 0, command.kind, command.amount); break;
      case 'BACK': result = command.amount === 0 ? game.cancelBackWager(state, command.seat) : game.setBackWager(state, command.seat, command.amount); break;
      case 'CLOSE': result = game.closeBehindBetting(state, `local-shoe-${state.table.roundNumber + 1}`, random); break;
      case 'ACT': result = game.actBehindHand(state, command.handId, command.action); break;
      case 'ADVANCE': result = game.advanceBehindTable(state); break;
      case 'NEXT': result = game.prepareNextBehindRound(state); break;
      case 'ACE': {
        const choice = snapshot.interaction.insurance;
        result = choice?.role === 'BACK' ? game.decideBackInsurance(state, choice.targetSeat, command.choice)
          : command.choice === 'EVEN_MONEY' ? game.electBehindMainEvenMoney(state) : game.decideBehindMainInsurance(state, command.choice === 'INSURANCE');
        break;
      }
      case 'FOLLOW': result = state.followWindow?.kind === 'DOUBLE'
        ? decideDoubleFollow(state, state.followWindow.handId, command.choice)
        : decideSplitFollow(state, state.followWindow?.handId ?? '', command.choice); break;
    }
    if (result.ok) {
      const previousShoe = state.table.game.shoe.shoeId;
      state = result.state;
      if (command.type === 'CLOSE') shoeMessage = previousShoe === state.table.game.shoe.shoeId ? 'Existing 6-deck shoe continues' : 'New 6-deck shoe shuffled';
      feedback = command.type === 'FOLLOW' && state.followDecisions.at(-1)?.fundingError ? explainReason('INSUFFICIENT_FUNDS') : '';
      if (state.table.phase === 'CLOSED' && state.table.game.round?.phase === 'ROUND_COMPLETE') {
        const settled = game.settleBehindWagers(state);
        if (settled.ok) state = settled.state;
        else feedback = explainReason(settled.error);
      }
      if (state.table.phase === 'CLOSED' && state.table.game.round?.phase === 'INTEGRITY_ERROR') {
        const voided = game.voidBehindRound(state);
        if (voided.ok) state = voided.state;
        else feedback = explainReason(voided.error);
      }
    } else feedback = explainReason(result.error);
    snapshot = project();
    listeners.forEach((listener) => listener());
    return result.ok;
  }
  return { getSnapshot: () => snapshot, subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, dispatch };
}
export type BrowserController = ReturnType<typeof createBrowserController>;
export type BrowserView = ReturnType<BrowserController['getSnapshot']>;
