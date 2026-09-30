# Portfolio walkthrough

Casino Blackjack demonstrates TypeScript domain modelling, React/Vite integration, Vitest examples and invariants, and real Playwright Chromium checks. It uses simulated credits only. M1–M7 are HUMAN ACCEPTED.

## Current M8 review status

Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666 (3 MEDIUM / 3 LOW).
Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781.
Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781 (0 BLOCKER / 0 HIGH / 1 MEDIUM / 1 LOW).
CLOSED BY RECHECK: MEDIUM-01, MEDIUM-02, MEDIUM-03, LOW-01, LOW-02.
MEDIUM-04: OPEN — repair VERIFIED; independent recheck #2 pending.
LOW-03: OPEN — repair VERIFIED; independent recheck #2 pending.
Repair batch 2: VERIFIED; publication receipt in final delivery/Git; independent recheck #2 pending.
M8 NOT ACCEPTED. Deployment NOT RUN.

## Five-minute technical walkthrough

1. Show the [Classic table](images/classic-table.png): explain why the controller returns public cards and legal interactions instead of exposing internal state.
2. Walk through an accepted command in `src/domain/advancedGame.ts`: validation, immutable transition, actual reserved stake and eventual result. Invalid commands preserve gameplay state.
3. Show `src/domain/profile.ts`: only profile identity and Charlie flag vary; fixed rules stay fixed. Explain bust/Natural/VOID precedence and independent split-child/follower stakes.
4. Reproduce README's seed-21 Charlie round. Compare final results with Replay mode and explain real-command replay, strict versioning and canonical timestamp-free digest.
5. Show public audit sequence/UTC/actor attribution, then the secret-exclusion tests. Audit observes outcomes; it does not drive or persist gameplay.
6. Run the full harness: explicit examples, 256 seeded invariant scenarios, unique regression mappings and independently selected historical preservation suites.

## Decisions worth discussing

- **Domain boundaries:** immutable returned states avoid stale-state replacement; wrappers preserve optional/follower funding and decision timing. Framework-free compilation keeps engine/UI dependencies separate.
- **Determinism:** `MULBERRY32_REJECTION_V1` uses documented integer operations, uint32 seeds and known vectors. The seed initializes private generator state; normal public snapshots expose neither.
- **Replay integrity:** accepted ordered intents use authoritative handlers, not arbitrary internal snapshots. Replay version 1 rejects unsupported/malformed commands with sequence attribution. FNV-1a is a reproducibility fingerprint, not a security signature.
- **Audit attribution:** sequence is authoritative; UTC timestamps are injected for tests and may be identical. Primitive frozen events preserve previous rounds and exclude hidden cards/IDs/shoe/seed.
- **Verification:** Harness Engineering combines required exit propagation, concrete evidence, at most ten repair cycles per task and separate VERIFIED/ACCEPTED states. Fresh-session independent review is a required gate, not a claimed result of implementation testing.

## Demonstration evidence

[Charlie result](images/charlie-result.png) and [replay/audit](images/replay-audit.png) are reproducible screenshots from `tests/browser/portfolio.spec.ts`, with fixed audit time and controlled real-domain commands. They contain public UI only; test factories are excluded from normal production builds. Screenshots are demonstration fixtures, not randomness/fairness evidence.

Review repair regeneration runs the same three-image workflow. Classic and Charlie remain byte-identical because their audit/settings panels are collapsed; Replay/Audit now shows pre-round seat/occupancy correctly. Repeated generation on 2026-09-30 matched these SHA-256 values; equality proves reproducibility only. All three images were visually inspected: no private paths, hidden card state, physical card IDs or proprietary casino artwork.

| Public image | SHA-256 |
| --- | --- |
| Classic | `0176BC5146D8E35554886B0245334F3B73368DD2A845E7436E3176F410572394` |
| Charlie | `5FC9E2A852C90DF27DD986748B3E8E5146A95F2A7532CBCD877324FD4598DCE7` |
| Replay/Audit | `6B07924F1D413170282EFF8D82EB0D73367ED09B9159F9D937A2F22B35B9D892` |

Regenerate with `npm.cmd run test:e2e -- tests/browser/portfolio.spec.ts`; compare with `Get-FileHash -Algorithm SHA256 docs/images/*.png`.

Expanded current inventory: 66 Vitest files/956 tests, 38 Chromium tests, [96 exact M8 regression owners](M8_MAPPING.md), and accepted M1–M7 preservation. [STATE](STATE.md) and [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md) retain actual checked execution status, counts, timestamps, failures and checkpoint publication evidence.

## Honest boundaries

One local HUMAN, explicit Continue table, no persistence/network/multiplayer/authentication or real-money features. No RTP/house-edge calculation, RNG/fairness certification, optimal-strategy or production casino claim. Browser verification covers Chromium; accessibility checks do not constitute formal certification. Replay is a local engineering/demo mechanism, with terminal-only browser export and no automatic fault recovery.

A concise project description: "Built a TypeScript Blackjack domain engine and responsive React demo with deterministic command replay, public audit trails, and Vitest/Playwright verification. Used bounded repair loops, executable requirement mappings and fresh-session review gates to separate implementation evidence from acceptance."
