# Casino Blackjack

A portfolio-oriented Blackjack project focused on **verifiable game-engine behaviour, deterministic testing, clear domain modelling, and reproducible engineering evidence**.

> **Current status:** M1-T01 engineering harness implemented; see [STATE.md](docs/STATE.md) for verification evidence.  
> No Blackjack gameplay implementation has been verified yet.  
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

It will implement a one-seat, no-wager, headless Blackjack engine with:

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

The harness runs `npm run typecheck`, `npm run lint`, and `npm run test`, checks each exit code, and returns non-zero on failure or an unavailable command. It runs from its own repository root regardless of the caller's directory. The current suite has two harness-level document checks; gameplay unit/integration tests have not been implemented. Browser/E2E checks are NOT APPLICABLE to M1.

The toolchain uses TypeScript, ESLint with typescript-eslint, and Vitest in its default Node environment. Vite is a Vitest development dependency; no browser application or server is implemented. Exact versions are in package.json and package-lock.json. No production dependencies or build output are needed for this checkpoint.

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

This project uses **simulation credits only**.

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
Blackjack source code: not implemented
Automated verification:see docs/STATE.md
GitHub push:            not run; no remote configured
Browser UI:             not implemented
Deployment:             not applicable to M1
```

The current executable task is:

`M1-T01 — Repository Bootstrap and Engineering Harness`

## Local Repository Target

The agreed Windows repository path is:

```text
C:\Users\user\Documents\GitHub\casino-blackjack
```

This path and its Git repository were confirmed during M1-T01. Existing unknown files or Git state must not be overwritten.

## License

No repository license has been selected yet.

Do not assume a license until one is explicitly added.
