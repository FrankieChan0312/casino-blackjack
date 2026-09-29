# Casino Blackjack — Project State

## Current M5 execution (supersedes historical M4 handoff below)

Entry 2026-09-29 21:19:38 +08:00: main, HEAD=origin/main=a5c6a22dd833867a6a1eff357a7462bd06fe4e0b, ahead/behind 0/0, clean. Git owner-account read succeeded after sandbox ownership rejection; no Git configuration change. Baseline full verify.ps1 PASS/0, 30 files / 476 tests (21:21:14 test start).

M4 HUMAN ACCEPTED by the M5 user contract at that exact SHA. Reported fresh review: NO FINDINGS; requirements PASS; REG-M4-001..060 PASS; M1-M3 preservation PASS; documentation PASS. Recorded together with substantive M5-T01 implementation, not a metadata-only acceptance commit.

M5-T01 VERIFIED locally: optionalGame.ts adds own-seat main/side reservation commands; optionalFixture.ts and optionalBetting.test.ts verify boundaries, available-only delta funding, cascade cancellation, freeze and absence of automatic wagers. No evaluation/Insurance/Even Money/settlement yet. T02-T07 NOT STARTED. M5 fresh review NOT RUN; M5 NOT ACCEPTED; M6 NOT STARTED. Publication NOT RUN pending authorization.

Recommended model/effort GPT-6 Astra / High; actual NOT VERIFIED / NOT VERIFIED. M5 ledger T01-T07: 0,0,0,0,0,0,0. Preserved M4: 1,0,1,0,0,0,1; M3: 0,0,0,0,0,2; M2: 1,0,0,0,1,1; M1: 2,1,0,0,1,0,1,0,0,1 (each /10).

## Current truth: M4 review package

M1 is ACCEPTED at d1d8966fe55af1bc2b9348e305135952b7723b70; M2 is ACCEPTED at c9f7f35bf874a0e7673505cbbea745ce035ac695. The user explicitly HUMAN ACCEPTED M3 at **cca40d2bed3b3964a9bfb47329d49bb553fe610e**, after M3-T06 review repair 2. That acceptance was recorded with substantive M4-T01, not a metadata-only commit.

Historical accuracy: the independent review of M3 d0d0a08 found one LOW stale LAB sentence; repair 2 corrected it at cca40d2. No post-repair independent-review conclusion or reviewer finding closure is recorded or claimed. Explicit human acceptance and independent reviewer recheck are separate events. Original M3 records/mapping remain in Git at cca40d2 and the unchanged historical DEVELOPMENT_LOG.

M4 T01..T06 are IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. T07 is the IMPLEMENTED / VERIFIED documentation-only handoff, awaiting its authorized publication. **M4 and its tasks are NOT ACCEPTED. M4 independent fresh-session review: NOT RUN. M5: NOT STARTED. Deployment: NOT RUN.** No review is being performed by another agent in this implementation conversation.

Authorized repository: C:\Users\user\Documents\GitHub\casino-blackjack. Remote: https://github.com/FrankieChan0312/casino-blackjack.git. Branch: main. Entry 2026-09-29 09:27:18 +08:00: HEAD=origin/main=cca40d2bed3b3964a9bfb47329d49bb553fe610e, ahead/behind 0/0, clean; fetch at 09:31:15 confirmed it. No unknown user changes.

Recommended model / effort: GPT-6 Astra / High. Actual runtime model / effort: **NOT VERIFIED / NOT VERIFIED**. Client setting evidence is unavailable; model choice is not validation.

## Checkpoints and repair ledgers

Every published checkpoint below passed its required full harness, complete task diff/whitespace review, normal commit/push and fetch/parity/clean checks. Dates are 2026-09-29, timezone +08:00.

| Task | Repairs | Commit | Full harness files/tests | Push/parity evidence |
| --- | --- | --- | --- | --- |
| M4-T01 | 1/10 | cd2d8ccb87d4389e39348c43ed7e2d0e7adf50fb | PASS 24/312 | 18:57:14; 0/0 clean |
| M4-T02 | 0/10 | fbae61cf248492c18dbd0e7a47902b6495eea14f | PASS 25/327 | 19:01:17; 0/0 clean |
| M4-T03 | 1/10 | 5b4df25519011b0745676c19b8fb782743c87f5d | PASS 26/361 | 19:07:11; 0/0 clean |
| M4-T04 | 0/10 | b1194483fb67b8f73459d0b6092be0d0da4baf09 | PASS 27/371 | 19:13:36; 0/0 clean |
| M4-T05 | 0/10 | dcf307633a7a28ec50b0302281f497426534bbec | PASS 28/399 | 19:19:05; 0/0 clean |
| M4-T06 | 0/10 | 6c20d6938250d88085bbcabeb2f29637a26c2607 | PASS 30/476 | 19:43:23; 0/0 clean |
| M4-T07 | 1/10 | Final commit subject: docs: prepare M4 verification and review package | PASS 30/476 at 20:15:05 | Publication pending; actual result in final delivery |

T01 repair 1 corrected a failed documentation patch context; no gameplay repair. T03 repair 1 fixed lint no-unexpected-multiline in a new parameterized test; the first test run had already passed. T07 repair 1 corrects the recovered STATE heading's encoding substitution (an em dash became a question mark); the interruption itself is not a repair. No observed gameplay regression failure was repaired. Failed attempts and timestamps remain in DEVELOPMENT_LOG.

Preserved prior ledgers, each entry /10:

- M3 T01..T06: **0,0,0,0,0,2**
- M2 T01..T06: **1,0,0,0,1,1**
- M1 T01..T10: **2,1,0,0,1,0,1,0,0,1**

T07's own hash cannot be embedded in its own commit. Its actual final HEAD/origin/main/push/parity result belongs in the delivery report and Git history, without a recursive metadata-only commit. The immediate parent is 6c20d6938250d88085bbcabeb2f29637a26c2607. Review must resolve the final documentation commit and compare it with the delivered full SHA before proceeding.

Recovery at 20:11:38 confirmed Case A: main=origin/main=6c20d693..., 0/0, exactly README and STATE documentation edits, no staged work or executable edits, and no local T07 commit. Fetch confirmed the same remote HEAD. Those edits were retained, and only unfinished T07 documentation was completed. T01-T06 were not reimplemented or separately rerun; the required final full harness was executed. Heading repair recheck passed U+2014 inspection. Interruption/reconnection adds no repair. Current M4 ledger: **1,0,1,0,0,0,1**.

## Executed evidence

| Check | Status | Evidence |
| --- | --- | --- |
| Entry baseline harness | PASS | 09:32:10 test start; 23 files / 305 tests, exit 0 |
| M4-T06 full harness | PASS | Launched 19:30:10; typecheck/lint; test start 19:30:16; 30 files / 476 tests, exit 0 |
| M4-T07 final full harness | PASS | Launched 20:15:05; typecheck/lint; test start 20:15:11; 30 files / 476 tests, exit 0 |
| T07 scope/whitespace/executable preservation | PASS | 20:15:27; diff --check and status; exactly six documents; diff --exit-code 6c20d693... -- src tests scripts package.json package-lock.json, exit 0 |
| Executable M4 REG-M4-001..060 plus completeness | PASS | All 60 scenarios and exact unique ID coverage executed |
| Separate original M1 suite | PASS | 19:31:03; 12 files / 155 tests, exit 0 |
| Separate M2-only original suite | PASS | 19:31:07; 6 files / 78 tests, exit 0 |
| Separate M3-only original suite | PASS | 19:31:09; 5 files / 72 tests, exit 0 |
| M1/M2 original tests/helpers | PASS | 19:31:02; git ls-tree at accepted SHAs, git diff --exit-code on original paths, no changes |
| All original M3 executable/config paths | PASS | Same comparison at cca40d2: src, tests, scripts, package.json, package-lock.json, tsconfig.json, eslint.config.mjs; unchanged |
| M4 fresh-session independent review | NOT RUN | Must use a genuinely new Codex conversation |
| M4 human acceptance | NOT RUN | Not granted by this implementation contract |
| Browser/E2E | NOT APPLICABLE | No UI |
| Clean-machine npm ci and cross-platform portability | NOT RUN | Existing Windows toolchain, no new dependencies |
| Deployment | NOT RUN | Outside authorization |

Separate baseline suite runs are same-session mechanical preservation evidence, not fresh independent review. M4 adds seven suites / 171 tests to the unchanged 23 suites / 305 tests. No assertions or harness checks were weakened. The unchanged verify.ps1 final label still says M1; test discovery includes M1-M4.

## Implemented financial and sequencing contract

- Additive M4 orchestration preserves M1-M3 APIs. One current round owns ordered leaf hands with stable root/parent IDs, original-card context, origin, stake, decision completion and result.
- Finish all leaves of the current seat first. Split replaces the parent in place; first child's next card and complete play precede dealing the second child's next card. Re-split preserves depth-first order.
- Matching additional funding uses available funds only, exact equality allowed. Rejection preserves the input reference, available/reserved funds, cards/shoe/RNG, current seat/hand and phase.
- Double: first decision, two cards, total below 21, HUMAN and not restricted Aces; matching reserve, doubled stake, exactly one card to that hand and forced decision completion. Non-Ace DAS allowed. Main-wager maximum does not cap doubled exposure.
- Split: equal Blackjack value (any ten-valued ranks), matching reserve, no parent settlement. Non-Ace re-split stops at four leaves including completed/busted leaves. Split Aces once, two ordered one-card additions, no further decisions or re-split.
- Split A+K is ordinary 21. Decision completion does not itself imply a known financial outcome; ordinary Split-Ace totals still require dealer comparison.
- Late Surrender: original unsplit non-Natural two-card first decision, dealer Natural excluded by 2..9 upcard or negative Ace/ten peek. No Insurance window. No draw/additional reserve; gross=half original even-unit stake.
- Per-leaf settlement uses full doubled stake and records round/seat/hand/stake/outcome/gross/net/status. All gross returns remain pending until one reconciled table commit. Parent plus child double counting is impossible in leaf iteration.
- Required-draw failure clears normal results, retires shoe and keeps diagnostics. VOID reconciles/refunds every actual reservation once, including advanced exposure, with zero net. Rejected funding creates no refundable exposure.
- COMPUTER policy remains evaluated total <17 HIT / >=17 STAND only. Shared dealer S17, no draw when all outcomes are already determined.
- Public projection groups hands by seat and excludes physical identity, internal original-card snapshots, shoe/cut and hidden dealer data.

## Exact M4 source/test change inventory

Against accepted M3 cca40d2, these executable paths are additions only:

- src/domain/advancedGame.ts
- src/domain/advancedPublicView.ts
- tests/helpers/advancedFixture.ts
- tests/integration/advancedFoundation.test.ts
- tests/integration/advancedDouble.test.ts
- tests/integration/advancedSplit.test.ts
- tests/integration/advancedResplit.test.ts
- tests/integration/advancedSettlement.test.ts
- tests/integration/advancedRegression.test.ts
- tests/integration/advancedIntegrity.test.ts

Documentation changes: README.md, docs/DESIGN.md, docs/PLAN.md, docs/STATE.md, docs/DEVELOPMENT_LOG.md, docs/LAB_MANUAL.md. RULES, SPEC, UX_UI, accepted sources/tests/helpers, harness, dependencies and runtime settings are unchanged. T07 itself changes only those six documentation files.

## Known limitations

Local in-memory library only; callers retain the latest state. Old snapshots can branch computation, and arbitrary corrupt caller objects are not a validated import format. No persistence, network concurrency protection, authentication, account transfer, event store or reset API. No UI, optimal bot, production gambling security claim, real money or deployment. Insurance, Even Money, Pair/three-card side bets, Bet Behind, Charlie and all M5+ features remain unimplemented. No unresolved mechanical verification failure is known; independent review has not yet assessed M4.

## Mandatory M4 fresh-session review handoff

STOP after T07 publication. Do not review independently in this implementation conversation, mark any M4 task ACCEPTED, start M5, merge, release or deploy.

In a genuinely new Codex conversation:

1. Read AGENTS, SKILL, RULES, SPEC, DESIGN, PLAN, STATE, DEVELOPMENT_LOG, README and LAB plus the user's full M4 contract. Review R07/R10/R11/R12/R13/R17 and the M4 boundary independently.
2. Capture timestamp, main branch, HEAD, origin/main, ahead/behind and full status; fetch the authorized remote. Require the delivered final SHA, 0/0 and clean. Report any mismatch before affected work.
3. Inspect the complete baseline-to-final diff: git diff cca40d2bed3b3964a9bfb47329d49bb553fe610e..HEAD. Inspect each source/test listed above, test oracles, mapping and actual logs; model confidence or counts alone are not proof.
4. Run powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1 and check exit code. Independently rerun original M1/M2/M3 suites from their historical file lists and compare original paths, preserving all prior tests. Expected current observed count: 30 files / 476 tests.
5. Inspect every REG-M4-001..060 executable case below and additional fault boundaries. Pay particular attention to depth-first physical card order, matching available-only funding, Natural suppression, completed leaf cap, pending money, once-only actual-exposure VOID and hidden data.
6. Report findings first, severity + file/line + concrete evidence + impact, then verification and open limitations. Distinguish the historical M3 review from its explicit human acceptance. Do not invent a repaired-HEAD reviewer conclusion.
7. Make no edits without separate authorization. Leave M4 acceptance to the human; report NOT RUN/BLOCKED accurately when relevant.

## M4 executable regression mapping

All rows execute in tests/integration/advancedRegression.test.ts as REG-M4-NNN (zero-padded ID). Each ID runs actual gameplay/funding assertions. A separate test rejects missing/duplicate IDs. T06 full harness PASS: 60 mapped cases plus mapping integrity, with additional detailed foundation/Double/Split/re-split/settlement/integrity suites. These results do not imply independent review or acceptance.

| ID | Contract case |
| --- | --- |
| 001 | Original Double legal |
| 002 | Double exact funds |
| 003 | Double insufficient funds |
| 004 | Double after Hit rejects |
| 005 | Double on 21 rejects |
| 006 | Double draws exactly one card for that hand |
| 007 | Doubled settling stake |
| 008 | Doubled win |
| 009 | Doubled loss |
| 010 | Doubled push |
| 011 | DAS |
| 012 | Split-Aces Double rejects |
| 013 | 10/K Split |
| 014 | J/Q Split |
| 015 | Normal pair Split |
| 016 | Unequal Split rejects |
| 017 | Split exact funds |
| 018 | Split insufficient funds |
| 019 | First-child physical ownership |
| 020 | Second-child physical ownership |
| 021 | Depth-first child play |
| 022 | Split Natural suppression |
| 023 | Re-split |
| 024 | Four-leaf maximum |
| 025 | Fifth-leaf rejection despite funds |
| 026 | Finished leaf counts toward cap |
| 027 | Busted leaf counts toward cap |
| 028 | Re-split insufficient funds below cap |
| 029 | Split Aces exactly one added card per child |
| 030 | Split Aces no Hit |
| 031 | Split Aces no Double |
| 032 | Split Aces no Surrender |
| 033 | Split Aces no re-split when another Ace arrives |
| 034 | Split-Ace A+ten ordinary 21/1:1 win only |
| 035 | Current seat completes all hands before next seat |
| 036 | COMPUTER still only Hit/Stand |
| 037 | Original Late Surrender |
| 038 | Surrender vs every upcard 2..9 |
| 039 | Surrender after negative ten/Ace peek |
| 040 | Surrender after Hit rejects |
| 041 | Surrender after Double rejects |
| 042 | Surrender after Split rejects |
| 043 | Split child surrender rejects |
| 044 | Natural surrender rejects |
| 045 | Exact integer half-return |
| 046 | Surrender no extra reserve/draw |
| 047 | Independent leaf settlement |
| 048 | Doubled leaf settlement |
| 049 | No parent double settlement |
| 050 | Advanced returns unavailable before commit |
| 051 | Double funding rejection preserves complete state/RNG |
| 052 | Split funding rejection preserves complete state/RNG |
| 053 | Double exhaustion -> integrity/VOID |
| 054 | Split exhaustion -> integrity/VOID |
| 055 | Re-split exhaustion -> integrity/VOID |
| 056 | Actual advanced reserved exposure refunded once |
| 057 | Duplicate settlement has no financial effect |
| 058 | Duplicate VOID has no financial effect |
| 059 | Public multi-hand secrecy |
| 060 | M5/M6/Charlie functionality absent |

Further advancedIntegrity cases cover later-child and second-Ace-child failures, partial dealer draws, 4 doubled leaves, no hypothetical refund after funding rejection, invalidation of pending Natural/surrender/bust, partial initial faults, cut 219/249 and next explicit funded recovery. Surrendered split leaves cannot be produced by legal M4 commands; the cap counts all leaves without filtering result/completion state.

## M5-T02 checkpoint - 2026-09-29 21:28:37 +08:00

T02 VERIFIED locally. Full harness PASS/0, 33 files / 530 tests, test start 21:27:51. sideBets.ts pure rank/colour/straight classification and exact gross; frozen once-only initial sideResults in optionalGame.ts. New sideBets.test.ts and optionalEvaluation.test.ts cover all categories, priority, physical copies, original-only inputs, pending funds and main independence. T01/T02 repairs 0/10; T03-T07 NOT STARTED. No publication yet. This checkpoint supersedes the earlier T01-only functionality note.
