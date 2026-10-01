# Portfolio walkthrough

Casino Blackjack is a modern browser Blackjack demo with a responsive felt table, accessible keyboard controls and domain-backed actions. It demonstrates TypeScript domain modelling, React/Vite integration, Vitest examples/invariants and Playwright E2E. It uses simulated credits only. M1–M7 are HUMAN ACCEPTED.

Human manual feedback identified a visually boring dashboard. M8-T08 polish uses project-owned CSS for a table rail, horseshoe seats, local-hand priority, playing cards, chips, active/result markers and restrained reduced-motion-aware transitions. Gameplay rules remain in the domain. [Owner manual checklist](M8_VISUAL_CHECKLIST.md); visual acceptance is pending.

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

The polished screenshots replace the historical dashboard images. Portfolio screenshots disable CSS animation only for capture, use fixed audit UTC and real-domain deterministic commands; runtime motion and reduced-motion behavior are tested separately. The optional [320px mobile view](images/mobile-table.png) comes from the reduced-motion polish test. Same-session visual inspection checks public-only content and clipping; the owner judges game feel. Historical full-harness captures2026-10-01 01:11:11 +08:00 matched all4 repeats at01:14:15 (targeted6 Chromium PASS/0,9.1s). LOW-05 regeneration at11:35:47 changed Classic/Mobile to the hashes below; both were visually inspected. Charlie/Replay remained byte-identical. Targeted7 Chromium PASS/0; final full-harness repeat evidence is in STATE/log. Hashes prove byte reproducibility, not visual quality.

| Public image | SHA-256 |
| --- | --- |
| Classic | `B319E1B5A2731AB3EA1D647CC0E29ED5DB19E2EFC31D1D07280C2F226C67F584` |
| Charlie | `453383554002E4E9CCFF95F00E1AD85A5E76997DC0CA00E092B90E8F0F0CC90B` |
| Replay/Audit | `3D0EEC844087BE1E201F798FFF12BA4C9E551808D9CD45E63C16E23DC4CDDE51` |
| Mobile | `5BEC4DDC70B298480F473B876A728EBAD8998023E922F4ADF52D4612C247B9BF` |

Regenerate with `npm.cmd run test:e2e -- tests/browser/polish.spec.ts tests/browser/portfolio.spec.ts`; compare with `Get-FileHash -Algorithm SHA256 docs/images/*.png`.

Historical visual-polish harness PASS/0:66 Vitest files/956 tests and43 Chromium tests. Five semantic/layout polish checks covered desktop/mobile priority, complete Dealer visibility, closed secondary tools, selectable wager chips, split/Charlie markers, reduced motion and seven funded seats. LOW-05 adds a sixth geometric check; its current official harness PASS/0 inspected2026-10-01 11:43:28 +08:00 has66 Vitest files/956 tests and44 Chromium tests. [96 exact M8 regression owners](M8_MAPPING.md) and mandatory accepted M1–M7 preservation all PASS, including24 original M7 Chromium tests. [STATE](STATE.md) and [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md) retain actual checked counts, timestamps, failures and publication evidence. LOW-04/05 remain OPEN pending independent recheck; no acceptance is implied.

## Honest boundaries

One local HUMAN, explicit Continue table, no persistence/network/multiplayer/authentication or real-money features. No RTP/house-edge calculation, RNG/fairness certification, optimal-strategy or production casino claim. Browser verification covers Chromium; accessibility checks do not constitute formal certification. Replay is a local engineering/demo mechanism, with terminal-only browser export and no automatic fault recovery.

A concise project description: "Built a TypeScript Blackjack domain engine and responsive React demo with deterministic command replay, public audit trails, and Vitest/Playwright verification. Used bounded repair loops, executable requirement mappings and fresh-session review gates to separate implementation evidence from acceptance."
