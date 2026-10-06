export type CasinoRoute = 'BLACKJACK' | 'LOBBY' | 'BACCARAT' | 'NOT_FOUND';
// Native links keep routing small and support Vite's existing history fallback.
// The accepted root entry stays Blackjack; the lobby has its own stable URL.
export function casinoRoute(path: string): CasinoRoute {
  const normalized = path.replace(/\/+$/, '') || '/';
  if (normalized === '/' || normalized === '/blackjack') return 'BLACKJACK';
  if (normalized === '/casino') return 'LOBBY';
  if (normalized === '/baccarat') return 'BACCARAT';
  return 'NOT_FOUND';
}
