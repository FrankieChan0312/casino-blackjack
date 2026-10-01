## Current RA1 delivery

House Rules v1.2 amendment: [RA1 contract](RA1_CONTRACT.md), [execution evidence](RA1_EVIDENCE.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1 progress: RA1-T01 IMPLEMENTED / VERIFIED; T02..T05 pending except T05 baseline repair. Repair ledger T01..T05 `2,0,0,0,1` (each /10). Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Historical M9/M8 records below retain their original version, inventory and review boundaries; they are not current RA1 claims.

<!-- END CURRENT RA1 -->

## Current M9 delivery

M1-M8 HUMAN ACCEPTED. M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`; final independent review NO FINDINGS, MEDIUM-05 CLOSED, all previous findings CLOSED. The owner's explicit acceptance was recorded with substantive T01. M8 repair ledger `0,2,3,2,2,1,2,6,4` remains unchanged.

M9-T01..T09 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Stop at the fresh-session review gate. M9 NOT ACCEPTED. Fresh-session review NOT RUN. Deployment NOT RUN. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

Current suite inventory: **68 Vitest files / 978 tests**, **1 Chromium project / 55 tests**. Execution results and failures are recorded separately in [M9 evidence](M9_EVIDENCE.md); inventory is not a PASS claim. [Fresh review pack](M9_REVIEW_HANDOFF.md). M9 cumulative repair ledger: `0,2,1,1,3,0,2,1,5`.

T09 implementation published on main at fc5cbd687a14e0e1eb1fae0ee6830e139397fe06, normal push/fetch PASS at 2026-10-01 22:35:03 +08:00, main=origin/main,0/0,clean/full untracked empty. This final documentation receipt changes no executable/test/dependency/runtime settings; its own final SHA is recorded in Git/delivery.

<!-- END CURRENT M9 -->

> The material below retains earlier milestone requirements and timestamped history. Earlier delivery/review statements are historical and superseded by the current delivery block above; manual UX remains supported in deliberate demo mode.

# Casino Blackjack Specification

Document date: 2026-09-28  
Document task: SPEC-1.0  
Intended repository location: `docs/SPEC.md`  
Rules baseline: `docs/RULES.md` — Blackjack House Rules v1.2; historical milestone scopes remain V1.1.
Status: specification for planning and implementation; not evidence of implementation, verification, acceptance, deployment, commit, or push.

## 1. Purpose

This repository is a portfolio project for a simulated-credit Blackjack table. The project must demonstrate clear domain modelling, deterministic testing, mechanical verification, reproducible development evidence, and honest delivery status.

`RULES.md` defines the game and wagering rules. This document defines delivery scope, milestone boundaries, acceptance criteria, edge cases, and required validation. `DESIGN.md` must explain how the implementation satisfies this specification without changing the rules.

If `RULES.md`, this specification, implementation, or tests conflict, stop and surface the conflict. Do not silently choose whichever interpretation is easiest to implement or pass.

## 2. Product target

The long-term target is a seven-seat simulated-credit Blackjack table with:

- six-deck persistent shoe management;
- American hole-card flow and S17 dealer policy;
- human, computer, and empty seats;
- main wagers and deterministic settlement;
- Hit, Stand, Double, Split, Re-split, and Late Surrender;
- Insurance and Even Money;
- Pair and three-card side bets;
- Bet Behind;
- an optional Five-Card Charlie profile;
- a browser UI with accessible, state-aware controls;
- deterministic test seams, audit-friendly event records, and later replay support where explicitly scoped.

The full target is not one milestone. A feature is not implemented, verified, or available merely because it is described in `RULES.md` or this section.

## 3. Global non-goals

The following are outside the current product baseline unless a future rules/specification revision explicitly adds them:

- real-money gambling, deposits, withdrawals, paid chips, or cash redemption;
- gambling licensing or certification claims;
- production casino deployment;
- progressive jackpots;
- H17 tables;
- European no-hole-card rules;
- Early Surrender;
- Re-splitting Aces under historical V1.1 profiles (enabled only by RA1 V1.2);
- Double for less;
- Spanish 21;
- Blackjack Switch;
- Double Exposure;
- side bets beyond those approved in `RULES.md`;
- an LLM controlling the dealer or computer players;
- claims of optimal bot strategy without independent evidence;
- network multiplayer until separately scoped and verified.

## 4. Milestone map

### M1 — Headless Blackjack Core

Deliver a one-seat, no-wager, headless Blackjack engine foundation. It must establish card identity, six-deck shoe lifecycle, controllable randomness, hand evaluation, initial deal, dealer peek/natural resolution, Hit/Stand, S17 dealer play, ordinary outcome resolution, terminal-state protection, and mechanical tests.

M1 does **not** implement credits, wagers, multiple seats, bots, Double, Split, Surrender, Insurance purchases, Even Money elections, side bets, Bet Behind, Charlie, React UI, persistence, network transport, or deployment.

Applicable rules: R03, R04, R05, the deal/information portions of R08, the dealer-peek/natural-result portion of R09 without Insurance/Even Money decisions, Hit/Stand portions of R10, R12, and non-financial integrity portions of R17.

### M2 — Multi-seat Table and Computer Seats

Add the seven-seat table model, Human/Computer/Empty occupancy, sitting out, active-seat deal order, per-seat sequencing, and deterministic computer decision policy limited to actions verified at that milestone.

Primary rule coverage: R02 and the multi-seat portions of R08, R10, R12, and R17.

### M3 — Credits, Main Betting, and Settlement

Add simulated balances, wager reservation, main bets, one-time settlement, funding invariants, round-level commit semantics, and void refunds. No advanced actions or side bets are implied unless separately included in that milestone task.

Primary rule coverage: R06, R07, R13, financial portions of R17.

### M4 — Double, Split, Re-split, and Late Surrender

Add advanced hand actions, Double After Split, four-leaf-hand cap, Split Aces restrictions, atomic insufficient-funds rejection, and Late Surrender.

Primary rule coverage: R10 and R11 plus R07/R13 funding and settlement effects.

### M5 — Insurance, Even Money, and Initial-card Side Bets

Add Insurance, Even Money, Pair side bet, and three-card side bet with the approved paytables and evaluation priority.

Primary rule coverage: R09 and R14 plus R06/R07/R13.

### M6 — Bet Behind

Add back-bet ownership, independent funding, follow-on Double/Split decisions, no-add fallbacks, Insurance/Even Money handling for back bettors, and settlement.

Primary rule coverage: R15 plus applicable funding and settlement rules.

### M7 — Browser UX/UI and End-to-End Validation

Connect verified domain features to the browser UI. Apply `UX_UI.md`; add state-aware controls, dealer-hole-card presentation rules, accessible interaction, responsive layouts, and Playwright coverage for agreed workflows.

M7 must not weaken or duplicate domain validation in UI-only code.

### M8 — Variant, Replay, Audit, and Portfolio Polish

Add the separately identified Five-Card Charlie demonstration profile, agreed replay/seed support, audit-friendly event output, statistical/invariant checks where appropriate, README/demo polish, final regression, and fresh-session review.

Primary rule coverage: R16 and remaining audit/replay requirements in R17.

## 5. M1 scope

M1 is intentionally small and complete. It must provide a deterministic, testable domain engine without UI or money-like state.

### 5.1 Required M1 capabilities

1. Represent all 312 physical cards in a six-deck shoe with stable physical identities.
2. Shuffle a new shoe through an injected randomness boundary.
3. Select one cut position in the inclusive range 219–249 through an injected randomness boundary.
4. Persist that cut position for the lifetime of the shoe.
5. Draw without replacement and maintain card-accounting invariants.
6. Mark reshuffle pending when the cut position has been reached or crossed, without interrupting an active round.
7. Prepare a new shoe before the next round when reshuffle is pending.
8. Prevent an initial deal from starting when fewer than four cards are available for the one-seat M1 round; prepare a new shoe first.
9. Surface an integrity failure if an unexpected required draw finds no card during an active round. M1 has no financial settlement to refund.
10. Evaluate hard/soft hand totals, multiple Aces, 21, and bust correctly.
11. Identify natural Blackjack only for the original two-card player/dealer hand.
12. Deal one player hand and one dealer hand in the required order: player upcard, dealer upcard, player second upcard, dealer hole card.
13. Keep the dealer hole-card identity unavailable through the public player-facing state before reveal/terminal resolution.
14. Perform dealer Blackjack peek when the upcard is Ace or a ten-valued card. M1 has no Insurance/Even Money choice, so there is no Insurance decision window.
15. Resolve initial naturals before normal player actions.
16. Allow Hit only during an active player turn; each accepted Hit draws exactly one card.
17. Automatically end the player hand on bust or ordinary 21.
18. Allow Stand only during an active player turn and transition to dealer resolution without drawing a player card.
19. Reveal the hole card for dealer resolution.
20. Dealer must Hit below 17 and Stand on every 17 through 21, including soft 17.
21. Resolve ordinary one-seat outcomes: player win, dealer win, push, and player natural Blackjack.
22. Reject gameplay actions after the round is terminal without mutating the archived result.
23. Starting a new round must not itself rebuild a usable shoe.
24. M1 automated tests must not depend on uncontrolled random card order.

### 5.2 M1 non-goals

M1 must not add or expose:

- balances, chips, main bets, payouts, or settlement;
- multiple player seats or computer players;
- Double or Double After Split;
- Split or Re-split;
- Split Aces behaviour beyond future-rule documentation;
- Surrender;
- Insurance purchase;
- Even Money election;
- Pair or three-card side bets;
- Bet Behind;
- Charlie rules;
- React or another browser UI framework;
- database or persistence;
- REST, WebSocket, multiplayer server, authentication, or accounts;
- seeded replay as a product feature;
- cloud deployment;
- speculative generic rule engines intended to support all future variants.

## 6. M1 acceptance criteria

### AC-M1-001 — Six-deck physical inventory

A new shoe contains exactly 312 distinct physical-card identities. For each rank/suit combination there are exactly six physical copies. No joker or extra card exists.

**Verification:** unit tests enumerate the shoe and independently count physical IDs and rank/suit multiplicities.

### AC-M1-002 — Card accounting invariant

At every verified shoe state, live available cards, in-play cards, and discarded cards are pairwise disjoint and together account for the shoe's physical cards according to the current round lifecycle.

**Verification:** invariant tests before deal, during a round, after completion, and after discard transition.

### AC-M1-003 — Deterministic randomness seam

Shuffle and cut selection can be controlled in tests. A test can provide a known card order/cut selection without relying on repeated random runs.

**Verification:** deterministic fixture produces the exact expected initial deal and cut position on repeated executions.

### AC-M1-004 — Cut-card boundaries and lifetime

The accepted cut position is an integer from 219 through 249 inclusive. Boundary values 219 and 249 are valid; 218 and 250 are invalid. Once selected, the position does not change during that shoe.

**Verification:** boundary tests plus multiple-round lifecycle test.

### AC-M1-005 — No mid-round reshuffle

If card consumption reaches or crosses the cut position during an active round, the current round completes using the same shoe. Reshuffle is pending only for the next round.

**Verification:** controlled shoe crosses the threshold during a round; card source identity remains unchanged through terminal resolution; next-round preparation creates a new shoe.

### AC-M1-006 — Initial-deal exhaustion protection

For the one-seat M1 round, fewer than four available cards cannot begin an initial deal. A replacement shoe must be prepared before any card for that round is dealt.

**Verification:** fixtures with 0–3 remaining cards cause pre-deal replacement; a four-card fixture can begin the initial deal.

### AC-M1-007 — Unexpected draw exhaustion is an integrity failure

If a required card draw unexpectedly finds no available card after a round has begun, the engine must surface an explicit integrity failure. It must not fabricate a card, silently reshuffle mid-round, or manufacture a gameplay winner.

**Verification:** controlled fault-injection test.

### AC-M1-008 — Blackjack hand evaluation

The evaluator correctly calculates numeric cards, face cards, Ace adjustment, soft/hard status, 21, and bust.

Required independent examples include:

- `A,9 = 20`;
- `A,9,5 = 15`;
- `A,A = 12`;
- `A,A,9 = 21`;
- `A,A,9,9 = 20`;
- `A,6 = soft 17`;
- `A,6,10 = hard 17`;
- `10,8,7 = bust`.

### AC-M1-009 — Natural Blackjack classification

Only an original two-card Ace plus ten-valued card is natural Blackjack. An ordinary 21 made with three or more cards is not natural.

**Verification:** `A,K` and `A,10` are natural; `A,5,5` and `7,7,7` are ordinary 21.

### AC-M1-010 — Initial deal order and dealer secrecy

The one-seat initial deal order is player card 1, dealer upcard, player card 2, dealer hole card. Before authorized reveal, public/player-facing state must not expose the hole-card identity.

**Verification:** deterministic draw-order test plus public-state serialization/view-model test.

### AC-M1-011 — Dealer peek and initial natural resolution

With dealer Ace or ten-valued upcard, M1 checks the hole card before ordinary player actions. With dealer natural, no Hit or Stand is accepted. Player natural versus dealer natural is a push; player natural with dealer non-natural is `PLAYER_BLACKJACK`; dealer natural against a non-natural player is `DEALER_WIN`.

**Verification:** deterministic initial-deal cases for all three outcomes.

### AC-M1-012 — Hit semantics

During `PLAYER_TURN`, each accepted Hit draws exactly one player card. If the result is below 21, the hand remains actionable; if it is 21, player decisions end automatically; if it busts, the round resolves as a dealer win without unnecessary dealer drawing.

**Verification:** separate fixtures for below-21, exactly-21, and bust results.

### AC-M1-013 — Stand semantics

During `PLAYER_TURN`, Stand draws no player card and moves to dealer resolution. Subsequent player Hit/Stand requests are rejected.

**Verification:** card-count and state-transition assertions.

### AC-M1-014 — Dealer S17 policy

During dealer resolution, the dealer Hits every total below 17 and Stands on every total from 17 through 21, including soft 17.

Required cases include:

- dealer `10,6` → Hit;
- dealer `A,5` → Hit;
- dealer `A,6` → Stand;
- dealer `10,7` → Stand.

### AC-M1-015 — Ordinary outcome resolution

For non-natural, non-bust player hands after dealer resolution:

- dealer bust → player wins;
- player total greater than dealer → player wins;
- player total lower than dealer → dealer wins;
- equal totals → push.

**Verification:** deterministic examples such as 20 vs 19, 19 vs 20, and 20 vs 20.

### AC-M1-016 — Natural Blackjack outranks ordinary 21

A player original natural is not treated as an ordinary 21. An ordinary three-card dealer 21 does not turn a resolved player natural into a push.

**Verification:** player `A,K` versus a dealer three-card 21 resolves as `PLAYER_BLACKJACK` under the M1 no-wager outcome model.

### AC-M1-017 — Terminal-state immutability

After terminal resolution, Hit, Stand, dealer-step, or equivalent gameplay actions cannot change cards, shoe position, outcome, or archived round state.

**Verification:** snapshot state before and after rejected terminal actions.

### AC-M1-018 — New round reuses a valid shoe

Starting a new round on a shoe that has not reached reshuffle-pending status continues from that shoe's remaining cards and does not select a new cut position.

**Verification:** two deterministic consecutive rounds share the same shoe identity and cut position while consuming later cards.

### AC-M1-019 — Required verification entry point

`scripts/verify.ps1` is the single local M1 verification entry point and executes every required M1 check available in the chosen toolchain. It must inspect external command exit codes and return non-zero if any required step fails or cannot run.

At minimum, once the repository toolchain is established, M1 verification is expected to cover:

- type checking;
- linting;
- automated unit/integration tests appropriate to the headless engine.

Browser/E2E checks are `NOT APPLICABLE` to M1 because M1 has no UI. They must not be reported as PASS.

### AC-M1-020 — Documentation and evidence consistency

For the version declared VERIFIED, `RULES.md`, `SPEC.md`, `DESIGN.md`, `PLAN.md`, `STATE.md`, and required test/verification commands must describe the actual implementation. Any change after the recorded final verification that can affect behaviour invalidates the old verification for the affected checks.

**Verification:** final diff/repository review plus fresh-session review when the milestone reaches that gate.

## 7. M1 required regression matrix

The following cases must exist as executable automated checks before M1 can be VERIFIED:

| ID | Scenario | Expected result |
| --- | --- | --- |
| REG-M1-001 | Six decks created | 312 physical IDs; six of each rank/suit |
| REG-M1-002 | Cut selection receives lower boundary | 219 accepted |
| REG-M1-003 | Cut selection receives upper boundary | 249 accepted |
| REG-M1-004 | Cut selection receives 218/250 | rejected |
| REG-M1-005 | Cut crossed mid-round | round completes; reshuffle deferred |
| REG-M1-006 | New round before cut reached | same shoe/cut retained |
| REG-M1-007 | Fewer than four cards before deal | replace shoe before any card is dealt |
| REG-M1-008 | Required draw on unexpectedly empty active shoe | explicit integrity failure |
| REG-M1-009 | `A,9` then `5` | 15, not bust |
| REG-M1-010 | `A,A,9` | 21 |
| REG-M1-011 | `A,A,9,9` | 20 |
| REG-M1-012 | Original `A,K` | natural Blackjack |
| REG-M1-013 | `A,5,5` | ordinary 21, not natural |
| REG-M1-014 | Dealer `A,6` | Stand on soft 17 |
| REG-M1-015 | Dealer `10,6` | Hit |
| REG-M1-016 | Player natural / dealer natural | Push |
| REG-M1-017 | Player natural / dealer ordinary three-card 21 | Player natural result retained |
| REG-M1-018 | Player 20 / dealer 19 | player win |
| REG-M1-019 | Player 19 / dealer 20 | dealer win |
| REG-M1-020 | Player 20 / dealer 20 | push |
| REG-M1-021 | Player bust | dealer win; no unnecessary dealer draw |
| REG-M1-022 | Hit after terminal state | rejected with no gameplay mutation |
| REG-M1-023 | Hole card before reveal | absent from public/player-facing state |
| REG-M1-024 | Repeated deterministic fixture | identical deal and expected state |

Expected results must be asserted independently. Tests must not compute their expected hand/outcome values by calling the same production function under test.

## 8. M1 verification states

Use only these meanings:

- `PASS`: the required check was actually executed on the identified version and passed.
- `FAIL`: it ran and failed.
- `NOT RUN`: it has not been executed.
- `BLOCKED`: environment, dependency, or permission prevents execution.
- `NOT APPLICABLE`: the check genuinely does not apply; record why.

A required `FAIL`, `NOT RUN`, or `BLOCKED` means M1 is not VERIFIED.

## 9. M1 repair-loop boundary

The first implementation and first validation do not count as a repair cycle. After that, one repair cycle is:

1. inspect failure evidence;
2. state a testable cause hypothesis;
3. make a targeted change;
4. rerun the affected checks and required verification.

The cumulative task limit is 10 repair cycles. Session, model, agent, or task-name changes do not reset the counter. Record every cycle and its evidence in `STATE.md` or a linked persistent record. Stop early if the same failure repeats without new diagnostic evidence or a materially new hypothesis.

## 10. M1 Definition of Done

M1 can be labelled `VERIFIED` only when all of the following are true for the deliverable version:

- AC-M1-001 through AC-M1-020 are satisfied where applicable to the finalized M1 design;
- every required M1 automated verification step is PASS;
- every required regression case is present and passing;
- no unresolved M1 blocker remains;
- repository documentation matches actual behaviour;
- the recorded validation identifies the branch and commit, or the base commit plus complete uncommitted diff identity;
- no post-verification behavioural change has invalidated the evidence;
- required fresh-session review is completed, or its absence is explicitly reported and the milestone is not represented as fully reviewed.

`VERIFIED` is not `ACCEPTED`. Only the user can mark the milestone `ACCEPTED` after human review.

## 11. Next specification task after M1 bootstrap

Before implementation, repository bootstrap must create the minimal documented harness required by the shared engineering instructions:

- `AGENTS.md`;
- `README.md`;
- unchanged project copy of the supplied Karpathy `SKILL.md`;
- `docs/RULES.md`;
- this `docs/SPEC.md`;
- `docs/DESIGN.md`;
- `docs/UX_UI.md`;
- `docs/PLAN.md`;
- `docs/STATE.md`;
- `docs/LAB_MANUAL.md`;
- `docs/DEVELOPMENT_LOG.md`;
- `scripts/verify.ps1`.

Do not create speculative empty subsystems merely to mirror this list. Each file should begin with the minimum useful content needed for the current task, and later tasks must update the persistent truth as implementation progresses.

## M9 - Player Experience / Casino Session Flow

The authorized [M9 contract](M9_CONTRACT.md) defines AC-M9-001..015 and sequential T01..T09. M9 changes browser session orchestration and presentation only; accepted M1-M8 rules, financial/replay/audit semantics are preserved. Default Player Mode replaces configuration-first entry with prepared guests, funded automatic computer wagers/progression, near-edge own cards, central illustrated dealer and explicit repeat-round controls. All optional wagers and developer capabilities remain available. No M10 or deployment.
