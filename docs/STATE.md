# Casino Blackjack — Project State

## Current M3 checkpoint

M2 at c9f7f35bf874a0e7673505cbbea745ce035ac695 is ACCEPTED by the explicit M3 user contract, recorded with substantive M3-T01. M1 remains ACCEPTED at d1d8966fe55af1bc2b9348e305135952b7723b70. Historical M2 evidence/mapping/handoff is preserved in Git at the accepted M2 SHA and DEVELOPMENT_LOG. This session does not claim independent milestone review.

Entry gate at 2026-09-29 00:58:54 +08:00: main, HEAD=origin/main=c9f7f35bf874a0e7673505cbbea745ce035ac695, 0/0, clean; authorized origin https://github.com/FrankieChan0312/casino-blackjack.git. Initial sandbox ownership block was resolved with approved owning-user execution; no Git configuration change.

M3-T01 IMPLEMENTED / VERIFIED locally: credit primitives, starting 2000 units, atomic single reservation/release, safe-integer and nonnegative accounting. Full child-PowerShell verify.ps1 at 01:01:07: PASS/0, typecheck/lint, 19 files / 250 tests. Source/test task review found no blocking issue; Git checks/publication follow. No main wager functionality yet. M3-T02..T06 NOT STARTED. M3 is NOT ACCEPTED; fresh-session review NOT RUN; deployment NOT RUN.

Recommended model / effort: GPT-6 Astra / High. Actual model / effort: NOT VERIFIED / NOT VERIFIED (client settings evidence unavailable).

## Repair ledgers

M3 T01..T06: 0,0,0,0,0,0 (each /10).
M2 T01..T06: 1,0,0,0,1,1 (each /10).
M1 T01..T10: 2,1,0,0,1,0,1,0,0,1 (each /10).
No ledger resets. M1/M2 source/tests/helpers unchanged in T01.

## Next action

Publish verified T01 after final diff/whitespace/status checks, then automatically start T02. Stop at T06 fresh-session review gate. Per-task publication evidence is incorporated into the following substantive checkpoint; final checkpoint identity/push/parity is reported from actual Git output without a recursive metadata commit.

## T02 current checkpoint (supersedes T01 next action)

T01 VERIFIED / COMMITTED / PUSHED: c29ef4c15674fa2779dddd48f6e36cbff060a2a0; 2026-09-29 01:04:41 +08:00 fetch/main parity 0/0 clean PASS. T02 IMPLEMENTED / VERIFIED locally; full harness at 01:07:01 PASS/0, 20 files / 267 tests. T02 repair count 0/10. New funded betting layer requires OPEN, preserves bankroll ownership, freezes seats/wagers and deals only explicitly funded seats. Settlement not yet implemented. Next: authorized T02 publication and T03. M3 remains NOT ACCEPTED; fresh-session review NOT RUN.

## T03 current checkpoint

T02 VERIFIED / COMMITTED / PUSHED: 9f2e7c6d241ce9274197b7f26f59af26b4c9b5c9, 2026-09-29 01:09:20 +08:00; fetch/parity 0/0 clean PASS. T03 IMPLEMENTED / VERIFIED locally, 21 files / 276 tests, typecheck/lint PASS/0 at 01:11:07. Pending proceeds unavailable until explicit one-time COMMITTED settlement, exact integer returns and audit records. Repairs remain all zero. Next: T03 publication, then T04. M3 NOT ACCEPTED; fresh-session review NOT RUN.

## T04 current checkpoint

T03 VERIFIED / COMMITTED / PUSHED: 3647e09a6b8f2c9b4d432a39960ee66dff5cbf63 at 2026-09-29 01:13:01 +08:00, fetch/parity 0/0 clean PASS. T04 IMPLEMENTED / VERIFIED locally: full harness 01:14:56 PASS/0, 22 files / 283 tests. VOID refunds actual reserves once; pending profit/loss discarded, normal settlement/VOID exclusive, next-round bankroll and retired shoe recovery preserved. Demo reset deliberately deferred (optional under R06, not required by SPEC M3). All M3 repair counts remain 0/10. Next T04 publication -> T05 full regression. M3 NOT ACCEPTED; fresh-session review NOT RUN.

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

## T05 current checkpoint

T04 VERIFIED / COMMITTED / PUSHED: 5a492e865a49036a66922fa61a5a606f831a9616 at 2026-09-29 01:17:29 +08:00, fetch/parity 0/0 clean PASS. T05 IMPLEMENTED / VERIFIED locally: full harness PASS/0, 23 files / 305 tests; independently M1 12/155 and M2 6/78 PASS/0. Original M2-baseline executable/test/helper paths unchanged. All 40 mapping rows above pass. All M3 repairs remain 0/10. Next T05 publication -> T06 documentation only -> mandatory fresh-session review STOP. No M3 acceptance or deployment.
