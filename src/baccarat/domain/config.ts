export type BaccaratRules = Readonly<{
  version: 'M12' | 'M15'; deckCount: number; burnEnabled: boolean; cutCardReserve: number;
  playerPairProfit: number; bankerPairProfit: number;
}>;

// Casino Project default rule, not a universal casino cut-card policy.
export const DEFAULT_RULES: BaccaratRules = Object.freeze({ version: 'M15', deckCount: 8,
  burnEnabled: true, cutCardReserve: 14, playerPairProfit: 11, bankerPairProfit: 11 });
// Retained only for version-1 replay and the unchanged M12–M14 regression scenarios.
export const LEGACY_RULES: BaccaratRules = Object.freeze({ version: 'M12', deckCount: 8,
  burnEnabled: false, cutCardReserve: 0, playerPairProfit: 11, bankerPairProfit: 11 });

export function validateRules(input: BaccaratRules): BaccaratRules {
  if (!input || Object.keys(input).sort().join(',') !== Object.keys(DEFAULT_RULES).sort().join(',')
    || !['M12', 'M15'].includes(input.version) || typeof input.burnEnabled !== 'boolean'
    || !Number.isInteger(input.deckCount) || input.deckCount < 1 || input.deckCount > 8
    || !Number.isInteger(input.cutCardReserve) || input.cutCardReserve < 0
    || input.cutCardReserve > input.deckCount * 52 - (input.burnEnabled ? 11 : 0) - 6
    || ![input.playerPairProfit, input.bankerPairProfit].every(value => Number.isSafeInteger(value) && value >= 0 && value <= 100)) {
    throw new RangeError('Invalid Baccarat rules');
  }
  if (input.version === 'M12' && Object.keys(LEGACY_RULES).some(key => input[key as keyof BaccaratRules] !== LEGACY_RULES[key as keyof BaccaratRules])) {
    throw new RangeError('Historical Baccarat rules are immutable');
  }
  return Object.freeze({ ...input });
}
