# Casino Blackjack — Project State

## Current truth: M4-T05

The explicit M4 contract HUMAN ACCEPTED M3 at cca40d2bed3b3964a9bfb47329d49bb553fe610e after M3-T06 repair 2. This supersedes historical acceptance/next-action notes below, without inventing a repaired-HEAD independent recheck or closing the finding on behalf of a reviewer. Acceptance is recorded with substantive T01 work; no acceptance-only commit.

Entry at 2026-09-29 09:27:18 +08:00: main, HEAD=origin/main=cca40d2bed3b3964a9bfb47329d49bb553fe610e, 0/0 clean. Fetch at 09:31:15 confirmed the same authorized remote/HEAD. Baseline harness PASS/0, 23 files / 305 tests (test start 09:32:10). Initial sandbox ownership failure resolved by owning-user execution without configuration changes. No unknown edits.

T01 additive foundation IMPLEMENTED / VERIFIED locally: full child-PowerShell verify.ps1 at 09:39:41 PASS/0, typecheck/lint and 24 files / 312 tests. Complete task diff/publication checks follow. One documentation patch-context repair (1/10), no source/test correction; see log. T01 is COMMITTED / PUSHED cd2d8ccb87d4389e39348c43ed7e2d0e7adf50fb on main; 18:57:14 push/fetch/parity PASS, 0/0 clean. T02 Double/DAS is IMPLEMENTED / VERIFIED locally: first full harness at 18:59:08 PASS/0, 25 files / 327 tests, 0/10 repairs. T02 COMMITTED / PUSHED fbae61cf248492c18dbd0e7a47902b6495eea14f; 19:01:17 main=origin/main, 0/0 clean. T03 Split IMPLEMENTED / VERIFIED locally after lint-only repair 1/10; 19:04:16 full harness PASS/0, 26 files / 361 tests. T03 COMMITTED / PUSHED 5b4df25519011b0745676c19b8fb782743c87f5d; 19:07:11 main=origin/main, 0/0 clean. T04 re-split/cap/Split-Ace verification PASS/0 at 19:08:51, 27 files / 371 tests, repairs 0/10. T04 COMMITTED / PUSHED b1194483fb67b8f73459d0b6092be0d0da4baf09; 19:13:36 main=origin/main, 0/0 clean. T05 Late Surrender/multi-leaf settlement full harness PASS/0 at 19:15:45, 28 files / 399 tests, repairs 0/10. T06-T07 NOT STARTED. M4 repairs T01..T07: **1,0,1,0,0,0,0**, each /10. Prior ledgers: M3 **0,0,0,0,0,2**; M2 **1,0,0,0,1,1**; M1 **2,1,0,0,1,0,1,0,0,1**. Recommended GPT-6 Astra / High; actual model/effort **NOT VERIFIED / NOT VERIFIED**. M4 review NOT RUN; M4 NOT ACCEPTED; M5 NOT STARTED.

The M3 records below are retained historical context. The current M4 contract governs next actions.

## Current truth: M3-T06 review repair 2

M1 is ACCEPTED at d1d8966fe55af1bc2b9348e305135952b7723b70. M2 is ACCEPTED at c9f7f35bf874a0e7673505cbbea745ce035ac695 by the user's explicit M3 batch contract; that acceptance was recorded with substantive M3-T01, without a standalone acceptance commit. Prior M1/M2 mappings and execution records remain in Git at those SHAs and DEVELOPMENT_LOG.md. No new independent M1/M2 review is claimed in this session.

M3 financial functionality and all 40 regression mappings are IMPLEMENTED / VERIFIED at T05. T06 is a documentation-only review package. Its full harness passed at 01:27:10; complete five-file review found one wording error, corrected in repair 1/10. Repair recheck at 01:28:48 passed the full harness (23 files / 305 tests), with final five-document scope/whitespace review at 01:29:24. The review package was published as d0d0a08de8839215875e4920547334ca680b91ab. Fresh-session review of that HEAD found one LOW stale LAB status sentence; functional requirements, all 40 scenarios and M1/M2 preservation passed. Repair 2/10 corrects that sentence and is locally VERIFIED; independent reviewer recheck is pending. The finding remains open and documentation review remains FAIL until the independent reviewer checks the repaired HEAD. M3 and every M3 task remain NOT ACCEPTED. M4 is NOT STARTED; no merge, release or deployment.

Recommended model / reasoning: GPT-6 Astra / High. Actual runtime model / reasoning: NOT VERIFIED / NOT VERIFIED; no verifiable client-settings evidence is exposed.

## Checkpoint and repair ledger

All T01–T05 checkpoints below were pushed to origin/main at https://github.com/FrankieChan0312/casino-blackjack.git. Every publication included successful fetch, local HEAD=origin/main, ahead/behind 0/0 and clean working tree. The repair entry gate confirmed T06 publication at d0d0a08de8839215875e4920547334ca680b91ab on main/origin/main, 0/0 and clean at 2026-09-29 08:34:13 +08:00. The repair commit/push results will be reported from actual Git output in delivery, without a recursive metadata-only commit.

| Task | Repairs | Delivery / commit | Push/parity timestamp (+08:00) |
| --- | --- | --- | --- |
| M3-T01 | 0/10 | VERIFIED / COMMITTED / PUSHED c29ef4c15674fa2779dddd48f6e36cbff060a2a0 | 2026-09-29 01:04:41; PASS 0/0 clean |
| M3-T02 | 0/10 | VERIFIED / COMMITTED / PUSHED 9f2e7c6d241ce9274197b7f26f59af26b4c9b5c9 | 2026-09-29 01:09:20; PASS 0/0 clean |
| M3-T03 | 0/10 | VERIFIED / COMMITTED / PUSHED 3647e09a6b8f2c9b4d432a39960ee66dff5cbf63 | 2026-09-29 01:13:01; PASS 0/0 clean |
| M3-T04 | 0/10 | VERIFIED / COMMITTED / PUSHED 5a492e865a49036a66922fa61a5a606f831a9616 | 2026-09-29 01:17:29; PASS 0/0 clean |
| M3-T05 | 0/10 | VERIFIED / COMMITTED / PUSHED e1fb8f49623f84026f723e0760973a70934d684d | 2026-09-29 01:22:40; PASS 0/0 clean |
| M3-T06 | 2/10 | Review package COMMITTED / PUSHED d0d0a08; repair 2 IMPLEMENTED / VERIFIED locally | Entry gate 2026-09-29 08:34:13; 0/0 clean; independent recheck required |

M1 T01..T10 repair ledger: **2,1,0,0,1,0,1,0,0,1**, each /10.
M2 T01..T06 repair ledger: **1,0,0,0,1,1**, each /10.
No counter was reset by task/session/branch/model. M3 T01–T05 required no repair. T06 repair 1/10 corrected a LAB explanation: >= would incorrectly reject exact funds, not cause overdraft; no executable change. The initial Git sandbox ownership block was resolved via approved owning-user execution without changing global safe.directory. Historical failed attempts remain in DEVELOPMENT_LOG.

## M3-T06 review repair 2/10

Finding: LOW at LAB_MANUAL.md:1390, violating AGENTS.md section 11 and the M3-T06 accurate-documentation contract. At 2026-09-29 08:34:30 +08:00, rg reproduced the stale wording "M3+ remains unimplemented" (exit 0), inconsistent with the current M3 status at LAB lines 8/935. Hypothesis: the milestone wording was not updated when M3 became implemented. Targeted correction: only "M3+" -> "M4+" in that sentence; only STATE and DEVELOPMENT_LOG record the repair. No README, PLAN, rules/spec/design, executable or test changes are authorized.

Fresh review of d0d0a08 otherwise passed M3 requirements, all 40 scenarios, original M1 12 files / 155 tests, original M2 6 files / 78 tests and the full harness 23 files / 305 tests; no BLOCKER/HIGH/MEDIUM findings. These are prior review results, not this repair's validation. Repair validation PASS: at 08:35:47 the stale-wording search returned 1 (expected no matches); full verify.ps1 ran 08:35:47-08:35:59 with exit 0, typecheck/lint and 23 files / 305 tests PASS. At 08:36:12 git diff --check, status, full three-document diff and the executable diff against d0d0a08 all passed/0. Only LAB_MANUAL, STATE and DEVELOPMENT_LOG changed. Final staged checks and publication follow this evidence-only update; actual results belong in delivery. The same independent reviewer must recheck the repaired HEAD; finding closure, documentation-review PASS and M3 acceptance are not claimed. All other task repair counts remain unchanged.

## Executed verification

| Check | Status | Actual evidence |
| --- | --- | --- |
| T01 full harness | PASS | 01:01:07; exit 0; typecheck/lint; 19 files / 250 tests |
| T02 full harness | PASS | 01:07:01; exit 0; 20 files / 267 tests |
| T03 full harness | PASS | 01:11:07; exit 0; 21 files / 276 tests |
| T04 full harness | PASS | 01:14:56; exit 0; 22 files / 283 tests |
| T05 full harness | PASS | 01:19:34; exit 0; 23 files / 305 tests |
| Original M2-baseline source/tests/helpers/harness/dependencies | PASS | 01:20:31; git ls-tree original paths then git diff --exit-code c9f7f35... -- paths; no differences |
| Independent M1 suite | PASS | 01:20:31–01:20:37; npm.cmd test -- original 12 files, 155 tests, exit 0 |
| Independent M2-only suite | PASS | 01:20:37–01:20:39; npm.cmd test -- original six additional files, 78 tests, exit 0 |
| Direct M1 original tests/helpers comparison | PASS | 01:22:17; git diff --exit-code d1d8966... -- original test/helper paths, exit 0 |
| T05 task diff/status/whitespace | PASS | 01:22:17 plus staged check before commit; only new regression test and PLAN/STATE/log |
| T06 full harness / diff | PASS | 01:27:10 harness exit 0, 23 files / 305 tests; 01:27:42 and 01:28:05 full five-file diff/status/whitespace and unchanged executables PASS; repair recheck 01:28:48 PASS/0, 23/305; final scope/whitespace 01:29:24 PASS/0 |
| M3 independent fresh-session review | FAIL | Review of d0d0a08 completed: one LOW documentation finding; functional/regression checks PASS; repaired-HEAD recheck NOT RUN |
| M3 human acceptance | NOT RUN | No user acceptance of M3 or individual M3 tasks |
| Browser/E2E | NOT APPLICABLE | No UI |
| Separate clean-machine npm ci / cross-platform portability | NOT RUN | Existing Windows toolchain used, no new dependency |
| Deployment | NOT RUN | Not authorized |

All timestamps in this table are 2026-09-29 +08:00. The unchanged harness prints its historical M1 label while discovering all suites. Breakdown is 12 files / 155 M1 tests + 6 files / 78 M2 tests + 5 files / 72 M3 tests = 23 files / 305 tests. No tests/assertions/checks were weakened or disabled.

## Financial design and exact invariants

- Every financial value is a safe integer in half-credit units; starting available=2000 and reserved=0 per fixed seat. Generic reserve amounts must be positive; original main stakes must be even, 20..2000 units. No rounding.
- Each stable seat owns its bankroll for the session. Seat/controller/sit-out changes preserve funds. No account/transfer architecture, automatic credit refill or demo reset API.
- Accepted reservation moves available to reserved. Equality is affordable. A target-stake change transfers only its delta. Invalid/unfunded requests return the original state before card/turn/RNG changes. Duplicate target stakes have no effect; cancellation releases once.
- CONFIGURING permits seat changes. OPEN locks seats and permits main-wager edits. Closing freezes stakes and ascending occupied/non-sitting-out/funded participants. No free/automatic COMPUTER bets; no-funded close rejects unchanged.
- M3 uses a thin wrapper over unchanged M2. The supported M3 API cannot start unfunded play. M1/M2 APIs remain low-level historical primitives, outside the funded workflow.
- Pending results are derived from known hand outcomes and never counted as available. Gross is 2*stake for win, 5*(stake/2) for Natural, stake for push, 0 for loss/bust; net=gross-stake. A 50-unit Natural returns exactly 125 units.
- The nested M2 ROUND_COMPLETE means gameplay/discard is complete. M3 remains CLOSED until settleMainWagers commits all results/bankrolls together, clearing reservations and adding gross once. Final records are frozen and attributable by session-local round ID plus seat (one main wager/hand each). COMMITTED rejects repeat settlement.
- Genuine INTEGRITY_ERROR permits VOID. It returns actual reserved stakes once, removes pending profit/loss, records zero-net REFUNDED results, preserves diagnostic cards/fault and keeps the failed shoe retired. VOID and normal COMMITTED settlement exclude each other.
- A new cycle requires explicit prepareNextBettingRound after finalization and explicit new wagers. Funds persist; healthy shoe reuses remaining cards, retired/pending/short shoe replaces only at next deal. Old snapshots remain unchanged.

## Known limitations

In-memory local TypeScript library only. Callers must retain the latest returned state; old snapshots branch computation and are not a concurrent/stale external-request protection service. No unbounded history, timestamped action-event store, persistence, authentication or general corrupted-object import validation. Broader R17 action-event/replay infrastructure remains M8; M3 supplies minimal round/seat main-wager financial records. Physical public projection is a correctness boundary, not server security. Some snapshots are runtime frozen; the entire state is not deep-frozen.

Demo reset is deliberately deferred (R06 permits it, SPEC M3 does not require it). No Double/Split/Re-split/Surrender/Insurance/Even Money/side bets/Bet Behind/Charlie, UI/CLI app/network multiplayer, real money, paid resources or deployment. Computer policy remains deterministic/non-optimal. Math.random is only a simulation adapter. One LOW documentation finding remains open pending independent recheck of repair 2; no blocking functional finding was reported.

## Mandatory M3 fresh-session review handoff

The original handoff below is retained as historical context. The repair-2 recheck instructions above are current.

**STOP after T06 commit/push/fetch/parity/clean. Do not perform the independent review in this implementation session, mark any M3 task ACCEPTED, or start M4.**

Final branch: **main**. The final review checkpoint is the commit with subject `docs: prepare M3 verification and review package`, whose parent is `e1fb8f49623f84026f723e0760973a70934d684d`. Its own SHA cannot be embedded in its content. Resolve HEAD and origin/main and compare both against the exact final delivery SHA. Final delivery records the real commit/push/fetch and working-tree checks without a recursive metadata-only commit. The last baseline established here is T05 at 01:22:40: main=origin/main=e1fb8f4..., 0/0 clean; do not infer final parity from that older baseline.

M3 source additions: src/domain/credits.ts and bettingGame.ts. New helper: tests/helpers/bettingFixture.ts. New suites: tests/unit/credits.test.ts; tests/integration/betting.test.ts, settlement.test.ts, financialLifecycle.test.ts and fundedRegression.test.ts. All original source/tests/helpers and runtime/dependency/harness files remain unchanged from accepted M2. RULES/SPEC are unchanged; DESIGN has the authorized financial extension. T06 changes documentation only.

Exact findings-first reviewer instructions:

1. Start a genuinely new Codex session in this repository. Read AGENTS.md, SKILL.md, RULES, SPEC, DESIGN, PLAN, STATE, DEVELOPMENT_LOG, README and LAB_MANUAL. Read the M3 batch contract and all 40 mapping rows below. Recommended GPT-6 Astra / High; record actual settings only when verifiable.
2. Capture Get-Date with offset, Get-Location, branch, HEAD, origin/main, ahead/behind and full working-tree status. Confirm main, exact final delivered SHA, 0/0 and clean; stop on unexpected changes. Fetch/parity is read-only verification, not permission to modify code.
3. Independently inspect the full M3 diff from c9f7f35bf874a0e7673505cbbea745ce035ac695 to final HEAD, source/tests/helpers, Git history and executed evidence. Do not trust generated code, mappings or historical PASS as proof. Re-evaluate R06/R07/R13/financial-R17 and R02/R08 funded participation.
4. Inspect unit precision/limits, seat-owned balances across controller changes, atomic requests including RNG/cards/turn, OPEN/close locks, sparse funded participants, computer funding, frozen wagers, pending Natural availability, exact gross/net audit records, one-time table commit and accounting reconciliation.
5. Inspect whole-round faults at initial/HUMAN/computer/dealer stages, pending win/loss removal, actual-stake refunds, duplicate operations, settlement/VOID mutual exclusion, retired shoe recovery and next-round bankrolls. Check that no M4/M5/M6 state/API or prohibited functionality exists. Review public secrecy through the reused table projection and honest local-state limitations.
6. Run .\scripts\verify.ps1 (or the documented child-PowerShell equivalent), git diff --check and git status --short --untracked-files=all, checking every exit. Expected current suite: 23 files / 305 tests. Independently enumerate original paths from accepted M1/M2 commits; inspect test/helper diffs and original M2 source preservation. Rerun original 12-file M1 (155 tests) and six-file M2 (78 tests) suites separately. Verify funded equivalents rather than assuming unchanged M2 tests prove the wrapper.
7. Report findings FIRST: severity, file/line, violated requirement, reproducible steps and impact. If none, explicitly say no findings and list remaining limitations. Include actual checks, counts, Git identity and all cumulative repair ledgers. Do not edit, fix, commit or push until separately authorized. Review completion is not human acceptance; M3 remains NOT ACCEPTED until explicit user acceptance. Do not begin M4, merge, release or deploy.

## M3 acceptance/regression mapping

All 40 rows PASS in the executed T05 full harness: 23 files / 305 tests (72 M3, 233 preserved M1/M2). Paths below are under tests; each group uses explicit expected values, controlled card fixtures and/or independent accounting. This mapping is mechanical evidence, not independent review or human acceptance.

| ID | Rule / requirement | Executable evidence |
| --- | --- | --- |
| 01 | R06 starting 1000 credits | unit/credits: starts with 2000 available, zero reserved |
| 02 | R06 integer half-credit units | unit/credits single unit valid; settlement 50 -> 125 gross |
| 03 | R06 no fractional financial state | unit/credits rejects fractional/unsafe units; fundedRegression integer monetary fields |
| 04 | R06 main minimum | betting valid 20, rejects 18 |
| 05 | R06 main maximum | betting valid 2000, rejects 2002 |
| 06 | R06 whole-credit main increment | betting rejects 21 and 20.5 units |
| 07 | R07 exact funds | credits reserve 200/200; betting 2000 leaves zero |
| 08 | R07 insufficient funds | credits/betting 199 cannot fund 200; fundedRegression 75 cannot fund 76 |
| 09 | R07 atomic rejection | betting snapshots/reference/game equality; no-funded RNG spy; credits frozen input |
| 10 | R07 wager increase | betting 200 -> 300 available 1700; unaffordable increase unchanged |
| 11 | R07 wager decrease | betting 300 -> 200 available 1800 |
| 12 | R08 cancellation | betting releases actual 200 once, duplicate NO_WAGER |
| 13 | R08 OPEN timing | betting before-open/after-close rejection; fundedRegression gameplay phase guards |
| 14 | R02 seat freeze | betting rejects join/leave/controller/sit-out during OPEN and after close |
| 15 | R02 unfunded skipped | betting occupied seats 1/4 skipped despite not sitting out |
| 16 | R08 sparse funded deal | betting exact seat 2/5/7 card ranks and dealer order, 312-ID accounting |
| 17 | R02 explicit computer funds | betting no automatic computer wagers; fundedRegression explicit computer flow |
| 18 | R02 no funded start | betting NO_FUNDED_SEATS before RNG; lifecycle next round also requires new wager |
| 19 | R08 frozen wagers | betting frozen detached wager array/entries and unchanged late commands |
| 20 | R07 pending Natural unavailable | settlement full-bankroll Natural leaves available zero during other HUMAN turn |
| 21 | R13 ordinary win | settlement 200 stake -> 400 gross -> 2200 final |
| 22 | R13 Natural 3:2 | settlement 200 -> 500 gross -> 2300 final |
| 23 | R13 half-credit exactness | settlement 50 -> 125 gross -> 2075 final |
| 24 | R13 push | settlement 200 returned -> 2000 final; fundedRegression dealer Natural pushes player Natural |
| 25 | R13 loss | settlement 0 gross -> 1800 final |
| 26 | R13 bust loss | settlement HUMAN bust, 0 gross, stake not deducted again |
| 27 | R13 seven mixed outcomes | settlement seven-seat explicit result tuples and balances, shared dealer 19 |
| 28 | R13 table settlement once | settlement COMMITTED only after ROUND_COMPLETE; dealer phase still rejected |
| 29 | R13 duplicate settlement | settlement repeated unchanged rejection, no duplicate records |
| 30 | R13 no double deduction | settlement available remains 1800 before commit; loss ends 1800 |
| 31 | R13 audit and reconciliation | settlement exact round/seat/stake/outcome/gross/net/status; total 14100 = 14000 + 100 |
| 32 | R17 whole-round VOID | financialLifecycle human fault/refund, diagnostics and retired shoe retained |
| 33 | R17 multi-seat VOID | financialLifecycle three seats 200/50/2000 all restored |
| 34 | R17 pending win discarded | financialLifecycle Natural then computer fault; fundedRegression Natural then dealer fault |
| 35 | R17 pending loss discarded | financialLifecycle HUMAN bust then later computer fault, all net zero |
| 36 | R17 refund once | financialLifecycle repeated VOID rejected and reserved all zero |
| 37 | R13/R17 mutual exclusion | financialLifecycle settlement after VOID and VOID after normal commit unchanged |
| 38 | R17 retired shoe recovery | financialLifecycle real exhaustion; replacement on next funded deal only |
| 39 | R06 next-round bankroll | financialLifecycle controller/leave/rejoin retains 2075; fundedRegression two-round 2075 -> 75 |
| 40 | M3 scope excludes M4/M5/M6 | fundedRegression recursively inspects keys and API exports for absent advanced actions |

Additional funded M2 regressions: HUMAN/computer alone ordinary 21, pause/resume, every dealer peek rank, hard/soft S17, both 219/249 cut thresholds, healthy-shoe reuse, exact card/discard accounting, initial faults after 0/1/3/5 draws and partial dealer fault. Existing M1/M2 assertions/helpers are preserved; no regression was disabled.
