import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CasinoApp } from '../src/casino/CasinoApp.js';
import { casinoRoute } from '../src/casino/routes.js';

it('[M11-U01] stable routes preserve root Blackjack and reject unknown paths', () => {
  for (const path of ['/', '/blackjack', '/blackjack/']) expect(casinoRoute(path)).toBe('BLACKJACK');
  expect(casinoRoute('/casino')).toBe('LOBBY'); expect(casinoRoute('/baccarat')).toBe('BACCARAT');
  expect(casinoRoute('/blackjack/other')).toBe('NOT_FOUND');
});
it('[M11-U02] lobby has truthful availability, native links, formal host and simulation disclosure', () => {
  const html = renderToStaticMarkup(<CasinoApp path="/casino" />);
  for (const text of ['Casino Lobby', 'AVAILABLE', 'IN DEVELOPMENT', 'Play Blackjack', 'Preview Baccarat',
    'href="/blackjack"', 'href="/baccarat"', 'noble_female/formal.png', 'no redemption value']) expect(html).toContain(text);
  expect(html).not.toContain('person-dealer');
});
it('[M11-U03] accepted root mounts the supplied app once with no wrapper or navigation DOM', () => {
  expect(renderToStaticMarkup(<CasinoApp path="/" blackjack={<main>accepted app</main>} />)).toBe('<main>accepted app</main>');
  const direct = renderToStaticMarkup(<CasinoApp path="/blackjack" blackjack={<main>accepted app</main>} />);
  expect(direct.match(/accepted app/g)).toHaveLength(1); expect(direct).toContain('Casino games');
});
it('[M11-U04] Baccarat bootstrap is explicit and navigation-only without unverified wagering', () => {
  const html = renderToStaticMarkup(<CasinoApp path="/baccarat" />);
  expect(html).toContain('Playable wagering is not available'); expect(html).toContain('Dealer: Celestine');
  expect(html).not.toContain('<button');
});
it('[M11-U05] unknown route provides an accessible return path', () => {
  const html = renderToStaticMarkup(<CasinoApp path="/missing" />);
  expect(html).toContain('<h1>Table not found</h1>'); expect(html).toContain('Return to Casino Lobby');
});
