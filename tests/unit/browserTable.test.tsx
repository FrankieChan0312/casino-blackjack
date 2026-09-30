import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import * as game from '../../src/domain/behindGame.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function setup() {
  const c = createBrowserController({ factory: () => behindFixture(['10', '5', '6', '8', '6', 'K', '7'], [seat(1, 'HUMAN'), seat(2)]), random: noRandom });
  c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'MAIN', seat: 2, amount: 200 }); c.dispatch({ type: 'CLOSE' }); return c;
}
it('renders seven seats and explicit local/computer/empty identities', () => {
  const html = renderToStaticMarkup(<App controller={setup()} />);
  for (let n = 1; n <= 7; n++) expect(html).toContain(`aria-label="Seat ${n}"`);
  expect(html).toContain('Seat 1 · You'); expect(html).toContain('Computer'); expect(html).toContain('Empty');
});
it('pre-reveal DOM and accessibility metadata contain only public dealer cards', () => {
  const html = renderToStaticMarkup(<App controller={setup()} />);
  expect(html).toContain('Hidden dealer card'); expect(html).not.toContain('K'); expect(html).not.toContain('diamonds:K');
  expect(html).toContain('6 of hearts');
});
it('one bust leaves another seat active and the dealer hidden until authorized reveal', () => {
  const c = setup(); c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  const html = renderToStaticMarkup(<App controller={c} />);
  expect(html).toContain('Bust'); expect(html).toContain('Waiting for Seat 2'); expect(html).toContain('Hidden dealer card');
  c.dispatch({ type: 'ADVANCE' });
  const revealed = renderToStaticMarkup(<App controller={c} />);
  expect(revealed).toContain('K of diamonds'); expect(revealed).toContain('Round complete'); expect(revealed).not.toContain('Hidden dealer card');
});
it('sitting out and configuration/betting transitions have readable text', () => {
  const c = createBrowserController({ factory: () => accepted(game.configureBehindSeats(behindFixture(), [{ ...seat(2), sittingOut: true }])) });
  expect(renderToStaticMarkup(<App controller={c} />)).toContain('Sitting Out');
  c.dispatch({ type: 'OPEN' }); expect(renderToStaticMarkup(<App controller={c} />)).toContain('Betting open');
});
