# Casino Blackjack

A headless TypeScript Blackjack portfolio project with deterministic tests, explicit state transitions and reproducible execution evidence.

**Simulation credits only: no real money, purchases, deposits, withdrawals, transfers or redemption.** M1, M2 and M3 are ACCEPTED. The user explicitly accepted M3 at `cca40d2bed3b3964a9bfb47329d49bb553fe610e` after M3-T06 review repair 2; no unrecorded post-repair independent-review result is claimed. M4 advanced actions are IMPLEMENTED and mechanically VERIFIED. **M4 is NOT ACCEPTED; its independent fresh-session review is NOT RUN.** See [STATE](docs/STATE.md) for evidence and the executable 60-case mapping.

There is no UI, interactive CLI, network multiplayer or deployment. Insurance, Even Money, side bets, Bet Behind and Charlie remain unimplemented. This local portfolio library makes no production casino or gambling-certification claim.

## Implemented behaviour

- Seven stable EMPTY/HUMAN/COMPUTER seats, zero or one HUMAN, with sit-out configuration before betting opens. Each seat retains its session bankroll across controller changes and leaving/rejoining.
- Starting balance: **2000 integer half-credit units = 1000 credits**. Original main wagers: **20..2000 units**, even increments (10..1000 whole credits). No floating-point financial amounts or automatic replenishment.
- OPEN betting permits explicit wager placement/change/cancellation. Closing freezes funded participants. Computers receive no automatic bets. Reserved funds and pending returns cannot fund another action; exact available funds suffice.
- Shared six-deck shoe/dealer, ascending initial deal passes and immediate Ace/ten-value peek. No Insurance window. Every hand for one seat finishes decisions before the next seat acts.
- HUMAN Hit/Stand plus **Double**, **Double After Split**, **Split**, **Re-split** and **Late Surrender**. Stable round-local hand IDs identify the current hand and each settling leaf.
- Double requires two cards, total below 21, first decision, no Split-Aces restriction and matching available funds. It reserves exactly the existing stake, doubles settling exposure, draws exactly one card to that hand and ends decisions. No Double-for-less; original main-bet maximum does not cap doubled exposure.
- Split requires a first-decision pair of equal Blackjack value: A/A, identical 2..9, or any 10/J/Q/K combination. It reserves one matching stake and replaces the parent with two ordered children. First child receives its added card and is fully played before the second receives its added card. Advancing a finished hand may therefore deal the next child's required card in the same command.
- Non-Ace re-split preserves depth-first order, with at most four leaves per original seat. Completed/busted leaves still count. Split Aces can split once: each of two children receives exactly one additional card, then no Hit/Double/Surrender/re-split. Split A+K is ordinary 21, never Natural.
- Late Surrender requires an original, unsplit, non-Natural two-card hand before its first decision and after dealer Natural has been excluded. Gross return is exactly half the original stake, without another reserve or draw.
- Computer policy remains deliberately simple and non-optimal: total <17 -> HIT; total >=17 -> STAND. Computers never choose advanced actions. The shared dealer follows S17 once, drawing only when an ordinary result requires comparison.
- Each leaf settles independently: ordinary win gross=2*stake; original Natural gross=(stake/2)*5; push=stake; surrender=stake/2; loss/bust=0. Doubled leaves use their full stake. Parents never settle. All returns stay pending until one table-wide commit.
- Records identify round, seat, hand, stake, outcome, gross, net and status. Commit validates per-seat leaf exposure against actual reservation. Repeated settlement rejects unchanged.
- Required-draw integrity failure retires the shoe, preserves diagnostics and invalidates normal results. Whole-round VOID refunds every actual reservation, including accepted Double/Split/re-split exposure, exactly once. Rejected hypothetical funding is never refunded.
- Healthy shoes persist. Crossing cut position 219..249 defers replacement until the next explicit funded deal; no mid-round reshuffle or automatic replay.
- Public multi-hand projection exposes rank/suit only, hides the hole card during PLAYER_TURN/INTEGRITY_ERROR and excludes physical IDs, shoe order, cut position and internal lineage cards.

## M4 API and flow

Import commands from `src/domain/advancedGame.ts`. Retain every returned `state`; `ok=false` returns the original state and an error. An accepted command (`ok=true`) can still encounter required-draw integrity failure. No package build or interactive application exists.

| API | Purpose |
| --- | --- |
| `createAdvancedGame(shoeId, random)` | Create session, bankrolls, empty table and shoe |
| `configureAdvancedSeats(state, updates)` | Configure during CONFIGURING |
| `openAdvancedBetting(state)` | Lock seats and open numbered betting cycle |
| `setAdvancedWager(state, seatNumber, stakeUnits)` | Place/change original wager while OPEN |
| `cancelAdvancedWager(state, seatNumber)` | Release an OPEN wager |
| `closeAdvancedBetting(state, replacementShoeId, random)` | Freeze funded participants and deal |
| `hitAdvancedHand` / `standAdvancedHand` / `doubleAdvancedHand` / `splitAdvancedHand` / `surrenderAdvancedHand` | Commands taking state, current HUMAN seat number and current hand ID |
| `advanceAdvancedTable(state)` | Run computers/dealer until HUMAN input or terminal gameplay |
| `resolveAdvancedDealer(state)` | Resolve an existing DEALER_TURN |
| `getAdvancedResults(state)` | Read known pending or finalized per-leaf records |
| `settleAdvancedWagers(state)` | Commit after gameplay ROUND_COMPLETE |
| `voidAdvancedRound(state)` | Refund after genuine INTEGRITY_ERROR |
| `prepareNextAdvancedRound(state)` | After COMMITTED/VOID, return to CONFIGURING |

Flow: configure -> open -> explicitly fund participants -> close/deal -> human/automated decisions -> settle (or VOID on integrity failure) -> prepare next round. Gameplay ROUND_COMPLETE does not itself release funds; financial state stays CLOSED until commit.

Use `getPublicAdvancedView(state)` from `advancedPublicView.ts` for public card information. Never serialize internal state as a player view. Accepted M1 `game.ts`, M2 `tableGame.ts` and M3 `bettingGame.ts` APIs remain unchanged regression-protected primitives; bypassing M4 orchestration bypasses its advanced financial contract.

## Verification

Use Node 24 (>=24.19.0), npm and Windows PowerShell 5.1:

```powershell
npm.cmd ci
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The harness runs typecheck, lint and all unit/integration suites, checking failure exits. Its historical final label says `M1 engineering verification`; discovery includes every milestone. Latest executed full suite: **30 files / 476 tests**. Separately rerun original suites: M1 **12/155**, M2 **6/78**, M3 **5/72**, all PASS. M4 adds **7/171**, including all **60 executable mapped cases** and a mapping-completeness assertion. Original M1-M3 source/tests/helpers/harness/dependency paths remain unchanged; no assertions were weakened.

## Limits and review status

Amounts are safe integer half-credit units. This in-memory API has no authentication, database, persistence, wallet, event store, concurrent network transaction protection, replay product or reset API. Callers must use the latest returned state; old snapshots can branch local computation. Arbitrarily corrupted caller objects are not a validated import format. Public projection is a correctness boundary, not security against the process owner. Math.random is only a simulation adapter.

M5+ functionality, UI/network/real money and deployment remain absent. Browser/E2E is NOT APPLICABLE (no UI). Separate clean-machine npm ci reproduction and cross-platform portability are NOT RUN. No dependencies were added.

Next action: a **genuinely new Codex conversation** follows the [findings-first M4 handoff](docs/STATE.md#mandatory-m4-fresh-session-review-handoff), independently inspects requirements/diff, reruns the harness and preserves M1/M2/M3. It reports findings first and makes no edits without separate authorization. This implementation session stops after T07 publication; M4 remains NOT ACCEPTED and M5 NOT STARTED.

## Documentation

[RULES](docs/RULES.md), [SPEC](docs/SPEC.md), [DESIGN](docs/DESIGN.md), [PLAN](docs/PLAN.md), [STATE](docs/STATE.md), [DEVELOPMENT_LOG](docs/DEVELOPMENT_LOG.md) and [LAB_MANUAL](docs/LAB_MANUAL.md) hold rules, scope, architecture, checkpoints, evidence and learning notes. [UX_UI](docs/UX_UI.md) remains forward M7 design. [AGENTS](AGENTS.md) and [SKILL](SKILL.md) govern work. No repository license has been selected.
