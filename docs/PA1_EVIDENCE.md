# PA1 execution evidence

## PA1-T01 partial contract/source-gate checkpoint

Baseline: 2026-10-02 19:49:27 +08:00, `main`, HEAD = origin/main = `e8e8e2e1586611473f0cdb94540ce995d9bd64e7`, 0/0, clean including untracked. Initial sandbox ownership mismatch recorded; owner-context read-only Git PASS, no config changes. Owner explicitly reports RA1 HUMAN ACCEPTED. Substantive [character contract](PA1_CONTRACT.md) and [source inventory](PA1_ASSET_AUDIT.md) accompany the acceptance update. No metadata-only RA1 acceptance commit.

Source status: BLOCKED / ASSET NOT READY. Repository inventory PASS/0 but no canonical character originals are available. Individual dimensions/alpha/hash checks BLOCKED; visual checks NOT RUN. Both Noble scene/banner/text concerns remain unverified. Owner source path or generation direction requested, pending. No production art was admitted, transformed or disguised. T01 complete acceptance criteria are not met; T02..T07 NOT RUN.

## Executed preservation verification

Official command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

PASS, exit 0, completion inspected at 2026-10-02 19:58:09 +08:00. Typecheck, lint, full 73 Vitest files/1020 tests, domain type isolation, production build/fixture exclusion, 58 Chromium and mandatory independent M1-M8 preservation PASS. M9 and RA1 current tests run in the full suite, including historical V1.1 and V1.2 replay digest checks. This verifies preservation for the partial documentation checkpoint, not the unimplemented PA1 presentation.

Follow-up at 2026-10-02 20:09:13 +08:00:

```powershell
git diff --check
git diff --exit-code e8e8e2e1586611473f0cdb94540ce995d9bd64e7 -- src tests scripts package.json package-lock.json docs/images
git status --short --untracked-files=all
```

Each command PASS/0. Executable/test/dependency/runtime/image diff EMPTY. Consequently `src/domain` diff EMPTY; gameplay RNG consumption, replay gameplay/digest implementation and computer decision policy remain byte-identical to baseline. Full status shows only intended documentation changes; baseline HEAD/origin remain unchanged. No commit/push/deployment.

Recommended GPT Sol 6.1 / High; actual client model/effort NOT VERIFIED / NOT VERIFIED. PA1 repairs T01..T07 `0,0,0,0,0,0,0` (each /10). Historical RA1/M9/M8 repair counts unchanged. Same-session partial documentation diff inspected; genuinely fresh PA1 review NOT RUN. PA1/M9 HUMAN ACCEPTED: NO.

## Owner-directed staging wait

2026-10-02 20:18:08 +08:00: baseline reconfirmed main/HEAD `e8e8e2e1586611473f0cdb94540ce995d9bd64e7`; all six modified and three untracked PA1 documents remain present. Owner names authoritative source directory `C:\Users\user\Documents\GitHub\casino-blackjack\art\source\characters` and the twelve canonical `.png` filenames. Complete source set is being staged. Record only this direction; preserve prior uncommitted contract/audit/evidence work, do not reset/discard, do not start T02, STOP and wait for assets. T01 BLOCKED / ASSET NOT READY, repair count 0/10; availability is not a repair cycle. No staged asset audit, generation, pipeline, commit or push performed in this update.

## Existing T01 resumed complete source audit

2026-10-02 21:33:22 +08:00: source availability gate lifted by owner-provided complete set; existing uncommitted contract/audit/evidence retained. Actual originals under art/source/characters/PA1_character_sources, unchanged. All twelve mechanical/individual visual gates PASS including Noble replacements; full read-only receipt and hashes in PA1_SOURCE_AUDIT.json and PA1_ASSET_AUDIT. Audit/preview commands PASS/0, correct felt/light alpha compositing inspected. Production T02 NOT RUN. T01 final engineering/diff verification/publication pending; repair count remains0/10.

2026-10-02 21:35:54 +08:00 - T01 repair1: initial official lint FAIL/1 (three Buffer no-undef errors), all1020 Vitest PASS. Explicit node:buffer import is the sole repair; hypothesis is that it supplies the identifier required by repository ESLint. Targeted lint/audit-output equality and final official harness required. Availability gates not counted. T01 cumulative1/10; no source PNG edits.

2026-10-02 21:39:08 +08:00 - Initial resumed T01 official harness completed FAIL/1 solely from lint Buffer identifier; all73/1020 Vitest,58 Chromium,typecheck/domain/build and mandatory M1-M8 preservation PASS. T01 repair1 targeted lint PASS/0 and full read-only source receipt equality PASS/0 at21:36:58. Source hashes unchanged. Final exact-tree official harness follows; no source/domain/gameplay change.

## T01 final verification - 2026-10-02 21:43:19 +08:00

Official verify.ps1 PASS/0,73 files/1020 Vitest,58 Chromium and complete mandatory M1-M8 preservation. Typecheck/lint/domain isolation/build/fixture exclusion PASS. Current M9/RA1 preservation and historical replay digest tests PASS. Affected current docs5 tests/2 files PASS/0 at21:42:10; whitespace and baseline src/tests/dependency/image diff EMPTY/PASS. Originals remain byte-identical to twelve initial SHA256 receipts. T01 IMPLEMENTED / VERIFIED, repair1/10; publication pending. No executable changes after final harness, only factual documentation. T02..T07 NOT RUN. No acceptance/deployment/fresh independent review claimed.

## T01 publication receipt

2026-10-02 21:45:08 +08:00: normal commit/push/fetch PASS/0 at48f0a45de08d87ff4952c3d8342ed65b6bb671a2 on main, main=origin/main,0/0,clean including untracked. T01 IMPLEMENTED/VERIFIED/COMMITTED/PUSHED, repair1/10. T02 may proceed automatically under the owner contract; no independent PA1 review/acceptance/deployment.

T02 first validation FAIL/1:384x512 canvas PNG exceeded400000-byte per-file budget for elf_male.png; no production file admitted. Hypothesis: source contains detailed high-entropy RGB/alpha and browser PNG encoding is too large at that resolution. Targeted repair1 reduces derivative canvas to240x320 for maximum80 CSSpx portrait rendering at3x density; keep400000-byte budget, all original source bytes/quality, uniform aspect containment and transparency gates unchanged. No weakened historical tests or domain changes. Regenerate twice and inspect all outputs; T02=1/10.

## T02 asset verification - 2026-10-02 21:54:07 +08:00

Pinned conversion generation/reproduction PASS/0 at21:50:11,12 transparent240x320 PNGs,152309..190721 bytes; all source/output/tool receipts art/character-production.json. Public PNG full CRC/decode/alpha/hash uniqueness PASS/0, art/character-production-audit.json. Lint PASS/0 at21:51:57. All12 output portraits visually inspected on felt/light backgrounds PASS, stored sheets docs/images/pa1-production-{felt,light}-{1,2}.png. Original PNGs unchanged. T02 repair1 from initial384x512 size-gate failure retained; availability not counted. Official final harness pending; T02 not yet VERIFIED/COMMITTED/PUSHED.

## T02 interrupted engineering verification - 2026-10-02 22:08:35 +08:00

Official verify.ps1 FAIL/1, completion inspected22:04:40: three existing Windows PowerShell fixture children reported ETIMEDOUT (verifyHarness/browserHarness/m8Harness, approximately273 seconds); other current regressions,58 Chromium and independent M1-M8 preservation passed. This failed execution is retained. Read-only System event query confirms Kernel-Power506 entered Modern Standby at21:56:22 (Idle Timeout),507 exited at22:00:56 (Input Keyboard),274 seconds, matching the fixture stall. This establishes a host standby interruption rather than a production asset or fixture-code change. No timeouts, workers, assertions, tests or machine power settings changed. Revalidate the same tree after resume; no targeted code repair or additional repair cycle. T02 remains unverified until that execution passes.

T02 final official verify.ps1 PASS/0 inspected2026-10-02 22:13:33 +08:00 after host resume:73 files/1020 Vitest,58 Chromium and complete independent M1-M8 preservation, including956/44 accepted M8. Every required check passed; failed interrupted run retained above. Source/src/tests/dependency diffs EMPTY, source receipt equality and production --check PASS, all12 production visual gates PASS. T02 IMPLEMENTED / VERIFIED, normal publication pending; repair1/10 unchanged.
