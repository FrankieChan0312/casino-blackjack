# M10A-T03 execution evidence

M10A-T03_IMPLEMENTED_VERIFIED; all required focused/full/final gates PASS / checked exit0. T03 repairs4/10, owner visual acceptance PENDING, fresh independent review NOT RUN, deployment NOT RUN. Baseline main/fbed1a787af8cbaac96b7e22a31200b282b0677d clean/local=remote/0/0/untracked0; T02 accepted before edits.

## Visual review

[Same-session review and exact image hashes](visual-review.json), [incoming tracked raw hashes](before.json), [protected incoming proof](protection.json), [executed source/test/config freeze](executed-version.json). Actual unchanged e2e fixtures are played rounds; component literal cases additionally cover3/4-card and3-leaf states. The original T02 isolated remote composition fixtures are retained without being relabelled as gameplay.

| State | 1280x900 | 768x1024 | 320x720 |
| --- | --- | --- | --- |
| normal | [desktop](visuals/hud-normal-1280.png) | [tablet](visuals/hud-normal-768.png) | [mobile](visuals/hud-normal-320.png) |
| five | [desktop](visuals/hud-five-1280.png) | [tablet](visuals/hud-five-768.png) | [mobile](visuals/hud-five-320.png) |
| two-split | [desktop](visuals/hud-two-split-1280.png) | [tablet](visuals/hud-two-split-768.png) | [mobile](visuals/hud-two-split-320.png) |
| four-split | [desktop](visuals/hud-four-split-1280.png) | [tablet](visuals/hud-four-split-768.png) | [mobile](visuals/hud-four-split-320.png) |
| result | [desktop](visuals/hud-result-1280.png) | [tablet](visuals/hud-result-768.png) | [mobile](visuals/hud-result-320.png) |
| five text 200% | [desktop](visuals/hud-five-text200-1280.png) | [tablet](visuals/hud-five-text200-768.png) | [mobile](visuals/hud-five-text200-320.png) |
| two-split text 200% | [desktop](visuals/hud-two-split-text200-1280.png) | [tablet](visuals/hud-two-split-text200-768.png) | [mobile](visuals/hud-two-split-text200-320.png) |
| four-split text 200% | [desktop](visuals/hud-four-split-text200-1280.png) | [tablet](visuals/hud-four-split-text200-768.png) | [mobile](visuals/hud-four-split-text200-320.png) |

[Before accepted scene](visuals/camera-before-dealt-1280.png), [after local HUD](visuals/camera-after-dealt-1280.png), [before measurements](visuals/before-composition.json), [after measurements](visuals/after-composition.json). Stand bottom883.359375px <=900; original Dealer180x220, guests84x112, local cards100x132 and6px landing gap retained. Full-page images intentionally include vertical scrolling for stress layouts.

[Native zoom proof](visuals/zoom200.json): actual chrome.tabs setZoom/getZoom2.0,1280x723 ->640x361,DPR1.5 ->3,root16px/CSSzoom1 unchanged. Four real scenarios and keyboard/focus/44px targets pass. Captures are viewport clips at top/hand/controls, not a synthetic whole-page native zoom image. [Normal HUD](visuals/zoom200-player-hand.png), [five-card HUD](visuals/zoom200-player-five-hand.png), [Split HUD](visuals/zoom200-player-split-hand.png), [four-leaf HUD](visuals/zoom200-player-rsa-cap-hand.png), [normal controls/funds](visuals/zoom200-player-controls.png).

[Actual-pixel contrast](visuals/contrast.json), [sampling image](visuals/contrast-sample-1280.png):24 text checks>=4.5, focus>=3; minimum/payout4.520553075070118:1, focus5.505122929235555:1. No threshold/test-only CSS/hidden alternate text/production colour repair. Bounded measured checks do not establish comprehensive WCAG certification.

## Commands and failure history

[Initial focused67 PASS](t03-initial-unit.json), [initial typecheck FAIL/2](t03-initial-typecheck.json); repair1 typed public examples/status correction, [typecheck PASS](t03-repair1-typecheck.json), [unit67 PASS](t03-repair1-unit.json), [Chromium24 PASS/2 FAIL](t03-repair1-browser.json).

Repair2 full-width hand lane/identity ordering and card wrapping: [unit67 PASS](t03-repair2-unit.json), [Chromium25 PASS/1 FAIL](t03-repair2-browser.json). Repair3 new-test next Split-leaf focus correction only: [typecheck](t03-repair3-typecheck.json), [lint](t03-repair3-lint.json), [Chromium26 PASS](t03-repair3-browser.json). Counts and failed original artifacts are retained.

Only25 known historical image/geometry writer destinations route to task/run-specific outputs; source/assertions/thresholds/retries unchanged. Each runner receipt separately records child command exit and administrative collection/protection status. Canonical PA1 stays read-only. Drivers are stored as text; full raw logs and generated failure contexts are retained losslessly in gzip with original/decompressed SHA256 and lengths when archived. No failures erased or line endings rewritten.

## Final exact-version gates

2026-10-04 18:32:54 +08:00.

| Gate | Status / checked exit | Receipt | Environment timestamps |
| --- | --- | --- | --- |
| t03-repair2-unit | PASS / 0 | [Receipt](t03-repair2-unit.json) | 2026-10-04 18:10:25 +08:00 .. 2026-10-04 18:10:29 +08:00 |
| t03-repair3-browser | PASS / 0 | [Receipt](t03-repair3-browser.json) | 2026-10-04 18:13:25 +08:00 .. 2026-10-04 18:15:22 +08:00 |
| t03-final-fullunit | PASS / 0 | [Receipt](t03-final-fullunit.json) | 2026-10-04 18:18:11 +08:00 .. 2026-10-04 18:18:30 +08:00 |
| t03-final-fullbrowser | PASS / 0 | [Receipt](t03-final-fullbrowser.json) | 2026-10-04 18:18:31 +08:00 .. 2026-10-04 18:21:34 +08:00 |
| t03-final-preservation | PASS / 0 | [Receipt](t03-final-preservation.json) | 2026-10-04 18:23:28 +08:00 .. 2026-10-04 18:26:08 +08:00 |
| t03-final-unified | PASS / 0 | [Receipt](t03-final-unified.json) | 2026-10-04 18:26:09 +08:00 .. 2026-10-04 18:31:24 +08:00 |
| PA1 read-only assets/reproduction | PASS /0 | [Receipt](assets.json) | Recorded in receipt |
| Protected incoming byte guard | PASS /0 | [Receipt](protection.json) | Recorded in receipt |

Full81files/1071Vitest/73Chromium, focused67/26. Baseline80/1059/71+one new12-case unit file/two browser cases; no unexplained drift. Frozen159 executable/test/config files match the verified deliverable. Independent M1–M8 inventories preserved; current PA1/RA1/M9/M10/T01/T02/T03 full/focused cases and raw guards PASS. Original assets/canonical17 unchanged. Normal main publication follows review; owner acceptance PENDING, fresh independent review NOT RUN, deployment NOT RUN.

## Repair4 document whitespace

2026-10-04 18:35:08 +08:00. Staged whitespace FAIL/2 solely at the authored T03 document EOF; [original receipt](repair4-staged-whitespace-failure.json). Remove its final blank line only; all product/tests/thresholds/executed159 hashes remain unchanged and complete technical gates PASS. Current cumulative4/10; earlier3/10 visual/technical snapshots retain their actual checkpoint count. Failed raw bytes remain losslessly archived. Affected documents and stage integrity follow before normal publication.

## Same-session precommit review

2026-10-04 18:37:29 +08:00. [Evidence/source/privacy review](precommit-review.json), [native index/whitespace checkpoint](staged-review-checkpoint.json), [lossless raw archives](log-archive.json), [repair4 affected document PASS](t03-repair4-documentation.json). Full authored diff and required actual images inspected; complete technical gates PASS for159 unchanged executable hashes. Final facts-only documentation and index checks follow before publication. Current repairs4/10; all prior checkpoints/failures retained. Fresh independent review NOT RUN; owner visual acceptance PENDING.

## Implementation publication

2026-10-04 18:39:23 +08:00. Normal main/origin push PASS/checked exit0. [Implementation commit](implementation-commit.json), [live parity/clean publication receipt](implementation-publication.json). HEAD/origin/live remote=d4efd6929b736d0778ba1cee8ae1e94ca82d9477, ahead/behind0/0,working tree CLEAN,untracked0 at this published checkpoint. Actual raw commit/push/fetch logs are retained losslessly in the archive manifest. A facts-only publication-receipt commit follows after affected docs/index checks; final Git/delivery identifies that final HEAD. Product/tests/config remain the159 verified hashes. Repairs4/10, owner acceptance PENDING, fresh independent review NOT RUN, deployment NOT RUN. STOP; no later task started.
