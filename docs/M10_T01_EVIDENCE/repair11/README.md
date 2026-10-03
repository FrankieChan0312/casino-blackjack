# M10-T01 exceptional repair11/11

**M10-T01_IMPLEMENTED_VERIFIED.** Final unified gate PASS/exit0; human acceptance NOT RUN.

## Authorization and exact correction

**OWNER-AUTHORIZED EXCEPTION.** Normal10/10 limit was reached. The owner authorized exactly one exceptional product repair11/11; repair12 is NOT AUTHORIZED / NOT PERFORMED. The incoming uncommitted composition and55 repair09 evidence files were retained. Baseline main/9ca8082b8ce5f9ae7aa90e07356be48c3a6ca2d1; incoming9 tracked modifications, index empty, live origin/main parity0/0. [Incoming file/hash snapshot](before.json). Historical10/10 blocker records remain unchanged.

The only exceptional product edit is three CSS lines:

```css
@media (min-width: 1101px) {
  .player-mode .round-status { margin-block: 2px; }
}
```

This reduces the desktop status's two8px outer margins to2px each, saving12px. Text,6px padding/line-height, card/seat/Dealer/control dimensions, canonical1–7 geometry, DOM/focus and commands are retained. This is ordinary product spacing, without clipping/hiding/scaling/test-only styles. [Exact first measurement](step1.json): **908.703125 -> 896.703125px**, requirement <=900.00px; Stand116x52px, transform none. [Actual desktop PNG](step1-desktop.png), [trace](step1-trace.zip).

Recommended GPT Sol6.1/High; client metadata supports gpt-6.1-sol/High; actual runtime model/effort NOT VERIFIED/NOT VERIFIED. No delegation. T02/T04+ NOT STARTED; no player-count selector/logic, formal Dealer art/selection/animation, Motion, animation infrastructure, dealing/action/reveal/chip/payout animation, rules/side bets or deployment. Human visual acceptance and fresh independent review NOT RUN.

## Sequential verification

| Step | Actual result / evidence |
| --- | --- |
| Exact desktop first | [step1](step1.json) PASS/exit0,896.703125px |
| Original M10-E01/M9-E01 | [focused receipt](step2-focused-corrected.json), [raw log](step2-focused-corrected.log.gz):2/2 browser PASS; early evidence wrapper failed after tests while restoring geometry. Its wrapper exit1 is retained. Later full67/final runs check both cases and actual exits independently. |
| Three-viewport current PA1/M9/M10 precheck | [receipt](step3-browser.json), [raw log](step3-browser.log.gz):20/20 browser PASS; post-test wrapper failed on mapped-file truncation. Separate child exit was not persisted and is NOT RECORDED, not invented0. Exact incoming restoration then PASS/exit0. |
| Full Vitest | [step4-vitest](step4-vitest.json), [raw log](step4-vitest.log.gz):78 files/1047 PASS, checked exit0 |
| Full Chromium | [step4-chromium](step4-chromium.json), [raw log](step4-chromium.log.gz):67 PASS, checked exit0; includes original focused/precheck/PA1/M9/M10 cases |
| Independent M1–M8 | [step4-preservation](step4-preservation.json), [raw log](step4-preservation.log.gz):PASS, checked exit0; accepted M8 956 Vitest/44 Chromium retained |
| Current PA1/M9/M10 preservation | Complete current unit/browser suites above; original-test source guard, secrecy/RNG/replay/accounting/identity and all current scenarios retained |
| PA1 source/production audit | [receipt](character-assets.json), [raw log](character-assets.log.gz):12 source/12 transparent240x320 production PNG hashes/reproduction PASS, exit0 |
| Final unified repository gate | [final-verify](final-verify.json), [raw stream](final-verify.log.gz); status/checked exit in that receipt |

1047 equals incoming documented1045 plus two composition tests;67 equals66 plus one composition browser test. Exceptional repair adds no test registration, assertion/config change or executable tool/dependency change. Complete suites are required executions, not retries until green. [Diagnostic closure](diagnostic-closure.json) distinguishes the early collection/invocation failures from product results; no separate child exit is fabricated.

## Actual visual and browser zoom precheck

All25 normal/stress/native-zoom PNGs were actually inspected in the same session. [Per-PNG SHA256/dimensions/findings](visual-review.json). Normal1280x900/768x1024/320x720, five real cards, four real ordered split leaves,200% root text/fallback/reduced motion and keyboard retain readable controls/cards/identities. Long enlarged guest labels wrap; vertical scrolling is allowed. No essential-region intersection or page horizontal overflow was found in the bounded scenarios. These checks do not constitute owner acceptance or a general accessibility certification.

| Scenario | Desktop1280 | Tablet768 | Mobile320 |
| --- | --- | --- | --- |
| Open | [PNG](scene-open-1280.png) | [PNG](scene-open-768.png) | [PNG](scene-open-320.png) |
| Dealt | [PNG](scene-dealt-1280.png) | [PNG](scene-dealt-768.png) | [PNG](scene-dealt-320.png) |
| Five cards | [PNG](five-cards-1280.png) | [PNG](five-cards-768.png) | [PNG](five-cards-320.png) |
| Four split leaves | [PNG](four-leaves-1280.png) | [PNG](four-leaves-768.png) | [PNG](four-leaves-320.png) |
| 200% text/fallback | [PNG](text-fallback-1280.png) | [PNG](text-fallback-768.png) | [PNG](text-fallback-320.png) |

[Actual native200% zoom receipt](zoom200.json): isolated headed Chromium with [native tabs.setZoom/getZoom](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom), not CSS zoom/font enlargement/page-scale/device-scale emulation. [Official isolated-extension workflow](https://playwright.dev/docs/chrome-extensions); [executed driver source](zoom-driver.txt). Every fixture applies/asserts zoom2.0 after navigation and checks640px CSS viewport before gameplay/keyboard and after capture. Root font16px/CSS zoom1/visual scale1 remain unchanged; Windows DPR1.5 becomes3. The observed native100% content viewport is1280x723 CSS pixels/DIPs, not an invented900px height; at200% it becomes640x361. PNG device-pixel dimensions are recorded separately. Normal desktop fit was independently measured at1280x900.

Actual native surface captures avoid full-page device-metrics changes; scroll positions show top/hand/controls. Contiguous Tab/Enter reaches Stand or Deal Again with44px minimum targets and expected result/wager focus. All three actual zoom fixtures PASS:

| Native200% fixture | Top | Hand | Controls |
| --- | --- | --- | --- |
| Normal | [PNG](zoom200-player-top.png) | [PNG](zoom200-player-hand.png) | [PNG](zoom200-player-controls.png) |
| Five cards | [PNG](zoom200-player-five-top.png) | [PNG](zoom200-player-five-hand.png) | [PNG](zoom200-player-five-controls.png) |
| Four leaves | [PNG](zoom200-player-rsa-cap-top.png) | [PNG](zoom200-player-rsa-cap-hand.png) | [PNG](zoom200-player-rsa-cap-controls.png) |

First failures are retained: [native height setup](zoom200-setup-failure.json), [window-border setup](zoom200-border-setup-failure.json), [invalid navigation/capture driver](zoom200-driver-failure.json). The initial driver set per-tab zoom before navigation; recorded getZoom1.0 afterward invalidates its200% claim. No200% PASS is credited from those attempts. Corrected native configuration adds checks rather than weakening application assertions. Failed-version full-page PNGs remain separate from the nine final native captures.

## Evidence preservation and tool failures

[Initial shell failure](step2-focused.json), [raw log](step2-focused.log.gz): Windows interpreted the pipe in the first regex. No validation credit; the closure corrects the initial overconfident did-not-start claim. Its copied pre-existing test-results are labelled uncredited, not evidence of a completed invocation.

The early Node UNKNOWN/-4094/open and native truncation error reported a user-mapped section open on known historical outputs. This identifies the failed operation; the mapped handle owner/root cause remains NOT ESTABLISHED. No test retry/timeout/worker/assertion or product adjustment follows those collection errors. [Known25-path recovery](step3-restoration-jobs.json) and the focused/precheck receipts preserve every generated output before exact incoming-byte restoration. Native atomic File.Replace avoids truncating mapped destinations. [Phase capture/checked-exit utility](phase-runner.txt) snapshots only that known whitelist, persists child exits before administrative collection, retains new bytes, and restores incoming bytes without touching canonical PA1.

[Protected after precheck](protected-after.json) records604 matching incoming paths, including all55 prior repair09 files, and proves removing exactly the three CSS lines recovers the incoming CSS hash. Final protected/scope/hash/privacy/whitespace and file inventory receipts accompany publication. Generated bytes are deduplicated by SHA256 in `generated/`; phase JSONs map actual source paths to retained files and original/restored hashes. PA1 canonical17 references are read-only throughout; accepted source/production assets and pure geometry remain unchanged. Raw logs are losslessly gzip-archived with round-trip/hash receipts. No raw session transcript is published.

Implementation, checked verification, commit/push, fresh review, human acceptance and deployment remain separate events. [STATE](../../STATE.md), [task receipt](../../M10_T01.md), [execution log](../../DEVELOPMENT_LOG.md) identify final delivery. M10-T02 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE.

## Final administrative records

[Protected final603-path guard](protected-final.json), [lossless raw-log archive receipt](raw-log-archives.json), [trace-entry/privacy inspection](trace-privacy.json), [final administrative review](administrative-final.json), and [retained file inventory](files.json) support publication. [Initial administrative whitespace failure](administrative-check-failure.json) incorrectly classified three raw Playwright contexts/reports as authored files; [lossless raw-report archives](raw-generated-archives.json) preserve exact failed/generated bytes instead of normalizing them. Generated `.gz` digest filenames identify the decompressed raw SHA256; archive hashes are recorded separately. No product/test change follows this administrative correction.
