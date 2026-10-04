import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { DealerZone } from '../../src/ui/DealerZone.js';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';

type Dealer = NonNullable<ComponentProps<typeof DealerZone>['dealer']>;
const hidden: Dealer = { upcard: { rank: '10', suit: 'clubs' }, visibleCards: [{ rank: '10', suit: 'clubs' }], holeCard: null, total: 10, status: 'Hole card hidden' };

it('[M10A-D01] the idle workstation has an accessible temporary character, card destination, shoe origin and exact rules', () => {
  const html = renderToStaticMarkup(<DealerZone dealer={undefined} />);
  for (const text of ['aria-label="Dealer"', 'Original illustrated female dealer in professional attire', 'aria-label="Dealer hand"',
    'Waiting for the initial deal', 'data-anchor="dealer-shoe"', 'aria-label="Shoe and deal origin"', '6 decks', 'BLACKJACK PAYS 3:2', 'DEALER STANDS ON ALL 17']) expect(html).toContain(text);
  expect(html).not.toContain('Hidden dealer card'); expect(html).not.toContain('Total:');
  expect(html).not.toMatch(/bankroll|wager|character-id|onClick/);
});

it('[M10A-D02] hidden-hole public facts render exactly one visible card and generic back without any private identity', () => {
  const html = renderToStaticMarkup(<DealerZone dealer={hidden} />);
  expect([...html.matchAll(/class="card /g)]).toHaveLength(2);
  expect(html).toContain('10 of clubs'); expect(html).toContain('Hidden dealer card'); expect(html).toContain('Visible total: 10');
  expect(html).toContain('Hole card hidden'); expect(html).not.toMatch(/deckIndex|physicalCardId|seed|shoeOrder/);
  expect(html).not.toMatch(/of (hearts|diamonds|spades)/);
});

it.each(['Dealer complete', 'Bust', 'Blackjack'])('[M10A-D03] revealed state %s uses the public status and total without a hidden back', status => {
  const html = renderToStaticMarkup(<DealerZone dealer={{ ...hidden, visibleCards: [{ rank: 'A', suit: 'clubs' }, { rank: 'K', suit: 'hearts' }],
    holeCard: { rank: 'K', suit: 'hearts' }, total: 21, status }} />);
  expect(html).toContain('A of clubs'); expect(html).toContain('K of hearts'); expect(html).toContain('Total: 21');
  expect(html).toContain(`data-dealer-status="${status}"`); expect(html).not.toContain('Hidden dealer card');
  expect(html).not.toContain('Visible total');
});

it.each([3, 4, 5])('[M10A-D04] %i public draw cards keep their exact order and independently supplied total', count => {
  const cards: Dealer['visibleCards'] = [{ rank: '2', suit: 'clubs' }, { rank: '3', suit: 'diamonds' }, { rank: '4', suit: 'hearts' }, { rank: '5', suit: 'spades' }, { rank: '6', suit: 'clubs' }];
  const totals = { 3: 9, 4: 14, 5: 20 } as const;
  const html = renderToStaticMarkup(<DealerZone dealer={{ upcard: cards[0], visibleCards: cards.slice(0, count), holeCard: cards[1], total: totals[count as keyof typeof totals], status: 'Dealer complete' }} />);
  expect([...html.matchAll(/class="card /g)]).toHaveLength(count);
  expect([...html.matchAll(/aria-label="([A-Z\d]+ of [a-z]+)"/g)].map(match => match[1])).toEqual(['2 of clubs', '3 of diamonds', '4 of hearts', '5 of spades', '6 of clubs'].slice(0, count));
  expect(html).toContain(`Total: ${totals[count as keyof typeof totals]}`);
});

it('[M10A-D05] diagnostic public status is preserved without inventing a normal result', () => {
  const html = renderToStaticMarkup(<DealerZone dealer={hidden} phase="INTEGRITY_ERROR" />);
  expect(html).toContain('Round interrupted');
  expect(html).toContain('Hidden dealer card'); expect(html).not.toContain('Dealer complete');
});

it('[M10A-D06] rendering a real public scene is pure and preserves all accepted remote/local ownership', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 }); controller.dispatch({ type: 'DEAL', amount: 200 });
  const before = JSON.stringify(controller.getSnapshot()); let notifications = 0; const unsubscribe = controller.subscribe(() => notifications++);
  const html = renderToStaticMarkup(<App controller={controller} chooseCharacter={() => 0} />);
  expect([...html.matchAll(/data-scene-zone="dealer"/g)]).toHaveLength(1);
  expect([...html.matchAll(/class="seat-unit"/g)]).toHaveLength(3); expect(html).toContain('aria-label="Your player HUD"');
  expect([...html.matchAll(/data-anchor="table-centre"/g)]).toHaveLength(1);
  expect(html).toContain('Visible total: 4'); expect(html).toContain('Hole card hidden');
  expect(JSON.stringify(controller.getSnapshot())).toBe(before); expect(notifications).toBe(0); unsubscribe();
});

it('[M10A-D07] manual mode retains the original Dealer and seven seats without the Player Mode workstation', () => {
  const html = renderToStaticMarkup(<App controller={createBrowserController({ seed: 7 })} />);
  expect(html).not.toContain('dealer-zone'); expect(html).not.toContain('Shoe and deal origin');
  expect(html).toContain('aria-label="Dealer"'); for (let seat = 1; seat <= 7; seat++) expect(html).toContain(`aria-label="Seat ${seat}"`);
});
