import { describe, expect, it } from 'vitest';
import { createBankroll, isBankroll, isCreditUnits, releaseCredits, reserveCredits } from '../../src/domain/credits.js';

describe('integer half-credit funding primitives', () => {
  it('starts with 1000 credits represented by 2000 units', () => {
    expect(createBankroll()).toEqual({ available: 2000, reserved: 0 });
    expect(isCreditUnits(1)).toBe(true);
    expect(isBankroll(createBankroll())).toBe(true);
  });
  it.each([200, 2000])('reserves %i units exactly without mutating the input', (amount) => {
    const input = Object.freeze(createBankroll());
    expect(reserveCredits(input, amount)).toEqual({ ok: true,
      bankroll: { available: 2000 - amount, reserved: amount } });
    expect(input).toEqual({ available: 2000, reserved: 0 });
  });
  it('accepts exact 200 and rejects one unit short atomically', () => {
    expect(reserveCredits({ available: 200, reserved: 0 }, 200)).toEqual({ ok: true,
      bankroll: { available: 0, reserved: 200 } });
    const input = Object.freeze({ available: 199, reserved: 0 });
    for (let i = 0; i < 2; i++) {
      expect(reserveCredits(input, 200)).toEqual({ ok: false, bankroll: input, error: 'INSUFFICIENT_FUNDS' });
      expect(reserveCredits(input, 200).bankroll).toBe(input);
    }
  });
  it.each([0, -1, 0.5, 1.1, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid reserve %s', (amount) => {
    const input = Object.freeze(createBankroll());
    expect(reserveCredits(input, amount)).toEqual({ ok: false, bankroll: input, error: 'INVALID_AMOUNT' });
    expect(reserveCredits(input, amount).bankroll).toBe(input);
  });
  it('releases the actual reservation once and rejects duplicate operations', () => {
    const reserved = reserveCredits(createBankroll(), 200).bankroll;
    expect(reserveCredits(reserved, 200)).toEqual({ ok: false, bankroll: reserved, error: 'ALREADY_RESERVED' });
    const released = releaseCredits(reserved);
    expect(released).toEqual({ ok: true, bankroll: { available: 2000, reserved: 0 } });
    expect(releaseCredits(released.bankroll)).toEqual({ ok: false, bankroll: released.bankroll, error: 'NOT_RESERVED' });
    expect(reserved).toEqual({ available: 1800, reserved: 200 });
  });
  it.each([{ available: -1, reserved: 0 }, { available: 2.5, reserved: 0 },
    { available: 2000, reserved: NaN }, { available: Number.MAX_SAFE_INTEGER, reserved: 1 }])('rejects invalid bankroll %o', (input) => {
    expect(isBankroll(input)).toBe(false);
    expect(reserveCredits(input, 2)).toEqual({ ok: false, bankroll: input, error: 'INVALID_BANKROLL' });
    expect(releaseCredits(input)).toEqual({ ok: false, bankroll: input, error: 'INVALID_BANKROLL' });
  });
});
