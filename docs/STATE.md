# Casino Blackjack — Project State

## Current truth: M5 review package

M1, M2, M3 and M4 are HUMAN ACCEPTED. Accepted SHAs: M1 d1d8966fe55af1bc2b9348e305135952b7723b70; M2 c9f7f35bf874a0e7673505cbbea745ce035ac695; M3 cca40d2bed3b3964a9bfb47329d49bb553fe610e; M4 **a5c6a22dd833867a6a1eff357a7462bd06fe4e0b**.

The user explicitly accepted M4 in the M5 batch contract after a fresh-session review reported **NO FINDINGS**, requirements PASS, REG-M4-001..060 PASS, M1-M3 preservation PASS and documentation PASS. That acceptance was recorded with substantive M5-T01 source/test evidence, not a standalone acceptance commit. Historical accuracy: M3 acceptance followed review repair 2; no unrecorded repaired-HEAD reviewer recheck is claimed. Historical logs are retained in DEVELOPMENT_LOG and Git.

M5 T01-T07 are IMPLEMENTED / VERIFIED locally. T07 is documentation-only; its full harness passed at 22:00:57 (+08:00 test start). **M5 fresh-session review: NOT RUN. M5 ACCEPTED: NOT RUN. M6: NOT STARTED. Deployment: NOT RUN.** No other agent or this implementation session performs the mandatory independent M5 review.

Publication was explicitly authorized by the user for normal T01-T07 commits, push/fetch origin main, parity and clean verification. No amend/rebase/reset/force-push/history rewrite/merge/release/deployment/M6 is authorized.

Publication entry 2026-09-29 22:07:27 +08:00: main, HEAD=origin/main=a5c6a22dd833867a6a1eff357a7462bd06fe4e0b, 0/0, exactly the known 18 M5 files and an empty index. Remote URL matched the authorized GitHub repository. Fetch confirmed unchanged remote baseline. All 18 current files and the final saved snapshot matched the previously delivered SHA-256 manifest 373836CE208BF7B6852314C2DB30A23175CA552D814E5919144B332CD5F3D1D0. All seven snapshot boundaries were available and matched their task scopes; none was guessed.

T01-T06 are now COMMITTED / PUSHED. Each staged blob exactly matched its preserved checkpoint, and every normal push/fetch returned exit 0 with HEAD=origin/main and 0/0. Later-task working files were retained during intermediate publications, so intermediate clean state is not claimed. T07 is this documentation-only checkpoint, with only factual publication finalization added to its preserved six-document scope. Its own SHA cannot be embedded in its own content; final SHA/push/fetch/parity/clean are recorded in the delivery report and Git history without a recursive metadata-only commit.

| Task | Commit | Push/fetch/parity | Published at (+08:00) |
| --- | --- | --- | --- |
| M5-T01 | 343140e5bf28ed18fee1cc5c42b4420e1a4b8101 | PASS / PASS / 0/0 | 2026-09-29 22:10:53 +08:00 |
| M5-T02 | 2e5b152f9a83165ef5257392bd3d707542ec5df1 | PASS / PASS / 0/0 | 2026-09-29 22:11:58 +08:00 |
| M5-T03 | cadb21659584213e927e31e80d2440399b55799e | PASS / PASS / 0/0 | 2026-09-29 22:13:11 +08:00 |
| M5-T04 | 751ba5cd7279f3aba65bad95418fccf099499eb4 | PASS / PASS / 0/0 | 2026-09-29 22:13:44 +08:00 |
| M5-T05 | 5cc4a1f032528920455c9a426fe3407322b51e23 | PASS / PASS / 0/0 | 2026-09-29 22:14:02 +08:00 |
| M5-T06 | fe078fd50ba7b75d5288d807e85519729890bdc2 | PASS / PASS / 0/0 | 2026-09-29 22:14:28 +08:00 |
| M5-T07 | This documentation commit; resolve final HEAD from delivery/Git | Final result recorded in delivery | After this record |

## Baseline and runtime evidence

Repository: C:\Users\user\Documents\GitHub\casino-blackjack. Intended remote: https://github.com/FrankieChan0312/casino-blackjack.git. Branch: main.

Entry 2026-09-29 21:19:38 +08:00: HEAD=origin/main=a5c6a22dd833867a6a1eff357a7462bd06fe4e0b, ahead/behind 0/0, clean. Initial sandbox Git reads were blocked by owner mismatch; authorized owner-account reads passed without safe.directory changes. No unknown user edits existed. Baseline verify.ps1 PASS/0, 30 files / 476 tests, test start 21:21:14. No fetch/publication is claimed for this batch before authorization.

Recommended model/effort: GPT-6 Astra / High. Actual model: **NOT VERIFIED**. Actual reasoning/effort: **NOT VERIFIED**. No verifiable client setting evidence is available. Model selection is not validation evidence.

## Checkpoints and repair ledgers

Every M5 checkpoint uses the user contract acceptance cases, same global non-goals/stop conditions and full verify.ps1. Publication SHAs and actual results are recorded above. Publication reused verified snapshots; no completed task or test suite was rerun merely because publication was deferred.

| Task | Scope | State | Repairs | Full harness files/tests (test start, +08:00 on 2026-09-29) |
| --- | --- | --- | --- | --- |
| M5-T01 | OPEN side wagering/reservation/cascade | VERIFIED / PUSHED | 0/10 | PASS 31/506, 21:23:32 |
| M5-T02 | Pure Pair/three-card initial evaluation | VERIFIED / PUSHED | 0/10 | PASS 33/530, 21:27:51 |
| M5-T03 | Insurance, deferred Ace peek, secrecy | VERIFIED / PUSHED | 0/10 | PASS 34/549, 21:34:16 |
| M5-T04 | Even Money, natural precedence | VERIFIED / PUSHED | 0/10 | PASS 35/557, 21:37:15 |
| M5-T05 | Unified settlement/actual-stake VOID | VERIFIED / PUSHED | 0/10 | PASS 36/569, 21:42:43 |
| M5-T06 | 72-case regression and M1-M4 preservation | VERIFIED / PUSHED | 0/10 | PASS 38/644, 21:49:11 |
| M5-T07 | Documentation and fresh-review package | VERIFIED locally | 0/10 | PASS 38/644, 22:00:57 |

M5 T01-T07 ledger: **0,0,0,0,0,0,0**. No failed implementation validation or repair cycle occurred through T07. Initial sandbox ownership restriction is environmental, not a code repair.

Preserved prior ledgers, every entry /10:

- M4 T01-T07: **1,0,1,0,0,0,1**
- M3 T01-T06: **0,0,0,0,0,2**
- M2 T01-T06: **1,0,0,0,1,1**
- M1 T01-T10: **2,1,0,0,1,0,1,0,0,1**

## Executed verification

| Check | Status | Evidence |
| --- | --- | --- |
| T06 full harness | PASS | typecheck/lint/tests, exit 0; 38 files / 644 tests |
| REG-M5-001..072 | PASS | 72 executable cases and exact unique ID completeness |
| Separate M1 suite | PASS | 12 files / 155 tests, 21:49:56, exit 0 |
| Separate M2 suite | PASS | 6 files / 78 tests, 21:50:00, exit 0 |
| Separate M3 suite | PASS | 5 files / 72 tests, 21:50:01, exit 0 |
| Separate M4 suite | PASS | 7 files / 171 tests, 21:50:02, exit 0 |
| Accepted executable preservation | PASS | git ls-tree enumerated original paths; git diff --exit-code a5c6a22 -- all original src/tests/scripts/package/config paths, exit 0 |
| T06 whitespace | PASS | git diff --check, exit 0 |
| Final T07 harness/diff/preservation | PASS | Full harness 38/644 exit 0; entire six-document diff inspected; all 12 new executable hashes equal T06 |
| M5 independent fresh-session review | NOT RUN | Requires genuinely new conversation after package publication |
| M5 human acceptance | NOT RUN | Only explicit human acceptance may change this |
| Browser/E2E | NOT APPLICABLE | No UI implemented |
| Clean-machine npm ci/cross-platform portability | NOT RUN | Existing Windows toolchain; no dependency changes |
| T01-T06 commit/push/fetch/parity | PASS | Actual SHAs/timestamps above, exit 0 and 0/0 each |
| Deployment | NOT RUN | Outside scope |

Independent suite reruns above are same-session mechanical preservation checks, not the mandatory independent milestone review. All original 30 suites / 476 tests remain unchanged. Eight new M5 suites bring the executed full suite to 38 / 644. No prior assertions, checks, dependencies or runtime settings changed.

## Implemented M5 contract

- OPEN side wagers: one PAIR and one THREE_CARD per own occupied, non-sitting-out, funded MAIN seat. 2..200 even units; same target is no-op; changes reserve/release delta only; cancellation once. Cancelling MAIN releases both dependent sides atomically. Closed original wagers freeze. No automatic computer wagers or M6 ownership.
- Initial side evaluation occurs once, using immutable original player cards plus only dealer upcard for three-card. Categories and exact gross/net remain PENDING, unaffected by subsequent hands/results. Distinct physical copies are required. Split/Double never duplicate or enlarge sides.
- Pair ranks must match, not just Blackjack values. Perfect same-suit gross 26x; coloured same-colour/different-suit 13x; mixed opposite-colour 7x; NONE 0. Clubs/spades black, diamonds/hearts red.
- Three-card priority: suited trips 101x; straight flush 41x; trips 31x; straight 11x; flush 6x; NONE 0. A23 and QKA straights; no KA2 wraparound, with same-suit KA2 flush fallback. No stacked categories.
- M5 owns the initial two-pass deal. Ace opens outer decisionPhase INSURANCE with embedded M4 gameplay dormant, no current hand and no dealer Natural evaluation yet. Each eligible HUMAN chooses purchase/decline/eligible Even Money. COMPUTER choices auto-decline, automation stops for HUMAN and no timer exists.
- Insurance reserves exactly half original MAIN from available funds, including odd units. Exact funds pass; insufficient requests reject without cards/RNG/turn/peek effects. One decision per original wager. When all close, one internal Ace peek; ten-value upcards immediately peek without Insurance, 2..9 do not peek. Negative peek keeps hole secret. Insurance wins 3x gross only for dealer Natural; later dealer 21 does not win it.
- Even Money is an irreversible original-Natural MAIN election before Ace peek, no separate stake/reserve. It excludes Insurance and fixes MAIN gross 2x original regardless of dealer Natural, without 3:2 stacking. Unconverted Natural pushes dealer Natural or receives 2.5x gross on negative peek. Dealer Natural ends all gameplay. Initial sides retain independent results.
- Insurance decisions do not consume the first gameplay action. Following negative peek, eligible ordinary original hands retain Late Surrender. Advanced actions reuse unchanged M4 primitives; M5 wrappers guard the Insurance window.
- MAIN leaf, Insurance and side returns all remain unavailable until one table-level reconciliation/commit. Result records identify round/seat/wager/type/hand when applicable/stake/outcome or category/gross/net/status. All reservations reconcile before any balance update. Repeated finalization rejects unchanged.
- Actual required-draw fault clears pending returns and retires the shoe. Whole-round VOID refunds actual main leaf exposure (including accepted Double/Split/re-split), sides and accepted Insurance once; Even Money adds no exposure. No hypothetical rejected wager refund. Normal commit and VOID exclude each other.
- Public projection uses an explicit allowlist; no physical IDs, shoe order/cut or hidden hole data. Legacy/raw internal APIs are not the M5 public command boundary. COMPUTER gameplay remains total <17 HIT / >=17 STAND, not basic/optimal strategy.

## Exact source/test additions

All are additions against accepted M4 a5c6a22; no accepted executable file was edited:

- src/domain/optionalGame.ts
- src/domain/optionalPublicView.ts
- src/domain/sideBets.ts
- tests/helpers/optionalFixture.ts
- tests/unit/sideBets.test.ts
- tests/integration/optionalBetting.test.ts
- tests/integration/optionalEvaluation.test.ts
- tests/integration/optionalInsurance.test.ts
- tests/integration/optionalEvenMoney.test.ts
- tests/integration/optionalSettlement.test.ts
- tests/integration/optionalRegression.test.ts
- tests/integration/optionalIntegrity.test.ts

Documentation changes: README.md, docs/DESIGN.md, docs/PLAN.md, docs/STATE.md, docs/DEVELOPMENT_LOG.md, docs/LAB_MANUAL.md. T07 changes only these documents relative to the T06 snapshot. RULES/SPEC/UX_UI, harness, dependencies and runtime configuration remain unchanged.

## Known limitations

Local headless in-memory library, one HUMAN maximum, seat-scoped session funds. Callers retain latest returned state; old snapshots can branch computation. No validated arbitrary state import, database, persistence, concurrent transaction service, authentication, account transfer/reset, event store or replay product. The original-card arrays and financial records are frozen; the entire state is not a deep-frozen security boundary. Public projection does not protect secrets from the process owner.

No Bet Behind/followers, Charlie, UI, network, real money or deployment. The computer policy is deliberately simple. No unresolved mechanical failure is known at T07; the fresh reviewer has not assessed M5. T07 final publication/clean status is established by the actual delivery report, not inferred from this pre-commit document.

## Mandatory M5 fresh-session review handoff

After T07 is VERIFIED and authorized publication completes, STOP. Do not independently review M5 in the implementation conversation. Do not mark M5 ACCEPTED or start M6.

The delivery report supplies each checkpoint SHA, final main HEAD/origin/main, checked push/fetch parity and clean status. T07 has no executable change relative to T06 fe078fd50ba7b75d5288d807e85519729890bdc2. A genuinely new Codex conversation must:

1. Read AGENTS, SKILL, RULES, SPEC, DESIGN, PLAN, STATE, DEVELOPMENT_LOG, README and LAB plus the user's full M5 contract. Independently check R06/R07/R08/R09/R13/R14/R17 and M5 non-goals.
2. Capture runtime timestamp, repository, branch, HEAD, origin/main, ahead/behind and full status. Require delivered final SHA on main and clean 0/0; report mismatch before affected work. Fetch only within valid authorization.
3. Inspect full accepted-M4-to-final diff and every source/test listed above, independent expected values, REG mapping and actual logs. Require T07 no executable changes versus T06 checkpoint.
4. Run powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1 with exit check. Observed local full count is 38 files / 644 tests. Independently rerun M1 12/155, M2 6/78, M3 5/72 and M4 7/171 using original historical file lists, and compare original executable paths.
5. Review all REG-M5-001..072 and additional fixtures, especially no Ace peek before decisions, exactly-once negative-peek secrecy, no funds/3:2 stacking for Even Money, fixed initial side inputs, all pending unavailable, reconciliation and actual-reservation VOID, including partial initial deal and advanced exposure. M6 must remain absent.
6. Report findings first: severity, file/line, concrete evidence and impact. Then requirements, regression, preservation, documentation and limitations. Counts/model confidence do not substitute for findings-first review.
7. Make no edits without separate authorization. Mark missing execution NOT RUN/BLOCKED accurately. Leave M5 acceptance to the human; no M6, merge, release or deployment.

## REG-M5 executable mapping

Every number is registered once in tests/integration/optionalRegression.test.ts as REG-M5-NNN. Related IDs share a scenario containing all relevant independent assertions; a separate test requires exactly 001..072 with no duplicates. T06 full harness PASS. Detailed suites add boundary/category/funding/secrecy/fault coverage.

| ID | Required coverage |
| --- | --- |
| 001 | Pair minimum |
| 002 | Pair maximum |
| 003 | Pair increment/range rejection |
| 004 | Three-card minimum |
| 005 | Three-card maximum |
| 006 | Three-card increment/range rejection |
| 007 | Own active funded MAIN prerequisite |
| 008 | Exact side funding |
| 009 | Insufficient side funding atomic |
| 010 | Side increase/decrease/duplicate target |
| 011 | Side cancellation once |
| 012 | MAIN cancellation cascades refund |
| 013 | Betting close freezes wagers |
| 014 | Perfect Pair |
| 015 | Coloured Pair |
| 016 | Mixed Pair |
| 017 | Equal-value 10/J and K/Q lose |
| 018 | Highest category/no stacking |
| 019 | Suited trips |
| 020 | Straight flush |
| 021 | Three of a kind |
| 022 | Straight |
| 023 | Flush |
| 024 | A23 straight |
| 025 | QKA straight |
| 026 | KA2 not straight |
| 027 | Suited KA2 flush fallback |
| 028 | Immutable original cards only |
| 029 | Split does not duplicate sides |
| 030 | Double does not increase sides |
| 031 | Side independent from main |
| 032 | Side pending unspendable |
| 033 | Ace decision window before actual peek |
| 034 | Hidden hole during window |
| 035 | Exact half Insurance |
| 036 | Odd-unit Insurance |
| 037 | Exact Insurance funds |
| 038 | Insufficient Insurance atomic |
| 039 | Computer declines; HUMAN pause |
| 040 | Insurance once |
| 041 | No Insurance after peek/action |
| 042 | Ten-value immediate peek/no window |
| 043 | 2..9 no window/no peek |
| 044 | Dealer Natural Insurance win |
| 045 | Negative peek Insurance loss |
| 046 | Later three-card 21 not Insurance win |
| 047 | Original Natural Even Money eligibility |
| 048 | Even Money no reserve |
| 049 | Mutual exclusion and irreversibility |
| 050 | Even Money dealer Natural |
| 051 | Even Money dealer non-Natural |
| 052 | No Even Money/3:2 stacking |
| 053 | Declined Natural 3:2 |
| 054 | Natural push vs dealer Natural |
| 055 | Dealer Natural terminates actions |
| 056 | Side bets survive dealer Natural |
| 057 | Insurance does not consume gameplay action |
| 058 | Late Surrender after negative peek |
| 059 | Unified settlement |
| 060 | Insurance exact once |
| 061 | Pair exact payout |
| 062 | Three-card exact payout |
| 063 | Pending cannot fund M4 action |
| 064 | VOID side refund |
| 065 | VOID Insurance refund |
| 066 | VOID clears side pending profits |
| 067 | VOID clears Insurance/Even Money results |
| 068 | Advanced plus M5 actual exposure refund |
| 069 | Duplicate settlement/opposite VOID no effect |
| 070 | Duplicate VOID/opposite settlement no effect |
| 071 | Peek/Insurance public secrecy |
| 072 | M6 absent/no auto computer side bet |
