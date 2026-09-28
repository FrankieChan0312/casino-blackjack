# Casino Blackjack — Project State

## Current truth: M2-T05

M1 at d1d8966fe55af1bc2b9348e305135952b7723b70 is ACCEPTED by the explicit M2 batch contract. Earlier pending M1 review/acceptance statements in historical notes are superseded; no new independent review was performed here. Baseline at 2026-09-28 23:57:30 +08:00: main=origin/main, 0/0, clean. Origin is the authorized FrankieChan0312/casino-blackjack repository.

T01 checkpoint 7824e57e792db6c83ce874d8324538ae24b281a1 pushed to origin/main with fetch 0/0 and clean at 2026-09-29 00:07:52 +08:00. T02 adds shared initial deal, per-seat naturals and public projection. Full verify.ps1 PASS/0 at 00:10:55–00:11:27 +08:00: typecheck/lint and 14 files / 184 tests; source/test diff review PASS. No new dependencies. Recommended model/effort GPT-6 Astra / High; actual model NOT VERIFIED; actual reasoning/effort NOT VERIFIED.

| M2 task | Repair count | Status |
| --- | --- | --- |
| T01 | 1/10 | VERIFIED / COMMITTED / PUSHED: 7824e57; 0/0 clean |
| T02 | 0/10 | VERIFIED / COMMITTED / PUSHED: e0f7b36; 0/0 clean |
| T03 | 0/10 | VERIFIED / COMMITTED / PUSHED: 710b87d; 0/0 clean |
| T04 | 0/10 | VERIFIED / COMMITTED / PUSHED: 2d21402; 0/0 clean |
| T05 | 1/10 | IMPLEMENTED / VERIFIED; checkpoint pending |
| T06 | 0/10 | NOT STARTED |

M1 repair ledger T01..T10: **2,1,0,0,1,0,1,0,0,1**, each /10. Historical verification/AC mapping is preserved in Git at the accepted M1 SHA and DEVELOPMENT_LOG.md; no count is reset.

M2 scope: seven seats, zero/one human, computers, sitting out, frozen participation, shared shoe/dealer, deal/turn ordering, Hit/Stand, independent outcomes, public redaction and deterministic computer total<17 HIT / >=17 STAND. No wager/credit/advanced action/UI/network/server/replay product or casino-certification claim. HUMAN actions, ascending turns, deterministic computer automation and one shared S17 dealer comparison are implemented. Required checks for every task: full verify.ps1, diff --check, complete task diff and status; commit/push/fetch only on PASS. No known implementation blocker.

Latest baseline: main=origin/main=e0f7b366c69f2980aa53283a5f37324ff89d2928 at 2026-09-29 00:12:43 +08:00, 0/0 clean. T03 full harness PASS/0 at 00:14:30–00:14:52: 15 files / 195 tests, typecheck/lint and diff review PASS. T04 baseline at 2026-09-29 00:15:48 +08:00: main=origin/main=710b87d41964bca04b8114a26931f2624305e45c, 0/0 clean. Latest T04 full harness PASS/0 at 00:18:03–00:18:23: 17 files / 216 tests, typecheck/lint and diff review PASS. T05 baseline at 2026-09-29 00:19:45 +08:00: main=origin/main=2d214024de4263c8ce08b50cfafbfd3aa07f6969, 0/0 clean. T05 first harness failed only the new hook; repair 1 removes its accidental cleanup return without changing assertions. Final full harness at 00:22:32 PASS/0, 18 files / 233 tests; independent original M1 suite at 00:23:11 PASS/0, 12 files / 155 tests. Original M1 test/helper diff is empty. Next: publish T05 checkpoint then automatically begin T06. Final M2 fresh-session review NOT RUN; M2 and every M2 task NOT ACCEPTED. Stop after T06 for a genuinely new findings-first reviewer, who reruns the harness and inspects M1 preservation without editing unless separately authorized. Browser/E2E NOT APPLICABLE: no UI. Deployment NOT RUN and not authorized. Clean-machine npm ci reproduction NOT RUN.

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
