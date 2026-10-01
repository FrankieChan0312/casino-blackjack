# M8 MEDIUM-05 harness reproducibility evidence

Status: OPEN - repair VERIFIED; independent recheck pending. Independent recheck NOT RUN here; M8 ACCEPTED = NO; deployment NOT RUN.

## Contract, baseline and diagnosis boundaries

Task M8 MEDIUM-05; actual test-only repair owner M8-T07 Review Repair #2. Recommended GPT Sol6.1/High; actual client availability/model/effort NOT VERIFIED. Baseline 2026-10-01 12:48:07 +08:00: main=HEAD=origin/main=1c639cb6ab35fa7bad80a6db174cda115666279f,0/0,clean including untracked. No source modification before all Phase A/B/C measurements. Diagnosis does not increment repairs. First repository edit after clean recheck at12:56:16. No production/domain/dependency/runtime configuration or official scripts changed.

Acceptance: six targeted tests each three consecutive PASS; affected four suites three consecutive PASS; full npm.cmd test twice consecutive PASS; complete official verify.ps1 twice consecutive PASS, preserving all checks and M1-M7. Stop for production regression(E), authority conflict, unknown overlap, unavailable checks, unsafe publication or cumulative10 repairs. No independent review in this session.

Reviewer evidence at that HEAD:66files/956tests,950PASS/6FAIL. REG-067 default5s observed15340ms;069 default5s12430ms;070 explicit15s23853ms;093 default5s7225ms;094 default5s11252ms;077 EPERM inside temporary fixture cleanup. All other product/browser/domain correctness checks passed. Earlier findings including LOW-04/05 CLOSED; MEDIUM-05 remains OPEN.

## Root cause, falsifiable hypothesis and unchanged coverage

| Test | Classification and evidence | Surgical repair / budget |
| --- | --- | --- |
| REG-M8-067 | B+C: isolation788..840ms, grouped1202..1813ms, full1889..3441ms; reviewer15340ms. 159744 matcher constructions inside draws. | Direct failure checks retain all256 seeds,312 real draws per seed, success and duplicate detection, seed/draw/card context; initial/final independent312-ID accounting unchanged. Default5000ms unchanged. |
| REG-M8-069 | B+C: isolation789..832ms, grouped792..1032ms, full2170..3055ms; reviewer12430ms. Three matchers per draw are avoidable. | All256 seeds, every draw through cut+5, shoeId/cutPosition/reshufflePending checked at every draw with contextual errors. Default5000ms unchanged. |
| REG-M8-070 | B+C: isolation1607..1785ms, grouped1294..1555ms, full4043..4941ms; reviewer23853ms. Same package replayed twice. | Store one real replay result, independently assert outcomes and digest. All256x3 rounds, funds/reserves/accounting/one-time settlement/profile checks unchanged. Explicit15000ms unchanged. |
| REG-M8-093 | B: isolation460..518ms, grouped613..817ms, full823..1492ms; reviewer7225ms. A not established locally. | Only local15000ms timeout; measured reviewer max7225ms rounded to a modest stable ceiling, then required repeated verification. Every10000 real command, complete contiguous journal, parse/replay,10001 rejection, state identity/bytes, audit/outcomes/clock/package preservation unchanged. |
| REG-M8-094 | B: isolation728..946ms, grouped881..1320ms, full1250..2461ms; reviewer11252ms. A not established locally. | Only local20000ms timeout; reviewer max11252ms needs more than5s under load. Both9992/9993-wager scenarios,10000 success, two-intent10001 rejection, real replay twice, completed/archive/audit/finance/reset guards unchanged. |
| REG-M8-077 | D mechanism verified with actual Windows handle after child completes; natural EPERM not reproduced, original handle owner unknown. | Await mandatory fs/promises.rm recursive/force/maxRetries3/retryDelay100 in finally; no catch in test cleanup, exhausted errors reject. Completed spawnSync and expected exit8/output assertions unchanged; REG-078 also awaits same mandatory helper. |

The timeout ceilings are workload allowances, not a product performance guarantee. No global timeout, worker count, Vitest/Playwright retry, seed count, boundary, REG owner/count or preservation assertion changed. CPU contention classification is an inference from isolated/grouped/full inflation and supplied failing reviewer measurements; no profiler captured reviewer host CPU. No E evidence found; no product changes authorized or made.

## Executed commands and measurement method

Phase A: npm.cmd test -- <exact file> -t \[REG-M8-NNN\] --reporter=verbose, each independently three times. Files:067/069/070 in tests/integration/m8Invariants.test.ts;093 in tests/integration/replay.test.ts;094 in tests/integration/browserDemo.test.ts;077 in tests/unit/m8Harness.test.ts. Filters select exactly one test; reporter skipped siblings are filtering, no test source skip/retry.

Phase B/grouped: npm.cmd test -- tests/integration/m8Invariants.test.ts tests/integration/replay.test.ts tests/integration/browserDemo.test.ts tests/unit/m8Harness.test.ts --reporter=verbose. Two before edits, three after final repair. Full diagnosis first ran literal npm.cmd test twice, then two additional verbose full runs to obtain affected test durations. Each reported66files/956tests.

Final full stability: npm.cmd test, twice consecutive. Official complete harness: powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./scripts/verify.ps1, twice consecutive. No preload or fault probe in any final stability run.

Each wall time uses Diagnostics.Stopwatch around the native command; start/end use Get-Date -Format yyyy-MM-dd HH:mm:ss K. Vitest per-test milliseconds and overall Duration below come from executed reporter output. Each exit code checked; required final run failure stops the batch. No rerun-until-pass policy. Diagnosis used temporary NODE_OPTIONS instrumentation wrapping native spawnSync/rmSync and syncBuiltinESMExports, without repository edits. Final verification removes preload.

## Every valid diagnostic and stability run

All timestamps2026-10-01 +08:00. Test-ms columns067/069/070/093/094/077; dash means not selected or reporter did not expose that individual duration, never inferred. Timeout reason is NONE for every natural run below.

| Run | Start → end (+08:00) | Result / exit | Vitest Duration | Wall(s) | 067 / 069 / 070 / 093 / 094 / 077(ms) |
| --- | --- | --- | --- | ---: | --- |
| isolated-valid-067-1 | 12:51:42 → 12:51:43 | PASS / 0 | 1.19s | 1.913 | 840 / - / - / - / - / - |
| isolated-valid-067-2 | 12:51:44 → 12:51:45 | PASS / 0 | 1.20s | 1.93 | 826 / - / - / - / - / - |
| isolated-valid-067-3 | 12:51:45 → 12:51:47 | PASS / 0 | 1.14s | 1.817 | 788 / - / - / - / - / - |
| isolated-valid-069-1 | 12:51:47 → 12:51:49 | PASS / 0 | 1.14s | 1.827 | - / 789 / - / - / - / - |
| isolated-valid-069-2 | 12:51:49 → 12:51:51 | PASS / 0 | 1.18s | 1.854 | - / 832 / - / - / - / - |
| isolated-valid-069-3 | 12:51:51 → 12:51:53 | PASS / 0 | 1.17s | 1.859 | - / 824 / - / - / - / - |
| isolated-valid-070-1 | 12:51:53 → 12:51:56 | PASS / 0 | 1.98s | 2.679 | - / - / 1607 / - / - / - |
| isolated-valid-070-2 | 12:51:56 → 12:51:59 | PASS / 0 | 2.23s | 3.06 | - / - / 1785 / - / - / - |
| isolated-valid-070-3 | 12:51:59 → 12:52:02 | PASS / 0 | 2.21s | 3.317 | - / - / 1644 / - / - / - |
| isolated-valid-093-1 | 12:52:02 → 12:52:04 | PASS / 0 | 938ms | 1.731 | - / - / - / 518 / - / - |
| isolated-valid-093-2 | 12:52:04 → 12:52:06 | PASS / 0 | 926ms | 1.763 | - / - / - / 515 / - / - |
| isolated-valid-093-3 | 12:52:06 → 12:52:07 | PASS / 0 | 873ms | 1.673 | - / - / - / 460 / - / - |
| isolated-valid-094-1 | 12:52:07 → 12:52:09 | PASS / 0 | 1.13s | 2.001 | - / - / - / - / 728 / - |
| isolated-valid-094-2 | 12:52:09 → 12:52:12 | PASS / 0 | 1.39s | 2.199 | - / - / - / - / 946 / - |
| isolated-valid-094-3 | 12:52:12 → 12:52:14 | PASS / 0 | 1.13s | 2.003 | - / - / - / - / 744 / - |
| isolated-valid-077-1 | 12:52:14 → 12:52:16 | PASS / 0 | 1.11s | 1.95 | - / - / - / - / - / 930 |
| isolated-valid-077-2 | 12:52:16 → 12:52:17 | PASS / 0 | 1.03s | 1.821 | - / - / - / - / - / 858 |
| isolated-valid-077-3 | 12:52:17 → 12:52:19 | PASS / 0 | 1.17s | 1.934 | - / - / - / - / - / 1007 |
| diagnosis-group-1 | 12:52:36 → 12:52:41 | PASS / 0 | 4.05s | 4.75 | 1202 / 792 / 1294 / 613 / 881 / 1071 |
| diagnosis-group-2 | 12:52:41 → 12:52:47 | PASS / 0 | 5.30s | 6.031 | 1813 / 1032 / 1555 / 817 / 1320 / 1371 |
| diagnosis-full-1 | 12:53:00 → 12:53:13 | PASS / 0 | 12.45s | 13.22 | - / - / - / - / - / - |
| diagnosis-full-2 | 12:53:13 → 12:53:27 | PASS / 0 | 12.52s | 13.32 | - / - / - / - / - / - |
| cleanup-077-1 | 12:53:39 → 12:53:41 | PASS / 0 | 939ms | 1.682 | - / - / - / - / - / 775 |
| cleanup-077-2 | 12:53:41 → 12:53:42 | PASS / 0 | 939ms | 1.611 | - / - / - / - / - / 796 |
| cleanup-077-3 | 12:53:42 → 12:53:44 | PASS / 0 | 900ms | 1.598 | - / - / - / - / - / 756 |
| cleanup-077-4 | 12:53:44 → 12:53:45 | PASS / 0 | 940ms | 1.623 | - / - / - / - / - / 796 |
| cleanup-077-5 | 12:53:45 → 12:53:47 | PASS / 0 | 924ms | 1.588 | - / - / - / - / - / 782 |
| cleanup-077-6 | 12:53:47 → 12:53:49 | PASS / 0 | 929ms | 1.648 | - / - / - / - / - / 786 |
| cleanup-077-7 | 12:53:49 → 12:53:50 | PASS / 0 | 926ms | 1.6 | - / - / - / - / - / 781 |
| cleanup-077-8 | 12:53:50 → 12:53:52 | PASS / 0 | 1.00s | 1.692 | - / - / - / - / - / 854 |
| cleanup-077-9 | 12:53:52 → 12:53:54 | PASS / 0 | 1.04s | 1.808 | - / - / - / - / - / 875 |
| cleanup-077-10 | 12:53:54 → 12:53:56 | PASS / 0 | 1.19s | 1.943 | - / - / - / - / - / 1029 |
| cleanup-077-11 | 12:53:56 → 12:53:58 | PASS / 0 | 1.06s | 1.83 | - / - / - / - / - / 902 |
| cleanup-077-12 | 12:53:58 → 12:53:59 | PASS / 0 | 999ms | 1.742 | - / - / - / - / - / 842 |
| diagnosis-full-verbose-1 | 12:54:21 → 12:54:32 | PASS / 0 | 10.03s | 10.734 | 1889 / 2170 / 4941 / 823 / 1250 / 1607 |
| diagnosis-full-verbose-2 | 12:54:32 → 12:54:45 | PASS / 0 | 12.02s | 12.802 | 3441 / 3055 / 4043 / 1492 / 2461 / 3149 |
| targeted-067-1 | 12:57:00 → 12:57:01 | PASS / 0 | 473ms | 1.185 | 129 / - / - / - / - / - |
| targeted-067-2 | 12:57:01 → 12:57:02 | PASS / 0 | 473ms | 1.134 | 131 / - / - / - / - / - |
| targeted-067-3 | 12:57:02 → 12:57:03 | PASS / 0 | 488ms | 1.147 | 135 / - / - / - / - / - |
| targeted-069-1 | 12:57:03 → 12:57:05 | PASS / 0 | 395ms | 1.062 | - / 41 / - / - / - / - |
| targeted-069-2 | 12:57:05 → 12:57:06 | PASS / 0 | 391ms | 1.125 | - / 38 / - / - / - / - |
| targeted-069-3 | 12:57:06 → 12:57:07 | PASS / 0 | 411ms | 1.064 | - / 41 / - / - / - / - |
| targeted-070-1 | 12:57:07 → 12:57:09 | PASS / 0 | 1.47s | 2.167 | - / - / 1127 / - / - / - |
| targeted-070-2 | 12:57:09 → 12:57:11 | PASS / 0 | 1.55s | 2.212 | - / - / 1176 / - / - / - |
| targeted-070-3 | 12:57:11 → 12:57:13 | PASS / 0 | 1.55s | 2.242 | - / - / 1199 / - / - / - |
| targeted-093-1 | 12:57:13 → 12:57:15 | PASS / 0 | 814ms | 1.539 | - / - / - / 424 / - / - |
| targeted-093-2 | 12:57:15 → 12:57:17 | PASS / 0 | 737ms | 1.466 | - / - / - / 376 / - / - |
| targeted-093-3 | 12:57:17 → 12:57:18 | PASS / 0 | 728ms | 1.4 | - / - / - / 367 / - / - |
| targeted-094-1 | 12:57:18 → 12:57:20 | PASS / 0 | 949ms | 1.646 | - / - / - / - / 576 / - |
| targeted-094-2 | 12:57:20 → 12:57:21 | PASS / 0 | 1.08s | 1.771 | - / - / - / - / 697 / - |
| targeted-094-3 | 12:57:21 → 12:57:23 | PASS / 0 | 927ms | 1.59 | - / - / - / - / 597 / - |
| targeted-077-1 | 12:57:23 → 12:57:25 | PASS / 0 | 1.04s | 1.716 | - / - / - / - / - / 887 |
| targeted-077-2 | 12:57:25 → 12:57:26 | PASS / 0 | 898ms | 1.624 | - / - / - / - / - / 755 |
| targeted-077-3 | 12:57:26 → 12:57:28 | PASS / 0 | 920ms | 1.571 | - / - / - / - / - / 777 |
| targeted-final-067-1 | 12:59:25 → 12:59:26 | PASS / 0 | 483ms | 1.195 | 138 / - / - / - / - / - |
| targeted-final-067-2 | 12:59:26 → 12:59:28 | PASS / 0 | 467ms | 1.122 | 134 / - / - / - / - / - |
| targeted-final-067-3 | 12:59:28 → 12:59:29 | PASS / 0 | 518ms | 1.18 | 152 / - / - / - / - / - |
| targeted-final-069-1 | 12:59:29 → 12:59:30 | PASS / 0 | 399ms | 1.127 | - / 37 / - / - / - / - |
| targeted-final-069-2 | 12:59:30 → 12:59:31 | PASS / 0 | 383ms | 1.045 | - / 39 / - / - / - / - |
| targeted-final-069-3 | 12:59:31 → 12:59:32 | PASS / 0 | 377ms | 1.032 | - / 39 / - / - / - / - |
| targeted-final-070-1 | 12:59:32 → 12:59:34 | PASS / 0 | 1.46s | 2.124 | - / - / 1118 / - / - / - |
| targeted-final-070-2 | 12:59:34 → 12:59:36 | PASS / 0 | 1.53s | 2.195 | - / - / 1184 / - / - / - |
| targeted-final-070-3 | 12:59:36 → 12:59:39 | PASS / 0 | 1.51s | 2.172 | - / - / 1168 / - / - / - |
| targeted-final-093-1 | 12:59:39 → 12:59:40 | PASS / 0 | 806ms | 1.499 | - / - / - / 424 / - / - |
| targeted-final-093-2 | 12:59:40 → 12:59:42 | PASS / 0 | 762ms | 1.459 | - / - / - / 399 / - / - |
| targeted-final-093-3 | 12:59:42 → 12:59:43 | PASS / 0 | 731ms | 1.472 | - / - / - / 383 / - / - |
| targeted-final-094-1 | 12:59:43 → 12:59:45 | PASS / 0 | 985ms | 1.67 | - / - / - / - / 638 / - |
| targeted-final-094-2 | 12:59:45 → 12:59:46 | PASS / 0 | 943ms | 1.623 | - / - / - / - / 590 / - |
| targeted-final-094-3 | 12:59:46 → 12:59:48 | PASS / 0 | 965ms | 1.622 | - / - / - / - / 613 / - |
| targeted-final-077-1 | 12:59:48 → 12:59:50 | PASS / 0 | 920ms | 1.586 | - / - / - / - / - / 778 |
| targeted-final-077-2 | 12:59:50 → 12:59:51 | PASS / 0 | 877ms | 1.59 | - / - / - / - / - / 739 |
| targeted-final-077-3 | 12:59:51 → 12:59:53 | PASS / 0 | 897ms | 1.546 | - / - / - / - / - / 757 |
| post-group-1 | 13:08:40 → 13:08:47 | PASS / 0 | 2.92s | 7.198 | 226 / 51 / 1413 / 588 / 895 / 1242 |
| post-group-2 | 13:08:47 → 13:08:51 | PASS / 0 | 2.56s | 3.223 | 243 / 51 / 1410 / 621 / 927 / 1092 |
| post-group-3 | 13:08:51 → 13:08:54 | PASS / 0 | 2.46s | 3.124 | 211 / 48 / 1351 / 604 / 884 / 1068 |
| post-full-1 | 13:10:09 → 13:10:16 | PASS / 0 | 6.71s | 7.457 | - / - / - / - / - / - |
| post-full-2 | 13:10:16 → 13:10:24 | PASS / 0 | 7.36s | 8.212 | - / - / - / - / - / - |
| harness-final-1 | 13:11:00 → 13:12:54 | PASS / 0 | 7.65s; 2.70s; 397ms; 401ms; 605ms; 731ms; 739ms; 5.11s | 113.177 | - / - / - / - / - / - |
| harness-final-2 | 13:12:54 → 13:14:33 | PASS / 0 | 7.70s; 2.84s; 413ms; 417ms; 668ms; 755ms; 841ms; 5.94s | 99.393 | - / - / - / - / - / - |

## Windows process, cleanup and controlled probe evidence

Natural REG-077 isolated3+additional12, grouped2 and verbose full2 all PASS. Native spawnSync result observed status8, signal null, child.error undefined, completed=true. Each unique %TEMP%/blackjack-m8-harness-* directory was absent after cleanup. Example isolated first fixture basename blackjack-m8-harness-EcLX8O; PID26308/status8; no evidence that the main child was still running. No natural transient owner could be identified.

Controlled probes keep source unchanged beyond the repair under test. A separately spawned hidden PowerShell holder opens fixture npm.cmd with FileShare.Read, denying deletion, writes a ready marker, then releases its handle in finally. Probe starts only inside cleanup after observed completed primary child. Failure recovery belongs only to the external probe and rethrows the original error, so it cannot turn a failing test into PASS; all probe fixtures/markers are removed.

| Probe | Timestamp (+08:00) | Actual result |
| --- | --- | --- |
| Original cleanup,300ms handle |12:55:20–12:55:22|Expected FAIL/1; primary status8/error undefined/completed; rmSync EPERM at %TEMP%/blackjack-m8-harness-09VwZk. After release identical removal succeeded; existsAfter=false. Vitest1failed/1filtered,1.59s.|
| Proposed rmSync maxRetries3/retryDelay100 |12:56:51–12:56:53|FAIL/1; same300ms handle still EPERM at fixture2YYBGG. Vitest1failed/1filtered,1.55s. Proposal rejected from evidence, not claimed stable.|
| Final awaited fs/promises.rm,300ms handle |12:58:54–12:58:56|PASS/0; cleanup621ms,existsAfter=false; completed primary status8. Vitest1passed/1filtered,1.76s.|
| Final awaited cleanup,1500ms handle |12:59:20–12:59:23|PASS/0,cleanup1576ms,existsAfter=false; initial probe expectation FAIL was wrong because Node retries at recursive levels. Evidence corrected without source changes. Vitest2.71s.|
| Final awaited cleanup,10000ms handle |13:00:32–13:00:48|Expected FAIL/1,EBUSY/unlink npm.cmd after3137ms; error propagates and test fails. External probe waits for release/removes fixture,rethrows;existsAfter=false. Vitest15.30s includes probe-only11000ms recovery wait, not production/test cleanup budget.|

Node24.19.0 observed rmSync calls the native binding. Version-matched source excludes std::errc::permission_denied from retryable errors although it later maps that error to Windows EPERM; also its Sleep(i*retryDelay/1000) truncates these millisecond delays. This supports the measured failure of the initial proposal. Final implementation uses the documented promise API with actual known-error retries; its recursive retries can exceed the simple100+200+300ms sum, with controlled exhaustion measured3137ms. Sources: [version-matched Node code](https://github.com/nodejs/node/blob/v24.19.0/src/node_file.cc#L1534-L1627), [Node fsPromises.rm](https://nodejs.org/docs/latest-v24.x/api/fs.html#fspromisesrmpath-options).

## Failed tooling attempts retained

Initial sandbox Git reads at12:47:56 failed dubious ownership; owner-context baseline passed12:48:07 without config change. Temporary preload startup12:49–12:51:22 failed MODULE_NOT_FOUND because Windows backslashes were consumed in NODE_OPTIONS; no tests executed, therefore BLOCKED test execution, not workload FAIL. The runner mistakenly repeated that startup failure before correcting the forward-slash path; those36 command exits1 remain in temporary runs.jsonl, excluded from valid-run table. No repair count during diagnosis. Later Python documentation command failed because python was unavailable (no writes); an orchestration string parsing error also occurred before writes; native Node/apply_patch completed documentation. No failures erased or counted as successful tests.

## Repair ledger and pending final receipt

First implementation/first validation do not increment. The evidence-driven corrective cycle from failed rmSync proposal to awaited cleanup increments the existing T07 cumulative1->2. Actual M8 ledger0,2,3,2,2,1,2,6,4. Diagnosis adds0; no new task/ledger reset, no product change. All earlier M1-M7 ledgers unchanged. All required final grouped/full/harness checks executed and PASS; see full receipts below.

Domain diff EMPTY; final Vitest66files/956tests,1Chromium project/44tests,96 unique REG-M8 owners, all M1-M7 preservation PASS. Publication follows; exact hashes/parity/clean are recorded in STATE/log and final delivery. MEDIUM-05 remains OPEN pending independent recheck; M8 ACCEPTED = NO; deployment NOT RUN.

## Final VERIFIED stability receipts (2026-10-01 13:15:50 +08:00)

Required final stability PASS: six targeted tests x3 (12:59:25-12:59:53), grouped four suites x3/37tests (13:08:40-13:08:54; Vitest2.92/2.56/2.46s; wall7.198/3.223/3.124s), full npm.cmd test x2/66files/956tests (13:10:09-13:10:16,6.71s/wall7.457s;13:10:16-13:10:24,7.36s/wall8.212s).

Official harness#1 PASS/0 at13:11:00-13:12:54,wall113.177s, Vitest66/956/7.65s, Chromium44/41.0s. Official harness#2 PASS/0 at13:12:54-13:14:33,wall99.393s, Vitest66/956/7.70s, Chromium44/41.1s. Both include typecheck/lint/domain isolation/build/fixture exclusion/secrecy/96 exact REG-M8 owners and mandatory preservation M1 12/155,M2 6/78,M3 5/72,M4 7/171,M5 8/168,M6 9/181,M7 56/870 plus24Chromium (19.8s/19.9s), all PASS.

No executable/test/dependency/runtime changes after the successful final harness. Domain diff EMPTY; only factual evidence/status updates follow. Actual ledger0,2,3,2,2,1,2,6,4; independent recheck NOT RUN, M8 ACCEPTED NO, deployment NOT RUN. Normal authorized coherent commit/push/fetch follows; actual commit/parity receipt recorded after publication.
