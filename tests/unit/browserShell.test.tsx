import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';

it('browser shell identifies the product and non-redeemable simulation credits', () => {
  const html = renderToStaticMarkup(<App controller={createBrowserController()} />);
  expect(html).toContain('Casino Blackjack');
  expect(html).toContain('Simulation credits only');
  expect(html).toContain('no redemption value');
  expect(html).toContain('Blackjack table');
});
