import type { PhysicalCard } from './card.js';
import type { ActionError, OutcomeReason, RoundOutcome, RoundPhase, RoundState } from './game.js';
import { isNaturalBlackjack } from './hand.js';
import type { RandomSource } from './random.js';
import { completeShoeRound, createShoe, drawCard, prepareShoeForNextRound, type ShoeState } from './shoe.js';
import { configureSeats, createTable, freezeTableSeats, releaseTableSeats, type SeatState, type TableState } from './table.js';

export interface SeatHand {
  readonly seatNumber: number;
  readonly controller: 'HUMAN' | 'COMPUTER';
  readonly cards: readonly PhysicalCard[];
  readonly complete: boolean;
  readonly outcome?: RoundOutcome;
  readonly outcomeReason?: OutcomeReason;
}

export interface TableRoundState {
  readonly roundId: string;
  readonly phase: RoundPhase;
  readonly seats: readonly SeatState[];
  readonly players: readonly SeatHand[];
  readonly currentSeat: number | null;
  readonly dealerCards: readonly PhysicalCard[];
  readonly integrityError?: RoundState['integrityError'];
}

export interface TableGameState {
  readonly table: TableState;
  readonly shoe: ShoeState;
  readonly round: TableRoundState | null;
}

export type TableActionError = ActionError | 'INVALID_SEATS' | 'NO_ACTIVE_SEATS' | 'WRONG_SEAT' | 'NOT_HUMAN';
export type TableCommandResult =
  | { readonly ok: true; readonly state: TableGameState }
  | { readonly ok: false; readonly state: TableGameState; readonly error: TableActionError };

export function createTableGame(shoeId: string, random: RandomSource): TableGameState {
  return { table: createTable(), shoe: createShoe(shoeId, random), round: null };
}

export function configureTableSeats(state: TableGameState, updates: readonly SeatState[]): TableCommandResult {
  if (state.round?.phase === 'PLAYER_TURN' || state.round?.phase === 'DEALER_TURN') {
    return { ok: false, state, error: 'ROUND_ALREADY_ACTIVE' };
  }
  const configured = configureSeats(state.table, updates);
  return configured.ok ? { ok: true, state: { ...state, table: configured.table } }
    : { ok: false, state, error: configured.error };
}

function completeTableRound(state: TableGameState, round: TableRoundState): TableGameState {
  return { table: releaseTableSeats(state.table), shoe: completeShoeRound(state.shoe),
    round: { ...round, phase: 'ROUND_COMPLETE', currentSeat: null } };
}

function tableIntegrityFailure(state: TableGameState, round: TableRoundState,
  error: NonNullable<TableRoundState['integrityError']>): TableGameState {
  return { table: releaseTableSeats(state.table), shoe: { ...state.shoe, retired: true }, round: {
    ...round, phase: 'INTEGRITY_ERROR', currentSeat: null, integrityError: error,
    // A whole-table fault invalidates normal results; cards remain diagnostic evidence.
    players: round.players.map((player) => ({ seatNumber: player.seatNumber, controller: player.controller,
      cards: player.cards, complete: true })),
  } };
}

export function startTableRound(state: TableGameState, roundId: string,
  replacementShoeId: string, random: RandomSource): TableCommandResult {
  if (state.round?.phase === 'PLAYER_TURN' || state.round?.phase === 'DEALER_TURN') {
    return { ok: false, state, error: 'ROUND_ALREADY_ACTIVE' };
  }
  const frozen = freezeTableSeats(state.table);
  if (!frozen.ok) return { ok: false, state, error: frozen.error };
  const active = frozen.table.activeSeats!;
  let shoe = prepareShoeForNextRound(state.shoe, replacementShoeId, random, 2 * active.length + 2);
  const players: SeatHand[] = active.map((seat) => ({ seatNumber: seat.seatNumber,
    controller: seat.occupancy === 'HUMAN' ? 'HUMAN' : 'COMPUTER', cards: [], complete: false }));
  const dealerCards: PhysicalCard[] = [];
  const seats = Object.freeze(state.table.seats.map((seat) => Object.freeze({ ...seat })));
  const initialRound = (): TableRoundState => ({ roundId, seats, players, dealerCards,
    phase: 'PLAYER_TURN', currentSeat: null });
  for (let pass = 0; pass < 2; pass++) {
    for (let index = 0; index <= players.length; index++) {
      const draw = drawCard(shoe);
      shoe = draw.shoe;
      if (!draw.ok) return { ok: true,
        state: tableIntegrityFailure({ table: frozen.table, shoe, round: null }, initialRound(), draw.error) };
      if (index === players.length) dealerCards.push(draw.card);
      else players[index] = { ...players[index], cards: [...players[index].cards, draw.card] };
    }
  }
  const upcard = dealerCards[0].rank;
  const dealerNatural = ['A', '10', 'J', 'Q', 'K'].includes(upcard) && isNaturalBlackjack(dealerCards, true);
  const resolved = players.map((player): SeatHand => {
    const natural = isNaturalBlackjack(player.cards, true);
    if (dealerNatural) return { ...player, complete: true,
      outcome: natural ? 'PUSH' : 'DEALER_WIN', outcomeReason: natural ? 'BOTH_NATURAL' : 'DEALER_NATURAL' };
    if (natural) return { ...player, complete: true, outcome: 'PLAYER_BLACKJACK', outcomeReason: 'PLAYER_NATURAL' };
    return player;
  });
  const round = { ...initialRound(), players: resolved,
    currentSeat: resolved.find((player) => !player.complete)?.seatNumber ?? null };
  const dealt = { table: frozen.table, shoe, round };
  return { ok: true, state: round.currentSeat === null ? completeTableRound(dealt, round) : dealt };
}
