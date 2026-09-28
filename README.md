# Casino Blackjack

A headless TypeScript Blackjack portfolio project with deterministic tests, explicit state transitions and reproducible execution evidence.

**Simulation credits only — no real money, purchases, deposits, withdrawals, transfers or redemption.** M1 and M2 are ACCEPTED. M3 main betting, reservation, settlement and VOID refunds are implemented and mechanically verified. **M3 is NOT ACCEPTED; independent fresh-session review is NOT RUN.** See [STATE](docs/STATE.md) for checkpoints, the 40-case regression map and review instructions.

There is no UI, interactive CLI, network multiplayer or deployment. No Double, Split, Re-split, Surrender, Insurance, Even Money, side bets or Bet Behind is implemented. This is a local portfolio library, with no production casino or gambling-certification claim.

## Implemented behaviour

- Seven stable seats (1–7), EMPTY/HUMAN/COMPUTER, zero or one HUMAN, with sit-out configuration before betting opens.
- Each seat owns a persistent session bankroll starting at **2000 integer half-credit units = 1000 credits**. Controller changes and leaving/rejoining retain that seat's balance. No automatic replenishment or reset API.
- Original main stakes are **20–2000 units**, in increments of **2 units** (10–1000 credits, whole-credit increments). OPEN betting supports placing, changing and cancelling. All funding changes are atomic; exact funds are sufficient.
- Available funds can be wagered; reserved funds already cover a wager; pending returns cannot be spent. An early Natural does not increase available funds while another seat is playing.
- Betting open locks seat configuration. Betting close freezes wagers and funded participants. Only occupied, non-sitting-out seats with an explicit funded wager receive cards. Computers never receive automatic bets. At least one funded seat is required.
- One shared six-deck shoe and dealer, two ascending deal passes, dealer peek, independent naturals, HUMAN Hit/Stand and ascending turns. One hand ending does not end other hands.
- Computer policy is deterministic and **non-optimal**: evaluated total below 17 -> Hit, otherwise Stand. It uses no LLM, hidden dealer card or future shoe information. Automation pauses for HUMAN input. The shared dealer follows S17 once.
- Ordinary win gross return is twice the stake; Natural gross return is `(stake / 2) * 5`; push returns the stake; loss/bust returns zero. Original stakes are even, so every calculation is exact integer arithmetic. A 50-unit wager returns 125 units for Natural.
- `settleMainWagers` commits every result together after full gameplay completion. It adds gross return and clears reserved once. Records contain round, seat, stake, outcome, gross, net and status. Repeated settlement rejects unchanged.
- Required-draw integrity failure invalidates table results and retires the shoe. `voidFinancialRound` refunds actual reservations once, with zero profit/loss, preserving diagnostic cards/fault. VOID and normal committed settlement exclude each other.
- A healthy shoe persists between rounds. Crossing the fixed 219–249 cut threshold defers replacement. A retired shoe or insufficient initial cards causes replacement at the next explicit funded deal. No automatic replay.
- The existing public table projection hides the dealer hole card during PLAYER_TURN/INTEGRITY_ERROR, reveals it at DEALER_TURN/ROUND_COMPLETE, and never exposes physical IDs, shoe order or cut position.

## M3 API and flow

Import the funded command surface from `src/domain/bettingGame.ts`. Retain each returned `state`; `ok=false` returns the original state with a reason. `ok=true` means accepted: a draw may still end in an integrity error. No package build or interactive application exists.

| API | Purpose |
| --- | --- |
| `createBettingGame(shoeId, random)` | Create session, seven bankrolls, empty table and shoe |
| `configureBettingSeats(state, updates)` | Configure only during CONFIGURING |
| `openBetting(state)` | Lock seats and open a new numbered betting cycle |
| `setMainWager(state, seatNumber, stakeUnits)` | Place/change target stake while OPEN; duplicate target is a no-op |
| `cancelMainWager(state, seatNumber)` | Release an OPEN wager once |
| `closeBetting(state, replacementShoeId, random)` | Freeze funded participants/wagers and deal |
| `hitFundedSeat` / `standFundedSeat` | Current HUMAN decisions |
| `advanceFundedTable(state)` | Run computers and shared dealer until HUMAN input or terminal gameplay |
| `resolveFundedDealer(state)` | Resolve an existing DEALER_TURN explicitly |
| `getMainWagerResults(state)` | Read known pending results or final committed/refunded records |
| `settleMainWagers(state)` | Commit normal settlement after gameplay ROUND_COMPLETE |
| `voidFinancialRound(state)` | Refund after genuine gameplay INTEGRITY_ERROR |
| `prepareNextBettingRound(state)` | After COMMITTED/VOID, return to CONFIGURING with preserved funds/shoe |

Normal flow: configure -> open -> explicitly fund each participating seat -> close/deal -> human/automation decisions -> settle -> prepare next round. On integrity error, call VOID instead of normal settlement. M2's nested `game.round.phase=ROUND_COMPLETE` means gameplay/discard is complete; M3 remains CLOSED until financial commit. Next-round creation and seat changes remain locked until finalization.

For public card information use `getPublicTableView(state.game)` from `tablePublicView.ts`; the financial result records contain no cards. Do not serialize internal state as a player-facing view. M1 (`game.ts`) and M2 (`tableGame.ts`) remain regression-protected low-level primitives. They are not the funded M3 workflow; bypassing its orchestration bypasses its financial contract.

## Verification

Use Node 24 (>=24.19.0), npm and Windows PowerShell 5.1:

```powershell
npm.cmd ci
.\scripts\verify.ps1
```

If execution policy blocks direct invocation:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The harness runs typecheck, lint and every unit/integration suite, propagating required failures and missing-tool errors. Its historical final label says `M1 engineering verification`, but discovery includes all milestones. Latest full suite: **23 files / 305 tests** (M1: 12/155; M2: 6/78; M3: 5/72). T05 independently reran M1 and M2 and verified unchanged original tests/helpers; all existing M2-baseline source, harness and dependency files are unchanged. No regression assertion was weakened.

## Limits and review status

Amounts are JavaScript numbers constrained to safe integer units; there is no fractional-unit rounding. Seat bankrolls are local demo ownership, not accounts transferable between seats. No authentication, database, wallet service, persistence, network concurrency, event store, replay product or demo reset is implemented. Callers retain the latest state and may archive immutable prior snapshots themselves; reusing an old state branches local computation and is not server-side duplicate-request protection. Arbitrarily corrupted caller objects are not a validated import format.

No M4/M5/M6 financial actions, Charlie variant, UI or cloud deployment. Computer strategy remains deterministic/non-optimal, and Math.random is only a simulation adapter. Public projection is a correctness boundary, not security against the process owner. Browser/E2E is NOT APPLICABLE; clean-machine npm ci reproduction and cross-platform portability are NOT RUN. No new dependency was installed for M3.

Next action: a **genuinely new Codex session**, following the [findings-first review handoff](docs/STATE.md#mandatory-m3-fresh-session-review-handoff), reruns the full harness and independently checks implementation, all mappings and M1/M2 preservation. It reports findings without edits unless separately authorized. This implementation session does not perform that review or mark M3 ACCEPTED. No merge, release, deployment or M4 start.

## Documentation

[RULES](docs/RULES.md) defines house rules; [SPEC](docs/SPEC.md) defines milestones; [DESIGN](docs/DESIGN.md) records the approved architecture; [PLAN](docs/PLAN.md) tracks task checkpoints; [STATE](docs/STATE.md) records current truth and review mappings; [DEVELOPMENT_LOG](docs/DEVELOPMENT_LOG.md) preserves timestamped evidence; [LAB_MANUAL](docs/LAB_MANUAL.md) explains concepts and regression failure cases. [UX_UI](docs/UX_UI.md) remains forward M7 design. [AGENTS](AGENTS.md) and [SKILL](SKILL.md) govern repository work. No repository license has been selected.
