## Current RA1 delivery

House Rules v1.2 / Re-split Aces: [contract](RA1_CONTRACT.md), [mapping](RA1_MAPPING.md), [evidence](RA1_EVIDENCE.md), [fresh-session handoff](RA1_REVIEW_HANDOFF.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1-T01..T05 IMPLEMENTED / VERIFIED. T01..T03 COMMITTED / PUSHED; T04..T05 normal final checkpoint publication pending. Official final harness PASS/0 at 2026-10-02 00:47:18 +08:00; complete Vitest/Chromium and accepted M1-M8 preservation PASS. Same-session task diff reviewed; genuinely fresh independent review remains pending. RA1 repair ledger T01..T05 `2,0,2,1,1` (each /10); historical M8 `0,2,3,2,2,1,2,6,4` and M9 `0,2,1,1,3,0,2,1,5` unchanged. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Current inventory: **73 Vitest files / 1020 tests**, **1 Chromium project / 58 tests**; **30 uniquely mapped RSA regressions** plus additional preservation/contract/UI checks. Inventory is not execution evidence; checked results are in RA1_EVIDENCE. Default normal Player Mode: CLASSIC_6D_S17_V1_2. Supported: CLASSIC_6D_S17_V1_1, CHARLIE5_6D_S17_V1_1 (RSA OFF), CLASSIC_6D_S17_V1_2, CHARLIE5_6D_S17_V1_2 (RSA ON). Replay schema/RNG/digest/audit versions unchanged.

Records below preserve their historical versions, inventories, review boundaries and failed attempts; earlier M9 fresh-review NOT RUN statements are superseded by the supplied NO FINDINGS review at the baseline. They do not describe RA1 behavior or accept M9/RA1.

<!-- END CURRENT RA1 -->

# Portfolio walkthrough

## Current M9 delivery

M1-M8 HUMAN ACCEPTED. M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`; final independent review NO FINDINGS, MEDIUM-05 CLOSED, all previous findings CLOSED. The owner's explicit acceptance was recorded with substantive T01. M8 repair ledger `0,2,3,2,2,1,2,6,4` remains unchanged.

M9-T01..T09 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Stop at the fresh-session review gate. M9 NOT ACCEPTED. Fresh-session review NOT RUN. Deployment NOT RUN. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

Current suite inventory: **68 Vitest files / 978 tests**, **1 Chromium project / 55 tests**. Execution results and failures are recorded separately in [M9 evidence](M9_EVIDENCE.md); inventory is not a PASS claim. [Fresh review pack](M9_REVIEW_HANDOFF.md). M9 cumulative repair ledger: `0,2,1,1,3,0,2,1,5`.

T09 implementation published on main at fc5cbd687a14e0e1eb1fae0ee6830e139397fe06, normal push/fetch PASS at 2026-10-01 22:35:03 +08:00, main=origin/main,0/0,clean/full untracked empty. This final documentation receipt changes no executable/test/dependency/runtime settings; its own final SHA is recorded in Git/delivery.

<!-- END CURRENT M9 -->

## Five minutes at the table

1. Run the README local setup. The default felt table has one local player at Seat 4, three computer guests and an original professional female dealer. There is no computer-count setup or computer wager task.
2. Select your own main stake and Deal. Show the large near-edge cards and clear Hit/Stand/Double/Split/Surrender controls. Dealer hole identity stays hidden. Guests and dealer progress automatically; human Insurance / Even Money choices pause play.
3. Finish the round. Show the accurate net result and separate wager details. Deal Again opens betting; Repeat Bet deals only the original main amount while balances and the shoe continue.
4. Expand Developer / demo tools deliberately. Before own funds are reserved or after settlement, choose seed 7 in Advanced demo settings and start a new Classic demo. Explain the explicit credit reset, then wager100 and Stand. Finalized Replay reconstructs the real command journal without changing table balances. Public Audit shows actor attribution and separate results.
5. For the historical Charlie walkthrough, open manual demo (resets credits), choose Five-Card Charlie Demo and seed21, start new demo, choose Human Seat1 without computers, open betting, wager100 and deal. Use the documented accepted [M8 portfolio recipe](M8_REVIEW_HANDOFF.md). Profile changes require a new session.

## What the implementation demonstrates

Historical V1.1 accepted M1-M8 gameplay remains preserved. M9 added browser-only composite intentions and automatic session preparation. RA1 now adds only version-aware Re-split Aces with a Classic V1.2 normal table, preserving V1.1 packages. Every computer wager and automatic turn still calls real handlers, audit recorder and seed journal; capacity preflight protects the entire browser intention. The independent preservation harness reruns accepted gameplay assertions and compares test source with accepted Git objects. Historical M8/M9 delivery inventory stays on its own snapshot; current RA1 documentation/inventory has separate executable checks. [RSA walkthrough and review](RA1_REVIEW_HANDOFF.md).

The interface now gives play priority through a felt table, original vector patrons, a first-person hand, human-only betting, clear actions and collapsed developer tools. [Desktop](images/m9-table-1280.png), [tablet](images/m9-table-768.png), [mobile](images/m9-table-320.png), [ready table](images/m9-ready.png), [results](images/m9-results.png), [tools](images/m9-tools.png). These are executed Playwright screenshots with public state.

## Honest boundaries

This is a local simulated-credit portfolio, with no accounts/persistence/network multiplayer, no real dealer connection, and no deployment in M9. Domain ADVANCE is atomic: computers/dealer resolve immediately between human decisions, without artificial per-card timing. Narrow mobile scrolls vertically and offers expandable guest cards. Visual enjoyment and interviewer readiness await owner judgment after a genuinely fresh independent review; automated verification alone does not answer those questions. [Human checklist](M9_VISUAL_CHECKLIST.md), [review handoff](M9_REVIEW_HANDOFF.md).
