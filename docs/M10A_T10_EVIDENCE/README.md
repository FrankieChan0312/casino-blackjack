# M10A-T10 executed evidence

Full87 files/1109 Vitest/96 Chromium; current153; documentation13; independent M1–M8 and unified harness PASS / checked exit0. Fresh consolidated session review PASS. Repairs2/10; owner T01–T09 accepted, M10A ACCEPTED / CLOSED.

- [Contract](../M10A_T10.md), [baseline](before.json), [gate](technical-gate.json), [repair ledger](repair-ledger.json)
- [New visual review / exact image hashes](review.json), [native browser zoom](visuals/zoom200.json), [actual contrast](visuals/control-contrast.json)
- [Preservation](protection.json), [executed version](executed-version.json), [PA1 assets](pa1-assets.json)
- [Full Vitest](t10-full-unit.json), [first Chromium environment failure](t10-full-browser.json), [repaired full Chromium](t10-r1-full-browser.json), [final unified command](t10-unified.json)
- [Lossless raw logs](raw-log-archives.json); .log.gz decompresses to the exact original bytes, including the first failure.

Reproduce with npm.cmd test, npm.cmd run test:e2e and powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/verify.ps1. The exact scoped capture/zoom/contrast/archive drivers are retained as driver-*.txt (zoom driver: driver-zoom.txt.gz). The runner redirects only25 known historical writer destinations with the retained preload; all assertions stay unchanged and canonical PA1 references remain read-only. Install the retained driver text into the named .git paths before rerunning the scoped collector, using a fresh phase name and the baseline manifest.

New screenshots/metadata are in visuals/; test-scoped outputs retain raw SHA-indexed bytes in generated/. No future count/artwork/motion implementation or deployment occurs under this closure.
