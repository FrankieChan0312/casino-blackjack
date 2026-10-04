import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';

it('[M10A-S01] the open scene contains the table, local wager and exact funds while secondary tools remain available', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 });
  const html = renderToStaticMarkup(<App controller={controller} chooseCharacter={() => 0} />);
  const scene = html.slice(html.indexOf('class="game-scene"'), html.indexOf('<aside'));
  for (const name of ['Blackjack game scene', 'Blackjack table', 'Dealer', 'Seat 4', 'Your gameplay controls', 'Your credits', 'Your wager']) {
    expect(scene).toContain(`aria-label="${name}"`);
  }
  expect(scene).toContain('Credits have no redemption value.');
  expect(scene).toContain('<dt>Available</dt><dd>1,000</dd>');
  expect(scene).toContain('<dt>Reserved / current exposure</dt><dd>0</dd>');
  expect(scene).toContain('<dt>Pending return</dt><dd>0</dd>');
  expect(scene).not.toContain('Developer / demo tools');
  expect(html).toContain('aria-label="Table preferences and demo tools"');
  expect(html).toContain('Change Character');
});

it('[M10A-S02] zone ownership and semantic hand-status-action-funds order preserve public state without issuing commands', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  const before = JSON.stringify(controller.getSnapshot());
  let notifications = 0;
  const unsubscribe = controller.subscribe(() => notifications++);
  const html = renderToStaticMarkup(<App controller={controller} chooseCharacter={() => 0} />);
  expect([...html.matchAll(/data-scene-zone="([^"]+)"/g)].map(match => match[1])).toEqual([
    'dealer', 'remote-seat', 'remote-seat', 'local-player', 'remote-seat', 'controls',
  ]);
  expect(html.indexOf('id="player-hand"')).toBeLessThan(html.indexOf('id="player-scene-status"'));
  expect(html.indexOf('id="player-scene-status"')).toBeLessThan(html.indexOf('aria-label="Primary actions"'));
  expect(html.indexOf('aria-label="Primary actions"')).toBeLessThan(html.indexOf('aria-label="Your credits"'));
  expect(html).toContain('aria-describedby="player-scene-status"');
  expect(html).toContain('<dt>Available</dt><dd>900</dd>');
  expect(html).toContain('<dt>Reserved / current exposure</dt><dd>100</dd>');
  expect(html).toContain('Hidden dealer card');
  expect(JSON.stringify(controller.getSnapshot())).toBe(before);
  expect(notifications).toBe(0);
  unsubscribe();
});

it('[M10A-S03] the manual experience retains its original labels and seven seats without player-only scene zones', () => {
  const html = renderToStaticMarkup(<App controller={createBrowserController({ seed: 7 })} />);
  expect(html).toContain('class="manual-mode"');
  expect(html).not.toContain('class="game-scene"');
  expect(html).not.toContain('data-scene-zone=');
  for (let seat = 1; seat <= 7; seat++) expect(html).toContain(`aria-label="Seat ${seat}"`);
});
