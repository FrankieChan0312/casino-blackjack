// All financial values are integer half-credit units (one unit = 0.5 credit).
export type CreditUnits = number;
export const STARTING_CREDIT_UNITS: CreditUnits = 2000;

export interface Bankroll {
  readonly available: CreditUnits;
  readonly reserved: CreditUnits;
}

export function isCreditUnits(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

export function isBankroll(bankroll: Bankroll): boolean {
  return isCreditUnits(bankroll.available) && isCreditUnits(bankroll.reserved)
    && Number.isSafeInteger(bankroll.available + bankroll.reserved);
}

export function createBankroll(): Bankroll {
  return { available: STARTING_CREDIT_UNITS, reserved: 0 };
}

export type FundingResult =
  | { readonly ok: true; readonly bankroll: Bankroll }
  | { readonly ok: false; readonly bankroll: Bankroll;
      readonly error: 'INVALID_AMOUNT' | 'INVALID_BANKROLL' | 'INSUFFICIENT_FUNDS' | 'ALREADY_RESERVED' | 'NOT_RESERVED' };

// A single reservation per local seat. Repeated reserve/release cannot apply twice.
export function reserveCredits(bankroll: Bankroll, amount: CreditUnits): FundingResult {
  if (!isBankroll(bankroll)) return { ok: false, bankroll, error: 'INVALID_BANKROLL' };
  if (!isCreditUnits(amount) || amount === 0) return { ok: false, bankroll, error: 'INVALID_AMOUNT' };
  if (bankroll.reserved !== 0) return { ok: false, bankroll, error: 'ALREADY_RESERVED' };
  if (amount > bankroll.available) return { ok: false, bankroll, error: 'INSUFFICIENT_FUNDS' };
  return { ok: true, bankroll: { available: bankroll.available - amount, reserved: amount } };
}

export function releaseCredits(bankroll: Bankroll): FundingResult {
  if (!isBankroll(bankroll)) return { ok: false, bankroll, error: 'INVALID_BANKROLL' };
  if (bankroll.reserved === 0) return { ok: false, bankroll, error: 'NOT_RESERVED' };
  return { ok: true, bankroll: { available: bankroll.available + bankroll.reserved, reserved: 0 } };
}
