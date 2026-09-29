import type { OptionalGameState } from './optionalGame.js';
import { getPublicAdvancedView } from './advancedPublicView.js';

export function getPublicOptionalView(state: OptionalGameState) {
  const view = getPublicAdvancedView(state);
  return { ...view, round: view.round ? { ...view.round,
    phase: state.decisionPhase === 'INSURANCE' ? 'INSURANCE' : view.round.phase,
    insurance: state.insuranceDecisions.map((entry) => ({ seatNumber: entry.seatNumber,
      choice: entry.choice, stakeUnits: entry.stakeUnits, outcome: entry.outcome })) } : null };
}
