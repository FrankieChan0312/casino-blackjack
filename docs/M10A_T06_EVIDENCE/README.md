# M10A-T06 — evidence index

Final technical gate: **M10A-T06_IMPLEMENTED_VERIFIED**, repairs **3/10**. Owner T06 acceptance PENDING; fresh independent review NOT RUN; no deployment. T05 explicit acceptance is recorded in STATE/task/PLAN. All timestamps come from the execution environment. [Baseline](before.json), [technical gate](technical-gate.json), [repair ledger](repair-ledger.json), [protected bytes](protection.json), [PA1 source/reproduction audit](assets.json), [executed version](executed-version.json).

## Verification

| Check | Actual result / checked exit | Receipt |
| --- | --- | --- |
| Focused control/betting/Insurance/Even Money UI | 13 files / 94 tests PASS / 0 | [UI](t06-repair2-unit.json) |
| Focused Chromium and restored historical evidence | 39 tests PASS / 0 | [Browser](t06-repair3-browser.json) |
| Full Vitest | 84 files / 1098 tests PASS / 0 | [Vitest](t06-repair3-full-vitest.json) |
| Full Chromium | 86 tests PASS / 0 | [Chromium](t06-full-chromium.json) |
| Independent M1–M8 preservation | PASS / 0, accepted M8 66/956/44 intact | [Preservation](t06-preservation.json) |
| Current PA1/RA1/M9/M10-T01/M10A-T01..T06 | 18 files / 142 tests PASS / 0 | [Current](t06-current-preservation.json) |
| scripts/verify.ps1 | PASS / 0 | [Unified](t06-unified.json) |
| Native browser zoom 2.0 | PASS / 0, actual 1280 -> 640 CSS width | [Zoom](visuals/zoom200.json) |
| Control text and actual focus rings | 42 text checks min 6.598619564170631:1; six focus checks >=3 PASS | [Contrast](visuals/control-contrast.json) |
| Existing scene text / geometry | 28 text checks PASS; Stand 883.359375px; before/final equal | [Scene contrast](visuals/contrast.json), [camera](visuals/after-final-composition.json) |
| Screenshot inspection before full suites | All 36 control / 23 native zoom images opened, PASS | [Review and exact hashes](visual-review.json) |

Baseline 83 files / 1090 Vitest / 79 Chromium increases by one eight-case unit file and one seven-case browser file. New spec uses normal recursive Playwright discovery in tests/browser/m10a; no historical assertion changed. Original failures retained: [first UI](t06-initial-unit.json), [first focused browser](t06-focused-browser.json), [first full inventory](t06-full-vitest.json); targeted reruns and lossless raw log archives remain available. Log .gz files retain exact original bytes and independent decompressed hashes; [archive manifest](log-archive.json).

## Representative screenshots

| State | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Betting open | [1280](visuals/control-open-1280.png) | [768](visuals/control-open-768.png) | [320](visuals/control-open-320.png) |
| Normal actions | [1280](visuals/control-player-1280.png) | [768](visuals/control-player-768.png) | [320](visuals/control-player-320.png) |
| Split Hand A | [1280](visuals/control-split-a-1280.png) | [768](visuals/control-split-a-768.png) | [320](visuals/control-split-a-320.png) |
| Split Hand B | [1280](visuals/control-split-b-1280.png) | [768](visuals/control-split-b-768.png) | [320](visuals/control-split-b-320.png) |
| Insurance | [1280](visuals/control-insurance-1280.png) | [768](visuals/control-insurance-768.png) | [320](visuals/control-insurance-320.png) |
| Eligible Even Money | [1280](visuals/control-even-money-1280.png) | [768](visuals/control-even-money-768.png) | [320](visuals/control-even-money-320.png) |
| Unaffordable Insurance | [1280](visuals/control-insurance-unavailable-1280.png) | [768](visuals/control-insurance-unavailable-768.png) | [320](visuals/control-insurance-unavailable-320.png) |
| Round complete | [1280](visuals/control-complete-1280.png) | [768](visuals/control-complete-768.png) | [320](visuals/control-complete-320.png) |

Text enlargement images are control-text200-{open,player,insurance,even-money}-{1280,768,320}.png; every exact path/hash is in visual-review.json. Native browser screenshots include [actions](visuals/zoom200-player-controls.png), [betting](visuals/zoom200-control-open-controls.png), [Insurance](visuals/zoom200-control-insurance-controls.png), [Even Money](visuals/zoom200-control-even-money-controls.png) and all 23 hashes in the review. Native zoom uses an isolated actual Chromium profile and chrome.tabs.setZoom/getZoom, not CSS font enlargement. Existing focus outline on decision/result entry is retained deliberately.

## Scope and provenance

Five product files: App, Actions, Betting, Decisions and appended styles only. Existing fixture adds one real-domain controlled Even Money shoe; two new T06 test files. No domain/controller/RNG/shoe/cards/accounting/replay/strategy/geometry/dependency mutation. Exact T01–T05 CSS prefix, 2567 protected incoming files, 2244 historical evidence files and all PA1 original/production/canonical bytes retained. Twenty-five known historical screenshot destinations are routed into owned outputs during verification; original assertions unchanged and historical incoming hashes checked for each phase. Task-owned driver snapshots preserve reproducibility; traces/logs include original failed attempts.

M10A-T07 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE. M10-T02 NOT STARTED. M10-T04 IMPLEMENTATION NOT STARTED. Final accounting HUD/formal Dealer artwork/animations NOT IMPLEMENTED; Motion NOT INSTALLED; deployment NOT RUN.

## Publication

Implementation 37e71e6aded3dcd193317f4eb1518ceb76bcfd9e was committed and pushed normally to origin/main. [Actual commit](implementation-commit.json), [live parity and clean-tree receipt](implementation-publication.json). A documentation/evidence-only follow-up records these executed facts; the final commit is reported in Git/final delivery. No executable content changed after the frozen technical gate. Human T06 acceptance remains PENDING; T07 remains NOT STARTED.
