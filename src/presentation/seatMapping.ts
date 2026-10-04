import { seatAnchors, type SeatCount } from './tableGeometry.js';

// Configured identities, including sitting-out participants, stay in ascending
// logical order. Visual slots never renumber accounts or mutate public facts.
export function mapSeats(seatNumbers: readonly number[]) {
  if (seatNumbers.length < 1 || seatNumbers.length > 7 || seatNumbers.some((seat, index) =>
    !Number.isInteger(seat) || seat < 1 || seat > 7 || (index > 0 && seat <= seatNumbers[index - 1]))) {
    throw new Error('Expected 1–7 unique ascending seat identities');
  }
  const anchors = seatAnchors(seatNumbers.length as SeatCount);
  return seatNumbers.map((seatNumber, index) => ({ seatNumber, ...anchors[index],
    band: Math.min(index, seatNumbers.length - 1 - index), side: anchors[index].x < 50 ? 1 : 2 }));
}
