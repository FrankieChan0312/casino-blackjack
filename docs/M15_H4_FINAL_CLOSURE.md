# M15 — verified H4 integration and final main-tree closure

Start: 2026-10-08 09:25:59 +08:00. Status: M15_FINAL_MAIN_VERIFY_BLOCKED at 2026-10-08 10:08:33 +08:00; first failure Q H2 buffer limit; R/commit/push NOT RUN.

Recommended model GPT Sol 6.1; recommended effort High. Client metadata confirms availability; selected runtime model/effort NOT VERIFIED.

Scope: integrate already verified H4 harness compatibility into existing staged M15, preserve all original publication bytes, execute one ordered closure and publish main only after every gate passes. Non-goals: feature work, product changes, timeout changes, retries, PNG optimization, M15 Repair8, M16, deployment.

Baseline main/507d6d53b529f38b4510a8b488ed272216c0f5a9; 840 staged, 0 unstaged, 0 untracked; index SHA256 b51613b99b3f51c9cda123bfb3367f112efd04d53e8f6ffa81fd4e37f652db46. H4 final f2c6c0cb4d70962ad5ee5e1afb2302ad18e4e874 includes implementation c065aa9dd3cc01e94f258b9792b5a806f634bb80; normal fetch and ancestry PASS.

Integration classification: A4 harness implementation, B8 compatibility tests, C6 documentation, D105 evidence, E0 unrelated. All twelve A/B paths are non-overlapping and imported as exact Git bytes. README, STATE, PLAN, DEVELOPMENT_LOG and LAB_MANUAL contain independent M15 content and are not replaced with H4 documents. Their history is retained; current closure bookkeeping is added separately. H4 evidence and task documentation remain available at the [verified H4 checkpoint](https://github.com/FrankieChan0312/casino-blackjack/blob/f2c6c0cb4d70962ad5ee5e1afb2302ad18e4e874/docs/HARNESS_H4_GIT_WORKTREE.md).

Step -> verification: preserve index/working/raw snapshots -> original840 staged blobs and unrelated working SHA unchanged after exact twelve-file import; preserve H1/H2 and H4 identity -> standalone29 plus main H4 focused91 with original five cases; final A–R -> native exits and first failure retained, full Vitest/Chromium and unchanged verify.ps1 each once; all-pass publication -> normal commit/push and local/tracking/live0/0 CLEAN/untracked0. Stop on overlap conflict, UNKNOWN classification, raw mutation, missing tools, first genuine gate failure or Git push failure.

PRE-T11-U01 remains original5000ms; assertions, converters and verify.ps1 unchanged. Historical5736/6452ms failures retain UNKNOWN root cause; H3 diagnostic3707.21/1404.35/2117.90ms and H4 standalone2868/full2601ms passes do not establish a fix. No separate pre-warming is run.

Frozen product: eight-deck Baccarat, indicator plus additional burn, default cut reserve14, six-card safety and finish/settle then replacement, independent Player/Banker rank pairs11:1 profit, exposure/atomic Repeat/replay/history. Blackjack V1 frozen, original40ms initial and110ms action/Dealer flights.

Counters: H1 1/10; H2 2/10; H3 1/10; H4 3/10; M15 7/10; M15 Repair8 NOT STARTED. M15 human visual acceptance PENDING; genuinely fresh-session review NOT RUN; M16 BACCARAT ROADMAPS NOT STARTED; DEPLOYMENT NOT RUN.

## M15 final main-tree closure stopped — 2026-10-08 10:08:33 +08:00

**M15_FINAL_MAIN_VERIFY_BLOCKED**. First genuine failure: Q H2 publication, node scripts/verify-evidence-publication.mjs, native exit1, spawnSync git ENOBUFS. Its indexed Git child has statusnull/signalSIGTERM, not a fabricated native exit. The new native-captures-i-chromium.tar.gz is71,698,590bytes (68.38MiB), exceeding the existing64MiB synchronous buffer at scripts/verify-evidence-publication.mjs:8/44. Packaging failed to account for this read limit. No product/H4/PNG failure is inferred. [First failure and exact raw output](M15_H4_EVIDENCE/stop/outcome.json).

A–P PASS/checked0: typecheck, Baccarat161, independent shoe/Pair validators, H1 18, H2 11, H4 91/originalfive5, full Vitest1410 and Chromium321, original Blackjack/Baccarat preservation, historical SHA, assets/build, privacy, responsive/accessibility and fixed native performance. Q streaming integrity and evidence-manifest audit PASS0: original830unrelated staged blobs and original document suffixes retained, H4 twelve exact Git blobs, H1 two exact files,879raw/binary working/index SHA unchanged, UNKNOWN0, authored whitespace PASS. These positive checks do not override Q H2 publication FAIL1. R unchanged verify.ps1 NOT RUN. Commit/push NOT RUN.

PRE-T11-U01 PASS4491.16ms in this one full Vitest; original5000ms, assertions/converters unchanged. Historical5736/6452ms timeout root cause remains UNKNOWN. H1/H2/H3/H4 counts1/2/1/3 each /10; M15 7/10; Repair8 NOT STARTED. No retry, validator/source repair, archive split, timeout change or feature work. Existing oversized evidence and every failed output are preserved.

Main HEAD/tracking/live507d6d53b529f38b4510a8b488ed272216c0f5a9,0/0; staged work retained, DIRTY. M15 HUMAN VISUAL ACCEPTANCE: PENDING; fresh-session review NOT RUN. M16 BACCARAT ROADMAPS NOT STARTED; DEPLOYMENT NOT RUN. STOP; WAITING FOR OWNER DECISION ON EVIDENCE PACKAGING / H2 BUFFER LIMIT. These are stop-only records, not a resumed gate or repair.

## Exact imported H4 paths retained at STOP

- casino-tests/baccarat/validator.test.ts
- scripts/collect-evidence.mjs
- scripts/git-directory.d.mts
- scripts/git-directory.mjs
- scripts/scan-evidence.ps1
- tests/browser/baccarat/nativeZoom.spec.ts
- tests/browser/baccarat/performance.spec.ts
- tests/browser/baccarat/presentation.spec.ts
- tests/browser/baccarat/table.spec.ts
- tests/browser/casino/platform.spec.ts
- tests/m10/evidenceLifecycle.test.ts
- tests/m10/gitDirectory.test.ts
