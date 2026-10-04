# M10A-T04 execution evidence

2026-10-04 20:25:46 +08:00. **M10A-T04_IMPLEMENTED_VERIFIED**, repairs5/10. All focused/full/final technical gates PASS/checked exit0. Startingmain/d6ce93ee458a4698f91ea389d4fce75b107a9a11 was CLEAN/parity0/0/untracked0; T03 human acceptance explicitly recorded before product edits. T04 owner acceptance PENDING; fresh independent review NOT RUN; same-session review completed, deployment NOT RUN.

## Final visual evidence

[Actual same-session visual review / exact image hashes](visual-review.json), [baseline1835 raw hashes](before.json), [protected1826 incoming paths /1505 historical evidence](protection.json), [161 frozen executable/test/config hashes](executed-version.json). All24 Dealer PNGs and15 nativezoom captures were actually inspected.

| Dealer state | 1280x900 | 768x1024 | 320x720 |
| --- | --- | --- | --- |
| open | [desktop](visuals/dealer-open-1280.png) | [tablet](visuals/dealer-open-768.png) | [mobile](visuals/dealer-open-320.png) |
| hidden | [desktop](visuals/dealer-hidden-1280.png) | [tablet](visuals/dealer-hidden-768.png) | [mobile](visuals/dealer-hidden-320.png) |
| revealed | [desktop](visuals/dealer-revealed-1280.png) | [tablet](visuals/dealer-revealed-768.png) | [mobile](visuals/dealer-revealed-320.png) |
| complete | [desktop](visuals/dealer-complete-1280.png) | [tablet](visuals/dealer-complete-768.png) | [mobile](visuals/dealer-complete-320.png) |
| text200 | [desktop](visuals/dealer-text200-1280.png) | [tablet](visuals/dealer-text200-768.png) | [mobile](visuals/dealer-text200-320.png) |
| revealed-text200 | [desktop](visuals/dealer-revealed-text200-1280.png) | [tablet](visuals/dealer-revealed-text200-768.png) | [mobile](visuals/dealer-revealed-text200-320.png) |
| five | [desktop](visuals/dealer-five-1280.png) | [tablet](visuals/dealer-five-768.png) | [mobile](visuals/dealer-five-320.png) |
| five-text200 | [desktop](visuals/dealer-five-text200-1280.png) | [tablet](visuals/dealer-five-text200-768.png) | [mobile](visuals/dealer-five-text200-320.png) |

Open/hidden/complete screenshots are real existing e2e fixtures. Revealed seed7 Dealer4 clubs/K clubs/9 spades =23 Bust is an actual played3-card outcome; player-loss Dealer10clubs/9diamonds=19 complete. Five-card2/3/4/5/6=20 is explicitly isolated component layout evidence; surrounding seed7 round is not asserted as its played outcome. Full-page stress/text200 captures include necessary vertical scrolling; no page-level horizontal overflow or essential collisions.

[Before accepted normal scene](visuals/camera-before-dealt-1280.png), [final Dealer scene](visuals/camera-after-final-dealt-1280.png), [before measurements](visuals/before-composition.json), [final measurements](visuals/after-final-composition.json). Initial after capture/measurements also retained. Final normal open/dealt geometry exactly matches incoming: Stand883.359375px<=900, gap6px, Dealer180x220, guest84x112/local100x132. For4plus Dealer cards only, flow reserves just the additional wrapped-card height.

## Genuine native browser200% zoom

[Nativezoom receipt](visuals/zoom200.json): nativechrome.tabs.setZoom/getZoom2.0, observed1280x723 ->640x361 CSS viewport,DPR1.5 ->3, root16px/CSSzoom1/visualscale1 unchanged. Normal1280x900 Stand contract is independently checked; native Windows viewport is recorded as observed.15 inspected captures are real viewport clips, not CSS/font zoom or a synthetic full-page nativezoom image. Real keyboard/focus,44px controls, result/next-leaf/wager transitions and all essential region/child widths pass.

- player: [top](visuals/zoom200-player-top.png), [hand](visuals/zoom200-player-hand.png), [controls](visuals/zoom200-player-controls.png).
- player-five: [top](visuals/zoom200-player-five-top.png), [hand](visuals/zoom200-player-five-hand.png), [controls](visuals/zoom200-player-five-controls.png).
- player-split: [top](visuals/zoom200-player-split-top.png), [hand](visuals/zoom200-player-split-hand.png), [controls](visuals/zoom200-player-split-controls.png).
- player-rsa-cap: [top](visuals/zoom200-player-rsa-cap-top.png), [hand](visuals/zoom200-player-rsa-cap-hand.png), [controls](visuals/zoom200-player-rsa-cap-controls.png).
- Dealer: [idle](visuals/zoom200-dealer-idle.png), [hidden](visuals/zoom200-dealer-hidden.png), [real revealed3cards](visuals/zoom200-dealer-revealed-three.png).

[Actual-pixel contrast](visuals/contrast.json), [sample image](visuals/contrast-sample-1280.png):28 normal-text checks>=4.5; minimum6.969612258115216, rules8.35089319569114:1, real focus5.505122929235555>=3. Existing rule foreground unchanged. Representative measured backgrounds are bounded evidence, not comprehensive WCAG certification.

## Exact-version technical gates

| Gate | Status / checked exit | Receipt | Environment timestamps |
| --- | --- | --- | --- |
| t04-repair5-unit | PASS / 0 | [Receipt](t04-repair5-unit.json) | 2026-10-04 19:59:59 +08:00 .. 2026-10-04 20:00:03 +08:00 |
| t04-repair5-typecheck | PASS / 0 | [Receipt](t04-repair5-typecheck.json) | 2026-10-04 20:00:04 +08:00 .. 2026-10-04 20:00:17 +08:00 |
| t04-repair5-lint | PASS / 0 | [Receipt](t04-repair5-lint.json) | 2026-10-04 20:00:18 +08:00 .. 2026-10-04 20:00:27 +08:00 |
| t04-repair5-browser | PASS / 0 | [Receipt](t04-repair5-browser.json) | 2026-10-04 20:00:29 +08:00 .. 2026-10-04 20:02:35 +08:00 |
| t04-full-vitest | PASS / 0 | [Receipt](t04-full-vitest.json) | 2026-10-04 20:10:45 +08:00 .. 2026-10-04 20:11:05 +08:00 |
| t04-full-chromium | PASS / 0 | [Receipt](t04-full-chromium.json) | 2026-10-04 20:11:33 +08:00 .. 2026-10-04 20:15:05 +08:00 |
| t04-preservation | PASS / 0 | [Receipt](t04-preservation.json) | 2026-10-04 20:15:28 +08:00 .. 2026-10-04 20:17:48 +08:00 |
| t04-unified | PASS / 0 | [Receipt](t04-unified.json) | 2026-10-04 20:18:51 +08:00 .. 2026-10-04 20:24:20 +08:00 |
| PA1 read-only assets/reproduction | PASS /0 | [Receipt](assets.json) | Recorded in receipt |
| Protected raw incoming bytes | PASS /0 | [Receipt](protection.json) | Recorded in receipt |

Focused11files/78tests and29Chromium; full82files/1082Vitest and76Chromium. Incoming81/1071/73 plus one11-case unit file/three browser cases explains counts. Independent M1–M8 preservation reruns accepted assertion/inventory sets; current PA1/RA1/M9/M10-T01/M10A-T01/T02/T03/T04 unit/browser cases pass. Original assertion prefixes/thresholds/retries remain unchanged.161 source/test/config hashes remain frozen; src/domain diff EMPTY, no asset/geometry/controller/dependency changes.

## Failed attempts and bounded repairs

[Complete5-cycle ledger](repairs.json), [task contract and historical checkpoints](../M10A_T04.md). Repair1 baseline collector refused task-authored contract before the clean snapshot; unchanged guard then passed, unknown work not discarded. Original invocation/stack is in the chat; actual failure timestamp not recorded and not invented. Repair2 [typecheckFAIL/2](t04-initial-typecheck.json) then [typed literal examplesPASS](t04-repair2-typecheck.json). Repair3 [initial Chromium16PASS/12FAIL](t04-initial-browser.json) responsive inheritedleft/translate and wrong new expected19 corrected, [28PASS](t04-repair3-browser.json). Repair4 [five-card pressureFAIL](t04-five-card-pressure.json), [supplemental initial generated outputs](five-pressure-collection.json), then [29PASS](t04-repair4-browser.json). Repair5 actual desktop screenshot review found duplicate accepted reserve despite mechanicalPASS; targeted margin correction and [29PASS](t04-repair5-browser.json), all final visuals inspected. All original failures/logs/traces remain retained; no luck-based retries or weakened assertions.

Only25 known historical output destinations route to task-scoped captures using the same historical Node preload; assertions/config/retries unchanged. Canonical PA1 read-only. Every runner separately records actual child exit and administrative collection/protection. Raw logs, generated failure Markdown and tool/router snapshots are retained losslessly via gzip with raw/compressed SHA256/length in the archive manifest; full failed content preserved without newline rewriting. Normal publication follows full review.

M10A-T05 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE

M10-T02 NOT STARTED

M10-T04 IMPLEMENTATION NOT STARTED

Final affected documentation checks: [5 files /13 tests PASS, checked exit0](t04-final-documentation.json). Product/tests/config remain the frozen161 hashes.

## Same-session precommit review

2026-10-04 20:27:28 +08:00. [Evidence/source/privacy review](precommit-review.json), [native stage/whitespace checkpoint](staged-review-checkpoint.json), [lossless raw archives](log-archive.json). Complete authored diff and required actual images inspected. Final affected-document/index checks follow these facts-only entries; product/tests remain161 exact executed hashes. Current repairs5/10; all historical failures retained. Fresh independent review NOT RUN; owner visual acceptance PENDING.
