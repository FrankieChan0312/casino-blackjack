# Casino Blackjack

A headless TypeScript Blackjack portfolio project with deterministic tests, explicit state transitions and reproducible execution evidence.

**M1 is ACCEPTED** at `d1d8966fe55af1bc2b9348e305135952b7723b70` through the explicit M2 batch contract. **M2 is implemented and mechanically verified; independent fresh-session review is NOT RUN and M2 is NOT ACCEPTED.** Checkpoint and repair evidence is in [STATE.md](docs/STATE.md) and [DEVELOPMENT_LOG.md](docs/DEVELOPMENT_LOG.md).

There is no browser UI, interactive CLI, betting, credit balance, network multiplayer or deployment. This is simulated gameplay, not a production casino or gambling-certification claim.

## Implemented M2 behaviour

- Exactly seven stable seats, numbered 1–7, with EMPTY/HUMAN/COMPUTER occupancy.
- Zero or one local HUMAN; computer-only tables are supported. Occupied seats may sit out. At least one active seat is required to start.
- Atomic seat configuration between rounds. Each round retains a detached, frozen participation/occupancy snapshot.
- One shared six-deck shoe and one shared dealer for the whole table. Physical cards remain distinguishable and accounted for.
- Two ascending active-seat deal passes, skipping empty/sitting-out seats. Each pass deals to players and then dealer (upcard, then hole card).
- Dealer peek for Ace/ten-valued upcards. Dealer Natural ends every active hand: player Natural pushes, ordinary players lose. Otherwise player Naturals win independently while other hands continue.
- HUMAN Hit/Stand only for the current eligible HUMAN seat. Ordinary 21, bust and Stand end that seat's decisions and advance to the next eligible seat. One player's bust does not end other players' hands.
- Deterministic, non-LLM M2 computer policy: evaluated total **below 17 → HIT; 17 or above → STAND**, including soft 17. Ace handling uses the existing evaluator. This is intentionally simple, **not optimal strategy, basic-strategy compliance or AI/ML intelligence**.
- Automation runs consecutive computer turns until HUMAN input is required. After all decisions, the shared dealer follows S17 once; each surviving hand compares independently. Naturals and bust losses remain fixed during normal completion. No unnecessary dealer drawing when every result is already known.
- A failed required draw produces INTEGRITY_ERROR, retires the shoe, preserves diagnostic cards and clears normal per-seat results for the failed table. No invented winner, mid-round replacement or financial refund exists.
- Public state explicitly copies all seven seats and visible rank/suit fields. The dealer hole card is hidden during PLAYER_TURN and INTEGRITY_ERROR and visible at DEALER_TURN/ROUND_COMPLETE. No physical IDs, future shoe order, cut position or hidden total is exposed.
- A usable shoe persists across rounds. Crossing its fixed 219–249 cut position defers replacement until the next round. A retired shoe or fewer than `2*n+2` available cards also triggers replacement before dealing.

## Domain API and usage

Import directly from `src/domain/tableGame.ts` and `src/domain/tablePublicView.ts`; this repository currently has no package build or interactive application.

| API | Purpose |
| --- | --- |
| `createTableGame(shoeId, random)` | Create an empty table and shuffled shoe |
| `configureTableSeats(state, updates)` | Atomically apply seat occupancy/sit-out changes between rounds |
| `startTableRound(state, roundId, replacementShoeId, random)` | Freeze participants, prepare shoe, deal and resolve naturals |
| `hitTableSeat(state, seatNumber)` / `standTableSeat(state, seatNumber)` | Validate and apply the current HUMAN decision |
| `advanceTableAutomation(state)` | Run computers and shared dealer until HUMAN input or a terminal table |
| `resolveTableDealer(state)` | Resolve a table already in DEALER_TURN |
| `getPublicTableView(state)` | Return configuration plus the separate frozen round's seven-seat public view |

Retain each returned `state`. `ok=false` rejects a command with the original state and an explicit error. `ok=true` means the command was accepted; inspect `round.phase`, since an accepted draw may end in INTEGRITY_ERROR. After a non-terminal deal or HUMAN action, call `advanceTableAutomation`; it returns unchanged while waiting for a HUMAN. Start the next round explicitly after completion/error. Callers supply round/shoe IDs; replacement requires a different shoe ID.

`complete` on a seat hand means its decisions have ended; a stood/ordinary-21 hand may still await a dealer result. Results belong to each hand, with no single table winner. Between-round configuration is separate from the prior round snapshot, so changing occupancy cannot rewrite archived cards/results.

The accepted one-seat M1 API remains in `game.ts`/`publicView.ts`. M2 reuses its card, shuffle, shoe, hand, S17 and ordinary-comparison primitives. All original M1 tests/helpers are unchanged from the accepted baseline.

## Verification

Use Node 24 (>=24.19.0), npm and Windows PowerShell 5.1. Install locked development dependencies if needed, then run:

```powershell
npm.cmd ci
.\scripts\verify.ps1
```

If PowerShell execution policy blocks direct invocation:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The harness runs typecheck, lint and all unit/integration tests, propagating required failures and unavailable tools as nonzero exits. Its preserved historical final output label says `M1 engineering verification`; test discovery includes M2. The verified suite has **18 files / 233 tests**: original M1 **12 files / 155 tests**, plus M2 **6 files / 78 tests**. T05 independently reran the original M1 suite and confirmed no original test/helper diff. [STATE.md](docs/STATE.md) maps all 24 required M2 scenarios.

The existing harness tests run the real PowerShell wrapper with controlled failures and a missing-tool case. Tests require Windows; portability and a separate clean-machine `npm ci` reproduction are NOT RUN. Browser/E2E is NOT APPLICABLE because there is no UI. No new dependency was installed for M2. Dependencies are development-only; versions are locked in package-lock.json.

## Scope and limitations

M2 has no wagers, chips/credits/wallets, accounts, Double, Split, Surrender, Insurance, Even Money, side bets, Bet Behind, Charlie, database, transport, server or replay product. Simulated credits and main betting are M3, which has **not started**. No real-money deposits, purchases, withdrawals, transfers or redemption are supported.

The engine is an in-memory library. Pure transitions and TypeScript readonly fields protect supported command use; arbitrary caller-supplied/corrupted objects are not a general validated import format. Participation snapshots are frozen, while the entire state is not deeply frozen at runtime. Low-level shoe/table lifecycle primitives are not active-round player commands. Public projection prevents accidental disclosure through the supported view; it is not security against the owner of local process memory. Math.random is only a simulation adapter, with no cryptographic or casino-certification claim.

M2 is VERIFIED, not independently reviewed, ACCEPTED or DEPLOYED. The next action is a genuinely fresh-session, findings-first review using the [STATE.md handoff](docs/STATE.md#mandatory-m2-fresh-session-review-handoff). The reviewer reruns the harness, checks M1 regression preservation and reports findings without editing unless separately authorized.

## Repository documentation

| File | Responsibility |
| --- | --- |
| [AGENTS.md](AGENTS.md), [SKILL.md](SKILL.md) | Engineering contract and coding guidelines |
| [RULES.md](docs/RULES.md) | Target Blackjack house rules; described features are not all implemented |
| [SPEC.md](docs/SPEC.md) | Milestone boundaries and M1 acceptance criteria |
| [DESIGN.md](docs/DESIGN.md) | Accepted M1 design plus authorized M2 extension |
| [PLAN.md](docs/PLAN.md) | Task order, contracts and checkpoints |
| [STATE.md](docs/STATE.md) | Current evidence, repair counts, M2 mapping and review handoff |
| [DEVELOPMENT_LOG.md](docs/DEVELOPMENT_LOG.md) | Timestamped history, including failed attempts and repairs |
| [LAB_MANUAL.md](docs/LAB_MANUAL.md) | Concepts, regression bugs and interview notes |
| [UX_UI.md](docs/UX_UI.md) | Future browser presentation; M7 remains unimplemented |

The remaining roadmap is M3 credits/main bets, M4 advanced actions, M5 insurance/side bets, M6 Bet Behind, M7 browser UX/E2E and M8 variants/replay/portfolio polish. None is authorized by the M2 review handoff. No repository license has been selected.
