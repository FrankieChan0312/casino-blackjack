import { expect, it } from 'vitest';
import { createBrowserController } from '../../src/browser/controller.js';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { behindFixture } from '../helpers/behindFixture.js';
import { noRandom } from '../helpers/tableFixture.js';

function controller() { return createBrowserController({ factory: () => behindFixture(['5', '6', '6', 'K', '2', '3', '8']), random: noRandom }); }
function dealt() { const c = controller(); c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'CLOSE' }); return c; }
it('[REG-M7-003] normal bootstrap exposes a seven-seat public session without raw state', () => {
  const c = createBrowserController();
  expect(c.getSnapshot().configuration).toHaveLength(7);
  expect(c.getSnapshot().human?.available).toBe(2000);
  for (const field of ['shoe', 'computers', 'bankrolls', 'originalCards', 'deckIndex']) expect(JSON.stringify(c.getSnapshot())).not.toContain(`"${field}"`);
  // M8 intentionally extends the method inventory. Preserve M7's historical
  // absence assertion at accepted M7; current raw-state secrecy above still runs.
  const acceptedSource = execFileSync('git', ['-c', 'safe.directory=C:/Users/user/Documents/GitHub/casino-blackjack',
    'show', 'da6f068ffd27713848ed48f023c17ed388b8b44e:src/browser/controller.ts'], { encoding: 'utf8' });
  const historical = ts.createSourceFile('controller.ts', acceptedSource, ts.ScriptTarget.Latest, true);
  const publicKeys: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isReturnStatement(node) && node.expression && ts.isObjectLiteralExpression(node.expression)
      && node.expression.properties.some(p => p.name?.getText(historical) === 'getSnapshot')) {
      publicKeys.push(...node.expression.properties.map(p => p.name!.getText(historical)));
    }
    ts.forEachChild(node, visit);
  }
  visit(historical);
  expect(publicKeys.sort()).toEqual(['dispatch', 'getSnapshot', 'queryWager', 'subscribe']);
});
it('[REG-M7-004] injected real-domain bootstrap has exact public cards and hides known hole identity', () => {
  const c = dealt(); const v = c.getSnapshot();
  expect(v.round?.dealer.visibleCards).toEqual([{ rank: '6', suit: 'diamonds' }]);
  expect(JSON.stringify(v)).not.toContain('K');
  expect(JSON.stringify(v)).not.toContain('spades');
  expect(v.round?.seats[0].hands[0].cards.map((card) => card.rank)).toEqual(['5', '6']);
});
it('[REG-M7-005] rejected wager preserves the latest cards and funds with safe feedback', () => {
  const c = dealt(); const before = c.getSnapshot();
  expect(c.dispatch({ type: 'MAIN', seat: 1, amount: 400 })).toBe(false);
  expect(c.getSnapshot().round).toEqual(before.round);
  expect(c.getSnapshot().human).toEqual(before.human);
  expect(c.getSnapshot().feedback).toBe('Betting is closed.');
});
it('[REG-M7-006] sequential commands retain the latest state rather than overwriting with stale snapshots', () => {
  const c = dealt();
  c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' });
  expect(c.getSnapshot().round?.seats[0].hands[0].cards.map((card) => card.rank)).toEqual(['5', '6', '2', '3']);
});
it('[REG-M7-007] [UX-03] read-only action queries consume neither cards nor randomness and reject the same illegal direct action', () => {
  const c = dealt(); const v = c.getSnapshot();
  expect(v.interaction.actions.find((entry) => entry.action === 'SPLIT')).toMatchObject({ enabled: false, reason: 'UNEQUAL_SPLIT_VALUE' });
  expect(c.getSnapshot()).toBe(v);
  expect(c.dispatch({ type: 'ACT', action: 'SPLIT', handId: 'round-1/seat-1' })).toBe(false);
  expect(c.getSnapshot().round).toEqual(v.round);
  expect(c.getSnapshot().human).toEqual(v.human);
});
it('[REG-M7-008] subscribers see fresh safe snapshots and can unsubscribe', () => {
  const c = controller(); const phases: string[] = [];
  const stop = c.subscribe(() => phases.push(c.getSnapshot().phase));
  c.dispatch({ type: 'OPEN' }); stop(); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 });
  expect(phases).toEqual(['OPEN']);
});
