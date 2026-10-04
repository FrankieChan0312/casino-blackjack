# M10A — independent casino-game recomposition plan

Owner-authorized planning/design correction from main/`0c943b088740d291e9604ebe09ef4a5b3363e271`. M10-T01 remains technically IMPLEMENTED / VERIFIED / COMMITTED / PUSHED, **11/11 — OWNER-AUTHORIZED EXCEPTION**, with geometry/evidence retained; **M10-T01 Human Visual Acceptance = NOT ACCEPTED**. New M10A planning is a separate milestone, not T01 repair12. [Complete task contracts, AC mapping and verification](M10A_PLANNING.md), [SPEC](SPEC.md), [DESIGN](DESIGN.md), [UX](UX_UI.md).

| Task | Dependency / sequence | Status / repairs |
| --- | --- | --- |
| M10A-T01 — Scene frame + composition shell | Human planning ACCEPTED at6e460db; owner authorizes T01 shell repair only | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at1a04a5b;11/11 OWNER-AUTHORIZED EXCEPTION; contrast4.520553075070118>=4.5; full/final gates PASS; HUMAN VISUAL ACCEPTANCE: ACCEPTED |
| M10A-T02 — Seat-unit component | M10A-T01 HUMAN ACCEPTED; public guest bankroll excluded | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at9848e3d;8/10; full/final PASS; HUMAN VISUAL ACCEPTANCE: ACCEPTED |
| M10A-T03 — Local-player HUD | M10A-T02 HUMAN ACCEPTED | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED atd4efd69;4/10; full/final PASS; HUMAN VISUAL ACCEPTANCE: ACCEPTED |
| M10A-T04 — Dealer-zone composition | M10A-T03; reserve only, distinct from M10-T04 character integration | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at9a84110;5/10; full/final PASS; human visual acceptance PENDING |
| M10A-T05 — Felt gameplay markings | M10A-T04 | NOT STARTED;0/10 |
| M10A-T06 — Control integration | M10A-T05 | NOT STARTED;0/10 |
| M10A-T07 — Credits/accounting HUD | M10A-T06; guest balance needs separately approved safe public projection | NOT STARTED;0/10 |
| M10A-T08 — Responsive recomposition | M10A-T07; layout fixtures1–7 only, no runtime count implementation | NOT STARTED;0/10 |
| M10A-T09 — Edge-case layouts | M10A-T08 | NOT STARTED;0/10 |
| M10A-T10 — Regression + human visual gate | M10A-T09; fresh review/owner acceptance separate from PASS | NOT STARTED;0/10 |

Retain the suggested order: App/Table already separate scene/seat rendering, so frame/units/local/Dealer/markings precede controls/accounting and matrix completion. The detailed linked contracts define scope, non-goals, acceptance, step -> verification and stop conditions for each row. Recommended GPT Sol6.1/High, reconfirm availability at execution; actual runtime NOT VERIFIED. Sequential work, no delegation. Current M10A-PLAN repairs2/10 (consistency-utility input and evidence-restoration corrections); future task counters independent under normal10-cycle governance. No historical ledger reset; old M10 planning3/10 CLOSED remains separate.

M10A uses existing four-seat runtime and pure1–7 geometry. M10-T02/T03 retain real count selection/occupancy/funding/binding; M10-T04 retains avatar/formal-role integration; M10-T05–T10 retain event/deal/action/reveal/chip/replay motion. No circular dependency or silent implementation authorization: after M10A-T10 composition acceptance the owner must explicitly authorize resuming M10-T02 and subsequent existing sequence. The older row dependencies below retain their task scope with this added resumption gate. **M10-T02 NOT STARTED**; **M10-T04 REQUIREMENTS UPDATED FOR PLANNING / IMPLEMENTATION NOT STARTED**.

M10A planning HUMAN ACCEPTED; planning2/10 CLOSED. [M10A-T01 contract/evidence](M10A_T01.md); complete technical gate PASS, normal publication follows review. **M10A-T01 HUMAN VISUAL ACCEPTANCE: ACCEPTED**; M10A-T02 HUMAN VISUAL ACCEPTANCE: ACCEPTED; historical8/10 retained. M10A-T03 IMPLEMENTED / VERIFIED;4/10; full/final PASS, HUMAN VISUAL ACCEPTANCE: ACCEPTED; normal publication PASS. M10A-T04 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at9a84110;5/10; full/final PASS; human visual acceptance PENDING.

## Historical M10 — verified exceptional composition repair11

2026-10-04 00:05:07 +08:00 — Exactly one owner-authorized exceptional CSS correction resolves desktop height at896.703125<=900. Full1047 Vitest/67 Chromium and independent M1–M8/current PA1/M9/M10 preservation PASS/exit0; actual native200% zoom and three-viewport/stress/keyboard precheck PASS. Final verify.ps1 PASS/exit0 at2026-10-04 00:05:08..00:09:50 +08:00; normal publication follows final review. Repair12 NOT AUTHORIZED/NOT PERFORMED, T02..T11 NOT STARTED, planning3/10 CLOSED unchanged. [Current exceptional receipt](M10_T01.md). Earlier10/10 blocker history below is retained.

## M10 — prior composition repair10 blocked checkpoint

2026-10-03 22:39:55 +08:00 — M10-T01 composition repairs9/10 and10/10 are implemented but unverified and unpublished. Final focused Vitest5/42 PASS; focused Chromium18/20 PASS with M10-E01/M9-E01 FAIL: desktop Stand bottom908.703125 exceeds900px. Cumulative T01 **10/10**; product work stopped. Full Vitest/Chromium/M1–M8/final verify.ps1 NOT RUN after this failed gate; no commit/push. [Actual failure/evidence receipt](M10_T01.md). Further product repair requires explicit owner authorization. Human visual acceptance and fresh independent review NOT RUN. T02..T11 NOT STARTED; planning repair3/10 CLOSED unchanged.

The published geometry and planning receipts below describe the incoming main/9ca8082 baseline, not verification of this new draft. At that historical checkpoint T01 was blocked; the current task row is updated only after the exceptional success gates. All later dependencies/scopes/statuses remain unchanged.

## M10 — prior published geometry checkpoint VERIFIED

Owner-authorized repair7/10 makes historical PA1 screenshot references read-only and saves fresh captures to test-scoped outputs. Original DOM/portrait/card/responsive/keyboard assertions retained;17 canonical hashes unchanged. Full1045/66 and independent M1–M8/current PA1/M9 preservation PASS; final verify.ps1 PASS/0. Prior errno=-4094/code=UNKNOWN/syscall=open failures and diagnostics remain in [recovery evidence](M10_T01_RECOVERY.md); Windows ROOT CAUSE NOT ESTABLISHED. Publication receipts follow in STATE; T02 NOT STARTED.

Planning HUMAN ACCEPTED for `57443bbefddd47512104ba941c65e3ff1988cf02`. T01 IMPLEMENTED / VERIFIED, repairs8/10; human implementation acceptance and fresh independent review NOT RUN. T02..T11 NOT STARTED,0/10 each. [T01 contract/evidence](M10_T01.md), [SPEC AC-M10-001..012](SPEC.md), [authoritative presentation design](DESIGN.md), [historical planning evidence](M10_PLANNING.md). PA1 ACCEPTED; M9 technical preservation review PASS and owner experience acceptance outstanding. Stop after verified publication for human acceptance; do not begin T02.

For every future task: recommended GPT Sol 6.1 / High (client-supported gpt-6.1-sol/High at planning time; actual runtime model/effort NOT VERIFIED / NOT VERIFIED). Confirm availability/runtime evidence again at execution. Shared scope is presentation/browser orchestration only; non-goals and stop conditions below apply to each row. Execute sequentially; no agent delegation is authorized.

| Task / dependency | Small complete scope and acceptance | Step -> required verification | Status |
| --- | --- | --- | --- |
| M10-T01 / owner instruction accepting plan | Casino geometry foundation, pure1–7 slot coordinates, Dealer/card/centre anchors, current four-seat responsive composition and full hand footprints; AC001/012 T01 portion only, no motion/configuration | Literal coordinates/semantic and source-preservation tests -> actual1280/768/320 five-card/four-leaf/text screenshots -> full harness/diff -> commit/push -> human acceptance | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED;11/11 OWNER-AUTHORIZED EXCEPTION; human visual NOT ACCEPTED; geometry retained |
| M10-T02 / T01 technical foundation + M10A-T10 human composition gate + explicit resumption authorization | Pre-session count/Start, real seat configuration, persistent count, unique PA1 guests; default 4 and 1–7 supported; capacity preflight for 6 guests; AC002/009/010 | Literal occupancy/command-order fixtures for every count, invalid/funded/active rejection, guest funds/no refill/sit-out, repeat/reset/cap and lineup -> affected tests + full harness | NOT STARTED |
| M10-T03 / T02 | Responsive semicircular seating using actual seat identities, own-hand priority/split readability; AC001/002/009 | Count 1–7 x three viewports, single/five-card/four-leaf/text-enlargement footprints, no intersections/overflow and 44px controls -> geometry/screenshots/manual inspection + full harness | NOT STARTED |
| M10-T04 / T03 | Avatar-derived Dealer character integration: roster identity/Dealer role, separate formal-attire asset/component/provenance contract, immutable PA1 assets and default Dealer/player identity exclusion; existing T01 upper-centre anchor, six public visual states, restrained 2D motion, responsive/reduced-motion and presentation-only boundary; AC004/009 | Verify DESIGN M10.7 filename/ID/role/dimensions/alpha/aspect/source/method/hash contract and face/hair/style retention -> role-exclusion and six-state public fixtures, moving-character/formal-attire review,1280/768/320 placement/card separation, reduced-motion/text fallback and unchanged authoritative results -> component/browser tests + full harness; assignment policy future-defined, T05 event infrastructure/T06 initial deal/T08 reveal-draw/T09 settlement retain live sequencing | NOT STARTED |
| M10-T05 / T04 | Public presentation adapter/feed/queue/cursor, cancellation/skip/input gate; renew Motion decision and pin dependency if authorized; AC003/004/009/010/011 | Literal event fixtures for per-invoke/composite CLOSE/ADVANCE/SETTLE/VOID and split supplements; public-payload secrecy, StrictMode/no duplicates, cleanup, cap rejection and instant-vs-delayed equality -> affected tests/build-size/isolation + full harness | NOT STARTED |
| M10-T06 / T05 | Initial two-pass round-robin motion and dealer DEALING/waiting; AC003/004/009 | Counts 1–7/noncontiguous/funded subset/natural/Ace/terminal fixtures assert each ordered destination and hidden last slot, pre-action gating/skip/reduced equivalence -> scheduler + moving-browser capture + full harness | NOT STARTED |
| M10-T07 / T06 | Hit/Stand/Double/Split/depth-first supplements/RSA/active-hand sequencing; AC005/009/010 | No-card Stand, one-card Double, retained split cards/children, both historical profiles, re-split/follower pauses/terminal/rejections -> literal event tests/browser scenarios + full harness | NOT STARTED |
| M10-T08 / T07 | Public hole flip and ordered dealer draws; REVEALING/DRAWING; AC004/006/009 | Known secret absent before reveal, dealer natural/S17/multiple draws/all-resolved no draws/exhaustion VOID, skip/cancel -> event/secrecy/browser checks + full harness | NOT STARTED |
| M10-T09 / T08 | Chips/reserves/cancellation/committed settlement and natural/Charlie text feedback; SETTLING; AC004/007/009 | Exact independent stakes/gross/available values, win/loss/push/surrender/Insurance/side/back/Double/Split/VOID, failed funding no chips, exactly-once results -> event/UI/financial preservation + full harness | NOT STARTED |
| M10-T10 / T09 | Preserve terminal replay + isolated read-only animated playback; full reduced/skip/preferences/hidden-tab compatibility; AC008/009/010 | Frozen V1.1/V1.2 seeded packages/count configurations, full journal/outcomes/digest/live audit equality at multiple speeds and instant/skip/toggle/unmount/resize; no command from callbacks -> deterministic/browser + full harness | NOT STARTED |
| M10-T11 / T10 | Regression mapping, three-viewport/seven-count visuals, measured performance, docs/fresh review handoff; AC001..012 | Full unified verification + accepted M1–M8 preservation/current M9/RA1/PA1, exact protected-tree comparison, screenshot/trace review and owner walkthrough -> publish verified checkpoint -> genuinely fresh independent review -> explicit human acceptance | NOT STARTED |

The proposed T01..T11 order is retained: the existing controller already provides deterministic command boundaries, and the PA1 dealer/portrait components can be prepared before the event feed. T04 tests poses using fixtures; real event integration depends on T05/T06, with reveal/settlement completed in T08/T09. Reduced-motion safety is required in every motion task; T10 supplies final replay/preference coverage, not first accessibility support.

Owner-requested T04 planning amendment: Dealer supports an avatar identity and a separate formal casino-attire variant under [DESIGN M10.7](DESIGN.md). M10 planning repair3/10 CLOSED is separate from T01's8/10 and the unstarted implementation-task ledgers. Current update performs documentation/evidence work only: no artwork, selection policy/controls, role-exclusion code, Motion, geometry edit or T02/T04 implementation. T01 remains published/verified and awaits human acceptance. [Planning repair evidence](M10_PLANNING.md).

Each executable checkpoint runs `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1`, checks exit codes, reviews complete scoped diff, records cumulative repairs, and uses a normally authorized checkpoint commit/push. Additional targeted tests require independent expected cards/destinations/amounts, not the production adapter as oracle. Preserve every historical assertion and record evidence before any narrowly authorized historical inventory/source adapter change; never disable tests to accommodate M10.

Shared non-goals: no domain/rules/paytable/strategy changes, extra gameplay RNG, replay schema/digest/command semantics changes, network/persistence/real money/paid art/sound/3D/deployment. Stop affected work for authority conflict, unknown overlap, unavailable required tool, unsafe secret/financial exposure, unauthorised domain seam/publication, loss of ordered observable facts, repeated no-progress repairs or 10 failed cycles. Future implementation/publication authorization is not implied by this planning publication. Important milestone fresh-session review must actually be fresh; if unavailable record NOT RUN. Owner acceptance is separate.

## Historical pre-M10 plans

## Current PA1 independent review

PA1-T01..T07 independent review ACCEPTED for implementation `3c50ab4d0183cff13f2380bd60faa31583d3e988` under the owner's conditional delegation. [Review and acceptance evidence](PA1_INDEPENDENT_REVIEW.md). Official1031/63 and all M1-M8 preservation PASS; asset/visual12/12 PASS; domain/RNG/replay/digest/computer strategy preserved. T05 original lost failure remains ROOT CAUSE NOT ESTABLISHED;5 exact E03 and42 integration executions PASS. Historical repair counts unchanged; review documentation repairs2/10, product repairs0. M9 HUMAN ACCEPTED: NO, separate owner experience gate outstanding. M10 NOT STARTED. Deployment NOT RUN. Final documentation verification and normal review-only publication receipts are recorded in STATE/DEVELOPMENT_LOG after execution.

## Historical PA1 implementation work

Owner explicitly reports RA1 HUMAN ACCEPTED; recorded with the substantive PA1-T01 character contract/source audit. M1-M8 HUMAN ACCEPTED; M9 reviewed NO FINDINGS, HUMAN ACCEPTED: NO; PA1 HUMAN ACCEPTED: NO. Deployment NOT RUN. No M10. Historical RA1 acceptance status below is superseded; no independent RA1 review is invented.

Sequential task scopes/acceptance/verification/stop conditions: [PA1_CONTRACT](PA1_CONTRACT.md). Source dependency: [PA1_ASSET_AUDIT](PA1_ASSET_AUDIT.md). Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. Domain diff must remain EMPTY.

| Task | Current status | Repairs /10 |
| --- | --- | --- |
| PA1-T01 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 48f0a45de08d87ff4952c3d8342ed65b6bb671a2; main parity0/0/clean | 1 |
| PA1-T02 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED f757b5f125f5395527de671a0682478a46af05eb; parity0/0/clean | 1 |
| PA1-T03 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 3f3f664054a69e6bab1d87109626678ff2767899; parity0/0/clean | 2 |
| PA1-T04 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 246a5c21d8a2df2829d396bad93a18642577ee6e; parity0/0/clean | 3 |
| PA1-T05 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED bf2666e740354982e73bc0941acaf026952b69ab; parity0/0/clean; prior unexplained FAIL retained | 2 |
| PA1-T06 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 34b5dfdf6a308f7e07e2762182ac135dcb114bef; parity0/0/clean | 0 |
| PA1-T07 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 9d1fa1a333aa1f3940333dc16f82b41ff6042734; parity0/0/clean; fresh-review handoff PREPARED, review NOT RUN; STOP | 2 |

Owner staging update recorded at 2026-10-02 20:18:08 +08:00: sources will be provided in `C:\Users\user\Documents\GitHub\casino-blackjack\art\source\characters`, using each canonical ID as a `.png` filename. Preserve uncommitted T01 work; STOP and wait for the complete set, then resume the existing T01 audit including both Nobles. Do not start T02. Availability is not a repair cycle. No incomplete task is declared VERIFIED / COMMITTED / PUSHED.

Resume receipt 2026-10-02 21:33:22 +08:00 supersedes that staging wait. Twelve originals found in `PA1_character_sources` child, unchanged. Mechanical and individual visual gates PASS including transparent Noble replacements. Verify/publish T01 before T02; source availability does not reset/add repairs.

<!-- END CURRENT PA1 -->

## Historical RA1 delivery

House Rules v1.2 / Re-split Aces: [contract](RA1_CONTRACT.md), [mapping](RA1_MAPPING.md), [evidence](RA1_EVIDENCE.md), [fresh-session handoff](RA1_REVIEW_HANDOFF.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1-T01..T05 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Final code/test checkpoint `1fc211a3b92aa095bc9d37de63e2f967a0a52ad4` published on main; normal push/fetch PASS/0 at 2026-10-02 00:52:21 +08:00, main=origin/main,0/0,clean/full untracked empty. Final evidence-only receipt SHA is identified by Git/final delivery. Official final harness PASS/0 at 2026-10-02 00:47:18 +08:00; complete Vitest/Chromium and accepted M1-M8 preservation PASS. Same-session task diff reviewed; genuinely fresh independent review remains pending. RA1 repair ledger T01..T05 `2,0,2,1,1` (each /10); historical M8 `0,2,3,2,2,1,2,6,4` and M9 `0,2,1,1,3,0,2,1,5` unchanged. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Current inventory: **73 Vitest files / 1020 tests**, **1 Chromium project / 58 tests**; **30 uniquely mapped RSA regressions** plus additional preservation/contract/UI checks. Inventory is not execution evidence; checked results are in RA1_EVIDENCE. Default normal Player Mode: CLASSIC_6D_S17_V1_2. Supported: CLASSIC_6D_S17_V1_1, CHARLIE5_6D_S17_V1_1 (RSA OFF), CLASSIC_6D_S17_V1_2, CHARLIE5_6D_S17_V1_2 (RSA ON). Replay schema/RNG/digest/audit versions unchanged.

Records below preserve their historical versions, inventories, review boundaries and failed attempts; earlier M9 fresh-review NOT RUN statements are superseded by the supplied NO FINDINGS review at the baseline. They do not describe RA1 behavior or accept M9/RA1.

<!-- END CURRENT RA1 -->

## Current M9 delivery

M1-M8 HUMAN ACCEPTED. M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`; final independent review NO FINDINGS, MEDIUM-05 CLOSED, all previous findings CLOSED. The owner's explicit acceptance was recorded with substantive T01. M8 repair ledger `0,2,3,2,2,1,2,6,4` remains unchanged.

M9-T01..T09 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Stop at the fresh-session review gate. M9 NOT ACCEPTED. Fresh-session review NOT RUN. Deployment NOT RUN. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

Current suite inventory: **68 Vitest files / 978 tests**, **1 Chromium project / 55 tests**. Execution results and failures are recorded separately in [M9 evidence](M9_EVIDENCE.md); inventory is not a PASS claim. [Fresh review pack](M9_REVIEW_HANDOFF.md). M9 cumulative repair ledger: `0,2,1,1,3,0,2,1,5`.

T09 implementation published on main at fc5cbd687a14e0e1eb1fae0ee6830e139397fe06, normal push/fetch PASS at 2026-10-01 22:35:03 +08:00, main=origin/main,0/0,clean/full untracked empty. This final documentation receipt changes no executable/test/dependency/runtime settings; its own final SHA is recorded in Git/delivery.

<!-- END CURRENT M9 -->

> The material below retains earlier milestone requirements and timestamped history. Earlier delivery/review statements are historical and superseded by the current delivery block above; manual UX remains supported in deliberate demo mode.

# Casino Blackjack - Engineering Plan

## MEDIUM-05 / M8-T07 Review Repair #2 (current)

Baseline 2026-10-01 12:48:07 +08:00: main=HEAD=origin/main=1c639cb6ab35fa7bad80a6db174cda115666279f,0/0,clean/full untracked empty. Supplied fresh review:0 BLOCKER/0 HIGH/1 MEDIUM/0 LOW; earlier findings including LOW-04/05 CLOSED; MEDIUM-05 OPEN. Initial sandbox Git ownership block resolved by owner-context read-only commands, no Git config changes. Recommended GPT Sol6.1/High; actual model/effort NOT VERIFIED/NOT VERIFIED.

Scope: test invariant/matcher/replay overhead, local bounded replay budgets, mandatory Windows fixture cleanup and truthful review records. Non-goals: product/domain/browser behaviour, rules, RNG, replay/digest/accounting, dependencies, global timeout/workers, coverage reduction, independent review, acceptance or deployment. Steps -> read-only diagnosis -> smallest test-only change -> six targeted tests x3 consecutive PASS -> four affected suites x3 consecutive PASS -> npm.cmd test x2 consecutive PASS -> official verify.ps1 x2 consecutive PASS including all required checks/preservation -> complete diff/normal commit/push/fetch/main parity0/0/clean -> STOP. Stop on production regression (E), authority conflict, unknown overlapping changes, unavailable required validation, unsafe publication or cumulative10 repairs.

Diagnosis adds no repairs. 067/069/070 classify B+C;093/094 B (local isolation below5s; A not established);077 D mechanism reproduced with real transient Windows handles, original reviewer handle owner unknown, natural EPERM not reproduced. First implementation/validation retained: rmSync retry options still failed the300ms handle probe on Node24.19.0. One corrective cycle uses awaited fs/promises.rm maxRetries3/retryDelay100 after completed spawnSync. Transient locks recover; a10s sustained lock fails EBUSY after3137ms; no error is swallowed. This substantive repair is M8-T07 Review Repair #2; T07=2/10. Prior ledger **0,2,3,2,2,1,1,6,4**; actual ledger **0,2,3,2,2,1,2,6,4**, all M1-M7 ledgers unchanged. Required final stability verification PASS; receipts below. Measurements, failures and coverage rationale: [M8_HARNESS_STABILITY](M8_HARNESS_STABILITY.md).

Required final stability PASS: six targeted tests x3 (12:59:25-12:59:53), grouped four suites x3/37tests (13:08:40-13:08:54; Vitest2.92/2.56/2.46s; wall7.198/3.223/3.124s), full npm.cmd test x2/66files/956tests (13:10:09-13:10:16,6.71s/wall7.457s;13:10:16-13:10:24,7.36s/wall8.212s).

Official harness#1 PASS/0 at13:11:00-13:12:54,wall113.177s, Vitest66/956/7.65s, Chromium44/41.0s. Official harness#2 PASS/0 at13:12:54-13:14:33,wall99.393s, Vitest66/956/7.70s, Chromium44/41.1s. Both include typecheck/lint/domain isolation/build/fixture exclusion/secrecy/96 exact REG-M8 owners and mandatory preservation M1 12/155,M2 6/78,M3 5/72,M4 7/171,M5 8/168,M6 9/181,M7 56/870 plus24Chromium (19.8s/19.9s), all PASS.

No executable/test/dependency/runtime changes after the successful final harness. Domain diff EMPTY; only factual evidence/status updates follow. Actual ledger0,2,3,2,2,1,2,6,4; independent recheck NOT RUN, M8 ACCEPTED NO, deployment NOT RUN. Normal authorized coherent commit/push/fetch follows; actual commit/parity receipt recorded after publication.

MEDIUM-05 OPEN - repair VERIFIED; independent recheck pending. M8 ACCEPTED = NO. Independent recheck NOT RUN here. Deployment NOT RUN.

## Historical two-finding repair contract (superseded by MEDIUM-05)

Authorized baseline07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54,main/origin parity0/0,clean at2026-10-01 11:26:27 +08:00. Earlier seven M8 findings CLOSED by reconstructed review; only LOW-04/05 OPEN. A BLOCKED unchanged-HEAD recheck is not a new finding or repair cycle.

M8-T08 repair6: structural wrapping hand-header, geometric no-intersection regression at768x1024 plus1280x900/320x720 and Split; keyboard/focus/44px/card labels/secrecy/reduced motion preserved; domain diff EMPTY. IMPLEMENTED / VERIFIED and published38a1d0e7acbf9af27c42f741ef3b62b844b40aa7, normal push/fetch/parity0/0/clean inspected11:47:59. M8-T09 repair4: actual current inventory in README/handoff/LAB, eight current-status documents and M8_MAPPING; mechanical REG-096 source/inventory consistency without REG-097, historical38/43 counts retained. IMPLEMENTED / VERIFIED after official verify.ps1 PASS/0 inspected2026-10-01 12:19:49 +08:00:66/956 Vitest,44 Chromium,96 exact unique contiguous REG owners and all mandatory M1-M7 preservation (155/78/72/171/168/181; M7 870+24 Chromium). T08=6/10,T09=4/10; final M8 ledger **0,2,3,2,2,1,1,6,4**. Prior M1-M7 ledgers unchanged. Both LOW-04/05 OPEN - repair VERIFIED; independent recheck pending. Scope/verification/stop conditions and evidence: STATE/current log. Recommended GPT Sol6.1/High; actual NOT VERIFIED/NOT VERIFIED. Second authorized normal verified commit/push/fetch/parity/clean follows; final SHA/receipt in delivery/Git. STOP without independent closure, human acceptance or deployment.

## Historical M8-T08 — Human Manual Feedback: Visual Polish / Game Feel

VERIFIED, cumulative repair5/10 (prior actual2/10; visual repairs3,4,5), under the explicit human-feedback contract. Targeted22 Vitest and6 Chromium PASS; official verify.ps1 PASS/0 inspected2026-10-01 01:11:59 +08:00,66/956 Vitest,43 Chromium, all M1-M7 preservation including24 original browser tests and96 REG-M8 owners PASS. UI/CSS and reveal-gated Dealer presentation only; domain diff empty. Separate normal UI and polished portfolio/documentation publications -> final parity/clean -> STOP for independent recheck and human visual acceptance. No M8-T10. Recommended GPT Sol6.1/High; actual NOT VERIFIED/NOT VERIFIED. Scope, acceptance and stop conditions: STATE. All other task/historical ledgers and finding statuses preserved; M8 NOT ACCEPTED, deployment NOT RUN.

## Historical M8 pre-acceptance review status

M1-M7 HUMAN ACCEPTED. M8 IMPLEMENTED / VERIFIED.
Current verification inventory: **66 Vitest files / 956 tests**, **1 Chromium project / 44 tests**.
Historical Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666 (3 MEDIUM / 3 LOW).
Historical Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781.
Historical Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781 (0 BLOCKER / 0 HIGH / 1 MEDIUM / 1 LOW).
Reconstructed independent review: COMPLETED at 07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54.
CLOSED BY INDEPENDENT REVIEW: MEDIUM-01, MEDIUM-02, MEDIUM-03, MEDIUM-04, LOW-01, LOW-02, LOW-03.
Independent complete-harness review: COMPLETED at 1c639cb6ab35fa7bad80a6db174cda115666279f (0 BLOCKER / 0 HIGH / 1 MEDIUM / 0 LOW).
LOW-04: CLOSED by independent review at 1c639cb6ab35fa7bad80a6db174cda115666279f.
LOW-05: CLOSED by independent review at 1c639cb6ab35fa7bad80a6db174cda115666279f.
All earlier M8 findings remain CLOSED. Only MEDIUM-05 (complete-harness reproducibility under full-suite load) remains OPEN.
MEDIUM-05: OPEN - repair VERIFIED; independent recheck pending.
Read-only diagnosis and stability evidence: [M8_HARNESS_STABILITY](M8_HARNESS_STABILITY.md). No independent recheck occurs in this implementation session; the next recheck requires a genuinely fresh reviewer and the repaired final SHA.
M8 NOT ACCEPTED. Deployment NOT RUN.

## Historical repair batch 2 task contract

| Existing owner | Scoped repair | Status | Repairs /10 |
| --- | --- | --- | --- |
| M8-T03 | MEDIUM-04 bounded real-command replay; browser reservation/defensive handling; REG-093..095 and completeness support | VERIFIED; publication receipt in delivery/Git; finding OPEN / recheck #2 pending | 3 |
| M8-T09 | LOW-03 current documentation truth; REG-096; final full harness/handoff | VERIFIED; publication receipt in delivery/Git; finding OPEN / recheck #2 pending | 3 |

Both owners derive from the historical task scopes below; support tests/mapping do not create/reset ledgers for the same substantive failure. Prior M8 ledger0,2,2,2,2,1,1,2,2; current0,2,3,2,2,1,1,2,3 after official verify.ps1 PASS/0 inspected2026-09-30 16:58:01 +08:00 (66/956Vitest,38Chromium,96unique REG owners and all M1-M7 preservation). Maximum10 each, historical ledgers unchanged. Baseline main=origin/main=5218bb9594580090cf39bad219a0b40f268c9781,0/0,clean at2026-09-30 16:42:46 +08:00. Recommended GPT Sol6.1/High; actual model/effort NOT VERIFIED/NOT VERIFIED.

Scope/acceptance: user MEDIUM-04 ten invariants and LOW-03 truthful current status; no unrelated gameplay/RNG/digest/payout/policy/dependency/UI changes. Steps -> targeted cap/atomicity/defensive replay and current-document regressions -> exact96 mapping -> official verify.ps1 and accepted preservation -> complete diff/check/full status -> verified evidence/ledgers -> normal commit/push/fetch to main -> parity0/0/clean -> STOP. Stop on conflict/unknown overlap/unavailable required tools/unsafe publication/cumulative10 repairs. No independent closure, M8 human acceptance or deployment.

## Historical authorized review repair batch 1 (superseded by current status above)

Fresh review at eb85032604b03031b5b934818fda773ea9aae666: 0 BLOCKER,0 HIGH,3 MEDIUM,3 LOW. All findings OPEN until the same independent reviewer rechecks. User authorized six targeted repairs, normal verification/commit/push to main and final fetch/parity/clean. No independent recheck in this implementation session, no acceptance/deployment. Recommended GPT Sol6.1/High; actual model/effort NOT VERIFIED/NOT VERIFIED.

| Originating task | Repair responsibility | Current status | Repairs /10 |
| --- | --- | --- | --- |
| M8-T03 | MEDIUM-01 strict primitive-string profile decoding; REG-036 | VERIFIED / PUSHED 0cff8522eed891aa0df5474760bed48f30575ec1 | 2 |
| M8-T04 | MEDIUM-02 actual production computer actions; MEDIUM-03 attributed cascade refunds | VERIFIED / PUSHED 027903a08e498c2f82bd330b7eeea7dde0677031 | 2 |
| M8-T05 | LOW-01 readable configuration and refund UI; LOW-02 accurate Charlie copy | VERIFIED / PUSHED 5c9f071c576ce8c3056447f9e9c4781c5d62b987 | 2 |
| M8-T07 | New REG-092; stronger REG-036/059/087; exact contiguous92 mapping | VERIFIED / PUSHED 027903a08e498c2f82bd330b7eeea7dde0677031; presentation assertions in5c9f071 | 1 |
| M8-T08 | LOW-02 README/current prose; repeated public screenshots/hashes | VERIFIED / PUSHED 5c9f071c576ce8c3056447f9e9c4781c5d62b987 | 2 |
| M8-T09 | LOW-03 current UX status; final accurate repair/recheck package | VERIFIED; final documentation publication SHA in delivery/Git | 2 |

Scope and stop conditions are the user repair contract and STATE. Each step -> affected checks -> complete verify.ps1 -> diff/check/status -> timestamped evidence -> normal commit/push/fetch -> parity0/0 and clean. T01/T02/T06 stay0/2/1; M1-M7 ledgers unchanged. T09 is2 after executed verification; final M8 ledger0,2,2,2,2,1,1,2,2. After final publication STOP pending independent reviewer recheck; all findings OPEN, M8 ACCEPTED NO, deployment NOT RUN.

## Historical M8 implementation batch at reviewed eb850326

M7 HUMAN ACCEPTED da6f068ffd27713848ed48f023c17ed388b8b44e; historical pending statements below superseded. Every M8 task recommends GPT Sol 6.1/High; actual NOT VERIFIED/NOT VERIFIED.

| Task | Scope / acceptance | Status | Repairs /10 |
| --- | --- | --- | --- |
| M8-T01 | Immutable profiles; stable uint32 RNG/vector/shuffle/cut; Classic unchanged | VERIFIED / PUSHED 725855d36123122bda3280e4adc5c7aec9aa7940 | 0 |
| M8-T02 | Exact R16 Charlie precedence, split/follower/VOID; Classic preservation | VERIFIED / PUSHED 70e0e977e2448fd1a7a402797bcdce2a0365465e | 2 |
| M8-T03 | Strict real-command seeded replay/version/digest; terminal export | VERIFIED / PUSHED 13068815bb88c44e6088d107c1488796fa109add | 1 |
| M8-T04 | Immutable attributable sequence/UTC events; public secrecy | VERIFIED / PUSHED 1e57736780cf5146581210759a642803fcafa5dd | 1 |
| M8-T05 | Accessible profile/seed/replay/audit browser tools and E2E | VERIFIED / PUSHED ecf9dcb961e15378145682517401002cffaaf5d7 | 1 |
| M8-T06 | Bounded deterministic multi-seed accounting/financial/profile invariants | VERIFIED / PUSHED adc289ce86a9dcc14497ec4547c01efdd01aaf8b | 1 |
| M8-T07 | Exact unique REG-M8 map; independent M1-M7 preservation | VERIFIED / PUSHED c1262d469c93f06cddd272781ebcb877e9090e6e | 0 |
| M8-T08 | Accurate concise portfolio README/diagram/demo | VERIFIED / PUSHED 49025a05dcd81eabf6a94fdd5e8859b51ec178d6 | 1 |
| M8-T09 | Final documentation/full harness/fresh-session handoff | VERIFIED; checkpoint publication in delivery/Git | 1 |

Each step -> targeted tests -> full verify.ps1 with checked exits -> complete diff/check/status -> timestamped evidence -> commit/push origin main -> fetch/0-0/clean -> continue. Detailed acceptance is the user's M8 batch contract and R16/R17. No speculative variants/RTP claims/persistence/auth/network/real money/paid services/deployment. Stop on authority conflict, unknown overlap, unavailable validation, unsafe secrets/replay imports, destructive history, credentials/paid work, 10 repairs or final review boundary. T09 stops VERIFIED/COMMITTED/PUSHED; fresh review NOT RUN, ACCEPTED NO.

## Accepted M7 boundary

M7 HUMAN ACCEPTED at da6f068ffd27713848ed48f023c17ed388b8b44e after the user explicitly stated "I accept M7." The supplied fresh review reported no findings and full harness/mappings/preservation/documentation PASS. Historical implementation evidence and task ledgers remain in DEVELOPMENT_LOG and Git. M8 preserves accepted assertions, with only explicitly authorized historical absence anchors. Current final review contract is M8_REVIEW_HANDOFF; M7_REVIEW_HANDOFF is historical.

## Historical M6 batch contract (superseded by accepted M6 and M7 above)

M5 is HUMAN ACCEPTED at f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d after the user's fresh recheck reported NO FINDINGS, LOW-01 CLOSED and regression sufficiency/documentation/requirements/REG-M5-001..072/M1-M4 preservation PASS. Acceptance was recorded with substantive M6-T01 work. Historical pending M5 acceptance statements below are superseded.

Execute T01 -> T02 -> T03 -> T04 -> T05 -> T06 -> T07 -> T08, then STOP for genuinely fresh-session review. Normal verified checkpoint commit/push origin main/fetch/parity/clean and continuation are pre-authorized. Every task recommends GPT-6 Astra / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

| Task | Scope and acceptance | State / commit | Repairs /10 |
| --- | --- | --- | --- |
| M6-T01 | Stable spectator/seated HUMAN, persistent funds, max one seat, independent computer owners, no duplicate funds, timing/privacy | VERIFIED / PUSHED 0c87dcd938a45c1e9fdbe9aa9f8690c51f6fd8fa | 1 |
| M6-T02 | OPEN original limits/eligibility/shared funds/deltas/cancellation/cascade/freeze; no extra cards | VERIFIED / PUSHED be07af97a47d3477af9d4640905dc02c3b70e719 | 0 |
| M6-T03 | Independent ordinary/Natural/Surrender exposure/outcomes, no follower gameplay control, pending funds | VERIFIED / PUSHED 91ba66c9034716b1b46dcdc3976e36d36be3835e | 0 |
| M6-T04 | Controller-funded Double, before-card ADD/NO_ADD, insufficient fallback, actual exposure | VERIFIED / PUSHED bfe9f0989748d16b2de4aa0669b56db80ea12b35 | 0 |
| M6-T05 | Split/Re-split before child card, ordered first-child fallback, depth-first/Aces/cap preservation | VERIFIED / PUSHED d4b455dd6547b9d16bb9b509c15b8e44a3f45433 | 0 |
| M6-T06 | Independent follower Insurance/Even Money, delayed peek, unified settlement, actual-exposure VOID | VERIFIED / PUSHED 5b7eaad88eadd7c476c1b9ac8f8f47e274b59602 | 0 |
| M6-T07 | Exact 95-ID executable map and M1-M5 preservation | VERIFIED / PUSHED 63deee6d8940c16a72bab8fab6b27bf8f7f66133 | 1 |
| M6-T08 | Accurate six-document package and fresh-review handoff, no executable change from T07 | VERIFIED; final publication SHA/parity in delivery/Git | 0 |

Each implementation step -> targeted deterministic assertions -> full verify.ps1 with exit checks -> complete diff/whitespace/status inspection -> timestamped evidence -> normal checkpoint publication. T07 additionally reruns the historical test sets independently. T08 steps: align README/DESIGN/PLAN/STATE/DEVELOPMENT_LOG/LAB -> inspect links/status/mapping/inventory and exact documentation-only diff -> final full harness -> diff/check/status -> commit/push/fetch/parity/clean -> STOP. Tests alone do not constitute independent review or acceptance.

Non-goals: UI/React/browser E2E/network/authentication/accounts/database/deposits/withdrawals/transfers/redemption/payments/Charlie/M7/M8/deployment. Stop for authority conflicts, unresolved ownership, unknown overlapping edits, unavailable validation, broad incompatible rewrite, destructive Git/history operations, credentials/paid resources/real money, repair cap 10 or stalled repairs, and final fresh-review boundary. Do not mark M6 ACCEPTED or start M7. Advanced-follow domain fixture reachability is explicit in DESIGN/STATE; no local computer policy change or second HUMAN is inferred.

## Historical M5 batch contract (superseded by M6 above)

The user HUMAN ACCEPTED M4 at a5c6a22dd833867a6a1eff357a7462bd06fe4e0b after fresh review NO FINDINGS, requirements PASS, REG-M4-001..060 PASS, M1-M3 preservation PASS and documentation PASS. This supersedes historical M4 gate/acceptance statements below.

M5 tasks run sequentially: T01 side wagering/reservation; T02 pure initial-card evaluation; T03 deferred Ace peek/Insurance; T04 Even Money; T05 unified settlement/VOID; T06 72-case executable regression and M1-M4 preservation; T07 documentation-only fresh-review package. Recommended model/effort for every task: GPT-6 Astra / High. Actual model/effort: NOT VERIFIED / NOT VERIFIED.

Each task uses its user-supplied acceptance cases: smallest additive implementation -> deterministic independent assertions -> full verify.ps1 with checked exit -> complete task diff/whitespace review -> checkpoint. The subsequent user publication authorization explicitly permits normal T01-T07 commits and push/fetch origin main with final parity/clean checks. Exact saved checkpoint boundaries must be preserved; no completed task is rerun merely because publication was deferred. No destructive Git, deployment, M6, Bet Behind, Charlie, UI, network, credentials, paid resources or real money. Stop on conflicts, unknown overlapping edits, unavailable validation, broad incompatible rewrite, ambiguous ownership, repair cap (10), or fresh-session gate. Do not independently review M5 here or mark it ACCEPTED.

| Task | Status | Repairs |
| --- | --- | --- |
| M5-T01 | VERIFIED / PUSHED 343140e5bf28ed18fee1cc5c42b4420e1a4b8101 | 0/10 |
| M5-T02 | VERIFIED / PUSHED 2e5b152f9a83165ef5257392bd3d707542ec5df1 | 0/10 |
| M5-T03 | VERIFIED / PUSHED cadb21659584213e927e31e80d2440399b55799e | 0/10 |
| M5-T04 | VERIFIED / PUSHED 751ba5cd7279f3aba65bad95418fccf099499eb4 | 0/10 |
| M5-T05 | VERIFIED / PUSHED 5cc4a1f032528920455c9a426fe3407322b51e23 | 0/10 |
| M5-T06 | VERIFIED / PUSHED fe078fd50ba7b75d5288d807e85519729890bdc2 | 0/10 |
| M5-T07 | VERIFIED; final publication SHA/parity recorded in delivery and Git | 0/10 |

## Historical M4 batch (superseded by the current M5 contract above)

M3 is HUMAN ACCEPTED by the explicit M4 contract at cca40d2bed3b3964a9bfb47329d49bb553fe610e after M3-T06 repair 2. No post-repair independent-review result is claimed. M4 tasks are not automatically ACCEPTED. Every task recommends GPT-6 Astra / High; actual runtime NOT VERIFIED / NOT VERIFIED.

| Task | Scope / acceptance | State | Repairs |
| --- | --- | --- | --- |
| M4-T01 | Stable hand/lineage/stake model, ordered seat-local hands, routing, natural context, public secrecy, one-hand compatibility | VERIFIED / PUSHED cd2d8cc | 1/10 |
| M4-T02 | Available-only matching Double, forced one card, terminal decisions, eligible DAS, atomic rejection and doubled payout | VERIFIED / PUSHED fbae61c | 0/10 |
| M4-T03 | Equal-value funded Split, ordered ownership, depth-first play, no parent settlement or split Natural | VERIFIED / PUSHED 5b4df25 | 1/10 |
| M4-T04 | Re-split, four-leaf cap including ended leaves, once-only Split Aces and one card each | VERIFIED / PUSHED b119448 | 0/10 |
| M4-T05 | Original first-decision Late Surrender after natural exclusion, exact half return, mixed leaf settlement | VERIFIED / PUSHED dcf3076 | 0/10 |
| M4-T06 | Advanced draw faults/VOID, actual refunds once, 60-case map, independent M1/M2/M3 preservation | VERIFIED / PUSHED 6c20d69 | 0/10 |
| M4-T07 | Accurate docs and findings-first genuinely new-session handoff; no new features | IMPLEMENTED / VERIFIED; publication pending (final delivery records actual SHA/parity) | 1/10 |

Each task: scope -> independent deterministic assertions -> full scripts/verify.ps1 with exit checks -> complete diff/whitespace/status review -> normal commit/push origin/main -> fetch/parity/clean -> next task. Exclude M5+, Insurance/Even Money/side bets/Bet Behind/Charlie, UI/network/authentication, real money and deployment. Computer remains <17 HIT / >=17 STAND. Stop on authority conflict, important ambiguity, broad incompatible redesign, unknown overlap, unavailable validation, destructive history, credentials/paid resources, 10 repairs or no repair progress. STOP after T07: independent review NOT RUN, M4 NOT ACCEPTED, M5 NOT STARTED.

Document date: 2026-09-28  
Document task: PLAN-1.0  
Intended repository location: `docs/PLAN.md`  
Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Rules baseline: `docs/RULES.md` — Blackjack House Rules v1.1  
Specification baseline: `docs/SPEC.md` — SPEC-1.0  
Design baseline: `docs/DESIGN.md` — DESIGN-1.0  
Status: task plan with checkpoint statuses; execution evidence is in STATE.md, DEVELOPMENT_LOG.md and Git. M1 is ACCEPTED by the explicit M2 contract. M2 is ACCEPTED at c9f7f35bf874a0e7673505cbbea745ce035ac695 by the explicit M3 contract. M3 checkpoints and the mandatory fresh-review gate are in section 10.

## 1. Purpose

This plan converts the approved rules, specification, and M1 design into small, verifiable engineering tasks.

The plan follows these constraints:

- implement only the current task;
- keep M1 headless and no-wager;
- do not pre-build later milestones;
- define verification before implementation;
- preserve timestamped execution evidence;
- use at most 10 repair cycles per task;
- verify before claiming `VERIFIED`;
- keep commit, push, review, acceptance, and deployment as separate events.

If `RULES.md`, `SPEC.md`, `DESIGN.md`, or this plan conflict, stop the affected task and report the conflict.

## 2. Model and execution preference

For Codex implementation tasks:

- Recommended model: `GPT-6 Astra`
- Recommended reasoning/effort: `High`
- Actual model/effort: must be confirmed from the client/runtime when the task starts; do not infer or fabricate it.

Model choice is not validation evidence.

## 3. Delivery states

Use these task states:

- `NOT STARTED`
- `IN PROGRESS`
- `IMPLEMENTED`
- `VERIFIED`
- `BLOCKED`
- `ACCEPTED`

`DEPLOYED` is not applicable to M1 because M1 is a headless local engine milestone.

A task becomes `VERIFIED` only when all required checks for the exact deliverable version pass.

A milestone becomes `ACCEPTED` only after explicit user acceptance.

## 4. Evidence and Git workflow

Every implementation task follows this sequence:

```text
capture timestamp + baseline
        ↓
confirm task contract
        ↓
implement smallest complete change
        ↓
run required verification
        ↓
repair from evidence if required
        ↓
update STATE / DEVELOPMENT_LOG / PLAN
        ↓
review task diff
        ↓
commit verified checkpoint
        ↓
push when the configured GitHub remote/branch is authorized
```

`docs/DEVELOPMENT_LOG.md` records real timestamps from:

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
```

Each verified task should normally produce one coherent English commit.

A task must not be marked pushed until Git confirms the target branch/commit exists on the configured remote.

## 5. M1 — Headless Blackjack Core

### M1 objective

Deliver a deterministic, mechanically verified, one-seat, no-wager Blackjack engine satisfying the M1 requirements and acceptance criteria in `docs/SPEC.md`.

### M1 milestone non-goals

M1 does not implement:

- simulated balances or wagers;
- multiple seats or bots;
- Double, Split, Re-split, or Surrender;
- Insurance purchase or Even Money election;
- side bets;
- Bet Behind;
- Five-Card Charlie;
- browser UI;
- database, API, WebSocket, authentication, or network multiplayer;
- cloud deployment;
- speculative generic casino/rule-engine architecture.

---

## M1-T01 — Repository Bootstrap and Engineering Harness

**Status:** `VERIFIED` / `ACCEPTED` — prerequisite committed and published; repair cycles 2/10. See the M1-T02 baseline in DEVELOPMENT_LOG.md.

### Scope

Create the repository baseline and only the engineering infrastructure required to begin M1 safely.

Expected repository content after this task:

```text
AGENTS.md
README.md
SKILL.md
docs/
  RULES.md
  SPEC.md
  DESIGN.md
  PLAN.md
  STATE.md
  DEVELOPMENT_LOG.md
  LAB_MANUAL.md
  UX_UI.md
scripts/
  verify.ps1
package.json
tsconfig.json
```

Only add source/test folders if required by the selected minimal TypeScript test/tooling setup.

### Required actions

1. Confirm/create the repository directory:
   `C:\Users\user\Documents\GitHub\casino-blackjack`
2. Capture the actual timestamp and Git baseline.
3. Initialize Git only if it is not already a Git repository.
4. Copy the approved project documents into their intended locations.
5. Preserve `SKILL.md` as the approved Karpathy guidelines source.
6. Add the minimum TypeScript/testing/linting setup required for M1.
7. Create `scripts/verify.ps1`.
8. Create initial `STATE.md`, `DEVELOPMENT_LOG.md`, `LAB_MANUAL.md`, `UX_UI.md`, and minimal truthful `README.md`.
9. Do not implement Blackjack game logic.

### Acceptance criteria

- Repository path is correct and isolated from other repositories.
- Approved planning documents exist at their intended paths.
- `SKILL.md` is present and referenced by `AGENTS.md`.
- TypeScript project configuration can execute its baseline checks.
- `scripts/verify.ps1` checks each required command's exit code.
- The harness does not report PASS when a required command fails.
- No Blackjack gameplay implementation exists yet.
- Timestamped bootstrap evidence is recorded.
- Git status/diff contains only this repository's intended bootstrap changes.

### Required verification

At minimum, run:

```powershell
.\scripts\verify.ps1
git status --short
git diff --check
```

The internal commands used by `verify.ps1` must match the installed package scripts and may initially include typecheck, lint, and tests even if the test suite contains only harness-level checks.

### Stop conditions

Stop if:

- the target folder contains unknown overlapping files;
- it points to another repository;
- source planning documents conflict;
- required tooling cannot be installed/used safely;
- a dependency operation would unexpectedly require paid resources or credentials;
- GitHub remote creation/visibility requires a decision not yet authorized.

### Completion evidence

- baseline timestamp;
- branch and commit state;
- verification output;
- repair-cycle count;
- final diff;
- commit hash if committed;
- remote/branch confirmation if pushed.

---

## M1-T02 — Physical Card Model and Six-Deck Inventory

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 1/10. See the M1-T03 baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T01 VERIFIED`

### Scope

Implement only the physical card model and deterministic construction of an unshuffled six-deck inventory.

Primary acceptance criteria:

- `AC-M1-001`
- inventory portions of `AC-M1-002`

### Required behaviour

- exactly 312 physical cards;
- 4 suits × 13 ranks × 6 copies;
- every physical card has a stable unique identity;
- no Joker;
- deterministic unshuffled construction;
- no shuffle, cut policy, hand scoring, or game state yet.

### Verification

Unit tests must independently count:

- total physical identities;
- uniqueness of physical IDs;
- six copies for each rank/suit combination;
- absence of extra ranks/suits/Jokers.

### Stop conditions

Stop on any disagreement between card identity design and `DESIGN.md`.

---

## M1-T03 — Randomness Boundary, Shuffle, and Cut Position

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 0/10. See the M1-T04 baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T02 VERIFIED`

### Scope

Implement the minimum `RandomSource`, production adapter, deterministic test source, Fisher–Yates shuffle, and cut-position selection.

Primary acceptance criteria:

- `AC-M1-003`
- `AC-M1-004`

### Required behaviour

- no domain module except the production randomness adapter directly uses uncontrolled randomness;
- shuffle preserves the exact 312 physical-card set;
- tests can reproduce exact order;
- cut position is an integer from 219 through 249 inclusive;
- one selected cut position remains fixed for a shoe.

### Verification

Include boundary and deterministic-repeat tests.

Do not add seeded replay as a product feature.

---

## M1-T04 — Shoe Accounting and Lifecycle

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 0/10. See the M1-T05 baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T03 VERIFIED`

### Scope

Implement shoe draw/accounting, available/in-play/discard separation, cut crossing, deferred reshuffle, pre-deal replacement guard, and active-round exhaustion integrity failure.

Primary acceptance criteria:

- `AC-M1-002`
- `AC-M1-005`
- `AC-M1-006`
- `AC-M1-007`

### Required behaviour

- draw without replacement;
- card accounting invariant holds;
- cut crossing sets reshuffle pending without mid-round shuffle;
- next round receives a new shoe when required;
- one-seat initial deal never begins with fewer than four cards;
- unexpected active-round exhaustion produces integrity failure rather than a fabricated result.

### Verification

Use invariant tests and controlled fault injection.

---

## M1-T05 — Hand Evaluation and Natural Blackjack

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 1/10. See the M1-T06 baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T02 VERIFIED`

### Scope

Implement pure hand evaluation and original-two-card natural-Blackjack classification.

Primary acceptance criteria:

- `AC-M1-008`
- `AC-M1-009`

### Required examples

```text
A,9       = 20
A,9,5     = 15
A,A       = 12
A,A,9     = 21
A,A,9,9   = 20
A,6       = soft 17
A,6,10    = hard 17
10,8,7    = bust
A,K       = natural Blackjack when original unsplit two-card hand
A,5,5     = ordinary 21, not natural Blackjack
```

### Verification

Expected values are explicit test facts, not calculated by reusing the production evaluator.

---

## M1-T06 — Round State, Initial Deal, Public View, and Natural Resolution

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 0/10. See the M1-T07 baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T04 VERIFIED`, `M1-T05 VERIFIED`

### Scope

Implement the one-seat M1 round state, initial-deal order, dealer hole-card secrecy, dealer peek, and initial-natural resolution.

### Required behaviour

Initial deal order:

```text
player first card
dealer upcard
player second card
dealer hole card
```

Public state must not expose hole-card identity before reveal/terminal resolution.

Dealer peek:

- Ace upcard: M1 performs peek immediately because Insurance/Even Money are outside M1.
- 10/J/Q/K upcard: peek immediately.
- 2–9: no peek required.

Resolve:

- player natural only;
- dealer natural only;
- both natural -> Push.

No Hit/Stand is allowed after an initial terminal result.

### Verification

Use deterministic ordered-shoe fixtures and public-view assertions.

---

## M1-T07 — Player Hit/Stand and Terminal Protection

**Status:** `VERIFIED` / `ACCEPTED` — committed and pushed; repair cycles 1/10. See the M1-T08 entry baseline in DEVELOPMENT_LOG.md.
**Depends on:** `M1-T06 VERIFIED`

### Scope

Implement legal one-seat player actions for M1: `Hit` and `Stand`.

### Required behaviour

- Hit is legal only during player turn;
- accepted Hit draws exactly one card;
- bust ends the player hand/round appropriately;
- ordinary 21 automatically ends player decisions;
- Stand draws no player card and begins dealer resolution;
- wrong-phase actions are rejected without gameplay-state mutation;
- terminal rounds cannot be mutated by later gameplay actions.

### Verification

Test accepted transitions, wrong-phase rejection, bust, ordinary 21, and post-terminal idempotent rejection.

---

## M1-T08 — Dealer S17 and Outcome Resolution

**Status:** `VERIFIED` / `ACCEPTED` as part of M1 — committed/pushed; repairs 0/10. See M1-T09 baseline in DEVELOPMENT_LOG.md and M2-T01 acceptance record.
**Depends on:** `M1-T07 VERIFIED`

### Scope

Implement dealer resolution under S17 and final one-seat ordinary outcomes.

### Required behaviour

Dealer policy:

```text
< 17       -> Hit
17 through 21 -> Stand
soft 17    -> Stand
> 21       -> Bust
```

Resolve:

- player win;
- dealer win;
- push;
- already resolved player natural Blackjack.

Player bust remains a loss and does not require unnecessary dealer draws.

### Verification

Include deterministic dealer sequences for:

- hard 16 -> Hit;
- soft 16 -> Hit;
- hard 17 -> Stand;
- soft 17 -> Stand;
- dealer bust;
- higher/lower/equal comparisons.

---

## M1-T09 — M1 Integration Regression and Harness Completion

**Status:** `VERIFIED` / `ACCEPTED` as part of M1 — committed/pushed; 155 tests and failure propagation PASS; repairs 0/10. See M1-T10 baseline in DEVELOPMENT_LOG.md and M2-T01 acceptance record.
**Depends on:** `M1-T08 VERIFIED`

### Scope

Complete integration/regression coverage for every M1 acceptance criterion and harden the unified verification harness.

### Required work

- map every `AC-M1-*` criterion to one or more executed tests/checks;
- include the regression cases required by `SPEC.md`;
- verify public hole-card secrecy across applicable states;
- verify no-mid-round reshuffle and next-round replacement;
- verify card accounting across complete round lifecycle;
- ensure `verify.ps1` stops/fails correctly on failed required commands;
- remove only temporary helpers made obsolete by M1 work.

### Required verification

The exact required command set for M1 must run through:

```powershell
.\scripts\verify.ps1
```

Expected categories include, where configured:

```text
typecheck
lint
unit tests
integration tests
```

No browser/E2E check is required in M1 unless the milestone scope is deliberately revised.

### Completion requirement

All applicable M1 acceptance criteria must be `PASS`.

---

## M1-T10 — M1 Documentation, Fresh Review, and Acceptance Package

**Status:** `VERIFIED` / `ACCEPTED` as part of final M1 at d1d8966fe55af1bc2b9348e305135952b7723b70. Repairs 1/10 including the review-pointer repair. Explicit acceptance is recorded with M2-T01 in DEVELOPMENT_LOG.md; this M2 implementation session did not repeat independent M1 review.
**Depends on:** `M1-T09 VERIFIED`

### Scope

Prepare M1 for review and user acceptance without adding new gameplay features.

### Required work

1. Update `README.md` with only actually implemented M1 behaviour.
2. Update `LAB_MANUAL.md` with:
   - M1 core flow;
   - card identity;
   - shoe/cut-card lifecycle;
   - deterministic randomness seam;
   - Ace evaluation;
   - hole-card redaction;
   - state transitions;
   - S17;
   - at least one concrete bug each important regression test would detect.
3. Update `STATE.md` and `DEVELOPMENT_LOG.md`.
4. Record final commit/version under review.
5. Perform a fresh-session review if genuinely available.
6. Re-run affected/final verification if review repairs change code/tests/configuration.
7. Present the acceptance package to the user.

### Fresh-review evidence

Reviewer checks:

- `RULES.md`;
- `SPEC.md`;
- `DESIGN.md`;
- final diff;
- tests;
- verification output;
- documentation accuracy.

If no genuinely fresh session is available, record review as `NOT COMPLETED`; do not simulate independence.

### Milestone completion

M1 may become:

- `VERIFIED` after all required checks pass on the final reviewed version;
- `ACCEPTED` only after the user explicitly accepts it.

M1 does not become `DEPLOYED`.

---

## 6. M1 dependency map

```text
M1-T01 Repository/Harness
   |
   +--> M1-T02 Cards/Inventory
          |
          +--> M1-T03 Randomness/Shuffle/Cut
          |      |
          |      +--> M1-T04 Shoe Lifecycle
          |
          +--> M1-T05 Hand Evaluation
                    |
M1-T04 -------------+--> M1-T06 Initial Round / Public View
                           |
                           v
                       M1-T07 Hit/Stand
                           |
                           v
                       M1-T08 Dealer/Outcome
                           |
                           v
                       M1-T09 Full Regression
                           |
                           v
                       M1-T10 Review/Acceptance
```

`M1-T04` and `M1-T05` may be independent after their prerequisites, but do not parallelize them merely for speed if doing so complicates evidence, learning, or Git history.

## 7. Later milestone roadmap

Historical M2 planning boundary: M3 followed section 10. Current M1-M3 acceptance and M4 implementation status are recorded in the opening table and STATE; M5+ remain unimplemented.

### M2 — Multi-seat Table and Computer Seats

Planned themes:

- seven seats;
- Human / Computer / Empty;
- sitting out;
- active-seat deal and action sequencing;
- deterministic computer decision policy;
- no network-human claim.

### M3 — Simulated Credits, Main Betting, and Settlement

Planned themes:

- 1,000-credit demo balances;
- reservation/available-credit model;
- main wagers;
- settlement and one-time commit;
- void refunds;
- half-credit internal representation.

### M4 — Double, Split, Re-split, and Late Surrender

Planned themes:

- Double and DAS;
- funding checks;
- Split/re-split;
- four-leaf-hand cap;
- Split Aces restrictions;
- Late Surrender;
- atomic rejection when credits are insufficient.

### M5 — Insurance, Even Money, and Side Bets

Planned themes:

- Insurance;
- Even Money;
- Pair side bet;
- three-card/21+3-style side bet;
- paytable evaluation and settlement.

### M6 — Bet Behind

Planned themes:

- follower wager ownership;
- controller/follower distinction;
- Double/Split follow decisions;
- insufficient-credit no-add behaviour;
- independent follower settlement.

### M7 — Browser UX/UI and E2E

Planned themes:

- React/browser UI only after the domain is verified;
- accessible state-aware controls;
- dealer hole-card presentation;
- table layout;
- responsive behaviour;
- Playwright E2E;
- UI must not replace domain validation.

### M8 — Variant, Replay, Audit, and Portfolio Polish

Planned themes:

- named Five-Card Charlie demo profile;
- seeded/replay capability if approved;
- audit-friendly event output;
- statistical/invariant checks where appropriate;
- final README/demo;
- final fresh-session review.

## 8. Current next task

Finish M4-T07 documentation verification/publication, then STOP at the mandatory M4 fresh-session review gate in STATE.md. M3 is explicitly HUMAN ACCEPTED at cca40d2 after review repair 2; no unrecorded reviewer recheck is claimed. No M4 task is automatically ACCEPTED. No M5, merge, release or deployment is authorized.

## 9. Historical M2 batch (accepted by M3 contract)

M1 is ACCEPTED at d1d8966fe55af1bc2b9348e305135952b7723b70 by explicit user contract. Preserve M1 repair counts in STATE and log; M1-T10 is 1/10 including its review repair. Recommended settings for every M2 task: GPT-6 Astra / High. Actual model/effort NOT VERIFIED.

| Task | Scope / acceptance | Status |
| --- | --- | --- |
| M2-T01 | Seven positions; atomic validated occupancy/sit-out; <=1 human; ascending frozen participation; between-round configuration | VERIFIED / COMMITTED / PUSHED (7824e57), 1/10 |
| M2-T02 | Shared initial deal in two ascending passes, naturals/peek per seat, public seven-seat projection and secrecy | VERIFIED / COMMITTED / PUSHED (e0f7b36), 0/10 |
| M2-T03 | Current HUMAN Hit/Stand only; skip terminal seats; advance on bust/21/stand; unchanged rejection | VERIFIED / COMMITTED / PUSHED (710b87d), 0/10 |
| M2-T04 | Deterministic computer <17 Hit / >=17 Stand; pause for human; one S17 dealer; independent outcomes/integrity | VERIFIED / COMMITTED / PUSHED (2d21402), 0/10 |
| M2-T05 | Full 24-scenario M2 regression mapping, cross-round shoe/cut/accounting and unchanged M1 regressions | VERIFIED / COMMITTED / PUSHED (c61ac01), 1/10 |
| M2-T06 | README/LAB/PLAN/STATE/log and findings-first fresh-session handoff | VERIFIED / COMMITTED / PUSHED c9f7f35; M2 ACCEPTED by M3 contract, 1/10 |

For each task: implementation -> independent explicit tests -> full scripts/verify.ps1 -> diff/status review -> checkpoint commit -> push origin/main -> fetch/0-0/clean -> next task. Commit messages follow the user contract. Stop on rules/spec/design conflict, important unresolved ambiguity, unknown overlap, unavailable required validation, 10/10 repairs, credentials/paid resources/destructive history or scope expansion. No wagering, credits, advanced actions, UI, network multiplayer or M3+. No automatic acceptance. T06 ends at the mandatory fresh-session gate; this implementation session must not perform that review.

## 10. Historical authorized M3 batch (completed; current status above)

M2 at c9f7f35bf874a0e7673505cbbea745ce035ac695 is ACCEPTED by the explicit user contract. No independent review is claimed by this implementation session. M3 tasks are not automatically accepted. Recommended settings for every task: GPT-6 Astra / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

| Task | Scope and acceptance | Status | Repairs |
| --- | --- | --- | --- |
| M3-T01 | Integer half-credit units, 2000-unit bankroll, atomic reserve/release, invalid/duplicate rejection | VERIFIED / COMMITTED / PUSHED c29ef4c | 0/10 |
| M3-T02 | OPEN betting, main wager 20..2000 even units, atomic changes/cancel, seat lock, explicit funded deal | VERIFIED / COMMITTED / PUSHED 9f2e7c6 | 0/10 |
| M3-T03 | Explicit gross/net records, exact ordinary/Natural/push/loss returns, deferred one-time table commit | VERIFIED / COMMITTED / PUSHED 3647e09 | 0/10 |
| M3-T04 | Whole-round financial VOID, actual-stake refund once, pending removal, recovery and next-round funds | VERIFIED / COMMITTED / PUSHED 5a492e8 | 0/10 |
| M3-T05 | Complete 40-case M3 mapping, full harness, independent M1/M2 preservation | VERIFIED / COMMITTED / PUSHED e1fb8f4 | 0/10 |
| M3-T06 | Accurate documentation and findings-first new-session review package; no new features | IMPLEMENTED / VERIFIED locally; final publication pending | 1/10 |

Each task: scope implementation -> explicit independent tests -> full scripts/verify.ps1 and checked exits -> diff/status review -> authorized commit/push to origin/main -> fetch, 0/0 and clean -> next task. Stop for authority conflict, ownership ambiguity, unknown overlap, unavailable required validation, 10 repairs or stalled repair, destructive Git, credentials, paid resources, prohibited future scope or external publication outside authorization. No advanced actions, side bets, Bet Behind, UI/network multiplayer, real money, merge/release/deployment or M4 work. T06 must stop before genuinely fresh-session independent review.

## M9 sequential delivery ledger

Contract: [M9_CONTRACT](M9_CONTRACT.md). Recommended GPT Sol 6.1 / High; actual NOT VERIFIED / NOT VERIFIED. Non-goals, AC owners, required checks and stop conditions apply to each task. No domain changes, M10 or deployment.

| Task | Delivery | Repairs /10 |
| --- | --- | --- |
| M9-T01 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 5998df6a74c3123266d7d4f8155c94983d5bf6db | 0 |
| M9-T02 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 54394bef8eff1e2db4c9475b1b0b3273d108986c | 2 |
| M9-T03 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED a7085f73403abcaedbb022c3a80075173ae84e8b | 1 |
| M9-T04 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 77055a247109ce8b50d5da02a5b7690c24d57c65 | 1 |
| M9-T05 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED e8f3938057bbf12879d3f3088052ee361fc38c57 | 3 |
| M9-T06 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 72f31b8b5fa06d3b7e24112c4d4fa370f67ece68 | 0 |
| M9-T07 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 508f3baae963c65ab62ffba1a9be5bf0851b2184 | 2 |
| M9-T08 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED 3bf59fd83df6988096f4dd70b08603046b4e330e | 1 |
| M9-T09 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED fc5cbd687a14e0e1eb1fae0ee6830e139397fe06; final factual receipt in Git/delivery | 5 |

## RA1 checkpoint ledger

| Task | Current checkpoint / validation | Repairs /10 |
| --- | --- | --- |
| RA1-T01 | VERIFIED / COMMITTED / PUSHED 68172e89db45fcdb61d04e977267cae22518a372; official979/55 PASS | 2 |
| RA1-T02 | VERIFIED / COMMITTED / PUSHED 178f74322d603e1a0e8debb6d1a37b4d1b437e15; official1002/55 PASS | 0 |
| RA1-T03 | VERIFIED / COMMITTED / PUSHED 9a1ce9c029377ae52a70eccab0b6b6bdf924129d and artifact77194b84eee2294897b128e19cea9aea50cade7c; official1005/58 PASS | 2 |
| RA1-T04 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at 1fc211a; 13 targeted preservation checks and complete official harness PASS | 1 |
| RA1-T05 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED at 1fc211a; full final1020/58, mapping/docs/handoff PASS | 1 |

T04/T05 share one coherent final preservation/documentation verification checkpoint after the corrected Charlie test. Their delivery/repair identities remain separate. Evidence-only publication receipts follow without source/test/runtime changes. STOP at fresh-session review gate, with clean main parity0/0. No M10 or deployment.
