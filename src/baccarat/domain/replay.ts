import { inventory } from './shoe.js';
import { DEFAULT_RULES, LEGACY_RULES, validateRules, type BaccaratRules } from './config.js';
import { applyCommand, createBaccarat, digest, publicView, type Command, type State, type Configuration } from './engine.js';
export type ReplayPackage = Readonly<{ version: 1 | 2; game: 'PUNTO_BANCO_8D_V1' | 'PUNTO_BANCO_M15';
  configuration: Omit<Configuration, 'rules'> & { rules?: BaccaratRules }; commands: readonly Command[]; digest: string }>;
export function exportReplay(state: State): ReplayPackage {
  const { rules, ...legacy } = state.configuration;
  return Object.freeze({ version: rules.version === 'M12' ? 1 : 2, game: rules.version === 'M12' ? 'PUNTO_BANCO_8D_V1' : 'PUNTO_BANCO_M15',
    configuration: rules.version === 'M12' ? Object.freeze(legacy) : state.configuration,
    commands: state.commands, digest: digest(state) });
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Malformed Baccarat replay');
  return value as Record<string, unknown>;
}
export function replay(value: unknown, clock?: () => string) {
  const data = object(value), configuration = object(data.configuration);
  if (typeof configuration.seed !== 'number' || typeof configuration.initialUnits !== 'number') throw new Error('Malformed replay configuration');
  if (!(data.version === 1 && data.game === 'PUNTO_BANCO_8D_V1' || data.version === 2 && data.game === 'PUNTO_BANCO_M15') || !Array.isArray(data.commands)
    || data.commands.length > 10000 || typeof data.digest !== 'string' || !/^fnv1a32-v1:[0-9a-f]{8}$/.test(data.digest)) {
    throw new Error('Malformed Baccarat replay');
  }
  const rules = data.version === 1 ? LEGACY_RULES : validateRules(configuration.rules as BaccaratRules);
  if (data.version === 2 && rules.version !== DEFAULT_RULES.version || data.version === 1 && configuration.rules !== undefined) throw new Error('Invalid replay rules version');
  let ordered;
  if (configuration.orderedIds !== undefined) {
    if (!Array.isArray(configuration.orderedIds) || configuration.orderedIds.length !== rules.deckCount * 52) throw new Error('Invalid replay shoe');
    const cards = new Map(inventory(rules.deckCount).map(card => [card.id, card]));
    ordered = configuration.orderedIds.map(id => {
      if (typeof id !== 'string' || !cards.has(id)) throw new Error('Invalid replay physical ID');
      return cards.get(id)!;
    });
  }
  let state = createBaccarat(configuration.seed as number, configuration.initialUnits as number, ordered, rules);
  for (const item of data.commands) {
    const command = object(item);
    if (typeof command.requestId !== 'string' || typeof command.roundId !== 'string') throw new Error('Malformed replay intent');
    const result = applyCommand(state, command as Command, clock);
    if (!result.ok) throw new Error('Rejected replay intent: ' + result.error);
    state = result.state;
  }
  if (digest(state) !== data.digest) throw new Error('Baccarat replay digest mismatch');
  return Object.freeze({ state, view: publicView(state), digest: digest(state) });
}
