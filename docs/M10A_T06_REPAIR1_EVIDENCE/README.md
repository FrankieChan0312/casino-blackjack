# M10A-T06 Human Visual Repair 1 evidence

2026-10-05 00:29:37 +08:00. **M10A-T06_IMPLEMENTED_VERIFIED**, cumulative4/10. Owner normal action dock ACCEPTED; overall T06 NOT ACCEPTED / awaiting final live review. Publication pending, fresh independent review NOT RUN, deployment NOT RUN. Previous evidence is immutable. [Contract](../M10A_T06.md), [baseline](before.json), [repair ledger](repair-ledger.json), [exact executed version](executed-version.json), [technical gate](technical-gate.json), [focused gate](focused-gate.json), [protection](protection.json), [bounded actual image review](visual-review.json), [collected control screenshots](control-image-index.json).

## Comparable state captures

Identical real-domain fixtures/100-credit commands. A new explicit19-versus19 Push fixture was added before UI presentation changes; no domain or engine manipulation.

| State /width | Before | After |
| --- | --- | --- |
| Insurance /1280 | [Before](visuals/before-insurance-1280.png) | [After](visuals/after-insurance-1280.png) |
| Insurance /768 | [Before](visuals/before-insurance-768.png) | [After](visuals/after-insurance-768.png) |
| Insurance /320 | [Before](visuals/before-insurance-320.png) | [After](visuals/after-insurance-320.png) |
| Eligible Even Money /1280 | [Before](visuals/before-even-money-1280.png) | [After](visuals/after-even-money-1280.png) |
| Eligible Even Money /768 | [Before](visuals/before-even-money-768.png) | [After](visuals/after-even-money-768.png) |
| Eligible Even Money /320 | [Before](visuals/before-even-money-320.png) | [After](visuals/after-even-money-320.png) |
| Win /1280 | [Before](visuals/before-complete-win-1280.png) | [After](visuals/after-complete-win-1280.png) |
| Win /768 | [Before](visuals/before-complete-win-768.png) | [After](visuals/after-complete-win-768.png) |
| Win /320 | [Before](visuals/before-complete-win-320.png) | [After](visuals/after-complete-win-320.png) |
| Loss /1280 | [Before](visuals/before-complete-loss-1280.png) | [After](visuals/after-complete-loss-1280.png) |
| Loss /768 | [Before](visuals/before-complete-loss-768.png) | [After](visuals/after-complete-loss-768.png) |
| Loss /320 | [Before](visuals/before-complete-loss-320.png) | [After](visuals/after-complete-loss-320.png) |
| Neutral Push /1280 | [Before](visuals/before-complete-push-1280.png) | [After](visuals/after-complete-push-1280.png) |
| Neutral Push /768 | [Before](visuals/before-complete-push-768.png) | [After](visuals/after-complete-push-768.png) |
| Neutral Push /320 | [Before](visuals/before-complete-push-320.png) | [After](visuals/after-complete-push-320.png) |

[Raw before geometry](visuals/before-states.json), [after geometry](visuals/after-states.json). Insurance192.375 ->118.546875px; result250.171875 ->123.1875px. [Normal before](visuals/before-player-1280.png) /[after](visuals/after-player-1280.png); [betting before](visuals/before-open-1280.png) /[after](visuals/after-open-1280.png), exact pixels atall3 widths. [Camera before](visuals/before-composition.json) /[after](visuals/after-composition.json); Stand883.359375<=900, gaps6/16/10 and local HUD bounds unchanged.

## Executed checks

Focused UI13/97, Chromium42; full84/1101/89; current preservation18/145; independent M1–M8 and unified PASS/checked0. All nine runner phases have raw command/exit/restoration receipts named hr1-*.json; logs are retained losslessly through gzip and its manifest after final archival. Count drift is exactly3 unit/3 nested Chromium cases, no removed historical assertions.

[Text contrast](visuals/control-contrast.json)49samples minimum6.514407246458633:1,10focus checks >=3; [scene contrast](visuals/contrast.json)28PASS; [native browser zoom2.0](visuals/zoom200.json), [native decision disclosures](visuals/zoom200-disclosure.json), [PA1 reproduction](assets.json). Text200/native200 and keyboard/disclosures/44px/overflow/cards verified for real decisions/results, with all screenshots retained.34 control/8native screenshots listed in visual-review.json were actually opened; other collected screenshots are available but not claimed individually inspected.

All2955 protected files/2629 historical evidence paths byte-identical, domain EMPTY; accepted Actions/Betting/native command/disabled expressions/result calculations unchanged. No future task, Motion/animation or deployment. M10A-T07 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE; M10-T02 NOT STARTED; M10-T04 IMPLEMENTATION NOT STARTED.

## Executed publication

Implementation **05c1b4cef9bb6915422a32a93b63e2175fd0a9f6** committed and normally pushed to origin/main, live parity0/0/CLEAN/untracked0 confirmed. [Actual commit](implementation-commit.json), [publication](implementation-publication.json). A documentation/evidence-only receipt follows; final HEAD reported in Git/final delivery. Executable hashes unchanged. Owner overall NOT ACCEPTED / awaiting new live review; T07 remains waiting.
