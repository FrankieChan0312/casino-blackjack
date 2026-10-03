# PA1 independent review

Decision: **PA1_INDEPENDENT_REVIEW_ACCEPTED**.

Reviewed implementation: `3c50ab4d0183cff13f2380bd60faa31583d3e988`, branch `main`, official repository `C:\Users\user\Documents\GitHub\casino-blackjack` only. PA1 baseline: `e8e8e2e1586611473f0cdb94540ce995d9bd64e7`, explicitly identified by PA1_CONTRACT and PA1_REVIEW_HANDOFF. This is a fresh independent review after the implementation session stopped. Implementation claims were inputs to investigation, not evidence of success.

PA1 is ACCEPTED under the user's explicit conditional delegation to this review. **M9 HUMAN ACCEPTED: NO**: M9_VISUAL_CHECKLIST reserves the owner's casual-play/interviewer/game-feel judgments; this review verifies PA1 integration and technical preservation without supplying those judgments. M1-M8 and RA1 retain their prior human acceptance. **M10 NOT STARTED. Deployment NOT RUN.** No product code, tests, source art, production assets, dependencies, runtime settings or historical evidence were changed. Review documentation repairs: 2/10; product repairs: 0. PA1 cumulative implementation ledger remains `1,1,2,3,2,0,2` (each /10).

## Baseline and scope

At 2026-10-03 00:28:49 +08:00 the repository path was confirmed. Initial Git reads were BLOCKED by sandbox ownership protection; exact-repository, per-command safe.directory allowed subsequent inspection without global configuration edits. Starting branch main, HEAD/main/origin/main all `3c50ab4d0183cff13f2380bd60faa31583d3e988`, ahead/behind 0/0, clean including untracked. Expected implementation ancestor check PASS/0. A sandbox fetch was BLOCKED by FETCH_HEAD permissions; owner-context normal `git fetch origin main` PASS/0 reconfirmed live remote parity before review writes. No unknown user work existed or was discarded.

Read the required governing documents, PA1 contracts/audits/pipeline/mapping/preservation/screenshots/evidence/handoff, M9 and RA1 review records, and official verification/preservation scripts. Inspected the complete source/test change range and Git history. Recommended GPT Sol 6.1 / High; actual client model/effort NOT VERIFIED / NOT VERIFIED.

Acceptance criteria: all PA1-T01..T07 contracts, canonical assets, individual actual-application visual review, unchanged protected behavior, full official verification, bounded T05 reproducibility and documentation-only publication. Non-goals and stops: no implementation repairs, gameplay changes, new requirements, unsafe operations, M10 or deployment; a genuine product defect would reject this review.

## Executed verification

All times below are execution-environment times (+08:00). Complete output is retained in [execution evidence](PA1_INDEPENDENT_REVIEW/README.md).

| Command | Start / end, 2026-10-03 | Result |
| --- | --- | --- |
| `node scripts/audit-character-sources.mjs` | 00:31:58..00:32:14 combined asset block | PASS / 0 |
| `node scripts/build-character-assets.mjs --check` | same combined block | PASS / 0, 12 exact output-byte matches |
| `node scripts/verify-character-assets.mjs` | same combined block | PASS / 0, complete original/decoded-production receipt equality |
| `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1` | 00:34:40..00:39:10 | PASS / 0 |
| Historical T05 E03, original test from `bf2666e740354982e73bc0941acaf026952b69ab` | 00:41:54..00:41:59 | PASS / 0, 1/1 |
| Same historical E03, `--repeat-each 4` | 00:41:59..00:42:17 | PASS / 0, 4/4 |
| M9 + original three T05 PA1 browser cases, `--repeat-each 3` | 00:42:17..00:43:27 | PASS / 0, 42/42 |
| Production capture and independent browser source decode | 00:44:18..00:44:29 | PASS / 0 |

Official main suite: **76 Vitest files / 1031 tests PASS**, **63 Chromium tests PASS**. Typecheck, lint, domain isolation, production build and fixture exclusion PASS. No failed, skipped, retried or disabled cases. Playwright uses the unchanged one-worker, zero-retry configuration. Count matches the target inventory. NO_COLOR/FORCE_COLOR warnings and Vitest performance suggestions are informational; PowerShell displays warning stderr as NativeCommandError text, but actual checked process exits and test results are successful.

Independent preservation reruns: M1 12/155, M2 6/78, M3 5/72, M4 7/171, M5 8/168, M6 9/181, M7 56/870 plus 24 Chromium, M8 66/956 plus 44 Chromium: all PASS. Current M9 and RA1 cases execute in the complete current suite. Final documentation-version verification and publication receipts are appended below after execution.

## Assets and manual visual review

Mechanical **12/12 source PNG and 12/12 production PNG PASS**: canonical path/name set, PNG signature/chunk CRC/full decode, RGBA8, substantial transparent background, unique file and decoded-pixel hashes, unchanged full audit receipts. Production files are `/characters/<id>.png`, 240x320, 152309..190721 bytes, below the unchanged 400000-byte budget. Ten sources are 1086x1448; dwarves 1122x1402. Contain/center preserves aspect with transparent dwarf padding; the pinned Node v24.19.0 / Playwright 1.63.0 / Chromium 153.0.8010.12 converter reproduced all bytes. Browser Canvas decoding independently matched all twelve source dimensions and fully transparent-pixel counts.

Manual review inspected each freshly generated active-hand image, all original portraits composited on felt/light contact sheets, desktop/tablet/mobile and failed-image/enlarged-text images. This review also opened the built production application with Chromium, selected all twelve real options without a fixture, inspected default ready/active/results screens and Noble production views, and completed three seeded demonstration rounds through Deal, Repeat Bet and Deal Again. [Production observations](PA1_INDEPENDENT_REVIEW/production-observations.json) contain actual decoded URLs/dimensions, lineup records, results and zero browser errors; the reproducible capture script is retained as text. The UI connector had no available browser; screenshots were obtained through the existing explicitly authorized Playwright tooling and manually inspected, not inferred solely from automated assertions.

| ID / identity | Mechanical | Actual active-hand visual evidence |
| --- | --- | --- |
| elf_male / Caelan | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-elf_male.png) |
| elf_female / Elaria | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-elf_female.png) |
| knight_male / Roland | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-knight_male.png) |
| knight_female / Seraphine | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-knight_female.png) |
| mage_male / Alaric | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-mage_male.png) |
| mage_female / Nyra | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-mage_female.png) |
| noble_male / Lucien | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-noble_male.png) |
| noble_female / Celestine | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-noble_female.png) |
| halforc_male / Garruk | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-halforc_male.png) |
| halforc_female / Vesha | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-halforc_female.png) |
| dwarf_male / Borin | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-dwarf_male.png) |
| dwarf_female / Brynja | PASS | [PASS](PA1_INDEPENDENT_REVIEW/images/pa1-avatar-dwarf_female.png) |

All twelve have correct name/archetype/controller pairing, readable labels, consistent scale/alignment and intact portrait framing. No visible background rectangle, unintended border, obvious alpha corruption, objectionable halo, stretch or added clipping beyond the supplied bust framing. Hair/clothing/face edges composite on the casino felt; intentional mage magic remains visible. Cards, active markers, wagers, results and primary controls are separate. Dealer retains the independent illustration. At1280x900 and768x1024 primary actions fit; at320x720 vertical scrolling and expandable guest cards match the approved contract. Keyboard selection/focus,44px targets, reduced motion, hidden card and image-failure text fallback PASS. The documented enlarged-text decorative card overflow remains a pre-existing bounded limitation, not a new PA1 defect or comprehensive accessibility certification.

Lucien and Celestine use the transparent owner-supplied canonical replacement sources. The original supplied PNGs remain byte-identical to T01 `48f0a45de08d87ff4952c3d8342ed65b6bb671a2`; `git diff --exit-code` over the source directory PASS/0, and Git history lists only their initial introduction. Production asset/receipt diff from T02 `f757b5f125f5395527de671a0682478a46af05eb` is EMPTY/PASS/0. PA1_ASSET_AUDIT documents replacement identity and retained C2PA ancillary metadata. Older rejected Noble images were never supplied to this repository; an old-vs-new byte comparison cannot be asserted. No cryptographic C2PA verification is claimed.

Two regenerated historical avatar screenshots (Nyra and Lucien) differed from the target by exactly two pixels each at x385..386/y57..78, on the wager-chip border and outside the portrait. [Decoded comparison](PA1_INDEPENDENT_REVIEW/screenshot-differences.json) preserves hashes/bounds. Fresh captures are retained here; only those review-generated modifications were restored to target bytes, preserving existing screenshot/hash evidence. This did not change source art or tests.

## T05 historical failure investigation

**ROOT CAUSE NOT ESTABLISHED. Classification: unknown / insufficient evidence.**

The initial T05 integration failure before repair1 is separately explained: accessible heading was `▸ Caelan`, not the exact canonical name; the T05 commit added the canonical aria-label. That is not the later unexplained official FAIL/1 inspected at2026-10-02 23:05:30 +08:00.

For the unexplained run, inspected PA1_EVIDENCE, DEVELOPMENT_LOG, handoff, T05/T06/T07 logs, relevant Git history and available repository/ignored/TEMP artifact inventories. No original failing test name, assertion, trace, screenshot or complete failed output was retained. The records explicitly say output truncation and subsequent preservation runs replaced temporary reports. Found the surviving `casino-blackjack-pa1-t05-browser-20261002-233508.log`: it documents a later **61/61 PASS**, not the lost failure; copied it into [historical diagnostic evidence](PA1_INDEPENDENT_REVIEW/historical-t05-browser-diagnostic.log) after inspecting its public fixture output. Other T02 standby and T03 cleanup evidence cannot establish T05's cause. No deterministic product, test, timing, stale-state or infrastructure root cause is invented.

Because the failing case is unnamed, reproducing that exact failure is impossible. The smallest identifiable T05-specific check is historical PA1-E03. The exact published T05 test source was temporarily restored under a review-only filename, with no product edits; E03 ran once then four controlled repeats, all PASS. The original three PA1 cases plus11 M9 cases ran three rounds,42/42 PASS, no retries/skips/timeouts changes. Temporary test removed after diagnostics; a text copy remains for audit. The official current full63-case run and complete preservation also PASS. No contradictory product evidence or repeated failure was found. This meets the user's conditional allowance for accepting a non-reproduced historical failure, while retaining the lost-evidence limitation explicitly. It does not prove universal stability.

## Protected behavior

**`src/domain` diff = EMPTY** for baseline-to-reviewed-target (exit0). The entire domain tree, RNG/random-source contract, card/shoe, rules, funding/accounting, replay reconstruction/digest/command journal and computer policy are byte-identical. The controller diff consists only of initializing, projecting and incrementing a presentation session counter on an already successful explicit reset; every other statement matches baseline after those three exact inserts are removed (PA1-S01). The counter never enters domain commands, journal, outcome audit or replay digest. Native character changes call only React presentation state. The production chooser uses separate browser crypto and has no gameplay dependency; the e2e chooser is fixture-only and excluded from production.

PA1-S02 independently asserts312 initial gameplay RNG calls with exact shuffle bounds312..2 and cut bound31, then zero additional calls/controller emissions through all12 selections. PA1-E02 compares complete seeded replay JSON, outcomes and audit HTML with/without avatar changes. Current M9 workflows, RA1 V1.1/V1.2 digest fixtures and all historical M1-M8 cases PASS. Direct source inspection corroborates the tests.

Inspected historical inventory adapters: only frozen RA1 delivery metadata/source inputs and accepted M8 count exclusions are adapted; PA1-P01 compares every pre-PA1 assertion byte after those precise adapters and the two authorized M9 portrait queries. All other existing tests remain byte-identical and execute on current handlers. No assertion weakening, skip, retry or runtime-setting change.

## Findings, boundaries and publication

### Review documentation failure and repair1/10

The first final-document official run started2026-10-03 11:26:31 and ended11:30:06 +08:00 **FAIL/1**. Current1030/1031 and accepted M8 955/956 failed the same unchanged portfolio assertion. Current63 Chromium and M1-M7 preservation PASS; accepted M8 44 Chromium NOT RUN because its Vitest gate failed. Complete [failed run](PA1_INDEPENDENT_REVIEW/final-verification-failed-01.log) remains intact. At11:29:13..11:29:15 the smallest portfolio suite independently reproduced FAIL/1 (1/2 PASS). This is a new review-document failure, distinct from the historical unexplained T05 failure.

Falsifiable cause: the README's new first line contained both `M1-M8` and `M10 NOT STARTED`; unchanged `/M[78].*NOT STARTED/` matched the same-line span. Repair1 separates the true M10 status into its own paragraph. No test, assertion or product change. A first attempted patch had a context mismatch and made no file changes; it did not add a repair cycle. Affected documentation/portfolio/M8/PA1-preservation verification at11:31:36..11:31:41 PASS/0. Complete post-repair official verification is required before publication; a later green run does not erase either red outcome. Historical PA1 implementation counters are unchanged; this new review-document repair has its own cumulative1/10 ledger.

Blocking product findings: **NONE**. PA1 technical acceptance gates PASS. Residual risks: lost original T05 failure details and unestablished cause; missing older rejected Noble bytes; bounded Chromium/accessibility matrix; M9 owner's experience acceptance outstanding. These are explicitly bounded evidence/governance limitations, not silently closed issues.

Publication is authorized only for review/acceptance documentation on existing origin/main after final verification and scoped diff review. Final commit/parity/clean receipts are appended after execution; Git and final delivery identify the ultimate receipt commit without self-referential hashes.

### Final verified review checkpoint

2026-10-03 11:32:55..11:36:48 +08:00: complete post-repair official verification **PASS/0**,76/1031 Vitest,63 Chromium, all engineering gates and complete independent M1-M8 including956/44 M8. No failures, retries or skipped cases in this final run. Full [final raw log](PA1_INDEPENDENT_REVIEW/final-verification.log) is retained alongside both red documentation outcomes. Current-document/portfolio/assertion checks at11:37:28..11:37:33 PASS/0,5files/13tests, after final factual documentation updates. No executable/test/dependency/runtime changes followed full verification.

The final run again generated a two-pixel wager-border variation for Nyra and also Alaric at the same coordinates; [final decoded comparison](PA1_INDEPENDENT_REVIEW/screenshot-differences-final.json) preserves it, with Lucien unchanged in that run. Independent final images are separately retained and historical avatars restored. No character-pixel/source/production change was found. The evidence manifest pins independent screenshots and retained logs. Publication and final-state receipts follow below.

### Evidence formatting repair2/10

At2026-10-03 11:40:22 +08:00 staged `git diff --cached --check` reproduced FAIL/2 with43 terminal-log trailing-whitespace lines. No commit/push occurred. Cause is literal PowerShell wrapping/blank-line whitespace in captured output, not a test/product defect. Preserve each pre-normalization log and the whitespace-check transcript losslessly as adjacent `.gz` files; readable UTF-8 views remove only trailing line whitespace. All assertions/warnings/failure text remain present. This targeted evidence-only correction is review documentationrepair2/10; historical PA1 counters and product repairs0 remain unchanged. Restaged whitespace/evidence and affected documentation checks are required before publication; no test/runtime setting changes or new full-suite repair are involved.

### Acceptance publication and final receipt

Repair2 affected checks2026-10-03 11:41:38..11:41:41 PASS/0 (5files/13tests); evidence link/PNG/hash checks PASS; restaged whitespace PASS/0 at11:42:58. Source/tests/scripts/art/public/dependency/runtime and historical-image diff against the reviewed implementation EMPTY/PASS0. No non-document path was staged. Both review documentation repairs CLOSED, cumulative2/10; product repairs0.

Acceptance/evidence commit **`4abc06c2623a9dedd5794243965162888ab3e998`**, branch main, normal commit PASS/0 at11:43:47. Normal push origin main and fetch PASS/0 at11:44:49; local HEAD = origin/main = that SHA,0/0,clean including no untracked files. At11:45:37 independent validation PASS:83 evidence hashes and15 gzip archives decode to the complete normalized views; reviewed-target executable/historical-artifact diff EMPTY and PA1 baseline domain diff EMPTY, both exit0. Raw failures remain published.

This supplemental publication receipt changes only factual review/state/log evidence, not executable content or acceptance requirements. Its own final commit cannot embed its own SHA; the immediately following normal receipt commit in Git and the final delivery identify that SHA and mechanically checked final HEAD/remote/parity/clean gate. PA1 ACCEPTED; M9 HUMAN ACCEPTED: NO; deployment NOT RUN; M10 NOT STARTED.
