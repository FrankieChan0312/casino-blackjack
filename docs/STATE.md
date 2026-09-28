# Casino Blackjack — Project State

## Current truth: M2-T06 review package

M1 at `d1d8966fe55af1bc2b9348e305135952b7723b70` is ACCEPTED by the user's explicit M2 batch contract. That acceptance was recorded with substantive T01, without a metadata-only acceptance commit. Prior history remains in DEVELOPMENT_LOG.md and Git. This implementation session did not perform or claim a new independent M1/M2 review.

M2 gameplay and the 24-scenario regression mapping are IMPLEMENTED / VERIFIED. T06 changes only README, LAB_MANUAL, PLAN, STATE and DEVELOPMENT_LOG. T06 full harness passed at 2026-09-29 00:29:54 +08:00, with typecheck/lint and 18 files / 233 tests. Complete five-document diff and whitespace/status review passed at 00:30:42; two wording issues found during review were corrected in repair 1/10. Final exact-version recheck follows this evidence update. M2 fresh-session review is NOT RUN; M2 and T01–T06 are NOT ACCEPTED. No M3 work, deployment, release or merge occurred.

Recommended model: GPT-6 Astra. Recommended reasoning/effort: High. Actual model: NOT VERIFIED. Actual reasoning/effort: NOT VERIFIED; no client settings evidence is exposed.

## Checkpoint and repair ledger

T01–T05 checkpoints below are on main, pushed to the authorized origin https://github.com/FrankieChan0312/casino-blackjack.git. T01–T05 each had successful fetch, HEAD=origin/main, behind/ahead 0/0 and a clean working tree before the next task. No count resets/transfers occurred.

| Task | Repairs | Delivery / commit | Push/parity timestamp (+08:00) |
| --- | --- | --- | --- |
| M2-T01 | 1/10 | VERIFIED / COMMITTED / PUSHED: 7824e57e792db6c83ce874d8324538ae24b281a1 | 2026-09-29 00:07:52; PASS, 0/0 clean |
| M2-T02 | 0/10 | VERIFIED / COMMITTED / PUSHED: e0f7b366c69f2980aa53283a5f37324ff89d2928 | 2026-09-29 00:12:43; PASS, 0/0 clean |
| M2-T03 | 0/10 | VERIFIED / COMMITTED / PUSHED: 710b87d41964bca04b8114a26931f2624305e45c | 2026-09-29 00:15:48; PASS, 0/0 clean |
| M2-T04 | 0/10 | VERIFIED / COMMITTED / PUSHED: 2d214024de4263c8ce08b50cfafbfd3aa07f6969 | 2026-09-29 00:19:45; PASS, 0/0 clean |
| M2-T05 | 1/10 | VERIFIED / COMMITTED / PUSHED: c61ac01fb9901808c7f3aaccc95b037c0000da44 | 2026-09-29 00:24:48; PASS, 0/0 clean |
| M2-T06 | 1/10 | IMPLEMENTED / VERIFIED locally; checkpoint publication pending | Final delivery records actual publication |

M1 repair ledger T01..T10: **2,1,0,0,1,0,1,0,0,1**, each /10. Accepted M1 tests/helpers remain unchanged. Historical M1 AC mapping is retained in STATE.md at the accepted M1 SHA; original execution and repair evidence is preserved in DEVELOPMENT_LOG.md.

T01 repair: staged whitespace found an extra EOF blank line in the log; removed that line, reran full harness and staged checks before committing. T05 repair: new beforeEach returned a throwing RNG spy as cleanup; changed only the hook to return void, retained guard/assertions, reran all checks. T06 repair: clarified that physical IDs/shoe order remain hidden in every phase and limited already-pushed wording to T01–T05. Full evidence and failed runs remain in the log.

## Latest executed verification

| Check | Status | Evidence |
| --- | --- | --- |
| Full harness at T05 | PASS | 2026-09-29 00:22:32; exit 0; typecheck/lint and 18 files / 233 tests |
| Original M1 test/helper preservation | PASS | git diff --exit-code from d1d8966... on all original paths, 00:23:10; exit 0 |
| Independent original M1 run | PASS | npm.cmd test -- with original 12 files; 155 tests; 00:23:11; exit 0 |
| T05 task diff/whitespace/status | PASS | Intended lifecycle test and three evidence documents only; staged whitespace exit 0 |
| T06 no executable changes | PASS | 00:27:45 git diff --exit-code -- src tests scripts package.json package-lock.json; exit 0 |
| T06 full harness/diff | PASS | 2026-09-29 00:29:54 harness exit 0, 18 files / 233 tests; 00:30:42 whitespace/status and complete five-file content review; final recheck after evidence update |
| Independent M2 fresh-session review | NOT RUN | Mandatory next session; not performed in this implementation session |
| Human acceptance of M2/tasks | NOT RUN | Reserved for explicit user acceptance after review |
| Browser/E2E | NOT APPLICABLE | M2 has no UI |
| Separate clean-machine npm ci reproduction | NOT RUN | Existing installed toolchain was used; no new M2 dependency |
| Deployment | NOT RUN | Not authorized; headless library only |

The unchanged harness still prints its historical M1 summary label, but runs all discovered tests: original M1 12 files / 155 tests plus M2 6 files / 78 tests = 18 files / 233 tests. No M1 assertion or required command was weakened.

## Exact M2 scope and limitations

Seven stable positions 1..7; EMPTY/HUMAN/COMPUTER; occupied seats may sit out; zero/one HUMAN including sitting-out humans; at least one active seat to start. Configuration only between rounds, with frozen active participation and seven-seat round snapshots. Ascending two-pass initial deal and player turns, shared six-deck shoe/dealer, original naturals/peek, HUMAN Hit/Stand, deterministic computer total<17 HIT / >=17 STAND, one S17 dealer resolution and independent hand outcomes. Normal naturals/busts survive later ordinary comparison. Required draw failure invalidates normal table outcomes and retires the shoe, retaining diagnostic cards. Public projection hides the hole until DEALER_TURN/ROUND_COMPLETE and also hides it in INTEGRITY_ERROR. Physical IDs, future shoe order and cut position are never exposed in any phase.

No betting, balances/credits/chips/wallets, financial settlement/refunds, Double, Split, Surrender, Insurance, Even Money, side bets, Bet Behind, Charlie, UI/CLI application, network multiplayer/server, accounts, database/persistence, replay product or M3+ implementation. No production casino, real-money, cryptographic RNG, AI/ML or optimal/basic-strategy claim. Automation is explicitly invoked after non-terminal deal/HUMAN commands and pauses on HUMAN. Supported commands are pure; arbitrary caller-corrupted objects are not a general validated import format. Frozen participation does not imply every object is runtime deep-frozen. Public projection is local correctness, not server security. Windows harness portability and clean-machine install remain unverified. No known implementation blocker was found in task review; independent review remains outstanding.

## Mandatory M2 fresh-session review handoff

**STOP after the T06 verified checkpoint is pushed and fetch/parity/clean checks pass.** Do not perform this independent review in the implementation session. Do not mark M2 or any M2 task ACCEPTED. Do not start M3, edit gameplay, merge, release or deploy.

Final branch: **main**. The final review checkpoint is the commit with subject `docs: prepare M2 verification and review package`, whose parent is `c61ac01fb9901808c7f3aaccc95b037c0000da44`. Its own SHA cannot be embedded in its content. Resolve `git rev-parse HEAD` and `git rev-parse origin/main`, and compare both with the exact final delivery SHA. The final delivery reports real T06 commit/push/fetch results and clean-tree status without an extra metadata-only commit. This document's baseline is T05 at 2026-09-29 00:24:48: main=origin/main=c61ac01..., 0/0 clean; never infer final parity from this older baseline.

M2 changed source: src/domain/table.ts, tableGame.ts, tablePublicView.ts, computer.ts, and shoe.ts (only optional initial minimum, default four preserved for M1). New test helper: tests/helpers/tableFixture.ts. M2 tests: tests/unit/table.test.ts, computer.test.ts; tests/integration/tableDeal.test.ts, tableActions.test.ts, tableAutomation.test.ts, tableLifecycle.test.ts. No original M1 test/helper, package, dependency, harness or other M1 source changed. DESIGN.md has the user-authorized M2 extension; RULES/SPEC remain unchanged.

Fresh reviewer instructions:

1. Start a genuinely new Codex session at this repository. Read AGENTS, SKILL, RULES, SPEC, DESIGN (including M2 extension), PLAN, STATE, DEVELOPMENT_LOG, README and LAB_MANUAL. The explicit M2 contract is represented by PLAN's six-task table, this scope and the 24-scenario mapping below. User acceptance remains separate from verification.
2. Capture environment time, repository path, branch, HEAD, origin/main, ahead/behind and complete working-tree status. Confirm final handoff SHA and main parity; stop on unexpected overlapping changes. Record actual model/effort only with verifiable evidence.
3. Inspect the full M2 diff from d1d8966fe55af1bc2b9348e305135952b7723b70 to the final HEAD, source/tests and exact verification evidence. Independently evaluate every requirement; do not treat a mapping row or generated code as proof.
4. Review seven-seat invariants, atomic between-round changes, <=1 HUMAN, frozen participation, sparse/full initial deal, natural matrix/peek, hand-versus-table completion, human routing, deterministic computer decisions without hidden inputs, HUMAN pauses, one S17 dealer, per-seat results and no unnecessary draws.
5. Review accounting, cut crossing/reuse/replacement including exact 2*n+2 boundaries, partial initial/HUMAN/computer/dealer faults, whole-table result invalidation, retired-shoe recovery, public secrecy/reveal, purity and terminal rejection. Inspect no-wager/no-advanced-action/no-UI/network scope and documentation accuracy.
6. Run .\scripts\verify.ps1 (or the documented child-PowerShell equivalent), git diff --check and git status --short --untracked-files=all; check every exit. Expected suite: 18 files / 233 tests, including 155 unchanged M1 tests. Inspect original M1 preservation independently; rerun the original 12-file suite if useful. Never weaken a test or infer PASS from old evidence.
7. Report findings first: severity, path/line, violated contract/rule, reproduction and impact. If none, say so explicitly with remaining limitations. Do not edit, commit, push or fix findings unless separately authorized. Preserve the task repair ledger; new session/model/branch does not reset it. Review completion does not constitute human acceptance.

## M2 acceptance/regression mapping (T05)

All rows below PASS in the executed full harness (18 files / 233 tests). Paths are relative to tests/integration unless prefixed unit/. Expected facts are explicit fixtures, card counts/IDs or comparisons, not outcomes computed using production logic. These are mechanical checks, not human acceptance or independent milestone review.

| Contract scenario | Executed test evidence / concrete invariant |
| --- | --- |
| 01 Human alone | tableLifecycle: HUMAN alone -> ordinary 21, dealer 20, PLAYER_WIN |
| 02 Computer alone | tableLifecycle: COMPUTER alone consumes exact same Hit and dealer cards |
| 03 Human + computers | tableAutomation: computer before/after HUMAN, pause and resume |
| 04 Sparse occupied table | tableDeal exact seats 2/5/7; tableActions next sparse seat |
| 05 Full seven-seat table | tableDeal exact two-pass IDs; tableLifecycle seven completed outcomes and 16 cards |
| 06 Sitting out skipped | unit/table and tableDeal; tableLifecycle inactive HUMAN skipped then reconfigured |
| 07 Initial exact order | tableDeal one/sparse/full: player index i and n+1+i, dealer n and 2*n+1 |
| 08 Mixed player Naturals | tableDeal mixed naturals preserves PLAYER_TURN/currentSeat 5 |
| 09 Dealer Natural matrix | tableDeal every A/10/J/Q/K upcard: Natural PUSH, ordinary DEALER_WIN |
| 10 Bust while others continue | tableActions advances from bust to seat 7 with hidden hole; tableAutomation bust survives later dealer bust |
| 11 Multiple computers | tableAutomation exact consecutive Hit sequences and ascending players |
| 12 HUMAN pauses automation | tableAutomation same state reference on repeated pause; no later computer draws |
| 13 Ordinary 21 | tableActions auto-advance without natural result; tableLifecycle complete comparison |
| 14 One shared dealer | tableAutomation mixed table draw spy exactly once; repeated resolution rejected |
| 15 Mixed outcomes | tableAutomation loss/Blackjack/win/push/loss against the same dealer 19 |
| 16 Shared shoe/accounting | independent 312-ID/disjoint checks in all M2 flows via helpers/shoeFixture.ts |
| 17 Cut deferred | tableLifecycle both 219/249 crossed by computer; dealer completes on same shoe |
| 18 Next-round reuse/replace | tableLifecycle two rounds retain shoe/cut; pending/retired/minimum triggers replacement |
| 19 Hole secrecy | tableDeal changed hidden card gives equal public view; tableActions/tableAutomation hidden during play/error, revealed at dealer/completion |
| 20 Terminal immutability | tableLifecycle all four gameplay commands reject repeatedly with original reference/snapshot |
| 21 Integrity without fabricated results | tableDeal partial initial faults; tableActions HUMAN fault; tableAutomation partial computer/dealer faults; tableLifecycle real exhaustion/recovery |
| 22 Repeatability | unit/computer explicit thresholds; tableAutomation/tableLifecycle repeated complete states and independently expected outcomes |
| 23 Zero HUMAN / all-computer | tableLifecycle full seven-computer round and computer-alone completion |
| 24 No financial/advanced state | tableLifecycle recursively checks internal/public state; task source review finds no wagering/credit/advanced-action API |

Additional T01 checks: positions exactly 1..7, <=1 HUMAN including sit-out, duplicate/out-of-range/runtime invalid settings rejected atomically, copied configuration and frozen participant snapshot. Additional guard checks: no active seat start; active start/configuration rejected; exact 2*n+2 boundary; invalid minimum rejected before RNG.
