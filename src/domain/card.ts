const suits = ['clubs', 'diamonds', 'hearts', 'spades'] as const;
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export type Suit = (typeof suits)[number];
export type Rank = (typeof ranks)[number];

export interface PhysicalCard {
  readonly id: string;
  readonly deckIndex: number;
  readonly suit: Suit;
  readonly rank: Rank;
}

// Unshuffled order: decks 1..6, then suits above, then A..K.
// IDs are unique within one inventory, not across separate shoes.
export function createSixDeckInventory(): readonly PhysicalCard[] {
  const cards: PhysicalCard[] = [];

  for (let deckIndex = 1; deckIndex <= 6; deckIndex++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ id: `${deckIndex}:${suit}:${rank}`, deckIndex, suit, rank });
      }
    }
  }

  return cards;
}
