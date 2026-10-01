import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { createBrowserController } from '../../src/browser/controller.js';
import { App } from '../../src/ui/App.js';
import { CLASSIC } from '../../src/domain/profile.js';

it('[M9-001] player shell opens own betting table; manual callers retain configuration', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  const v = c.getSnapshot();
  expect(v.phase).toBe('OPEN'); expect(v.human?.controlledSeat).toBe(4);
  expect(v.human?.available).toBe(2000); expect(v.human?.reserved).toBe(0);
  expect(v.profileId).toBe(CLASSIC); expect(v.round).toBeNull();
  const html = renderToStaticMarkup(createElement(App, { controller: c }));
  expect(html).toContain('player-mode'); expect(html).toContain('Blackjack table');
  expect(html).not.toContain('Set up your table');
  expect(createBrowserController().getSnapshot().phase).toBe('CONFIGURING');
});

it('[M9-002] explicit seeded session reset prepares player shell without exposing seed', () => {
  const c = createBrowserController({ playerMode: true });
  expect(c.startDemo(CLASSIC, 42)).toBe(true);
  expect(c.getSnapshot().phase).toBe('OPEN'); expect(c.getSnapshot().seeded).toBe(true);
  expect(c.getSnapshot().audit.some(e => e.type === 'SESSION_RESET')).toBe(true);
  expect(JSON.stringify(c.getSnapshot())).not.toMatch(/"seed"|deckIndex|originalCards|"shoe"/);
});
