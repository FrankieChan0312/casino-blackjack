# Portfolio walkthrough

Casino Blackjack demonstrates TypeScript domain modelling, React/Vite integration, Vitest examples and invariants, and real Playwright Chromium checks. It uses simulated credits only. M1–M7 are HUMAN ACCEPTED; M8 awaits genuinely fresh independent review and human acceptance. No deployed service is claimed.

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

Current mechanical evidence: 66 Vitest files/952 tests, 38 Chromium tests, [92 exact M8 regression owners](M8_MAPPING.md), and accepted M1–M7 preservation. [STATE](STATE.md) and [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md) retain actual counts, timestamps, failures and checkpoint publication evidence.

## Honest boundaries

One local HUMAN, explicit Continue table, no persistence/network/multiplayer/authentication or real-money features. No RTP/house-edge calculation, RNG/fairness certification, optimal-strategy or production casino claim. Browser verification covers Chromium; accessibility checks do not constitute formal certification. Replay is a local engineering/demo mechanism, with terminal-only browser export and no automatic fault recovery.

A concise project description: "Built a TypeScript Blackjack domain engine and responsive React demo with deterministic command replay, public audit trails, and Vitest/Playwright verification. Used bounded repair loops, executable requirement mappings and fresh-session review gates to separate implementation evidence from acceptance."
