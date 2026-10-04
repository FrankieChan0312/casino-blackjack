import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { createFixtureController } from '../browser/fixtures.js';

const render = (c: ReturnType<typeof createFixtureController>) => renderToStaticMarkup(<App controller={c} />);
function deal(name = 'player', amount = 200) {
  const c = createFixtureController(name); expect(c.dispatch({ type: 'DEAL', amount })).toBe(true); return c;
}

it('[M10A-C01] betting retains the actual numeric limits, existing choices and optional access without render effects', () => {
  const c = createFixtureController('player'), before = JSON.stringify(c.getSnapshot()), html = render(c);
  expect(html).toContain('data-control-surface="betting"');
  expect(html).toContain('id="player-wager" type="number" min="10" max="1000" step="1" required=""');
  for (const value of [10, 25, 100]) expect(html).toContain(`aria-label="Choose ${value} credits"`);
  expect(html).toContain('>Deal</button>'); expect(html).toContain('Optional wagers');
  expect(JSON.stringify(c.getSnapshot())).toBe(before);
});

it('[M10A-C02] real normal actions preserve the five native options, unavailable reason and named current hand', () => {
  const c = deal(), html = render(c);
  expect(html).toContain('id="player-action-hand">· Hand A'); expect(html).toContain('data-active-hand-id="round-1/seat-4"');
  expect(html).toContain('aria-describedby="player-scene-status player-action-hand"');
  for (const label of ['Hit', 'Stand', 'Double', 'Split', 'Surrender']) expect(html).toContain(`>${label}</button>`);
  expect(html).toContain('class="action-split" disabled="" aria-describedby="reason-SPLIT"');
  expect(html).toContain('Split unavailable — The two cards must have equal Blackjack values.');
});

it('[M10A-C03] the single action dock follows actual Split A then B with separate exact cards and wagers', () => {
  const c = deal('player-split');
  expect(c.dispatch({ type: 'ACT', action: 'SPLIT', handId: 'round-1/seat-4' })).toBe(true);
  let html = render(c); expect(html).toContain('id="player-action-hand">· Hand A');
  expect(html).toContain('data-active-hand-id="round-1/seat-4.1"');
  expect(c.getSnapshot().round?.seats.find(s => s.seatNumber === 4)?.hands.map(h => [h.handId, h.cards.map(card => card.rank), h.stakeUnits]))
    .toEqual([['round-1/seat-4.1', ['8', '2'], 200], ['round-1/seat-4.2', ['8'], 200]]);
  expect(c.dispatch({ type: 'ACT', action: 'STAND', handId: 'round-1/seat-4.1' })).toBe(true);
  html = render(c); expect(html).toContain('id="player-action-hand">· Hand B');
  expect(html).toContain('data-active-hand-id="round-1/seat-4.2"');
  expect([...html.matchAll(/data-control-surface="actions"/g)]).toHaveLength(1);
  expect(c.getSnapshot().round?.seats.find(s => s.seatNumber === 4)?.hands.map(h => h.cards.map(card => card.rank)))
    .toEqual([['8', '2'], ['8', '3']]);
});

it('[M10A-C04] Re-split Aces keeps only authoritative Split and Stand enabled and names the current descendant', () => {
  const c = deal('player-rsa-cap');
  expect(c.dispatch({ type: 'ACT', action: 'SPLIT', handId: 'round-1/seat-4' })).toBe(true);
  const html = render(c); expect(html).toContain('data-active-hand-id="round-1/seat-4.1"');
  expect(c.getSnapshot().interaction.actions.filter(a => a.enabled).map(a => a.action)).toEqual(['STAND', 'SPLIT']);
  for (const action of ['hit', 'double', 'surrender']) expect(html).toContain(`class="action-${action}" disabled=""`);
  expect(html).toContain('Re-split Aces: choose Split with a matching wager, or Stand to keep Soft 12.');
});

it('[M10A-C05] Insurance preserves exact eligible choices, explanatory disclosure and fully funded separate stake', () => {
  const c = deal('player-ace'), html = render(c);
  expect(html).toContain('data-control-surface="insurance"'); expect(html).toContain('Your MAIN · Seat 4 · Insurance amount: 50 credits');
  expect(html).toContain('<summary>Insurance and Even Money explained</summary>');
  expect(html).toContain('Insurance is a separate funded wager.'); expect(html).not.toContain('>Take Even Money</button>');
  expect(c.dispatch({ type: 'ACE', choice: 'INSURANCE' })).toBe(true);
  expect(c.getSnapshot().human).toMatchObject({ available: 1700, reserved: 300 });
  expect(c.getSnapshot().ownResults.filter(r => r.type === 'INSURANCE')).toEqual([
    { type: 'INSURANCE', handId: null, stake: 100, outcome: 'LOSS', returned: 0, status: 'PENDING' },
  ]);
});

it('[M10A-C06] eligible Even Money stays distinct and settles original 1:1 profit without an Insurance stake', () => {
  const c = deal('player-even-money'), html = render(c);
  for (const label of ['Buy Insurance', 'Decline', 'Take Even Money']) expect(html).toContain(`>${label}</button>`);
  expect(html).toContain('Eligible Even Money locks a 1:1 profit on the original stake without another wager.');
  expect(c.dispatch({ type: 'ACE', choice: 'EVEN_MONEY' })).toBe(true);
  expect(c.getSnapshot().human).toMatchObject({ available: 2200, reserved: 0 });
  expect(c.getSnapshot().ownResults).toEqual([
    { type: 'MAIN', handId: 'round-1/seat-4', stake: 200, outcome: 'EVEN_MONEY', returned: 400, status: 'COMMITTED' },
  ]);
  expect(render(c)).toContain('Net result: 100 credits'); expect(render(c)).not.toContain('data-control-surface="actions"');
});

it('[M10A-C07] unaffordable Insurance remains disabled with a named reason and Decline does not reserve funds', () => {
  const c = deal('player-ace', 2000), html = render(c);
  expect(html).toContain('disabled="" aria-describedby="insurance-unavailable"');
  expect(html).toContain('id="insurance-unavailable">Insurance unavailable — not enough available credits.');
  expect(c.dispatch({ type: 'ACE', choice: 'DECLINE' })).toBe(true);
  expect(c.getSnapshot().human).toMatchObject({ available: 0, reserved: 2000 });
  expect(c.getSnapshot().ownResults.some(r => r.type === 'INSURANCE')).toBe(false);
  expect(render(c)).toContain('id="player-action-hand">· Hand A');
});

it('[M10A-C08] manual decisions retain ordinary explanations and existing follower/native controls', () => {
  const html = render(createFixtureController('natural'));
  expect(html).not.toContain('data-control-surface'); expect(html).not.toContain('decision-explanation');
  expect(html).toContain('>Take Even Money</button>'); expect(html).toContain('Insurance is a separate funded wager.');
  const follow = render(createFixtureController('follow-split'));
  expect(follow).toContain('>ADD</button>'); expect(follow).toContain('>NO ADD</button>');
  expect(follow).toContain('existing exposure follows the first ordered child only');
});
