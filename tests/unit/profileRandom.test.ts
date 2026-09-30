import { expect, it, vi } from 'vitest';
import { profiles, CLASSIC, CHARLIE, getProfile } from '../../src/domain/profile.js';
import { createSeededRandom, mathRandomSource, shuffleCards } from '../../src/domain/random.js';
import { createShoe, selectCutPosition } from '../../src/domain/shoe.js';
import { createSixDeckInventory } from '../../src/domain/card.js';
import { createBehindGame } from '../../src/domain/behindGame.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';

it('two immutable narrow profiles identify Classic OFF and Charlie ON', () => {
  expect(getProfile(CLASSIC)).toEqual({ id: CLASSIC, charlie: false });
  expect(getProfile(CHARLIE)).toEqual({ id: CHARLIE, charlie: true });
  expect(Object.isFrozen(profiles)).toBe(true);
  expect(Object.isFrozen(profiles[CHARLIE])).toBe(true);
  expect(() => getProfile('unknown' as typeof CLASSIC)).toThrow('Unknown');
});
it('default Classic and explicit Classic create identical sessions', () => {
  expect(createBehindGame('s', createSeededRandom(7))).toEqual(createBehindGame('s', createSeededRandom(7), true, CLASSIC));
});
it('Mulberry32 uint32 known vector seed 1', () => {
  const source = createSeededRandom(1);
  expect(Array.from({ length: 5 }, () => source.nextInt(2 ** 32))).toEqual([2693262067, 11749833, 2265367787, 4213581821, 4159151403]);
});
it('same seed repeats and different seeds give different controlled sequences', () => {
  const sequence = (seed: number) => { const rng = createSeededRandom(seed); return Array.from({ length: 16 }, () => rng.nextInt(312)); };
  expect(sequence(0)).toEqual(sequence(0));
  expect(sequence(0)).not.toEqual(sequence(1));
});
it('seed validation rejects non uint32 values, bounds validate before consuming', () => {
  for (const seed of [-1, 2 ** 32, 1.5, NaN, Infinity, '1', null]) expect(() => createSeededRandom(seed as number)).toThrow('unsigned');
  const rng = createSeededRandom(1);
  for (const bound of [0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1]) expect(() => rng.nextInt(bound)).toThrow('bound');
  expect(rng.nextInt(2 ** 32)).toBe(2693262067);
  expect(createSeededRandom(0xffffffff).nextInt(1)).toBe(0);
});
it('seeded shuffle has explicit small vector and identical full shoe/cut', () => {
  const cards = createSixDeckInventory().slice(0, 4);
  expect(shuffleCards(cards, createSeededRandom(1)).map((c) => c.id)).toEqual([cards[2].id, cards[1].id, cards[0].id, cards[3].id]);
  expect(createShoe('s', createSeededRandom(123))).toEqual(createShoe('s', createSeededRandom(123)));
  expect(selectCutPosition(createSeededRandom(1))).toBe(219 + 2693262067 % 31);
});
it('seeded mode never uses Math.random and public projection contains no RNG state', () => {
  const spy = vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('uncontrolled'); });
  try {
    const source = createSeededRandom(42);
    const view = getPublicBehindView(createBehindGame('s', source));
    expect(JSON.stringify(view)).not.toMatch(/seed|prng|random|availableCards|deckIndex/i);
    expect(Object.keys(source)).toEqual(['nextInt']);
    expect(spy).not.toHaveBeenCalled();
    expect(typeof mathRandomSource.nextInt).toBe('function');
  } finally { spy.mockRestore(); }
});
