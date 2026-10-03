# PA1 requirement-to-evidence mapping

Current review: [PA1_INDEPENDENT_REVIEW_ACCEPTED](PA1_INDEPENDENT_REVIEW.md) for `3c50ab4d0183cff13f2380bd60faa31583d3e988`; PA1 accepted under conditional owner delegation, M9 human acceptance NO, M10 NOT STARTED, deployment NOT RUN. The implementation-state paragraph below is historical. All requirement owners and original evidence remain unchanged; independent execution evidence supplements them.

PA1 remains HUMAN ACCEPTED: NO. M9 HUMAN ACCEPTED: NO. Deployment NOT RUN. Fresh independent review NOT RUN; handoff PREPARED. T01-T07 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED; T07 checkpoint9d1fa1a333aa1f3940333dc16f82b41ff6042734,parity0/0/clean at2026-10-03 00:18:45 +08:00. Final official76/1031/63 and M1-M8 PASS; source/production receipt equality and pinned12/12 byte reproduction PASS. STOP for genuinely fresh review. [Task contracts](PA1_CONTRACT.md), [executed evidence](PA1_EVIDENCE.md), [source audit](PA1_ASSET_AUDIT.md).

| Requirement / task | Independent check / artifact |
| --- | --- |
| T01 exact12 names/PNG/decode/dimensions/ratio/RGBA/material alpha/metadata/hashes/no byte or pixel duplicates | Read-only `scripts/audit-character-sources.mjs`; PA1_SOURCE_AUDIT.json; independent native decode and individual visual receipts in PA1_ASSET_AUDIT |
| T01 Nobles are transparent Lucien/Celestine replacements, no old banner/text/scene | Individual source inspection and felt/light compositing; no old bytes were supplied for an old-hash comparison |
| T01 substantive RA1 acceptance recording | Contract/source audit commit48f0a45; source originals preserved, no metadata-only acceptance commit |
| T02 fixed transparent consistent framing and reproducible output | `scripts/build-character-assets.mjs --check`; entire source receipt and exact output bytes/tool receipt equality; public twelve PNGs, art/character-production.json, production contact sheets |
| T03 independent canonical roster/assets | PA1-C01, explicit12 literals and SHA256 production receipt equality |
| T03 unique assignment without replacement/default human excluded | PA1-C02 exact chooser bounds/results; C03 every human with six guests and first/last choices |
| T03 human collision changes only occupied guest, immutable state | PA1-C04 explicit exchange / unchanged others / immutable inputs |
| T03 invalid seam inputs fail | PA1-C05 invalid chooser/duplicate seats/out-of-range cases |
| T03 production entropy is separate | PA1-C06 crypto spy and throwing Math.random; P02 static no gameplay dependency |
| T04 unchanged gameplay orchestration | PA1-S01 strips exactly three presentation-session-marker inserts and compares full controller bytes to pre-PA1 Git |
| T04 zero gameplay RNG/controller events | PA1-S02 independent312 exact shuffle/cut bounds, all12 selections, zero emissions and identical gameplay snapshot |
| T04 explicit successful new session vs rejected/normal rounds | PA1-S03 controller marker, E01 real UI stable active/Stand/Repeat Bet/Deal Again and explicit reset |
| T04 default Roland, non-blocking choice, no duplicate, guest collision | PA1-E01 deterministic explicit table IDs, enabled Deal/Stand, identical audit/funds/cards on avatar changes |
| T04 replay gameplay semantics/digest and audit unchanged | PA1-E02 twin seeded real UI runs: complete JSON equality, original/replayed result equality, outcome-audit HTML equality; all accepted replay/digest/profile/RSA golden regressions still run |
| T05 all12 portrait/name/archetype/controller/seat/wager, dealer independent | PA1-E03 independent literal roster, decoded240x320 portrait URLs, visible exact names, distinct four IDs, unchanged card HTML, guest labels and original dealer |
| T06 responsive/keyboard/focus/44px/reduced motion/secrecy | PA1-E04 actual1280x900/768x1024/320x720 with native keyboard select, outline, target sizes, image/text/cards separation, no horizontal overflow, hidden card; accepted M9/M7 keyboard/layout/secrecy assertions remain |
| T06 image failure and enlarged text | PA1-E05 aborted PNG requests, separate readable labels/controller,200% root text, no overflow and completed Stand; coverage limits in PA1_SCREENSHOTS |
| T07 accepted assertions preserved | PA1-P01 full pre-PA1 test source equality after only documented historical adapters/two portrait-query labels; no assertion skip/deletion/timeout weakening |
| T07 domain/rules/RNG/replay/digests/computer strategy unchanged | PA1-P02 baseline domain diff EMPTY and isolated presentation source; S01 exact controller equality after marker removal; E02 full real replay equality; independent accepted M1-M8 plus current M9/RA1 harness PASS |
| T07 inspected public screenshots | PA1_SCREENSHOTS and PA1_SCREENSHOT_HASHES.json; earlier failed execution preserved in PA1_EVIDENCE and successful full raw logs |
| T07 truthful review/publication/acceptance boundaries | PLAN/STATE/DEVELOPMENT_LOG, normal commits/pushes/parity/status receipts; PA1_REVIEW_HANDOFF for a genuinely fresh session, no independent review claimed here |

Inventory:76 Vitest files/1031 tests, one Chromium project/63 tests. PA1 adds11 Vitest checks in three files and5 Chromium scenarios; all73 pre-PA1 test files and58 browser cases remain mechanically protected. Counts identify coverage; only executed exits establish PASS.
