# M7 fresh-session reviewer handoff

Review is **NOT RUN**. M7 is **NOT ACCEPTED**. M8 is **NOT STARTED**. Deployment is **NOT RUN**. This document supplies implementation evidence; it does not supply independent review findings.

## Revision and execution contract

Repository C:\Users\user\Documents\GitHub\casino-blackjack; GitHub https://github.com/FrankieChan0312/casino-blackjack; authorized branch main. Accepted-M6 starting revision 681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5. T08 baseline HEAD=origin/main=076d0d2a25c7d152e43c9b6d7c547e25e7609599, 0/0, clean at 2026-09-30 11:51:45 +08:00. T09 final SHA cannot embed itself in its own commit: use the **final delivery message's exact HEAD/origin SHA**, then independently capture Get-Date, branch, HEAD, origin/main, ahead/behind and full status. The final checkpoint title is `docs: prepare M7 verification and review package`; all final facts must be re-read from Git rather than inferred from this document.

Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. M6 HUMAN ACCEPTED by explicit user "I accept M6." after user-supplied genuinely fresh NO FINDINGS review. No new M6 independent review claimed here.

All T01-T08 VERIFIED/COMMITTED/PUSHED/fetched with exit 0, 0/0 and clean. T09 documentation and final complete harness are VERIFIED; normal publication follows, recorded with exact SHA/parity/clean in final delivery/Git. Final delivery records its exact SHA/verification. T09 has no feature changes.

| Task | Scope | Commit | Repairs | Full tests at checkpoint | Published (2026-09-30 +08:00) |
| --- | --- | --- | --- | --- | --- |
| M7-T01 | Browser shell | 1299ece6745584681fffec4646ee02fc160a8c63 | 1/10 | 50/830 | 10:36:31 |
| M7-T02 | Controller/public boundary | c4c065fa7192a9f318a3915e672bb4f52793e1a8 | 0/10 | 51/836 | 10:49:06 |
| M7-T03 | Table/seats/status | 275602a623c41ebb6481400d76ca856eeb92496e | 0/10 | 52/840 | 10:59:17 |
| M7-T04 | Betting/credits | 50480e705bb1768ce93f8c8b311da443ef12b640 | 1/10 | 53/848 | 11:06:01 |
| M7-T05 | Actions/multi-hand | 483c395754abd50b3e65e9170311cf928c9b0c4f | 0/10 | 54/858 | 11:10:23 |
| M7-T06 | Decisions/results/VOID | 903f907c114687cf8ccc58ef54274f609d698714 | 0/10 | 55/868 | 11:15:16 |
| M7-T07 | Accessibility/responsive | 50fb66d3d8ad69a12047f7d5351b9a961af94345 | 1/10 | 55/869 + 4 E2E | 11:27:35 |
| M7-T08 | Chromium/mapping/preservation | 076d0d2a25c7d152e43c9b6d7c547e25e7609599 | 2/10 | 56/870 + 24 E2E | 11:51:45 |
| M7-T09 | Documentation/final validation | Final delivery SHA | 0/10 | PASS 56/870 +24 E2E | Final delivery |

- M7 T01-T09: **1,0,0,1,0,0,1,2,0** (each /10).
- M6: **1,0,0,0,0,0,1,0**.
- M5: **0,0,0,0,0,1,0**.
- M4: **1,0,1,0,0,0,1**.
- M3: **0,0,0,0,0,2**.
- M2: **1,0,0,0,1,1**.
- M1: **2,1,0,0,1,0,1,0,0,1**.

T01 conflict resolution was a user-authorized milestone contract clarification, not M6 repair. T01 conversation interruption did not increment repair count. Detailed failures/hypotheses/targeted corrections remain in DEVELOPMENT_LOG.

## Exact dependencies and files

Added direct dependencies: react 19.3.0, react-dom 19.3.0. Added dev dependencies: @types/react 19.3.0, @types/react-dom 19.3.0, @vitejs/plugin-react 6.1.1, @playwright/test 1.63.0. Existing Vite **8.3.1** preserved. Lockfile pins playwright/playwright-core 1.63.0 and exact transitive additions; no prerequisite package upgrades. Node 24.19.0/npm 11.17.0. Chromium Chrome for Testing and headless shell **153.0.8010.12**, revision **1243**, installed locally under C:\Users\user\AppData\Local\ms-playwright. Tests use the headless Chromium project; no paid browser service.

Exact executable/source/UI/test/config inventory versus accepted M6 (A added, M modified), together with documents changed through T08:

```text
M	.gitignore
M	README.md
M	docs/DEVELOPMENT_LOG.md
A	docs/M7_MAPPING.md
M	docs/PLAN.md
M	docs/STATE.md
M	eslint.config.mjs
A	index.html
M	package-lock.json
M	package.json
A	playwright.config.ts
A	scripts/check-browser-build.mjs
A	scripts/verify-preservation.ps1
M	scripts/verify.ps1
A	src/browser/controller.ts
M	src/domain/advancedGame.ts
M	src/domain/behindGame.ts
A	src/main.tsx
A	src/ui/Actions.tsx
A	src/ui/App.tsx
A	src/ui/Betting.tsx
A	src/ui/Decisions.tsx
A	src/ui/Table.tsx
A	src/ui/presentation.ts
A	src/ui/styles.css
A	tests/browser/accessibility.spec.ts
A	tests/browser/fixtures.ts
A	tests/browser/gameplay.spec.ts
M	tests/integration/behindRegression.test.ts
A	tests/integration/browserController.test.ts
A	tests/unit/browserActions.test.tsx
A	tests/unit/browserBetting.test.tsx
A	tests/unit/browserDecisions.test.tsx
A	tests/unit/browserHarness.test.ts
A	tests/unit/browserRegression.test.ts
A	tests/unit/browserShell.test.tsx
A	tests/unit/browserTable.test.tsx
A	tests/unit/domainBoundary.test.ts
A	tsconfig.domain.json
M	tsconfig.json
A	vite.config.ts
```

T09 additionally updates README, DESIGN, PLAN, STATE, DEVELOPMENT_LOG, LAB_MANUAL, factual UX_UI status, and adds this review handoff. RULES/SPEC and accepted history unchanged. Inspect the complete cumulative diff plus documentation-only T08..T09 diff. advancedGame changes extract shared existing action validation; behindGame changes add safe read-only interaction/wager/result queries. Only historical REG-M6-095 is changed among accepted regression registrations.

## Mechanically executed evidence

T08 final full verify.ps1 PASS/0, Vitest start 2026-09-30 11:49:28 +08:00: typecheck/lint/**56 Vitest files/870 tests**/ES2023-only domain compile/production Vite build (42 modules)/fixture-exclusion check/**1 Chromium project/24 tests**. No retries; local Vite e2e server. T09 final complete harness **PASS/0**, Vitest start **2026-09-30 12:03:05 +08:00**, completion inspected **12:04:03**: typecheck/lint/56 files-870 tests/domain compile/42-module production build with fixture exclusion/1 Chromium project-24 tests, all PASS. Document controls/links/version/scope checks PASS/0. Only factual document evidence updates followed; no executable change. T09 repair 0/10. Final delivery supplies publication SHA/parity/clean.

| Milestone | Accepted revision | Independent current-suite rerun | Test start (2026-09-30 +08:00) |
| --- | --- | --- | --- |
| M1 | d1d8966fe55af1bc2b9348e305135952b7723b70 | PASS/0 12 files /155 tests | 11:47:48 |
| M2 | c9f7f35bf874a0e7673505cbbea745ce035ac695 | PASS/0 6/78 | 11:47:54 |
| M3 | cca40d2bed3b3964a9bfb47329d49bb553fe610e | PASS/0 5/72 | 11:47:56 |
| M4 | a5c6a22dd833867a6a1eff357a7462bd06fe4e0b | PASS/0 7/171 | 11:47:57 |
| M5 | f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d | PASS/0 8/168 | 11:47:59 |
| M6 | 681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5 | PASS/0 9/181 | 11:48:01 |

Run verify-preservation.ps1 again independently. It selects each accepted revision's newly introduced suites, compares tests against their own baseline and checks unchanged REG-M6-001..094 registrations. The full M6 suite retains 181 tests, with exact 95 unique regression IDs. REG-M6-095 reads accepted-M6 Git objects for no React, no browser TSX/JSX and M7 NOT STARTED. It no longer prohibits authorized current M7 files.

## Unique executable mappings

[Full REG-M7 mapping](M7_MAPPING.md) contains every exact test file/title. Completeness is an executable AST test, not a document-only checklist. REG-M7-001..064 contains 40 Vitest architecture/controller/component checks and 24 real Chromium checks, no missing/duplicate IDs. All historical REG ranges remain executable.

| UX ID | Exact REG owner | Evidence |
| --- | --- | --- |
| UX-01 | REG-M7-009 | Seven seats / You / Computer / Empty |
| UX-02 | REG-M7-021 | Shared legal-action availability |
| UX-03 | REG-M7-007 | Illegal direct command rejected |
| UX-04 | REG-M7-046 | Known hidden card absent from DOM/text/attributes/ARIA until reveal |
| UX-05 | REG-M7-012 | Readable state transitions |
| UX-06 | REG-M7-047 | Terminal gameplay controls absent |
| UX-07 | REG-M7-017 | Available/reserved/pending and exact .5 |
| UX-08 | REG-M7-048 | Insufficient Double disabled with reason |
| UX-09 | REG-M7-049 | Ordered split identity and next hand |
| UX-10 | REG-M7-053 | One bust while another active |
| UX-11 | REG-M7-041 | Keyboard-only full primary flow/focus |
| UX-12 | REG-M7-043 | 320px primary layout/touch/no overflow |
| UX-13 | REG-M7-037 | Four independent wager result regions |
| UX-14 | REG-M7-002 | Non-redeemable simulated-credit disclosure |

| Required scenario | Chromium REG owner | Result at T08 |
| --- | --- | --- |
| 1 Hit/Stand full flow | 045 | PASS |
| 2 Hole hidden until reveal | 046 | PASS |
| 3 Terminal protection | 047 | PASS |
| 4 Insufficient Double | 048 | PASS |
| 5 Split and correct order | 049 | PASS |
| 6 Split Aces restrictions | 050 | PASS |
| 7 Surrender half return | 051 | PASS |
| 8 Ace Insurance/Even Money | 052 | PASS |
| 9 One bust/other active | 053 | PASS |
| 10 Independent side result | 054 | PASS |
| 11 Follower no control | 055 | PASS |
| 12 Keyboard primary workflow | 041 | PASS |
| 13 Narrow mobile | 043 | PASS |
| 14 CLASSIC no five-card Charlie | 056 | PASS |
| 15 Integrity interruption/VOID | 057 | PASS |

Additional real Chromium tests: desktop/tablet overflow/touch 042, reduced-motion/ARIA 044, controlled Double ADD 058, Split NO ADD first-child 059, unfunded follow 060, Insurance timing/funding 061, next-round funds/persistent shoe 062, spectator setup/Bet Behind 063, re-split stable order/completed leaves 064.

## Boundaries and limitations to verify

Controller closure alone retains raw M6 state. Explicit projection/public domain view supplies React, with no raw shoe/physical IDs/original-card lineage/hidden dealer identity. Action queries share handler validation; non-drawing wager queries discard immutable proposed states without RNG/card consumption. Direct handlers enforce legal timing/funding/terminal conditions. Normal production bootstrap is random and the production build strips the e2e import/query branch and named fixtures.

Controlled browser fixtures retain all 312 physical cards and use accepted configure/fund/deal/decision/action transitions. Advanced follower windows call real owner-checked production controller primitives; they do not substitute fake UI rules or alter normal COMPUTER policy. VOID injection preserves physical accounting then forces a real required draw failure. No player-facing fixture/debug/replay feature is included in normal production.

One HUMAN, local memory, explicit computer wager setup and Continue table. Refresh resets session; no save/load. Computers <17 HIT / >=17 STAND, decline optional choices, never naturally start advanced follow windows. Browser matrix only Chromium. Native keyboard, focus, labels, live status, role snapshots and secret-free metadata are tested; no claim of full screen-reader or WCAG certification. Desktop1280x900/tablet768x1024/mobile320x720 no horizontal overflow; mobile primary buttons >=44x44. No animation or sound. No M8/Charlie/replay/audit product/server/auth/database/network multiplayer/deployment.

## Required genuinely fresh review

Report findings FIRST, with severity, file/line, violated requirement, evidence and impact. Do not edit without separate authorization. Independently verify:

1. React does not own or duplicate domain enforcement.
2. Hidden dealer identity is absent from player-facing DOM/text/all attributes/accessible output before reveal.
3. Only legal actions are enabled using safe queries.
4. Illegal direct domain calls still reject unchanged.
5. Available/reserved/pending credits are distinct and .5 amounts exact.
6. Split/re-split identity/order/wagers/results match the engine.
7. Insurance/Even Money precede peek and disappear afterward.
8. Bet Behind never implies follower card control.
9. Controlled follower fixtures use real production domain logic without changing bot policy.
10. Integrity interruption/VOID/refund is not a normal loss/winner.
11. Keyboard primary flow and visible focus work.
12. 320px mobile has no primary/page horizontal overflow.
13. UX-01..14 mapping is complete/unique and executable.
14. All 15 planned E2E scenarios genuinely execute.
15. REG-M7 range is exact/unique, with meaningful assertions.
16. M1-M6 regression preservation and authorized REG-M6-095 semantics pass independently.
17. Documentation matches code, commands, versions, counts, results and limitations.
18. No M8 implementation or deployment was introduced.

Read AGENTS/SKILL/RULES/SPEC/DESIGN/UX_UI/PLAN/STATE/log/LAB/README/package/verify and relevant code, then run the harness, mappings and preservation with checked exits. Inspect production fixture exclusion and fresh secrecy/keyboard/mobile evidence. A passing implementation-session run is not independent review or human acceptance. Stop after the findings-first review; acceptance belongs to the user.
