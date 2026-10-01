import { expect, it } from 'vitest';
import { profiles, CLASSIC, CHARLIE, CLASSIC_V1_2, CHARLIE_V1_2, allowsResplitAces, getProfile, isProfileId } from '../../src/domain/profile.js';

it('RA1 profile contract preserves historical shapes and independent Charlie/RSA capabilities', () => {
  expect(getProfile(CLASSIC)).toEqual({ id: CLASSIC, charlie: false });
  expect(getProfile(CHARLIE)).toEqual({ id: CHARLIE, charlie: true });
  expect([CLASSIC, CHARLIE].map(allowsResplitAces)).toEqual([false, false]);
  expect(getProfile(CLASSIC_V1_2)).toEqual({ id: CLASSIC_V1_2, charlie: false, resplitAces: true });
  expect(getProfile(CHARLIE_V1_2)).toEqual({ id: CHARLIE_V1_2, charlie: true, resplitAces: true });
  expect([CLASSIC_V1_2, CHARLIE_V1_2].map(allowsResplitAces)).toEqual([true, true]);
  for (const id of Object.keys(profiles)) {
    expect(isProfileId(id)).toBe(true); expect(Object.isFrozen(getProfile(id))).toBe(true);
  }
});
