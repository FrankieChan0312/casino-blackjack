## Current RA1 delivery

House Rules v1.2 / Re-split Aces: [contract](RA1_CONTRACT.md), [mapping](RA1_MAPPING.md), [evidence](RA1_EVIDENCE.md), [fresh-session handoff](RA1_REVIEW_HANDOFF.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1-T01..T05 IMPLEMENTED / VERIFIED. T01..T03 COMMITTED / PUSHED; T04..T05 normal final checkpoint publication pending. Official final harness PASS/0 at 2026-10-02 00:47:18 +08:00; complete Vitest/Chromium and accepted M1-M8 preservation PASS. Same-session task diff reviewed; genuinely fresh independent review remains pending. RA1 repair ledger T01..T05 `2,0,2,1,1` (each /10); historical M8 `0,2,3,2,2,1,2,6,4` and M9 `0,2,1,1,3,0,2,1,5` unchanged. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Current inventory: **73 Vitest files / 1020 tests**, **1 Chromium project / 58 tests**; **30 uniquely mapped RSA regressions** plus additional preservation/contract/UI checks. Inventory is not execution evidence; checked results are in RA1_EVIDENCE. Default normal Player Mode: CLASSIC_6D_S17_V1_2. Supported: CLASSIC_6D_S17_V1_1, CHARLIE5_6D_S17_V1_1 (RSA OFF), CLASSIC_6D_S17_V1_2, CHARLIE5_6D_S17_V1_2 (RSA ON). Replay schema/RNG/digest/audit versions unchanged.

Records below preserve their historical versions, inventories, review boundaries and failed attempts; earlier M9 fresh-review NOT RUN statements are superseded by the supplied NO FINDINGS review at the baseline. They do not describe RA1 behavior or accept M9/RA1.

<!-- END CURRENT RA1 -->

# RA1 rule / regression inventory

Thirty uniquely registered required RSA owners; additional funding/turn/profile/Charlie/journal/inventory and three Chromium checks supplement them. Source registration completeness uses TypeScript AST and compares this table. Current inventory appears in the current RA1 header; actual executed PASS/FAIL evidence is separate in RA1_EVIDENCE.

| ID | Independent case / expected fact | Executable owner | Rules |
| --- | --- | --- | --- |
| RSA-001 | Historical V1.1 A+A completes; RSA rejects | tests/ra1/domain.test.ts | R01/R10/R17 |
| RSA-002 | V1.2 original A,A Split reserves full matching stake | tests/ra1/domain.test.ts | R07/R10 |
| RSA-003 | One physical supplement per ordered child | tests/ra1/domain.test.ts | R03/R10 |
| RSA-004 | A,9 complete Soft20 | tests/ra1/domain.test.ts | R05/R10 |
| RSA-005 | A,6 complete Soft17 | tests/ra1/domain.test.ts | R05/R10 |
| RSA-006 | A,K complete ordinary21, never Natural | tests/ra1/domain.test.ts | R05/R10 |
| RSA-007 | Legal A,A exposes only Stand/Split | tests/ra1/domain.test.ts | R07/R10 |
| RSA-008 | Decline retains complete Soft12 without a card/wager | tests/ra1/domain.test.ts | R05/R10 |
| RSA-009 | RSA replaces affected leaf before waiting sibling | tests/ra1/domain.test.ts | R10 |
| RSA-010 | One retained physical card and one supplement per descendant | tests/ra1/domain.test.ts | R03/R10 |
| RSA-011 | Another Ace permits second RSA below cap | tests/ra1/domain.test.ts | R10 |
| RSA-012 | Four leaves force A,A completion; no fifth leaf | tests/ra1/domain.test.ts | R10 |
| RSA-013 | Finished leaves count; authoritative cap rejection immutable | tests/ra1/domain.test.ts | R07/R10 |
| RSA-014 | Exact matching funds accepted | tests/ra1/domain.test.ts | R07 |
| RSA-015 | One half-credit unit short atomically rejected | tests/ra1/domain.test.ts | R06/R07 |
| RSA-016 | Rejection preserves shoe/cards/funds/turn/results | tests/ra1/domain.test.ts | R07/R17 |
| RSA-017 | Direct Hit rejected on active RSA | tests/ra1/domain.test.ts | R10 |
| RSA-018 | Direct Double rejected on active RSA | tests/ra1/domain.test.ts | R10 |
| RSA-019 | Direct Surrender rejected on active RSA | tests/ra1/domain.test.ts | R10/R11 |
| RSA-020 | RSA A,K ordinary 1:1, no Natural payout | tests/ra1/domain.test.ts | R05/R10/R13 |
| RSA-021 | Charlie V1.2 forbids Split-Ace Hit/chase | tests/ra1/domain.test.ts | R10/R16 |
| RSA-022 | ADD funds equal ordered actual exposures | tests/ra1/preservation.test.ts | R07/R15 |
| RSA-023 | NO_ADD retains first child only | tests/ra1/preservation.test.ts | R15 |
| RSA-024 | Insufficient follower ADD uses NO_ADD, never blocks controller | tests/ra1/preservation.test.ts | R07/R15 |
| RSA-025 | Follow closure precedes every new child card | tests/ra1/preservation.test.ts | R08/R15 |
| RSA-026 | Tracked descendant opens fresh follow window | tests/ra1/preservation.test.ts | R10/R15 |
| RSA-027 | Both captured V1.1 packages preserve full outcome/digest | tests/ra1/preservation.test.ts | R01/R17 |
| RSA-028 | Both V1.2 profiles replay ordered RSA results under schema1 | tests/ra1/preservation.test.ts | R01/R17 |
| RSA-029 | Parent Split/ordered children/settlement attributable without secrets | tests/ra1/preservation.test.ts | R17 |
| RSA-030 | Normal Player Mode ClassicV1.2; explicit historical mode preserved | tests/ra1/browser.test.ts | R01/UX16 |

## Preservation and browser evidence

No accepted gameplay assertion is removed/skipped/weakened. check-m8-preservation compares all 66 accepted test files/5 browser specs after only explicit historical inventory-input normalization, and bounds authorized domain changes to three modules. verify-preservation reruns M1 155, M2 78, M3 72, M4 171, M5 168, M6 181; all 56 accepted M7 files/870 plus24 Chromium, and all M8 956/44. M9 runtime/browser scenarios continue against current code; only the authorized default-profile expectation and deterministic M9-016 fixture changed. RA1 inventory test mechanically normalizes and compares those exact edits and the historical document-input wrapper with the reviewed SHA.

RSA-016 is supplemented by the full-state/reference frozen rejection and controller cap/funding tests, plus recorder rejection followed by identical complete packages/results compared with a session without the attempt. This catches card/RNG/journal/outcome mutation while retaining permitted rejected-attempt audit evidence.

Three additional Chromium registrations test keyboard Tab/focus/Enter decline to Soft12; ordered RSA children with 44px buttons and no overflow at1280/768/320; funding/cap forced completion without redundant Stand. Existing M9 Repeat/Deal Again/guest progression/tools/accessibility/responsive scenarios remain. Player Mode RSA Repeat stake is also checked independently in Vitest. Advanced follower RSA uses explicitly controlled primitives, because unchanged local bots never choose Split. No network/multiple-human extension is implied.
