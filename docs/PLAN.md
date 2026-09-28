# Casino Blackjack — Engineering Plan

Document date: 2026-09-28  
Document task: PLAN-1.0  
Intended repository location: `docs/PLAN.md`  
Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Rules baseline: `docs/RULES.md` — Blackjack House Rules v1.1  
Specification baseline: `docs/SPEC.md` — SPEC-1.0  
Design baseline: `docs/DESIGN.md` — DESIGN-1.0  
Status: planning document; not evidence of implementation, verification, acceptance, commit, push, or deployment.

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

**Status:** `VERIFIED` — harness and failure injection passed; repair cycles 2/10. Human acceptance and local commit are pending; see STATE.md and DEVELOPMENT_LOG.md.

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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

**Status:** `NOT STARTED`  
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

These milestones remain high-level until M1 is complete and the relevant rules/design are reviewed.

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

M1-T01 is VERIFIED and awaits human checkpoint review and a local commit decision. The next implementation task is `M1-T02 — Physical Card Model and Six-Deck Inventory`, which remains NOT STARTED. No later implementation was included in the bootstrap task.
