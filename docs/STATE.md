# Casino Blackjack — Project State

Document date: 2026-09-28  
Document task: STATE-1.0  
Intended repository location: `docs/STATE.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Current milestone: `M1 — Headless Blackjack Core`  
Current task: `M1-T01 — Repository Bootstrap and Engineering Harness`  
Status: M1-T01 VERIFIED and explicitly ACCEPTED for the local checkpoint, committed as 56020d60ff41b54d0c345068befddf2790390cea. M1 gameplay remains NOT STARTED.

## 1. Current truth

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

At `2026-09-28 16:29:57 +08:00`, the minimal TypeScript/Vitest/ESLint setup and two document-harness tests were installed. Initial verification passed; deliberate typecheck failure returned exit 2 while later checks passed. The fixture was restored byte-for-byte, and the full verification at `2026-09-28 16:33:03 +08:00` passed (exit 0; 1 test file, 2 tests). The task review completed at `2026-09-28 16:36:03 +08:00`. See DEVELOPMENT_LOG.md for executable-file hashes, final verification, and command-repair evidence. No Blackjack source code exists.

## 2. Delivery state

Initial GitHub publication was verified at `2026-09-28 19:50:22 +08:00` according to the user's publication evidence. Public repository: [FrankieChan0312/casino-blackjack](https://github.com/FrankieChan0312/casino-blackjack). Origin fetch/push URL: `https://github.com/FrankieChan0312/casino-blackjack.git`. At publication, local `main` and `origin/main` both pointed to `bf7c21a46e61784234658a21c31fdbf1cac8048e`, main tracked origin/main, and the working tree was clean.

This parity and clean baseline were independently observed locally at `2026-09-28 19:54:10 +08:00` (ahead/behind `0/0`). An unauthenticated GitHub API check at `2026-09-28 19:54:51 +08:00` confirmed public visibility, default branch main, and the same remote main SHA. This publication-evidence checkpoint is local-only: creating it will put main one commit ahead of the published checkpoint until a separately authorized push occurs. No new push is authorized here.

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
| Publication-evidence commit push | `NOT RUN` | This new documentation checkpoint is local-only; no additional push authorized. |
| M1 implementation | `NOT STARTED` | No gameplay source code implemented. |
| M1-T01 harness | `VERIFIED` | Typecheck, lint, 2 tests, and failure-propagation self-test passed. |
| M1 automated verification | `NOT RUN` | Gameplay tests belong to later M1 tasks. |
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

`M1-T01 — Repository Bootstrap and Engineering Harness`

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
| `M1-T02` | 0 | 10 | `NOT STARTED` |
| `M1-T03` | 0 | 10 | `NOT STARTED` |
| `M1-T04` | 0 | 10 | `NOT STARTED` |
| `M1-T05` | 0 | 10 | `NOT STARTED` |
| `M1-T06` | 0 | 10 | `NOT STARTED` |
| `M1-T07` | 0 | 10 | `NOT STARTED` |
| `M1-T08` | 0 | 10 | `NOT STARTED` |
| `M1-T09` | 0 | 10 | `NOT STARTED` |
| `M1-T10` | 0 | 10 | `NOT STARTED` |

Repair cycles are 2/10. Both are review-command repairs after first validation: (1) PowerShell/Node inline quoting, (2) PowerShell 5.1 ConvertFrom-Json rejecting the lockfile's empty root key. Each was corrected and re-verified; neither required a harness/configuration/test change. They are conservatively counted under the task's broad repair rule. Initial baseline access failures and the planned, successful failure-injection self-test do not consume a cycle. No count was reset.

## 6. Verification state

Seed-transfer verification passed for all 11 documents. M1-T01 verification is complete; this does not verify the future M1 gameplay milestone.

| Check | State | Note |
| --- | --- | --- |
| `scripts/verify.ps1` | `PASS` | Final run at 2026-09-28 16:38:05 +08:00, exit 0; executable hashes in DEVELOPMENT_LOG.md. |
| TypeScript typecheck | `PASS` | `npm run typecheck`, exit 0. |
| Lint | `PASS` | `npm run lint`, exit 0. |
| Harness tests | `PASS` | `npm run test`, exit 0; 1 file, 2 tests. |
| Failure propagation self-test | `PASS` | Deliberate type error: typecheck FAIL/2; lint and tests PASS; overall exit 2. Original fixture hash restored. |
| Unit tests | `NOT RUN` | No gameplay implementation/test suite exists yet. |
| Integration tests | `NOT RUN` | No implementation/test suite exists yet. |
| Browser/E2E tests | `NOT APPLICABLE` | M1 has no browser UI. |
| `git diff --check` | `PASS` | Final Git inspection at 2026-09-28 19:12:52 +08:00, exit 0; unborn repository has untracked files, so this alone does not check their contents. |
| Final task addition review | `PASS` | Read new files, inspected no-index diffs, checked lockfile consistency and unchanged seed hashes. No unrelated implementation found. |

Gameplay unit/integration checks remain NOT RUN. Fresh-session milestone review is NOT RUN; the same-session task review is not independent review.

## 7. Known blockers

Current blocker status: none after approved Git/registry access. The earlier transfer blocker is resolved: files are present and all transfer hashes matched. Sandbox Git ownership and registry access limitations were observed and resolved through approved external execution; no global Git configuration was changed.

However, M1-T01 must inspect the actual Windows target directory before modification. If the folder already contains unknown files, another Git repository, or overlapping user changes, the affected bootstrap work must stop and report the condition before writing over it.

## 8. Known risks and watch items

### Repository-state uncertainty

The repository is on branch `main`, tracking `origin/main`; the accepted implementation checkpoint remains `56020d60ff41b54d0c345068befddf2790390cea`. Its metadata checkpoint `bf7c21a46e61784234658a21c31fdbf1cac8048e` is the verified initial publication. The new publication-evidence commit is not included in that published SHA.

### Planning artifact placement

All approved documents are now present and their transfer hashes passed before edits.

### Tool/version uncertainty

Observed Node v24.19.0 and npm 11.17.0. Installed direct development dependencies are TypeScript 6.0.3, Vitest 5.0.2, Vite 8.3.1, ESLint 10.11.0, @eslint/js 10.0.1, typescript-eslint 8.70.1, and @types/node 24.19.0. Registry peer/engine compatibility, `npm ls --depth=0`, and executable validation passed. package-lock.json pins the dependency tree. A separate clean-machine `npm ci` reproduction is NOT RUN.

### GitHub publication boundary

The public repository, origin URL, upstream, and initial publication parity are verified as recorded above. The supplied publication timestamp and the later independent observation timestamps are distinct evidence.

Do not change visibility or perform another push without authorization for that operation and commit.

## 9. Next executable task

The user authorized one local documentation commit, `docs: record initial GitHub publication`, recording the publication evidence in STATE.md and DEVELOPMENT_LOG.md only. No further implementation or push is authorized by this task. M1-T02 has not started.

Next implementation task after that checkpoint:

`M1-T02 — Physical Card Model and Six-Deck Inventory` (NOT STARTED).

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

These M1-T01 conditions have been met. M1-T01 remains VERIFIED and ACCEPTED, and the initial publication at bf7c21a46e61784234658a21c31fdbf1cac8048e is verified. The new publication-evidence commit is not pushed; fresh-session milestone review remains uncompleted. Repair cycles remain 2/10.

## 11. Completion vocabulary

Use these terms exactly:

- `IMPLEMENTED` — files/code changed; no verification implied.
- `VERIFIED` — exact deliverable version passed every required check.
- `ACCEPTED` — user explicitly accepted the verified result.
- `DEPLOYED` — version actually deployed and required post-deployment checks passed.

For M1, `DEPLOYED` is not a completion target.
