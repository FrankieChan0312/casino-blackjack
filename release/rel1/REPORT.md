# REL1 — Lightweight interview demo release

Task: REL1, packaging only. Recommended model GPT Sol 6.1 / High; client availability confirmed, actual runtime model/effort NOT VERIFIED. Cumulative repair ledger: 4/10 (Repair4 package rerun pending). No historical milestone repair allowance is consumed.

Game baseline: `920e1035f22eb7c770c50a409e977bcb33ee66ca`. Isolated branch: `codex/rel1-interview-demo`. Original `main` remains dirty and is owned by a separate active M16 session. No original worktree/index edits, process termination, evidence migration or history rewrite are part of REL1.

Scope: dependency-free launcher, reproducible pinned production build, compact ZIP <=20 MiB, fresh extraction/security/production browser checks, artifact provenance and independent release review. Excluded: M16, gameplay/RNG/funds/settlement/replay changes, multiplayer, dependency upgrades, artwork changes, hosted deployment and human milestone acceptance.

Step -> verification:

1. Sparse pinned inputs -> Git modes/blob identity and immutable lockfile.
2. Isolated locked install/build -> native exits and both production fixture guards.
3. Launcher/package sources -> syntax/lint and process-level security tests.
4. Actual ZIP -> fresh external extraction, manifest/hash/layout/size, direct and Windows launches, different cwd, spaces/non-ASCII path, Ctrl+C, production route/game/browser/network checks.
5. Exact candidate -> independent fresh-context code/evidence review; genuinely separate-client fresh-session review required before public release.
6. Reviewed release -> explicit commit/tag, draft upload/download hash/startup, public asset/hash and narrow README navigation only if WIP-safe.

Stop at a mandatory failure, source identity mismatch, unknown overlapping edit, unavailable required review/tool, 10 failed repair cycles or any excluded operation. Failed output is retained externally; no retry-to-pass or old test changes.

Evidence index: new raw REL1 logs, receipts, extracted candidates and ZIPs stay outside Git in this chat's dedicated `REL1/` workspace. Commit only this compact index, source scripts/tests and navigation. Prior full product gate is REUSED (115 files / 1,448 Vitest / 331 Chromium / native exit 0), supported by exact Git source identity with `886743c3810021030c1c9512366c28e92eb28646`; no fresh full historical run is claimed. See pinned `docs/M15_FINAL_CLOSURE.md` for the reuse policy.

## Executed preparation

- 2026-10-13 21:39:39 +08:00: original main/HEAD baseline is the pinned game SHA, dirty M16/evidence work observed. GitHub account/repository ADMIN access confirmed; remote main matches baseline, proposed tag/release absent.
- 2026-10-13 21:52:33 +08:00: durable preservation census captures 121 modified/untracked files, 31,832,237 bytes and original index SHA-256 `49f9c8f8cc5af1eeac892e42549e7c78d256ea5f8f08f7a2db021a8746329a71`. The separate active session may continue authorized changes; REL1 must report those distinctly. The initial scratch capture used ephemeral sandbox TEMP and is unavailable; native initial status/index observation is retained in session output. No restoration is attempted.
- Isolated npm ci first attempt FAIL/native1 (sandbox DNS ENOTFOUND); log retained. Same unchanged locked install outside sandbox PASS/native0: 144 packages. Node v24.19.0, npm 11.17.0, GitHub CLI 2.100.0.
- Fresh `npm.cmd run build` PASS/native0; 502 modules, 21 output files / 3,291,962 uncompressed bytes. Embedded Blackjack fixture guard PASS; explicit `node scripts/check-baccarat-build.mjs` PASS/native0.

Source checkpoint verification and actual ZIP gates are pending. No upload, public release, README change or hosted deployment is claimed.

## Repair ledger

1. Browser harness first ESLint FAIL/native1 (30 no-undef errors). Hypothesis: Node/browser globals lacked lexical declarations. Added built-in imports and declared serialized browser globals; affected ESLint PASS/native0 at 2026-10-13 21:57:20 +08:00. Actual first output preserved, SHA-256 `7b75b148fbcf698d94b8e10e450daf2c301ca2431359ffb11debc2626e673906`.
2. Launcher suite first sandbox run FAIL/native1: AppContainer TEMP realpath EPERM. Unchanged native rerun exposed two test issues (9 PASS / 2 FAIL / 1 cancelled): missing Host rejected by Node parser400, and wrapper stdin retained event loop. Hypothesis: parser rejection satisfies security requirement, wrapper stream prevents natural shutdown. New tests require real error/no index payload and destroy wrapper stdin; affected suite PASS12/native0. Original logs remain `launcher-initial.log` / `launcher-escalated.log`; success `launcher-repair2.log`.
3. Root source lint FAIL/native1 (8 diagnostics): missing Node globals in launcher/tests and control-character regex rule. Hypothesis: lexical imports and an equivalent codepoint predicate preserve rejection behavior under unchanged lint rules. Targeted lexical imports/codepoint fix: lint PASS/native0 and launcher suite PASS12/native0 at 2026-10-13 22:12:26 +08:00; original `rel1-source-lint.log` retained.
4. Actual candidate-01 browser FAIL/native1: first Baccarat settlement passed; Repeat then waited for a result without explicit Deal. Pinned engine101–112 proves REPEAT returns BETTING with reserved prior wagers, controller only resolves/commits DEAL. Hypothesis: assert restored wager/reserve then execute legal Deal before waiting. Harness-only targeted correction, plus failure DOM/screenshot retention, syntax/lint PASS/native0 at 2026-10-13 22:20:09 +08:00; actual candidate rerun pending. No timeout/game/test-fixture change. First browser report/log retained.

## Candidate-01 observations

Source checkpoint commit `ad965ce9325f2b22676a594f7afb405fdf70b4fc`; 26 files, ZIP 2,977,554 bytes / 2.8396167755 MiB, SHA-256 `a0b3c72b798ea8156bcad5cd0389ed836e0046b06fe2ed6f29a2fcd53002baa2`. Fresh extraction integrity PASS/native0; actual-ZIP launcher suite13/13 PASS/native0. Browser six steps passed before the retained Baccarat Repeat harness failure; narrow viewport/final network assertions NOT RUN on that attempt.

Real Windows START-DEMO.cmd and direct node were invoked from a different cwd with spaces/non-ASCII extraction path. Both printed ready URLs; real terminal Ctrl+C printed `Demo stopped.` and both listener ports were closed. Terminal host exits1 on user interruption, separately disclosed; process-level SIGINT listener test naturally exits0 and verifies port reuse. Windows batch also presents its normal `Terminate batch job (Y/N)?` prompt. These outputs do not hide a normal command failure.

Fresh-context reviewer requested exact versions inside START-HERE; corrected in the new candidate: Node24.19.0 / Windows10.0.26200.9457 / Chromium153.0.8010.12. Genuine separate-client fresh-session review remains NOT RUN. All retained failed logs will have external SHA-256 index entries before final delivery.
