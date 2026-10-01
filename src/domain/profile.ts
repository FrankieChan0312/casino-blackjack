export const profiles = Object.freeze({
  CLASSIC_6D_S17_V1_1: Object.freeze({ id: 'CLASSIC_6D_S17_V1_1', charlie: false } as const),
  CHARLIE5_6D_S17_V1_1: Object.freeze({ id: 'CHARLIE5_6D_S17_V1_1', charlie: true } as const),
  CLASSIC_6D_S17_V1_2: Object.freeze({ id: 'CLASSIC_6D_S17_V1_2', charlie: false, resplitAces: true } as const),
  CHARLIE5_6D_S17_V1_2: Object.freeze({ id: 'CHARLIE5_6D_S17_V1_2', charlie: true, resplitAces: true } as const),
});
export type ProfileId = keyof typeof profiles;
export const CLASSIC: ProfileId = 'CLASSIC_6D_S17_V1_1';
export const CHARLIE: ProfileId = 'CHARLIE5_6D_S17_V1_1';
export const CLASSIC_V1_2: ProfileId = 'CLASSIC_6D_S17_V1_2';
export const CHARLIE_V1_2: ProfileId = 'CHARLIE5_6D_S17_V1_2';
// Historical profile objects retain their accepted shape as well as semantics.
export function allowsResplitAces(id: ProfileId): boolean {
  const profile = getProfile(id);
  return 'resplitAces' in profile && profile.resplitAces;
}
export function isProfileId(value: unknown): value is ProfileId {
  return typeof value === 'string' && Object.hasOwn(profiles, value);
}
export function getProfile(id: unknown) {
  if (!isProfileId(id)) throw new RangeError('Unknown Blackjack profile');
  return profiles[id];
}
