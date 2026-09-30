# Casino Blackjack - Project State

## M8-T08 — Human Manual Feedback: Visual Polish / Game Feel

Entry baseline 2026-09-30 17:52:06 +08:00: main=HEAD=origin/main=e7f174f7c5c4d70e6023d195f2ffad51d71a7b34, ahead/behind 0/0, clean including untracked files. Owner reported acceptable functionality but a boring dashboard-like interface. Historical reviewed T08=1/10; batch1 actually advanced T08 to2/10 at5c9f071. Human-feedback repair3 corrected initial desktop/mobile positioning; repair4 corrected persistent desktop height; repair5 corrected the stronger full-Dealer mobile invariant. **T08 cumulative5/10 VERIFIED**; M8 ledger **0,2,3,2,2,1,1,5,3**. No new T10 and no historical ledger reset. Recommended GPT Sol6.1/High; actual client model/effort NOT VERIFIED/NOT VERIFIED.

Scope: CSS table/rail, centered Dealer, seven-seat horseshoe with local lower-center priority, light playing cards and original CSS back, active/result markers, larger action hierarchy, amount-selection chips, compact distinct credits, decision panels and secondary tools; controller adds only a reveal-gated Dealer status from existing domain evaluators. No domain/rules/RNG/wager/settlement/replay/audit/policy/dependency changes. Acceptance: desktop1280x900 and mobile320x720 readable without horizontal overflow; immediate authoritative actions, secret-free DOM/ARIA, preserved keyboard/44px targets, reduced-motion parity, Charlie exact wording/results and reproducible public screenshots. Steps -> targeted semantic/layout/preservation E2E -> visual inspection -> official full verify.ps1 -> exact diff/domain guard -> normal commit/push/fetch/parity/clean. Stop for authority conflict, unknown changes, unavailable required tools, domain-rule change, unsafe publication or cumulative10 repairs.

Official verify.ps1 PASS/0 inspected2026-10-01 01:11:59 +08:00: typecheck/lint/domain isolation/production build/fixture exclusion;66 Vitest files/956 tests (start01:09:41);43 Chromium/45.6s; independent M1 12/155,M2 6/78,M3 5/72,M4 7/171,M5 8/168,M6 9/181,M7 56/870 plus24 Chromium/22.0s. Exact REG-M8-001..096 mapping and current secrecy PASS, accepted test assertions unchanged. Targeted5 Vitest suites/22 tests PASS/0 at01:09:01; targeted polish/portfolio6 Chromium PASS/0 before final harness. src/domain diff EMPTY. Four public screenshots regenerated; final repeated hashes in PORTFOLIO/log. No executable changes after this full harness. Same-session task-diff review completed; genuinely independent recheck NOT RUN here. Normal UI checkpoint and separate portfolio/documentation publication follow; exact branch/commit/push receipt is recorded after the UI push, with final documentation SHA/parity in delivery/Git.

Human visual acceptance PENDING; independent recheck of the final combined HEAD PENDING. MEDIUM-04 and LOW-03 remain OPEN with repairs VERIFIED; prior five closures remain unchanged. M8 IMPLEMENTED / VERIFIED; M8 ACCEPTED = NO. Deployment NOT RUN.

UI publication receipt2026-10-01 01:18:17 +08:00: branch main, commit **8769d506a6360b8a96824f939768a39e240d8593**, subject feat: polish blackjack table game feel. Commit/push origin main/fetch origin main exited0; HEAD=origin/main,0/0. Exactly7 intentional portfolio/handoff/image changes remained for the authorized second coherent documentation checkpoint; no unknown files. Runtime/test/dependency tree unchanged after full verification. Final docs/screenshots publication follows; its own SHA and final clean parity are reported in delivery/Git to avoid self-reference.

## Current M8 review status

Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666 (3 MEDIUM / 3 LOW).
Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781.
Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781 (0 BLOCKER / 0 HIGH / 1 MEDIUM / 1 LOW).
CLOSED BY RECHECK: MEDIUM-01, MEDIUM-02, MEDIUM-03, LOW-01, LOW-02.
MEDIUM-04: OPEN — repair VERIFIED; independent recheck #2 pending.
LOW-03: OPEN — repair VERIFIED; independent recheck #2 pending.
Repair batch 2: VERIFIED; publication receipt in final delivery/Git; independent recheck #2 pending.
M8 NOT ACCEPTED. Deployment NOT RUN.

## Repair batch 2 contract and ledger

Baseline captured 2026-09-30 16:42:46 +08:00: main=HEAD=origin/main=5218bb9594580090cf39bad219a0b40f268c9781,0/0,clean including full untracked status. Existing PLAN scopes assign MEDIUM-04 to M8-T03 (replay contract; browser orchestration/mapping support the same defect) and LOW-03 to M8-T09 (current documentation/full harness/handoff). Prior T03=2/10,T09=2/10; now T03=3/10,T09=3/10 only after full VERIFIED evidence inspected2026-09-30 16:58:01 +08:00. Current M8 ledger: **0,2,3,2,2,1,1,2,3**. All M1-M7 historical ledgers remain unchanged. Recommended GPT Sol6.1/High; actual model/effort NOT VERIFIED/NOT VERIFIED.

Targeted replay/domain/controller tests PASS/0 at16:49:24:2files/28tests; typecheck and five affected suites PASS/0 at16:55:44 (start16:55:49,5files/35tests). REG-093 exact10000/oversized10001/raw wager limit, REG-094 original9992/9993-wager browser reproduction and atomic automatic finalization, REG-095 defensive replay validation, REG-096 current-document consistency. Official verify.ps1 PASS/0 inspected16:58:01:66files/956tests (start16:56:40,7.78s),38Chromium/28.2s, typecheck/lint/ES2023 domain compile/production fixture exclusion, exact96 unique owners (83Vitest/13Chromium). Mandatory preservation M1 12/155,M2 6/78,M3 5/72,M4 7/171,M5 8/168,M6 9/181,M7 56/870+24Chromium/15.8s PASS. REG-070 and accepted assertions remain unchanged. Three regenerated public screenshot hashes match PORTFOLIO. No executable changes after this harness; final affected document checks and publication receipt are in log/delivery/Git.

Scope: only bounded replay consistency and current documentation. One replay v1 maximum, rejection before gameplay/funds/RNG/audit/journal mutation, no truncation; browser reserves two entries for intent plus automatic SETTLE/VOID. Existing seeded unfinished demo at cap requires refresh; finalized sessions permit existing new-demo control. No gameplay/RNG/digest/payout/policy/dependency/UI changes. Required targeted checks -> official verify.ps1/preservation -> diff/check/full status -> verified ledgers -> normal commit/push/fetch/parity/clean -> STOP for genuinely fresh recheck #2. Stop on authority conflict, unknown overlap, unavailable tools, unsafe publication or cumulative10 repairs.

| Current finding / owner | Repair and regression evidence | Status |
| --- | --- | --- |
| MEDIUM-04 / T03 repair3 | Single MAX_REPLAY_COMMANDS=10000 in recorder/exporter/decoder; browser preflights two slots; no mutation/audit/clock/truncation on limit; validation failure hides replay while preserving source state/audit. REG-093..095 | OPEN — repair VERIFIED; independent recheck #2 pending |
| LOW-03 / T09 repair3 | LAB entry header/section34 and eight current documents record completed original review/batch1/recheck1, five closed/two open, batch2 verification and distinct acceptance/deployment. REG-096 checks current blocks and original stale-header location | OPEN — repair VERIFIED; independent recheck #2 pending |

Publication checkpoint: fix: bound M8 replay sessions and reconcile review status. Its own SHA cannot embed itself; final delivery/Git records the exact commit, normal push/fetch and main=origin/main,0/0,clean receipt. Stop after that authorized publication; only a genuinely fresh independent reviewer makes the next closure decision.

## Historical repair batch 1 delivery (superseded by current status above)

Fresh independent review of eb85032604b03031b5b934818fda773ea9aae666 found 0 BLOCKER, 0 HIGH, 3 MEDIUM and 3 LOW findings. All remain OPEN pending the independent reviewer's recheck. M8 ACCEPTED NO; deployment NOT RUN. The implementation evidence below is the historical pre-review snapshot, superseded by this repair record.

Authorized baseline 2026-09-30 14:34:10 +08:00: main=HEAD=origin/main=eb85032604b03031b5b934818fda773ea9aae666, 0/0, clean. Recommended GPT Sol 6.1/High; actual model/effort NOT VERIFIED/NOT VERIFIED. Four coherent checkpoints: T03 strict profile decoding; T04 actual action observation/cascade refund audit with T07 REG-092; T05 readable configuration/Charlie copy with T08 README/screenshots; T09 current documentation/recheck handoff. Scope is the six findings only. Required checks: affected suites, exact mappings, full verify.ps1, diff/check/status, normal commit/push/fetch/parity/clean. Stop on authority conflict, unknown overlap, unavailable checks, unsafe publication or repair cap. No gameplay/RNG/digest/policy/persistence/network/deployment changes.

Current M8 ledger: **0,2,2,2,2,1,1,2,2** (each /10). T03 repair2 published 0cff8522eed891aa0df5474760bed48f30575ec1 at14:40:18; T04 repair2/T07 repair1 published 027903a08e498c2f82bd330b7eeea7dde0677031 at15:10:00; T05/T08 repair2 published 5c9f071c576ce8c3056447f9e9c4781c5d62b987 at15:23:11 +08:00. Each normal push/fetch/main parity/0-0/clean check passed. T09 repair2 VERIFIED after the final official harness returned0, inspected2026-09-30 15:39:17 +08:00: typecheck, lint, domain isolation, production build/fixture exclusion,66 Vitest files/952 tests,1 Chromium project/38 tests, and independent M1-M7 preservation PASS. Final targeted documentation/mapping/contracts check4 files/7 tests PASS at15:37:11; no executable changes after the full harness. Final normal documentation publication and exact SHA/parity/clean are recorded in delivery/Git.

REG-M8-001..092 has92 unique owners (79 Vitest/13 Chromium); REG-036/059/087 retain and strengthen their original coverage, and092 adds cascade refunds. All three public screenshots were regenerated, visually inspected and reproduced with the PORTFOLIO hashes; Classic/Charlie bytes remain unchanged and Replay/Audit changes intentionally. M1-M7 ledgers remain unchanged. All six findings remain OPEN until the same independent reviewer rechecks; implementation verification does not close findings or mark M8 ACCEPTED.

## Historical batch1 finding evidence — OPEN at that checkpoint, superseded above

| Finding | Contract / concrete failure | Targeted repair and executable evidence | Reviewer status |
| --- | --- | --- | --- |
| MEDIUM-01 / T03 repair2 | R17 strict replay configuration: array profileId coerces to a valid key | profile.ts isProfileId rejects non-primitive strings; replay.ts returns normalized typed fields. REG-036 rejects array/object/number/null/unknown/boxed/coercible values and the recomputed-digest reviewer package before handlers; profileRandom direct guard checks | OPEN; implementation VERIFIED |
| MEDIUM-02 / T04 repair2 | R17 complete action attribution: card counts miss Stand and invent supplement HIT | advancedGame production loop observes actual policy decisions; optional/behind/session forward primitive trace to audit. REG-059 exact seed21 HIT/HIT/STAND; seed36 NO_ADD child actions exclude the supplement; terminal bust/Charlie does not invent STAND | OPEN; implementation VERIFIED |
| MEDIUM-03 / T04 repair2; T07 repair1 | R17 financial audit: MAIN zero-sentinel obscures released stake and dependent refunds | audit before/after OPEN wagers record MAIN/PAIR/THREE_CARD/BACK_CANCEL, actual owner/seat/wager/stake/return/shared command. REG-092 human1730/270 ->2000/0; exact MAIN200,PAIR20,computer MAIN200,BACK50; THREE_CARD and duplicate no-refund assertions | OPEN; implementation VERIFIED |
| LOW-01 / T05 repair2 | R17 / UX audit clarity: null-round config hides seat and says Awaiting result | DemoTools independent round/seat/hand, event-aware Human/Computer/Empty/Sitting Out, actual returns independent of outcome. REG-087 real UI asserts initial null-round occupancy, ordered actor/action/UTC/amount and visible cascade refunds | OPEN; implementation VERIFIED |
| LOW-02 / T05/T08 repair2 | R16 / UX / portfolio: misleading fifth-Hit wording | UI/README/current DESIGN and mapping/test prose say legal Hit producing exactly five total cards <=21. REG-080/portfolio assert rendered rule. All three screenshots regenerated/visually inspected; repeated hashes in PORTFOLIO | OPEN; implementation VERIFIED |
| LOW-03 / T09 repair2 | UX current truth: section36 incorrectly says M7 unaccepted and M8 unstarted | UX_UI/STATE/PLAN/log/LAB/README/PORTFOLIO/REPLAY/handoff distinguish accepted M1-M7, fresh review findings, verified targeted repairs and pending recheck | OPEN; documentation VERIFIED |

T01/T02/T06 remain0/2/1. Final T09 verification is executed evidence, not inferred from a prior checkpoint. The final documentation commit's SHA cannot embed itself; final delivery/Git provide actual repaired HEAD, push/fetch/parity0/0/clean. No independent recheck is performed in this implementation session. After authorized publication, STOP for the same independent reviewer to recheck the final repaired HEAD with [M8_REVIEW_HANDOFF](M8_REVIEW_HANDOFF.md). M8 NOT ACCEPTED; deployment NOT RUN.

## Historical M8 implementation evidence at reviewed eb850326

The following original implementation snapshot is historical. Its pending-review statements,91 mappings,951 tests and original M8 repair counts are superseded by the current review-repair record above; original commands/failures/publications are retained rather than rewritten.

M1-M7 are HUMAN ACCEPTED. M7 was explicitly accepted by the user ("I accept M7.") at **da6f068ffd27713848ed48f023c17ed388b8b44e**. User-supplied genuinely fresh review reported no BLOCKER/HIGH/MEDIUM/LOW findings, review/harness/56 files-870 tests/24 Chromium/UX-01..14/REG-M7-001..064/E2E-01..15/preservation/documentation PASS. This implementation conversation did not perform that independent review. Acceptance was recorded with substantive M8-T01 work.

M8-T01..T08 are VERIFIED / COMMITTED / PUSHED. M8-T09 VERIFIED after the final complete harness; normal checkpoint publication follows, with exact SHA/parity/clean recorded in delivery/Git. **M8 fresh independent review NOT RUN; M8 ACCEPTED NO; deployment NOT RUN.** Stop after verified T09 publication and use [M8_REVIEW_HANDOFF](M8_REVIEW_HANDOFF.md) in a genuinely fresh session. Verification is not acceptance.

Repository: casino-blackjack; remote https://github.com/FrankieChan0312/casino-blackjack.git; authorized branch main. Entry 2026-09-30 12:30:42 +08:00: HEAD=origin/main=accepted M7, 0/0, clean. Initial sandbox ownership read failed; owner-context retry passed without changing Git config. T09 entry **2026-09-30 13:56:48 +08:00**: main, HEAD=origin/main=49025a05dcd81eabf6a94fdd5e8859b51ec178d6, 0/0, clean. Final T09 SHA cannot embed itself in its own commit; exact final SHA/push/fetch/parity/clean are recorded in delivery and independently readable from Git.

Recommended every M8 task: **GPT Sol 6.1 / High**. Actual model: **NOT VERIFIED**. Actual reasoning/effort: **NOT VERIFIED**. Historical Astra recommendations are retained in the development log/learning history; no recommendation is validation evidence.

## M8 checkpoints

Every published checkpoint below had checked commit/push/fetch exits 0, main=origin/main, ahead/behind 0/0 and clean status. Times are 2026-09-30 +08:00. Per-task full harness counts are actual executed evidence.

| Task | Scope | Commit | Repairs /10 | Vitest files/tests; Chromium | Publication |
| --- | --- | --- | --- | --- | --- |
| M8-T01 | Profiles / seeded source; M7 acceptance | 725855d36123122bda3280e4adc5c7aec9aa7940 | 0 | 57/877; 24 | 12:35:37 |
| M8-T02 | Exact Five-Card Charlie | 70e0e977e2448fd1a7a402797bcdce2a0365465e | 2 | 58/892; 24 | 12:39:56 |
| M8-T03 | Versioned real-command replay | 13068815bb88c44e6088d107c1488796fa109add | 1 | 59/910; 24 | 12:46:37 |
| M8-T04 | Public immutable audit | 1e57736780cf5146581210759a642803fcafa5dd | 1 | 60/927; 24 | 12:58:01 |
| M8-T05 | Browser variant / replay / audit | ecf9dcb961e15378145682517401002cffaaf5d7 | 1 | 61/934; 37 | 13:06:55 |
| M8-T06 | 256-seed invariants | adc289ce86a9dcc14497ec4547c01efdd01aaf8b | 1 | 62/941; 37 | 13:10:53 |
| M8-T07 | 91 exact mappings / M1-M7 preservation | c1262d469c93f06cddd272781ebcb877e9090e6e | 0 | 65/949; 37 | 13:18:29 |
| M8-T08 | Portfolio / reproducible screenshots | 49025a05dcd81eabf6a94fdd5e8859b51ec178d6 | 1 | 66/951; 38 | 13:56:36 |
| M8-T09 | Documentation / final harness / handoff | This checkpoint; final delivery/Git SHA | 1 | PASS 66/951; 38 | Final delivery |

## Historical pre-review repair ledgers and retained failures

- M8 T01-T09: **0,2,1,1,1,1,0,1,1** (each /10).
- M7: **1,0,0,1,0,0,1,2,0**.
- M6: **1,0,0,0,0,0,1,0**.
- M5: **0,0,0,0,0,1,0**.
- M4: **1,0,1,0,0,0,1**.
- M3: **0,0,0,0,0,2**.
- M2: **1,0,0,0,1,1**.
- M1: **2,1,0,0,1,0,1,0,0,1**.

T02 repair 1 corrected optional-property assertions without weakening expected no-outcome behaviour. Repair 2 records a real publication mistake: diff --check exited 2 for EOF whitespace but publication proceeded; corrected with substantive T03, without amend/history rewrite. T03 repair 1 replaced a Split fixture that actually reached Dealer Natural. T04 repair 1 used an invalid hand to exercise rejection and exact Insurance IDs. T05 repair 1 anchored only authorized historical M7 absence assertions at accepted M7. T06 repair 1 used an actual bot-reachable follower Charlie seed. T08 repair 1 removed a nonexistent Insurance Decline step from the seed-21 portfolio recipe. T09 repair 1 corrects a documentation-bookkeeping PowerShell variable delimiter error before any file write; no executable change. All hypotheses/failures/reverification remain in [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md).

T08 sandbox Chromium installation check had no response and was interrupted (exit 1); the same owner-context command passed/0. Required verification was available. No package/lock changes. A normal dev server was intentionally stopped after successful HTTP200 validation. These environmental results are retained rather than hidden.

## Implemented profiles and Charlie

`CLASSIC_6D_S17_V1_1`: Charlie OFF. `CHARLIE5_6D_S17_V1_1`: Charlie ON. The frozen narrow model contains only ID/Charlie flag; fixed rules remain fixed. Default Classic preserves accepted M1-M7 behaviour. Historical M1-M3 APIs remain Classic; M4-M6 carry the selected profile immutably across rounds.

Exactly the fifth card from a legal Hit, total <=21, fixes terminal **CHARLIE / FIVE_CARD_CHARLIE** with 1:1 profit, gross 2*actual stake. Bust precedes Charlie; fifth-card 21 is Charlie only. Three/four-card 21 stops, Dealer Natural resolves before Hit, split children settle independently and parents never settle. Split Aces/Double restrictions remain. Followers receive valid Charlie on their actual funded exposure, including split ADD/NO_ADD. Side/Insurance/Even Money tables are unchanged. Whole-round VOID overrides Charlie and refunds once.

Charlie integration: 17 tests; additional replay/audit/browser/invariant cases cover explicit results and precedence. Current Classic five-card browser cases remain executable and never show Charlie.

## Seed, replay and audit contracts

Seeded algorithm **MULBERRY32_REJECTION_V1**: uint32 0..4294967295; explicit modulo32 addition, shifts/Math.imul, rejection-sampled bounded integers, descending Fisher-Yates then cut. Known seed 1 uint32 vector: 2693262067, 11749833, 2265367787, 4213581821, 4159151403. Private mutable PRNG state stays in its closure; seed is not current state. No string hashing, Math.random fallback or cryptographic/certification claim. Normal unseeded browser randomness remains available.

Replay **replayVersion=1** contains explicit configuration (profile, seed, algorithm, starting 2000 half-credit units, HUMAN presence, developer-fault permission), contiguous ordered intents and outcomeDigest. Strict parsing rejects unsupported versions/algorithm, unknown keys/commands, malformed input and invalid handler sequences with sequence/reason. Real handlers reconstruct all supported rounds; no arbitrary state snapshot import. Maximum 10000 commands. Selected terminal public/results/funds data use canonical sorted keys and **fnv1a32-v1** over UTF-16 code units; no clocks/timestamps. Digest is non-cryptographic comparison evidence. Classic/Charlie/Split/Insurance/Bet Behind/follower/VOID/multiple-round/source-immutability/digest checks pass (18 replay tests).

Developer-only owner-checked CONTROLLER intents exercise advanced follower paths without changing bot policy. Explicit demoFaults=true permits accounted next-draw fault evidence; a real required-draw handler must fail before VOID. Neither command is a player control. Replay getState is internal/developer only.

Audit **auditVersion=1**: frozen primitive events/snapshots, contiguous authoritative sequence, injected ISO UTC clock, type/profile/round/actor/seat/hand/wager/command/stake/gross/outcome/status/reason. Runtime uses Date.toISOString; identical timestamps do not imply identical events. Rejections are observed without gameplay mutation and excluded from the successful replay journal. Human/computer/follower/system/dealer attribution, split child events, optional decisions, Charlie, settlement/VOID, archive immutability and secrecy pass (17 audit tests). Audit observes transitions; it is not an event-sourced persistence system. Schema detail: [REPLAY](REPLAY.md), [AUDIT](AUDIT.md).

## Secrecy and browser behaviour

React receives only safe snapshots/interactions/public audit. No unrevealed dealer hole identity, future shoe order, physical card IDs, original-card ownership, active seed or PRNG state. Terminal **COMMITTED/VOID** is required for full deterministic package export; active UI has no package view/copy or seed input. NEXT clears replay result/package availability. Previously exported completed evidence can reconstruct deterministic information; it is deliberately separate from public audit and not a production recovery mechanism.

Secondary Demo and audit tools permit explicit profile/optional-seed session start only fresh before betting or after finalization. Reset explicitly restores 1000 simulated credits. Charlie Win includes fifth-card 21. Replay mode preserves original results/balances. Collapsible public history shows actor/action/UTC/amount/result, without developer stack traces. Existing gameplay keyboard/focus/live status/colour-independent text and 320px layout remain; M8 adds keyboard/profile locking/mobile export/audit checks. Chromium-only, no formal accessibility certification.

## Invariants, mappings and preservation

256 fixed seeds: exactly 312 unique physical IDs, unique complete draws, cut 219..249, same seed same shoe, card conservation, sticky cut and no mid-round replacement; three-round multi-seat sessions reconcile actual 80-unit reserves, records/nonnegative balances/total funds, one-time settlement and replay equality. The fault batch has 256 attempts: already initial-terminal rounds finalize normally; playable contexts exercise actual unavailable draw, whole-round VOID/refund once and replay. Controlled Charlie/follower cases compare exact payouts. Gross output sanity checks only distinguish collapsed/identical results; no RTP/house-edge/randomness certification.

Targeted seven invariants took about 3.85 seconds; T08 full Vitest about 11.64 seconds, Chromium 30.6 seconds plus historical reruns. Runtime is approximate and environment-dependent. [REG-M8-001..091](M8_MAPPING.md): **91 unique owners =78 Vitest +13 Chromium**; AST completeness rejects duplicate/missing/skipped IDs and mismatched documentation. Portfolio tests and mapping-completeness checks are additional unnumbered evidence.

| Accepted suite | Independent preservation |
| --- | --- |
| M1 | PASS/0 12 files /155 tests |
| M2 | PASS/0 6/78 |
| M3 | PASS/0 5/72 |
| M4 | PASS/0 7/171 |
| M5 | PASS/0 8/168 |
| M6 | PASS/0 9/181 |
| M7 | PASS/0 all 56/870 and 1 Chromium project/24 tests; UX-01..14/REG-M7-001..064/E2E-01..15 |

verify-preservation.ps1 selects accepted Git inventories, compares original assertions and independently runs them. Authorized historical REG-M6-095 and M7 REG-002/003 absence anchors preserve past milestone boundaries; no current gameplay assertion is weakened. The unified harness makes preservation mandatory and tests missing-tool/failure propagation. Current full evidence through T08: **66 files/951 tests and 38 Chromium**, typecheck/lint/domain/build/fixture exclusion PASS. T09 final full harness PASS/0 inspected at 2026-09-30 14:04:58 +08:00; Vitest 66/951 (14:02:01, 11.73 seconds), Chromium 38 (31.0 seconds), independent M1-M7 and accepted M7 24 Chromium PASS. Exact evidence is in the execution log and delivery.

## Portfolio and exact dependencies

README is portfolio-first with Mermaid architecture, reproducible seed-21 recipe, honest limits and links. PORTFOLIO provides an interviewer walkthrough. Three public-only PNGs are generated by tests/browser/portfolio.spec.ts: Classic, Charlie and completed replay/audit. Fixed UTC lives only in E2E factories. Repeat generation was byte-identical; images were visually inspected. No private path/proprietary art/secrets. Production fixture exclusion remains mandatory.

Node 24.19.0/npm 11.17.0 confirmed. Production React/react-dom 19.3.0. Direct development versions: @eslint/js 10.0.1; @playwright/test 1.63.0; @types/node 24.19.0; @types/react 19.3.0; @types/react-dom 19.3.0; @vitejs/plugin-react 6.1.1; eslint 10.11.0; typescript 6.0.3; typescript-eslint 8.70.1; vite 8.3.1; vitest 5.0.2. Chromium 153.0.8010.12 revision 1243. Package/lock unchanged by M8. npm ci, Chromium install, normal dev HTTP200, build and harness commands actually ran.

## Limitations and exact next action

One local HUMAN; memory resets on refresh; no arbitrary browser replay import/save/load, server/database/auth/network multiplayer/cloud/real money/payments/deployment. Bots retain Hit<17/Stand>=17 and decline optional decisions; advanced followers use isolated domain fixtures. Seeded source and fingerprint are not cryptographic/authenticity evidence. No RTP/house-edge/certified fairness/optimal strategy claims. Accessibility and browser matrix are bounded to actual checks.

After final VERIFIED/COMMITTED/PUSHED T09: **STOP**. Start a genuinely fresh session at the final delivery SHA, read [M8_REVIEW_HANDOFF](M8_REVIEW_HANDOFF.md), independently inspect R16/R17, complete diff, tests, secrets/claims/docs and rerun full harness. Findings FIRST; reviewer makes no edits without separate authorization. M8 remains NOT ACCEPTED until explicit human acceptance. Deployment NOT RUN.
