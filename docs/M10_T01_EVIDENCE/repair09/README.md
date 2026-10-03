# M10-T01 UI composition repair9/10 and10/10 evidence

## Current result

**M10-T01_BLOCKED.** Final desktop Stand bottom is908.703125px, exceeding the unchanged900px gate in both M10-E01 and M9-E01. Product repair9 measured925.328125px; the targeted final repair10 improved the position but still failed. Cumulative T01 repairs **10/10**. Product work stopped; no commit, push, deployment or later milestone implementation. Further product repair requires explicit owner authorization. Planning repair3/10 CLOSED remains separate. Human visual acceptance and fresh independent review NOT RUN.

Baseline: main/9ca8082b8ce5f9ae7aa90e07356be48c3a6ca2d1, clean/no untracked at2026-10-03 22:03:21 +08:00. Live fetch at22:04:05 PASS/0, origin/main same SHA, ahead/behind0/0. Recommended GPT Sol6.1/High; client metadata supports gpt-6.1-sol/High, actual runtime model/effort NOT VERIFIED/NOT VERIFIED. No delegation.

## Executed checks

| Check | Result | Receipt / exact retained raw output |
| --- | --- | --- |
| Initial focused Vitest | PASS/0, four actual files/23 tests; nonexistent m9/presentation pattern matched no file | [stage-A.json](stage-A.json), [stage-A.log.gz](stage-A.log.gz) |
| Initial typecheck/lint | PASS/0; final correction changed CSS only | [static-initial.json](static-initial.json), [typecheck](typecheck-initial.log.gz), [lint](lint-initial.log.gz) |
| Repair9 focused Chromium | FAIL/1,18 PASS/2 FAIL of20; Stand925.328125px | [stage-B-initial.json](stage-B-initial.json), [raw stream](stage-B-initial.log.gz) |
| Final focused Vitest | PASS/0, five files/42 tests | [stage-A-final.json](stage-A-final.json), [raw stream](stage-A-final.log.gz) |
| Repair10 focused Chromium | FAIL/1,18 PASS/2 FAIL of20; Stand908.703125px | [stage-B-final.json](stage-B-final.json), [raw stream](stage-B-final.log.gz) |
| Character audit/reproduction | PASS/0,12 source/12 production240x320 transparent PNGs unchanged | [character-assets.json](character-assets.json), [raw stream](character-assets.log.gz) |
| Administrative documentation closure | PASS/0, five files/13 tests; not complete product verification | [documentation-final.json](documentation-final.json), [raw stream](documentation-final.log.gz) |
| Full Vitest / full Chromium | NOT RUN; expected inventories1047/67 are not executed counts | Prior focused gate failed at10/10 |
| Independent M1–M8 executable preservation / final verify.ps1 | NOT RUN; required complete verification BLOCKED | Prior focused gate failed at10/10 |
| Actual browser200% zoom | NOT RUN | 200% root-text enlargement is a different bounded check |

Focused scenarios preserve five real cards, four real ordered split leaves, exact900 available/100 committed/0 returned public facts, focus/keyboard, reduced motion, broken portraits, all12 PA1 portraits and read-only canonical evidence. Tablet/mobile bounded normal/stress checks PASS; overall desktop gate FAIL. Full product acceptance is not established by these partial results.

## Actual visual inspection

All15 final PNGs below were inspected in the same session; [dimensions, SHA256 and findings](visual-review.json). Captures are full-page outputs at1280x900,768x1024,320x720. They show a scene with cohesive seats, a stronger existing temporary Dealer, local hand/card priority, felt rules and a connected action/credit dock. Desktop control height remains the blocker. Full-page screenshot height is not a proof that every control fits the viewport.

| Scenario | Desktop1280 | Tablet768 | Mobile320 |
| --- | --- | --- | --- |
| Open | [PNG](scene-open-1280.png) | [PNG](scene-open-768.png) | [PNG](scene-open-320.png) |
| Dealt | [PNG](scene-dealt-1280.png) | [PNG](scene-dealt-768.png) | [PNG](scene-dealt-320.png) |
| Five cards | [PNG](five-cards-1280.png) | [PNG](five-cards-768.png) | [PNG](five-cards-320.png) |
| Four split leaves | [PNG](four-leaves-1280.png) | [PNG](four-leaves-768.png) | [PNG](four-leaves-320.png) |
| 200% text / fallback | [PNG](text-fallback-1280.png) | [PNG](text-fallback-768.png) | [PNG](text-fallback-320.png) |

Before: [desktop open](before-open-1280.png), dealt [1280](before-dealt-1280.png)/[768](before-dealt-768.png)/[320](before-dealt-320.png), [measurements](before-composition.json). Repair9 candidate: [desktop open](candidate-open-1280.png), dealt [1280](candidate-dealt-1280.png)/[768](candidate-dealt-768.png)/[320](candidate-dealt-320.png), [measurements](candidate-composition.json). Candidate images are retained failed-version evidence, not the final CSS version.

## Failures and immutable evidence

Both initial and final failure archives retain M10-E01 and M9-E01 screenshots, error contexts and nested Playwright traces. [Initial archive](stage-B-initial-artifacts.zip) / [entry hashes](initial-artifacts.json); [final archive](stage-B-final-artifacts.zip) / [entry hashes](final-artifacts.json). All12 archive entries were read back and matched recorded SHA256/bytes. [Archive integrity and privacy inspection](archive-integrity-privacy.json) records58 plaintext inspections, no targeted credential-pattern hits, and local127.0.0.1:4173 HTTP/WebSocket trace origins. Captures use fictional roster/credits and ordinary local workspace paths; no session transcript is included. This bounded inspection is not a general security audit.

[Incoming protected hashes](before.json) contain303 files, including the two authorized UI sources. [Protected after receipt](protected-after.json) compares the other301 exactly: domain/browser orchestration/pure geometry, PA1 sources/production/canonical PNGs, dependencies/runtime/scripts and prior T01 evidence unchanged. No accepted PA1 reference was written or restored. The focused original-test byte guard also passed.

The focused harness regenerated exactly12 known historical PNGs: nine current T01 stress captures are retained here, and three generated M9 outputs are retained in [generated-historical-m9.zip](generated-historical-m9.zip). Only those known generated files were restored to their incoming Git bytes. [Restoration mapping](historical-restoration.json) records original/generated/restored hashes. Earlier failed attempts remain preserved.

Raw generated logs are stored losslessly as gzip. [Raw/gzip hashes and round-trip proof](raw-log-archives.json) verify exact bytes; only duplicate task-owned raw files were removed after successful decompression comparison. [Retained file inventory](files.json) excludes its own self-referential hash. [Final administrative closure](administrative-final.json) and [live Git receipt](git-final.json) describe the uncommitted blocked draft, not a publication.

Authoritative scope/status: [M10_T01](../../M10_T01.md), [STATE](../../STATE.md), [PLAN](../../PLAN.md). M10-T02 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE; T04+ NOT STARTED. No player-count logic, formal Dealer art, new animation, Motion dependency or deployment.
