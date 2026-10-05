// Provisional DESIGN M10.12 timings, seconds for Motion. T06–T09 own visual tuning.
export const MOTION_TOKENS = Object.freeze({
  cardDeal: 0.14, cardGap: 0.14, flip: 0.22, split: 0.22,
  dealerEmphasis: 0.18, wager: 0.24, resultEmphasis: 0.16,
  arrivalEase: [0, 0, 0.2, 1] as const, emphasisEase: [0.42, 0, 0.58, 1] as const,
});
