import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Table } from '../../src/ui/Table.js';
import { SeatUnit } from '../../src/ui/SeatUnit.js';
import { LocalPlayerHud } from '../../src/ui/LocalPlayerHud.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { seatFacts, fiveCardHand, splitHands } from './seatFixtures.js';

it('[M10A-F01] occupied real seat identities own the only MAIN spots and idle local hand destination', () => {
  const html = renderToStaticMarkup(<Table view={createBrowserController({ playerMode: true, seed: 7 }).getSnapshot()} />);
  expect([...html.matchAll(/data-seat-anchor="([^"]+)"/g)].map(m => m[1])).toEqual(['seat-1', 'seat-3', 'seat-4', 'seat-6']);
  expect([...html.matchAll(/data-felt-destination="main-wager"/g)]).toHaveLength(4);
  expect([...html.matchAll(/data-felt-destination="hand"/g)]).toHaveLength(1);
  expect(html).not.toMatch(/bankroll|chip-stack|Insurance arc/);
});

it('[M10A-F02] an actual public round retains cards, current hand and exact stakes without render side effects', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 }); c.dispatch({ type: 'DEAL', amount: 200 });
  const view = c.getSnapshot(), before = JSON.stringify(view), html = renderToStaticMarkup(<Table view={view} />);
  expect(JSON.stringify(c.getSnapshot())).toBe(before);
  expect([...html.matchAll(/data-felt-destination="hand"/g)]).toHaveLength(4);
  expect(html).toContain('aria-label="Total: 9"'); expect(html).toContain('MAIN: 100 credits');
  expect(html).toContain('5 of hearts'); expect(html).toContain('4 of spades');
  expect([...html.matchAll(/data-felt-rules="true"/g)]).toHaveLength(1);
  expect(html).toContain('Hidden dealer card'); expect(html).toContain('data-felt-destination="deal-origin"');
});

it.each([1, 2, 4])('[M10A-F03] %i public guest leaves retain their own IDs and independent exact stakes', count => {
  const hands = count === 1 ? [fiveCardHand] : splitHands.slice(0, count);
  const html = renderToStaticMarkup(<SeatUnit {...seatFacts} hands={hands} />);
  expect([...html.matchAll(/data-hand-id="([^"]+)" data-felt-destination="hand"/g)].map(m => m[1])).toEqual(hands.map(h => h.handId));
  if (count === 1) expect(html).toContain('data-felt-destination="main-wager">MAIN: 25.5 credits');
  else {
    expect([...html.matchAll(/data-felt-destination="hand-wager"/g)]).toHaveLength(count);
    expect(html).toContain('Wager: 100 credits'); expect(html).toContain('Wager: 50 credits');
  }
});

it('[M10A-F04] local Split markers stay on their named leaves and keep one active indicator and exact own wagers', () => {
  const hands = splitHands.map(h => ({ ...h, handId: h.handId.replace('seat-1', 'seat-4') }));
  const html = renderToStaticMarkup(<LocalPlayerHud seat={{ seatNumber: 4, occupancy: 'HUMAN', sittingOut: false, controllerId: 'human' }} hands={hands} wager={100} currentHandId={hands[1].handId} ownResults={[]} />);
  expect([...html.matchAll(/data-hand-id="([^"]+)" data-felt-destination="hand"/g)].map(m => m[1])).toEqual(['layout/seat-4.1.1', 'layout/seat-4.1.2', 'layout/seat-4.2.1', 'layout/seat-4.2.2']);
  expect([...html.matchAll(/data-felt-destination="main-wager"/g)]).toHaveLength(1);
  expect([...html.matchAll(/data-felt-destination="hand-wager"/g)]).toHaveLength(4);
  expect([...html.matchAll(/>ACTIVE</g)]).toHaveLength(1); expect(html).toContain('Hand A.2 · Current hand');
  expect(html).toContain('MAIN: 50 credits'); expect(html).not.toContain('Blackjack');
});

it('[M10A-F05] manual mode retains seven seats without Player Mode markings', () => {
  const html = renderToStaticMarkup(<Table view={createBrowserController({ seed: 7 }).getSnapshot()} />);
  expect(html).not.toMatch(/data-felt-/); for (let n = 1; n <= 7; n++) expect(html).toContain(`aria-label="Seat ${n}"`);
});

it('[M10A-F06] every felt gameplay phrase is supported by the authoritative repository rules', () => {
  const rules = readFileSync('docs/RULES.md', 'utf8'), dealer = readFileSync('src/ui/DealerZone.tsx', 'utf8');
  expect(dealer).toContain('BLACKJACK PAYS 3:2'); expect(rules).toContain('Unconverted original natural, dealer not natural');
  expect(rules).toContain('`2.5 * stake`'); expect(rules).toContain('profit relative to the relevant stake');
  expect(dealer).toContain('DEALER STANDS ON ALL 17'); expect(rules).toContain('stand on every 17 through 21, including soft 17');
  expect(rules).toContain('Original main wager'); expect(rules).toContain('Split hands settle independently');
  expect(rules).toContain('Use six standard 52-card decks: 312 physical cards');
  const html = renderToStaticMarkup(<Table view={createBrowserController({ playerMode: true, seed: 7 }).getSnapshot()} />);
  expect(html).not.toMatch(/Insurance|Even Money|Perfect Pairs|21\+3|H17|6:5|jackpot|bonus|Bet Behind/);
});
