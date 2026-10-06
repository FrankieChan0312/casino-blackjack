import { applyCommand, createBaccarat, digest, publicView, type Command, type State } from './domain/engine.js';
import { exportReplay } from './domain/replay.js';
import type { Target } from './domain/rules.js';
import { createPresentationFeed } from '../presentation/events.js';
import { baccaratFacts } from './presentation/facts.js';

export type Intent = { type: Exclude<Command['type'], 'WAGER'> } | { type: 'WAGER'; target: Target; amountUnits: number };
export function createBaccaratController(initial: State = createBaccarat(Math.floor(Math.random() * 0x100000000))) {
  let state = initial, snapshot = publicView(state), sequence = 0;
  const listeners = new Set<() => void>();
  const presentation = createPresentationFeed();
  return {
    presentation,
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    dispatch(intent: Intent, roundId = state.roundId): { ok: boolean; error?: string } {
      const result = applyCommand(state, { ...intent, roundId, requestId: `ui-${++sequence}` });
      if (!result.ok) return { ok: false, error: result.error };
      state = result.state;
      // Authority resolves/commits before any UI observation or future animation.
      if (intent.type === 'DEAL' && state.phase === 'RESOLVED') {
        const commit = applyCommand(state, { type: 'COMMIT', roundId, requestId: `ui-${++sequence}` });
        if (!commit.ok) throw new Error('Baccarat automatic commit failed: ' + commit.error);
        state = commit.state;
      }
      snapshot = publicView(state);
      if (intent.type === 'DEAL' && snapshot.round && snapshot.phase === 'COMPLETE') presentation.append(snapshot.roundId, 'DEAL', baccaratFacts(snapshot.round));
      else if (intent.type === 'NEXT' || intent.type === 'REPEAT' || intent.type === 'VOID') presentation.clear(snapshot.roundId);
      for (const listener of listeners) listener(); return { ok: true };
    },
    getDigest: () => digest(state),
    exportReplay: () => exportReplay(state),
  };
}
export type BaccaratController = ReturnType<typeof createBaccaratController>;
