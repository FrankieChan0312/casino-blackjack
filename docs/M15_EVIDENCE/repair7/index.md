# M15 repair7 — stopped after watcher verification

Status **M15_BLOCKED_AFTER_REPAIR_7_OTHER**; repair count **7/10**. Recorded 2026-10-07 12:15:43 +08:00. Human visual acceptance PENDING. No commit/push.

## Repair and scope

Only vite.config.ts adds server.watch.ignored=['**/docs/**'] using the single existing Vite configuration for dev/e2e watching. No runtime/product/route/module/asset/assertion/deadline/retry changes. Original Playwright30000ms/load,retries0,reuseExistingServer:false and asset5000ms retained. Docs remain in Git, privacy/document/publication/preservation checks. Required original prior failures remain retained in the parent package.

## Executed evidence

- [Watcher native receipt](m15-repair7-watcher.json) and [native output](m15-repair7-watcher.txt):PASS0.
- [Effective watcher inventory](watcher.json):docs0;src81/public18/tests152,all251required files present;both browser fixture files watched;52directories/369items. Baseline diagnosis observed22230items. Counts are startup observations rather than a future constant.
- [Exact executable inputs](executable-inputs.json):269existing inputs unchanged;only authorized config difference. [Previous Vite config](vite-before.ts.txt) retained.
- [Launcher failure](typecheck-launch-error.json), [captured error](typecheck-launch-error.txt) and [empty opened native log](m15-repair7-typecheck.txt):Node spawn of Windows npm.cmd returned EINVAL before typecheck executed. Classified TEST/HARNESS (agent launch-command mistake);typecheck BLOCKED, no native typecheck result. No code repair or retry follows.

## Required ladder state

| Check | Status | Evidence/limit |
|---|---|---|
| Watcher coverage/config preservation | PASS | Native0;exact expected config property;269other hashes |
| Ancillary typecheck launcher | BLOCKED | npm.cmd spawn EINVAL;required child NOT RUN |
| Three fresh-server cold samples | NOT RUN | Owner new-failure stop;no sample attempted |
| Exact accessibility.spec | NOT RUN | Original assertions/deadline intact |
| Focused/full Vitest | NOT RUN | No asset repetition;prior UNKNOWN failure retained |
| Full Chromium | NOT RUN | No current complete-gate claim |
| Independent shoe/Pair validators | NOT RUN | Earlier PASS evidence retained |
| Blackjack/M12–M14 preservation | NOT RUN | Current product hashes unchanged;no rerun claim |
| Performance2500ms | NOT RUN | Timings unchanged;earlier samples retained |
| Assets/build/production equivalence | NOT RUN | No current check claim |
| Unified verify.ps1 | NOT RUN | Closure stopped |
| Commit/push/deployment | NOT RUN | Blocking condition |

Only final evidence privacy/hash/link/Git inventory checks are performed to preserve this stopped record;these are not continuation or closure of the remaining product-validation ladder. [Final Git snapshot](git-final.json).

## Next action

WAITING FOR ROOT-CAUSE-SPECIFIC OWNER DECISION. STOP.
