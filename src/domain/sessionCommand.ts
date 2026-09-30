import * as game from './behindGame.js';
import * as controller from './behindController.js';
import type { RandomSource } from './random.js';
import type { SeatState } from './table.js';
import type { PlayerAction } from './advancedGame.js';
import type { SideWagerType } from './optionalGame.js';

export type SessionCommand =
  | { type: 'CONFIGURE'; seats: readonly SeatState[] }
  | { type: 'OPEN' | 'CLOSE' | 'ADVANCE' | 'NEXT' | 'SETTLE' | 'VOID' | 'DEMO_DRAW_FAULT' }
  | { type: 'MAIN' | 'BACK'; seat: number; amount: number }
  | { type: 'SIDE'; kind: SideWagerType; amount: number }
  | { type: 'ACT'; action: PlayerAction; handId: string }
  | { type: 'ACE'; choice: 'INSURANCE' | 'EVEN_MONEY' | 'DECLINE' }
  | { type: 'FOLLOW'; choice: 'ADD' | 'NO_ADD' }
  | { type: 'CONTROLLER'; ownerId: string; handId: string; action: 'DOUBLE' | 'SPLIT' | 'STAND' };

// Local engineering intents, routed through the same authoritative M6 handlers.
// CONTROLLER and DEMO_DRAW_FAULT are developer-only; never normal player controls.
export function applySessionCommand(state: game.BehindGameState, command: SessionCommand,
  random: RandomSource, demoFaults = false): game.BehindResult {
  const seat = game.controlledSeat(state);
  switch (command.type) {
    case 'CONFIGURE': return game.configureBehindSeats(state, command.seats);
    case 'OPEN': return game.openBehindBetting(state);
    case 'MAIN': return command.amount === 0 ? game.cancelBehindMainWager(state, command.seat) : game.setBehindMainWager(state, command.seat, command.amount);
    case 'SIDE': return command.amount === 0 ? game.cancelBehindSideWager(state, seat ?? 0, command.kind) : game.setBehindSideWager(state, seat ?? 0, command.kind, command.amount);
    case 'BACK': return command.amount === 0 ? game.cancelBackWager(state, command.seat) : game.setBackWager(state, command.seat, command.amount);
    case 'CLOSE': return game.closeBehindBetting(state, `local-shoe-${state.table.roundNumber + 1}`, random);
    case 'ACT': return game.actBehindHand(state, command.handId, command.action);
    case 'ADVANCE': return game.advanceBehindTable(state);
    case 'NEXT': return game.prepareNextBehindRound(state);
    case 'SETTLE': return game.settleBehindWagers(state);
    case 'VOID': return game.voidBehindRound(state);
    case 'ACE': {
      const choice = game.getBehindInteraction(state).insurance;
      return choice?.role === 'BACK' ? game.decideBackInsurance(state, choice.targetSeat, command.choice)
        : command.choice === 'EVEN_MONEY' ? game.electBehindMainEvenMoney(state) : game.decideBehindMainInsurance(state, command.choice === 'INSURANCE');
    }
    case 'FOLLOW': return state.followWindow?.kind === 'DOUBLE'
      ? controller.decideDoubleFollow(state, state.followWindow.handId, command.choice)
      : controller.decideSplitFollow(state, state.followWindow?.handId ?? '', command.choice);
    case 'CONTROLLER': return command.action === 'DOUBLE' ? controller.beginControllerDouble(state, command.ownerId, command.handId)
      : command.action === 'SPLIT' ? controller.beginControllerSplit(state, command.ownerId, command.handId)
      : controller.standControllerHand(state, command.ownerId, command.handId);
    case 'DEMO_DRAW_FAULT': {
      if (!demoFaults || state.table.phase !== 'CLOSED' || state.table.game.round?.phase !== 'PLAYER_TURN'
        || state.followWindow || state.table.decisionPhase !== 'NONE') return { ok: false, state, error: 'DEMO_FAULT_NOT_ALLOWED' };
      // Explicit deterministic demo of an unavailable next draw. Conservation is
      // retained. A subsequent real required draw must fail before VOID is legal.
      const shoe = state.table.game.shoe;
      return { ok: true, state: { ...state, table: { ...state.table, game: { ...state.table.game,
        shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } } };
    }
  }
}
