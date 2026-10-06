# M12 — Baccarat authority contract

Owner-authorized overnight batch. Baseline main `a0267c37c2d459f1bd80c5b06576a0f591cd5374`, local/tracking/live equal, CLEAN, untracked0, ahead/behind0/0 at 2026-10-07 02:21:47 +08:00. M11 primary `7c6020b`; publication receipt `a0267c3`. Blackjack remains ACCEPTED / CLOSED / FROZEN at blackjack-v1.0 /79533bc. No conflicting existing Baccarat contract was found.

## Task contract

- Task ID/milestone M12; initial repairs0/10, maximum10, no exception/reset.
- Recommended GPT-6.1 Sol / Max (owner preference); client metadata confirms availability; selected runtime model/effort NOT VERIFIED.
- Scope: headless eight-deck Punto Banco, Player/Banker/Tie, exact funding/settlement, deterministic shoe, journal/replay/digest, independent rule validator.
- Non-goals: side bets, accounts, multiplayer, network/persistence, roadmaps/analytics, presentation or any Blackjack refactor.
- Acceptance: exact supplied rules/payouts, independent80 Banker-third decisions/8 standing branches/36 natural combinations,10,000 independent resolved cases, once-only accounting, deterministic replay, private shoe boundary, unchanged Blackjack and complete gate PASS0; documented/committed/normal origin/main push/CLEAN/live0/0/untracked0 before M13.
- Step -> verification: scoring/third-card resolver -> literal independent matrix and examples; immutable shoe/lifecycle/accounting -> inventory/determinism/atomic rejection/commit/void tests; replay -> reconstruction/tamper/digest checks; isolation/publication -> headless TypeScript, all preserved tests, unified gate, docs/privacy/diff and Git parity.
- Stop: conflicting authority, unknown overlapping changes, missing required tool, sensitive-data handling, unauthorized/destructive operation, repeated failure without new evidence or10 failed repairs. Fresh-session review NOT RUN; same-session review recorded separately. No M15/deployment.

## Punto Banco rules

A=1;2–9=face value;10/J/Q/K=0. Hand sum modulo10:7+8=5;K+9=9;A+4+8=3. Initial order Player1, Banker1, Player2, Banker2. If either initial total is8/9, neither draws. Otherwise Player0–5 draws,6–7 stands. If Player stands, Banker0–5 draws,6–7 stands. With a Player third card:

| Banker initial | Draw when Player third value is |
|---|---|
| 0–2 | Any0–9 |
| 3 | All except8 |
| 4 | 2–7 |
| 5 | 4–7 |
| 6 | 6–7 |
| 7 | Never |
| 8–9 | Natural; neither draws |

Final higher total wins; equal totals TIE. Player profit1:1; Banker profit0.95:1 after5% commission; Tie profit8:1. Player/Banker push on TIE. Gross returns include original stake:2x Player,1.95x Banker,9x Tie,1x push,0x loss. No side bets.

## Bounded money and shoe choices

These are explicit portfolio defaults where the owner left implementation choices open. Each target has an independent whole-credit stake1–1000; zero cancels that target. Simultaneous targets are allowed; total exposure must be funded atomically. Default local balance1000 credits. Baccarat units are integer hundredths (100 units=1 credit), independently of unchanged Blackjack half-credit units. Whole-credit stakes make5% commission exact, including1-credit stake ->1.95-credit gross. No rounding or floating-point accumulation; fractional-credit wagers rejected. Reserve reduces available; resolved returns are pending; explicit commit clears reserved/pending and adds the authoritative gross once. Integrity faults retain exposure for an explicit once-only VOID/refund and retire the affected shoe; they never become ordinary losses.

Eight decks contain416 unique physical cards. Cards are frozen; draw cursor never replaces consumed cards. No burn/cut protocol is added tonight. Before a round, fewer than six remaining cards creates a fresh deterministic shoe; no shuffle within a round. A separate seed/session and shoe ordinal drive existing game-neutral seeded shuffle functions; Blackjack instances/code stay unchanged. Type-only card primitives are reused; the six-deck inventory factory is not used. A validated full shoe ordering is a deterministic test seam, never a public browser setting.

## Approved bounded design

`src/baccarat` owns scoring/rules, inventory/shoe, immutable command transitions and replay. BETTING -> RESOLVED -> COMPLETE; INTEGRITY_ERROR -> explicit VOID -> COMPLETE. Request IDs reject duplicate intents; round IDs reject stale intents. New/Repeat rounds preserve balance and shoe; Repeat funds the complete prior wager set atomically. No animation data enters authority. Public state exposes only already-drawn faces/totals/decisions/results/accounting, never seed/future shoe/physical IDs.

Reuse existing unchanged `domain/random.ts` seeded primitive/shuffle and `domain/replay.ts` canonical outcome fingerprint. New independent instances and Baccarat-only data preserve game boundaries; no cross-game extraction. Replay records initial seed/configuration and accepted intents, reconstructs draws/decisions/outcomes/settlements, and verifies the outcome digest. Digest excludes clock, viewport, avatar, Dealer identity and motion; it is an engineering fingerprint, not a security or fairness certification. Timestamped public journal entries are observational; rejected intents do not mutate gameplay. New tests use explicit `casino-tests` discovery; existing historical tests/assertions remain untouched.

## Same-session review and replay boundary — 2026-10-07 02:41:48 +08:00

M12 same-session source/test/contract review: all round draw indices originate in the headless resolver; no third-card/payout authority in a browser/presentation module. Commission is exact for permitted whole-credit stakes; no rounding or floats accumulated. Rejections return identical State references and never draw; explicit commit and VOID are phase-guarded and once-only. Existing Blackjack domain/UI/browser/presentation/package/main/config diffs EMPTY relative to completed M11. Frozen type-only card and seeded/canonical primitives reused without extraction. Public projection removes seed/full inventory/physical IDs; digest excludes journal timestamps and all presentation identities. Independent expected matrix/scoring/counts do not call production rules. Explicit limitation: artificial externally corrupted-state fixtures are integrity diagnostics; their replay cannot verify against a valid initial seed/inventory and must be rejected, never treated as a normal loss or silently verified. Normal constructor states and seeded rollovers replay mechanically; no fault-injection UI is added. Same-session review PASS, genuinely fresh-session review NOT RUN.

## Verified checkpoint — 2026-10-07 02:55:00 +08:00

M12 IMPLEMENTED / VERIFIED; COMMIT/PUSH PENDING. Focused general/headless TypeScript, Lint and110tests PASS0; independent80 Banker-third/8standing/36natural/10000whole-round oracle PASS (51draw/29stand). Actual180-round multi-shoe replay/unique cards,80seedsx20accounting and24seedsx20replay PASS. Full unchanged verify.ps1 PASS/native0:106files/1355Vitest,250Chromium, independentM1–M8 preservation, typecheck/lint/domain/build/fixture guard. Eight-deck Punto Banco/card0–9/modulo10/naturals/explicit Banker table/Player and Banker pushes/Tie8:1/5% commission. Integer hundredth units and whole-credit1–1000 stakes; simultaneous atomic funding, pending return, once-only commit/refund, stale/duplicate rejection. Private deterministic shoe and journal/replay/outcome fingerprint exclude visuals/clocks; public future inventory/seed/physical IDs absent. Repairs2/10 (redundant initializer; retired-shoe recovery); all attempts retained. Same-session review PASS; fresh-session review NOT RUN. Blackjack protected268inputs plus exact Casino discovery/main boundaries PASS0. Final docs/privacy/publication pending; M13/M14 NOT STARTED, human visual PENDING; M15/multiplayer NOT STARTED/deployment NOT RUN.

[Native full receipt](CASINO_OVERNIGHT_EVIDENCE/m12/m12-unified.json); [independent execution counts](CASINO_OVERNIGHT_EVIDENCE/m12/independent-validator).

## Publication receipt — 2026-10-07 02:56:13 +08:00

M12 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED; primary commit 581c4a368a67b5cab70166f0d9064ea7f9ce941c normally pushed origin/main PASS0; observed local=tracking=live,CLEAN/untracked0/0/0 at 2026-10-07 02:56:13 +08:00. Full exact unchanged verify.ps11355Vitest/250Chromium/independentM1–M8 PASS/native0; focused110 + headless compile/Lint PASS0, literal independent80/8/36/10000 validator and actual multi-shoe replay PASS. Whole-credit stakes use integer hundredths for exact5% commission; no rounding. Once-only commit/refund, atomic independent targets, stale/duplicate rejection, private future shoe, deterministic command replay and timestamp/visual-free fingerprint verified. Protected268acceptedinputs/exact Casino discovery/main boundaries, final docs9 and privacy PASS0. Repairs2/10; all failed attempts retained. Same-session review PASS; fresh-session review NOT RUN. No UI/animation yet; M13/M14 NOT STARTED pending this documentation receipt normal publication and clean parity. Human visual PENDING; Blackjack ACCEPTED/CLOSED/FROZEN; M15/multiplayer NOT STARTED; deployment NOT RUN. This receipt records primary SHA; its own SHA is resolved by Git after normal push.
