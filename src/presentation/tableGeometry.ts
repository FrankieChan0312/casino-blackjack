export type SeatCount = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SeatAnchor = { slot: number; angle: number; x: number; y: number };

// Percent coordinates on the lower half-ellipse; independent of seat accounts.
export const TABLE_GEOMETRY = {
  centre: { x: 50, y: 34 }, radius: { x: 40, y: 48 },
  firstAngle: 160, lastAngle: 20, dealer: { x: 50, y: 0 },
} as const;

export function seatAnchors(count: SeatCount): readonly SeatAnchor[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = count === 1 ? 90 : TABLE_GEOMETRY.firstAngle
      + (TABLE_GEOMETRY.lastAngle - TABLE_GEOMETRY.firstAngle) * index / (count - 1);
    const radians = angle * Math.PI / 180;
    return { slot: index + 1, angle, x: TABLE_GEOMETRY.centre.x + TABLE_GEOMETRY.radius.x * Math.cos(radians),
      y: TABLE_GEOMETRY.centre.y + TABLE_GEOMETRY.radius.y * Math.sin(radians) };
  });
}

// T01 keeps the current physical-seat layout; T03 owns count-specific binding.
export const TABLE_SEAT_ANCHORS = seatAnchors(7);
