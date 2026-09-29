import { controlledSeat, controllerId, getBackResults, type BehindGameState } from './behindGame.js';
import { getPublicOptionalView } from './optionalPublicView.js';

export function getPublicBehindView(state: BehindGameState) {
  // The legacy projection reads cards/decisions only; no financial state is supplied.
  const view = getPublicOptionalView({ ...state.table, bankrolls: [] });
  return { phase: state.table.phase,
    backInsurance: state.backInsurance.map((entry) => ({ targetSeat: entry.targetSeat, choice: entry.choice,
      stakeUnits: entry.stakeUnits, outcome: state.table.game.round?.phase === 'INTEGRITY_ERROR' ? undefined : entry.outcome })),
    backResults: getBackResults(state).map((entry) => ({ ...entry })),
    follow: state.followWindow ? { kind: state.followWindow.kind, handId: state.followWindow.handId,
      targetSeat: state.followWindow.targetSeat, choices: ['ADD', 'NO_ADD'] } : null,
    backWagers: state.backWagers.map((wager) => ({ wagerId: wager.wagerId, targetSeat: wager.targetSeat,
      handId: wager.handId, stakeUnits: wager.stakeUnits })),
    configuration: view.configuration.map((seat) => ({ ...seat, controllerId: controllerId(state, seat.seatNumber) })),
    round: view.round ? { ...view.round, insurance: view.round.insurance.filter((entry) => entry.seatNumber === controlledSeat(state)) } : null,
    human: state.human ? { participantId: state.human.participantId, controlledSeat: controlledSeat(state),
      available: state.human.bankroll.available, reserved: state.human.bankroll.reserved } : null };
}
