import type { BehindGameState } from '../domain/behindGame.js';
import { getPublicBehindView } from '../domain/behindPublicView.js';
import type { SessionCommand, SessionResult } from '../domain/sessionCommand.js';
import { cardSlot, type PresentationFact, type PublicFace } from '../presentation/events.js';

// Private observation only. Physical IDs are used for retention matching and never exported.
export function observePresentation(before: BehindGameState, result: SessionResult, command: SessionCommand): readonly PresentationFact[] {
  if (!result.ok || result.state === before) return [];
  const after = result.state, round = after.table.game.round, previous = before.table.game.round;
  const publicRound = getPublicBehindView(after).round;
  const facts: PresentationFact[] = [];
  const face = (card: PublicFace): PublicFace => Object.freeze({ rank: card.rank, suit: card.suit });
  const state = (value: Extract<PresentationFact, { type: 'DEALER_STATE' }>['state']) => facts.push({ type: 'DEALER_STATE', state: value });
  const humanSeat = after.table.game.table.seats.find(seat => seat.occupancy === 'HUMAN')?.seatNumber;
  const returnTo = (seat: number, kind: string) => kind.startsWith('BACK') || seat === humanSeat ? 'local-credits' as const : `seat-${seat}` as const;
  const move = (seat: number, amount: number, kind: string, handId?: string) => facts.push({ type: 'MOVE_WAGER', seat, amount, kind, handId, returnTo: returnTo(seat, kind) });
  const settlements = () => {
    for (const entry of after.table.wagerResults) facts.push({ type: 'SETTLE_RESULT', seat: entry.seatNumber,
      handId: entry.handId ?? undefined, kind: entry.type, outcome: entry.outcome, stake: entry.stakeUnits, returned: entry.grossReturnUnits, returnTo: returnTo(entry.seatNumber, entry.type) });
    for (const entry of after.backResults) facts.push({ type: 'SETTLE_RESULT', seat: entry.targetSeat,
      handId: entry.handId, kind: entry.wagerId.endsWith('/INSURANCE') ? 'BACK_INSURANCE' : 'BACK', outcome: entry.outcome, stake: entry.stakeUnits, returned: entry.grossReturnUnits, returnTo: 'local-credits' });
  };
  if (command.type === 'NEXT' || command.type === 'CONFIGURE' || command.type === 'OPEN') return [];
  if (command.type === 'VOID') { state('SETTLING'); settlements(); state('IDLE'); return facts; }
  if (publicRound?.phase === 'INTEGRITY_ERROR') { state('IDLE'); return facts; }
  if (command.type === 'MAIN' || command.type === 'SIDE' || command.type === 'BACK') {
    const seat = command.type === 'SIDE' ? after.table.game.table.seats.find(s => s.occupancy === 'HUMAN')!.seatNumber : command.seat;
    const amount = command.type === 'MAIN' ? after.table.wagers.find(entry => entry.seatNumber === seat)?.stakeUnits ?? 0
      : command.type === 'SIDE' ? after.table.sideWagers.find(entry => entry.type === command.kind && entry.seatNumber === seat)?.stakeUnits ?? 0
      : after.backWagers.find(entry => entry.targetSeat === seat)?.stakeUnits ?? 0;
    const kind = command.type === 'SIDE' ? command.kind : command.type;
    if (command.amount === 0) {
      const previousAmount = command.type === 'MAIN' ? before.table.wagers.find(entry => entry.seatNumber === seat)?.stakeUnits ?? 0
        : command.type === 'SIDE' ? before.table.sideWagers.find(entry => entry.type === command.kind && entry.seatNumber === seat)?.stakeUnits ?? 0
        : before.backWagers.find(entry => entry.targetSeat === seat)?.stakeUnits ?? 0;
      move(seat, previousAmount, `${kind}_CANCELLED`);
    } else move(seat, amount, kind);
    return facts;
  }
  if (!round || !publicRound) return facts;
  // Total authoritative exposure, never a presentation-side delta or payout formula.
  for (const hand of round.players) {
    const old = previous?.players.find(entry => entry.handId === hand.handId);
    if (old && old.stakeUnits !== hand.stakeUnits) move(hand.seatNumber, hand.stakeUnits, 'DOUBLE', hand.handId);
    else if (!old && hand.parentHandId && previous?.players.some(entry => entry.handId === hand.parentHandId)) move(hand.seatNumber, hand.stakeUnits, 'SPLIT', hand.handId);
  }
  for (const decision of after.table.insuranceDecisions) if (decision.choice === 'INSURANCE' && decision.stakeUnits !== before.table.insuranceDecisions.find(entry => entry.seatNumber === decision.seatNumber)?.stakeUnits)
    move(decision.seatNumber, decision.stakeUnits, 'INSURANCE');
  for (const decision of after.backInsurance) if (decision.choice === 'INSURANCE' && decision.stakeUnits !== before.backInsurance.find(entry => entry.wagerId === decision.wagerId)?.stakeUnits)
    move(decision.targetSeat, decision.stakeUnits, 'BACK_INSURANCE');
  if (command.type === 'FOLLOW' && after.followDecisions.at(-1)?.choice === 'ADD') for (const entry of after.backExposures)
    if (entry.stakeUnits !== before.backExposures.find(old => old.handId === entry.handId)?.stakeUnits) move(entry.targetSeat, entry.stakeUnits, 'BACK', entry.handId);
  const emitted = new Set<string>();
  const deal = (hand: typeof round.players[number], index: number, reason: Extract<PresentationFact, { type: 'DEAL_CARD' }>['reason']) => {
    const card = hand.cards[index]; if (!card || emitted.has(card.id)) return;
    emitted.add(card.id);
    facts.push({ type: 'DEAL_CARD', card: cardSlot(round.roundId, hand.seatNumber, hand.handId, index), face: face(card),
      reason, destination: `hand:${hand.handId}` });
  };
  if (command.type === 'CLOSE') {
    state('DEALING');
    for (let pass = 0; pass < 2; pass++) {
      for (const hand of round.players) deal(hand, pass, 'INITIAL');
      facts.push({ type: 'DEAL_CARD', card: cardSlot(round.roundId, 'dealer', 'dealer', pass),
        face: pass === 0 ? face(publicRound.dealer.visibleCards[0]) : null, reason: 'INITIAL', destination: 'dealer-hand' });
    }
  } else {
    if (command.type === 'ACT') facts.push({ type: 'PLAYER_ACTION', seat: previous!.players.find(h => h.handId === command.handId)!.seatNumber,
      handId: command.handId, action: command.action });
    for (const parent of previous?.players ?? []) {
      const children = round.players.filter(hand => hand.parentHandId === parent.handId);
      if (!round.players.some(hand => hand.handId === parent.handId) && children.length) {
        facts.push({ type: 'SPLIT_HANDS', seat: parent.seatNumber, parentHandId: parent.handId,
          children: Object.freeze(children.map(hand => Object.freeze({ handId: hand.handId,
            retained: cardSlot(round.roundId, parent.seatNumber, parent.handId, parent.cards.findIndex(c => c.id === hand.cards[0].id)),
            destination: cardSlot(round.roundId, hand.seatNumber, hand.handId, 0) }))) });
      }
    }
    const oldCards = new Set(previous?.players.flatMap(hand => hand.cards.map(card => card.id)));
    // A computer action can activate a waiting split sibling inside atomic ADVANCE.
    // Ordered leaves + retained originals identify its supplement BEFORE its HIT;
    // policy observations identify only actual decisions, never those supplements.
    const cursors = new Map(previous?.players.map(hand => [hand.handId, hand.cards.length]));
    for (const action of result.computerActions ?? []) {
      const position = round.players.findIndex(hand => hand.handId === action.handId);
      for (const hand of round.players.slice(0, position + 1)) {
        if (hand.origin === 'SPLIT' && hand.cards[1] && !oldCards.has(hand.cards[1].id)) deal(hand, 1, 'SUPPLEMENT');
      }
      facts.push({ type: 'PLAYER_ACTION', seat: action.seatNumber, handId: action.handId, action: action.action });
      if (action.action === 'HIT') {
        const hand = round.players[position];
        const index = Math.max(cursors.get(hand.handId) ?? 1, hand.origin === 'SPLIT' ? 2 : 0);
        deal(hand, index, 'HIT'); cursors.set(hand.handId, index + 1);
      }
    }
    const doubleHandId = command.type === 'ACT' && command.action === 'DOUBLE' ? command.handId
      : command.type === 'CONTROLLER' && command.action === 'DOUBLE' ? command.handId
      : command.type === 'FOLLOW' && before.followWindow?.kind === 'DOUBLE' ? before.followWindow.handId : null;
    for (const hand of round.players) hand.cards.forEach((card, index) => {
      if (!oldCards.has(card.id)) deal(hand, index, hand.handId === doubleHandId ? 'DOUBLE'
        : command.type === 'ACT' && hand.handId === command.handId ? 'HIT' : 'SUPPLEMENT');
    });
  }
  const wasVisible = command.type !== 'CLOSE' && !!getPublicBehindView(before).round?.dealer.holeCard;
  if (publicRound.dealer.holeCard && !wasVisible) {
    state('REVEALING'); facts.push({ type: 'REVEAL_HOLE_CARD', card: cardSlot(round.roundId, 'dealer', 'dealer', 1), face: face(publicRound.dealer.holeCard) });
  }
  const oldDealerLength = command.type === 'CLOSE' ? 2 : previous?.dealerCards.length ?? 2;
  if (publicRound.dealer.visibleCards.length > oldDealerLength) {
    state('DRAWING');
    for (let index = oldDealerLength; index < publicRound.dealer.visibleCards.length; index++) facts.push({ type: 'DEAL_CARD',
      card: cardSlot(round.roundId, 'dealer', 'dealer', index), face: face(publicRound.dealer.visibleCards[index]), reason: 'DEALER', destination: 'dealer-hand' });
  }
  if (command.type === 'SETTLE') {
    state('SETTLING');
    settlements();
  }
  if (previous?.currentHandId !== round.currentHandId || command.type === 'CLOSE') facts.push({ type: 'EMPHASIZE_ACTIVE_HAND', handId: round.currentHandId });
  state(publicRound.phase === 'INSURANCE' || after.followWindow || round.currentHandId && round.players.find(h => h.handId === round.currentHandId)?.controller === 'HUMAN'
    ? 'WAITING_PLAYER' : 'IDLE');
  return Object.freeze(facts.map(fact => Object.freeze(fact)));
}
