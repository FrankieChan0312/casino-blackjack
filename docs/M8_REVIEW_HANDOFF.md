# M8 review repair batch 1 — independent recheck handoff

**Findings FIRST. All six findings OPEN; independent reviewer RECHECK PENDING; M8 ACCEPTED NO; deployment NOT RUN.** Fresh independent review of eb85032604b03031b5b934818fda773ea9aae666 found0BLOCKER/0HIGH/3MEDIUM/3LOW. The user authorized targeted repair batch1, normal verification/commits/pushes and documentation. This package is repair implementation evidence; it does not close findings or perform independent recheck. The same independent reviewer must recheck the repaired HEAD in a genuinely fresh conversation, with no reliance on implementation conclusions. Reviewer makes no edits, commit, push, deployment or acceptance.

## Revision and entry gate

Repository: casino-blackjack; GitHub https://github.com/FrankieChan0312/casino-blackjack; authorized branch main. Accepted M7 baseline: **da6f068ffd27713848ed48f023c17ed388b8b44e**. User explicitly stated "I accept M7." after supplied fresh review reported no findings at any severity and complete harness/mappings/preservation/documentation PASS. Acceptance was recorded with substantive M8-T01.

Reviewed M8 base/repair entry at2026-09-30 14:34:10 +08:00: main=HEAD=origin/main=eb85032604b03031b5b934818fda773ea9aae666,0/0,clean. Repairs published:0cff8522eed891aa0df5474760bed48f30575ec1 (strict profiles),027903a08e498c2f82bd330b7eeea7dde0677031 (actual actions/cascade refunds/REG-092),5c9f071c576ce8c3056447f9e9c4781c5d62b987 (UI/copy/public screenshot evidence), each normal push/fetch/parity0/0/clean. Final repair checkpoint title: **docs: prepare M8 review repair recheck**. Its SHA cannot embed itself; require the exact repaired HEAD/origin/main from final delivery and independently verify Git. Inspect eb850326..repairedHEAD for this batch and accepted M7 da6f068f..repairedHEAD for cumulative M8 scope. Historical failure/verification/publication evidence is retained in [STATE](STATE.md) and [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md).

Recommended GPT Sol 6.1 / High; implementation actual model and reasoning/effort NOT VERIFIED / NOT VERIFIED. Independently record reviewer runtime only if verifiable. Do not treat recommended settings as evidence.

Read AGENTS, SKILL, RULES (especially R16/R17), SPEC M8, DESIGN, UX_UI, PLAN, STATE, DEVELOPMENT_LOG, LAB_MANUAL, README, REPLAY, AUDIT, PORTFOLIO, M8_MAPPING, accepted M7_MAPPING and package/harness. Inspect the complete baseline-to-final source/test/doc diff. Capture real timestamp, location, branch, HEAD, origin/main, ahead/behind and full untracked status. Require final main parity/clean state; stop on mismatch or unknown overlap. Use read-only review and required verification; no edits, commit, deployment or acceptance.

## Findings-first output contract

List BLOCKER/HIGH/MEDIUM/LOW findings first, each with file/line, reproducible evidence, rule/requirement impact and why current tests miss it. Separate verified defects from questions or coverage limitations. If there are no findings, state that explicitly by severity before the requirement/harness assessment. Do not infer PASS from implementation notes or test names; rerun and inspect outcomes. Any unavailable check is BLOCKED or NOT RUN, never PASS.

## Six OPEN finding rechecks

| Finding / originating repair | Original evidence | Required independent reproduction |
| --- | --- | --- |
| MEDIUM-01 / T03 repair2 | array profileId coerced into a supported key | Reject array/object/number/boolean/null/boxed/coercible/unknown profile IDs before handlers; JSON array package with recomputed digest must fail Invalid profile. Inspect normalized configuration and direct guard; REG-036 |
| MEDIUM-02 / T04 repair2 | missing Stand after Hits; automatic Split supplement mislabelled HIT | Classic seed21 COMPUTER seat1 ranks4,5 ->5 ->4 ->18: exactly HIT,HIT,STAND. Classic seed36 Split/follower NO_ADD: supplement excluded; child1HIT/STAND,child2HIT. Automatic terminal bust/21 must not invent STAND. Trace must originate in real policy progression, not audit/card-count heuristics; REG-059 |
| MEDIUM-03 / T04 repair2,T07 repair1 | cancelled MAIN amount0; dependent SIDE/BACK refunds invisible | Human MAIN1=200,PAIR20,computer MAIN2=200,human BACK2=50; human1730available/270reserved ->2000/0. MAIN/PAIR/BACK events retain actual owner/seat/wager/cancelled stake/refund/shared command. Also inspect THREE_CARD and duplicate rejection; new independent REG-092 |
| LOW-01 / T05 repair2 | pre-round config seat absent, occupancy Awaiting result | Initial configuration UI shows seat with Human/Computer/Empty/Sitting Out without a round ID; game resultLabel still handles real wager outcomes; returns render even without outcome. REG-087 retains original order/actor/action/UTC/stake checks |
| LOW-02 / T05/T08 repair2 | fifth-Hit wording contradicts R16 five total cards | UI/README/current prose say a legal Hit produces exactly five cards <=21. Inspect rendered copy and Charlie/fifth-card21 results. Current negative assertions/historical failure quotations are not erroneous player-facing claims. Regenerated public images/hashes in PORTFOLIO; REG-080 and portfolio |
| LOW-03 / T09 repair2 | UX_UI current status wrongly presented M7 pre-review / M8 not started | Section36 now records M1-M7 HUMAN ACCEPTED, accepted M7 SHA, M8 T01-T09 exists, review findings/verified repairs, OPEN recheck, M8 ACCEPTEDNO/deployment NOTRUN. Verify STATE/PLAN/log/LAB/README/PORTFOLIO consistency |

Only the independent reviewer may close these findings. Report each recheck outcome and any new findings first; repair verification is not closure. Final expected M8 ledger0,2,2,2,2,1,1,2,2. Preserve M7 1,0,0,1,0,0,1,2,0; M6 1,0,0,0,0,0,1,0; M5 0,0,0,0,0,1,0; M4 1,0,1,0,0,0,1; M3 0,0,0,0,0,2; M2 1,0,0,0,1,1; M1 2,1,0,0,1,0,1,0,0,1.

## Required independent inspection

| # | Subject | What to establish independently |
| --- | --- | --- |
| 1 | R16 Charlie | A legal Hit produces exactly five total cards <=21 and fixes terminal CHARLIE with 1:1 profit |
| 2 | Classic preservation | Default/explicit CLASSIC_6D_S17_V1_1 has Charlie OFF and retains accepted behaviour |
| 3 | Precedence | VOID dominates; Dealer Natural precedes Hit; bust precedes Charlie; fifth-card 21 is not Natural; third/fourth21 already stops |
| 4 | Follower funding | Independent split children, no parent settlement, actual stakes, ADD/NO_ADD and follower Charlie gross 2*funded stake |
| 5 | RNG | MULBERRY32_REJECTION_V1 integer algorithm, uint32 rejection, explicit known vectors, shuffle/cut consumption and normal adapter |
| 6 | Replay format | replayVersion=1, exact schema/configuration/contiguous sequences, bounded entries, unsupported/malformed/unknown rejection |
| 7 | Authoritative replay | Commands use real handlers, no trusted state import; sequence failure attribution; Classic/Charlie/Split/Insurance/back/follower/VOID/multiple rounds |
| 8 | Replay secrecy | Full deterministic export only COMMITTED/VOID, active snapshots/DOM/ARIA omit seed/state/order/IDs, NEXT removes package/result; developer seams never wired to players |
| 9 | Audit attribution | Session/profile, seats, wagers, local/computer/follower/dealer/system, hands/children, optional decisions and results correctly attributed |
| 10 | Ordering / time | Sequence authoritative, ISO UTC injected clock, timestamps not uniqueness; attempts/rejections observed without outcome mutation |
| 11 | Public audit secrecy | Primitive frozen allowlist never carries hole cards, ranks/suits, physical IDs, future order or active seed/state; prior archives remain immutable |
| 12 | Invariants / claims | Fixed 256-seed card/fund/settlement/VOID/replay checks are bounded gross sanity, with no RTP/house-edge/certification claim |
| 13 | Browser M8 controls | Eligible explicit profile/start/reset; Charlie Win fifth-card 21; seeded equality; terminal view/copy/replay mode; original results preserved; secondary audit |
| 14 | Accessibility / responsive | Keyboard focus/live status/semantic names/text status preserved; mobile 320px no horizontal primary overflow and usable M8 controls |
| 15 | REG-M8 | Exactly92 unique literal executable owners REG-M8-001..092; AST/document completeness; preserve001..091 coverage, new cascade audit092 and strengthened036/059/087; no skipped/duplicate padding |
| 16 | Historical preservation | M1-M6 accepted incremental inventories unchanged; M7 full 56/870 and 24 Chromium; UX-01..14/REG-M7-001..064/E2E-01..15; only authorized absence anchors |
| 17 | Portfolio accuracy | README commands/recipe/versions/counts/architecture and PORTFOLIO match code; three images reproducible and public-only |
| 18 | Prohibited claims | No production casino, certified RNG/fairness, verified RTP, optimal strategy, real-money or fabricated review/acceptance claims |
| 19 | Strict non-goals | No persistence/auth/network multiplayer/payment/cloud/deployment; no extra variants or payout changes; no hidden fault replay |
| 20 | Full harness | Independently execute every required command, inspect exit propagation, build fixture exclusion, schema/mapping/privacy and preservation evidence |

## Commands and expected inventory

Use Node >=24.19.0 <25 and npm, local Chromium and Windows PowerShell. If tools/Git objects are unavailable, report the actual blocker. The normal verification entry point is:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./scripts/verify.ps1
git diff --check
git status --short --untracked-files=all
```

Expected current **66 Vitest files /952 tests**, **1 Chromium project /38 tests**, no retries. Required typecheck/lint/ES2023-only domain compile/production build/fixture exclusion PASS; M8 mapping/schema/contracts/portfolio checks execute within Vitest. Harness runs mandatory independent preservation and rejects a missing tool/nonzero child exit. Full historical inventory: M1 12/155, M2 6/78, M3 5/72, M4 7/171, M5 8/168, M6 9/181, M7 all 56/870 plus24 Chromium. Accepted Git-object inventories and original assertions must be inspected, not just totals. Fixed256-seed x3-round/replay REG-070 has a narrow15000ms budget after a measured5482ms default5000ms timeout; all seeds/rounds/assertions are retained. Inspect this test-only allowance and the retained FAIL evidence, not only the final PASS.

Historical absence anchors: REG-M6-095 at accepted M6; M7 REG-002/003 at accepted M7. Preservation normalizes only the authorized M7 anchor blocks/imports back to their original assertions and compares the remaining file byte-for-byte. Current secrecy and gameplay tests still execute. Review these exceptions carefully.

To regenerate images, run `npm.cmd run test:e2e -- tests/browser/portfolio.spec.ts`. Screenshot generation may rewrite only reproducible tracked images; inspect any actual differences and report them, do not commit/rebaseline. T08 repeat generation was byte-identical. Test factories use fixed UTC and controlled real-domain commands; normal production excludes factories. Local port 4173 must be free.

Latest repair executable harness PASS/0 inspected2026-09-30 15:19:58 +08:00: typecheck/lint/domain/build fixture exclusion,66/952Vitest (15:18:00,11.40s),38Chromium/33.2s, M1-M7 preservation and24accepted M7Chromium/18.5s. Final T09 documentation/full-harness evidence is in the current STATE/log and delivery. These are implementation results only; reviewer must rerun independently. The interrupted cleanup, timeout FAIL and corrected new-fixture assertions remain in the log. Public image SHA-256/repeat-generation evidence is in PORTFOLIO; hashes prove reproducibility only.

## Scope and known limits

Two narrow profiles only. Replay/audit version 1, uint32 seed algorithm MULBERRY32_REJECTION_V1, timestamp-free canonical UTF-16 FNV-1a digest: none is cryptographic authenticity, persistence or casino recovery. Browser replay supports its own finalized seeded session; domain parser supports explicit validated packages. Developer CONTROLLER/fault seams are isolated engineering evidence, not player controls or changed bot policy. Fault evidence requires a real subsequent required-draw failure; no valid-round arbitrary VOID.

One local HUMAN, explicit Continue table, Hit<17/Stand>=17 bots declining optional decisions, memory-only refresh reset, Chromium-only matrix and bounded accessibility tests. Exported terminal packages deliberately contain seeds and can reconstruct deterministic hidden information; do not conflate them with public-safe audit. No server/database/auth/cloud/network multiplayer/real-money/deployment. No new gameplay or reviewer fixes are authorized by this handoff.

After findings-first review, report requirement/mapping/preservation/documentation sufficiency and executed checks. **Do not mark M8 ACCEPTED.** Human acceptance is a separate explicit event. Do not deploy or edit without separate authorization.
