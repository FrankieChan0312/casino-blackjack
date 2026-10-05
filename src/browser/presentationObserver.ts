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
  if (command.type === 'NEXT' || command.type === 'CONFIGURE' || command.type === 'OPEN') return [];
  if (command.type === 'VOID' || publicRound?.phase === 'INTEGRITY_ERROR') { state('IDLE'); return facts; }
  if (command.type === 'MAIN' || command.type === 'SIDE' || command.type === 'BACK') {
    const seat = command.type === 'SIDE' ? after.table.game.table.seats.find(s => s.occupancy === 'HUMAN')!.seatNumber : command.seat;
    facts.push({ type: 'MOVE_WAGER', seat, amount: command.amount, kind: command.type === 'SIDE' ? command.kind : command.type });
    return facts;
  }
  if (!round || !publicRound) return facts;
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
    for (const entry of after.table.wagerResults) facts.push({ type: 'SETTLE_RESULT', seat: entry.seatNumber,
      handId: entry.handId ?? undefined, kind: entry.type, outcome: entry.outcome, stake: entry.stakeUnits, returned: entry.grossReturnUnits });
    for (const entry of after.backResults) facts.push({ type: 'SETTLE_RESULT', seat: entry.targetSeat,
      handId: entry.handId, kind: 'BACK', outcome: entry.outcome, stake: entry.stakeUnits, returned: entry.grossReturnUnits });
  }
  if (previous?.currentHandId !== round.currentHandId || command.type === 'CLOSE') facts.push({ type: 'EMPHASIZE_ACTIVE_HAND', handId: round.currentHandId });
  state(publicRound.phase === 'INSURANCE' || after.followWindow || round.currentHandId && round.players.find(h => h.handId === round.currentHandId)?.controller === 'HUMAN'
    ? 'WAITING_PLAYER' : 'IDLE');
  return Object.freeze(facts.map(fact => Object.freeze(fact)));
}
