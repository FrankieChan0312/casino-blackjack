export function baccaratCredits(units: number): string {
  return (units / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
export function signedCredits(units: number): string { return `${units > 0 ? '+' : ''}${baccaratCredits(units)}`; }
