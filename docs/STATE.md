# Casino Blackjack - Project State

## Current M8 batch (supersedes historical delivery below)

M7 HUMAN ACCEPTED at da6f068ffd27713848ed48f023c17ed388b8b44e: user explicitly stated "I accept M7." User-supplied genuinely fresh review reported no findings at any severity and review/harness/mappings/preservation/documentation PASS. This conversation did not perform that review.

Entry 2026-09-30 12:30:42 +08:00: main, HEAD=origin/main=accepted M7, 0/0, clean. Initial sandbox ownership read failed; owner-context retry PASS/0, no Git config change. M8-T01 VERIFIED / PUSHED 725855d36123122bda3280e4adc5c7aec9aa7940 (main, push/fetch/parity/clean PASS); T02 VERIFIED, repair 1/10 (58/892 Vitest, 24 Chromium, full harness PASS/0); T02 published 70e0e977e2448fd1a7a402797bcdce2a0365465e, push/fetch/0-0/clean PASS; whitespace repair 2 correction in T03. T03 VERIFIED, repair 1/10 (59/910 Vitest, 24 Chromium, full harness PASS/0); T04-T09 NOT STARTED. M8 fresh review NOT RUN; ACCEPTED NO; deployment NOT RUN.

Recommended every M8 task GPT Sol 6.1 / High; actual model and reasoning/effort NOT VERIFIED / NOT VERIFIED. Repair ledger T01-T09 0,2,1,0,0,0,0,0,0 (each /10); historical ledgers below unchanged. T01 profiles/uint32 source/vectors/shuffle/cut/secrecy tests PASS 7/7 and typecheck PASS/0; full harness evidence and publication in DEVELOPMENT_LOG. Charlie gameplay not activated until T02.

## Current delivery: M7 VERIFIED - fresh-session review gate

M1-M6 HUMAN ACCEPTED. M7-T01..T08 are VERIFIED / COMMITTED / PUSHED. T09 is VERIFIED (documentation only); normal checkpoint publication follows, with exact SHA/parity/clean recorded in final delivery and independently readable from Git. M7 fresh independent review **NOT RUN**, M7 ACCEPTED **NO**, M8 **NOT STARTED**, deployment **NOT RUN**. T09 must stop after verified publication for a genuinely fresh session.

Repository: C:\Users\user\Documents\GitHub\casino-blackjack. Remote: https://github.com/FrankieChan0312/casino-blackjack.git. Branch main. T09 baseline at 2026-09-30 11:52:22 +08:00: HEAD=origin/main=076d0d2a25c7d152e43c9b6d7c547e25e7609599, 0/0, clean (T08 publication at 11:51:45).

Recommended each M7 task: GPT Sol 6.1 / High. Actual model/reasoning: **NOT VERIFIED / NOT VERIFIED**. Runtime model labels were not independently confirmed; recommendations are not evidence.

## M6 acceptance and T01 recovery

User explicitly stated **"I accept M6."** at accepted revision 681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5. User-supplied genuinely fresh independent review reported NO FINDINGS, M6 requirements/REG-M6-001..095/M1-M5 preservation/documentation PASS. This conversation did not conduct that independent review. Acceptance was recorded with substantive T01 browser work, not a metadata-only commit.

Initial clean accepted-M6 entry 2026-09-30 10:08:15; re-entry 10:15:46 confirmed main=origin, 0/0, clean. T01 initially BLOCKED before modification: REG-M6-095 current-tree React/browser absence conflicted with authorized M7. No code changed before the user's explicit clarification. REG-095 now checks accepted-M6 Git objects for no React/browser TSX/JSX and M7 NOT STARTED; history is immutable. REG001..094 unchanged and exact 95-ID completeness retained. Current domain independence is separately compiled/tested. Clarification was not an M6 repair or M7 implementation repair.

T01 repair 1 fixed Vite CSS typings and project-aware full verification while preserving isolated historical three-check harness tests. Interruption occurred after edits; recovery at 10:27:42 inspected actual files before continuing, no blind replay and no extra repair. Every real-project required check remains mandatory and tested for failure propagation.

## Published checkpoints

All T01-T08 commits/pushes/fetches exited 0; each checkpoint was main=origin/main, 0/0, clean. Times on 2026-09-30 +08:00. Full counts are the executed checks at that checkpoint, not an acceptance claim.

| Task | Scope | Commit | Repairs | Full Vitest files/tests (+Chromium) | Published |
| --- | --- | --- | --- | --- | --- |
| M7-T01 | Browser shell | 1299ece6745584681fffec4646ee02fc160a8c63 | 1/10 | 50/830 | 10:36:31 |
| M7-T02 | Controller/public boundary | c4c065fa7192a9f318a3915e672bb4f52793e1a8 | 0/10 | 51/836 | 10:49:06 |
| M7-T03 | Table/seats/status | 275602a623c41ebb6481400d76ca856eeb92496e | 0/10 | 52/840 | 10:59:17 |
| M7-T04 | Betting/credits | 50480e705bb1768ce93f8c8b311da443ef12b640 | 1/10 | 53/848 | 11:06:01 |
| M7-T05 | Actions/multi-hand | 483c395754abd50b3e65e9170311cf928c9b0c4f | 0/10 | 54/858 | 11:10:23 |
| M7-T06 | Decisions/results/VOID | 903f907c114687cf8ccc58ef54274f609d698714 | 0/10 | 55/868 | 11:15:16 |
| M7-T07 | Accessibility/responsive | 50fb66d3d8ad69a12047f7d5351b9a961af94345 | 1/10 | 55/869 + 4 E2E | 11:27:35 |
| M7-T08 | Chromium/mapping/preservation | 076d0d2a25c7d152e43c9b6d7c547e25e7609599 | 2/10 | 56/870 + 24 E2E | 11:51:45 |
| M7-T09 | Documentation/fresh-review handoff | Resolve final SHA from delivery/Git after publication | 0/10 | PASS 56/870 + 24 E2E | Final delivery |

## Repair ledgers and evidence

- M7 T01-T09: **1,0,0,1,0,0,1,2,0** (each /10).
- M6: **1,0,0,0,0,0,1,0**.
- M5: **0,0,0,0,0,1,0**.
- M4: **1,0,1,0,0,0,1**.
- M3: **0,0,0,0,0,2**.
- M2: **1,0,0,0,1,1**.
- M1: **2,1,0,0,1,0,1,0,0,1**.

T04 repair 1 split an imprecise MAIN/BACK TypeScript union into separate discriminated members; no runtime rule change. T07 repair 1 added explicit readonly BehindGameState factory return typing. A sandbox E2E shutdown hang exited 1 after interruption; owner-context rerun exited 0, and the failed attempt is retained in DEVELOPMENT_LOG.

T08 repair 1: first Chromium run 23 PASS/1 FAIL exact getByLabel lookup (label also contained select options); explicit label/id associations for Your seat and Bet Behind target fixed it. Chromium accessible role name was already correct; the explicit labels make DOM lookup unambiguous. Targeted spectator rerun PASS/0. Repair 2: full harness Vitest/Chromium/build passed but lint failed Node console ambient; explicit node:console import fixed it. Final T08 full harness PASS/0, Vitest start 11:49:28: **56 files/870 tests**, **1 Chromium project/24 tests**, typecheck/lint/domain/build PASS. Diff/whitespace/status inspected at 11:50:22. No further repair.

## Actual architecture and UI

Domain -> safe browser controller projection -> React snapshot/components. Events -> controller -> authoritative domain command -> retained latest immutable state -> new public snapshot. Components never receive raw game state. Physical card IDs, future shoe order, original-card lineage and hidden dealer identity are excluded. Dealer total uses only public visible cards until reveal. AST imports and an ES2023/types-empty domain compile reject framework/DOM dependencies.

getAdvancedActionError shares existing advanced validation with handlers. getBehindInteraction supplies safe legal actions, decision eligibility/amounts, follow affordability, targets, owner/phase and next/advance availability. Wager queries reuse immutable non-drawing handlers and discard proposed state; no card/RNG probing. Rejections still leave authoritative state unchanged.

Seven seats, explicit You/Computer/Empty/Sitting Out, exact half-credit formatting, separated spendable/reserved/pending amounts, seated/spectator betting and Bet Behind, own side wagers, full local actions and ordered stable split labels, pre-peek Insurance/Even Money, follow ADD/NO ADD/non-control, four result groups, interruption/VOID/refund and next-round persistent-shoe messages are implemented. Continue table explicitly advances the unchanged computer/dealer policy; completed/faulted rounds automatically settle/refund through domain commands.

Semantic labels/buttons, focus/skip link/live status and explicit text indications support keyboard flow. Dark restrained CSS reflows seats 4/2/1 columns; desktop 1280x900, tablet 768x1024 and mobile 320x720 pass page overflow checks. Mobile primary actions precede the secondary table and primary buttons meet 44x44. Reduced-motion works because there is no animation; no sound.

## Executable mapping and historical preservation

[Exact mapping](M7_MAPPING.md): REG-M7-001..064 = 40 architecture/controller/component tests + 24 Chromium tests. UX-01..14 and E2E-01..15 each has exactly one tagged executable owner. TypeScript AST completeness verifies count/uniqueness/range and document rows. This is mechanical implementation evidence, not fresh independent review.

| Milestone | Accepted revision | Independent current-suite rerun | Test start (2026-09-30 +08:00) |
| --- | --- | --- | --- |
| M1 | d1d8966fe55af1bc2b9348e305135952b7723b70 | PASS/0 12 files /155 tests | 11:47:48 |
| M2 | c9f7f35bf874a0e7673505cbbea745ce035ac695 | PASS/0 6/78 | 11:47:54 |
| M3 | cca40d2bed3b3964a9bfb47329d49bb553fe610e | PASS/0 5/72 | 11:47:56 |
| M4 | a5c6a22dd833867a6a1eff357a7462bd06fe4e0b | PASS/0 7/171 | 11:47:57 |
| M5 | f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d | PASS/0 8/168 | 11:47:59 |
| M6 | 681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5 | PASS/0 9/181 | 11:48:01 |

verify-preservation.ps1 independently enumerates accepted incremental test sets and compares original test files with their own accepted revision. Only behindRegression's authorized historical 095 boundary differs; 001..094 registrations are checked unchanged and exact completeness executes. No prior gameplay/financial/secrecy/integrity assertion weakened.

## Tooling and deterministic seam

Node 24.19.0/npm 11.17.0 confirmed. React/React DOM/types 19.3.0, plugin-react 6.1.1; existing Vite 8.3.1 retained. Playwright 1.63.0 (test/playwright/core), Chromium 153.0.8010.12 revision 1243, local Windows browser cache. No prerequisite package upgraded and no large UI framework. Lockfile records exact transitive additions.

Production bootstrap creates the normal random M6 session. Dependency-injected factory and e2e-mode-only test import build controlled real-domain sessions; fixture order never becomes DOM/debug output. Full physical inventory is retained; VOID fixture injects accounted draw failure. Normal production build excludes fixture factories/query branch and checks exclusion automatically. No general seed/replay UI.

## T09 final execution evidence

At 2026-09-30 12:04:03 +08:00 final full harness completion inspected: PASS/0 typecheck, lint, Vitest **56/870** (start 12:03:05), domain isolation compile, production browser build (42 modules, fixture-exclusion PASS) and **1 Chromium project/24 tests** (zero retries). All 14 UX/64 REG/15 required scenario owners and M6 historical/completeness tests passed. Targeted document controls/relative links/exact package-lock versions/documentation-only scope PASS/0. Complete T09 diff inspected, including removed superseded STATE text preserved in log/Git. Only factual verification/status updates follow the harness; no executable changes. T09 repair **0/10**. Publication is the remaining normal authorized step; final own SHA cannot self-embed and is in delivery/Git. STOP at the fresh-session gate afterward.

## Known limits and next action

One local HUMAN, local memory only, refresh resets session. No accounts/server/database/multiplayer/cloud/real money/deployment. Normal COMPUTER policy is <17 HIT / >=17 STAND and declines optional choices; advanced follower windows require controlled domain fixtures, not changed policy/second HUMAN. Browser matrix is Chromium only. Keyboard/focus/names/ARIA secrecy and viewport checks are not formal WCAG certification or a full screen-reader audit. No M8 Charlie/replay/audit product.

After T09 final verification/publication, STOP. A genuinely fresh conversation must read [M7_REVIEW_HANDOFF](M7_REVIEW_HANDOFF.md), independently re-read final Git state and verify all specified boundaries/mappings/evidence. Findings FIRST, no reviewer edits without separate authorization. Do not mark ACCEPTED or start M8. Prior checkpoint history and failed attempts remain in DEVELOPMENT_LOG and Git.
