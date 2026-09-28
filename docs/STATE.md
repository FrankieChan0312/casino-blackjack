# Casino Blackjack — Project State

Document date: 2026-09-28  
Document task: STATE-1.0  
Intended repository location: `docs/STATE.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Current milestone: `M1 — Headless Blackjack Core`  
Current task: `M1-T05 — Hand Evaluation and Natural Blackjack`
Status: M1-T05 IMPLEMENTED / VERIFIED; awaiting user acceptance and checkpoint commit; repair cycles 1/10. M1-T04 remains IMPLEMENTED / VERIFIED / ACCEPTED / COMMITTED / PUSHED, repair cycles 0/10. M1-T03 remains VERIFIED / ACCEPTED / COMMITTED / PUSHED, repair cycles 0/10. M1-T02 remains VERIFIED / ACCEPTED / COMMITTED / PUSHED, repair cycles 1/10. M1-T01 remains VERIFIED / ACCEPTED / COMMITTED / PUSHED, repair cycles 2/10. M1-T06 remains NOT STARTED.

## 1. Current truth

M1-T05 baseline at `2026-09-28 21:41:40 +08:00`: main, HEAD and origin/main both `4a25516854399587ec4f5dd47f8d8e5fc0096098`, clean working tree, behind/ahead 0/0. M1-T04 was explicitly accepted and committed at `2026-09-28 21:36:17 +08:00` as `feat: add shoe accounting and lifecycle`. The user supplied publication parity at `2026-09-28 21:38:53 +08:00`; fresh local parity corroborates that baseline. No separate publication-metadata commit is created. M1-T05 adds pure scoring and explicit original-hand natural eligibility only. First full verification at 21:43:22-21:43:27 +08:00 passed typecheck, lint and 5 files / 66 tests. A no-index exit-code handling repair was verified at 21:44:43 +08:00; source/tests were unchanged. No M1-T05 acceptance, commit or push has occurred.

M1-T04 baseline at `2026-09-28 21:19:50 +08:00`: main, HEAD and origin/main both `3145254ad19a9c8f7fd87bc1271c5c4950e94da4`, clean working tree, behind/ahead 0/0. The user supplied publication parity at `2026-09-28 21:15:16 +08:00`; it is recorded within this task, without a separate metadata commit. M1-T03 was explicitly accepted and committed at `2026-09-28 21:11:29 +08:00` as `feat: add deterministic shuffle and cut selection`, then pushed according to that user evidence and fresh local parity. M1-T04 first verification at 21:22:50 +08:00 passed typecheck, lint, 4 files / 29 tests. Git whitespace/status/diff review passed at 21:26:06 +08:00; same-session task review completed at 21:27:59 +08:00. Subsequent M1-T04 acceptance, commit and publication are recorded in the M1-T05 baseline above.

M1-T03 baseline at `2026-09-28 20:53:02 +08:00`: branch main, HEAD and origin/main both `a424ba5ca4de7ae28416b8d44420f7911d0fab75`, clean working tree, behind/ahead 0/0. The user supplied publication parity at `2026-09-28 20:49:10 +08:00`; this task records that push evidence without a separate metadata commit. Baseline harness PASS: typecheck, lint, 2 files / 7 tests. M1-T03 adds only RandomSource, a production adapter, copying Fisher-Yates shuffle, and cut selection. First implementation verification at 20:57:13 +08:00 passed typecheck, lint, 3 files / 17 tests; Git whitespace/status/diff checks passed at 20:58:32 +08:00. Source/test diff review found no unrelated implementation or M1-T04 state at that checkpoint. Subsequent acceptance, commit and publication are recorded in the M1-T04 baseline above.

M1-T02 baseline at `2026-09-28 20:23:41 +08:00`: main and origin/main both `a1649501dd1b180e96ca6a766ec0fd00fab54c70`, upstream origin/main, ahead/behind 0/0, and a clean working tree. The user supplied publication parity verification at `2026-09-28 20:18:58 +08:00`; it is recorded within this task rather than in another metadata-only commit. Baseline harness verification passed (2 existing tests). M1-T02 adds only the physical-card model and deterministic six-deck construction. Its first full verification at `2026-09-28 20:27:41 +08:00` passed typecheck, lint, and 7 tests (5 inventory + 2 harness). After one README whitespace repair, Git checks passed at 20:32:52 +08:00 and the full harness passed again at 20:33:05 +08:00. Task review completed at 20:33:19 +08:00; final exact-version checks passed at 20:35:02-20:35:09 +08:00.

The user explicitly confirms that M1-T02 was accepted before its checkpoint commit. Accepted implementation: `28bf85d5f172221efef9bc1e428ff73e88b6d98e`, committed on main at `2026-09-28 20:40:53 +08:00` with message `feat: add six-deck physical card inventory`. The earlier completion report stating "not yet ACCEPTED" is superseded by this acceptance evidence. At the acceptance-metadata baseline, `2026-09-28 20:42:43 +08:00`, HEAD was that implementation commit, the working tree was clean, and main was ahead of origin/main by 1 and behind by 0. The separate acceptance metadata was committed as a424ba5ca4de7ae28416b8d44420f7911d0fab75. Both commits are now published according to the user evidence and M1-T03 parity baseline above.

The Casino Blackjack repository directory now exists on the user's Windows machine and has been initialized as a local Git repository.

Observed bootstrap evidence:

- initial target-path check: `2026-09-28 16:03:16 +08:00` — target path did not exist;
- repository creation started: `2026-09-28 16:04:30 +08:00`;
- Git repository initialized on branch `main`;
- baseline completion: `2026-09-28 16:06:08 +08:00` to `2026-09-28 16:06:09 +08:00`;
- Git `HEAD`: `NO COMMIT`;
- working tree: clean;
- remote: none configured;
- Git: `2.45.1.windows.1`;
- Node: `v24.19.0`;
- npm: `11.17.0`;
- Windows PowerShell: `5.1.26100.9444`.

The list above is the historical pre-import baseline. At `2026-09-28 16:17:19 +08:00`, the post-import baseline confirmed the same repository, main branch, NO COMMIT, and NO REMOTE. All 11 imported documents plus the transfer manifest were untracked; no unknown overlapping files were found. At `16:17:20 +08:00`, every imported document matched SEED_MANIFEST.sha256. See DEVELOPMENT_LOG.md for executed commands and transfer evidence.

At `2026-09-28 16:29:57 +08:00`, the minimal TypeScript/Vitest/ESLint setup and two document-harness tests were installed. Initial verification passed; deliberate typecheck failure returned exit 2 while later checks passed. The fixture was restored byte-for-byte, and the full verification at `2026-09-28 16:33:03 +08:00` passed (exit 0; 1 test file, 2 tests). The task review completed at `2026-09-28 16:36:03 +08:00`. See DEVELOPMENT_LOG.md for executable-file hashes, final verification, and command-repair evidence. No Blackjack source code existed at that bootstrap checkpoint.

## 2. Delivery state

Initial GitHub publication was verified at `2026-09-28 19:50:22 +08:00` according to the user's publication evidence. Public repository: [FrankieChan0312/casino-blackjack](https://github.com/FrankieChan0312/casino-blackjack). Origin fetch/push URL: `https://github.com/FrankieChan0312/casino-blackjack.git`. At publication, local `main` and `origin/main` both pointed to `bf7c21a46e61784234658a21c31fdbf1cac8048e`, main tracked origin/main, and the working tree was clean.

That initial parity and clean baseline were independently observed locally at `2026-09-28 19:54:10 +08:00` (ahead/behind `0/0`). An unauthenticated GitHub API check at `2026-09-28 19:54:51 +08:00` confirmed public visibility, default branch main, and the same remote main SHA. The later publication-evidence commit a1649501dd1b180e96ca6a766ec0fd00fab54c70 was subsequently pushed, as reported by the user at 20:18:58 +08:00 and corroborated by the M1-T02 local baseline. Publication now includes M1-T04 through 4a25516854399587ec4f5dd47f8d8e5fc0096098 as recorded above. No M1-T05 push is authorized.

Local implementation checkpoint: `56020d60ff41b54d0c345068befddf2790390cea`, branch `main`, committed at `2026-09-28 19:19:50 +08:00` with message `chore: bootstrap M1 TypeScript verification harness`. All 18 reviewed files were committed with byte-identical staged content. The working tree was clean immediately after that commit. This metadata and the matching DEVELOPMENT_LOG.md entries belong to a separate docs-only checkpoint; the implementation checkpoint does not contain them. Git history identifies the metadata commit without requiring a self-referential hash update.

| Item | State | Evidence / note |
| --- | --- | --- |
| Repository folder on Windows | `PASS` | Created and observed at the agreed path during M1-T01. |
| Git repository initialized | `PASS` | Local repository initialized on `main`. |
| Git branch | `main` | Observed during M1-T01 baseline. |
| Implementation commit | `56020d60ff41b54d0c345068befddf2790390cea` | Local checkpoint, 2026-09-28 19:19:50 +08:00. |
| Publication checkpoint baseline | `clean` | At 2026-09-28 19:54:10 +08:00, HEAD and origin/main both equalled bf7c21a46e61784234658a21c31fdbf1cac8048e. |
| Remote repository | `Public` | https://github.com/FrankieChan0312/casino-blackjack; origin uses the .git URL above. |
| Branch upstream | `origin/main` | Local main tracks origin/main; publication parity was 0 ahead / 0 behind. |
| Initial GitHub publication | `PASS` | User verification at 2026-09-28 19:50:22 +08:00; local and public-API evidence corroborated bf7c21a46e61784234658a21c31fdbf1cac8048e. |
| Publication-evidence commit push | `PASS` | User evidence at 20:18:58 +08:00; a1649501dd1b180e96ca6a766ec0fd00fab54c70 parity confirmed at M1-T02 baseline. |
| M1 implementation | `IN PROGRESS` | Inventory, randomness, shoe lifecycle and pure hand evaluation; no Round/Game/Dealer/outcome orchestration. |
| M1-T02 inventory | `VERIFIED` | src/domain/card.ts and five inventory unit tests; full harness and task review passed. |
| M1-T02 user acceptance | `ACCEPTED` | User explicitly confirms acceptance before the checkpoint commit; recorded in this metadata checkpoint. |
| M1-T02 implementation commit | `COMMITTED` | 28bf85d5f172221efef9bc1e428ff73e88b6d98e, 2026-09-28 20:40:53 +08:00; only the six verified task files. |
| M1-T02 push | `PASS` | User parity evidence at 20:49:10 +08:00; main/origin/main a424ba5ca4de7ae28416b8d44420f7911d0fab75 corroborated at the M1-T03 baseline. |
| M1-T03 randomness / shuffle / cut selection | `VERIFIED` | Full harness and task review PASS. Cut lifetime storage belongs to M1-T04. |
| M1-T03 acceptance / commit / push | `ACCEPTED` / `COMMITTED` / `PUSHED` | User acceptance; implementation 3145254ad19a9c8f7fd87bc1271c5c4950e94da4; parity at M1-T04 baseline. |
| M1-T04 shoe accounting / lifecycle | `VERIFIED` | Full harness and same-session task review PASS; 12 new tests. |
| M1-T04 acceptance / commit / push | `ACCEPTED` / `COMMITTED` / `PUSHED` | 4a25516854399587ec4f5dd47f8d8e5fc0096098; user acceptance and publication evidence corroborated by the M1-T05 baseline. |
| M1-T05 hand evaluation / natural classification | `VERIFIED` | Full harness PASS; 37 new tests and complete task diff review PASS. |
| M1-T05 acceptance / commit / push | `NOT RUN` | Stop before checkpoint commit; no push authorized. |
| M1-T01 harness | `VERIFIED` | Typecheck, lint, 2 tests, and failure-propagation self-test passed. |
| Full M1 automated verification | `NOT RUN` | Inventory and harness checks PASS; full gameplay regression belongs to later tasks. |
| M1 fresh-session review | `NOT RUN` | Review occurs after M1 implementation/verification. |
| M1 user acceptance | `NOT RUN` | User acceptance can occur only after verified delivery. |
| M1-T01 user acceptance | `ACCEPTED` | User explicitly accepted M1-T01 for the local checkpoint commit. |
| Implementation commit | `PASS` | Exact requested message; 18 intended files committed. It is included in the published history. |
| Deployment | `NOT APPLICABLE` | M1 is a headless local engine milestone. |

## 3. Approved planning baseline

The current planning baseline is:

- House rules: `Blackjack House Rules v1.1`
- Specification: `SPEC-1.0`
- Design: `DESIGN-1.0`
- Plan: `PLAN-1.0`
- Repository path:
  `C:\Users\user\Documents\GitHub\casino-blackjack`
- Recommended Codex model: `GPT-6 Astra`
- Recommended reasoning/effort: `High`
- Actual Codex runtime model/effort: `NOT VERIFIED`

These planning versions define intent only. They do not prove implementation.

## 4. Current scope

Current executable milestone:

`M1 — Headless Blackjack Core`

Current executable task:

`M1-T05 — Hand Evaluation and Natural Blackjack`

Current task scope is pure evaluateHand with derived total/isSoft/isBust/isTwentyOne and separate isNaturalBlackjack with required originalHandEligible input. AC-M1-008/009 are covered at pure-function level. There is no mutable Hand state or split ancestry; the boolean context is explicitly required by this task. No RoundState, GameState, dealer policy, outcome resolution, initial dealing, public view, UI, wagering, replay or future abstraction is included. Existing shoe lifecycle remains unchanged.

M1 remains:

- one-seat;
- no-wager;
- headless;
- deterministic/testable;
- TypeScript domain-engine focused.

M1 does **not** implement:

- multiple seats;
- computer players;
- simulated balances;
- main wagers;
- Double;
- Split/Re-split;
- Surrender;
- Insurance;
- Even Money;
- side bets;
- Bet Behind;
- Five-Card Charlie;
- browser UI;
- network multiplayer;
- deployment.

## 5. Repair-cycle ledger

Repair cycles are cumulative per substantive task and do not reset across sessions, models, agents, branches, or renaming.

| Task ID | Repair cycles used | Limit | Status |
| --- | ---: | ---: | --- |
| `M1-T01` | 2 | 10 | `VERIFIED` |
| `M1-T02` | 1 | 10 | `VERIFIED` |
| `M1-T03` | 0 | 10 | `VERIFIED` |
| `M1-T04` | 0 | 10 | `VERIFIED` |
| `M1-T05` | 1 | 10 | `VERIFIED` |
| `M1-T06` | 0 | 10 | `NOT STARTED` |
| `M1-T07` | 0 | 10 | `NOT STARTED` |
| `M1-T08` | 0 | 10 | `NOT STARTED` |
| `M1-T09` | 0 | 10 | `NOT STARTED` |
| `M1-T10` | 0 | 10 | `NOT STARTED` |

M1-T02 repair cycles are 1/10. The first implementation and first full validation passed; the later git diff --check failed on trailing spaces in the changed README status line. Cycle 1 removed only those spaces and re-ran the whitespace check and full harness successfully. A rejected patch before the first implementation-plus-validation wrote no files and consumed no cycle; all evidence is retained in DEVELOPMENT_LOG.md. M1-T01 remains 2/10 for its two recorded review-command repairs (PowerShell inline quoting and lockfile JSON parsing). No count was reset.

## 6. Verification state

M1-T05 first implementation and full validation passed. Repair cycle 1 corrected a review command that stopped on the expected no-index difference exit code 1; both new-file whitespace checks and remaining Git checks then passed with no whitespace diagnostics. No production/test fix or check weakening occurred. See DEVELOPMENT_LOG.md for failure evidence, hypothesis, correction and re-verification. Existing task counts remain unchanged.

M1-T03 first implementation verification and task review passed without repairs. M1-T03 repairs remain 0/10; M1-T02 remains 1/10 and M1-T01 remains 2/10. No counter was reset and no failing check was bypassed.

M1-T04's first implementation and full validation passed without repairs (0/10). The shoe tests independently check live/in-play/discard accounting and lifecycle operations. Full M1 gameplay orchestration and milestone verification remain incomplete.

| Check | State | Note |
| --- | --- | --- |
| `scripts/verify.ps1` | `PASS` | M1-T05 first run at 2026-09-28 21:43:22-21:43:27 +08:00, exit 0; typecheck, lint, 5 files / 66 tests passed. |
| TypeScript typecheck | `PASS` | `npm run typecheck`, exit 0. |
| Lint | `PASS` | `npm run lint`, exit 0. |
| Harness tests | `PASS` | `npm run test`, exit 0; 1 file, 2 tests. |
| Failure propagation self-test | `PASS` | Historical M1-T01 evidence: deliberate type error returned overall exit 2; fixture restored. Harness unchanged in M1-T02. |
| Inventory unit tests | `PASS` | 5 tests: 312 cards/IDs, exact ranks/suits, six copies, six complete decks, and deterministic full order. |
| Randomness / shuffle / cut tests | `PASS` | 10 tests: adapter bounds, scripted order/repeat, input and 312-card preservation, invalid source outputs, endpoints and all 31 cut positions. |
| Shoe accounting / lifecycle tests | `PASS` | 12 cases: fresh/single/all draws, completion, cut hit/crossing, reuse, 0..4 minimum guard, retirement/exhaustion, deterministic replacement. |
| Hand evaluation / natural tests | `PASS` | 37 cases: explicit ranks/totals/flags, multiple Aces, bust, original eligibility, both card orders, empty boundary and frozen-input/shoe purity. |
| M1-T05 complete task review and Git checks | `PASS` | New-file diffs reviewed; no-index whitespace and git diff --check/status passed at 21:44:43 +08:00 after command repair. Full tracked documentation diff and Git checks passed at 21:49:20 +08:00; only six intended files. |
| M1-T04 diff / status / task review | `PASS` | Git whitespace/status/tracked diff at 21:26:06 +08:00, complete new-file diff reviewed; only six intended files. Review completed at 21:27:59 +08:00. |
| M1-T03 diff / status / task review | `PASS` | git diff --check and status exited 0 at 20:58:32 +08:00; exact tracked diff and three new-file no-index diffs reviewed. Only seven intended files changed. |
| Integration tests | `NOT RUN` | No implementation/test suite exists yet. |
| Browser/E2E tests | `NOT APPLICABLE` | M1 has no browser UI. |
| M1-T02 `git diff --check` | `PASS` | Exit 0 at 20:32:52 +08:00 after cycle 1; new files also inspected with no-index checks. |
| M1-T02 final task review | `PASS` | Completed at 20:33:19 +08:00: exact tracked diff and both new-file diffs inspected; only six intended files. |

Gameplay-flow integration checks remain NOT RUN. Fresh-session milestone review is NOT RUN; same-session task review is not independent review.

## 7. Known blockers

Current blocker status: none after approved Git/registry access. The earlier transfer blocker is resolved: files are present and all transfer hashes matched. Sandbox Git ownership and registry access limitations were observed and resolved through approved external execution; no global Git configuration was changed.

However, M1-T01 must inspect the actual Windows target directory before modification. If the folder already contains unknown files, another Git repository, or overlapping user changes, the affected bootstrap work must stop and report the condition before writing over it.

## 8. Known risks and watch items

### Repository-state uncertainty

The repository is on branch `main`, tracking `origin/main`. M1-T05 base HEAD and origin/main are 4a25516854399587ec4f5dd47f8d8e5fc0096098 (ahead 0 / behind 0). Earlier accepted implementation history is unchanged. M1-T05 is an uncommitted diff on that published baseline; no history has been rewritten and no push occurred in this task.

### Planning artifact placement

All approved documents are now present and their transfer hashes passed before edits.

### Tool/version uncertainty

Observed Node v24.19.0 and npm 11.17.0. Installed direct development dependencies are TypeScript 6.0.3, Vitest 5.0.2, Vite 8.3.1, ESLint 10.11.0, @eslint/js 10.0.1, typescript-eslint 8.70.1, and @types/node 24.19.0. Registry peer/engine compatibility, `npm ls --depth=0`, and executable validation passed. package-lock.json pins the dependency tree. A separate clean-machine `npm ci` reproduction is NOT RUN.

### GitHub publication boundary

The public repository, origin URL, upstream, and initial publication parity are verified as recorded above. The supplied publication timestamp and the later independent observation timestamps are distinct evidence.

Do not change visibility or perform another push without authorization for that operation and commit.

## 9. Next executable task

M1-T05 is VERIFIED and awaits explicit user acceptance and checkpoint-commit authorization. Proposed commit: `feat: add blackjack hand evaluation`. No M1-T05 commit/push or M1-T06 implementation is authorized.

Next implementation task after that checkpoint:

`M1-T06 — Round State, Initial Deal, Public View, and Natural Resolution` (NOT STARTED; separate authorization required).

Completed baseline actions (historical):

```powershell
Set-Location "C:\Users\user\Documents\GitHub\casino-blackjack"

Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
Get-Location

git rev-parse --is-inside-work-tree
git branch --show-current
git rev-parse HEAD
git status --short
```

The Git commands may legitimately fail if the folder is new or not yet initialized. Record the actual result rather than hiding or replacing it.

Before creating files, inspect the directory contents and confirm that no unknown overlapping work would be overwritten.

## 10. M1-T01 success condition

M1-T01 may be marked `VERIFIED` only after:

- the actual repository baseline is captured;
- the approved documents are placed at their intended paths;
- the minimal TypeScript/test/lint harness is installed/configured;
- `scripts/verify.ps1` exists and correctly propagates failures;
- the required baseline checks execute successfully;
- timestamped evidence is written to `docs/DEVELOPMENT_LOG.md`;
- state/plan records match the real repository;
- the task diff contains no unrelated modifications;
- any commit/push status is recorded separately and truthfully.

These M1-T01 conditions have been met. M1-T01 remains VERIFIED and ACCEPTED, with its publication-evidence commit a1649501dd1b180e96ca6a766ec0fd00fab54c70 pushed as recorded in the M1-T02 baseline. Fresh-session milestone review remains uncompleted. M1-T01 repair cycles remain 2/10; M1-T02 is tracked separately.

## 11. Completion vocabulary

Use these terms exactly:

- `IMPLEMENTED` — files/code changed; no verification implied.
- `VERIFIED` — exact deliverable version passed every required check.
- `ACCEPTED` — user explicitly accepted the verified result.
- `DEPLOYED` — version actually deployed and required post-deployment checks passed.

For M1, `DEPLOYED` is not a completion target.
