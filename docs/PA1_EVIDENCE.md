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

## T03 baseline / repair1 - 2026-10-02 22:20:28 +08:00

T02 normal publication PASS/0 at22:17:09:f757b5f125f5395527de671a0682478a46af05eb,main=origin/main,0/0,clean including untracked. T03 canonical manifest/independent chooser/immutable lineup now implemented. Scope, acceptance and stop conditions in PA1_CONTRACT; historical fixed-inventory adaptations recorded before edits in PA1_PRESERVATION. Deterministic six tests cover all12 identities/assets, exact sample bounds, every human with six unique guests, collision swap, invalid choices and crypto separate from Math.random. Mechanical preservation retains every pre-PA1 test assertion with only explicit historical inputs.

Initial typecheck/lint PASS/0; affected14 tests FAIL/1 (13 PASS), new isolation regex matched a gameplay RNG type named only in an explanatory comment. Falsifiable hypothesis: removing that comment wording resolves the false positive without a behavior/import/assertion change. Repair1 modifies only that comment; isolation assertion unchanged. T03=1/10; ledger1,1,1,0,0,0,0, historical counts unchanged. Targeted rerun and official final harness pending.

Repair1 targeted14/14 PASS/0 at22:22:00 and independent M8 mechanical source/assertion comparison PASS. First T03 official full Vitest FAIL/1 inspected22:22:50: PA1-P01 took6118ms, exceeding unchanged5000ms budget; all other1027 tests PASS. New preservation test spawned one Git process per historical file. Repair2 hypothesis: a single `git cat-file --batch` preserves all73 exact blob comparisons and eliminates process-launch overhead. Batch read with independently parsed blob sizes/header checks; no assertion, inventory or timeout changes. T03=2/10; full failed run completes before exact-tree final verification.

Repair2 targeted2/2 preservation tests PASS/0 at22:23:59,366ms total. First official execution returned FAIL/1 inspected22:32:34, retaining the original PA1-P01 failure. Its58 current Chromium cases completed but Vite cleanup hung; verified own helper33404 terminated through CIM at22:30:37/return0 after Stop-Process internal NullReferenceException. Cleanup hung again after M7's24 cases; own verification descendants verified by parent/creation identity and stopped at22:32:24. This externally assisted run is not valid final engineering evidence; accepted M8 full rerun NOT RUN/completion not established. System also records standby22:22:02..22:22:25; no assertion that it caused the later cleanup hangs. Installed Playwright uses Windows taskkill for webServer cleanup; exact cause unestablished. No user browsers/services stopped, no repository harness/runtime settings altered. One final exact-tree official execution in owner context with webServer debug logging follows; stop T03 on a repeated real environment blocker rather than accepting assisted cleanup.

T03 final official verify.ps1 PASS/0 inspected2026-10-02 22:37:02 +08:00 in owner context:75 files/1028 Vitest (9.84s),58 Chromium, all engineering checks and complete independent M1-M8 including956/44 M8. Debug logs confirm every browser webServer terminated normally; no manual assistance. Domain/browser/UI/dependencies/assets diff EMPTY relative to task baselines; every original test assertion retained by mechanical comparison. Scoped diff reviewed, diff --check PASS/0. Only factual evidence changes after successful harness. T03 IMPLEMENTED / VERIFIED, normal publication pending, repairs2/10; PA1/M9 not accepted, deployment NOT RUN.

## T04 baseline and first verification - 2026-10-02 22:42:22 +08:00

T03 publication PASS/0 at22:38:28:3f3f664054a69e6bab1d87109626678ff2767899,main=origin/main,0/0,clean including untracked. T04 contract/settings/acceptance/stops in PA1_CONTRACT. Native collapsed selector after gameplay controls, Roland default, unique guests1/3/6 and collision exchange held in React state. Only successful explicit startDemo increments a browser-local presentationSession; ordinary commands/RNG/policy/audit/replay code unchanged by exact controller normalization. Explicit session resets default/new lineup. Test chooser injected only in e2e build, production uses separate browser crypto.

Typecheck/lint PASS/0. Initial affected17 tests FAIL/1 (16 PASS): new RNG test expected311 initial calls, omitting accepted cut-position selection. Read-only shoe.ts and unchanged accepted shoe/random tests establish311 shuffle bounds plus one bound31 cut selection,312 calls. Record before correcting: repair1 strengthens new assertion to the full explicit bounds sequence and requires identical sequence/no controller events after all12 selections. Domain code unchanged. T04=1/10. Browser2/2 PASS/0 at22:41:57 verifies exact full replay JSON, gameplay fingerprint, funds and public audit equality; avatar collision/stable guests through Stand/Repeat/Deal Again and explicit reset all PASS. Corrected targeted/full official checks pending.

Repair1 targeted3/3 session tests PASS/0 at22:43:45; full76 files/1031 Vitest PASS. First full browser run FAIL/1:59/60 cases PASS, M9-E04 cannot find an already-expanded tool control after explicit reset. Diagnosis inspected2026-10-02 22:46:38 +08:00: keying entire PlayerExperience by presentationSession remounts all native details, closing tools, violating unchanged M9-E04. Repair2 removes the component key and replaces only paired lineup/session state on successful session change. Keep all tools/native DOM/focus logic and M9 assertions. New normal-session marker still changes no gameplay code. T04=2/10; targeted M9-E04 + PA1-E01/E02 and final exact-tree verification follow after the failed initial harness completes.

Initial official run completed FAIL/1 inspected22:47:41, independent M1-M8 preservation PASS; original M9-E04 failure retained. Repair2 typecheck/lint PASS/0. Combined targeted grep invocation FAIL/255 before tests ran: Windows npm.cmd interpreted regex `|` as a shell operator. Repair3 separates M9-E04 and PA1 suite invocations, no assertion/product change; conservatively count this verification-command repair, T04=3/10. Corrected target starts2026-10-02 22:49:10 +08:00, original M9-E04 PASS/0; PA1-E01/E02 passing output, final result/official exact-tree run pending.

T04 final official verify.ps1 PASS/0 inspected2026-10-02 22:53:11 +08:00:76 files/1031 Vitest,60 Chromium and complete independent M1-M8 (956/44 M8). All M9/RA1 current behavioral checks PASS, no weakened assertions. Original M9-E04+PA1-E01/E02 targeted3/3 PASS/0 at22:49:27; full exact312 RNG bounds and no-event selection checks PASS. Replay JSON/commands/fingerprint/funds/audit identical with and without UI avatar changes. Controller exact normalized source and baseline domain EMPTY prove RNG/policy/replay implementation preserved. Six regenerated current M9 screenshots inspected; primary geometry unchanged, selector secondary. Scoped diff reviewed; whitespace/source preservation PASS. T04 IMPLEMENTED / VERIFIED, normal publication pending, repair3/10 retained.
