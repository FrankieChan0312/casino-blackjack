# Casino Blackjack — Project State

## Current delivery: M7 IN PROGRESS (supersedes historical gate below)

Latest checkpoint T03 VERIFIED, 0/10; supersedes checkpoint summaries below. Clean T02 baseline c4c065fa7192a9f318a3915e672bb4f52793e1a8 published at 2026-09-30 10:49:06 +08:00, push/fetch PASS/0, 0/0. Targeted table tests 1/4 PASS at 10:57:01; full harness test start 10:57:11 PASS/0 **52/840**, including typecheck/lint/domain/build. Diff/whitespace/status inspected at 10:58:19. Seven seats, explicit You/Computer/Empty/Sitting Out, public cards/totals, active hand/result text, live round status and three separate credit amounts. Dealer total evaluates only visible cards. T03 publication follows; T04-T09 NOT STARTED. Ledger 1,0,0,0,0,0,0,0,0.

Latest checkpoint T02 VERIFIED, repairs 0/10. T01 published 1299ece6745584681fffec4646ee02fc160a8c63 at 2026-09-30 10:36:31 +08:00: commit/push/fetch PASS/0, main=origin/main, 0/0, clean. T02 baseline is that clean revision. At 10:40:36 controller targeted PASS/0 1/6; full harness test start 10:40:49 PASS/0 **51/836**, typecheck/lint/domain/build PASS. Complete diff/whitespace/status inspected 10:41:11. Added browser controller and safe read-only interaction/own-result queries; extracted existing Double/Split/Surrender checks without rule changes. React consumes public snapshots; factory injection is test-only infrastructure, not replay. T02 publication follows. T03-T09 NOT STARTED; ledgers unchanged.

M6 HUMAN ACCEPTED at 681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5: user explicitly stated "I accept M6." User-supplied genuinely fresh independent review reported NO FINDINGS, requirements/REG-M6-001..095/M1-M5 preservation/documentation PASS. This implementation conversation did not conduct that review. Acceptance is recorded with substantive M7-T01 work, not a metadata-only commit.

Re-entry 2026-09-30 10:15:46 +08:00: main, HEAD=origin/main=681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5, 0/0, clean. Initial entry at 10:08:15 had the same baseline. Initial harness PASS/0: 47 files / 825 tests (test start 10:10:47).

T01 initially BLOCKED before modification: REG-M6-095 required no React/browser files in the current tree, conflicting with authorized M7. No files changed before explicit user authorization. The user authorized anchoring that milestone absence assertion to accepted M6 Git objects and adding current domain isolation evidence. REG-M6-001..094 unchanged; 095 preserved; history unchanged. This is a contract clarification, not an M6 repair or M7 implementation repair. At 10:16:38 targeted historical/completeness/current-domain checks PASS/0, 2 files / 97 tests; ES2023-only, types-empty domain compilation PASS/0. Domain imports are structurally restricted to domain-local modules; the separate compile excludes browser globals and React ambient types.

Every M7 task recommends GPT Sol 6.1 / High. Actual model/effort: NOT VERIFIED / NOT VERIFIED. Scope/acceptance/verification follow the explicit M7 T01-T09 contract: shell/build -> public controller -> table -> betting -> hands -> decisions/results -> accessibility/responsive -> Chromium E2E/mappings/preservation -> documentation-only handoff. Non-goals: M8, server, accounts, real money, cloud, deployment, alternate bot policy, second HUMAN. Stop on authority conflicts, unknown overlap, unavailable tooling, secrets/paid resources/destructive Git, repair limit or final fresh-review gate.

M7 repairs T01-T09: **1,0,0,0,0,0,0,0,0** (each /10). M6 ledger unchanged: **1,0,0,0,0,0,1,0**. M1-M5 ledgers below preserved. T01 VERIFIED; T02-T09 NOT STARTED. Browser E2E NOT RUN. M7 fresh review NOT RUN; M7 ACCEPTED NO; M8 NOT STARTED; deployment NOT RUN.

T01 repair 1: first harness failed CSS import typing (exit 2) and five isolated historical harness assertions. Added vite/client types and project-aware required checks without changing historical tests. Conversation interruption did not add a repair; recovery inspected actual files at 10:27:42 before continuing. Targeted at 10:27:56 PASS/0, 4/105; direct typecheck/domain/build PASS/0. Full harness test start 10:28:28 PASS/0, **50 files / 830 tests**, all five required checks. Complete diff/whitespace inspection PASS at 10:28:42; production domain and historical harness tests unchanged. React/React DOM/types 19.3.0; plugin-react 6.1.1; Vite preserved 8.3.1. Checkpoint publication follows; own SHA cannot self-embed and is recorded in the next substantive checkpoint/delivery.

## Current delivery: M6 fresh-session review gate

M1-M5 are HUMAN ACCEPTED. M6 T01-T07 are IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. T08 is the VERIFIED documentation-only review package; final validation/publication evidence is recorded below and in the delivery report. M6 fresh independent review: **NOT RUN**. M6 ACCEPTED: **NO**. M7: **NOT STARTED**. Deployment: **NOT RUN**.

Repository: C:\Users\user\Documents\GitHub\casino-blackjack. Authorized remote: https://github.com/FrankieChan0312/casino-blackjack.git. Branch: main.
Entry at 2026-09-29 23:21:59 +08:00: HEAD=origin/main=f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d, ahead/behind 0/0, clean. Baseline full harness PASS/0, 38 files / 644 tests at 23:23:43. Sandbox Git owner mismatch was resolved by authorized owner-account execution, without configuration changes.

T07 published at 2026-09-30 00:12:00 +08:00: HEAD=origin/main=63deee6d8940c16a72bab8fab6b27bf8f7f66133, ahead/behind 0/0, clean; push/fetch exit 0. This is the T08 starting baseline. The T08 commit cannot embed its own SHA; final HEAD, origin/main, parity and clean state must be taken from the final delivery and independently re-read from Git. No recursive metadata-only commit is planned.

Recommended settings for every task: GPT-6 Astra / High. Actual model: **NOT VERIFIED**. Actual reasoning/effort: **NOT VERIFIED**.

## M5 human acceptance

The user explicitly stated "I accept M5." Accepted HEAD: f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d. The user-supplied genuinely independent recheck reported NO FINDINGS; previous LOW-01 CLOSED; regression verification sufficiency PASS; documentation accuracy PASS; M5 requirements PASS; REG-M5-001..072 PASS; M1-M4 preservation PASS. This was recorded together with substantive M6-T01 implementation/evidence. This conversation did not perform that fresh recheck.

## M6 checkpoints

All T01-T07 pushes/fetches passed with exit 0, main=origin/main, 0/0 and a clean tree at each checkpoint. Times below are +08:00; T01-T06 on 2026-09-29, T07 on 2026-09-30.

| Task | Scope | Commit | Repairs /10 | Full harness files/tests | Published |
| --- | --- | --- | --- | --- | --- |
| T01 | Participant ownership | 0c87dcd938a45c1e9fdbe9aa9f8690c51f6fd8fa | 1 | PASS 39/652 | 23:31:06 |
| T02 | Original back wagering | be07af97a47d3477af9d4640905dc02c3b70e719 | 0 | PASS 40/672 | 23:35:58 |
| T03 | Ordinary outcomes | 91ba66c9034716b1b46dcdc3976e36d36be3835e | 0 | PASS 41/682 | 23:41:15 |
| T04 | Double follow | bfe9f0989748d16b2de4aa0669b56db80ea12b35 | 0 | PASS 42/692 | 23:46:35 |
| T05 | Split/Re-split follow | d4b455dd6547b9d16bb9b509c15b8e44a3f45433 | 0 | PASS 43/702 | 23:50:54 |
| T06 | Insurance/Even Money/settlement/VOID | 5b7eaad88eadd7c476c1b9ac8f8f47e274b59602 | 0 | PASS 45/721 | 23:57:52 |
| T07 | Executable regression/preservation | 63deee6d8940c16a72bab8fab6b27bf8f7f66133 | 1 | PASS 47/825 | 00:12:00 |
| T08 | Documentation and fresh-review handoff | This documentation checkpoint; resolve SHA from delivery/Git | 0 | PASS 47/825; VERIFIED | Final delivery |

Repair ledgers (each entry /10):

- M6 T01-T08: **1,0,0,0,0,0,1,0**.
- M5: **0,0,0,0,0,1,0**.
- M4: **1,0,1,0,0,0,1**.
- M3: **0,0,0,0,0,2**.
- M2: **1,0,0,0,1,1**.
- M1: **2,1,0,0,1,0,1,0,0,1**.

T01 repair 1: first full harness failed typecheck because two new tests passed EMPTY to a HUMAN/COMPUTER-only fixture helper; targeted fix used explicit EMPTY objects. Targeted PASS 1/8 at 23:28:14; full PASS/0 39/652 at 23:28:20. No prior test changed.

T07 repair 1: first preservation command at 00:04:45 failed exit 1 by comparing M1 source directly to current, thereby counting the accepted M2 shoe minimumCards extension as M6 change. Confirmed the identical extension already exists at accepted M5. Corrected the procedure to compare accepted-M5 executable paths (except the documented compatible optionalGame seam), and compare each milestone's tests against its own accepted revision. No production change or weakened assertion. The repair counts conservatively include this procedure correction. Full failed-attempt history and intermediate evidence remain in DEVELOPMENT_LOG and checkpoint Git history.

## Executed verification and mapping

T07 targeted REG/integrity/settlement PASS/0, 3 files / 113 tests at 2026-09-30 00:04:10. Full verify.ps1 PASS/0 (typecheck, lint, tests), **47 files / 825 tests**, test start 00:04:17. Historical preservation reruns below all PASS/0; this is mechanical verification in the implementation session, not fresh review.

[behindRegression.test.ts](../tests/integration/behindRegression.test.ts) registers exactly **REG-M6-001..095**, one executable requirement per ID plus one exact completeness test (96 tests). Completeness asserts count 95, uniqueness 95 and exact contiguous ID set; no missing/duplicate IDs. The ID titles are the exact executable mapping:

- 001..005 participant ownership/persistence.
- 006..021 original wagering, eligibility, shared funds and freeze.
- 022..030 ordinary outcomes, no follower control and pending funds.
- 031..044 Double funding, timing, exposure and outcomes.
- 045..061 Split/Re-split, physical order, Aces and cap.
- 062..074 Ace decisions, independence and secrecy.
- 075..085 settlement, actual stakes, idempotency and attribution.
- 086..094 actual-exposure VOID, exclusion, multiple targets and public secrecy.
- 095 M7 browser implementation absent.

Nine M6 suites add 181 tests to the preserved 38 files / 644 tests.

| Milestone | Accepted revision | Original suites rerun | Result | Test start 2026-09-30 +08:00 |
| --- | --- | --- | --- | --- |
| M1 | d1d8966fe55af1bc2b9348e305135952b7723b70 | 12 files / 155 tests | PASS/0 | 00:05:27 |
| M2 | c9f7f35bf874a0e7673505cbbea745ce035ac695 | 6 / 78 | PASS/0 | 00:05:30 |
| M3 | cca40d2bed3b3964a9bfb47329d49bb553fe610e | 5 / 72 | PASS/0 | 00:05:31 |
| M4 | a5c6a22dd833867a6a1eff357a7462bd06fe4e0b | 7 / 171 | PASS/0 | 00:05:32 |
| M5 | f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d | 8 / 168 | PASS/0 | 00:05:33 |

Each suite's original files match its accepted revision. All accepted M5 executable/config/dependency/helper paths are unchanged except src/domain/optionalGame.ts: default-false optional fourth close parameter and guarded closeDeferredAceDecisions allow followers to finish before peek. Original three-argument behavior and tests remain unchanged. No broad incompatible rewrite, dependency addition or prior assertion weakening.

## Actual participant and Bet Behind model

behindGame.ts owns one optional stable local-human participant, seated at most once or spectator, and seven explicit seat-bound computer-N owners. New balances are 2000 integer half-credit units. HUMAN money follows the participant across finalized-round moves/leave/rejoin; dormant computer balances never transfer to HUMAN. The embedded table omits bankrolls. A transient M5 adapter maps funds back to owners and excludes actual follower reservation from its own-seat reconciliation without making it available.

One original back wager per other qualifying funded active seat, 20..2000 even units, OPEN only. Spectators need no own MAIN. Own MAIN/sides and all backed targets share one available pool. Delta changes, cancellation and dependent refund on target MAIN cancellation are atomic. Close removes stale ineligible back targets, freezes originals and draws no extra cards. Pair/THREE_CARD remain own-seat only. Computers never auto-bet or follow.

Controller owns cards/actions; follower owns stake and funding/optional choices. Local HUMAN action routing derives its own controlled seat. A follower cannot act on another hand or veto Surrender; controller Surrender returns half its attached follower stake. Normal/Natural outcomes track the same cards and use each follower's actual stake.

Controller matching reserve is accepted before Double/Split follow windows. No forced Double card or new child card appears until ADD/NO_ADD resolves. Insufficient ADD records INSUFFICIENT_FUNDS and final NO_ADD, leaving follower funds unchanged while continuing the accepted controller action. Double ADD doubles follower stake; NO_ADD keeps original stake. Split ADD funds equal ordered children; NO_ADD follows only the earlier-dealt-card child. Tracked re-splits open a new decision; untracked descendants do not. Decisions are irreversible before exposure; depth-first order, Split-Ace restrictions and four-leaf cap remain.

Against Ace, HUMAN own MAIN decision precedes back decisions in ascending target-seat order, then peek. Each original back wager independently chooses decline, half-original Insurance (odd units legal), or eligible Natural Even Money. Insurance needs available funds; insufficient purchase rejects unchanged and can be declined. Even Money reserves nothing, excludes Insurance/3:2 and fixes gross 2x. Computers decline. No later Insurance window exists; negative peek hides the hole card.

One final table transaction commits all controller/follower records. Ordinary win gross=2x actual stake, push=stake, loss/bust=0, Surrender=half, original Natural=2.5x unless Even Money=2x. Insurance win gross=3x insurance stake, loss=0. Results attribute round/participant/target/hand/wager/parent, actual stake, result, gross, net and status. Pending proceeds are unspendable. Integrity VOID replaces all pending outcomes and refunds original/accepted follow/Insurance exposure exactly once. NO_ADD/rejected ADD/Even Money add no hypothetical refund. Normal commit and VOID exclude each other.

## Exact M6 executable inventory

New production:

- src/domain/behindGame.ts
- src/domain/behindController.ts
- src/domain/behindPublicView.ts

Compatible extension: src/domain/optionalGame.ts only.

New helper: tests/helpers/behindFixture.ts.

New suites under tests/integration:

- behindOwnership.test.ts (8)
- behindBetting.test.ts (20)
- behindOutcomes.test.ts (10)
- behindDouble.test.ts (10)
- behindSplit.test.ts (10)
- behindInsurance.test.ts (10)
- behindSettlement.test.ts (9)
- behindRegression.test.ts (96)
- behindIntegrity.test.ts (8)

Documentation: README.md, docs/DESIGN.md, docs/PLAN.md, docs/STATE.md, docs/DEVELOPMENT_LOG.md, docs/LAB_MANUAL.md. T08 must change only these six documents relative to T07.

## Limitations requiring honest review

The supported local session has zero/one HUMAN. Every legal local backed seat is COMPUTER; accepted computer policy remains total <17 HIT, >=17 STAND, no advanced actions, Insurance/Even Money or following. Consequently Double/Split/Surrender following cannot arise through normal local computer play. Required advanced-follow domain mechanics are exercised with explicitly labelled owner-checked controlled fixtures; behindController is a domain primitive, not an alternate bot policy or multiplayer product. The optional clarification received no policy authorization; silence was not treated as permission. The fresh reviewer must assess this documented reachability boundary against the batch contract.

Owner IDs are local correctness routing, not authentication. This is in-memory simulated-credit code, with no account service, persistence, concurrency protection or validated arbitrary-state import. Callers retain latest returned state; old snapshots can branch computation. Raw internal state is not a public projection. No UI, React, browser E2E, network, payments, Charlie, M7/M8 or deployment. Browser E2E: NOT APPLICABLE because no UI. Clean-machine npm ci and cross-platform reproduction: NOT RUN. M6 acceptance and user understanding are not inferred from tests.

## Mandatory M6 fresh-session review handoff

Use a **genuinely new Codex conversation**, not this implementation conversation or a sub-agent with its history. Reviewer must report **findings FIRST**, with severity, file/line, reproducible evidence and impact; then requirements/regression/documentation/preservation conclusions. Make **no edits without separate authorization**.

1. Read AGENTS, SKILL, RULES (R06/R07/R08/R09/R10/R11/R13/R15/R17), SPEC M6, DESIGN, PLAN, STATE, DEVELOPMENT_LOG, README and LAB. Confirm local participant/non-goal constraints.
2. Independently capture timestamp, main, HEAD, origin/main, 0/0 and clean state. Resolve final T08 SHA from delivery/Git. Inspect complete f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d..HEAD diff, especially the compatible optionalGame seam and controller fixture reachability.
3. Inspect each executable REG-M6-001..095 assertion and exact completeness test; verify assertions use explicit outcomes and actual returned states. Inspect all nine M6 suites, not merely names/counts.
4. Rerun powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1 and git diff --check, checking exit codes. Expected current count 47/825; treat executed evidence as authoritative.
5. Independently enumerate historical test files with git ls-tree at each accepted SHA, subtract files belonging to earlier milestones, compare each set to its own revision, and rerun npm.cmd test -- <selected paths>. Expected M1..M5: 12/155, 6/78, 5/72, 7/171, 8/168. Compare accepted M5 original executable paths; inspect optionalGame.ts exception explicitly. Do not mistake already accepted milestone evolution for M6 changes.
6. Examine ownership/nonduplication, shared available funds, controller legality before follow windows, physical card timing/order, no-add fallback, independent Ace choices/peek, actual-exposure result/VOID attribution and once-only finalization.
7. Report limitations and review results without marking M6 ACCEPTED. Human acceptance is a separate event. M7 remains NOT STARTED; no merge/release/deployment.

## T08 final execution evidence

Documentation preparation began from the verified T07 baseline at 2026-09-30 00:12:15 +08:00. Final powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1 ran at 00:17:47, test start 00:17:53: typecheck/lint/tests PASS, 47 files / 825 tests, exit 0. Targeted document/scope verification at 00:18:24 PASS/0: exactly the six authorized documents, no executable changes relative to T07, README/STATE relative file links resolve. Complete six-document diff inspected, including all removed superseded STATE records (preserved in DEVELOPMENT_LOG/Git); whitespace and full status checks PASS. T08 VERIFIED, repairs 0/10. Only these factual evidence/status additions followed harness execution; no executable/config/dependency change. Normal commit/push/fetch and final main parity/clean are the remaining publication steps, with actual final SHA/results recorded in delivery and Git. Fresh independent review NOT RUN; M6 ACCEPTED NO; M7 NOT STARTED.
