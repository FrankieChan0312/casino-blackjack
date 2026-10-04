# M10A-T01 exceptional repair11/11 — IMPLEMENTED / VERIFIED

2026-10-04 12:56:07 +08:00 — Owner-authorized contrast-only final repair; reason **Final accessibility contrast correction only**. No repair12. Current technical gate PASS; normal main publication follows review. Human Visual Acceptance **NOT ACCEPTED / PENDING**, genuinely fresh independent review **NOT RUN**, deployment **NOT RUN**. M10A-T02 NOT STARTED — WAITING FOR HUMAN VISUAL ACCEPTANCE.

## Exact change and first gate

Only desktop>=1101px .player-mode .game-scene .table-inscription gains color:#e3d3a5, overriding#e2d2a4. RGB226/210/164 ->227/211/165; each channel+1, no layout/size/spacing/geometry/asset/test/threshold change in this exception. Existing prior visual CSS/test repair remains intact. [Contract](contract.md), [1110-path incoming baseline](before.json), [first exact driver](exact-contrast-driver.txt), [first exact check](visuals/exact-contrast.json), [sample](visuals/exact-contrast-1280.png).

The ONLY initial post-edit check ran2026-10-04 12:42:00 +08:00..2026-10-04 12:42:02 +08:00: **4.520553075070118:1 PASS/exit0**, before4.476153734022139:1, required>=4.5. Computed actual foreground versus brightest independently sampled screenshot felt43/102/82; same fixture,1280x900, selector and sample method as the original failure. The threshold remains unchanged. [Subsequent12 normal-text and keyboard-focus checks](visuals/contrast.json) PASS; solid3px focus ratio5.505122929235555>=3. Bounded checks, no general certification claim.

## Retained composition and actual images

Matched capture measurements are byte-for-byte equivalent as JSON: Dealer180x220, guest portraits84x112, local portrait72x96/cards100x132, hand-to-controls6px, scene widths/height/form/native controls unchanged. [Matched final capture](visuals/after-composition.json), [prior repair10 capture](../human-repair01/final-composition.json), [protection proof](protected-before-unified.json). Official desktop Stand remains **890.71875px**; matched direct capture bottom887.71875px reflects its original3px header-phase difference, also unchanged. No framing reopened.

| Actual surface | Fresh image |
| --- | --- |
| Desktop betting / hover | [1280x900](generated/e9f203e99154a1dbc9944e42d6467361195cb510c92d176e1cf619e4ae6b1c29.png) |
| Desktop play | [1280x900](generated/40b7f22a63a99feea7630b73ad99c75f07f6029f7b7a3a33d34a40a9a183f15f.png) |
| Tablet play | [768x1024](generated/f59189e58612b4e0f0dc1a7ec83d0703ab3bb1f15bfb55b471e533f30edbbf19.png) |
| Mobile play | [320x720](generated/19df1b319bbc24e4c25e2f06f1035dffd6d7f055de76984827c4bb3100986071.png) |
|200% text | [Desktop](generated/1025bbc87824e508f3049ae39b02241171ed72e8a3513dc0eec1449493a54d4b.png) |
| Native200% zoom | [Normal hand](visuals/zoom200-player-hand.png), [controls](visuals/zoom200-player-controls.png) |

14 focused normal/results/five-card/four-leaf/fallback/text images,9 native viewport clips and1 matched direct desktop image were actually inspected. No observed colour-induced composition damage. [Native receipt](visuals/zoom200.json): chrome.tabs.setZoom/getZoom2.0, observed1280x723 ->640x361, DPR1.5 ->3, root16px/CSS zoom1/visualScale1 unchanged. The native Windows viewport is recorded honestly; primary1280x900 is independently tested. Keyboard Tab/Enter,44px controls and action/result/wager focus restoration PASS.

## Executed gates

| Gate | Result | Environment timestamps | Evidence |
| --- | --- | --- | --- |
| ex11-focused-ui | PASS / exit0 | 2026-10-04 12:42:41 +08:00..2026-10-04 12:42:43 +08:00 | [Receipt](ex11-focused-ui.json), [raw output](ex11-focused-ui.log.gz) |
| ex11-focused-browser | PASS / exit0 | 2026-10-04 12:42:51 +08:00..2026-10-04 12:43:52 +08:00 | [Receipt](ex11-focused-browser.json), [raw output](ex11-focused-browser.log.gz) |
| ex11-full-vitest | PASS / exit0 | 2026-10-04 12:44:38 +08:00..2026-10-04 12:44:51 +08:00 | [Receipt](ex11-full-vitest.json), [raw output](ex11-full-vitest.log.gz) |
| ex11-full-chromium | PASS / exit0 | 2026-10-04 12:44:50 +08:00..2026-10-04 12:46:48 +08:00 | [Receipt](ex11-full-chromium.json), [raw output](ex11-full-chromium.log.gz) |
| ex11-independent-preservation | PASS / exit0 | 2026-10-04 12:47:13 +08:00..2026-10-04 12:49:09 +08:00 | [Receipt](ex11-independent-preservation.json), [raw output](ex11-independent-preservation.log.gz) |
| ex11-final-verify | PASS / exit0 | 2026-10-04 12:50:01 +08:00..2026-10-04 12:54:30 +08:00 | [Receipt](ex11-final-verify.json), [raw output](ex11-final-verify.log.gz) |

Focused UI8/46, M10/M10A/M9/PA1 Chromium22; full Vitest79/1050 and full Chromium69. The published baseline had68 browser tests; the preserved prior repair adds exactly one M10A-E02, unchanged during this exception. No unexplained drift, skipped tests, retries or weakened assertions. Independent M1(12/155), M2(6/78), M3(5/72), M4(7/171), M5(8/168), M6(9/181), M7(56/870 +24 Chromium), M8(66/956 +44 Chromium) PASS. Current PA1/RA1/M9/M10/M10A cases pass in full/focused/final suites. [Read-only asset reproduction](assets.json), [raw output](assets.log.gz):12 originals/12 transparent240x320 production PNGs unchanged and reproduced byte-for-byte. Final verify.ps1 includes typecheck/lint/domain isolation/build/production fixture exclusion,1050/69 and independent preservation, checked exit0.

## Preservation, history and publication boundary

1103 protected incoming paths unchanged; all240 human-repair01 files and101 earlier M10A evidence files retain exact incoming hashes. Domain/RNG/shoe/cards/accounting/bankroll/replay/digest/journal/strategy/controllers/pure1–7 geometry/PA1 assets/provenance/canonical17 unchanged; src/domain diff EMPTY.153 other executable hashes unchanged; deleting only the colour declaration reconstructs the incoming CSS hash. [Original10/10 blocker ledger](../human-repair01/README.md) remains immutable. M10A-T01 now11/11 OWNER-AUTHORIZED EXCEPTION (one product-colour correction); no repair12. Planning2/10 CLOSED and historical M10-T0111/11 remain separate.

[Proven runner](verification-runner.txt) and [25-path output hook](historical-output-route.txt) redirect only known historical writer destinations, preserving all assertions and canonical PA1 references. Checked child exits and collection exits are separate and PASS. Fresh generated outputs retain content hashes; [lossless log archive receipt](log-archives.json) verifies exact raw bytes. Only redundant newly owned logs are removed after verified archiving; no prior evidence deleted or reformatted. Same-session diff/evidence/privacy review precedes normal origin/main publication; fresh independent review and owner visual acceptance remain separate. No deployment or future milestone work.

## Final administrative closure

2026-10-04 12:58:17 +08:00 — [Same-session review](administrative-final.json) PASS/exit0:1103 protected paths,240 prior repair files, all154 post-unified executable hashes unchanged;274 relative references/142 plaintext records checked,0 credential-pattern findings. [Final protection proof](protected-final.json). Initial affected-document closure5 files/13 tests PASS/exit0 at12:56:10..12:56:15 in [receipt](ex11-final-documentation.json); a final precommit affected-document check follows these factual receipt updates. No source/test/config/runtime change after full verification. No genuinely fresh review or owner visual acceptance claimed.

Precommit affected-document checks5/13 PASS/exit0 at12:59:16..12:59:20 in [receipt](ex11-precommit-documentation.json). Two evidence-folder .gitattributes files disable text conversion only within these new task-owned folders: preserve exact raw evidence bytes despite the existing Windows core.autocrlf=true setting. No incoming evidence file or repository-wide setting changes. Staged raw blobs are checked against physical-file hashes before publication.

2026-10-04 13:06:12 +08:00 — Additional aggregate Git whitespace check **FAIL/exit2**,4455 findings across30 raw evidence records (4392 preserved CRLF,63 original raw whitespace). Authored product/test/current documents whitespace **PASS/exit0**. [Exact classification](precommit.json), [lossless raw check output](staged-whitespace.log.gz). Raw records remain unchanged; this additional check does not replace or weaken the required full technical gate, which remains PASS/exit0. An optional batch blob reader returned FAIL/exit1, root cause NOT ESTABLISHED; [failed driver](failed-stage-review-driver.txt) retained without correction/rerun, stderr was observed in-session and is not reconstructed. [Separate native Git index inspection](staged-raw-blobs.json) PASS/exit0:354 staged evidence blobs equal the unfiltered physical bytes. No additional product or driver repair;11/11 unchanged. Final native index/scope check precedes commit.

2026-10-04 13:08:16 +08:00 — The pre-stage administrative driver was later invoked after git add and returned FAIL/exit1 because its original scope check treats newly staged evidence as unrelated. The driver is retained unchanged and was not corrected or rerun. This is an auxiliary administrative invocation failure; required verify.ps1 and affected documentation remain PASS/exit0. Native Git staged-path/index checks independently establish the authorized scope and raw bytes before publication; no further product or tool repair is performed.
