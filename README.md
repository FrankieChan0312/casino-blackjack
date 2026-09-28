# Casino Blackjack

A portfolio-oriented Blackjack project focused on **verifiable game-engine behaviour, deterministic testing, clear domain modelling, and reproducible engineering evidence**.

> **Current status:** M1 is ACCEPTED. M2 table gameplay through T04 is implemented and verified locally; see [STATE.md](docs/STATE.md) for evidence.
> M2 regression/review packaging continues. M2 fresh-session review is NOT RUN and M2 is not ACCEPTED.
> No browser UI, deployment, or real-money functionality exists.

## Project Goal

The long-term goal is to build a casino-style Blackjack table using simulated credits only.

The project is designed to demonstrate software-engineering skills beyond a simple card-game UI, including:

- six-deck shoe management;
- deterministic randomness under test;
- Ace-aware hand evaluation;
- American hole-card flow;
- dealer S17 rules;
- explicit game-state transitions;
- hidden/public state separation;
- multi-seat table modelling;
- simulated-credit betting and settlement;
- Double, Split, Re-split, and Late Surrender;
- Insurance and Even Money;
- approved side bets;
- Bet Behind;
- browser UX and end-to-end validation;
- replay/audit-friendly engineering evidence.

The full product is intentionally split into milestones. Features described in the roadmap are **not considered implemented until the relevant milestone is completed and verified**.

## Current Milestone

### M1 — Headless Blackjack Core

M1 is intentionally small and focused.

Implemented so far: `src/domain/card.ts` defines card types and creates an unshuffled inventory of 312 distinct physical cards (six copies of each rank/suit). IDs use `deckIndex:suit:rank`; order is deck 1–6, clubs/diamonds/hearts/spades, then A/2–10/J/Q/K. `random.ts` provides injected integer randomness, a Math.random adapter for simulation, and Fisher-Yates shuffle that returns a new array preserving the original card objects. `shoe.ts` creates a shuffled shoe with one fixed cut position, draws from `available[0]` into inPlay, moves completed-round cards to discard, and prepares reuse/replacement before the next round. Cut crossing marks pending without interrupting draws; unexpected exhaustion returns an explicit failure with a retired shoe. Callers supply shoe IDs and retain returned states.

`hand.ts` evaluates readonly card arrays into total, soft, bust and 21 facts without mutation. Aces start at 11 and reduce to 1 as needed; empty hands total zero. `isNaturalBlackjack(cards, originalHandEligible)` requires explicit original-unsplit eligibility as well as exactly two cards, Ace plus 10/J/Q/K. Ordinary 21 remains distinct from natural Blackjack.

`game.ts` provides `createGame(shoeId, random)` and `startRound(state, roundId, replacementShoeId, random)`. Initial order is player/upcard/player/hole. Dealer peek is gated to Ace or ten-valued upcards; initial naturals resolve immediately, otherwise the phase becomes PLAYER_TURN. Accepted commands return a new state, which may contain INTEGRITY_ERROR if a draw failed; an active-round start is rejected unchanged. Normal completion moves inPlay to discard.

`hit(state)` draws one player card: below 21 stays in PLAYER_TURN, ordinary 21 enters DEALER_TURN, and bust completes with DEALER_WIN / PLAYER_BUST without dealer draws. `stand(state)` changes only the phase to DEALER_TURN. Both reject absent, wrong-phase or terminal rounds unchanged. A failed Hit retains the retired shoe and enters INTEGRITY_ERROR without a normal result. `getPublicView(state)` exposes copied rank/suit data, hiding the hole in PLAYER_TURN and INTEGRITY_ERROR and revealing it in DEALER_TURN or ROUND_COMPLETE, as DESIGN section 12 requires. It excludes shoe order and hidden totals. Use this projection for player-facing consumers; internal GameState contains secrets. `resolveDealer(state)` completes S17 drawing in one command using pure dealer/outcome helpers, then returns PLAYER_WIN, DEALER_WIN or PUSH and discards in-play cards. It rejects wrong-phase/terminal calls unchanged; failed draws preserve partial hands and the retired shoe in INTEGRITY_ERROR.

The implemented one-seat, no-wager, headless engine includes:

- six standard decks;
- 312 distinguishable physical cards;
- persistent shoe lifecycle;
- configurable test-controlled randomness;
- cut-card handling;
- Blackjack hand evaluation;
- Natural Blackjack detection;
- initial deal sequencing;
- dealer hole-card protection;
- dealer peek logic;
- Hit and Stand;
- dealer S17 behaviour;
- ordinary outcome resolution;
- terminal-state protection;
- mechanical automated verification.

M1 does **not** include:

- simulated balances or wagers;
- multiple seats;
- computer players;
- Double;
- Split / Re-split;
- Surrender;
- Insurance purchase;
- Even Money;
- side bets;
- Bet Behind;
- Five-Card Charlie;
- React/browser UI;
- networking or multiplayer;
- cloud deployment.

## Engineering Approach

This repository follows a bounded engineering loop:

```text
Intent
  ↓
Acceptance Criteria
  ↓
Smallest Complete Change
  ↓
Mechanical Verification
  ↓
Evidence-Based Repair
  ↓
Review
  ↓
Human Acceptance
```

The project does not treat generated code or model confidence as proof of correctness.

Each implementation task is expected to:

1. capture the real repository baseline;
2. define scope and non-goals;
3. define acceptance criteria;
4. make a small, reviewable change;
5. run the agreed verification;
6. record failures and repair cycles;
7. update persistent project state;
8. commit a verified checkpoint;
9. push only when the target GitHub repository/branch is authorized.

## Verification

Use Node 24 (>=24.19.0; observed v24.19.0), npm (observed 11.17.0), and Windows PowerShell 5.1. Install the locked development dependencies, then run the local verification entry point:

```powershell
npm.cmd ci
.\scripts\verify.ps1
```

If local script execution is restricted, invoke it in a child process:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The harness runs `npm run typecheck`, `npm run lint`, and `npm run test`, checks each exit code, and returns non-zero on failure or an unavailable command. It runs from its own repository root regardless of the caller's directory. The current suite covers the document harness, inventory, randomness, shoe lifecycle, hand scoring, initial-deal/natural integration, player actions, terminal protection and public-view secrecy. Dealer/outcome and cross-round integration are covered; STATE.md maps all M1 ACs to executed checks. Fresh-session review remains pending. Browser/E2E checks are NOT APPLICABLE to M1.

The toolchain uses TypeScript, ESLint with typescript-eslint, and Vitest in its default Node environment. Vite is a Vitest development dependency; no browser application or server is implemented. Exact versions are in package.json and package-lock.json. No production dependencies or build output are needed for this checkpoint.

The final local suite contains **12 test files / 155 tests**. `tests/verifyHarness.test.ts` executes the actual PowerShell wrapper in temporary directories with controlled command failures and a missing-tool case. These tests require Windows PowerShell; portability to other operating systems and a separate clean-machine install have not been verified. The real T09 type-error self-test also returned overall exit 2 before restoration and a passing full run.

M1 is an in-memory library exercised by tests, with no interactive CLI or browser app. Callers supply stable round/shoe IDs and retain each returned state. TypeScript readonly declarations and pure transitions protect the engine contract; they do not freeze arbitrary caller-owned data at runtime. Public projection prevents accidental disclosure through the supported view, not inspection of local process memory. Math.random is used only in the simulation adapter and is not a security or casino-certification claim.

A required check that fails or cannot run means the milestone is **not verified**.

Verification states are recorded explicitly as:

- `PASS`
- `FAIL`
- `NOT RUN`
- `BLOCKED`
- `NOT APPLICABLE`

## Repository Documentation

The project separates rules, specification, design, current state, and learning notes.

```text
AGENTS.md
    Agent entry point, repository boundaries, execution rules,
    verification expectations, repair limits, and permissions.

SKILL.md
    Karpathy-inspired coding guidelines used by the project.

docs/RULES.md
    Blackjack House Rules v1.1.

docs/SPEC.md
    Scope, non-goals, milestones, acceptance criteria, and regression cases.

docs/DESIGN.md
    Approved M1 software design and domain boundaries.

docs/UX_UI.md
    Future browser interaction and UX/UI specification.

docs/PLAN.md
    Milestones, task IDs, dependencies, verification, and stop conditions.

docs/STATE.md
    Current repository truth, repair-cycle counts, validation state,
    blockers, and next task.

docs/DEVELOPMENT_LOG.md
    Timestamped engineering evidence: baseline, implementation,
    validation, repair, review, commit, and push events.

docs/LAB_MANUAL.md
    Learning notes and interview-oriented explanations.
```

## Planned Milestones

| Milestone | Scope |
| --- | --- |
| M1 | Headless Blackjack Core |
| M2 | Multi-seat Table and Computer Seats |
| M3 | Simulated Credits, Main Betting, and Settlement |
| M4 | Double, Split, Re-split, and Late Surrender |
| M5 | Insurance, Even Money, and Side Bets |
| M6 | Bet Behind |
| M7 | Browser UX/UI and End-to-End Validation |
| M8 | Variant, Replay, Audit, and Portfolio Polish |

Later milestones remain planning targets until their implementation begins.

## Blackjack Rules Profile

The primary planned rules profile is:

`CLASSIC_6D_S17_V1_1`

Key choices include:

- six-deck shoe;
- American hole-card flow;
- dealer stands on soft 17;
- one cut-card position selected per shoe;
- no mid-round reshuffle;
- Natural Blackjack only for an original two-card Ace + ten-valued card;
- simulated credits only in later wagering milestones.

See [`docs/RULES.md`](docs/RULES.md) for the complete approved rule set.

## Portfolio Integrity

The project permits **simulation credits only** in later wagering milestones; M1 has no credit or wager state.

It does not include:

- real-money deposits;
- withdrawals;
- cash redemption;
- payment processing;
- real-money wagering;
- gambling licensing claims;
- production casino certification.

Any performance, test, benchmark, review, deployment, or feature claim in this repository must be supported by actual recorded evidence.

## Development Status

Current implementation scope (execution details are in STATE.md and DEVELOPMENT_LOG.md):

```text
Rules:                 prepared
Specification:         prepared
M1 design:             prepared
Engineering plan:      prepared
Repository bootstrap:  engineering harness implemented
Blackjack source code: complete one-seat M1 flow, S17/outcomes and public view
Automated verification:see docs/STATE.md
GitHub checkpoint:      T09 published; T10 review-package version is identified by Git history
Browser UI:             not implemented
Deployment:             not applicable to M1
```

The next required step after the T10 checkpoint is:

**A genuinely new Codex session performs findings-first M1 review.** See the review handoff in STATE.md. No M2 work or automatic acceptance is authorized.

## Local Repository Target

The agreed Windows repository path is:

```text
C:\Users\user\Documents\GitHub\casino-blackjack
```

This path and its Git repository were confirmed during M1-T01. Existing unknown files or Git state must not be overwritten.

## License

No repository license has been selected yet.

Do not assume a license until one is explicitly added.

## M2 implementation through T04

Seven stable seats support EMPTY/HUMAN/COMPUTER occupancy, sitting out, at most one local human and zero-human computer-only tables. Round participation is frozen. A shared shoe deals in two ascending passes around the dealer cards; naturals and later results belong to individual seats. HUMAN Hit/Stand is routed only to the current HUMAN seat.

The computer policy is deliberately deterministic and non-LLM: evaluated total below 17 Hits, otherwise Stands. It is not optimal Blackjack strategy or basic-strategy compliance. advanceTableAutomation runs consecutive computers, pauses for HUMAN input, then resolves one shared S17 dealer. Call it after startTableRound or an accepted HUMAN action when the round is still active. No betting/credits, UI, network multiplayer, production casino or deployment is implemented.
