import type { ComponentProps } from 'react';
import type { SeatUnit } from '../../src/ui/SeatUnit.js';
import { character } from '../../src/presentation/characters.js';

// Explicit public composition facts, not generated outcomes or production roster entries.
export type SeatFacts = ComponentProps<typeof SeatUnit>;
type Hand = SeatFacts['hands'][number];
export const fiveCardHand: Hand = { handId: 'layout/seat-1', origin: 'ORIGINAL',
  cards: [{ rank: '2', suit: 'clubs' }, { rank: '3', suit: 'diamonds' }, { rank: '4', suit: 'hearts' },
    { rank: '5', suit: 'spades' }, { rank: '6', suit: 'clubs' }], total: 20, stakeUnits: 51,
  complete: false, outcome: undefined, outcomeReason: undefined };
export const splitHands: readonly Hand[] = [
  { ...fiveCardHand, handId: 'layout/seat-1.1.1', origin: 'SPLIT', cards: [{rank:'A',suit:'clubs'},{rank:'K',suit:'diamonds'}], total:21, stakeUnits:100, complete:true, outcome:'PLAYER_WIN' },
  { ...fiveCardHand, handId: 'layout/seat-1.1.2', origin: 'SPLIT', cards: [{rank:'8',suit:'clubs'},{rank:'9',suit:'hearts'}], total:17, stakeUnits:200, complete:false },
  { ...fiveCardHand, handId: 'layout/seat-1.2.1', origin: 'SPLIT', cards: [{rank:'10',suit:'clubs'},{rank:'9',suit:'diamonds'},{rank:'5',suit:'hearts'}], total:24, stakeUnits:100, complete:true, outcome:'DEALER_WIN', outcomeReason:'PLAYER_BUST' },
  { ...fiveCardHand, handId: 'layout/seat-1.2.2', origin: 'SPLIT', cards: [{rank:'10',suit:'hearts'},{rank:'8',suit:'spades'}], total:18, stakeUnits:100, complete:true, outcome:'PUSH' },
];
export const seatFacts: SeatFacts = { seat: {seatNumber:1,occupancy:'COMPUTER',sittingOut:false,controllerId:'computer-1'},
  avatar:character('knight_female'), hands:[fiveCardHand], wager:51, currentSeat:1, currentHandId:fiveCardHand.handId };
