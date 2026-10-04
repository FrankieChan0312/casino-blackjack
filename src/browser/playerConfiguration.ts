export type PlayerCount = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const DEFAULT_PLAYER_COUNT: PlayerCount = 4;
// DESIGN M10.6: real account identities, ascending authoritative turn order.
export const PLAYER_SEATS: Readonly<Record<PlayerCount, readonly number[]>> = {
  1: [4], 2: [3, 4], 3: [3, 4, 6], 4: [1, 3, 4, 6],
  5: [1, 3, 4, 5, 6], 6: [1, 2, 3, 4, 5, 6], 7: [1, 2, 3, 4, 5, 6, 7],
};
export function isPlayerCount(value: number): value is PlayerCount {
  return Number.isInteger(value) && value >= 1 && value <= 7;
}
