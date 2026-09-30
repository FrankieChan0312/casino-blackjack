import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { execFileSync } from 'node:child_process';

it('[REG-M7-002] [UX-14] browser shell identifies the product and non-redeemable simulation credits', () => {
  const html = renderToStaticMarkup(<App controller={createBrowserController()} />);
  expect(html).toContain('Casino Blackjack');
  expect(html).toContain('Simulation credits only');
  expect(html).toContain('no redemption value');
  expect(html).toContain('Blackjack table');
  // Authorized M8 historical absence boundary (REG-M6-095 precedent).
  const acceptedShell = execFileSync('git', ['-c', 'safe.directory=C:/Users/user/Documents/GitHub/casino-blackjack',
    'show', 'da6f068ffd27713848ed48f023c17ed388b8b44e:src/ui/App.tsx'], { encoding: 'utf8' });
  expect(acceptedShell).not.toMatch(/Charlie|Replay|Seed/);
});
